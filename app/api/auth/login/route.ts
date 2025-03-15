// safetyfirst/app/api/auth/login/route.ts
// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        details: true // Include the UserDetails to get role information
      }
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check if we have a password-based authentication method
    // Note: Based on your schema, you might need to store password in another table
    // or use a different field to check authentication
    if (!user.authMethod || user.authMethod !== "password") {
      return NextResponse.json({ message: "This account doesn't use password login" }, { status: 401 })
    }

    // This part assumes you have the password stored somewhere. 
    // Since your shared schema doesn't show a password field,
    // you might need to adapt this part to your actual authentication storage.
    const storedPassword = ""; // You need to retrieve this from wherever you store it
    const passwordMatch = await bcrypt.compare(password, storedPassword)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create JWT token with user ID and role from details
    const role = user.details?.role || "USER"
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    )

    // Set cookie - using the non-Promise version
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from strict to lax for better cross-site linking
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Return user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: role
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}
