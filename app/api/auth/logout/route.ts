// safetyfirst/app/api/auth/logout/route.ts
// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { stackServerApp } from "@/lib/stack-auth";


export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("auth-session")?.value

    if (sessionToken) {
      // Invalidate the session with Stack Auth
      await stackServerApp.redirectToAfterSignOut({  })
    }

    // Clear the session cookie
    cookieStore.delete("auth-session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}


