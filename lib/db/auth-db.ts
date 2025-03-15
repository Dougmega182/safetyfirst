// safetyfirst/lib/db/auth-db.ts
import { neon } from "@neondatabase/serverless"
import { verify } from "jsonwebtoken"

// Server-side authenticated database connection
export async function getServerAuthDb(token: string) {
  try {
    // Verify the token to ensure it's valid
    verify(token, process.env.JWT_SECRET || "fallback-secret")

    // Create a connection with the token as auth
    const sql = neon(process.env.DATABASE_AUTHENTICATED_URL!, {
      authToken: () => token,
    })

    return sql
  } catch (error) {
    console.error("Invalid token for database connection:", error)
    throw new Error("Authentication failed for database connection")
  }
}

// Client-side authenticated database connection
export function getClientAuthDb(token: string) {
  try {
    // Create a connection with the token as auth
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL!, {
      authToken: () => token,
    })

    return sql
  } catch (error) {
    console.error("Error creating client database connection:", error)
    throw new Error("Failed to create client database connection")
  }
}


