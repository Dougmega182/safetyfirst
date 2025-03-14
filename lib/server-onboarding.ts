import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { stackServerApp } from "@/lib/stack-auth"
import { verify } from "jsonwebtoken"

// Paths that don't require onboarding
const EXEMPT_PATHS = [
  "/onboarding",
  "/auth/login",
  "/auth/register",
  "/auth/stack-login",
  "/auth/stack-register",
  "/auth/forgot-password",
]

export async function ensureOnboarded(currentPath: string) {
  // Skip if we're already on an exempt path
  if (EXEMPT_PATHS.some((path) => currentPath.startsWith(path))) {
    return true
  }

  try {
    // Get the session token
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("auth-session")?.value

    if (!sessionToken) {
      redirect("/auth/stack-login")
    }

    // Verify the token
    const decoded = verify(sessionToken, process.env.STACK_SECRET_SERVER_KEY || "") as { sub: string }
    const userId = decoded.sub

    // Get the user
    const user = await stackServerApp.getUser(userId)

    // Check if user is onboarded
    const isOnboarded = user.serverMetadata?.onboardingCompleted === true

    if (!isOnboarded) {
      redirect("/onboarding")
    }

    return true
  } catch (error) {
    console.error("Error checking onboarding status:", error)
    redirect("/auth/stack-login")
  }
}

