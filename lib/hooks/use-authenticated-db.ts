// safetyfirst/lib/hooks/use-authenticated-db.ts
"use client"

import { useState, useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { getClientAuthenticatedNeonDb } from "@/lib/db/neon-rls.js"

export function useAuthenticatedDb<T = unknown>(query: string, params: (string | number | boolean)[] = [], dependencies: unknown[] = []) {
  const user = useUser()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Check if user exists and if user has the accessToken
        if (!user || !('getAccessToken' in user)) {
          throw new Error("User or accessToken is missing")
        }

        const accessToken = await (user as { getAccessToken: () => Promise<string> }).getAccessToken()

        // Ensure accessToken is not null
        if (!accessToken) {
          throw new Error("No access token found")
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

