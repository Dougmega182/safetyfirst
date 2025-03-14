"use client"

import { useUser } from "@stackframe/stack"

// Base API client for making authenticated requests
export function useApiClient() {
  const user = useUser()

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      // Get the auth tokens
      const { accessToken } = await user.getAuthJson()

      // Add the auth headers
      const headers = {
        ...options.headers,
        "Content-Type": "application/json",
        "x-stack-access-token": accessToken,
      }

      // Make the request
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle unauthorized responses
      if (response.status === 401) {
        // Redirect to login or refresh token
        window.location.href = "/auth/stack-login"
        return null
      }

      // Parse the response
      if (response.headers.get("content-type")?.includes("application/json")) {
        return await response.json()
      }

      return await response.text()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  return {
    get: (url: string, options?: RequestInit) => fetchWithAuth(url, { ...options, method: "GET" }),
    post: (url: string, data: any, options?: RequestInit) =>
      fetchWithAuth(url, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      }),
    put: (url: string, data: any, options?: RequestInit) =>
      fetchWithAuth(url, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (url: string, options?: RequestInit) => fetchWithAuth(url, { ...options, method: "DELETE" }),
  }
}

