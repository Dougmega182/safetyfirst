// safetyfirst/lib/oauth-utils.ts
// oauth-utils.ts

import { useUser } from '@stackframe/stack'; // Importing Stack's user hook
// Add this export to lib/oauth-utils.ts
export const providerScopes = {
  google: ['https://www.googleapis.com/auth/drive.readonly'],
  // Add other providers as needed
};
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
export function useConnectedAccount(provider: OAuthProvider, scopes: string[] = []): { provider: OAuthProvider; scopes: string[]; connected: boolean } {
  const user = useUser({ or: 'redirect' });
    const account = useConnectedAccount(user, provider, scopes);
  
  function useConnectedAccount(user: ReturnType<typeof useUser>, provider: OAuthProvider, scopes: string[]): { provider: OAuthProvider; scopes: string[]; connected: boolean } {
    // Implement the logic to handle connected accounts
    // This is a placeholder implementation
    return {
      provider,
      scopes,
      connected: true,
    };
  }

  return account;
}

