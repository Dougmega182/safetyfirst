import { StackClientApp } from "@stackframe/stack"

// Initialize the Stack client app
export const stackClient = new StackClientApp({
  clientId: process.env.NEXT_PUBLIC_STACK_CLIENT_ID || "",
  // Optional: You can customize the appearance
  appearance: {
    theme: "light",
    accentColor: "#3b82f6", // Blue to match your existing theme
    logo: "/logo.png", // Replace with your logo path
  },
})

// Hook for accessing Stack Auth in client components
export function useStackAuth() {
  return stackClient
}

