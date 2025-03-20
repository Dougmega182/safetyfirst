// safetyfirst/app/auth/debug/page.tsx
// /app/auth/debug/page.tsx 
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"

export default function DebugPage() {
  const { user, loading } = useAuth()
  interface SessionData {
    userId: string;
    expires: string;
    [key: string]: unknown;
  }

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [cookies, setCookies] = useState<string>("")

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie)
  }, [])

  const checkSession = async () => {
    setSessionLoading(true)
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      setSessionData(data)
    } catch (error) {
      console.error("Error checking session:", error)
      setSessionData({ userId: "", expires: "", error: "Failed to fetch session data" })
    } finally {
      setSessionLoading(false)
    }
  }

  const goToDashboard = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Auth Context State</CardTitle>
            <CardDescription>Current state from useAuth hook</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Loading:</strong> {loading ? "True" : "False"}
              </div>
              <div>
                <strong>Authenticated:</strong> {user ? "Yes" : "No"}
              </div>
              {user && <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(user, null, 2)}</pre>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session API Response</CardTitle>
            <CardDescription>Data from /api/auth/session endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              let sessionContent;
              if (sessionLoading) {
                sessionContent = <div>Loading session data...</div>;
              } else if (sessionData) {
                sessionContent = <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(sessionData, null, 2)}</pre>;
              } else {
                sessionContent = <div>Click the button below to check session data</div>;
              }
              return sessionContent;
            })()}
          </CardContent>
          <CardFooter>
            <Button onClick={checkSession} disabled={sessionLoading}>
              Check Session API
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browser Cookies</CardTitle>
            <CardDescription>Current cookies in the browser</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto">{cookies || "No cookies found"}</pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Test</CardTitle>
            <CardDescription>Test direct navigation to dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click the button below to test direct navigation to the dashboard page.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={goToDashboard}>Go to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


