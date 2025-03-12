"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, company?: string, position?: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
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

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to sign in")
      }

      const data = await response.json()
      setUser(data.user)

      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${data.user.name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      })
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

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to sign up")
      }

      const data = await response.json()
      setUser(data.user)

      toast({
        title: "Account created successfully",
        description: `Welcome, ${name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again with different credentials.",
      })
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
      router.push("/")
      toast({
        title: "Signed out successfully",
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

