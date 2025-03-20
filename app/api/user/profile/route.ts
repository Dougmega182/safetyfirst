// safetyfirst/app/api/user/profile/route.ts
// app/api/user/profile/route.ts
import { NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth-server"
import { stackServerApp } from "@/lib/stack-auth"

export async function GET() {
  try {
    // Verify the user's token
    const verifiedUser = await verifyAuthToken()

    if (!verifiedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the full user profile from Stack Auth
    const user = await stackServerApp.getUser()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return the user profile with sensitive information removed
    return NextResponse.json({
      id: user.id,
      emailAddress: user.emailAddress,
      displayName: user.displayName,
      clientMetadata: user.clientMetadata,
      clientReadOnlyMetadata: user.clientReadOnlyMetadata,
      // Don't include serverMetadata for security
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


