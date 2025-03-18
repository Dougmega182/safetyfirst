// safetyfirst/components/mobile-provider-wrapper.tsx
"use client"

import dynamic from "next/dynamic"
import type React from "react"

// Import MobileProvider dynamically with no SSR
const MobileProviderComponent = dynamic<{ children: React.ReactNode }>(
  () => import("../components/mobile-provider").then((mod) => mod.MobileProvider),
  { ssr: false },
)

export function MobileProviderWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return <MobileProviderComponent>{children}</MobileProviderComponent>
}

export function MobileProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // MobileProvider implementation
  return <>{children}</>;
}


