// safetyfirst/app/api/user/onboarding/route.ts
// app/api/user/onboarding/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { updateUserServerMetadata, updateUserClientReadOnlyMetadata } from "@/lib/user-metadata"

export async function POST(request: Request) {
  try {
    // Get the session token
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("auth-session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(sessionToken, process.env.STACK_SECRET_SERVER_KEY ?? "") as { sub: string }
    const userId = decoded.sub

    // Get the request body
    const { safetyTraining, jobTitle, company } = await request.json()

    // Update server metadata
    await updateUserServerMetadata(userId, {
      safetyTrainingCompleted: String(Object.values(safetyTraining).some(Boolean)),
      onboardingCompleted: String(true),
    })

    // Update client read-only metadata
    await updateUserClientReadOnlyMetadata(userId, {
      jobTitle,
      companyName: company,
      accountStatus: "active",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user metadata:", error)
    return NextResponse.json({ error: "Failed to update user metadata" }, { status: 500 })
  }
}


