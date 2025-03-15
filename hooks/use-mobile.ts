// safetyfirst/hooks/use-mobile.ts
"use client"

// Re-export the useMobile hook from the mobile-provider
export { useMobile } from "@/components/mobile-provider"

export function useIsMobile() {
    // Example implementation
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }
  
