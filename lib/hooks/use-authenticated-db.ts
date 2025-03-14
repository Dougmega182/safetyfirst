"use client"

import { useState, useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { getClientAuthenticatedNeonDb } from "@/lib/db/neon-rls"

export function useAuthenticatedDb<T = any>(query: string, params: any[] = [], dependencies: any[] = []) {
  const user = useUser()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Get the auth token
        const { accessToken } = await user.getAuthJson()

        // Get the authenticated database connection
        const sql = getClientAuthenticatedNeonDb(accessToken)

        // Execute the query
        const result = await sql(query, ...params)

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

