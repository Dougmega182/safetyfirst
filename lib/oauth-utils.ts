import { stackServerApp } from "./stack-auth"

// Define the OAuth providers we support
export type OAuthProvider = "google" | "microsoft" | "github"

// Define the scopes we need for each provider
export const providerScopes: Record<OAuthProvider, string[]> = {
  google: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/drive.file", // For document storage
    "https://www.googleapis.com/auth/calendar", // For scheduling
  ],
  microsoft: ["user.read", "files.readwrite", "calendars.readwrite"],
  github: ["read:user", "user:email", "repo"],
}

// Configure Stack Auth to request these scopes during sign-in
export function configureOAuthScopes() {
  stackServerApp.oauthScopesOnSignIn = {
    google: providerScopes.google,
    microsoft: providerScopes.microsoft,
    github: providerScopes.github,
  }
}

// Helper function to get a user-friendly provider name
export function getProviderName(provider: OAuthProvider): string {
  const names: Record<OAuthProvider, string> = {
    google: "Google",
    microsoft: "Microsoft",
    github: "GitHub",
  }
  return names[provider] || provider
}

// Helper function to get provider icon
export function getProviderIcon(provider: OAuthProvider): string {
  const icons: Record<OAuthProvider, string> = {
    google: "/icons/google.svg",
    microsoft: "/icons/microsoft.svg",
    github: "/icons/github.svg",
  }
  return icons[provider] || ""
}

// Helper to determine what services are available with each provider
export function getProviderServices(provider: OAuthProvider): string[] {
  const services: Record<OAuthProvider, string[]> = {
    google: ["Document Storage", "Calendar Integration", "Email Notifications"],
    microsoft: ["OneDrive Integration", "Outlook Calendar", "Teams Notifications"],
    github: ["Code Repository Access", "Issue Tracking"],
  }
  return services[provider] || []
}

