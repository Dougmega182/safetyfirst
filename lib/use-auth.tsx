// safetyfirst/lib/use-auth.tsx
"use client"

import { useContext } from "react"
import { AuthContext } from "./auth-provider.jsx"

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}


