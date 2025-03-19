// safetyfirst/lib/stack-auth.ts
import { StackClientApp, StackServerApp } from "@stackframe/stack";

// Client-side Stack configuration
export function getStackClientConfig() {
  return new StackClientApp({
    tokenStore: "nextjs-cookie", // Token storage for the client-side
    baseUrl: "https://api.stack-auth.com", // Stack Auth API URL
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID ?? "",
    publishableClientKey: process.env.NEXT_PUBLIC_STACK_CLIENT_KEY ?? "",
    urls: {
      home: "/",
    },
  });
}

// Server-side Stack configuration (with elevated permissions)
export const stackServerApp = new StackServerApp({
  tokenStore: "cookie", // Ensure token store is defined for server-side use
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY ?? "", // Secret key for server use
});

// Hook for client components to access Stack Auth
export function useStackAuth() {
  return getStackClientConfig();
}

