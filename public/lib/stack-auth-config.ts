// safetyfirst/lib/stack-auth-config.ts
import { StackClientApp } from "@stackframe/stack"

// Initialize the Stack client app
export const stackClient = new StackClientApp({
  tokenStore: "nextjs-cookie", // Store the token in cookies (adjust as needed)
  baseUrl: "https://api.stack-auth.com", // Optional: specify the base URL if different
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID ?? "", // Your project ID
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_KEY ?? "", // Your publishable client key
  urls: {
    home: "/",
    // Add other URLs as required
  },
})

// Hook for accessing Stack Auth in client components
export function useStackAuth() {
  return stackClient
}

