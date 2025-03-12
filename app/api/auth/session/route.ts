import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const token = cookies().get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const decoded = verify(token, process.env.JWT_SECRET || "fallback-secret") as { id: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        position: true,
      },
    })

    if (!user) {
      cookies().delete("auth-token")
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Session error:", error)
    cookies().delete("auth-token")
    return NextResponse.json({ user: null })
  }
}

