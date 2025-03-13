import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

// STACK AUTH API DETAILS
const STACK_AUTH_URL = process.env.STACK_AUTH_URL; // Add this to .env

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 🔹 Step 1: Authenticate with Stack Auth
    const stackAuthResponse = await fetch(`${STACK_AUTH_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!stackAuthResponse.ok) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const { user, token } = await stackAuthResponse.json(); // Get user & token from Stack Auth

    // 🔹 Step 2: Check if user exists locally, if not, create them
    let localUser = await prisma.user.findUnique({ where: { email } });

    if (!localUser) {
      localUser = await prisma.user.create({
        data: {
          id: user.id, // Use Stack Auth ID
          name: user.name,
          email: user.email,
          details: { create: { company: user.company, position: user.position, role: user.role } },
        },
      });
    }

    // 🔹 Step 3: Set authentication token
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ user: localUser });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 });
  }
}
