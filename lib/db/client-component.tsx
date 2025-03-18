// safetyfirst/lib/db/client-component.tsx
"use client"

import { useAuth } from "@/lib/use-auth"
import { useEffect, useState } from "react"
import { getClientAuthDb } from "./auth-db"

export function useAuthenticatedNeon<T>(query: string, dependencies: unknown[] = []) {
  const { user } = useAuth()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Get the token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-token="))
          ?.split("=")[1]

        if (!token) {
          throw new Error("No authentication token found")
        }

        // Get authenticated database connection
        const sql = getClientAuthDb(token)

        // Execute the query
        const result = await sql(query)

        setData(result as T[])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, user, ...dependencies])

  return { data, loading, error }
}

export function useJobSites() {
  return useAuthenticatedNeon("SELECT * FROM job_sites WHERE user_id = auth.uid() ORDER BY created_at DESC")
}

export function useWorkers() {
  return useAuthenticatedNeon(
    `SELECT * FROM workers 
     WHERE company_id IN (
       SELECT company_id FROM user_companies 
       WHERE user_id = auth.uid()
     )
     ORDER BY name ASC`,
  )
}

export function useSiteAttendance(siteId: string) {
  return useAuthenticatedNeon(
    `SELECT a.*, u.name, u.email 
     FROM attendances a
     JOIN users u ON a.user_id = u.id
     WHERE a.job_site_id = '${siteId}'
     ORDER BY a.sign_in_time DESC`,
    [siteId],
  )
}


