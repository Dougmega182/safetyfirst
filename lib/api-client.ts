// safetyfirst/lib/api-client.ts
"use client"

import { useState, useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { getClientAuthenticatedNeonDb } from "@/lib/db/neon-rls.js"

// Add this to lib/api-client.ts
export function useApiClient() {
  // Implementation
}
export function useAuthenticatedDb<T = unknown>(query: string, params: unknown[] = [], dependencies: unknown[] = []) {
  const user = useUser()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        if (!user) {
          throw new Error("User is not authenticated")
        }

        // Get the auth token
        const accessToken = (user as unknown as { getIdToken: () => Promise<string> }).getIdToken ? await (user as unknown as { getIdToken: () => Promise<string> }).getIdToken() : null

        if (!accessToken) {
          throw new Error("Access token is missing")
        }

        // Get the authenticated database connection
        const sql = getClientAuthenticatedNeonDb(accessToken)

        // Execute the query
        const result = await sql(query, params)

        setData(result as T)
        setError(null)
      } catch (err) {
        console.error("Error executing authenticated query:", err)
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, user, ...dependencies])

  return { data, loading, error }
}

