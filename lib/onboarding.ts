"use client"

import { useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { useRouter, usePathname } from "next/navigation"

// Paths that don't require onboarding
const EXEMPT_PATHS = [
  "/onboarding",
  "/auth/login",
  "/auth/register",
  "/auth/stack-login",
  "/auth/stack-register",
  "/auth/forgot-password",
]

export function useRequireOnboarding() {
  const user = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip if we're already on an exempt path
    if (EXEMPT_PATHS.some((path) => pathname?.startsWith(path))) {
      return
    }

    // Check if user is onboarded
    const isOnboarded = user.clientMetadata?.onboarded === true

    if (!isOnboarded) {
      router.push("/onboarding")
    }
  }, [user, router, pathname])

  return { isOnboarded: user.clientMetadata?.onboarded === true }
}

