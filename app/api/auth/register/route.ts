// safetyfirst/app/api/auth/register/route.ts
// app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create user and associated userDetails (role)
    const user = await prisma.user.create({
      data: {
        email,
        displayName: name,
        details: {
          create: {
            role: "USER", // Setting the role in userDetails
          },
        },
      },
      include: {
        details: true, // Include details relation
      },
    })

    // Create session token (you need to implement token generation logic)
    const token = "generated-token" // Example: use a JWT library
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // Set expiration time for 1 hour
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
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
        displayName: user.displayName,
        role: user.details?.role, // Access role from userDetails
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

