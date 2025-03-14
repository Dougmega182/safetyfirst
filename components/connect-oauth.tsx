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

export function ConnectOAuth({ provider, scopes, onConnect, onDisconnect }: ConnectOAuthProps) {
  const user = useUser()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  // Try to get the connected account, but don't redirect automatically
  const connectedAccount = user.useConnectedAccount(provider, {
    redirectIfMissing: false,
    scopes,
  })

  const isConnected = !!connectedAccount

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // This will redirect to the OAuth provider
      await user.getConnectedAccount(provider, {
        or: "redirect",
        scopes,
      })
      // This code will only run after returning from the OAuth provider
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
      await connectedAccount.disconnect()
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
            {services.map((service, index) => (
              <li key={index} className={isConnected ? "text-foreground" : "text-muted-foreground"}>
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

