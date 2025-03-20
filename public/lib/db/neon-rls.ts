// safetyfirst/lib/db/neon-rls.ts
import { neon } from "@neondatabase/serverless"
import { stackServerApp } from "@/public/lib/stack-auth.js"


export function getClientAuthenticatedNeonDb(accessToken: string) {
  const dbUrl = process.env.DATABASE_AUTHENTICATED_URL

  if (!dbUrl) {
    throw new Error("Database URL is not defined in the environment variables")
  }

  // Return the authenticated connection for the client
  return neon(dbUrl, {
    authToken: async () => accessToken,
  })
}

// Function to get the authenticated database connection for server components
export async function getAuthenticatedNeonDb(userId?: string) {
  try {
    // Step 1: Fetch the user based on the provided userId or the current session
    const user = userId 
      ? await stackServerApp.getUser({ or: "throw" })  // Remove userId from options
      : await stackServerApp.getUser()

    if (!user) {
      throw new Error("No authenticated user found")
    }

    // Step 2: Retrieve the access token from the user or session
    const accessToken = await getAccessToken(user)

    if (!accessToken) {
      throw new Error("No access token found")
    }

    // Step 3: Create and return the authenticated Neon DB connection using the access token
    return neon(process.env.DATABASE_AUTHENTICATED_URL!, {
      authToken: async () => accessToken,
    })
  } catch (error) {
    console.error("Error getting authenticated database connection:", error)
    throw new Error("Failed to establish authenticated database connection")
  }
}

// Helper function to extract the access token from the user
interface AuthUser {
  id: string;
  accessToken?: string;
  session?: {
    accessToken?: string;
  };
}

async function getAccessToken(user: AuthUser) {
  // Option 1: Check if the accessToken exists directly in the user object (adjust based on your implementation)
  if (user?.accessToken) {
    return user.accessToken
  }

  // Option 2: If accessToken is stored in the session or another property
  // Make sure to adjust this based on how your user data is structured
  if (user?.session?.accessToken) {
    return user.session.accessToken
  }

  // Option 3: If the token is generated through a different method, implement it here
  // For example, if you need to request the token from an API or refresh token mechanism
  const token = await getTokenFromApi(user.id)
  return token
}

// Placeholder function for token retrieval from an external API
async function getTokenFromApi(userId: string) {
  // Logic to request the token from an API or another service
  // This will depend on how your authentication service is set up
  // Example:
  const response = await fetch(`/api/get-token?userId=${userId}`)
  const data = await response.json()
  return data.accessToken
}

// Add to lib/db/neon-rls.ts
export function getAdminNeonDb() {
  // Implementation
}