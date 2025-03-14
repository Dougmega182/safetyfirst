import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { stackServer } from "@/lib/stack-auth"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    try {
      const existingUser = await stackServer.getUserByEmail(email)
      if (existingUser) {
        return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
      }
    } catch (error) {
      // If error is "user not found", continue with registration
      // Otherwise, throw the error
      if ((error as any).code !== "user_not_found") {
        throw error
      }
    }

    // Create user with Stack Auth
    const user = await stackServer.createUser({
      name,
      email,
      password,
      role: "USER",
    })

    // Create session token
    const session = await stackServer.createSession({
      userId: user.id,
      expiresIn: "7d",
    })

    // Set cookie with session token
    const cookieStore = await cookies()
    cookieStore.set("auth-session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Return user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "USER",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

