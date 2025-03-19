// safetyfirst/lib/stack-auth-provider.tsx
"use client"

import { StackProvider } from "@stackframe/stack"
import { getStackClientConfig } from "./stack-auth"
import type { ReactNode } from "react"

export function StackAuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const stackClient = getStackClientConfig()

  return <StackProvider app={stackClient}>{children}</StackProvider>
}


