'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Import MobileProvider dynamically with no SSR
const MobileProviderComponent = dynamic(
  () => import("@/components/mobile-provider").then(mod => mod.MobileProvider),
  { ssr: false }
)

export function MobileProviderWrapper({ children }: { children: React.ReactNode }) {
  return <MobileProviderComponent>{children}</MobileProviderComponent>
}
