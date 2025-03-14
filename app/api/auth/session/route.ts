import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { stackServer } from "@/lib/stack-auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("auth-session")?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }

    // Verify the session with Stack Auth
    const session = await stackServer.verifySession({
      token: sessionToken,
    })

    if (!session || !session.userId) {
      return NextResponse.json({ user: null })
    }

    // Get the user data
    const user = await stackServer.getUser(session.userId)

    if (!user) {
      return NextResponse.json({ user: null })
    }

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
    console.error("Session error:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}

