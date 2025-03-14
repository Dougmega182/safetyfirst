"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name?: string
  email: string
  role: "USER" | "ADMIN" | "CEO"
  company?: string
  position?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  token: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, company?: string, position?: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)

            // Get token from cookie
            const authToken = document.cookie
              .split("; ")
              .find((row) => row.startsWith("auth-token="))
              ?.split("=")[1]

            if (authToken) {
              setToken(authToken)
            }
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in")
      }

      setUser(data.user)

      // Get token from cookie after login
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      if (authToken) {
        setToken(authToken)
      }

      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${data.user.name || "User"}!`,
      })

      // Get the callback URL from the query parameters if available
      const urlParams = new URLSearchParams(window.location.search)
      const callbackUrl = urlParams.get("callbackUrl") || "/dashboard"

      // Force a hard navigation instead of client-side routing
      window.location.href = callbackUrl
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      })
      throw error // Re-throw the error so the login component can handle it
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string, company?: string, position?: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, company, position }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up")
      }

      setUser(data.user)

      // Get token from cookie after registration
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      if (authToken) {
        setToken(authToken)
      }

      toast({
        title: "Account created successfully",
        description: `Welcome, ${name}!`,
      })

      // Force a hard navigation instead of client-side routing
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again with different credentials.",
      })
      throw error // Re-throw the error so the signup component can handle it
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      setUser(null)
      setToken(null)

      // Force a hard navigation instead of client-side routing
      window.location.href = "/"

      toast({
        title: "Signed out successfully",
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  )
}

