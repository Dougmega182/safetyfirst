// safetyfirst/components/mobile-provider.tsx
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type MobileContextType = {
  isMobile: boolean
}

const MobileContext = createContext<MobileContextType>({ isMobile: false })

export const useMobile = () => useContext(MobileContext)

interface MobileProviderProps {
  children: ReactNode
}

export function MobileProvider({ children }: MobileProviderProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Adjust breakpoint as needed
    }

    // Set initial value
    handleResize()

    // Listen for window resize events
    window.addEventListener("resize", handleResize)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Only render children after component has mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return <MobileContext.Provider value={{ isMobile }}>{children}</MobileContext.Provider>
}

// This is a HOC (Higher Order Component) to wrap components that need mobile detection
export function withMobile<P extends object>(Component: React.ComponentType<P & { isMobile: boolean }>) {
  return function WithMobileComponent(props: P) {
    const { isMobile } = useMobile()
    return <Component {...props} isMobile={isMobile} />
  }
}


