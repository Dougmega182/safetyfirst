// safetyfirst/app/account/connections/page.tsx
"use client"
//connections page.tsx
import { useUser } from "@stackframe/stack"
import { ConnectOAuth } from "@/components/connect-oauth"
import { type OAuthProvider } from "@/lib/oauth-utils"
import { useRequireOnboarding } from "@/lib/onboarding"

export const providerScopes = {
  google: ["profile", "email"],
  microsoft: ["user.read"],
  github: ["read:user", "user:email"],
}

export default function ConnectionsPage() {
  // Ensure user has completed onboarding
  useRequireOnboarding()

  // Ensure user is redirected if not authenticated
  useUser({ or: "redirect" })

  // List of providers we support
  const providers: OAuthProvider[] = ["google", "microsoft", "github"]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Connected Accounts</h1>
      <p className="text-muted-foreground mb-8">Connect your accounts to enable additional features and integrations</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ConnectOAuth
            key={provider}
            provider={provider}
            scopes={providerScopes[provider]}
            onConnect={() => {
              // You could trigger an event or update state here
              console.log(`Connected to ${provider}`)
            }}
            onDisconnect={() => {
              // You could trigger an event or update state here
              console.log(`Disconnected from ${provider}`)
            }}
          />
        ))}
      </div>
    </div>
  )
}


