// safetyfirst/app/api/documents/google-drive/route.ts
// app/api/cdocumentsron/google-drive/route.ts
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

    // Get the user from Stack Auth
    const user = await stackServerApp.getUser()

    // Get the connected Google account
    interface Account {
      provider: string;
      getAccessToken: () => Promise<{ accessToken: string }>;
    }

    interface User {
      accounts: Account[];
    }

    const googleAccount = (user as unknown as User)?.accounts?.find(account => account.provider === "google")

    if (!googleAccount) {
      return NextResponse.json(
        { error: "Google account not connected", connectUrl: "/account/connections" },
        { status: 403 },
      )
    }

    // Get the access token
    const { accessToken } = await googleAccount.getAccessToken()

    // Use the access token to fetch files from Google Drive
    const driveResponse = await fetch("https://www.googleapis.com/drive/v3/files?pageSize=10", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!driveResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch Google Drive files" }, { status: driveResponse.status })
    }

    const driveData = await driveResponse.json()

    return NextResponse.json(driveData)
  } catch (error) {
    console.error("Error accessing Google Drive:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


