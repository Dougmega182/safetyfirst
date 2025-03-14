import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// STACK AUTH API DETAILS
const STACK_AUTH_URL = process.env.STACK_AUTH_URL;

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

    const { user, token } = await stackAuthResponse.json(); // Stack Auth returns user data

    // 🔹 Step 2: Sync user in local database
    let localUser = await prisma.user.upsert({
      where: { email },
      update: {
        id: user.id, // Ensure ID matches Stack Auth
        displayName: user.displayName,
        avatar: user.avatar,
        lastActive: new Date(), // Update last active timestamp
        authMethod: user.authMethod,
      },
      create: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        lastActive: new Date(),
        authMethod: user.authMethod,
        signedUpAt: new Date(user.signedUpAt),
        details: { create: { company: user.company, position: user.position } },
      },
    });

    // 🔹 Step 3: Store Stack Auth token in cookie
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
