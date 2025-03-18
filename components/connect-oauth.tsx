// safetyfirst/components/connect-oauth.tsx
// /components/connect-oauth.tsx
"use client"

import { useState } from "react"
import { useUser } from "@stackframe/stack"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type OAuthProvider, getProviderName, getProviderServices } from "@/lib/oauth-utils"
import { CheckCircle } from "lucide-react"

interface ConnectOAuthProps {
  provider: OAuthProvider
  scopes?: string[]
  onConnect?: () => void
  onDisconnect?: () => void
}

export function ConnectOAuth({ provider, scopes, onConnect, onDisconnect }: Readonly<ConnectOAuthProps>) {
  const user = useUser()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  // Handle the case when `user` might be null
  if (!user) {
    return <div>Loading...</div>
  }

  // Try to get the connected account, but don't redirect automatically
  const connectedAccount = 'connectedAccounts' in user && (user.connectedAccounts as { provider: OAuthProvider; scopes: string[] }[]).find(account => account.provider === provider && (!scopes || scopes.every(scope => account.scopes.includes(scope))))

  const isConnected = !!connectedAccount

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // Redirecting to the OAuth connect endpoint for authentication
      window.location.href = `/api/oauth/connect?provider=${provider}&scopes=${scopes?.join(',') ?? ''}`
      // After returning from the OAuth provider
      if (onConnect) onConnect()
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!connectedAccount) return

    setIsDisconnecting(true)
    try {
      // Manually clear session or token for disconnection
      // Example: remove the access token from storage or clear user session
      localStorage.removeItem(`oauth_token_${provider}`) // Customize this based on your storage strategy
      sessionStorage.removeItem(`oauth_token_${provider}`) // If you're using sessionStorage

      // Optionally: If there's an API that logs out the user from the OAuth provider, make a request here
      // await user.logoutFromOAuth(provider); // Or use a method from your library

      if (onDisconnect) onDisconnect()
    } catch (error) {
      console.error(`Error disconnecting from ${provider}:`, error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  const providerName = getProviderName(provider)
  const services = getProviderServices(provider)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <img src={`/icons/${provider}.svg`} alt={`${providerName} logo`} className="w-6 h-6 mr-2" />
          {providerName}
          {isConnected && <CheckCircle className="w-5 h-5 ml-2 text-green-500" />}
        </CardTitle>
        <CardDescription>
          {isConnected
            ? `Your ${providerName} account is connected`
            : `Connect your ${providerName} account to enable additional features`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p className="font-medium mb-2">Enables:</p>
          <ul className="list-disc pl-5 space-y-1">
          {services.map((service: string) => (
           <li key={service} className={isConnected ? "text-foreground" : "text-muted-foreground"}>
          {service}
           </li>
           ))}
          </ul>

        </div>
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button variant="outline" onClick={handleDisconnect} disabled={isDisconnecting} className="w-full">
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            {isConnecting ? "Connecting..." : `Connect ${providerName}`}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

