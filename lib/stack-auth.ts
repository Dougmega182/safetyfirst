import { StackClientApp, StackServerApp } from "@stackframe/stack"

// Client-side Stack configuration
export function getStackClientConfig() {
  return new StackClientApp({
    clientId: process.env.NEXT_PUBLIC_STACK_CLIENT_ID || "",
    // Customize appearance to match your brand
    appearance: {
      theme: "light",
      accentColor: "#3b82f6", // Blue to match your existing theme
      logo: "/logo.png", // Replace with your logo path
      brandName: "SafetyFirst",
    },
  })
}

// Server-side Stack configuration (with elevated permissions)
// This should ONLY be used in server components or API routes
export const stackServerApp = new StackServerApp({
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY || "",
})

// Hook for client components to access Stack Auth
export function useStackAuth() {
  return getStackClientConfig()
}

