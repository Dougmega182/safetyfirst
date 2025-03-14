import { NextResponse } from "next/server"
import { stackServerApp } from "@/lib/stack-auth"

export async function GET() {
  try {
    // This uses the server-side Stack app with elevated permissions
    const users = await stackServerApp.listUsers()

    // Only return non-sensitive information
    const safeUsers = users.map((user) => ({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      createdAt: user.createdAt,
    }))

    return NextResponse.json({ users: safeUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

