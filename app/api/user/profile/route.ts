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
    const user = await stackServerApp.getUser(verifiedUser.id)

    // Return the user profile with sensitive information removed
    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      clientMetadata: user.clientMetadata,
      clientReadOnlyMetadata: user.clientReadOnlyMetadata,
      // Don't include serverMetadata for security
      connectedAccounts: user.connectedAccounts.map((account) => ({
        provider: account.provider,
        connected: true,
      })),
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

