import { neon } from "@neondatabase/serverless"
import { stackServerApp } from "@/lib/stack-auth"

// Function to get an authenticated database connection for server components
export async function getAuthenticatedNeonDb(userId?: string) {
  try {
    // If userId is provided, get that specific user
    // Otherwise, get the current user from the session
    const user = userId ? await stackServerApp.getUser(userId) : await stackServerApp.getUser()

    if (!user) {
      throw new Error("No authenticated user found")
    }

    // Get the JWT token for the user
    const { accessToken } = await user.getAuthJson()

    // Create and return the authenticated database connection
    return neon(process.env.DATABASE_AUTHENTICATED_URL!, {
      authToken: async () => accessToken,
    })
  } catch (error) {
    console.error("Error getting authenticated database connection:", error)
    throw new Error("Failed to establish authenticated database connection")
  }
}

// Function to get an authenticated database connection for client components
export function getClientAuthenticatedNeonDb(accessToken: string) {
  if (!accessToken) {
    throw new Error("No access token provided")
  }

  return neon(process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL!, {
    authToken: async () => accessToken,
  })
}

// Function to get an admin database connection (for migrations, etc.)
export function getAdminNeonDb() {
  return neon(process.env.DATABASE_URL!)
}

