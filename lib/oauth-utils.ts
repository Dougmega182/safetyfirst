// safetyfirst/lib/oauth-utils.ts
// oauth-utils.ts

import { useUser } from '@stackframe/stack'; // Importing Stack's user hook

// Define provider type
export type OAuthProvider = 'google' | 'microsoft' | 'github';

// Helper function to retrieve OAuth scopes for a provider
export function getOAuthScopes(provider: OAuthProvider): string[] {
  const oauthScopesOnSignIn: Record<OAuthProvider, string[]> = {
    google: ['https://www.googleapis.com/auth/drive.readonly'],
    microsoft: ['https://graph.microsoft.com/.default'],
    github: ['repo', 'user'],
    
  };

  return oauthScopesOnSignIn[provider] || [];
}
export function getProviderName(provider: OAuthProvider): string {
  const names: Record<OAuthProvider, string> = {
    google: "Google",
    github: "GitHub",
    microsoft: "Microsoft",
  };
  return names[provider] || "Unknown";
}

export function getProviderServices(provider: OAuthProvider): string[] {
  const services: Record<OAuthProvider, string[]> = {
    google: ["Google Drive", "Gmail", "YouTube"],
    github: ["Repositories", "Issues", "Pull Requests"],
    microsoft: ["OneDrive", "Outlook", "Teams"],
  };
  return services[provider] || [];
}

// Hook to handle connected OAuth accounts
export function useConnectedAccount(provider: OAuthProvider, scopes: string[] = []): any {
  const user = useUser({ or: 'redirect' });
  const account = user.useConnectedAccount(provider, { or: 'redirect', scopes });

  return account;
}

