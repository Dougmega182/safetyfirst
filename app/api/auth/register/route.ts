import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// STACK AUTH API DETAILS
const STACK_AUTH_URL = process.env.STACK_AUTH_URL;

export async function POST(request: Request) {
  try {
    const { name, email, password, company, position } = await request.json();

    // 🔹 Step 1: Register user in Stack Auth
    const stackAuthResponse = await fetch(`${STACK_AUTH_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!stackAuthResponse.ok) {
      const errorData = await stackAuthResponse.json();
      return NextResponse.json({ message: errorData.message }, { status: 400 });
    }

    const { user, token } = await stackAuthResponse.json(); // Get Stack Auth user details

    // 🔹 Step 2: Save user in local database
    const localUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.displayName,
        email: user.email,
        avatar: user.avatar,
        lastActive: new Date(),
        authMethod: user.authMethod,
        signedUpAt: new Date(user.signedUpAt),
        details: { create: { company, position, role: "USER" } },
      },
    });

    // 🔹 Step 3: Store authentication token
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
    console.error("Registration error:", error);
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 });
  }
}
