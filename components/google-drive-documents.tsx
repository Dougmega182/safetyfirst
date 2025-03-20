// safetyfirst/components/google-drive-documents.tsx
// /components/google-drive-documents.tsx
"use client"

import { useState, useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { useApiClient } from "@/lib/api-client"
import { FileText, ExternalLink, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GoogleDriveDocument {
  id: string;
  name: string;
  webViewLink: string;
}

export function GoogleDriveDocuments() {
  const user = useUser()
  interface GoogleDriveResponse {
    error?: string;
    connectUrl?: string;
    files?: GoogleDriveDocument[];
  }
  const api = useApiClient() as unknown as { get: (url: string) => Promise<GoogleDriveResponse> }
  const { toast } = useToast()
  const [documents, setDocuments] = useState<GoogleDriveDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectUrl, setConnectUrl] = useState<string | null>(null)

  // Check if the user has connected their Google account
  const googleAccount = user && "connectedAccounts" in user ? (user as { connectedAccounts: { provider: string }[] }).connectedAccounts.find((account: { provider: string }) => account.provider === "google") : undefined;

  const isConnected = !!googleAccount

  useEffect(() => {
    async function fetchDocuments() {
      if (!isConnected) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await api.get("/api/documents/google-drive")

        if (response.error) {
          setError(response.error)
          if (response.connectUrl) {
            setConnectUrl(response.connectUrl)
          }
          return
        }

        setDocuments(response.files || [])
      } catch {
        setError("Failed to fetch documents")
        toast({
          title: "Error",
          description: "Could not load Google Drive documents",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [isConnected, api, toast])

  const handleConnect = async () => {
    try {
      // This will redirect to Google's OAuth page if available
      if (user && "getConnectedAccount" in user && typeof user.getConnectedAccount === "function") {
        await user.getConnectedAccount("google", {
          or: "redirect",
          scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        })
      } else {
        throw new Error("getConnectedAccount method is not available on this user")
      }
    } catch {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Drive",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Drive Documents</CardTitle>
          <CardDescription>Connect your Google account to access your documents</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Button onClick={handleConnect}>Connect Google Drive</Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Drive Documents</CardTitle>
          <CardDescription>Loading your documents...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-destructive" />
            Error Loading Documents
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          {connectUrl && (
            <Button asChild>
              <a href={connectUrl}>Reconnect Google Drive</a>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive Documents</CardTitle>
        <CardDescription>
          {documents.length > 0
            ? `You have ${documents.length} documents in your Google Drive`
            : "No documents found in your Google Drive"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center p-2 border rounded hover:bg-muted">
                <FileText className="w-5 h-5 mr-3 text-blue-500" />
                <span className="flex-1 truncate">{doc.name}</span>
                <Button variant="ghost" size="sm" asChild>
                  <a href={doc.webViewLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No documents found in your Google Drive</div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Google Drive
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}


