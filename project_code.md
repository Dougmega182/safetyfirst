# Project Code Documentation
Generated on 16/03/2025, 12:29:47 am

## .eslintrc.json

```json
// safetyfirst/.eslintrc.json
{
  "extends": "next/core-web-vitals",
  "plugins": ["@typescript-eslint"],
  "parser": "@typescript-eslint/parser",
  "rules": {
    // Add any custom rules here
  }
}



```

## app\account\connections\page.tsx

```tsx
// safetyfirst/app/account/connections/page.tsx
"use client"
//connections page.tsx
import { useUser } from "@stackframe/stack"
import { ConnectOAuth } from "@/components/connect-oauth"
import { type OAuthProvider, providerScopes } from "@/lib/oauth-utils"
import { useRequireOnboarding } from "@/lib/onboarding"

export default function ConnectionsPage() {
  // Ensure user has completed onboarding
  useRequireOnboarding()

  // Get the current user
  const user = useUser({ or: "redirect" })

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



```

## app\account\page.tsx

```tsx
// safetyfirst/app/account/page.tsx
"use client"
// acount page.tsx
import { AccountSettings } from "@stackframe/stack"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your account settings</p>
        </div>
      </div>
    )
  }

  return (
    <AccountSettings
      fullPage={true}
        extraItems={[
          {
            title: "Job Sites",
            iconName: "MapPin",
            id: "job-sites", // Use 'id' if required
            content: (
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Your Job Sites</h2>
                <p>Manage your job site preferences and notifications.</p>
              </div>
            ),
          },
          {
            title: "Safety Certifications",
            iconName: "Award",
            id: "certifications",
            content: (
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Safety Certifications</h2>
                <p>Manage your safety certifications and training records.</p>
              </div>
            ),
          },
        ]}
        
    />
  )
}



```

## app\account\settings\page.tsx

```tsx
// safetyfirst/app/account/settings/page.tsx
"use client";
//settings page.tsx
import { AccountSettings } from "@stackframe/stack";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/auth/stack-login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we load your account settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <AccountSettings
      fullPage={true}
      extraItems={[
        {
          title: "Job Sites",
          iconName: "MapPin",
          id: "job-sites", // Use 'id' if required
          content: (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Your Job Sites</h2>
              <p>Manage your job site preferences and notifications.</p>
            </div>
          ),
        },
        {
          title: "Safety Certifications",
          iconName: "Award",
          id: "certifications",
          content: (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Safety Certifications</h2>
              <p>Manage your safety certifications and training records.</p>
            </div>
          ),
        },
      ]}
      
    />
  );
}


```

## app\admin\dashboard\loading.tsx

```tsx
// safetyfirst/app/admin/dashboard/loading.tsx
// dashboard loading.tsx
export default function Loading() {
  return null
}



```

## app\admin\dashboard\page.tsx

```tsx
// safetyfirst/app/admin/dashboard/page.tsx
"use client"
// dashboard page.tsx
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClipboardList, FileText, Users, BarChart3, QrCode, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type JobSite = {
  id: string
  name: string
  address: string
  activeWorkers: number
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [recentSites, setRecentSites] = useState<JobSite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchRecentSites = async () => {
      try {
        const response = await fetch("/api/job-sites?limit=4")
        if (response.ok) {
          const data = await response.json()
          setRecentSites(data.jobSites)
        }
      } catch (error) {
        console.error("Error fetching recent sites:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchRecentSites()
    }
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isAdmin = user.role === "ADMIN" || user.role === "CEO"

  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Welcome back, {user.name}!</p>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Job Sites</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Job Sites</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentSites.length}</div>
                <p className="text-xs text-muted-foreground">Active job sites</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Inductions</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Completed inductions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">SWMS</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Signed SWMS</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Hours</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">Hours this week</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mt-8">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sign In to Site</CardTitle>
                <CardDescription>Scan QR code or select a site to sign in</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-4 bg-white p-4 rounded-lg border">
                  <QrCode className="h-32 w-32 text-primary" />
                </div>
                <Button asChild className="w-full">
                  <Link href="/job-sites">Select Site</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Complete Inductions</CardTitle>
                <CardDescription>View and complete required site inductions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/inductions">View Inductions</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sign SWMS</CardTitle>
                <CardDescription>Review and sign Safe Work Method Statements</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/swms">View SWMS</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Job Sites</h2>
            <Button asChild>
              <Link href="/job-sites">View All Sites</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentSites.map((site) => (
              <Card key={site.id}>
                <CardHeader>
                  <CardTitle>{site.name}</CardTitle>
                  <CardDescription>{site.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{site.activeWorkers} active workers</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/job-sites/${site.id}`}>Details</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/job-sites/${site.id}/sign-in`}>Sign In</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {recentSites.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-10 border rounded-lg">
                <p className="mb-4 text-muted-foreground">No job sites found</p>
                <Button asChild>
                  <Link href="/job-sites/new">Add Your First Job Site</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Admin Tools</h2>
              <Button asChild>
                <Link href="/admin/dashboard">Go to Admin Dashboard</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Site Overview</CardTitle>
                  <CardDescription>View all site activity and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/dashboard">View Overview</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Manage Users</CardTitle>
                  <CardDescription>Add, edit, or remove system users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/users">Manage Users</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create and view system reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/reports">View Reports</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}



```

## app\admin\reports\page.tsx

```tsx
// safetyfirst/app/admin/reports/page.tsx
"use client"
// repots page.tsx
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Mail, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

type Report = {
  id: string
  weekStarting: string
  weekEnding: string
  sentAt: string | null
  sentTo: string[]
}

export default function AdminReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }

    if (!loading && user && user.role !== "CEO" && user.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports")
        if (!response.ok) {
          throw new Error("Failed to fetch reports")
        }
        const data = await response.json()
        setReports(data.reports)
      } catch (error) {
        console.error("Error fetching reports:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reports",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && (user.role === "CEO" || user.role === "ADMIN")) {
      fetchReports()
    }
  }, [user, toast])

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/reports/weekly", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      const data = await response.json()

      toast({
        title: "Report Generated",
        description: "Weekly report has been generated and sent successfully",
      })

      // Refresh the reports list
      const reportsResponse = await fetch("/api/reports")
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        setReports(reportsData.reports)
      }
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate weekly report",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load reports</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">View and generate system reports</p>
        </div>
        <Button onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" /> Generate Weekly Report
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Reports</CardTitle>
          <CardDescription>View all generated weekly reports</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="mb-4 text-muted-foreground">No reports found</p>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate First Report"}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {format(new Date(report.weekStarting), "dd MMM yyyy")} -{" "}
                          {format(new Date(report.weekEnding), "dd MMM yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">Weekly Report</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.sentAt ? (
                        <Badge className="bg-green-500">Sent</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">{report.sentTo.join(", ")}</div>
                    </TableCell>
                    <TableCell>
                      {report.sentAt ? format(new Date(report.sentAt), "dd MMM yyyy, h:mm a") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        {!report.sentAt && (
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



```

## app\api\admin\job-sites\route.ts

```typescript
// safetyfirst/app/api/admin/job-sites/route.ts
// api/admin/job-sites routes.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user || !("role" in user) || (user.role !== "CEO" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    
    if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const dateFrom = url.searchParams.get("from") ? new Date(url.searchParams.get("from") as string) : undefined
    const dateTo = url.searchParams.get("to") ? new Date(url.searchParams.get("to") as string) : undefined

    // Fetch all job sites with related data
    const jobSites = await prisma.jobSite.findMany({
      include: {
        attendances: {
          where: {
            signOutTime: null, // Only active attendances
            ...(dateFrom && {
              signInTime: {
                gte: dateFrom,
              },
            }),
            ...(dateTo && {
              signInTime: {
                lte: dateTo,
              },
            }),
          },
          include: {
            user: true,
          },
        },
        inductions: {
          include: {
            completions: {
              where: {
                ...(dateFrom && {
                  completedAt: {
                    gte: dateFrom,
                  },
                }),
                ...(dateTo && {
                  completedAt: {
                    lte: dateTo,
                  },
                }),
              },
            },
          },
        },
        swms: {
          include: {
            signoffs: {
              where: {
                ...(dateFrom && {
                  signedAt: {
                    gte: dateFrom,
                  },
                }),
                ...(dateTo && {
                  signedAt: {
                    lte: dateTo,
                  },
                }),
              },
            },
          },
        },
      },
    })

 
## app\api\auth\register\route.ts

```typescript
// safetyfirst/app/api/auth/register/route.ts
// app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create user and associated userDetails (role)
    const user = await prisma.user.create({
      data: {
        email,
        displayName: name,
        details: {
          create: {
            role: "USER", // Setting the role in userDetails
          },
        },
      },
    })

    // Create session token (you need to implement token generation logic)
    const token = "generated-token" // Example: use a JWT library
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // Set expiration time for 1 hour
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Set cookie with session token
    const cookieStore = await cookies()
    cookieStore.set("auth-session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Return user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.details?.role, // Access role from userDetails
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}


```

## app\api\auth\session\route.ts

```typescript
// safetyfirst/app/api/auth/session/route.ts
// app/api/auth/session/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { stackServerApp } from "@/lib/stack-auth"

export async function GET() {
  try {
    // Debug available methods
    console.log("Available methods on stackServerApp:", 
      Object.getOwnPropertyNames(Object.getPrototypeOf(stackServerApp))
        .filter(method => typeof stackServerApp[method as keyof typeof stackServerApp] === 'function')
    );
    
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("auth-session")?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }

    // Return the available methods for debugging
    return NextResponse.json({ 
      availableMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(stackServerApp))
        .filter(method => typeof stackServerApp[method as keyof typeof stackServerApp] === 'function'),
      user: null 
    });
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}

```

## app\api\auth\verify\route.ts

```typescript
// safetyfirst/app/api/auth/verify/route.ts
// app/api/auth/verift/route.ts
import { NextResponse } from "next/server"
import * as jose from "jose"

// Cache the JWKS for performance
let jwksCache: jose.RemoteJWKSet<jose.JWTVerifyGetKey> | null = null

async function getJwks() {
  if (!jwksCache) {
    const projectId = process.env.NEXT_PUBLIC_STACK_CLIENT_ID
    jwksCache = jose.createRemoteJWKSet(
      new URL(`https://api.stack-auth.com/api/v1/projects/${projectId}/.well-known/jwks.json`),
    )
  }
  return jwksCache
}

export async function POST(request: Request) {
  try {
    // Get the access token from the request headers
    const accessToken = request.headers.get("x-stack-access-token")

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 401 })
    }

    // Verify the JWT token
    const jwks = await getJwks()
    const { payload } = await jose.jwtVerify(accessToken, jwks)

    // Return the verified user information
    return NextResponse.json({
      authenticated: true,
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      // Add any other claims you need
    })
  } catch (error) {
    console.error("Error verifying token:", error)
    return NextResponse.json({ error: "Invalid token", authenticated: false }, { status: 401 })
  }
}



```

## app\api\auth\[...nextauth].ts

```typescript
// app/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Implement logic to verify credentials
        return null; // Return user object or null
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);

```

## app\api\cron\weekly-report\route.ts

```typescript
// safetyfirst/app/api/cron/weekly-report/route.ts
// app/api/cron/weekly-report/route.ts
import { NextResponse } from "next/server"
import { generateWeeklyReport } from "@/lib/weekly-report"

export async function GET(request: Request) {
  try {
    // Verify the request is authorized using the CRON_SECRET
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.CRON_SECRET

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const result = await generateWeeklyReport()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Weekly report generated and sent successfully",
        reportId: result.reportId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate weekly report",
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in weekly report cron job:", error)
    return NextResponse.json({ message: "An error occurred in the weekly report cron job" }, { status: 500 })
  }
}



```

## app\api\documents\google-drive\route.ts

```typescript
// safetyfirst/app/api/documents/google-drive/route.ts
// app/api/cdocumentsron/google-drive/route.ts
import { NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth-server"
import { stackServerApp } from "@/lib/stack-auth"

export async function GET(request: Request) {
  try {
    // Verify the user's token
    const verifiedUser = await verifyAuthToken()

    if (!verifiedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user from Stack Auth
    const user = await stackServerApp.getUser(verifiedUser.id)

    // Get the connected Google account
    const googleAccount = await user.getConnectedAccount("google")

    if (!googleAccount) {
      return NextResponse.json(
        { error: "Google account not connected", connectUrl: "/account/connections" },
        { status: 403 },
      )
    }

    // Get the access token
    const { accessToken } = await googleAccount.getAccessToken()

    // Use the access token to fetch files from Google Drive
    const driveResponse = await fetch("https://www.googleapis.com/drive/v3/files?pageSize=10", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!driveResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch Google Drive files" }, { status: driveResponse.status })
    }

    const driveData = await driveResponse.json()

    return NextResponse.json(driveData)
  } catch (error) {
    console.error("Error accessing Google Drive:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



```

## app\api\inductions\route.ts

```typescript
// safetyfirst/app/api/inductions/route.ts
// app/apiinductions/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobSiteId = searchParams.get("jobSiteId")

    const inductions = await prisma.induction.findMany({
      where: jobSiteId ? { jobSiteId } : undefined,
      include: {
        jobSite: {
          select: { name: true },
        },
        completions: {
          where: { userId: user.id },
        },
      },
    })

    return NextResponse.json({ inductions })
  } catch (error) {
    console.error("Error fetching inductions:", error)
    return NextResponse.json({ message: "An error occurred while fetching inductions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, jobSiteId, content, requiresSignature, expiryDays } = await request.json()

    if (!title || !jobSiteId || !content) {
      return NextResponse.json({ message: "Title, job site, and content are required" }, { status: 400 })
    }

    const induction = await prisma.induction.create({
      data: {
        title,
        description,
        jobSiteId,
        content,
        requiresSignature,
        expiryDays,
      },
    })

    return NextResponse.json({ induction })
  } catch (error) {
    console.error("Error creating induction:", error)
    return NextResponse.json({ message: "An error occurred while creating the induction" }, { status: 500 })
  }
}



```

## app\api\job-sites\route.ts

```typescript
// safetyfirst/app/api/job-sites/route.ts
// app/api/job-sites/route.ts
import { NextResponse } from "next/server"
import { getAuthenticatedNeonDb } from "@/lib/db/neon-rls"
import { verifyAuthToken } from "@/lib/auth-server"

export async function GET(request: Request) {
  try {
    // Verify the user's token
    const verifiedUser = await verifyAuthToken()

    if (!verifiedUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the authenticated database connection
    const sql = await getAuthenticatedNeonDb(verifiedUser.id)

    // Get query parameters
    const url = new URL(request.url)
    const limit = url.searchParams.get("limit")   // Get all users for total count
    const allUsers = await prisma.userDetails.count({
      where: {
        role: "USER", // Only count regular users, not admins or CEOs
      },
    })

    // Transform data for the frontend
    const sites = jobSites.map((site) => {
      // Count unique users who have attended this site
      const uniqueUsers = new Set(site.attendances.map((a) => a.userId))

      // Count total inductions and completed inductions
      const totalInductions = site.inductions.length * allUsers
      const completedInductions = site.inductions.reduce((total, induction) => total + induction.completions.length, 0)

      // Count total SWMS and signed SWMS
      const totalSwms = site.swms.length * allUsers
      const signedSwms = site.swms.reduce((total, swms) => total + swms.signoffs.length, 0)

      return {
        id: site.id,
        name: site.name,
        address: site.address,
        activeWorkers: site.attendances.length,
        totalWorkers: uniqueUsers.size,
        completedInductions,
        totalInductions,
        signedSwms,
        totalSwms,
      }
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error("Error fetching admin site data:", error)
    return NextResponse.json({ message: "An error occurred while fetching site data" }, { status: 500 })
  }
}



```

## app\api\admin\workers\route.ts

```typescript
// safetyfirst/app/api/admin/workers/route.ts
// api/admin/workers routes.ts
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get basic user information from a request
 */
export async function getUserFromRequest(request: Request) {
  try {
    // For API routes, get the token from the cookie in the request
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        displayName: true,
        email: true,
        authMethod: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

/**
 * Get user details from request
 */
export async function getUserDetailsFromRequest(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { id: string };

    // Find the user first
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return null;

    // Then find the user details using the userId field
    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: user.id },
    });

    return userDetails;
  } catch (error) {
    console.error("Error getting user details from request:", error);
    return null;
  }
}

/**
 * Get complete user profile with details
 */
export async function getCompleteUserProfile(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        details: true, // This is the correct field name from your schema
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting complete user profile:", error);
    return null;
  }
}

// Helper function to parse cookies from header
function parseCookies(cookieHeader: string) {
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {} as Record<string, string>);
}


```

## app\api\auth\forgot-password\route.ts

```typescript
// safetyfirst/app/api/auth/forgot-password/route.ts
// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sign } from "jsonwebtoken"
import nodemailer from "nodemailer"

// If you need to use cookies in this route in the future:
// const cookieStore = await cookies()

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      })
    }

    // Create a reset token
    const resetToken = sign({ id: user.id, action: "reset_password" }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "1h",
    })

    // In a production app, you would send an email with the reset link
    // For now, we'll just log it and return a success message
    console.log(`Reset token for ${email}: ${resetToken}`)

    // If SMTP is configured, send an actual email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Safety First" <noreply@example.com>',
        to: email,
        subject: "Reset your password",
        html: `
          <h1>Reset Your Password</h1>
          <p>You requested a password reset for your Safety First account.</p>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 })
  }
}



```

## app\api\auth\login\route.ts

```typescript
// safetyfirst/app/api/auth/login/route.ts
// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        details: true // Include the UserDetails to get role information
      }
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check if we have a password-based authentication method
    // Note: Based on your schema, you might need to store password in another table
    // or use a different field to check authentication
    if (!user.authMethod || user.authMethod !== "password") {
      return NextResponse.json({ message: "This account doesn't use password login" }, { status: 401 })
    }

    // This part assumes you have the password stored somewhere. 
    // Since your shared schema doesn't show a password field,
    // you might need to adapt this part to your actual authentication storage.
    const storedPassword = ""; // You need to retrieve this from wherever you store it
    const passwordMatch = await bcrypt.compare(password, storedPassword)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create JWT token with user ID and role from details
    const role = user.details?.role || "USER"
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    )

    // Set cookie - using the non-Promise version
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from strict to lax for better cross-site linking
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Return user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: role
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}

```

## app\api\auth\logout\route.ts

```typescript
// safetyfirst/app/api/auth/logout/route.ts
// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { stackServerApp } from "@/lib/stack-auth";


export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("auth-session")?.value

    if (sessionToken) {
      // Invalidate the session with Stack Auth
      await stackServerApp.redirectToAfterSignOut({  })
    }

    // Clear the session cookie
    cookieStore.delete("auth-session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}



```

## app\api\auth\register\route.js

```javascript
// safetyfirst/app/api/auth/register/route.js
// app/api/auth/register/route.js
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var stack_auth_1 = require("@/lib/stack-auth");
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name_1, email, password, existingUser, error_1, user, session, cookieStore, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, request.json()
                        // Validate input
                    ];
                case 1:
                    _a = _b.sent(), name_1 = _a.name, email = _a.email, password = _a.password;
                    // Validate input
                    if (!name_1 || !email || !password) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, stack_auth_1.stackServer.getUserByEmail(email)];
                case 3:
                    existingUser = _b.sent();
                    if (existingUser) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "User with this email already exists" }, { status: 409 })];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    // If error is "user not found", continue with registration
                    // Otherwise, throw the error
                    if (error_1.code !== "user_not_found") {
                        throw error_1;
                    }
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, stack_auth_1.stackServer.createUser({
                        name: name_1,
                        email: email,
                        password: password,
                        role: "USER",
                    })
                    // Create session token
                ];
                case 6:
                    user = _b.sent();
                    return [4 /*yield*/, stack_auth_1.stackServer.createSession({
                            userId: user.id,
                            expiresIn: "7d",
                        })
                        // Set cookie with session token
                    ];
                case 7:
                    session = _b.sent();
                    return [4 /*yield*/, (0, headers_1.cookies)()];
                case 8:
                    cookieStore = _b.sent();
                    cookieStore.set("auth-session", session.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                        path: "/",
                    });
                    // Return user data
                    return [2 /*return*/, server_1.NextResponse.json({
                            user: {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                role: user.role || "USER",
                            },
                        })];
                case 9:
                    error_2 = _b.sent();
                    console.error("Registration error:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })];
                case 10: return [2 /*return*/];
            }
        });
    });
}


```


    // Build the query
    let query = `
      SELECT j.*, 
        (SELECT COUNT(*) FROM attendances a WHERE a.job_site_id = j.id AND a.sign_out_time IS NULL) as active_workers
      FROM job_sites j
      ORDER BY j.created_at DESC
    `

    // Add limit if provided
    if (limit) {
      query += ` LIMIT ${Number.parseInt(limit)}`
    }

    // Execute the query
    const jobSites = await sql(query)

    // Transform the data to match the expected format
    const transformedJobSites = jobSites.map((site: any) => ({
      id: site.id,
      name: site.name,
      address: site.address,
      description: site.description,
      imageUrl: site.image_url,
      createdAt: site.created_at,
      activeWorkers: Number.parseInt(site.active_workers),
    }))

    return NextResponse.json({ jobSites: transformedJobSites })
  } catch (error) {
    console.error("Error fetching job sites:", error)
    return NextResponse.json({ message: "An error occurred while fetching job sites" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verify the user's token
    const verifiedUser = await verifyAuthToken()

    if (!verifiedUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the authenticated database connection
    const sql = await getAuthenticatedNeonDb(verifiedUser.id)

    const { name, address, description, imageUrl } = await request.json()

    if (!name || !address) {
      return NextResponse.json({ message: "Name and address are required" }, { status: 400 })
    }

    // Insert the job site
    // Note: created_by_id will be automatically set to auth.user_id() by RLS
    const result = await sql`
      INSERT INTO job_sites (name, address, description, image_url, created_by_id)
      VALUES (${name}, ${address}, ${description}, ${imageUrl}, auth.user_id())
      RETURNING *
    `

    const jobSite = result[0]

    return NextResponse.json({ jobSite })
  } catch (error) {
    console.error("Error creating job site:", error)
    return NextResponse.json({ message: "An error occurred while creating the job site" }, { status: 500 })
  }
}



```

## app\api\job-sites\[id]\attendance\check\route.ts

```typescript
// app/api/job-sites/[id]/attendance/check/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is signed in to this site
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        jobSiteId: params.id,
        signOutTime: null,
      },
    })

    return NextResponse.json({ isSignedIn: !!attendance })
  } catch (error) {
    console.error("Error checking attendance:", error)
    return NextResponse.json({ message: "An error occurred while checking attendance" }, { status: 500 })
  }
}


```

## app\api\job-sites\[id]\attendance\route.ts

```typescript
// app/api/job-sites/[id]/attendance/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const attendances = await prisma.attendance.findMany({
      where: { jobSiteId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            position: true,
          },
        },
      },
      orderBy: {
        signInTime: "desc",
      },
    })

    return NextResponse.json({ attendances })
  } catch (error) {
    console.error("Error fetching attendances:", error)
    return NextResponse.json({ message: "An error occurred while fetching attendances" }, { status: 500 })
  }
}


```

## app\api\job-sites\[id]\attendance\sign-in\route.ts

```typescript
// app/api/job-sites/[id]/attendance/sign-in/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is already signed in to this site
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        jobSiteId: params.id,
        signOutTime: null,
      },
    })

    if (existingAttendance) {
      return NextResponse.json({ message: "You are already signed in to this site" }, { status: 400 })
    }

    // Create new attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        jobSiteId: params.id,
      },
    })

    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("Error signing in:", error)
    return NextResponse.json({ message: "An error occurred while signing in" }, { status: 500 })
  }
}


```

## app\api\job-sites\[id]\attendance\sign-out\route.ts

```typescript
// app/api/job-sites/[id]/attendance/sign-out/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Find the active attendance record
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        jobSiteId: params.id,
        signOutTime: null,
      },
    })

    if (!attendance) {
      return NextResponse.json({ message: "No active attendance record found" }, { status: 404 })
    }

    // Update the attendance record with sign-out time
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        signOutTime: new Date(),
      },
    })

    return NextResponse.json({ attendance: updatedAttendance })
  } catch (error) {
    console.error("Error signing out:", error)
    return NextResponse.json({ message: "An error occurred while signing out" }, { status: 500 })
  }
}


```

## app\api\job-sites\[id]\route.ts

```typescript
// app/api/job-sites/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const jobSite = await prisma.jobSite.findUnique({
      where: { id: params.id },
      include: {
        inductions: {
          select: {
            id: true,
            title: true,
            description: true,
            requiresSignature: true,
          },
        },
        swms: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
          },
        },
      },
    })

    if (!jobSite) {
      return NextResponse.json({ message: "Job site not found" }, { status: 404 })
    }

    return NextResponse.json({ jobSite })
  } catch (error) {
    console.error("Error fetching job site:", error)
    return NextResponse.json({ message: "An error occurred while fetching the job site" }, { status: 500 })
  }
}


```

## app\api\protected\route.ts

```typescript
// safetyfirst/app/api/protected/route.ts
// app/api/protected/route.ts
import { verifyAuthToken } from "@/lib/auth-server"

export async function GET() {
  const user = await verifyAuthToken()
  
  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Handle authorized request
}


```

## app\api\reports\route.ts

```typescript
// safetyfirst/app/api/reports/route.ts
// app/api/reports/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Fetch all reports
    const reports = await prisma.weeklyReport.findMany({
      orderBy: {
        weekStarting: "desc",
      },
    })

    // Transform data for the frontend
    const transformedReports = reports.map((report) => ({
      id: report.id,
      weekStarting: report.weekStarting.toISOString(),
      weekEnding: report.weekEnding.toISOString(),
      sentAt: report.sentAt ? report.sentAt.toISOString() : null,
      sentTo: report.sentTo,
    }))

    return NextResponse.json({ reports: transformedReports })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ message: "Anrror occurred while fetching reports" }, { status: 500 })
  }
}



```

## app\api\reports\weekly\route.ts

```typescript
// safetyfirst/app/api/reports/weekly/route.ts
// app/api/reports/weekly/route.ts
import { NextResponse } from "next/server"
import { generateWeeklyReport } from "@/lib/weekly-report"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const result = await generateWeeklyReport()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Weekly report generated and sent successfully",
        reportId: result.reportId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate weekly report",
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error generating weekly report:", error)
    return NextResponse.json({ message: "An error occurred while generating the weekly report" }, { status: 500 })
  }
}



```

## app\api\swms\route.ts

```typescript
// safetyfirst/app/api/swms/route.ts
// app/api/swms/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobSiteId = searchParams.get("jobSiteId")

    const swmsList = await prisma.swms.findMany({
      where: jobSiteId ? { jobSiteId } : undefined,
      include: {
        jobSite: {
          select: { name: true },
        },
        signoffs: {
          where: { userId: user.id },
        },
      },
    })

    return NextResponse.json({ swmsList })
  } catch (error) {
    console.error("Error fetching SWMS:", error)
    return NextResponse.json({ message: "An error occurred while fetching SWMS" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, jobSiteId, content } = await request.json()

    if (!title || !jobSiteId || !content) {
      return NextResponse.json({ message: "Title, job site, and content are required" }, { status: 400 })
    }

    const swms = await prisma.swms.create({
      data: {
        title,
        description,
        jobSiteId,
        content,
        createdById: user.id,
      },
    })

    return NextResponse.json({ swms })
  } catch (error) {
    console.error("Error creating SWMS:", error)
    return NextResponse.json({ message: "An error occurred while creating the SWMS" }, { status: 500 })
  }
}



```

## app\api\test-db\route.ts

```typescript
// safetyfirst/app/api/test-db/route.ts
// app/api/test-db/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Try to count users as a simple database test
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}



```

## app\api\user\client-metadata.ts

```typescript
// safetyfirst/app/api/user/client-metadata.ts
// /app/api/user/client-metadata.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/lib/auth';
import { stackServerApp } from '@/lib/stack-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the user is authenticated
  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { userId, metadata } = req.body;
    
    // Security check: only allow users to update their own metadata
    if (session.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get the Stack user
    const stackUser = await stackServerApp.getUser(userId);
    if (!stackUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the client metadata in Stack
    // You'll need to use the actual method provided by the Stack API
    // This is just a placeholder - replace with actual Stack API call
    if (typeof stackUser.setClientMetadata === 'function') {
      await stackUser.setClientMetadata({
        ...(stackUser.clientMetadata || {}),
        ...metadata
      });
    } else {
      // Alternative approach if direct method not available
      await fetch(`${process.env.STACK_API_URL}/users/${userId}/metadata`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.STACK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientMetadata: metadata
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return res.status(500).json({ error: 'Failed to update user metadata' });
  }
}





```

## app\api\user\initialize-metadata.ts

```typescript
// safetyfirst/app/api/user/initialize-metadata.ts
// /app/api/user/initialize-metadata.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/lib/stack-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the user is authenticated and is an admin
  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { 
      userId, 
      clientMetadata, 
      serverMetadata, 
      clientReadOnlyMetadata 
    } = req.body;

    // Get the user from Stack
    const user = await stackServerApp.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update client metadata
    if (clientMetadata) {
      await user.setClientMetadata(clientMetadata);
    }

    // Update server metadata
    if (serverMetadata) {
      await user.setServerMetadata(serverMetadata);
    }

    // Update client read-only metadata
    if (clientReadOnlyMetadata) {
      await user.setClientReadOnlyMetadata(clientReadOnlyMetadata);
    }

    // Update user details in Prisma if needed
    await prisma.userDetails.upsert({
      where: { userId },
      update: {
        company: clientReadOnlyMetadata?.companyName,
        role: clientReadOnlyMetadata?.role,
      },
      create: {
        userId,
        company: clientReadOnlyMetadata?.companyName,
        role: clientReadOnlyMetadata?.role,
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error initializing user metadata:', error);
    return res.status(500).json({ error: 'Failed to initialize user metadata' });
  }
}

```

## app\api\user\initialize-profile.ts

```typescript
// safetyfirst/app/api/user/initialize-profile.ts
// app/api/user/initialize-profile.ts
import { getServerSession } from 'next-auth/next'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 1. Authenticate user
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. Check admin role
    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: session.user.id }
    })
    
    if (!userDetails || userDetails.role !== Role.ADMIN) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' })
    }

    // 3. Validate request body
    const { userId, clientMetadata, clientReadOnlyMetadata } = req.body
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    // 4. Update user metadata
    const updatedUser = await prisma.userDetails.update({
      where: { userId },
      data: {
        clientMetadata: clientMetadata || {},
        clientReadOnlyMetadata: clientReadOnlyMetadata || {},
      }
    })

    return res.status(200).json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Profile initialization error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


```

## app\api\user\metadata.ts

```typescript
// safetyfirst/app/api/user/metadata.ts
// /app/api/user/metadata.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/lib/stack-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the user is authenticated
  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { userId, clientMetadata } = req.body;
    
    // Security check: only allow users to update their own metadata
    if (session.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get the user from Stack
    const user = await stackServerApp.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the client metadata using Stack's API
    await user.setClientMetadata({
      ...user.clientMetadata,
      ...clientMetadata
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return res.status(500).json({ error: 'Failed to update user metadata' });
  }
}


```

## app\api\user\onboarding\route.ts

```typescript
// safetyfirst/app/api/user/onboarding/route.ts
// app/api/user/onboarding/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { updateUserServerMetadata, updateUserClientReadOnlyMetadata } from "@/lib/user-metadata"

export async function POST(request: Request) {
  try {
    // Get the session token
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("auth-session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the token
    const decoded = verify(sessionToken, process.env.STACK_SECRET_SERVER_KEY || "") as { sub: string }
    const userId = decoded.sub

    // Get the request body
    const { safetyTraining, jobTitle, company } = await request.json()

    // Update server metadata
    await updateUserServerMetadata(userId, {
      safetyTrainingCompleted: Object.values(safetyTraining).some(Boolean),
      onboardingCompleted: true,
    })

    // Update client read-only metadata
    await updateUserClientReadOnlyMetadata(userId, {
      jobTitle,
      companyName: company,
      accountStatus: "active",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user metadata:", error)
    return NextResponse.json({ error: "Failed to update user metadata" }, { status: 500 })
  }
}



```

## app\api\user\onboarding.ts

```typescript
// safetyfirst/app/api/user/onboarding.ts
// /app/api/user/onboarding.ts 
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { safetyTraining, jobTitle, company } = req.body;
    
    // Update user details in Prisma
    await prisma.userDetails.update({
      where: { userId: session.user.id },
      data: {
        company: company,
        position: jobTitle
        // You don't have safetyTraining as a direct field in UserDetails
        // Consider storing this information elsewhere or creating a related table
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

```

## app\api\user\profile\route.ts

```typescript
// safetyfirst/app/api/user/profile/route.ts
// app/api/user/profile/route.ts
import { NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth-server"
import { stackServerApp } from "@/lib/stack-auth"

export async function GET() {
  try {
    // Verify the user's token
    const verifiedUser = await verifyAuthToken()

    if (!verifiedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the full user profile from Stack Auth
    const user = await stackServerApp.getUser(verifiedUser.id)

    // Return the user profile with sensitive information removed
    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      clientMetadata: user.clientMetadata,
      clientReadOnlyMetadata: user.clientReadOnlyMetadata,
      // Don't include serverMetadata for security
      connectedAccounts: user.connectedAccounts.map((account) => ({
        provider: account.provider,
        connected: true,
      })),
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



```

## app\api\users\route.ts

```typescript
// safetyfirst/app/api/users/route.ts
// /app/api/user/route.ts 
import { NextResponse } from "next/server"
import { stackServerApp } from "@/lib/stack-auth"

export async function GET() {
  try {
    // This uses the server-side Stack app with elevated permissions
    const users = await stackServerApp.listUsers()

    // Only return non-sensitive information
    const safeUsers = users.map((user) => ({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      createdAt: user.createdAt,
    }))

    return NextResponse.json({ users: safeUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}



```

## app\auth\debug\page.tsx

```tsx
// safetyfirst/app/auth/debug/page.tsx
// /app/auth/debug/page.tsx 
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"

export default function DebugPage() {
  const { user, loading } = useAuth()
  const [sessionData, setSessionData] = useState<any>(null)
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
      setSessionData({ error: "Failed to fetch session data" })
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
            {sessionLoading ? (
              <div>Loading session data...</div>
            ) : sessionData ? (
              <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(sessionData, null, 2)}</pre>
            ) : (
              <div>Click the button below to check session data</div>
            )}
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



```

## app\auth\forgot-password\page.tsx

```tsx
// safetyfirst/app/auth/forgot-password/page.tsx
// /app/auth/forgot-password/page.tsx 
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HardHat, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to process request")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Forgot password error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <HardHat className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold">SafetyFirst</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Forgot password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          {isSubmitted ? (
            <CardContent className="space-y-4">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      If an account with that email exists, we've sent you a password reset link.
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                </Link>
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-blue-600 underline-offset-4 hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}



```

## app\auth\login\page.tsx

```tsx
// safetyfirst/app/auth/login/page.tsx
// /app/auth/login/page.tsx 
"use client"

import { SignIn } from "@stackframe/stack"
import { HardHat } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <HardHat className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold">SafetyFirst</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <SignIn
          automaticRedirect={true}
          firstTab="password"
          extraInfo={
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          }
        />
      </div>
    </div>
  )
}



```

## app\auth\register\page.tsx

```tsx
// safetyfirst/app/auth/register/page.tsx
// /app/auth/register/page.tsx 
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HardHat, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  // Update the validatePasswords function to properly compare passwords
  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return false
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    setPasswordError("")
    return true
  }

  // Also update the handleSubmit function to ensure validation happens before submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Run validation before proceeding
    if (!validatePasswords()) {
      return
    }

    setIsLoading(true)

    try {
      await signUp(name, email, password, company, position)
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <HardHat className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold">SafetyFirst</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position (Optional)</Label>
                <Input
                  id="position"
                  type="text"
                  placeholder="Your job title"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (confirmPassword) validatePasswords()
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (password) validatePasswords()
                  }}
                  required
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}



```

## app\auth\stack-login\page.tsx

```tsx
// safetyfirst/app/auth/stack-login/page.tsx
// /app/auth/stack-login/page.tsx 
"use client"

import { SignIn } from "@stackframe/stack"
import { HardHat } from "lucide-react"
import Link from "next/link"

export default function StackLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <HardHat className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold">SafetyFirst</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <SignIn
          automaticRedirect={true}
          firstTab="password"
          extraInfo={
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-blue-600 underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="mt-2">
                <Link href="/auth/login" className="text-blue-600 underline-offset-4 hover:underline">
                  Use traditional login
                </Link>
              </p>
            </div>
          }
        />
      </div>
    </div>
  )
}



```

## app\auth\stack-register\page.tsx

```tsx
// safetyfirst/app/auth/stack-register/page.tsx
// /app/auth/stack-register/page.tsx 
"use client"

import { SignUp } from "@stackframe/stack"
import { HardHat } from "lucide-react"
import Link from "next/link"

export default function StackRegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <HardHat className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold">SafetyFirst</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <SignUp
          automaticRedirect={true}
          extraInfo={
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{" "}
                <Link href="/auth/stack-login" className="text-blue-600 underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="mt-2">
                <Link href="/auth/register" className="text-blue-600 underline-offset-4 hover:underline">
                  Use traditional registration
                </Link>
              </p>
            </div>
          }
        />
      </div>
    </div>
  )
}



```

## app\dashboard\page.tsx

```tsx
// safetyfirst/app/dashboard/page.tsx
// /app/dashboard/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { useRequireOnboarding } from "@/lib/onboarding"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClipboardList, FileText, Users, BarChart3, QrCode, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@stackframe/stack"

type JobSite = {
  id: string
  name: string
  address: string
  activeWorkers: number
}

export default function DashboardPage() {
  // Check if user is onboarded
  const { isOnboarded } = useRequireOnboarding()

  const { user, loading } = useAuth()
  const stackUser = useUser()
  const router = useRouter()
  const [recentSites, setRecentSites] = useState<JobSite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchRecentSites = async () => {
      try {
        const response = await fetch("/api/job-sites?limit=4")
        if (response.ok) {
          const data = await response.json()
          setRecentSites(data.jobSites)
        }
      } catch (error) {
        console.error("Error fetching recent sites:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchRecentSites()
    }
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get user role from Stack Auth if available, otherwise fall back to the existing role
  const userRole = stackUser?.clientReadOnlyMetadata?.role || user.role
  const isAdmin = userRole === "admin" || userRole === "ceo" || user.role === "ADMIN" || user.role === "CEO"

  // Get preferred job site from Stack Auth if available
  const preferredJobSite = stackUser?.clientMetadata?.preferredJobSite

  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Welcome back, {stackUser?.displayName || user.name}!
        {stackUser?.clientReadOnlyMetadata?.jobTitle && (
          <span className="ml-2 text-sm">
            ({stackUser.clientReadOnlyMetadata.jobTitle} at {stackUser.clientReadOnlyMetadata.companyName})
          </span>
        )}
      </p>
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Job Sites</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Job Sites</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentSites.length}</div>
                <p className="text-xs text-muted-foreground">Active job sites</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Inductions</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Completed inductions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">SWMS</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Signed SWMS</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Hours</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">Hours this week</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mt-8">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sign In to Site</CardTitle>
                <CardDescription>Scan QR code or select a site to sign in</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-4 bg-white p-4 rounded-lg border">
                  <QrCode className="h-32 w-32 text-primary" />
                </div>
                <Button asChild className="w-full">
                  <Link href="/job-sites">Select Site</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Complete Inductions</CardTitle>
                <CardDescription>View and complete required site inductions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/inductions">View Inductions</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sign SWMS</CardTitle>
                <CardDescription>Review and sign Safe Work Method Statements</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/swms">View SWMS</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Job Sites</h2>
            <Button asChild>
              <Link href="/job-sites">View All Sites</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentSites.map((site) => (
              <Card key={site.id}>
                <CardHeader>
                  <CardTitle>{site.name}</CardTitle>
                  <CardDescription>{site.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{site.activeWorkers} active workers</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/job-sites/${site.id}`}>Details</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/job-sites/${site.id}/sign-in`}>Sign In</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {recentSites.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-10 border rounded-lg">
                <p className="mb-4 text-muted-foreground">No job sites found</p>
                <Button asChild>
                  <Link href="/job-sites/new">Add Your First Job Site</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Admin Tools</h2>
              <Button asChild>
                <Link href="/admin/dashboard">Go to Admin Dashboard</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Site Overview</CardTitle>
                  <CardDescription>View all site activity and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/dashboard">View Overview</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Manage Users</CardTitle>
                  <CardDescription>Add, edit, or remove system users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/users">Manage Users</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create and view system reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/reports">View Reports</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}



```

## app\globals.css

```css
// safetyfirst/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add any custom styles below this line */



```

## app\handler\[...stack]\page.tsx

```tsx
// /app/handler/[...stack]/page.tsx 
import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default function Handler(props: unknown) {
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}

```

## app\inductions\new\page.tsx

```tsx
// safetyfirst/app/inductions/new/page.tsx
// /app/inductions/new/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"

export default function NewInductionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [sections, setSections] = useState([{ id: "section_1", title: "Introduction", content: "" }])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const addSection = () => {
    const newSection = {
      id: `section_${sections.length + 1}`,
      title: `Section ${sections.length + 1}`,
      content: "",
    }
    setSections([...sections, newSection])
  }

  const updateSection = (id: string, field: string, value: string) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, [field]: value } : section)))
  }

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter((section) => section.id !== id))
    } else {
      toast({
        title: "Cannot remove section",
        description: "You must have at least one section in your induction",
        variant: "destructive",
      })
    }
  }

  const handleSave = () => {
    // In a real app, you would save the induction to your database
    toast({
      title: "Induction saved",
      description: "Your induction has been saved successfully",
    })
    router.push("/inductions")
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/inductions">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inductions
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Induction</h1>
        <p className="text-muted-foreground">Create a new site induction for workers</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Induction Details</CardTitle>
              <CardDescription>Basic information about your induction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., General Site Induction" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe what this induction covers" rows={4} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input id="duration" type="number" min="1" placeholder="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("content")}>Continue to Content</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Induction Content</CardTitle>
              <CardDescription>Add sections to your induction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sections.map((section, index) => (
                <div key={section.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Section {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSection(section.id)}
                      disabled={sections.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                    <Input
                      id={`section-title-${section.id}`}
                      value={section.title}
                      onChange={(e) => updateSection(section.id, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`section-content-${section.id}`}>Content</Label>
                    <Textarea
                      id={`section-content-${section.id}`}
                      value={section.content}
                      onChange={(e) => updateSection(section.id, "content", e.target.value)}
                      rows={6}
                      placeholder="Add content for this section..."
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addSection} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back to Details
              </Button>
              <Button onClick={() => setActiveTab("settings")}>Continue to Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Induction Settings</CardTitle>
              <CardDescription>Configure additional settings for your induction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requires-signature">Requires Signature</Label>
                <Select defaultValue="yes">
                  <SelectTrigger id="requires-signature">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Period (days)</Label>
                <Input id="expiry" type="number" min="0" placeholder="365" />
                <p className="text-xs text-muted-foreground">Set to 0 for no expiry</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select defaultValue="all-workers">
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-workers">All Workers</SelectItem>
                    <SelectItem value="specific-roles">Specific Roles</SelectItem>
                    <SelectItem value="admin-only">Admin Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("content")}>
                Back to Content
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Induction
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}



```

## app\inductions\page.tsx

```tsx
// safetyfirst/app/inductions/page.tsx
// /app/inductions/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Plus, FileEdit, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock data for inductions
const mockInductions = [
  {
    id: "ind_1",
    title: "General Site Induction",
    status: "active",
    createdAt: "2023-09-15",
    completions: 45,
  },
  {
    id: "ind_2",
    title: "Heavy Machinery Operation",
    status: "active",
    createdAt: "2023-10-02",
    completions: 12,
  },
  {
    id: "ind_3",
    title: "Working at Heights",
    status: "draft",
    createdAt: "2023-10-10",
    completions: 0,
  },
  {
    id: "ind_4",
    title: "Hazardous Materials Handling",
    status: "active",
    createdAt: "2023-08-22",
    completions: 18,
  },
  {
    id: "ind_5",
    title: "Emergency Procedures",
    status: "archived",
    createdAt: "2023-07-05",
    completions: 32,
  },
]

export default function InductionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [inductions, setInductions] = useState(mockInductions)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your inductions</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inductions</h1>
          <p className="text-muted-foreground">Manage your site inductions and training materials</p>
        </div>
        <Button asChild>
          <Link href="/inductions/new">
            <Plus className="mr-2 h-4 w-4" /> Create Induction
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inductions</CardTitle>
          <CardDescription>View and manage all your site inductions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Completions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inductions.map((induction) => (
                <TableRow key={induction.id}>
                  <TableCell className="font-medium">{induction.title}</TableCell>
                  <TableCell>{getStatusBadge(induction.status)}</TableCell>
                  <TableCell>{induction.createdAt}</TableCell>
                  <TableCell>{induction.completions}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/inductions/${induction.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/inductions/${induction.id}/edit`}>
                            <FileEdit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}



```

## app\job-sites\new\page.tsx

```tsx
// safetyfirst/app/job-sites/new/page.tsx
// /app/job-sites/new/page.tsx 
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewJobSitePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.address) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/job-sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create job site")
      }

      toast({
        title: "Job site created",
        description: "Your job site has been created successfully",
      })

      router.push("/job-sites")
    } catch (error) {
      console.error("Error creating job site:", error)
      toast({
        variant: "destructive",
        title: "Failed to create job site",
        description: error instanceof Error ? error.message : "An error occurred while creating the job site",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/job-sites">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Sites
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add New Job Site</h1>
        <p className="text-muted-foreground">Create a new job site for your workers</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Job Site Details</CardTitle>
            <CardDescription>Enter the details of the new job site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Downtown Tower Project"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Site Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of the job site"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional details about this job site"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Job Site
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}



```

## app\job-sites\page.tsx

```tsx
// safetyfirst/app/job-sites/page.tsx
// /app/job-sites/page.tsx 
import { getUserJobSites } from "@/lib/db/server-queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Users, Plus } from "lucide-react"

export default async function JobSitesPage() {
  // Fetch job sites using the authenticated database connection
  const jobSites = await getUserJobSites()

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Sites</h1>
          <p className="text-muted-foreground">Manage your construction job sites</p>
        </div>
        <Button asChild>
          <Link href="/job-sites/new">
            <Plus className="mr-2 h-4 w-4" /> Add Job Site
          </Link>
        </Button>
      </div>

      {jobSites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border rounded-lg">
          <p className="mb-4 text-muted-foreground">No job sites found</p>
          <Button asChild>
            <Link href="/job-sites/new">Add Your First Job Site</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobSites.map((site: any) => (
            <Card key={site.id}>
              <CardHeader>
                <CardTitle>{site.name}</CardTitle>
                <CardDescription>{site.address}</CardDescription>
              </CardHeader>
              <CardContent>
                {site.description && (
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{site.description}</span>
                  </div>
                )}
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{site.active_workers || 0} active workers</span>
                </div>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/job-sites/${site.id}`}>Details</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/job-sites/${site.id}/sign-in`}>Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}



```

## app\job-sites\[id]\attendance\page.tsx

```tsx
// /app/job-sites/[id]/attendance/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

type JobSite = {
  id: string
  name: string
  address: string
}

type Attendance = {
  id: string
  userId: string
  userName: string
  userEmail: string
  signInTime: string
  signOutTime: string | null
  duration: string | null
}

export default function SiteAttendancePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [jobSite, setJobSite] = useState<JobSite | null>(null)
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSiteAndAttendance = async () => {
      try {
        const siteId = params.id as string

        // Fetch job site details
        const siteResponse = await fetch(`/api/job-sites/${siteId}`)
        if (!siteResponse.ok) {
          throw new Error("Failed to fetch job site")
        }
        const siteData = await siteResponse.json()
        setJobSite(siteData.jobSite)

        // Fetch attendance records
        const attendanceResponse = await fetch(`/api/job-sites/${siteId}/attendance`)
        if (!attendanceResponse.ok) {
          throw new Error("Failed to fetch attendance records")
        }
        const attendanceData = await attendanceResponse.json()
        setAttendances(attendanceData.attendances)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load site attendance data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchSiteAndAttendance()
    }
  }, [params.id, toast])

  const handleSignOut = async (attendanceId: string) => {
    try {
      const response = await fetch(`/api/attendance/${attendanceId}/sign-out`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to sign out")
      }

      // Update the attendance list
      setAttendances((prev) =>
        prev.map((attendance) =>
          attendance.id === attendanceId ? { ...attendance, signOutTime: new Date().toISOString() } : attendance,
        ),
      )

      toast({
        title: "Signed out",
        description: "Worker has been signed out successfully",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out worker",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load attendance data</p>
        </div>
      </div>
    )
  }

  if (!jobSite) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-lg font-medium">Job site not found</h2>
          <Button asChild className="mt-4">
            <Link href="/job-sites">Back to Job Sites</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, h:mm a")
  }

  const calculateDuration = (signIn: string, signOut: string | null) => {
    if (!signOut) return null

    const start = new Date(signIn).getTime()
    const end = new Date(signOut).getTime()
    const durationMs = end - start

    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/job-sites/${jobSite.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{jobSite.name} - Attendance</h1>
        <p className="text-muted-foreground">{jobSite.address}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Attendance</CardTitle>
          <CardDescription>View and manage worker attendance for this job site</CardDescription>
        </CardHeader>
        <CardContent>
          {attendances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="mb-4 text-muted-foreground">No attendance records found</p>
              <Button asChild>
                <Link href={`/job-sites/${jobSite.id}/sign-in`}>Sign In to Site</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Sign In Time</TableHead>
                  <TableHead>Sign Out Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{attendance.userName}</p>
                        <p className="text-sm text-muted-foreground">{attendance.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatTime(attendance.signInTime)}</TableCell>
                    <TableCell>{attendance.signOutTime ? formatTime(attendance.signOutTime) : "-"}</TableCell>
                    <TableCell>{calculateDuration(attendance.signInTime, attendance.signOutTime) || "-"}</TableCell>
                    <TableCell>
                      {attendance.signOutTime ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500">On Site</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!attendance.signOutTime && (
                        <Button variant="outline" size="sm" onClick={() => handleSignOut(attendance.id)}>
                          <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


```

## app\job-sites\[id]\page.tsx

```tsx
// /app/job-sites/[id]/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useParams } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ClipboardList, FileText, LogIn, LogOut, Users } from "lucide-react"
import Link from "next/link"

type JobSite = {
  id: string
  name: string
  address: string
  description?: string
}

export default function JobSitePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [jobSite, setJobSite] = useState<JobSite | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const fetchJobSite = async () => {
      try {
        const response = await fetch(`/api/job-sites/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setJobSite(data.jobSite)
        }
      } catch (error) {
        console.error("Error fetching job site:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job site information",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchJobSite()
    }
  }, [params.id, toast])

  // Check if user is signed in to this site
  useEffect(() => {
    if (!user || !jobSite) return

    const checkAttendance = async () => {
      try {
        const response = await fetch(`/api/job-sites/${jobSite.id}/attendance/check`)
        if (response.ok) {
          const data = await response.json()
          setIsSignedIn(data.isSignedIn)
        }
      } catch (error) {
        console.error("Error checking attendance:", error)
      }
    }

    checkAttendance()
  }, [user, jobSite])

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!jobSite) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-lg font-medium">Job site not found</h2>
          <Button asChild className="mt-4">
            <Link href="/job-sites">Back to Job Sites</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSignIn = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      const response = await fetch(`/api/job-sites/${jobSite.id}/attendance/sign-in`, {
        method: "POST",
      })

      if (response.ok) {
        setIsSignedIn(true)
        toast({
          title: "Signed in successfully",
          description: `You have signed in to ${jobSite.name}`,
        })
      } else {
        throw new Error("Failed to sign in")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in to job site",
      })
    }
  }

  const handleSignOut = async () => {
    try {
      const response = await fetch(`/api/job-sites/${jobSite.id}/attendance/sign-out`, {
        method: "POST",
      })

      if (response.ok) {
        setIsSignedIn(false)
        toast({
          title: "Signed out successfully",
          description: `You have signed out from ${jobSite.name}`,
        })
      } else {
        throw new Error("Failed to sign out")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out from job site",
      })
    }
  }

  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold">{jobSite.name}</h1>
      <p className="mb-8 text-muted-foreground">{jobSite.address}</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="swms">SWMS</TabsTrigger>
          <TabsTrigger value="induction">Inductions</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>Details about this job site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-sm text-muted-foreground">{jobSite.address}</p>
                  </div>
                  {jobSite.description && (
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="text-sm text-muted-foreground">{jobSite.description}</p>
                    </div>
                  )}
                  <div className="pt-4">
                    {isSignedIn ? (
                      <Button onClick={handleSignOut} variant="destructive" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </Button>
                    ) : (
                      <Button onClick={handleSignIn} className="w-full">
                        <LogIn className="mr-2 h-4 w-4" /> Sign In to Site
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SWMS</CardTitle>
                <CardDescription>Safe Work Method Statements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Review and sign off on required SWMS for this job site.
                </p>
                <Button asChild className="w-full">
                  <Link href={`/job-sites/${jobSite.id}/swms`}>
                    <FileText className="mr-2 h-4 w-4" /> View SWMS
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inductions</CardTitle>
                <CardDescription>Site induction materials</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Complete required inductions before working on this site.
                </p>
                <Button asChild className="w-full">
                  <Link href={`/job-sites/${jobSite.id}/inductions`}>
                    <ClipboardList className="mr-2 h-4 w-4" /> View Inductions
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="swms">
          <Card>
            <CardHeader>
              <CardTitle>Safe Work Method Statements</CardTitle>
              <CardDescription>Review and sign off on the SWMS for this job site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All workers must review and sign the relevant SWMS before commencing work on this site.
                </p>
                <Button asChild>
                  <Link href={`/job-sites/${jobSite.id}/swms`}>
                    <FileText className="mr-2 h-4 w-4" /> View All SWMS
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="induction">
          <Card>
            <CardHeader>
              <CardTitle>Site Inductions</CardTitle>
              <CardDescription>Complete the required site inductions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All workers must complete the site induction before commencing work on this site.
                </p>
                <Button asChild>
                  <Link href={`/job-sites/${jobSite.id}/inductions`}>
                    <ClipboardList className="mr-2 h-4 w-4" /> Start Site Induction
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Sign in and out of the job site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All workers must sign in when arriving at the site and sign out when leaving.
                </p>
                {isSignedIn ? (
                  <Button onClick={handleSignOut} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out from Site
                  </Button>
                ) : (
                  <Button onClick={handleSignIn}>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In to Site
                  </Button>
                )}
                <div className="mt-6">
                  <h3 className="mb-2 font-medium">Current Workers On Site</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/job-sites/${jobSite.id}/attendance`}>
                      <Users className="mr-2 h-4 w-4" /> View All Attendance
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


```

## app\job-sites\[id]\sign-in\page.tsx

```tsx
// /app/job-sites/[id]/sign-in/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, CheckCircle, ClipboardList } from "lucide-react"
import Link from "next/link"
import SignatureCanvas from "@/components/signature-canvas"

type JobSite = {
  id: string
  name: string
  address: string
}

type Induction = {
  id: string
  title: string
  completed: boolean
}

type SWMS = {
  id: string
  title: string
  signed: boolean
}

export default function SiteSignInPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [jobSite, setJobSite] = useState<JobSite | null>(null)
  const [inductions, setInductions] = useState<Induction[]>([])
  const [swmsList, setSwmsList] = useState<SWMS[]>([])
  const [signature, setSignature] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const siteId = params.id as string

        // Fetch job site details
        const siteResponse = await fetch(`/api/job-sites/${siteId}`)
        if (!siteResponse.ok) {
          throw new Error("Failed to fetch job site")
        }
        const siteData = await siteResponse.json()
        setJobSite(siteData.jobSite)

        // Fetch inductions for this site
        const inductionsResponse = await fetch(`/api/job-sites/${siteId}/inductions?userId=${user?.id}`)
        if (!inductionsResponse.ok) {
          throw new Error("Failed to fetch inductions")
        }
        const inductionsData = await inductionsResponse.json()
        setInductions(inductionsData.inductions)

        // Fetch SWMS for this site
        const swmsResponse = await fetch(`/api/job-sites/${siteId}/swms?userId=${user?.id}`)
        if (!swmsResponse.ok) {
          throw new Error("Failed to fetch SWMS")
        }
        const swmsData = await swmsResponse.json()
        setSwmsList(swmsData.swmsList)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load site data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id && user) {
      fetchSiteData()
    }
  }, [params.id, user, toast])

  const handleSignIn = async () => {
    if (!signature) {
      toast({
        variant: "destructive",
        title: "Signature required",
        description: "Please provide your signature to sign in",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobSiteId: jobSite?.id,
          signature,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to sign in")
      }

      toast({
        title: "Signed in successfully",
        description: `You have been signed in to ${jobSite?.name}`,
      })

      router.push(`/job-sites/${jobSite?.id}`)
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An error occurred during sign in",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteInduction = async (inductionId: string) => {
    try {
      const response = await fetch(`/api/inductions/${inductionId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to complete induction")
      }

      // Update the inductions list
      setInductions((prev) =>
        prev.map((induction) => (induction.id === inductionId ? { ...induction, completed: true } : induction)),
      )

      toast({
        title: "Induction completed",
        description: "You have successfully completed this induction",
      })
    } catch (error) {
      console.error("Error completing induction:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete induction",
      })
    }
  }

  const handleSignSwms = async (swmsId: string) => {
    if (!signature) {
      toast({
        variant: "destructive",
        title: "Signature required",
        description: "Please provide your signature to sign the SWMS",
      })
      return
    }

    try {
      const response = await fetch(`/api/swms/${swmsId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to sign SWMS")
      }

      // Update the SWMS list
      setSwmsList((prev) => prev.map((swms) => (swms.id === swmsId ? { ...swms, signed: true } : swms)))

      toast({
        title: "SWMS signed",
        description: "You have successfully signed this SWMS",
      })
    } catch (error) {
      console.error("Error signing SWMS:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign SWMS",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load site data</p>
        </div>
      </div>
    )
  }

  if (!jobSite) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-lg font-medium">Job site not found</h2>
          <Button asChild className="mt-4">
            <Link href="/job-sites">Back to Job Sites</Link>
          </Button>
        </div>
      </div>
    )
  }

  const allInductionsCompleted = inductions.every((induction) => induction.completed)
  const allSwmsSigned = swmsList.every((swms) => swms.signed)
  const canSignIn = allInductionsCompleted && allSwmsSigned

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/job-sites/${jobSite.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Sign In to {jobSite.name}</h1>
        <p className="text-muted-foreground">{jobSite.address}</p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Site Inductions</CardTitle>
              <CardDescription>Complete all required inductions before signing in</CardDescription>
            </CardHeader>
            <CardContent>
              {inductions.length === 0 ? (
                <p className="text-center py-4">No inductions required for this site</p>
              ) : (
                <div className="space-y-4">
                  {inductions.map((induction) => (
                    <div key={induction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{induction.title}</p>
                        </div>
                      </div>
                      <div>
                        {induction.completed ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => router.push(`/inductions/${induction.id}`)}>
                            Complete Induction
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep(2)} disabled={!allInductionsCompleted}>
                {allInductionsCompleted ? "Continue to SWMS" : "Complete All Inductions to Continue"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Safe Work Method Statements</CardTitle>
              <CardDescription>Review and sign all required SWMS before signing in</CardDescription>
            </CardHeader>
            <CardContent>
              {swmsList.length === 0 ? (
                <p className="text-center py-4">No SWMS required for this site</p>
              ) : (
                <div className="space-y-4">
                  {swmsList.map((swms) => (
                    <div key={swms.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{swms.title}</p>
                        </div>
                      </div>
                      <div>
                        {swms.signed ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Signed</span>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => router.push(`/swms/${swms.id}`)}>
                            Review & Sign
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back to Inductions
              </Button>
              <Button onClick={() => setStep(3)} disabled={!allSwmsSigned}>
                {allSwmsSigned ? "Continue to Sign In" : "Sign All SWMS to Continue"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Sign In to Site</CardTitle>
              <CardDescription>Provide your signature to complete the sign-in process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">Declaration</h3>
                <p className="text-sm text-muted-foreground">
                  I confirm that I have completed all required inductions and reviewed all Safe Work Method Statements
                  for this site. I understand and will comply with all safety requirements and procedures.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Signature</h3>
                <div className="rounded-lg border p-4">
                  <SignatureCanvas onSave={setSignature} />
                </div>
                {signature && <p className="text-sm text-green-600">Signature captured successfully</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to SWMS
              </Button>
              <Button onClick={handleSignIn} disabled={!signature || isSubmitting}>
                {isSubmitting ? "Signing In..." : "Complete Sign In"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}


```

## app\layout.tsx

```tsx
// safetyfirst/app/layout.tsx
// /app/layout.tsx
import type React from "react"
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MobileProviderWrapper } from "@/components/mobile-provider-wrapper"
import { Header } from '@/components/header';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Construction Safety Platform",
  description: "Site safety management platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}><StackProvider app={stackServerApp}><StackTheme>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SidebarProvider>
              <MobileProviderWrapper>
                <div className="flex min-h-screen">
                  <SidebarNav />
                  <SidebarInset>
                    <div className="flex min-h-screen flex-col">
                      <Header />
                      <main className="flex-1">{children}</main>
                    </div>
                  </SidebarInset>
                </div>
              </MobileProviderWrapper>
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </StackTheme></StackProvider></body>
    </html>
  )
}



```

## app\loading.tsx

```tsx
// safetyfirst/app/loading.tsx
// /app/loading.tsx
export default function Loading() {
  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  return <></>;
}


```

## app\onboarding\page.tsx

```tsx
// safetyfirst/app/onboarding/page.tsx
// /app/onboarding/page.tsx 
"use client"

import { useState } from "react"
import { useUser } from "@stackframe/stack"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { HardHat } from "lucide-react"
import { updateUserClientMetadata } from "@/lib/user-metadata"

export default function OnboardingPage() {
  const user = useUser()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    jobTitle: user?.clientReadOnlyMetadata?.jobTitle || "",
    company: user?.clientReadOnlyMetadata?.companyName || "",
    preferredJobSite: user?.clientMetadata?.preferredJobSite || "",
    notifications: {
      email: user?.clientMetadata?.notificationPreferences?.email !== false,
      sms: user?.clientMetadata?.notificationPreferences?.sms === true,
      push: user?.clientMetadata?.notificationPreferences?.push !== false,
    },
    safetyTraining: {
      generalInduction: false,
      heightsTraining: false,
      firstAid: false,
      equipmentOperation: false,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!user) {
      // If user is null, redirect or show error message
      return;
    }
  
    setIsSubmitting(true);
    try {
      // Update client metadata
      await updateUserClientMetadata(user, {
        preferredJobSite: formData.preferredJobSite,
        notificationPreferences: {
          email: formData.notifications.email,
          sms: formData.notifications.sms,
          push: formData.notifications.push,
        },
        onboarded: true,
        lastActiveAt: new Date().toISOString(),
      });
  
      // Call server API to update server metadata
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          safetyTraining: formData.safetyTraining,
          jobTitle: formData.jobTitle,
          company: formData.company,
        }),
      });
  
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    // Show a loading state or handle the case where the user is not available
    return <div>Loading...</div>
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mb-8 flex items-center">
        <HardHat className="h-10 w-10 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold">Safety Pass Onboarding</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Personal Information"}
            {step === 2 && "Notification Preferences"}
            {step === 3 && "Safety Training"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Tell us about your role and company"}
            {step === 2 && "How would you like to be notified?"}
            {step === 3 && "Select any safety training you've completed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => updateForm("jobTitle", e.target.value)}
                  placeholder="e.g., Site Manager, Electrician, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredJobSite">Preferred Job Site</Label>
                <Select
                  value={formData.preferredJobSite}
                  onValueChange={(value) => updateForm("preferredJobSite", value)}
                >
                  <SelectTrigger id="preferredJobSite">
                    <SelectValue placeholder="Select a job site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site_1">Downtown Tower Project</SelectItem>
                    <SelectItem value="site_2">Harbour Bridge Upgrade</SelectItem>
                    <SelectItem value="site_3">WestConnex Tunnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-notifications"
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) =>
                    updateForm("notifications", { ...formData.notifications, email: !!checked })
                  }
                />
                <Label htmlFor="email-notifications">Email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms-notifications"
                  checked={formData.notifications.sms}
                  onCheckedChange={(checked) =>
                    updateForm("notifications", { ...formData.notifications, sms: !!checked })
                  }
                />
                <Label htmlFor="sms-notifications">SMS notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="push-notifications"
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) =>
                    updateForm("notifications", { ...formData.notifications, push: !!checked })
                  }
                />
                <Label htmlFor="push-notifications">Push notifications</Label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="general-induction"
                  checked={formData.safetyTraining.generalInduction}
                  onCheckedChange={(checked) =>
                    updateForm("safetyTraining", {
                      ...formData.safetyTraining,
                      generalInduction: !!checked,
                    })
                  }
                />
                <Label htmlFor="general-induction">General Site Induction</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="heights-training"
                  checked={formData.safetyTraining.heightsTraining}
                  onCheckedChange={(checked) =>
                    updateForm("safetyTraining", {
                      ...formData.safetyTraining,
                      heightsTraining: !!checked,
                    })
                  }
                />
                <Label htmlFor="heights-training">Working at Heights</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="first-aid"
                  checked={formData.safetyTraining.firstAid}
                  onCheckedChange={(checked) =>
                    updateForm("safetyTraining", {
                      ...formData.safetyTraining,
                      firstAid: !!checked,
                    })
                  }
                />
                <Label htmlFor="first-aid">First Aid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="equipment-operation"
                  checked={formData.safetyTraining.equipmentOperation}
                  onCheckedChange={(checked) =>
                    updateForm("safetyTraining", {
                      ...formData.safetyTraining,
                      equipmentOperation: !!checked,
                    })
                  }
                />
                <Label htmlFor="equipment-operation">Equipment Operation</Label>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}


```

## app\page.tsx

```tsx
// safetyfirst/app/page.tsx
// /app/page.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 relative">
      {/* Admin Sign In (Fixed at the Top Right) */}
      <div className="absolute top-4 right-4">
        <Button asChild variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
          <Link href="/auth/login">
            <LogIn className="mr-2 h-5 w-5" /> Admin Login
          </Link>
        </Button>
      </div>

      {/* Sign-Up Form */}
      <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center">
          <img src="/logo.png" alt="Transform Homes Logo" className="mx-auto mb-4 h-12" />
          <h2 className="text-xl font-semibold">Safety Pass</h2>
          <p className="text-gray-600">Please sign up to continue</p>
        </div>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700">Email address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <Button className="w-full py-3 text-lg bg-blue-600 text-white hover:bg-blue-700">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  )
}


```

## app\swms\new\page.tsx

```tsx
// safetyfirst/app/swms/new/page.tsx
// /app/swms/new/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Import SignatureCanvas dynamically with no SSR to avoid hydration issues
const SignatureCanvas = dynamic(() => import("@/components/signature-canvas"), { ssr: false })

export default function NewSwmsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [hazards, setHazards] = useState([{ id: "hazard_1", description: "", controls: "", riskLevel: "medium" }])
  const [signature, setSignature] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const addHazard = () => {
    const newHazard = {
      id: `hazard_${hazards.length + 1}`,
      description: "",
      controls: "",
      riskLevel: "medium",
    }
    setHazards([...hazards, newHazard])
  }

  const updateHazard = (id: string, field: string, value: string) => {
    setHazards(hazards.map((hazard) => (hazard.id === id ? { ...hazard, [field]: value } : hazard)))
  }

  const removeHazard = (id: string) => {
    if (hazards.length > 1) {
      setHazards(hazards.filter((hazard) => hazard.id !== id))
    } else {
      toast({
        title: "Cannot remove hazard",
        description: "You must have at least one hazard in your SWMS",
        variant: "destructive",
      })
    }
  }

  const handleSave = () => {
    if (!signature) {
      toast({
        title: "Signature required",
        description: "Please sign the SWMS before submitting",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would save the SWMS to your database
    toast({
      title: "SWMS submitted",
      description: "Your Safe Work Method Statement has been submitted for approval",
    })
    router.push("/swms")
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/swms">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to SWMS
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New SWMS</h1>
        <p className="text-muted-foreground">Create a new Safe Work Method Statement</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="hazards">Hazards & Controls</TabsTrigger>
          <TabsTrigger value="signature">Signature</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SWMS Details</CardTitle>
              <CardDescription>Basic information about the work and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Work Activity Title</Label>
                <Input id="title" placeholder="e.g., Excavation Work" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Project/Location</Label>
                <Input id="location" placeholder="Project name or site location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Work Description</Label>
                <Textarea id="description" placeholder="Describe the work to be performed" rows={4} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Your company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input id="supervisor" placeholder="Name of supervisor" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("hazards")}>Continue to Hazards & Controls</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hazards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hazards & Controls</CardTitle>
              <CardDescription>Identify hazards and control measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {hazards.map((hazard, index) => (
                <div key={hazard.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Hazard {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHazard(hazard.id)}
                      disabled={hazards.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hazard-desc-${hazard.id}`}>Hazard Description</Label>
                    <Textarea
                      id={`hazard-desc-${hazard.id}`}
                      value={hazard.description}
                      onChange={(e) => updateHazard(hazard.id, "description", e.target.value)}
                      placeholder="Describe the hazard..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hazard-controls-${hazard.id}`}>Control Measures</Label>
                    <Textarea
                      id={`hazard-controls-${hazard.id}`}
                      value={hazard.controls}
                      onChange={(e) => updateHazard(hazard.id, "controls", e.target.value)}
                      placeholder="List control measures to mitigate this hazard..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`risk-level-${hazard.id}`}>Risk Level</Label>
                    <Select
                      value={hazard.riskLevel}
                      onValueChange={(value) => updateHazard(hazard.id, "riskLevel", value)}
                    >
                      <SelectTrigger id={`risk-level-${hazard.id}`}>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="extreme">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addHazard} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Hazard
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back to Details
              </Button>
              <Button onClick={() => setActiveTab("signature")}>Continue to Signature</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sign SWMS</CardTitle>
              <CardDescription>Review and sign the Safe Work Method Statement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">Declaration</h3>
                <p className="text-sm text-muted-foreground">
                  I have read and understood this Safe Work Method Statement (SWMS). I agree to comply with the control
                  measures outlined in this SWMS. I understand that I must stop work immediately and notify my
                  supervisor if the SWMS cannot be followed or if new hazards are identified.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Signature</Label>
                <div className="rounded-lg border p-4">{isMounted && <SignatureCanvas onSave={setSignature} />}</div>
                {signature && <p className="text-sm text-green-600">Signature captured successfully</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("hazards")}>
                Back to Hazards
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Submit SWMS
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}



```

## app\swms\page.tsx

```tsx
// safetyfirst/app/swms/page.tsx
// /app/swms/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Plus, FileEdit, Trash2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

// Mock data for SWMS
const mockSwms = [
  {
    id: "swms_1",
    title: "Excavation Work",
    status: "approved",
    submittedBy: "John Contractor",
    submittedDate: "2023-09-15",
    approvedBy: "Site Manager",
  },
  {
    id: "swms_2",
    title: "Electrical Installation",
    status: "pending",
    submittedBy: "Electrical Co.",
    submittedDate: "2023-10-02",
    approvedBy: null,
  },
  {
    id: "swms_3",
    title: "Scaffolding Assembly",
    status: "rejected",
    submittedBy: "Heights Specialists",
    submittedDate: "2023-10-10",
    approvedBy: null,
  },
  {
    id: "swms_4",
    title: "Concrete Pouring",
    status: "approved",
    submittedBy: "Concrete Solutions",
    submittedDate: "2023-08-22",
    approvedBy: "Site Manager",
  },
  {
    id: "swms_5",
    title: "Asbestos Removal",
    status: "pending",
    submittedBy: "Safety Removals",
    submittedDate: "2023-10-18",
    approvedBy: null,
  },
]

export default function SwmsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [swms, setSwms] = useState(mockSwms)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your SWMS</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Pending
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Safe Work Method Statements</h1>
          <p className="text-muted-foreground">Manage and approve SWMS for your site</p>
        </div>
        <Button asChild>
          <Link href="/swms/new">
            <Plus className="mr-2 h-4 w-4" /> Create SWMS
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All SWMS</CardTitle>
          <CardDescription>View and manage all Safe Work Method Statements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {swms.map((swmsItem) => (
                <TableRow key={swmsItem.id}>
                  <TableCell className="font-medium">{swmsItem.title}</TableCell>
                  <TableCell>{getStatusBadge(swmsItem.status)}</TableCell>
                  <TableCell>{swmsItem.submittedBy}</TableCell>
                  <TableCell>{swmsItem.submittedDate}</TableCell>
                  <TableCell>{swmsItem.approvedBy || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/swms/${swmsItem.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        {swmsItem.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={`/swms/${swmsItem.id}/edit`}>
                            <FileEdit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}



```

## components\connect-oauth.tsx

```tsx
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

export function ConnectOAuth({ provider, scopes, onConnect, onDisconnect }: ConnectOAuthProps) {
  const user = useUser()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  // Handle the case when `user` might be null
  if (!user) {
    return <div>Loading...</div>
  }

  // Try to get the connected account, but don't redirect automatically
  const connectedAccount = user.useConnectedAccount(provider, {
    scopes,
  })

  const isConnected = !!connectedAccount

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // This will redirect to the OAuth provider
      await user.getConnectedAccount(provider, {
        or: "redirect", // Assuming this is correct for your library
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
          {services.map((service: string, index: number) => (
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


```

## components\date-range-picker.tsx

```tsx
// safetyfirst/components/date-range-picker.tsx
// /components/date-range-picker.tsx
"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  date: DateRange | undefined
  setDate: (date: DateRange) => void
  className?: string
}

export function DateRangePicker({ date, setDate, className }: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            required={true} // Add the required prop to fix the error
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}


```

## components\google-drive-documents.tsx

```tsx
// safetyfirst/components/google-drive-documents.tsx
// /components/google-drive-documents.tsx
"use client"

import { useState, useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApiClient } from "@/lib/api-client"
import { FileText, ExternalLink, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function GoogleDriveDocuments() {
  const user = useUser()
  const api = useApiClient()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectUrl, setConnectUrl] = useState<string | null>(null)

  // Check if the user has connected their Google account
  const googleAccount = user.useConnectedAccount("google", {
    redirectIfMissing: false,
  })

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
      } catch (err) {
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
      // This will redirect to Google's OAuth page
      await user.getConnectedAccount("google", {
        or: "redirect",
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      })
    } catch (err) {
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



```

## components\header.tsx

```tsx
// safetyfirst/components/header.tsx
// /components/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@stackframe/stack";
import { useAuth } from "@/lib/use-auth";
import Sidebar from "./sidebar";

export function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isAuthenticated = !loading && user;
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <HardHat className="h-6 w-6 text-blue-600" />
          <span>SafetyFirst</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isAuthenticated ? (
            <>
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/job-sites"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/job-sites") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Job Sites
                </Link>
                <Link
                  href="/inductions"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/inductions") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Inductions
                </Link>
                <Link
                  href="/swms"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/swms") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  SWMS
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isAdminRoute ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </nav>

              <UserButton
                showUserInfo={true}
                extraItems={[
                  {
                    text: "Dashboard",
                    icon: <HardHat className="h-4 w-4" />,
                    onClick: () => {
                      window.location.href = "/dashboard";
                      return Promise.resolve();
                    },
                  },
                ]}
              />

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="pr-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


```

## components\job-site-attendances.tsx

```tsx
// safetyfirst/components/job-site-attendances.tsx
"use client"

import { useAuthenticatedDb } from "@/lib/hooks/use-authenticated-db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

interface JobSiteAttendancesProps {
  jobSiteId: string
}

export function JobSiteAttendances({ jobSiteId }: JobSiteAttendancesProps) {
  const { toast } = useToast()
  const [attendances, setAttendances] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAttendances = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: dbError } = await useAuthenticatedDb<any[]>(
          `
            SELECT a.*, u.name, u.email
            FROM attendances a
            JOIN users u ON a.user_id = u.id
            WHERE a.job_site_id = $1
            ORDER BY a.sign_in_time DESC
          `,
          [jobSiteId],
          [jobSiteId],
        )

        if (dbError) {
          throw dbError
        }

        setAttendances(data)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendances()
  }, [jobSiteId])

  const handleSignOut = async (attendanceId: string) => {
    try {
      // Use the authenticated database hook to update the attendance
      const { data, error } = await useAuthenticatedDb(
        `
          UPDATE attendances
          SET sign_out_time = NOW()
          WHERE id = $1
          RETURNING *
        `,
        [attendanceId],
        [],
      )

      if (error) {
        throw error
      }

      toast({
        title: "Signed out successfully",
        description: "You have been signed out from this job site",
      })

      // Refresh the attendances
      window.location.reload()
    } catch (err) {
      console.error("Error signing out:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out from job site",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading attendances: {error.message}</p>
      </div>
    )
  }

  if (!attendances || attendances.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No attendance records found for this job site.</p>
      </div>
    )
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, h:mm a")
  }

  const calculateDuration = (signIn: string, signOut: string | null) => {
    if (!signOut) return null

    const start = new Date(signIn).getTime()
    const end = new Date(signOut).getTime()
    const durationMs = end - start

    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker</TableHead>
          <TableHead>Sign In Time</TableHead>
          <TableHead>Sign Out Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances.map((attendance) => (
          <TableRow key={attendance.id}>
            <TableCell>
              <div>
                <p className="font-medium">{attendance.name}</p>
                <p className="text-sm text-muted-foreground">{attendance.email}</p>
              </div>
            </TableCell>
            <TableCell>{formatTime(attendance.sign_in_time)}</TableCell>
            <TableCell>{attendance.sign_out_time ? formatTime(attendance.sign_out_time) : "-"}</TableCell>
            <TableCell>{calculateDuration(attendance.sign_in_time, attendance.sign_out_time) || "-"}</TableCell>
            <TableCell>
              {attendance.sign_out_time ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Completed
                </Badge>
              ) : (
                <Badge className="bg-blue-500">On Site</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              {!attendance.sign_out_time && (
                <Button variant="outline" size="sm" onClick={() => handleSignOut(attendance.id)}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}



```

## components\job-site-cards.tsx

```tsx
// safetyfirst/components/job-site-cards.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Users } from "lucide-react"

type JobSite = {
  id: string
  name: string
  address: string
  description?: string
  activeWorkers?: number
}

const MOCK_JOBSITES: JobSite[] = [
  {
    id: "site_1",
    name: "Downtown Tower Project",
    address: "123 Main St, Sydney NSW 2000",
    description: "A 30-story commercial tower development",
    activeWorkers: 15,
  },
  {
    id: "site_2",
    name: "Harbour Bridge Upgrade",
    address: "Sydney Harbour Bridge, Sydney NSW 2060",
    description: "Maintenance and upgrade of the iconic Harbour Bridge",
    activeWorkers: 8,
  },
  {
    id: "site_3",
    name: "WestConnex Tunnel",
    address: "M4 East, Haberfield NSW 2045",
    description: "Construction of the WestConnex tunnel",
    activeWorkers: 22,
  },
]

export default function JobSiteCards() {
  const [jobSites, setJobSites] = useState<JobSite[]>(MOCK_JOBSITES)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobSites.map((site) => (
        <Card key={site.id}>
          <CardHeader>
            <CardTitle>{site.name}</CardTitle>
            <CardDescription>{site.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{site.description}</span>
            </div>
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{site.activeWorkers} active workers</span>
            </div>
            <div className="flex space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/job-sites/${site.id}`}>Details</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/job-sites/${site.id}/sign-in`}>Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}



```

## components\mobile-provider-wrapper.tsx

```tsx
// safetyfirst/components/mobile-provider-wrapper.tsx
"use client"

import dynamic from "next/dynamic"
import type React from "react"

// Import MobileProvider dynamically with no SSR
const MobileProviderComponent = dynamic(
  () => import("@/components/mobile-provider").then((mod) => mod.MobileProvider),
  { ssr: false },
)

export function MobileProviderWrapper({ children }: { children: React.ReactNode }) {
  return <MobileProviderComponent>{children}</MobileProviderComponent>
}



```

## components\mobile-provider.tsx

```tsx
// safetyfirst/components/mobile-provider.tsx
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type MobileContextType = {
  isMobile: boolean
}

const MobileContext = createContext<MobileContextType>({ isMobile: false })

export const useMobile = () => useContext(MobileContext)

interface MobileProviderProps {
  children: ReactNode
}

export function MobileProvider({ children }: MobileProviderProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Adjust breakpoint as needed
    }

    // Set initial value
    handleResize()

    // Listen for window resize events
    window.addEventListener("resize", handleResize)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Only render children after component has mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return <MobileContext.Provider value={{ isMobile }}>{children}</MobileContext.Provider>
}

// This is a HOC (Higher Order Component) to wrap components that need mobile detection
export function withMobile<P extends object>(Component: React.ComponentType<P & { isMobile: boolean }>) {
  return function WithMobileComponent(props: P) {
    const { isMobile } = useMobile()
    return <Component {...props} isMobile={isMobile} />
  }
}



```

## components\sidebar.tsx

```tsx
// safetyfirst/components/sidebar.tsx
"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { BarChart3, ClipboardList, FileText, HardHat, LayoutDashboard, MapPin, Settings, Users, } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"


interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  const isAdmin = user?.role === "ADMIN" || user?.role === "CEO"

  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      variant: "default",
    },
    {
      title: "Job Sites",
      href: "/job-sites",
      icon: MapPin,
      variant: "default",
    },
    {
      title: "Inductions",
      href: "/inductions",
      icon: ClipboardList,
      variant: "default",
    },
    {
      title: "SWMS",
      href: "/swms",
      icon: FileText,
      variant: "default",
    },
  ]

  const adminRoutes = [
    {
      title: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
      variant: "default",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      variant: "default",
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      variant: "default",
    },
  ]

  return (
    <Sidebar className={className} {...props}>
      <SidebarHeader className="flex items-center">
        <Link href="/" className="flex items-center gap-2 px-2">
          <HardHat className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">Safety Pass</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarMenu>
              {adminRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                    <Link href={route.href}>
                      <route.icon className="h-5 w-5" />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default Sidebar; 


```

## components\signature-canvas.tsx

```tsx
// safetyfirst/components/signature-canvas.tsx
"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Save } from "lucide-react"

interface SignatureCanvasProps {
  onSave: (signature: string | null) => void
}

export default function SignatureCanvas({ onSave }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Handle mobile detection directly in the component
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = 200

    // Set up context
    context.lineWidth = 2
    context.lineCap = "round"
    context.strokeStyle = "#000"
    setCtx(context)

    // Handle window resize
    const handleResize = () => {
      if (!canvas || !context) return

      // Save current drawing
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) return

      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      tempCtx.drawImage(canvas, 0, 0)

      // Resize canvas
      canvas.width = canvas.offsetWidth
      canvas.height = 200

      // Restore drawing
      context.lineWidth = 2
      context.lineCap = "round"
      context.strokeStyle = "#000"
      context.drawImage(tempCanvas, 0, 0)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return

    setIsDrawing(true)
    ctx.beginPath()

    // Get coordinates
    const { offsetX, offsetY } = getCoordinates(e)
    ctx.moveTo(offsetX, offsetY)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return

    // Get coordinates
    const { offsetX, offsetY } = getCoordinates(e)
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!ctx) return

    setIsDrawing(false)
    ctx.closePath()
  }

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { offsetX: 0, offsetY: 0 }

    let offsetX, offsetY

    if (isTouchEvent(e)) {
      // Touch event
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0] || e.changedTouches[0]
      offsetX = touch.clientX - rect.left
      offsetY = touch.clientY - rect.top
    } else {
      // Mouse event
      offsetX = (e as React.MouseEvent).nativeEvent.offsetX
      offsetY = (e as React.MouseEvent).nativeEvent.offsetY
    }

    return { offsetX, offsetY }
  }

  const isTouchEvent = (e: React.MouseEvent | React.TouchEvent): e is React.TouchEvent => {
    return "touches" in e
  }

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    onSave(null)
  }

  const saveSignature = () => {
    if (!canvasRef.current) return

    const dataUrl = canvasRef.current.toDataURL("image/png")
    onSave(dataUrl)
  }

  return (
    <div className="space-y-2">
      <div className="border rounded-md bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={clearCanvas}>
          <Eraser className="h-4 w-4 mr-2" /> Clear
        </Button>
        <Button size="sm" onClick={saveSignature}>
          <Save className="h-4 w-4 mr-2" /> Save Signature
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {isMobile ? "Use your finger to sign above" : "Use your mouse to sign above"}
      </p>
    </div>
  )
}



```

## components\theme-provider.tsx

```tsx
// safetyfirst/components/theme-provider.tsx
"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}



```

## components\ui\accordion.tsx

```tsx
// safetyfirst/components/ui/accordion.tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }


```

## components\ui\alert-dialog.tsx

```tsx
// safetyfirst/components/ui/alert-dialog.tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}


```

## components\ui\alert.tsx

```tsx
// safetyfirst/components/ui/alert.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }


```

## components\ui\aspect-ratio.tsx

```tsx
// safetyfirst/components/ui/aspect-ratio.tsx
"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }


```

## components\ui\avatar.tsx

```tsx
// safetyfirst/components/ui/avatar.tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }


```

## components\ui\badge.tsx

```tsx
// safetyfirst/components/ui/badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }


```

## components\ui\breadcrumb.tsx

```tsx
// safetyfirst/components/ui/breadcrumb.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}


```

## components\ui\button.tsx

```tsx
// safetyfirst/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }


```

## components\ui\calendar.tsx

```tsx
// safetyfirst/components/ui/calendar.tsx
"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }



```

## components\ui\card.tsx

```tsx
// safetyfirst/components/ui/card.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }


```

## components\ui\carousel.tsx

```tsx
// safetyfirst/components/ui/carousel.tsx
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}


```

## components\ui\chart.tsx

```tsx
// safetyfirst/components/ui/chart.tsx
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}


```

## components\ui\checkbox.tsx

```tsx
// safetyfirst/components/ui/checkbox.tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }


```

## components\ui\collapsible.tsx

```tsx
// safetyfirst/components/ui/collapsible.tsx
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }


```

## components\ui\command.tsx

```tsx
// safetyfirst/components/ui/command.tsx
"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}


```

## components\ui\context-menu.tsx

```tsx
// safetyfirst/components/ui/context-menu.tsx
"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}


```

## components\ui\dialog.tsx

```tsx
// safetyfirst/components/ui/dialog.tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}


```

## components\ui\drawer.tsx

```tsx
// safetyfirst/components/ui/drawer.tsx
"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}


```

## components\ui\dropdown-menu.tsx

```tsx
// safetyfirst/components/ui/dropdown-menu.tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}


```

## components\ui\form.tsx

```tsx
// safetyfirst/components/ui/form.tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}


```

## components\ui\hover-card.tsx

```tsx
// safetyfirst/components/ui/hover-card.tsx
"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }


```

## components\ui\input-otp.tsx

```tsx
// safetyfirst/components/ui/input-otp.tsx
"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }


```

## components\ui\input.tsx

```tsx
// safetyfirst/components/ui/input.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


```

## components\ui\label.tsx

```tsx
// safetyfirst/components/ui/label.tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }


```

## components\ui\menubar.tsx

```tsx
// safetyfirst/components/ui/menubar.tsx
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}


```

## components\ui\navigation-menu.tsx

```tsx
// safetyfirst/components/ui/navigation-menu.tsx
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}


```

## components\ui\pagination.tsx

```tsx
// safetyfirst/components/ui/pagination.tsx
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}


```

## components\ui\popover.tsx

```tsx
// safetyfirst/components/ui/popover.tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }



```

## components\ui\progress.tsx

```tsx
// safetyfirst/components/ui/progress.tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }


```

## components\ui\radio-group.tsx

```tsx
// safetyfirst/components/ui/radio-group.tsx
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }


```

## components\ui\resizable.tsx

```tsx
// safetyfirst/components/ui/resizable.tsx
"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }


```

## components\ui\scroll-area.tsx

```tsx
// safetyfirst/components/ui/scroll-area.tsx
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }


```

## components\ui\select.tsx

```tsx
// safetyfirst/components/ui/select.tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}


```

## components\ui\separator.tsx

```tsx
// safetyfirst/components/ui/separator.tsx
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }



```

## components\ui\sheet.tsx

```tsx
// safetyfirst/components/ui/sheet.tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
)
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}



```

## components\ui\sidebar.tsx

```tsx
// safetyfirst/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}


```

## components\ui\skeleton.tsx

```tsx
// safetyfirst/components/ui/skeleton.tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }


```

## components\ui\slider.tsx

```tsx
// safetyfirst/components/ui/slider.tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }


```

## components\ui\sonner.tsx

```tsx
// safetyfirst/components/ui/sonner.tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }


```

## components\ui\switch.tsx

```tsx
// safetyfirst/components/ui/switch.tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }


```

## components\ui\table.tsx

```tsx
// safetyfirst/components/ui/table.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}


```

## components\ui\tabs.tsx

```tsx
// safetyfirst/components/ui/tabs.tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }


```

## components\ui\textarea.tsx

```tsx
// safetyfirst/components/ui/textarea.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }


```

## components\ui\toast.tsx

```tsx
// safetyfirst/components/ui/toast.tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}


```

## components\ui\toaster.tsx

```tsx
// safetyfirst/components/ui/toaster.tsx
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}


```

## components\ui\toggle-group.tsx

```tsx
// safetyfirst/components/ui/toggle-group.tsx
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }


```

## components\ui\toggle.tsx

```tsx
// safetyfirst/components/ui/toggle.tsx
"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }


```

## components\ui\tooltip.tsx

```tsx
// safetyfirst/components/ui/tooltip.tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }



```

## components\ui\use-mobile.tsx

```tsx
// safetyfirst/components/ui/use-mobile.tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}


```

## components\ui\use-toast.ts

```typescript
// safetyfirst/components/ui/use-toast.ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }


```

## components\user-menu.tsx

```tsx
// safetyfirst/components/user-menu.tsx
"use client"

import { UserButton } from "@stackframe/stack"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/use-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserMenu() {
  const { setTheme, theme } = useTheme()
  const { user } = useAuth()
  const router = useRouter()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/auth/stack-login" className="text-sm font-medium text-muted-foreground hover:text-primary">
          Sign in with Stack
        </Link>
      </div>
    )
  }

  return (
    <UserButton
      showUserInfo={true}
      colorModeToggle={toggleTheme}
      extraItems={[
        {
          text: "Dashboard",
          icon: <span className="i-lucide-layout-dashboard" />,
          onClick: () => {
            router.push("/dashboard")
          },
        },
        {
          text: "Job Sites",
          icon: <span className="i-lucide-map-pin" />,
          onClick: () => {
            router.push("/job-sites")
          },
        },
      ]}
    />
  )
}


```

## components.json

```json
// safetyfirst/components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}

```

## filetree.txt

```plaintext
// safetyfirst/filetree.txt

FullName
--------
E:\signonsitev2\safetyfirst\.env
E:\signonsitev2\safetyfirst\.env.local
E:\signonsitev2\safetyfirst\.eslintrc.json
E:\signonsitev2\safetyfirst\.gitignore
E:\signonsitev2\safetyfirst\.npmrc
E:\signonsitev2\safetyfirst\components.json
E:\signonsitev2\safetyfirst\Dockerfile
E:\signonsitev2\safetyfirst\file_tree.txt
E:\signonsitev2\safetyfirst\filetree.txt
E:\signonsitev2\safetyfirst\logo.png
E:\signonsitev2\safetyfirst\middleware.ts
E:\signonsitev2\safetyfirst\next-env.d.ts
E:\signonsitev2\safetyfirst\next.config.mjs
E:\signonsitev2\safetyfirst\package-lock.json
E:\signonsitev2\safetyfirst\package.json
E:\signonsitev2\safetyfirst\postcss.config.js
E:\signonsitev2\safetyfirst\postcss.config.mjs
E:\signonsitev2\safetyfirst\railway.toml
E:\signonsitev2\safetyfirst\README.md
E:\signonsitev2\safetyfirst\stack.tsx
E:\signonsitev2\safetyfirst\tailwind.config.js
E:\signonsitev2\safetyfirst\tsconfig.json
E:\signonsitev2\safetyfirst\v0-user-next.config.js
E:\signonsitev2\safetyfirst\app\globals.css
E:\signonsitev2\safetyfirst\app\layout.tsx
E:\signonsitev2\safetyfirst\app\loading.tsx
E:\signonsitev2\safetyfirst\app\page.tsx
E:\signonsitev2\safetyfirst\app\account\page.tsx
E:\signonsitev2\safetyfirst\app\account\connections\page.tsx
E:\signonsitev2\safetyfirst\app\account\settings\page.tsx
E:\signonsitev2\safetyfirst\app\admin\dashboard\loading.tsx
E:\signonsitev2\safetyfirst\app\admin\dashboard\page.tsx
E:\signonsitev2\safetyfirst\app\admin\reports\page.tsx
E:\signonsitev2\safetyfirst\app\api\admin\job-sites\route.ts
E:\signonsitev2\safetyfirst\app\api\admin\workers\route.ts
E:\signonsitev2\safetyfirst\app\api\auth\[...nextauth].ts
E:\signonsitev2\safetyfirst\app\api\auth\forgot-password\route.ts
E:\signonsitev2\safetyfirst\app\api\auth\login\route.ts
E:\signonsitev2\safetyfirst\app\api\auth\logout\route.ts
E:\signonsitev2\safetyfirst\app\api\auth\register\route.js
E:\signonsitev2\safetyfirst\app\api\auth\register\route.ts
E:\signonsitev2\safetyfirst\app\api\auth\session\route.ts
E:\signonsitev2\safetyfirst\app\api\auth\verify\route.ts
E:\signonsitev2\safetyfirst\app\api\cron\weekly-report\route.ts
E:\signonsitev2\safetyfirst\app\api\documents\google-drive\route.ts
E:\signonsitev2\safetyfirst\app\api\inductions\route.ts
E:\signonsitev2\safetyfirst\app\api\job-sites\route.ts
E:\signonsitev2\safetyfirst\app\api\job-sites\[id]\route.ts
E:\signonsitev2\safetyfirst\app\api\job-sites\[id]\attendance\route.ts
E:\signonsitev2\safetyfirst\app\api\job-sites\[id]\attendance\check\route.ts
E:\signonsitev2\safetyfirst\app\api\job-sites\[id]\attendance\sign-in\route.ts
E:\signonsitev2\safetyfirst\app\api\job-sites\[id]\attendance\sign-out\route.ts
E:\signonsitev2\safetyfirst\app\api\protected\route.ts
E:\signonsitev2\safetyfirst\app\api\reports\route.ts
E:\signonsitev2\safetyfirst\app\api\reports\weekly\route.ts
E:\signonsitev2\safetyfirst\app\api\swms\route.ts
E:\signonsitev2\safetyfirst\app\api\test-db\route.ts
E:\signonsitev2\safetyfirst\app\api\user\client-metadata.ts
E:\signonsitev2\safetyfirst\app\api\user\initialize-metadata.ts
E:\signonsitev2\safetyfirst\app\api\user\initialize-profile.ts
E:\signonsitev2\safetyfirst\app\api\user\metadata.ts
E:\signonsitev2\safetyfirst\app\api\user\onboarding.ts
E:\signonsitev2\safetyfirst\app\api\user\onboarding\route.ts
E:\signonsitev2\safetyfirst\app\api\user\profile\route.ts
E:\signonsitev2\safetyfirst\app\api\users\route.ts
E:\signonsitev2\safetyfirst\app\auth\debug\page.tsx
E:\signonsitev2\safetyfirst\app\auth\forgot-password\page.tsx
E:\signonsitev2\safetyfirst\app\auth\login\page.tsx
E:\signonsitev2\safetyfirst\app\auth\register\page.tsx
E:\signonsitev2\safetyfirst\app\auth\stack-login\page.tsx
E:\signonsitev2\safetyfirst\app\auth\stack-register\page.tsx
E:\signonsitev2\safetyfirst\app\dashboard\page.tsx
E:\signonsitev2\safetyfirst\app\handler\[...stack]\page.tsx
E:\signonsitev2\safetyfirst\app\inductions\page.tsx
E:\signonsitev2\safetyfirst\app\inductions\new\page.tsx
E:\signonsitev2\safetyfirst\app\job-sites\page.tsx
E:\signonsitev2\safetyfirst\app\job-sites\new\page.tsx
E:\signonsitev2\safetyfirst\app\job-sites\[id]\page.tsx
E:\signonsitev2\safetyfirst\app\job-sites\[id]\attendance\page.tsx
E:\signonsitev2\safetyfirst\app\job-sites\[id]\sign-in\page.tsx
E:\signonsitev2\safetyfirst\app\onboarding\page.tsx
E:\signonsitev2\safetyfirst\app\swms\page.tsx
E:\signonsitev2\safetyfirst\app\swms\new\page.tsx
E:\signonsitev2\safetyfirst\components\connect-oauth.tsx
E:\signonsitev2\safetyfirst\components\date-range-picker.tsx
E:\signonsitev2\safetyfirst\components\google-drive-documents.tsx
E:\signonsitev2\safetyfirst\components\header.tsx
E:\signonsitev2\safetyfirst\components\job-site-attendances.tsx
E:\signonsitev2\safetyfirst\components\job-site-cards.tsx
E:\signonsitev2\safetyfirst\components\mobile-provider-wrapper.tsx
E:\signonsitev2\safetyfirst\components\mobile-provider.tsx
E:\signonsitev2\safetyfirst\components\sidebar.tsx
E:\signonsitev2\safetyfirst\components\signature-canvas.tsx
E:\signonsitev2\safetyfirst\components\theme-provider.tsx
E:\signonsitev2\safetyfirst\components\user-menu.tsx
E:\signonsitev2\safetyfirst\components\ui\accordion.tsx
E:\signonsitev2\safetyfirst\components\ui\alert-dialog.tsx
E:\signonsitev2\safetyfirst\components\ui\alert.tsx
E:\signonsitev2\safetyfirst\components\ui\aspect-ratio.tsx
E:\signonsitev2\safetyfirst\components\ui\avatar.tsx
E:\signonsitev2\safetyfirst\components\ui\badge.tsx
E:\signonsitev2\safetyfirst\components\ui\breadcrumb.tsx
E:\signonsitev2\safetyfirst\components\ui\button.tsx
E:\signonsitev2\safetyfirst\components\ui\calendar.tsx
E:\signonsitev2\safetyfirst\components\ui\card.tsx
E:\signonsitev2\safetyfirst\components\ui\carousel.tsx
E:\signonsitev2\safetyfirst\components\ui\chart.tsx
E:\signonsitev2\safetyfirst\components\ui\checkbox.tsx
E:\signonsitev2\safetyfirst\components\ui\collapsible.tsx
E:\signonsitev2\safetyfirst\components\ui\command.tsx
E:\signonsitev2\safetyfirst\components\ui\context-menu.tsx
E:\signonsitev2\safetyfirst\components\ui\dialog.tsx
E:\signonsitev2\safetyfirst\components\ui\drawer.tsx
E:\signonsitev2\safetyfirst\components\ui\dropdown-menu.tsx
E:\signonsitev2\safetyfirst\components\ui\form.tsx
E:\signonsitev2\safetyfirst\components\ui\hover-card.tsx
E:\signonsitev2\safetyfirst\components\ui\input-otp.tsx
E:\signonsitev2\safetyfirst\components\ui\input.tsx
E:\signonsitev2\safetyfirst\components\ui\label.tsx
E:\signonsitev2\safetyfirst\components\ui\menubar.tsx
E:\signonsitev2\safetyfirst\components\ui\navigation-menu.tsx
E:\signonsitev2\safetyfirst\components\ui\pagination.tsx
E:\signonsitev2\safetyfirst\components\ui\popover.tsx
E:\signonsitev2\safetyfirst\components\ui\progress.tsx
E:\signonsitev2\safetyfirst\components\ui\radio-group.tsx
E:\signonsitev2\safetyfirst\components\ui\resizable.tsx
E:\signonsitev2\safetyfirst\components\ui\scroll-area.tsx
E:\signonsitev2\safetyfirst\components\ui\select.tsx
E:\signonsitev2\safetyfirst\components\ui\separator.tsx
E:\signonsitev2\safetyfirst\components\ui\sheet.tsx
E:\signonsitev2\safetyfirst\components\ui\sidebar.tsx
E:\signonsitev2\safetyfirst\components\ui\skeleton.tsx
E:\signonsitev2\safetyfirst\components\ui\slider.tsx
E:\signonsitev2\safetyfirst\components\ui\sonner.tsx
E:\signonsitev2\safetyfirst\components\ui\switch.tsx
E:\signonsitev2\safetyfirst\components\ui\table.tsx
E:\signonsitev2\safetyfirst\components\ui\tabs.tsx
E:\signonsitev2\safetyfirst\components\ui\textarea.tsx
E:\signonsitev2\safetyfirst\components\ui\toast.tsx
E:\signonsitev2\safetyfirst\components\ui\toaster.tsx
E:\signonsitev2\safetyfirst\components\ui\toggle-group.tsx
E:\signonsitev2\safetyfirst\components\ui\toggle.tsx
E:\signonsitev2\safetyfirst\components\ui\tooltip.tsx
E:\signonsitev2\safetyfirst\components\ui\use-mobile.tsx
E:\signonsitev2\safetyfirst\components\ui\use-toast.ts
E:\signonsitev2\safetyfirst\hooks\use-mobile.ts
E:\signonsitev2\safetyfirst\hooks\use-toast.ts
E:\signonsitev2\safetyfirst\lib\api-client.ts
E:\signonsitev2\safetyfirst\lib\auth-provider.tsx
E:\signonsitev2\safetyfirst\lib\auth-server.ts
E:\signonsitev2\safetyfirst\lib\auth-utils.ts
E:\signonsitev2\safetyfirst\lib\db.ts
E:\signonsitev2\safetyfirst\lib\neon-jwt-integration.ts
E:\signonsitev2\safetyfirst\lib\oauth-utils.ts
E:\signonsitev2\safetyfirst\lib\onboarding.ts
E:\signonsitev2\safetyfirst\lib\prisma.ts
E:\signonsitev2\safetyfirst\lib\server-onboarding.ts
E:\signonsitev2\safetyfirst\lib\stack-auth-config.ts
E:\signonsitev2\safetyfirst\lib\stack-auth-provider.tsx
E:\signonsitev2\safetyfirst\lib\stack-auth.ts
E:\signonsitev2\safetyfirst\lib\use-auth.tsx
E:\signonsitev2\safetyfirst\lib\user-metadata.ts
E:\signonsitev2\safetyfirst\lib\utils.ts
E:\signonsitev2\safetyfirst\lib\weekly-report.ts
E:\signonsitev2\safetyfirst\lib\db\auth-db.ts
E:\signonsitev2\safetyfirst\lib\db\client-component.tsx
E:\signonsitev2\safetyfirst\lib\db\neon-rls.ts
E:\signonsitev2\safetyfirst\lib\db\server-component.tsx
E:\signonsitev2\safetyfirst\lib\db\server-queries.ts
E:\signonsitev2\safetyfirst\lib\hooks\use-authenticated-db.ts
E:\signonsitev2\safetyfirst\prisma\schema.prisma
E:\signonsitev2\safetyfirst\prisma\seed.ts
E:\signonsitev2\safetyfirst\prisma\migrations\migration_lock.toml
E:\signonsitev2\safetyfirst\prisma\migrations\20250313032003_init\migration.sql
E:\signonsitev2\safetyfirst\public\placeholder-logo.png
E:\signonsitev2\safetyfirst\public\placeholder-logo.svg
E:\signonsitev2\safetyfirst\public\placeholder-user.jpg
E:\signonsitev2\safetyfirst\public\placeholder.jpg
E:\signonsitev2\safetyfirst\public\placeholder.svg
E:\signonsitev2\safetyfirst\scripts\apply-rls-policies.ts
E:\signonsitev2\safetyfirst\scripts\setup-db.ts
E:\signonsitev2\safetyfirst\scripts\setup-neon-rls.ts
E:\signonsitev2\safetyfirst\scripts\setup-rls.ts
E:\signonsitev2\safetyfirst\styles\globals.css
E:\signonsitev2\safetyfirst\workflows\neon_workflow.yml



```

## file_tree.txt

```plaintext

```

## hooks\use-mobile.ts

```typescript
// safetyfirst/hooks/use-mobile.ts
"use client"

// Re-export the useMobile hook from the mobile-provider
export { useMobile } from "@/components/mobile-provider"

export function useIsMobile() {
    // Example implementation
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }
  

```

## hooks\use-toast.ts

```typescript
// safetyfirst/hooks/use-toast.ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }


```

## lib\api-client.ts

```typescript
// safetyfirst/lib/api-client.ts
"use client"

import { useState, useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { getClientAuthenticatedNeonDb } from "@/lib/db/neon-rls"

export function useAuthenticatedDb<T = any>(query: string, params: any[] = [], dependencies: any[] = []) {
  const user = useUser()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        if (!user) {
          throw new Error("User is not authenticated")
        }

        // Get the auth token
        const { accessToken } = await user.getAuthJson()

        if (!accessToken) {
          throw new Error("Access token is missing")
        }

        // Get the authenticated database connection
        const sql = getClientAuthenticatedNeonDb(accessToken)

        // Execute the query
        const result = await sql(query, ...params)

        setData(result as T)
        setError(null)
      } catch (err) {
        console.error("Error executing authenticated query:", err)
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, user, ...dependencies])

  return { data, loading, error }
}


```

## lib\auth-provider.tsx

```tsx
// safetyfirst/lib/auth-provider.tsx
"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name?: string
  email: string
  role: "USER" | "ADMIN" | "CEO"
  company?: string
  position?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  token: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, company?: string, position?: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)

            // Get token from cookie
            const authToken = document.cookie
              .split("; ")
              .find((row) => row.startsWith("auth-token="))
              ?.split("=")[1]

            if (authToken) {
              setToken(authToken)
            }
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in")
      }

      setUser(data.user)

      // Get token from cookie after login
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      if (authToken) {
        setToken(authToken)
      }

      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${data.user.name || "User"}!`,
      })

      // Get the callback URL from the query parameters if available
      const urlParams = new URLSearchParams(window.location.search)
      const callbackUrl = urlParams.get("callbackUrl") || "/dashboard"

      // Force a hard navigation instead of client-side routing
      window.location.href = callbackUrl
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      })
      throw error // Re-throw the error so the login component can handle it
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string, company?: string, position?: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, company, position }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up")
      }

      setUser(data.user)

      // Get token from cookie after registration
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      if (authToken) {
        setToken(authToken)
      }

      toast({
        title: "Account created successfully",
        description: `Welcome, ${name}!`,
      })

      // Force a hard navigation instead of client-side routing
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again with different credentials.",
      })
      throw error // Re-throw the error so the signup component can handle it
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      setUser(null)
      setToken(null)

      // Force a hard navigation instead of client-side routing
      window.location.href = "/"

      toast({
        title: "Signed out successfully",
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  )
}



```

## lib\auth-server.ts

```typescript
// safetyfirst/lib/auth-server.ts
import { headers } from "next/headers"
import { createRemoteJWKSet, jwtVerify } from "jose"

const JWKS_CACHE_TTL = 60 * 60 * 1000 // 1 hour cache
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null
let cacheTimestamp = 0

export interface VerifiedUser {
  id: string
  email?: string
  name?: string
  roles?: string[]
}

export async function verifyAuthToken(): Promise<VerifiedUser | null> {
  try {
    // Await the headers() to resolve the promise
    const headersList = await headers()
    const accessToken = headersList.get("x-stack-access-token")

    if (!accessToken?.startsWith("Bearer ")) return null

    const token = accessToken.split(" ")[1]
    
    // Refresh JWKS cache if needed
    if (!jwksCache || Date.now() - cacheTimestamp > JWKS_CACHE_TTL) {
      const projectId = process.env.STACK_PROJECT_ID
      if (!projectId) throw new Error("Missing STACK_PROJECT_ID")
      
      jwksCache = createRemoteJWKSet(
        new URL(`https://api.stack-auth.com/api/v1/projects/83d8c330-6a21-48d7-a06b-15ee669f4292/.well-known/jwks.json`)
      )
      cacheTimestamp = Date.now()
    }

    const { payload } = await jwtVerify(token, jwksCache, {
      issuer: "stack-auth",
      audience: "api"
    })

    // Type assertion here to ensure payload has the correct type
    return {
      id: (payload as any).sub!,
      email: (payload as any).email,
      name: (payload as any).name,
      roles: (payload as any).roles || []
    }
  } catch (error) {
    console.error("Auth verification failed:", error)
    return null
  }
}


```

## lib\auth-utils.ts

```typescript
// safetyfirst/lib/auth-utils.ts
import { verify } from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get basic user information from a request
 */
export async function getUserFromRequest(request: Request) {
  try {
    // For API routes, get the token from the cookie in the request
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(token, process.env.JWT_SECRET || "fallback-secret") as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        displayName: true,
        email: true,
        authMethod: true,
      }
    });

    return user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

/**
 * Get user details from request
 */
export async function getUserDetailsFromRequest(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(token, process.env.JWT_SECRET || "fallback-secret") as { id: string };

    // Find the user first
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return null;

    // Then find the user details using the userId field
    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: user.id },
    });

    return userDetails;
  } catch (error) {
    console.error("Error getting user details from request:", error);
    return null;
  }
}

/**
 * Get complete user profile with details
 */
export async function getCompleteUserProfile(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(token, process.env.JWT_SECRET || "fallback-secret") as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        details: true // This is the correct field name from your schema
      }
    });

    return user;
  } catch (error) {
    console.error("Error getting complete user profile:", error);
    return null;
  }
}

// Helper function to parse cookies from header
function parseCookies(cookieHeader: string) {
  return cookieHeader.split(";").reduce(
    (cookies, cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(value);
      return cookies;
    },
    {} as Record<string, string>,
  );
}

```

## lib\db\auth-db.ts

```typescript
// safetyfirst/lib/db/auth-db.ts
import { neon } from "@neondatabase/serverless"
import { verify } from "jsonwebtoken"

// Server-side authenticated database connection
export async function getServerAuthDb(token: string) {
  try {
    // Verify the token to ensure it's valid
    verify(token, process.env.JWT_SECRET || "fallback-secret")

    // Create a connection with the token as auth
    const sql = neon(process.env.DATABASE_AUTHENTICATED_URL!, {
      authToken: () => token,
    })

    return sql
  } catch (error) {
    console.error("Invalid token for database connection:", error)
    throw new Error("Authentication failed for database connection")
  }
}

// Client-side authenticated database connection
export function getClientAuthDb(token: string) {
  try {
    // Create a connection with the token as auth
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL!, {
      authToken: () => token,
    })

    return sql
  } catch (error) {
    console.error("Error creating client database connection:", error)
    throw new Error("Failed to create client database connection")
  }
}



```

## lib\db\client-component.tsx

```tsx
// safetyfirst/lib/db/client-component.tsx
"use client"

import { useAuth } from "@/lib/use-auth"
import { useEffect, useState } from "react"
import { getClientAuthDb } from "./auth-db"

export function useAuthenticatedNeon<T>(query: string, dependencies: any[] = []) {
  const { user } = useAuth()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Get the token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-token="))
          ?.split("=")[1]

        if (!token) {
          throw new Error("No authentication token found")
        }

        // Get authenticated database connection
        const sql = getClientAuthDb(token)

        // Execute the query
        const result = await sql(query)

        setData(result as T[])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, user, ...dependencies])

  return { data, loading, error }
}

export function useJobSites() {
  return useAuthenticatedNeon("SELECT * FROM job_sites WHERE user_id = auth.uid() ORDER BY created_at DESC")
}

export function useWorkers() {
  return useAuthenticatedNeon(
    `SELECT * FROM workers 
     WHERE company_id IN (
       SELECT company_id FROM user_companies 
       WHERE user_id = auth.uid()
     )
     ORDER BY name ASC`,
  )
}

export function useSiteAttendance(siteId: string) {
  return useAuthenticatedNeon(
    `SELECT a.*, u.name, u.email 
     FROM attendances a
     JOIN users u ON a.user_id = u.id
     WHERE a.job_site_id = '${siteId}'
     ORDER BY a.sign_in_time DESC`,
    [siteId],
  )
}



```

## lib\db\neon-rls.ts

```typescript
// safetyfirst/lib/db/neon-rls.ts
import { neon } from "@neondatabase/serverless"
import { stackServerApp } from "@/lib/stack-auth"


export function getClientAuthenticatedNeonDb(accessToken: string) {
  const dbUrl = process.env.DATABASE_AUTHENTICATED_URL

  if (!dbUrl) {
    throw new Error("Database URL is not defined in the environment variables")
  }

  // Return the authenticated connection for the client
  return neon(dbUrl, {
    authToken: async () => accessToken,
  })
}

// Function to get the authenticated database connection for server components
export async function getAuthenticatedNeonDb(userId?: string) {
  try {
    // Step 1: Fetch the user based on the provided userId or the current session
    const user = userId 
      ? await stackServerApp.getUser(userId) 
      : await stackServerApp.getUser()

    if (!user) {
      throw new Error("No authenticated user found")
    }

    // Step 2: Retrieve the access token from the user or session
    const accessToken = await getAccessToken(user)

    if (!accessToken) {
      throw new Error("No access token found")
    }

    // Step 3: Create and return the authenticated Neon DB connection using the access token
    return neon(process.env.DATABASE_AUTHENTICATED_URL!, {
      authToken: async () => accessToken,
    })
  } catch (error) {
    console.error("Error getting authenticated database connection:", error)
    throw new Error("Failed to establish authenticated database connection")
  }
}

// Helper function to extract the access token from the user
async function getAccessToken(user: any) {
  // Option 1: Check if the accessToken exists directly in the user object (adjust based on your implementation)
  if (user?.accessToken) {
    return user.accessToken
  }

  // Option 2: If accessToken is stored in the session or another property
  // Make sure to adjust this based on how your user data is structured
  if (user?.session?.accessToken) {
    return user.session.accessToken
  }

  // Option 3: If the token is generated through a different method, implement it here
  // For example, if you need to request the token from an API or refresh token mechanism
  const token = await getTokenFromApi(user.id)
  return token
}

// Placeholder function for token retrieval from an external API
async function getTokenFromApi(userId: string) {
  // Logic to request the token from an API or another service
  // This will depend on how your authentication service is set up
  // Example:
  const response = await fetch(`/api/get-token?userId=${userId}`)
  const data = await response.json()
  return data.accessToken
}


```

## lib\db\server-component.tsx

```tsx
// safetyfirst/lib/db/server-component.tsx
import { cookies } from "next/headers"
import { getServerAuthDb } from "./auth-db"
import { prisma } from "@/lib/prisma"

// Fix the cookies issue by awaiting the cookies() function
export async function getAuthenticatedNeon() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    throw new Error("No authentication token found")
  }

  return getServerAuthDb(token)
}

export async function getJobSites() {
  try {
    const sql = await getAuthenticatedNeon()

    // Using RLS, this will only return job sites the user has access to
    const jobSites = await sql`
      SELECT * FROM job_sites 
      WHERE user_id = auth.uid()
      ORDER BY created_at DESC
    `

    return jobSites
  } catch (error) {
    console.error("Error fetching job sites with authenticated connection:", error)

    // Fallback to Prisma if RLS is not set up yet or the user schema doesn't support it
    console.log("Falling back to Prisma for job sites")
    return prisma.jobSite.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}

export async function getWorkers() {
  try {
    const sql = await getAuthenticatedNeon()

    // Using RLS, this will only return workers the user has access to
    const workers = await sql`
      SELECT * FROM workers 
      WHERE company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid()
      )
      ORDER BY name ASC
    `

    return workers
  } catch (error) {
    console.error("Error fetching workers with authenticated connection:", error)

    // Fallback to Prisma if RLS is not set up yet or if we don't need to access role or name directly
    console.log("Falling back to Prisma for workers")
    return prisma.user.findMany({
      orderBy: {
        // Avoiding "role" and "name" and just returning users without filtering by "role"
        signedUpAt: "desc", // Use a field that exists in your Prisma model for ordering
      },
    })
  }
}

export async function getSiteAttendance(siteId: string) {
  try {
    const sql = await getAuthenticatedNeon()

    // Using RLS, this will only return attendance records the user has access to
    const attendance = await sql`
      SELECT a.*, u.name, u.email 
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      WHERE a.job_site_id = ${siteId}
      ORDER BY a.sign_in_time DESC
    `

    return attendance
  } catch (error) {
    console.error("Error fetching site attendance with authenticated connection:", error)

    // Fallback to Prisma if RLS is not set up yet
    console.log("Falling back to Prisma for site attendance")
    return prisma.attendance.findMany({
      where: {
        jobSiteId: siteId,
      },
      include: {
        user: {
          select: {
            user: true,
            
          },
        },
      },
      orderBy: {
        signInTime: "desc",
      },
    })
  }
}


```

## lib\db\server-queries.ts

```typescript
// safetyfirst/lib/db/server-queries.ts
import { getAuthenticatedNeonDb } from "./neon-rls"

// Function to get job sites for the current user
export async function getUserJobSites() {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will automatically filter to show only the job sites the user has access to
    return await sql`
      SELECT * FROM job_sites
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Error fetching user job sites:", error)
    throw error
  }
}

// Function to get a specific job site
export async function getJobSite(jobSiteId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure the user has access to this job site
    const results = await sql`
      SELECT * FROM job_sites
      WHERE id = ${jobSiteId}
    `

    return results[0] || null
  } catch (error) {
    console.error(`Error fetching job site ${jobSiteId}:`, error)
    throw error
  }
}

// Function to get attendances for a job site
export async function getJobSiteAttendances(jobSiteId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure the user only sees attendances they're allowed to see
    return await sql`
      SELECT a.*, u.name, u.email
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      WHERE a.job_site_id = ${jobSiteId}
      ORDER BY a.sign_in_time DESC
    `
  } catch (error) {
    console.error(`Error fetching attendances for job site ${jobSiteId}:`, error)
    throw error
  }
}

// Function to get inductions for a job site
export async function getJobSiteInductions(jobSiteId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure the user only sees inductions they're allowed to see
    return await sql`
      SELECT i.*, 
        (SELECT COUNT(*) FROM induction_completions ic WHERE ic.induction_id = i.id) as completion_count
      FROM inductions i
      WHERE i.job_site_id = ${jobSiteId}
      ORDER BY i.created_at DESC
    `
  } catch (error) {
    console.error(`Error fetching inductions for job site ${jobSiteId}:`, error)
    throw error
  }
}

// Function to check if a user has completed an induction
export async function hasUserCompletedInduction(inductionId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure we're only checking the current user's completions
    const results = await sql`
      SELECT * FROM induction_completions
      WHERE induction_id = ${inductionId}
      AND user_id = auth.user_id()
    `

    return results.length > 0
  } catch (error) {
    console.error(`Error checking induction completion for ${inductionId}:`, error)
    throw error
  }
}

// Function to get SWMS for a job site
export async function getJobSiteSwms(jobSiteId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure the user only sees SWMS they're allowed to see
    return await sql`
      SELECT s.*, 
        (SELECT COUNT(*) FROM swms_signoffs ss WHERE ss.swms_id = s.id) as signoff_count
      FROM swms s
      WHERE s.job_site_id = ${jobSiteId}
      ORDER BY s.created_at DESC
    `
  } catch (error) {
    console.error(`Error fetching SWMS for job site ${jobSiteId}:`, error)
    throw error
  }
}

// Function to check if a user has signed off on a SWMS
export async function hasUserSignedSwms(swmsId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure we're only checking the current user's signoffs
    const results = await sql`
      SELECT * FROM swms_signoffs
      WHERE swms_id = ${swmsId}
      AND user_id = auth.user_id()
    `

    return results.length > 0
  } catch (error) {
    console.error(`Error checking SWMS signoff for ${swmsId}:`, error)
    throw error
  }
}

// Function for admins to get all users
export async function getAllUsers() {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure only admins can execute this query successfully
    return await sql`
      SELECT * FROM users
      ORDER BY name ASC
    `
  } catch (error) {
    console.error("Error fetching all users:", error)
    throw error
  }
}



```

## lib\db.ts

```typescript
// safetyfirst/lib/db.ts
// This is a mock database service
// In a real app, you would use Prisma, Drizzle, or another ORM to connect to your Railway database

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  createdAt: Date
}

export interface Induction {
  id: string
  title: string
  description: string
  status: "draft" | "active" | "archived"
  sections: InductionSection[]
  createdAt: Date
  createdBy: string
  requiresSignature: boolean
  expiryDays: number
}

export interface InductionSection {
  id: string
  title: string
  content: string
  order: number
}

export interface SWMS {
  id: string
  title: string
  location: string
  description: string
  company: string
  supervisor: string
  status: "draft" | "pending" | "approved" | "rejected"
  hazards: Hazard[]
  signature: string | null
  submittedBy: string
  submittedDate: Date
  approvedBy: string | null
  approvedDate: Date | null
}

export interface Hazard {
  id: string
  description: string
  controls: string
  riskLevel: "low" | "medium" | "high" | "extreme"
}

// In a real app, you would implement actual database operations here
// For this demo, we're just providing the interface definitions



```

## lib\hooks\use-authenticated-db.ts

```typescript
// safetyfirst/lib/hooks/use-authenticated-db.ts
"use client"

import { useState, useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { getClientAuthenticatedNeonDb } from "@/lib/db/neon-rls"

export function useAuthenticatedDb<T = any>(query: string, params: any[] = [], dependencies: any[] = []) {
  const user = useUser()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Check if user exists and if user has the accessToken
        if (!user || !user.getAuthJson) {
          throw new Error("User or authJson is missing")
        }

        const { accessToken } = await user.getAuthJson()

        // Ensure accessToken is not null
        if (!accessToken) {
          throw new Error("No access token found")
        }

        // Get the authenticated database connection
        const sql = getClientAuthenticatedNeonDb(accessToken)

        // Execute the query
        const result = await sql(query, ...params)

        setData(result as T)
        setError(null)
      } catch (err) {
        console.error("Error executing authenticated query:", err)
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, user, ...dependencies])

  return { data, loading, error }
}


```

## lib\neon-jwt-integration.ts

```typescript
// safetyfirst/lib/neon-jwt-integration.ts
/**
 * Neon Database and JWT Integration Guide
 *
 * This file provides guidance on integrating JWT authentication with Neon Database's Row-Level Security (RLS).
 *
 * For your current application, you don't need to implement this unless you specifically want to use
 * Neon's Row-Level Security features. Your current JWT implementation is sufficient for authentication
 * in your application.
 *
 * If you decide to implement RLS in the future, here's how you would do it:
 */

import { generateKeyPair, SignJWT } from "jose"

/**
 * Generate RSA key pair for JWT signing and verification
 */
export async function generateKeys() {
  const { publicKey, privateKey } = await generateKeyPair("RS256")

  // The privateKey should be stored securely in your environment variables
  // The publicKey should be uploaded to Neon for verification

  return { publicKey, privateKey }
}

/**
 * Sign a JWT with the private key
 */
export async function signJWT(payload: any, privateKey: any) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(privateKey)

  return jwt
}

/**
 * Implementation Steps for Neon RLS:
 *
 * 1. Generate key pair and store private key securely
 * 2. Upload public key to Neon
 * 3. Create RLS policies in your database
 * 4. Modify your JWT payload to include claims needed by RLS policies
 * 5. Use the JWT in your database connection
 *
 * Example RLS policy:
 *
 * CREATE POLICY user_isolation ON users
 * USING (id = current_setting('request.jwt.claims')::json->>'user_id');
 *
 * This would restrict users to only seeing their own data.
 */



```

## lib\oauth-utils.ts

```typescript
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


```

## lib\onboarding.ts

```typescript
// safetyfirst/lib/onboarding.ts
"use client";

import { useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter, usePathname } from "next/navigation";

// Paths that don't require onboarding
const EXEMPT_PATHS = [
  "/onboarding",
  "/auth/login",
  "/auth/register",
  "/auth/stack-login",
  "/auth/stack-register",
  "/auth/forgot-password",
];

export function useRequireOnboarding() {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return; // Ensure user is loaded

    // Skip if we're already on an exempt path
    if (EXEMPT_PATHS.some((path) => pathname?.startsWith(path))) {
      return;
    }

    // Redirect to onboarding if user is not onboarded
    if (!user?.clientMetadata?.onboarded) {
      router.push("/onboarding");
    }
  }, [user, router, pathname]);

  return { isOnboarded: user?.clientMetadata?.onboarded === true };
}


```

## lib\prisma.ts

```typescript
// safetyfirst/lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma



```

## lib\server-onboarding.ts

```typescript
// safetyfirst/lib/server-onboarding.ts
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { stackServerApp } from "@/lib/stack-auth"
import { verify } from "jsonwebtoken"

// Paths that don't require onboarding
const EXEMPT_PATHS = [
  "/onboarding",
  "/auth/login",
  "/auth/register",
  "/auth/stack-login",
  "/auth/stack-register",
  "/auth/forgot-password",
]

export async function ensureOnboarded(currentPath: string) {
  // Skip if we're already on an exempt path
  if (EXEMPT_PATHS.some((path) => currentPath.startsWith(path))) {
    return true
  }

  try {
    // Get the session token from cookies
    const cookieStore = await cookies() // Await the promise
    const sessionToken = cookieStore.get("auth-session")?.value

    if (!sessionToken) {
      redirect("/auth/stack-login")
      return false // To ensure no further code is executed after the redirect
    }

    // Verify the token
    const decoded = verify(sessionToken, process.env.STACK_SECRET_SERVER_KEY || "") as { sub: string }
    const userId = decoded.sub

    // Get the user
    const user = await stackServerApp.getUser(userId)

    if (!user) {
      // Handle case where user is not found
      console.error("User not found")
      redirect("/auth/stack-login")
      return false
    }

    // Check if user is onboarded
    const isOnboarded = user.serverMetadata?.onboardingCompleted === true

    if (!isOnboarded) {
      redirect("/onboarding")
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking onboarding status:", error)
    redirect("/auth/stack-login")
    return false
  }
}


```

## lib\stack-auth-config.ts

```typescript
// safetyfirst/lib/stack-auth-config.ts
import { StackClientApp } from "@stackframe/stack"

// Initialize the Stack client app
export const stackClient = new StackClientApp({
  tokenStore: "nextjs-cookie", // Store the token in cookies (adjust as needed)
  baseUrl: "https://api.stack-auth.com", // Optional: specify the base URL if different
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || "", // Your project ID
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_KEY || "", // Your publishable client key
  urls: {
    home: "/",
    // Add other URLs as required
  },
})

// Hook for accessing Stack Auth in client components
export function useStackAuth() {
  return stackClient
}


```

## lib\stack-auth-provider.tsx

```tsx
// safetyfirst/lib/stack-auth-provider.tsx
"use client"

import { StackProvider } from "@stackframe/stack"
import { getStackClientConfig } from "./stack-auth"
import type { ReactNode } from "react"

export function StackAuthProvider({ children }: { children: ReactNode }) {
  const stackClient = getStackClientConfig()

  return <StackProvider app={stackClient}>{children}</StackProvider>
}



```

## lib\stack-auth.ts

```typescript
// safetyfirst/lib/stack-auth.ts
import { StackClientApp, StackServerApp } from "@stackframe/stack";

// Client-side Stack configuration
export function getStackClientConfig() {
  return new StackClientApp({
    tokenStore: "nextjs-cookie", // Token storage for the client-side
    baseUrl: "https://api.stack-auth.com", // Stack Auth API URL
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || "",
    publishableClientKey: process.env.NEXT_PUBLIC_STACK_CLIENT_KEY || "",
    urls: {
      home: "/",
    },
  });
}

// Server-side Stack configuration (with elevated permissions)
export const stackServerApp = new StackServerApp({
  tokenStore: "cookie", // Ensure token store is defined for server-side use
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY || "", // Secret key for server use
});

// Hook for client components to access Stack Auth
export function useStackAuth() {
  return getStackClientConfig();
}


```

## lib\use-auth.tsx

```tsx
// safetyfirst/lib/use-auth.tsx
"use client"

import { useContext } from "react"
import { AuthContext } from "./auth-provider"

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}



```

## lib\user-metadata.ts

```typescript
// safetyfirst/lib/user-metadata.ts
import { stackServerApp } from "@/lib/stack-auth";
import { User, UserDetails, Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { CurrentUser } from "@stackframe/stack"; // Import the CurrentUser type

// Types for custom user metadata
export interface UserClientMetadata {
  preferredJobSite?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  onboarded?: boolean;
  lastActiveAt?: string;
}

export interface UserClientReadOnlyMetadata {
  role: Role;
  accountStatus: "active" | "suspended" | "pending";
  companyName?: string;
  jobTitle?: string;
}

// Update user details in Prisma database
export async function updateUserDetails(userId: string, data: {
  company?: string;
  position?: string;
  phone?: string;
  role?: Role;
}) {
  return await prisma.userDetails.update({
    where: { userId },
    data
  });
}

// Client-side function for updating user client metadata in Stack
export async function updateUserClientMetadata(
  user: CurrentUser | null,
  data: Partial<UserClientMetadata>
) {
  if (!user) throw new Error("User not found");

  // Use an API route to update Stack metadata
  const response = await fetch(`/api/user/client-metadata`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.id,
      metadata: data
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user metadata');
  }
  
  return await response.json();
}

// Create or update a user's profile with all details
export async function initializeUserProfile(
  userId: string,
  userData: {
    role?: Role;
    company?: string;
    position?: string;
    phone?: string;
  },
  clientMetadata?: Partial<UserClientMetadata>,
  clientReadOnlyMetadata?: Partial<UserClientReadOnlyMetadata>
) {
  // First, create or update the UserDetails record in Prisma
  const userDetails = await prisma.userDetails.upsert({
    where: { userId },
    update: {
      role: userData.role || Role.USER,
      company: userData.company,
      position: userData.position,
      phone: userData.phone,
    },
    create: {
      userId,
      role: userData.role || Role.USER,
      company: userData.company,
      position: userData.position,
      phone: userData.phone,
    },
  });
  
  // Then update the Stack user metadata via API
  const response = await fetch(`/api/user/initialize-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      clientMetadata: clientMetadata || {
        onboarded: false,
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
        },
        lastActiveAt: new Date().toISOString(),
      },
      clientReadOnlyMetadata: clientReadOnlyMetadata || {
        role: userData.role || Role.USER,
        accountStatus: "pending",
        companyName: userData.company,
        jobTitle: userData.position,
      }
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to initialize user profile');
  }
  
  return userDetails;
}

// Update Prisma and Stack metadata in one function
export async function updateUserProfile(
  user: CurrentUser | null,
  prismaData: {
    company?: string;
    position?: string;
    phone?: string;
    role?: Role;
  },
  stackData: Partial<UserClientMetadata>
) {
  if (!user) throw new Error("User not found");
  
  // Update Prisma database
  const userDetails = await prisma.userDetails.update({
    where: { userId: user.id },
    data: prismaData
  });
  
  // Update Stack metadata
  await updateUserClientMetadata(user, stackData);
  
  return userDetails;
}

```

## lib\utils.ts

```typescript
// safetyfirst/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


```

## lib\weekly-report.ts

```typescript
// safetyfirst/lib/weekly-report.ts
import { prisma } from "./prisma"
import { startOfWeek, endOfWeek, format } from "date-fns"
import nodemailer from "nodemailer"

export async function generateWeeklyReport() {
  try {
    // Get the start and end of the current week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday as start of week
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

    // Format dates for display
    const weekStartFormatted = format(weekStart, "yyyy-MM-dd")
    const weekEndFormatted = format(weekEnd, "yyyy-MM-dd")

    // Get all job sites
    const jobSites = await prisma.jobSite.findMany({
      include: {
        attendances: {
          where: {
            signInTime: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
          include: {
            user: true,
          },
        },
        inductions: {
          include: {
            completions: {
              where: {
                completedAt: {
                  gte: weekStart,
                  lte: weekEnd,
                },
              },
            },
          },
        },
        swms: {
          include: {
            signoffs: {
              where: {
                signedAt: {
                  gte: weekStart,
                  lte: weekEnd,
                },
              },
            },
          },
        },
      },
    })

    // Calculate statistics
    const totalAttendances = jobSites.reduce((total, site) => total + site.attendances.length, 0)

    const uniqueWorkers = new Set()
    jobSites.forEach((site) => {
      site.attendances.forEach((attendance) => {
        uniqueWorkers.add(attendance.userId)
      })
    })

    const totalInductionsCompleted = jobSites.reduce(
      (total, site) =>
        total + site.inductions.reduce((siteTotal, induction) => siteTotal + induction.completions.length, 0),
      0,
    )

    const totalSwmsSigned = jobSites.reduce(
      (total, site) => total + site.swms.reduce((siteTotal, swms) => siteTotal + swms.signoffs.length, 0),
      0,
    )

    // Calculate total hours worked
    let totalHoursWorked = 0
    jobSites.forEach((site) => {
      site.attendances.forEach((attendance) => {
        if (attendance.signOutTime) {
          const signInTime = new Date(attendance.signInTime).getTime()
          const signOutTime = new Date(attendance.signOutTime).getTime()
          const durationHours = (signOutTime - signInTime) / (1000 * 60 * 60)
          totalHoursWorked += durationHours
        }
      })
    })

    // Prepare site-specific data
    const siteData = jobSites.map((site) => {
      const siteHours = site.attendances.reduce((total, attendance) => {
        if (!attendance.signOutTime) return total

        const signInTime = new Date(attendance.signInTime).getTime()
        const signOutTime = new Date(attendance.signOutTime).getTime()
        const durationHours = (signOutTime - signInTime) / (1000 * 60 * 60)

        return total + durationHours
      }, 0)

      return {
        name: site.name,
        attendances: site.attendances.length,
        uniqueWorkers: new Set(site.attendances.map((a) => a.userId)).size,
        hoursWorked: siteHours,
        inductionsCompleted: site.inductions.reduce((total, induction) => total + induction.completions.length, 0),
        swmsSigned: site.swms.reduce((total, swms) => total + swms.signoffs.length, 0),
      }
    })

    // Create report data
    const reportData = {
      weekStarting: weekStartFormatted,
      weekEnding: weekEndFormatted,
      totalAttendances,
      uniqueWorkers: uniqueWorkers.size,
      totalHoursWorked,
      totalInductionsCompleted,
      totalSwmsSigned,
      sites: siteData,
    }

    // Save report to database
    const reports = await prisma.weeklyReport.findMany({
      data: {
        weekStarting: weekStart,
        weekEnding: weekEnd,
        reportData: reportData as any,
        sentTo: [process.env.REPORT_EMAIL || "admin@example.com"],
      },
    })

    // Create email transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Generate HTML content
    const htmlContent = `
    <h1>Weekly Site Activity Report</h1>
    <p>Week: ${reportData.weekStarting} to ${reportData.weekEnding}</p>
    
    <h2>Summary</h2>
    <ul>
      <li>Total Attendances: ${reportData.totalAttendances}</li>
      <li>Unique Workers: ${reportData.uniqueWorkers}</li>
      <li>Total Hours Worked: ${reportData.totalHoursWorked.toFixed(1)}</li>
      <li>Inductions Completed: ${reportData.totalInductionsCompleted}</li>
      <li>SWMS Signed: ${reportData.totalSwmsSigned}</li>
    </ul>
    
    <h2>Site Breakdown</h2>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <th>Site Name</th>
        <th>Attendances</th>
        <th>Unique Workers</th>
        <th>Hours Worked</th>
        <th>Inductions</th>
        <th>SWMS</th>
      </tr>
      ${reportData.sites
        .map(
          (site: any) => `
        <tr>
          <td>${site.name}</td>
          <td>${site.attendances}</td>
          <td>${site.uniqueWorkers}</td>
          <td>${site.hoursWorked.toFixed(1)}</td>
          <td>${site.inductionsCompleted}</td>
          <td>${site.swmsSigned}</td>
        </tr>
      `,
        )
        .join("")}
    </table>
    
    <p>View detailed report in the admin dashboard.</p>
  `

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.REPORT_EMAIL,
      subject: `Weekly Site Activity Report: ${reportData.weekStarting} to ${reportData.weekEnding}`,
      html: htmlContent,
    })

    // Update report with sent timestamp
    await prisma.weeklyReport.update({
      where: { id: report.id },
      data: { sentAt: new Date() },
    })

    return { success: true, reportId: report.id }
  } catch (error) {
    console.error("Error generating weekly report:", error)
    return { success: false, error }
  }
}



```

## middleware.ts

```typescript
// safetyfirst/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// STACK AUTH API DETAILS
const STACK_AUTH_URL = process.env.STACK_AUTH_URL;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/forgot-password"];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  // If no token, redirect to login
  if (!token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  try {
    // 🔹 Verify token with Stack Auth API
    const stackAuthResponse = await fetch(`${STACK_AUTH_URL}/auth/validate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    if (!stackAuthResponse.ok) throw new Error("Invalid token");

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
}


```

## next-env.d.ts

```typescript
// safetyfirst/next-env.d.ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.


```

## package-lock.json

```json
// safetyfirst/package-lock.json
{
  "name": "my-v0-project",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "my-v0-project",
      "version": "0.1.0",
      "hasInstallScript": true,
      "dependencies": {
        "@hookform/resolvers": "^3.9.1",
        "@neondatabase/serverless": "^0.10.4",
        "@prisma/adapter-neon": "^6.5.0",
        "@radix-ui/react-accordion": "^1.2.2",
        "@radix-ui/react-alert-dialog": "^1.1.4",
        "@radix-ui/react-aspect-ratio": "^1.1.1",
        "@radix-ui/react-avatar": "^1.1.2",
        "@radix-ui/react-checkbox": "^1.1.3",
        "@radix-ui/react-collapsible": "^1.1.2",
        "@radix-ui/react-context-menu": "^2.2.4",
        "@radix-ui/react-dialog": "latest",
        "@radix-ui/react-dropdown-menu": "^2.1.4",
        "@radix-ui/react-hover-card": "^1.1.4",
        "@radix-ui/react-label": "^2.1.1",
        "@radix-ui/react-menubar": "^1.1.4",
        "@radix-ui/react-navigation-menu": "^1.2.3",
        "@radix-ui/react-popover": "latest",
        "@radix-ui/react-progress": "^1.1.1",
        "@radix-ui/react-radio-group": "^1.2.2",
        "@radix-ui/react-scroll-area": "^1.2.2",
        "@radix-ui/react-select": "^2.1.4",
        "@radix-ui/react-separator": "latest",
        "@radix-ui/react-slider": "^1.2.2",
        "@radix-ui/react-slot": "^1.1.1",
        "@radix-ui/react-switch": "^1.1.2",
        "@radix-ui/react-tabs": "^1.1.2",
        "@radix-ui/react-toast": "^1.2.4",
        "@radix-ui/react-toggle": "^1.1.1",
        "@radix-ui/react-toggle-group": "^1.1.1",
        "@radix-ui/react-tooltip": "latest",
        "@stackframe/init-stack": "^2.7.27",
        "@tailwindcss/forms": "latest",
        "autoprefixer": "^10.4.20",
        "bcryptjs": "latest",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "cmdk": "1.0.4",
        "date-fns": "latest",
        "embla-carousel-react": "8.5.1",
        "input-otp": "1.4.1",
        "jsonwebtoken": "latest",
        "lucide-react": "^0.454.0",
        "next": "15.2.2",
        "next-auth": "^4.24.11",
        "next-themes": "latest",
        "nodemailer": "latest",
        "prisma": "^6.5.0",
        "react": "^18.3.1",
        "react-day-picker": "latest",
        "react-dom": "^18.3.1",
        "react-hook-form": "^7.54.1",
        "react-resizable-panels": "^2.1.7",
        "recharts": "2.15.0",
        "sonner": "^1.7.1",
        "tailwind-merge": "^2.5.5",
        "tailwindcss": "latest",
        "tailwindcss-animate": "^1.0.7",
        "vaul": "^0.9.6",
        "ws": "^8.18.1",
        "zod": "^3.24.1"
      },
      "devDependencies": {
        "@prisma/client": "^6.5.0",
        "@stackframe/stack": "^2.4.8",
        "@types/bcrypt": "^5.0.2",
        "@types/jsonwebtoken": "^9.0.9",
        "@types/node": "^22.13.10",
        "@types/nodemailer": "^6.4.17",
        "@types/react": "^19.0.10",
        "@types/react-dom": "^19.0.4",
        "postcss": "^8",
        "tailwindcss": "^3.4.17",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.2"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.2.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.26.10",
      "license": "MIT",
      "dependencies": {
        "regenerator-runtime": "^0.14.0"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@cspotcode/source-map-support": {
      "version": "0.8.1",
      "resolved": "https://registry.npmjs.org/@cspotcode/source-map-support/-/source-map-support-0.8.1.tgz",
      "integrity": "sha512-IchNf6dN4tHoMFIn/7OE8LWZ19Y6q/67Bmf6vnGREv8RSbBVb9LPJxEcnwrcwX6ixSvaiGoomAUvu4YSxXrVgw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/trace-mapping": "0.3.9"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@cspotcode/source-map-support/node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.9",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.9.tgz",
      "integrity": "sha512-3Belt6tdc8bPgAtbcmdtNJlirVoTmEb5e2gC94PnkwEW9jI6CAHUeoG85tjWP5WquqfavoMtMwiG4P926ZKKuQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.0.3",
        "@jridgewell/sourcemap-codec": "^1.4.10"
      }
    },
    "node_modules/@date-fns/tz": {
      "version": "1.2.0",
      "license": "MIT"
    },
    "node_modules/@emotion/is-prop-valid": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/@emotion/is-prop-valid/-/is-prop-valid-1.2.2.tgz",
      "integrity": "sha512-uNsoYd37AFmaCdXlg6EYD1KaPOaRWRByMCYzbKUX4+hhMfrxdVSelShywL4JVaAeM/eHUOSprYBQls+/neX3pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@emotion/memoize": "^0.8.1"
      }
    },
    "node_modules/@emotion/memoize": {
      "version": "0.8.1",
      "resolved": "https://registry.npmjs.org/@emotion/memoize/-/memoize-0.8.1.tgz",
      "integrity": "sha512-W2P2c/VRW1/1tLox0mVUalvnWXxavmv/Oum2aPsRcoDJuob75FC3Y8FbpfLwUegRcxINtGUMPq0tFCvYNTBXNA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@emotion/unitless": {
      "version": "0.8.1",
      "resolved": "https://registry.npmjs.org/@emotion/unitless/-/unitless-0.8.1.tgz",
      "integrity": "sha512-KOEGMu6dmJZtpadb476IsZBclKvILjopjUii3V+7MnXIQCYh8W3NgNcgwo21n9LXZX6EDIKvqfjYxXebDwxKmQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.25.1",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@floating-ui/core": {
      "version": "1.6.9",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/utils": "^0.2.9"
      }
    },
    "node_modules/@floating-ui/dom": {
      "version": "1.6.13",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/core": "^1.6.0",
        "@floating-ui/utils": "^0.2.9"
      }
    },
    "node_modules/@floating-ui/react-dom": {
      "version": "2.1.2",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/dom": "^1.0.0"
      },
      "peerDependencies": {
        "react": ">=16.8.0",
        "react-dom": ">=16.8.0"
      }
    },
    "node_modules/@floating-ui/utils": {
      "version": "0.2.9",
      "license": "MIT"
    },
    "node_modules/@hookform/resolvers": {
      "version": "3.10.0",
      "license": "MIT",
      "peerDependencies": {
        "react-hook-form": "^7.0.0"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.33.5",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@inquirer/figures": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/@inquirer/figures/-/figures-1.0.11.tgz",
      "integrity": "sha512-eOg92lvrn/aRUqbxRyvpEWnrvRuTYRifixHkYVpJiygTgVSBIHDqLh0SrMQXkafvULg3ck11V7xvR+zcgvpHFw==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@isaacs/cliui": {
      "version": "8.0.2",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "string-width": "^5.1.2",
        "string-width-cjs": "npm:string-width@^4.2.0",
        "strip-ansi": "^7.0.1",
        "strip-ansi-cjs": "npm:strip-ansi@^6.0.1",
        "wrap-ansi": "^8.1.0",
        "wrap-ansi-cjs": "npm:wrap-ansi@^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.8",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/set-array": "^1.2.1",
        "@jridgewell/sourcemap-codec": "^1.4.10",
        "@jridgewell/trace-mapping": "^0.3.24"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/set-array": {
      "version": "1.2.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.0",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.25",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@mapbox/node-pre-gyp": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/@mapbox/node-pre-gyp/-/node-pre-gyp-1.0.11.tgz",
      "integrity": "sha512-Yhlar6v9WQgUp/He7BdgzOz8lqMQ8sU+jkCq7Wx8Myc5YFJLbEe7lgui/V7G1qB1DJykHSGwreceSaD60Y0PUQ==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "detect-libc": "^2.0.0",
        "https-proxy-agent": "^5.0.0",
        "make-dir": "^3.1.0",
        "node-fetch": "^2.6.7",
        "nopt": "^5.0.0",
        "npmlog": "^5.0.1",
        "rimraf": "^3.0.2",
        "semver": "^7.3.5",
        "tar": "^6.1.11"
      },
      "bin": {
        "node-pre-gyp": "bin/node-pre-gyp"
      }
    },
    "node_modules/@mapbox/node-pre-gyp/node_modules/glob": {
      "version": "7.2.3",
      "resolved": "https://registry.npmjs.org/glob/-/glob-7.2.3.tgz",
      "integrity": "sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==",
      "deprecated": "Glob versions prior to v9 are no longer supported",
      "license": "ISC",
      "dependencies": {
        "fs.realpath": "^1.0.0",
        "inflight": "^1.0.4",
        "inherits": "2",
        "minimatch": "^3.1.1",
        "once": "^1.3.0",
        "path-is-absolute": "^1.0.0"
      },
      "engines": {
        "node": "*"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@mapbox/node-pre-gyp/node_modules/rimraf": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/rimraf/-/rimraf-3.0.2.tgz",
      "integrity": "sha512-JZkJMZkAGFFPP2YqXZXPbMlMBgsxzE8ILs4lMIX/2o0L9UBw9O/Y3o6wFw/i9YLapcUJWwqbi3kdxIPdC62TIA==",
      "deprecated": "Rimraf versions prior to v4 are no longer supported",
      "license": "ISC",
      "dependencies": {
        "glob": "^7.1.3"
      },
      "bin": {
        "rimraf": "bin.js"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@neondatabase/serverless": {
      "version": "0.10.4",
      "resolved": "https://registry.npmjs.org/@neondatabase/serverless/-/serverless-0.10.4.tgz",
      "integrity": "sha512-2nZuh3VUO9voBauuh+IGYRhGU/MskWHt1IuZvHcJw6GLjDgtqj/KViKo7SIrLdGLdot7vFbiRRw+BgEy3wT9HA==",
      "license": "MIT",
      "dependencies": {
        "@types/pg": "8.11.6"
      }
    },
    "node_modules/@next/env": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-15.2.2.tgz",
      "integrity": "sha512-yWgopCfA9XDR8ZH3taB5nRKtKJ1Q5fYsTOuYkzIIoS8TJ0UAUKAGF73JnGszbjk2ufAQDj6mDdgsJAFx5CLtYQ==",
      "license": "MIT"
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-15.2.2.tgz",
      "integrity": "sha512-HNBRnz+bkZ+KfyOExpUxTMR0Ow8nkkcE6IlsdEa9W/rI7gefud19+Sn1xYKwB9pdCdxIP1lPru/ZfjfA+iT8pw==",
      "cpu": [
        "arm64"
      ],
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-15.2.2.tgz",
      "integrity": "sha512-mJOUwp7al63tDpLpEFpKwwg5jwvtL1lhRW2fI1Aog0nYCPAhxbJsaZKdoVyPZCy8MYf/iQVNDuk/+i29iLCzIA==",
      "cpu": [
        "x64"
      ],
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-15.2.2.tgz",
      "integrity": "sha512-5ZZ0Zwy3SgMr7MfWtRE7cQWVssfOvxYfD9O7XHM7KM4nrf5EOeqwq67ZXDgo86LVmffgsu5tPO57EeFKRnrfSQ==",
      "cpu": [
        "arm64"
      ],
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-15.2.2.tgz",
      "integrity": "sha512-cgKWBuFMLlJ4TWcFHl1KOaVVUAF8vy4qEvX5KsNd0Yj5mhu989QFCq1WjuaEbv/tO1ZpsQI6h/0YR8bLwEi+nA==",
      "cpu": [
        "arm64"
      ],
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-15.2.2.tgz",
      "integrity": "sha512-c3kWSOSsVL8rcNBBfOq1+/j2PKs2nsMwJUV4icUxRgGBwUOfppeh7YhN5s79enBQFU+8xRgVatFkhHU1QW7yUA==",
      "cpu": [
        "x64"
      ],
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-15.2.2.tgz",
      "integrity": "sha512-PXTW9PLTxdNlVYgPJ0equojcq1kNu5NtwcNjRjHAB+/sdoKZ+X8FBu70fdJFadkxFIGekQTyRvPMFF+SOJaQjw==",
      "cpu": [
        "x64"
      ],
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-15.2.2.tgz",
      "integrity": "sha512-nG644Es5llSGEcTaXhnGWR/aThM/hIaz0jx4MDg4gWC8GfTCp8eDBWZ77CVuv2ha/uL9Ce+nPTfYkSLG67/sHg==",
      "cpu": [
        "arm64"
      ],
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-15.2.2.tgz",
      "integrity": "sha512-52nWy65S/R6/kejz3jpvHAjZDPKIbEQu4x9jDBzmB9jJfuOy5rspjKu4u77+fI4M/WzLXrrQd57hlFGzz1ubcQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@panva/hkdf": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@panva/hkdf/-/hkdf-1.2.1.tgz",
      "integrity": "sha512-6oclG6Y3PiDFcoyk8srjLfVKyMfVCKJ27JwNPViuXziFpmdz+MZnZN/aKY0JGXgYuO/VghU0jcOAZgWXZ1Dmrw==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/@pkgjs/parseargs": {
      "version": "0.11.0",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@prisma/adapter-neon": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/@prisma/adapter-neon/-/adapter-neon-6.5.0.tgz",
      "integrity": "sha512-TaqnR0HBVgZZg10F/QXExtu/yft9JbpHOYFj9dHFHvqob/xgtgpzhUhYGC9iwuUpuGp6mSVy40JU87x/Na/lIQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@prisma/driver-adapter-utils": "6.5.0",
        "postgres-array": "3.0.3"
      },
      "peerDependencies": {
        "@neondatabase/serverless": ">0.6.0 <2"
      }
    },
    "node_modules/@prisma/client": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/@prisma/client/-/client-6.5.0.tgz",
      "integrity": "sha512-M6w1Ql/BeiGoZmhMdAZUXHu5sz5HubyVcKukbLs3l0ELcQb8hTUJxtGEChhv4SVJ0QJlwtLnwOLgIRQhpsm9dw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18"
      },
      "peerDependencies": {
        "prisma": "*",
        "typescript": ">=5.1.0"
      },
      "peerDependenciesMeta": {
        "prisma": {
          "optional": true
        },
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/@prisma/config": {
      "version": "6.5.0",
      "license": "Apache-2.0",
      "dependencies": {
        "esbuild": ">=0.12 <1",
        "esbuild-register": "3.6.0"
      }
    },
    "node_modules/@prisma/debug": {
      "version": "6.5.0",
      "license": "Apache-2.0"
    },
    "node_modules/@prisma/driver-adapter-utils": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/@prisma/driver-adapter-utils/-/driver-adapter-utils-6.5.0.tgz",
      "integrity": "sha512-/1gSkHSflDF+50JRZUGuhjtHu7EGhkiCh7lRcBI7S9lYyyl81TdPgCtxyeId+pDBxE2B4NtG6I4DlTqZH3f8pw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@prisma/debug": "6.5.0"
      }
    },
    "node_modules/@prisma/engines": {
      "version": "6.5.0",
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@prisma/debug": "6.5.0",
        "@prisma/engines-version": "6.5.0-73.173f8d54f8d52e692c7e27e72a88314ec7aeff60",
        "@prisma/fetch-engine": "6.5.0",
        "@prisma/get-platform": "6.5.0"
      }
    },
    "node_modules/@prisma/engines-version": {
      "version": "6.5.0-73.173f8d54f8d52e692c7e27e72a88314ec7aeff60",
      "license": "Apache-2.0"
    },
    "node_modules/@prisma/fetch-engine": {
      "version": "6.5.0",
      "license": "Apache-2.0",
      "dependencies": {
        "@prisma/debug": "6.5.0",
        "@prisma/engines-version": "6.5.0-73.173f8d54f8d52e692c7e27e72a88314ec7aeff60",
        "@prisma/get-platform": "6.5.0"
      }
    },
    "node_modules/@prisma/get-platform": {
      "version": "6.5.0",
      "license": "Apache-2.0",
      "dependencies": {
        "@prisma/debug": "6.5.0"
      }
    },
    "node_modules/@radix-ui/number": {
      "version": "1.1.0",
      "license": "MIT"
    },
    "node_modules/@radix-ui/primitive": {
      "version": "1.1.1",
      "license": "MIT"
    },
    "node_modules/@radix-ui/react-accordion": {
      "version": "1.2.3",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-collapsible": "1.1.3",
        "@radix-ui/react-collection": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-alert-dialog": {
      "version": "1.1.6",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-dialog": "1.1.6",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-slot": "1.1.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-arrow": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.0.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-aspect-ratio": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.0.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-avatar": {
      "version": "1.1.3",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-layout-effect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-checkbox": {
      "version": "1.1.4",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-use-previous": "1.1.0",
        "@radix-ui/react-use-size": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-collapsible": {
      "version": "1.1.3",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-use-layout-effect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-collection": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-slot": "1.1.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-compose-refs": {
      "version": "1.1.1",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-context": {
      "version": "1.1.1",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-context-menu": {
      "version": "2.2.6",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-menu": "2.1.6",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-dialog": {
      "version": "1.1.6",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-dialog/-/react-dialog-1.1.6.tgz",
      "integrity": "sha512-/IVhJV5AceX620DUJ4uYVMymzsipdKBzo3edo+omeskCKGm9FRHM0ebIdbPnlQVJqyuHbuBltQUOG2mOTq2IYw==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-dismissable-layer": "1.1.5",
        "@radix-ui/react-focus-guards": "1.1.1",
        "@radix-ui/react-focus-scope": "1.1.2",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-portal": "1.1.4",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-slot": "1.1.2",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "aria-hidden": "^1.2.4",
        "react-remove-scroll": "^2.6.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-direction": {
      "version": "1.1.0",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-dismissable-layer": {
      "version": "1.1.5",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-escape-keydown": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-dropdown-menu": {
      "version": "2.1.6",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-menu": "2.1.6",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-focus-guards": {
      "version": "1.1.1",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-focus-scope": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-hover-card": {
      "version": "1.1.6",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-dismissable-layer": "1.1.5",
        "@radix-ui/react-popper": "1.2.2",
        "@radix-ui/react-portal": "1.1.4",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-id": {
      "version": "1.1.0",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-layout-effect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-label": {
      "version": "2.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.0.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-menu": {
      "version": "2.1.6",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-collection": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-dismissable-layer": "1.1.5",
        "@radix-ui/react-focus-guards": "1.1.1",
        "@radix-ui/react-focus-scope": "1.1.2",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-popper": "1.2.2",
        "@radix-ui/react-portal": "1.1.4",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-roving-focus": "1.1.2",
        "@radix-ui/react-slot": "1.1.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "aria-hidden": "^1.2.4",
        "react-remove-scroll": "^2.6.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-menubar": {
      "version": "1.1.6",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-collection": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-menu": "2.1.6",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-roving-focus": "1.1.2",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-navigation-menu": {
      "version": "1.2.5",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-collection": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-dismissable-layer": "1.1.5",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-use-layout-effect": "1.1.0",
        "@radix-ui/react-use-previous": "1.1.0",
        "@radix-ui/react-visually-hidden": "1.1.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-popover": {
      "version": "1.1.6",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-popover/-/react-popover-1.1.6.tgz",
      "integrity": "sha512-NQouW0x4/GnkFJ/pRqsIS3rM/k97VzKnVb2jB7Gq7VEGPy5g7uNV1ykySFt7eWSp3i2uSGFwaJcvIRJBAHmmFg==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-dismissable-layer": "1.1.5",
        "@radix-ui/react-focus-guards": "1.1.1",
        "@radix-ui/react-focus-scope": "1.1.2",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-popper": "1.2.2",
        "@radix-ui/react-portal": "1.1.4",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-slot": "1.1.2",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "aria-hidden": "^1.2.4",
        "react-remove-scroll": "^2.6.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-popper": {
      "version": "1.2.2",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/react-dom": "^2.0.0",
        "@radix-ui/react-arrow": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-layout-effect": "1.1.0",
        "@radix-ui/react-use-rect": "1.1.0",
        "@radix-ui/react-use-size": "1.1.0",
        "@radix-ui/rect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-portal": {
      "version": "1.1.4",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-layout-effect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-presence": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-use-layout-effect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-primitive": {
      "version": "2.0.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-slot": "1.1.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-progress": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-primitive": "2.0.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-radio-group": {
      "version": "1.2.3",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-roving-focus": "1.1.2",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-use-previous": "1.1.0",
        "@radix-ui/react-use-size": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-roving-focus": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-collection": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-scroll-area": {
      "version": "1.2.3",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/number": "1.1.0",
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-layout-effect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-select": {
      "version": "2.1.6",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/number": "1.1.0",
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-collection": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-dismissable-layer": "1.1.5",
        "@radix-ui/react-focus-guards": "1.1.1",
        "@radix-ui/react-focus-scope": "1.1.2",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-popper": "1.2.2",
        "@radix-ui/react-portal": "1.1.4",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-slot": "1.1.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-use-layout-effect": "1.1.0",
        "@radix-ui/react-use-previous": "1.1.0",
        "@radix-ui/react-visually-hidden": "1.1.2",
        "aria-hidden": "^1.2.4",
        "react-remove-scroll": "^2.6.3"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-separator": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-separator/-/react-separator-1.1.2.tgz",
      "integrity": "sha512-oZfHcaAp2Y6KFBX6I5P1u7CQoy4lheCGiYj+pGFrHy8E/VNRb5E39TkTr3JrV520csPBTZjkuKFdEsjS5EUNKQ==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.0.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-slider": {
      "version": "1.2.3",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/number": "1.1.0",
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-collection": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-use-layout-effect": "1.1.0",
        "@radix-ui/react-use-previous": "1.1.0",
        "@radix-ui/react-use-size": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-slot": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-compose-refs": "1.1.1"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-switch": {
      "version": "1.1.3",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-use-previous": "1.1.0",
        "@radix-ui/react-use-size": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-tabs": {
      "version": "1.1.3",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-roving-focus": "1.1.2",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-toast": {
      "version": "1.2.6",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-collection": "1.1.2",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-dismissable-layer": "1.1.5",
        "@radix-ui/react-portal": "1.1.4",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-callback-ref": "1.1.0",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-use-layout-effect": "1.1.0",
        "@radix-ui/react-visually-hidden": "1.1.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-toggle": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-toggle-group": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-direction": "1.1.0",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-roving-focus": "1.1.2",
        "@radix-ui/react-toggle": "1.1.2",
        "@radix-ui/react-use-controllable-state": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-tooltip": {
      "version": "1.1.8",
      "resolved": "https://registry.npmjs.org/@radix-ui/react-tooltip/-/react-tooltip-1.1.8.tgz",
      "integrity": "sha512-YAA2cu48EkJZdAMHC0dqo9kialOcRStbtiY4nJPaht7Ptrhcvpo+eDChaM6BIs8kL6a8Z5l5poiqLnXcNduOkA==",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/primitive": "1.1.1",
        "@radix-ui/react-compose-refs": "1.1.1",
        "@radix-ui/react-context": "1.1.1",
        "@radix-ui/react-dismissable-layer": "1.1.5",
        "@radix-ui/react-id": "1.1.0",
        "@radix-ui/react-popper": "1.2.2",
        "@radix-ui/react-portal": "1.1.4",
        "@radix-ui/react-presence": "1.1.2",
        "@radix-ui/react-primitive": "2.0.2",
        "@radix-ui/react-slot": "1.1.2",
        "@radix-ui/react-use-controllable-state": "1.1.0",
        "@radix-ui/react-visually-hidden": "1.1.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-callback-ref": {
      "version": "1.1.0",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-controllable-state": {
      "version": "1.1.0",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-callback-ref": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-escape-keydown": {
      "version": "1.1.0",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-callback-ref": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-layout-effect": {
      "version": "1.1.0",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-previous": {
      "version": "1.1.0",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-rect": {
      "version": "1.1.0",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/rect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-use-size": {
      "version": "1.1.0",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-use-layout-effect": "1.1.0"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/react-visually-hidden": {
      "version": "1.1.2",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-primitive": "2.0.2"
      },
      "peerDependencies": {
        "@types/react": "*",
        "@types/react-dom": "*",
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@radix-ui/rect": {
      "version": "1.1.0",
      "license": "MIT"
    },
    "node_modules/@simplewebauthn/browser": {
      "version": "11.0.0",
      "resolved": "https://registry.npmjs.org/@simplewebauthn/browser/-/browser-11.0.0.tgz",
      "integrity": "sha512-KEGCStrl08QC2I561BzxqGiwoknblP6O1YW7jApdXLPtIqZ+vgJYAv8ssLCdm1wD8HGAHd49CJLkUF8X70x/pg==",
      "license": "MIT",
      "dependencies": {
        "@simplewebauthn/types": "^11.0.0"
      }
    },
    "node_modules/@simplewebauthn/types": {
      "version": "11.0.0",
      "resolved": "https://registry.npmjs.org/@simplewebauthn/types/-/types-11.0.0.tgz",
      "integrity": "sha512-b2o0wC5u2rWts31dTgBkAtSNKGX0cvL6h8QedNsKmj8O4QoLFQFR3DBVBUlpyVEhYKA+mXGUaXbcOc4JdQ3HzA==",
      "license": "MIT"
    },
    "node_modules/@stackframe/init-stack": {
      "version": "2.7.27",
      "resolved": "https://registry.npmjs.org/@stackframe/init-stack/-/init-stack-2.7.27.tgz",
      "integrity": "sha512-nesEtXAhU19hNn+cUja0zIrSJTYMwfeYahWAMeeCItrRXPaQXGpBG1bQ+p9efKiic13/oMmhrtnYKvQgjA5O6w==",
      "license": "MIT",
      "dependencies": {
        "@stackframe/stack-shared": "2.7.27",
        "commander": "^13.1.0",
        "inquirer": "^9.2.19",
        "open": "^10.1.0"
      },
      "bin": {
        "init-stack": "dist/index.js"
      }
    },
    "node_modules/@stackframe/init-stack/node_modules/commander": {
      "version": "13.1.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-13.1.0.tgz",
      "integrity": "sha512-/rFeCpNJQbhSZjGVwO9RFV3xPqbnERS8MmIQzCtD/zl6gpJuV/bMLuN92oG3F7d8oDEHHRrujSXNUr8fpjntKw==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@stackframe/stack": {
      "version": "2.4.8",
      "resolved": "https://registry.npmjs.org/@stackframe/stack/-/stack-2.4.8.tgz",
      "integrity": "sha512-6eYIevYQgWdtZIRm90AKeXPx7XO/9paZWsKfD3Es8wGNVZLLI9omFZRuCuH7FvHcELp/2P3N42FcEuI5PLPIzw==",
      "dev": true,
      "dependencies": {
        "@radix-ui/react-avatar": "^1.0.4",
        "@radix-ui/react-collapsible": "^1.0.3",
        "@radix-ui/react-dropdown-menu": "^2.0.6",
        "@radix-ui/react-label": "^2.0.2",
        "@radix-ui/react-popover": "^1.0.7",
        "@radix-ui/react-separator": "^1.0.3",
        "@radix-ui/react-tabs": "^1.0.4",
        "@stackframe/stack-sc": "1.5.2",
        "@stackframe/stack-shared": "2.4.6",
        "color": "^4.2.3",
        "js-cookie": "^3.0.5",
        "oauth4webapi": "^2.10.3",
        "react-icons": "^5.0.1",
        "server-only": "^0.0.1",
        "styled-components": "^6.1.8",
        "yup": "^1.4.0"
      },
      "peerDependencies": {
        "@mui/joy": "^5.0.0-beta.30",
        "next": ">=14.1",
        "react": "^18.2"
      },
      "peerDependenciesMeta": {
        "@mui/joy": {
          "optional": true
        }
      }
    },
    "node_modules/@stackframe/stack-sc": {
      "version": "1.5.2",
      "resolved": "https://registry.npmjs.org/@stackframe/stack-sc/-/stack-sc-1.5.2.tgz",
      "integrity": "sha512-T+Ev6XwTq8/vsiaxNkSdQgxFKZ5UonkUE8jARHCtltRwRSAsEXoOJ/LESbpdglH0ucVtYw6JhqNx9wU9U+mYIA==",
      "dev": true,
      "peerDependencies": {
        "next": "^14.1",
        "react": "^18.2"
      }
    },
    "node_modules/@stackframe/stack-shared": {
      "version": "2.7.27",
      "resolved": "https://registry.npmjs.org/@stackframe/stack-shared/-/stack-shared-2.7.27.tgz",
      "integrity": "sha512-YWXr6+N6XH+v8h1ji4G1S4CFR/y47waXIvAoU3fuP+PUeIeS6dWAIZDh68erZBQrvzOK4114D8obRGtAfyMX8g==",
      "dependencies": {
        "@simplewebauthn/browser": "^11.0.0",
        "async-mutex": "^0.5.0",
        "bcrypt": "^5.1.1",
        "elliptic": "^6.5.7",
        "ip-regex": "^5.0.0",
        "jose": "^5.2.2",
        "oauth4webapi": "^2.10.3",
        "semver": "^7.6.3",
        "uuid": "^9.0.1"
      },
      "peerDependencies": {
        "@types/react": ">=18.2 || >=19.0.0-rc.0",
        "@types/react-dom": ">=18.2 || >=19.0.0-rc.0",
        "react": ">=18.2 || >=19.0.0-rc.0",
        "react-dom": ">=18.2 || >=19.0.0-rc.0",
        "yup": "^1.4.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "@types/react-dom": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "yup": {
          "optional": true
        }
      }
    },
    "node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared": {
      "version": "2.4.6",
      "resolved": "https://registry.npmjs.org/@stackframe/stack-shared/-/stack-shared-2.4.6.tgz",
      "integrity": "sha512-siYp1pUE0GzGL2WlVRL1JbDrFmWczVaIvaVDubTifhlAH0/6Sp6teTlko/fTSt2FQ6QdBqgCqFC2vGNTcvdUXw==",
      "dev": true,
      "dependencies": {
        "@stackframe/stack-sc": "1.5.2",
        "bcrypt": "^5.1.1",
        "jose": "^5.2.2",
        "oauth4webapi": "^2.10.3",
        "uuid": "^9.0.1"
      },
      "peerDependencies": {
        "react": "^18.2",
        "yup": "^1.4.0"
      },
      "peerDependenciesMeta": {
        "react": {
          "optional": true
        },
        "yup": {
          "optional": true
        }
      }
    },
    "node_modules/@swc/counter": {
      "version": "0.1.3",
      "license": "Apache-2.0"
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.15",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/@tailwindcss/forms": {
      "version": "0.5.10",
      "resolved": "https://registry.npmjs.org/@tailwindcss/forms/-/forms-0.5.10.tgz",
      "integrity": "sha512-utI1ONF6uf/pPNO68kmN1b8rEwNXv3czukalo8VtJH8ksIkZXr3Q3VYudZLkCsDd4Wku120uF02hYK25XGPorw==",
      "license": "MIT",
      "dependencies": {
        "mini-svg-data-uri": "^1.2.3"
      },
      "peerDependencies": {
        "tailwindcss": ">=3.0.0 || >= 3.0.0-alpha.1 || >= 4.0.0-alpha.20 || >= 4.0.0-beta.1"
      }
    },
    "node_modules/@tsconfig/node10": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/@tsconfig/node10/-/node10-1.0.11.tgz",
      "integrity": "sha512-DcRjDCujK/kCk/cUe8Xz8ZSpm8mS3mNNpta+jGCA6USEDfktlNvm1+IuZ9eTcDbNk41BHwpHHeW+N1lKCz4zOw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tsconfig/node12": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/@tsconfig/node12/-/node12-1.0.11.tgz",
      "integrity": "sha512-cqefuRsh12pWyGsIoBKJA9luFu3mRxCA+ORZvA4ktLSzIuCUtWVxGIuXigEwO5/ywWFMZ2QEGKWvkZG1zDMTag==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tsconfig/node14": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@tsconfig/node14/-/node14-1.0.3.tgz",
      "integrity": "sha512-ysT8mhdixWK6Hw3i1V2AeRqZ5WfXg1G43mqoYlM2nc6388Fq5jcXyr5mRsqViLx/GJYdoL0bfXD8nmF+Zn/Iow==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tsconfig/node16": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/@tsconfig/node16/-/node16-1.0.4.tgz",
      "integrity": "sha512-vxhUy4J8lyeyinH7Azl1pdd43GJhZH/tP2weN8TntQblOY+A0XbT8DJk1/oCPuOOyg/Ja757rG0CgHcWC8OfMA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/bcrypt": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/@types/bcrypt/-/bcrypt-5.0.2.tgz",
      "integrity": "sha512-6atioO8Y75fNcbmj0G7UjI9lXN2pQ/IGJ2FWT4a/btd0Lk9lQalHLKhkgKVZ3r+spnmWUKfbMi1GEe9wyHQfNQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/d3-array": {
      "version": "3.2.1",
      "license": "MIT"
    },
    "node_modules/@types/d3-color": {
      "version": "3.1.3",
      "license": "MIT"
    },
    "node_modules/@types/d3-ease": {
      "version": "3.0.2",
      "license": "MIT"
    },
    "node_modules/@types/d3-interpolate": {
      "version": "3.0.4",
      "license": "MIT",
      "dependencies": {
        "@types/d3-color": "*"
      }
    },
    "node_modules/@types/d3-path": {
      "version": "3.1.1",
      "license": "MIT"
    },
    "node_modules/@types/d3-scale": {
      "version": "4.0.9",
      "license": "MIT",
      "dependencies": {
        "@types/d3-time": "*"
      }
    },
    "node_modules/@types/d3-shape": {
      "version": "3.1.7",
      "license": "MIT",
      "dependencies": {
        "@types/d3-path": "*"
      }
    },
    "node_modules/@types/d3-time": {
      "version": "3.0.4",
      "license": "MIT"
    },
    "node_modules/@types/d3-timer": {
      "version": "3.0.2",
      "license": "MIT"
    },
    "node_modules/@types/jsonwebtoken": {
      "version": "9.0.9",
      "resolved": "https://registry.npmjs.org/@types/jsonwebtoken/-/jsonwebtoken-9.0.9.tgz",
      "integrity": "sha512-uoe+GxEuHbvy12OUQct2X9JenKM3qAscquYymuQN4fMWG9DBQtykrQEFcAbVACF7qaLw9BePSodUL0kquqBJpQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/ms": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/ms": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@types/ms/-/ms-2.1.0.tgz",
      "integrity": "sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/@types/nodemailer": {
      "version": "6.4.17",
      "resolved": "https://registry.npmjs.org/@types/nodemailer/-/nodemailer-6.4.17.tgz",
      "integrity": "sha512-I9CCaIp6DTldEg7vyUTZi8+9Vo0hi1/T8gv3C89yk1rSAAzoKQ8H8ki/jBYJSFoH/BisgLP8tkZMlQ91CIquww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/pg": {
      "version": "8.11.6",
      "resolved": "https://registry.npmjs.org/@types/pg/-/pg-8.11.6.tgz",
      "integrity": "sha512-/2WmmBXHLsfRqzfHW7BNZ8SbYzE8OSk7i3WjFYvfgRHj7S1xj+16Je5fUKv3lVdVzk/zn9TXOqf+avFCFIE0yQ==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*",
        "pg-protocol": "*",
        "pg-types": "^4.0.1"
      }
    },
    "node_modules/@types/react": {
      "version": "19.0.10",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.0.10.tgz",
      "integrity": "sha512-JuRQ9KXLEjaUNjTWpzuR231Z2WpIwczOkBEIvbHNCzQefFIT0L8IqE6NV6ULLyC1SI/i234JnDoMkfg+RjQj2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "csstype": "^3.0.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.0.4",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.0.4.tgz",
      "integrity": "sha512-4fSQ8vWFkg+TGhePfUzVmat3eC14TXYSsiiDSLI0dVLsrm9gZFABjPy/Qu6TKgl1tq1Bu1yDsuQgY3A3DOjCcg==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.0.0"
      }
    },
    "node_modules/@types/stylis": {
      "version": "4.2.5",
      "resolved": "https://registry.npmjs.org/@types/stylis/-/stylis-4.2.5.tgz",
      "integrity": "sha512-1Xve+NMN7FWjY14vLoY5tL3BVEQ/n42YLwaqJIPYhotZ9uBHt87VceMwWQpzmdEt2TNXIorIFG+YeCUUW7RInw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/abbrev": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
      "integrity": "sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==",
      "license": "ISC"
    },
    "node_modules/acorn": {
      "version": "8.14.1",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.14.1.tgz",
      "integrity": "sha512-OvQ/2pUDKmgfCg++xsTX1wGxfTaszcHVcTctW4UJB4hibJx2HXxxO5UmVgyjMa+ZDsiaf5wWLXYpRWMmBI0QHg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/acorn-walk": {
      "version": "8.3.4",
      "resolved": "https://registry.npmjs.org/acorn-walk/-/acorn-walk-8.3.4.tgz",
      "integrity": "sha512-ueEepnujpqee2o5aIYnvHU6C0A42MNdsIDeqy5BydrkuC5R1ZuUFnm27EeFJGoEHJQgn3uleRvmTXaJgfXbt4g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "acorn": "^8.11.0"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/agent-base": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
      "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "4"
      },
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/ansi-escapes": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/ansi-escapes/-/ansi-escapes-4.3.2.tgz",
      "integrity": "sha512-gKXj5ALrKWQLsYG9jlTRmR/xKluxHV+Z9QEwNIgCfM1/uwPMCuzVVnh5mwTd+OuBZcwSIMbqssNWRm1lE51QaQ==",
      "license": "MIT",
      "dependencies": {
        "type-fest": "^0.21.3"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ansi-regex": {
      "version": "6.1.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/any-promise": {
      "version": "1.3.0",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/aproba": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/aproba/-/aproba-2.0.0.tgz",
      "integrity": "sha512-lYe4Gx7QT+MKGbDsA+Z+he/Wtef0BiwDOlK/XkBrdfsh9J/jPPXbX0tE9x9cl27Tmu5gg3QUbUrQYa/y+KOHPQ==",
      "license": "ISC"
    },
    "node_modules/are-we-there-yet": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/are-we-there-yet/-/are-we-there-yet-2.0.0.tgz",
      "integrity": "sha512-Ci/qENmwHnsYo9xKIcUJN5LeDKdJ6R1Z1j9V/J5wyq8nh/mYPEpIKJbBZXtZjG04HiK7zV/p6Vs9952MrMeUIw==",
      "deprecated": "This package is no longer supported.",
      "license": "ISC",
      "dependencies": {
        "delegates": "^1.0.0",
        "readable-stream": "^3.6.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/arg": {
      "version": "5.0.2",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/aria-hidden": {
      "version": "1.2.4",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/async-mutex": {
      "version": "0.5.0",
      "resolved": "https://registry.npmjs.org/async-mutex/-/async-mutex-0.5.0.tgz",
      "integrity": "sha512-1A94B18jkJ3DYq284ohPxoXbfTA5HsQ7/Mf4DEhcyLx3Bz27Rh59iScbB6EPiP+B+joue6YCxcMXSbFC1tZKwA==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/autoprefixer": {
      "version": "10.4.21",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/autoprefixer"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.24.4",
        "caniuse-lite": "^1.0.30001702",
        "fraction.js": "^4.3.7",
        "normalize-range": "^0.1.2",
        "picocolors": "^1.1.1",
        "postcss-value-parser": "^4.2.0"
      },
      "bin": {
        "autoprefixer": "bin/autoprefixer"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      },
      "peerDependencies": {
        "postcss": "^8.1.0"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "license": "MIT"
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/bcrypt": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/bcrypt/-/bcrypt-5.1.1.tgz",
      "integrity": "sha512-AGBHOG5hPYZ5Xl9KXzU5iKq9516yEmvCKDg3ecP5kX2aB6UqTeXZxk2ELnDgDm6BQSMlLt9rDB4LoSMx0rYwww==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "@mapbox/node-pre-gyp": "^1.0.11",
        "node-addon-api": "^5.0.0"
      },
      "engines": {
        "node": ">= 10.0.0"
      }
    },
    "node_modules/bcryptjs": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/bcryptjs/-/bcryptjs-3.0.2.tgz",
      "integrity": "sha512-k38b3XOZKv60C4E2hVsXTolJWfkGRMbILBIe2IBITXciy5bOsTKot5kDrf3ZfufQtQOUN5mXceUEpU1rTl9Uog==",
      "license": "BSD-3-Clause",
      "bin": {
        "bcrypt": "bin/bcrypt"
      }
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/bl": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/bl/-/bl-4.1.0.tgz",
      "integrity": "sha512-1W07cM9gS6DcLperZfFSj+bWLtaPGSOHWhPiGzXmvVJbRLdG82sH/Kn8EtW1VqWVA54AKf2h5k5BbnIbwF3h6w==",
      "license": "MIT",
      "dependencies": {
        "buffer": "^5.5.0",
        "inherits": "^2.0.4",
        "readable-stream": "^3.4.0"
      }
    },
    "node_modules/bn.js": {
      "version": "4.12.1",
      "resolved": "https://registry.npmjs.org/bn.js/-/bn.js-4.12.1.tgz",
      "integrity": "sha512-k8TVBiPkPJT9uHLdOKfFpqcfprwBFOAAXXozRubr7R7PfIuKvQlzcI4M0pALeqXN09vdaMbUdUj+pass+uULAg==",
      "license": "MIT"
    },
    "node_modules/brace-expansion": {
      "version": "1.1.11",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.11.tgz",
      "integrity": "sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==",
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/brorand": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/brorand/-/brorand-1.1.0.tgz",
      "integrity": "sha512-cKV8tMCEpQs4hK/ik71d6LrPOnpkpGBR0wzxqr68g2m/LB2GxVYQroAjMJZRVM1Y4BCjCKc3vAamxSzOY2RP+w==",
      "license": "MIT"
    },
    "node_modules/browserslist": {
      "version": "4.24.4",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "caniuse-lite": "^1.0.30001688",
        "electron-to-chromium": "^1.5.73",
        "node-releases": "^2.0.19",
        "update-browserslist-db": "^1.1.1"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/buffer": {
      "version": "5.7.1",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-5.7.1.tgz",
      "integrity": "sha512-EHcyIPBQ4BSGlvjB16k5KgAJ27CIsHY/2JBmCRReo48y9rQ3MaUzWX3KVlBa4U7MyX02HdVj0K7C3WaB3ju7FQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "base64-js": "^1.3.1",
        "ieee754": "^1.1.13"
      }
    },
    "node_modules/buffer-equal-constant-time": {
      "version": "1.0.1",
      "license": "BSD-3-Clause"
    },
    "node_modules/bundle-name": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/bundle-name/-/bundle-name-4.1.0.tgz",
      "integrity": "sha512-tjwM5exMg6BGRI+kNmTntNsvdZS1X8BFYS6tnJ2hdH0kVxM6/eVZ2xy+FqStSWvYmtfFMDLIxurorHwDKfDz5Q==",
      "license": "MIT",
      "dependencies": {
        "run-applescript": "^7.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/busboy": {
      "version": "1.6.0",
      "dependencies": {
        "streamsearch": "^1.1.0"
      },
      "engines": {
        "node": ">=10.16.0"
      }
    },
    "node_modules/camelcase-css": {
      "version": "2.0.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/camelize": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/camelize/-/camelize-1.0.1.tgz",
      "integrity": "sha512-dU+Tx2fsypxTgtLoE36npi3UqcjSSMNYfkqgmoEhtZrraP5VWq0K7FkWVTYa8eMPtnU/G2txVsfdCJTn9uzpuQ==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001703",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chardet": {
      "version": "0.7.0",
      "resolved": "https://registry.npmjs.org/chardet/-/chardet-0.7.0.tgz",
      "integrity": "sha512-mT8iDcrh03qDGRRmoA2hmBJnxpllMR+0/0qlzjqZES6NdiWDcZkCNAk4rPFZ9Q85r27unkiNNg8ZOiwZXBHwcA==",
      "license": "MIT"
    },
    "node_modules/chokidar": {
      "version": "3.6.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/chokidar/node_modules/glob-parent": {
      "version": "5.1.2",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/chownr": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/chownr/-/chownr-2.0.0.tgz",
      "integrity": "sha512-bIomtDF5KGpdogkLd9VspvFzk9KfpyyGlS8YFVZl7TGPBHL5snIOnxeshwVgPteQ9b4Eydl+pVbIyE1DcvCWgQ==",
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/class-variance-authority": {
      "version": "0.7.1",
      "license": "Apache-2.0",
      "dependencies": {
        "clsx": "^2.1.1"
      },
      "funding": {
        "url": "https://polar.sh/cva"
      }
    },
    "node_modules/cli-cursor": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-3.1.0.tgz",
      "integrity": "sha512-I/zHAwsKf9FqGoXM4WWRACob9+SNukZTd94DWF57E4toouRulbCxcUh6RKUEOQlYTHJnzkPMySvPNaaSLNfLZw==",
      "license": "MIT",
      "dependencies": {
        "restore-cursor": "^3.1.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/cli-spinners": {
      "version": "2.9.2",
      "resolved": "https://registry.npmjs.org/cli-spinners/-/cli-spinners-2.9.2.tgz",
      "integrity": "sha512-ywqV+5MmyL4E7ybXgKys4DugZbX0FC6LnwrhjuykIjnK9k8OQacQ7axGKnjDXWNhns0xot3bZI5h55H8yo9cJg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-width": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/cli-width/-/cli-width-4.1.0.tgz",
      "integrity": "sha512-ouuZd4/dm2Sw5Gmqy6bGyNNNe1qt9RpmxveLSO7KcgsTnU7RXfsw+/bukWGo1abgBiMAic068rclZsO4IWmmxQ==",
      "license": "ISC",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "license": "MIT"
    },
    "node_modules/clone": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/clone/-/clone-1.0.4.tgz",
      "integrity": "sha512-JQHZ2QMW6l3aH/j6xCqQThY/9OH4D/9ls34cgkUBiEeocRTU04tHfKPBsUK1PqZCUQM7GiA0IIXJSuXHI64Kbg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/clsx": {
      "version": "2.1.1",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/cmdk": {
      "version": "1.0.4",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-dialog": "^1.1.2",
        "@radix-ui/react-id": "^1.1.0",
        "@radix-ui/react-primitive": "^2.0.0",
        "use-sync-external-store": "^1.2.2"
      },
      "peerDependencies": {
        "react": "^18 || ^19 || ^19.0.0-rc",
        "react-dom": "^18 || ^19 || ^19.0.0-rc"
      }
    },
    "node_modules/color": {
      "version": "4.2.3",
      "devOptional": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1",
        "color-string": "^1.9.0"
      },
      "engines": {
        "node": ">=12.5.0"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "license": "MIT"
    },
    "node_modules/color-string": {
      "version": "1.9.1",
      "devOptional": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "^1.0.0",
        "simple-swizzle": "^0.2.2"
      }
    },
    "node_modules/color-support": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/color-support/-/color-support-1.1.3.tgz",
      "integrity": "sha512-qiBjkpbMLO/HL68y+lh4q0/O1MZFj2RX6X/KmMa3+gJD3z+WwI1ZzDHysvqHGS3mP6mznPckpXmw1nI9cJjyRg==",
      "license": "ISC",
      "bin": {
        "color-support": "bin.js"
      }
    },
    "node_modules/commander": {
      "version": "4.1.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "license": "MIT"
    },
    "node_modules/console-control-strings": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/console-control-strings/-/console-control-strings-1.1.0.tgz",
      "integrity": "sha512-ty/fTekppD2fIwRvnZAVdeOiGd1c7YXEixbgJTNzqcxJWKQnjJ/V1bNEEE6hygpM3WjwHFUVK6HTjWSzV4a8sQ==",
      "license": "ISC"
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/create-require": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/create-require/-/create-require-1.1.1.tgz",
      "integrity": "sha512-dcKFX3jn0MpIaXjisoRvexIJVEKzaq7z2rZKxf+MSr9TkdmHmsU4m2lcLojrj/FHl8mk5VxMmYA+ftRkP/3oKQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/css-color-keywords": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/css-color-keywords/-/css-color-keywords-1.0.0.tgz",
      "integrity": "sha512-FyyrDHZKEjXDpNJYvVsV960FiqQyXc/LlYmsxl2BcdMb2WPx0OGRVgTg55rPSyLSNMqP52R9r8geSp7apN3Ofg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/css-to-react-native": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/css-to-react-native/-/css-to-react-native-3.2.0.tgz",
      "integrity": "sha512-e8RKaLXMOFii+02mOlqwjbD00KSEKqblnpO9e++1aXS1fPQOpS1YoqdVHBqPjHNoxeF2mimzVqawm2KCbEdtHQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "camelize": "^1.0.0",
        "css-color-keywords": "^1.0.0",
        "postcss-value-parser": "^4.0.2"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "dev": true,
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/csstype": {
      "version": "3.1.3",
      "license": "MIT"
    },
    "node_modules/d3-array": {
      "version": "3.2.4",
      "license": "ISC",
      "dependencies": {
        "internmap": "1 - 2"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-color": {
      "version": "3.1.0",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-ease": {
      "version": "3.0.1",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-format": {
      "version": "3.1.0",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-interpolate": {
      "version": "3.0.1",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-path": {
      "version": "3.1.0",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-scale": {
      "version": "4.0.2",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2.10.0 - 3",
        "d3-format": "1 - 3",
        "d3-interpolate": "1.2.0 - 3",
        "d3-time": "2.1.1 - 3",
        "d3-time-format": "2 - 4"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-shape": {
      "version": "3.2.0",
      "license": "ISC",
      "dependencies": {
        "d3-path": "^3.1.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time": {
      "version": "3.1.0",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time-format": {
      "version": "4.1.0",
      "license": "ISC",
      "dependencies": {
        "d3-time": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-timer": {
      "version": "3.0.1",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/date-fns": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/date-fns/-/date-fns-4.1.0.tgz",
      "integrity": "sha512-Ukq0owbQXxa/U3EGtsdVBkR1w7KOQ5gIBqdH2hkvknzZPYvBxb/aa6E8L7tmjFtkwZBu3UXBbjIgPo/Ez4xaNg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/kossnocorp"
      }
    },
    "node_modules/date-fns-jalali": {
      "version": "4.1.0-0",
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "4.4.0",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decimal.js-light": {
      "version": "2.5.1",
      "license": "MIT"
    },
    "node_modules/default-browser": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/default-browser/-/default-browser-5.2.1.tgz",
      "integrity": "sha512-WY/3TUME0x3KPYdRRxEJJvXRHV4PyPoUsxtZa78lwItwRQRHhd2U9xOscaT/YTf8uCXIAjeJOFBVEh/7FtD8Xg==",
      "license": "MIT",
      "dependencies": {
        "bundle-name": "^4.1.0",
        "default-browser-id": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/default-browser-id": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/default-browser-id/-/default-browser-id-5.0.0.tgz",
      "integrity": "sha512-A6p/pu/6fyBcA1TRz/GqWYPViplrftcW2gZC9q79ngNCKAeR/X3gcEdXQHl4KNXV+3wgIJ1CPkJQ3IHM6lcsyA==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/defaults": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/defaults/-/defaults-1.0.4.tgz",
      "integrity": "sha512-eFuaLoy/Rxalv2kr+lqMlUnrDWV+3j4pljOIJgLIhI058IQfWJ7vXhyEIHu+HtC738klGALYxOKDO0bQP3tg8A==",
      "license": "MIT",
      "dependencies": {
        "clone": "^1.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/define-lazy-prop": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/define-lazy-prop/-/define-lazy-prop-3.0.0.tgz",
      "integrity": "sha512-N+MeXYoqr3pOgn8xfyRPREN7gHakLYjhsHhWGT3fWAiL4IkAt0iDw14QiiEm2bE30c5XX5q0FtAA3CK5f9/BUg==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/delegates": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delegates/-/delegates-1.0.0.tgz",
      "integrity": "sha512-bd2L678uiWATM6m5Z1VzNCErI3jiGzt6HGY8OVICs40JQq/HALfbyNJmp0UDakEY4pMMaN0Ly5om/B1VI/+xfQ==",
      "license": "MIT"
    },
    "node_modules/detect-libc": {
      "version": "2.0.3",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/detect-node-es": {
      "version": "1.1.0",
      "license": "MIT"
    },
    "node_modules/didyoumean": {
      "version": "1.2.2",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/diff": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/diff/-/diff-4.0.2.tgz",
      "integrity": "sha512-58lmxKSA4BNyLz+HHMUzlOEpg09FV+ev6ZMe3vJihgdxzgcwZ8VoEEPmALCZG9LmqfVoNMMKpttIYTVG6uDY7A==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.3.1"
      }
    },
    "node_modules/dlv": {
      "version": "1.1.3",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/dom-helpers": {
      "version": "5.2.1",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.8.7",
        "csstype": "^3.0.2"
      }
    },
    "node_modules/eastasianwidth": {
      "version": "0.2.0",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/ecdsa-sig-formatter": {
      "version": "1.0.11",
      "license": "Apache-2.0",
      "dependencies": {
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.114",
      "license": "ISC"
    },
    "node_modules/elliptic": {
      "version": "6.6.1",
      "resolved": "https://registry.npmjs.org/elliptic/-/elliptic-6.6.1.tgz",
      "integrity": "sha512-RaddvvMatK2LJHqFJ+YA4WysVN5Ita9E35botqIYspQ4TkRAlCicdzKOjlyv/1Za5RyTNn7di//eEV0uTAfe3g==",
      "license": "MIT",
      "dependencies": {
        "bn.js": "^4.11.9",
        "brorand": "^1.1.0",
        "hash.js": "^1.0.0",
        "hmac-drbg": "^1.0.1",
        "inherits": "^2.0.4",
        "minimalistic-assert": "^1.0.1",
        "minimalistic-crypto-utils": "^1.0.1"
      }
    },
    "node_modules/embla-carousel": {
      "version": "8.5.1",
      "license": "MIT"
    },
    "node_modules/embla-carousel-react": {
      "version": "8.5.1",
      "license": "MIT",
      "dependencies": {
        "embla-carousel": "8.5.1",
        "embla-carousel-reactive-utils": "8.5.1"
      },
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.1 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      }
    },
    "node_modules/embla-carousel-reactive-utils": {
      "version": "8.5.1",
      "license": "MIT",
      "peerDependencies": {
        "embla-carousel": "8.5.1"
      }
    },
    "node_modules/emoji-regex": {
      "version": "9.2.2",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/esbuild": {
      "version": "0.25.1",
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.25.1",
        "@esbuild/android-arm": "0.25.1",
        "@esbuild/android-arm64": "0.25.1",
        "@esbuild/android-x64": "0.25.1",
        "@esbuild/darwin-arm64": "0.25.1",
        "@esbuild/darwin-x64": "0.25.1",
        "@esbuild/freebsd-arm64": "0.25.1",
        "@esbuild/freebsd-x64": "0.25.1",
        "@esbuild/linux-arm": "0.25.1",
        "@esbuild/linux-arm64": "0.25.1",
        "@esbuild/linux-ia32": "0.25.1",
        "@esbuild/linux-loong64": "0.25.1",
        "@esbuild/linux-mips64el": "0.25.1",
        "@esbuild/linux-ppc64": "0.25.1",
        "@esbuild/linux-riscv64": "0.25.1",
        "@esbuild/linux-s390x": "0.25.1",
        "@esbuild/linux-x64": "0.25.1",
        "@esbuild/netbsd-arm64": "0.25.1",
        "@esbuild/netbsd-x64": "0.25.1",
        "@esbuild/openbsd-arm64": "0.25.1",
        "@esbuild/openbsd-x64": "0.25.1",
        "@esbuild/sunos-x64": "0.25.1",
        "@esbuild/win32-arm64": "0.25.1",
        "@esbuild/win32-ia32": "0.25.1",
        "@esbuild/win32-x64": "0.25.1"
      }
    },
    "node_modules/esbuild-register": {
      "version": "3.6.0",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.3.4"
      },
      "peerDependencies": {
        "esbuild": ">=0.12 <1"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/eventemitter3": {
      "version": "4.0.7",
      "license": "MIT"
    },
    "node_modules/external-editor": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/external-editor/-/external-editor-3.1.0.tgz",
      "integrity": "sha512-hMQ4CX1p1izmuLYyZqLMO/qGNw10wSv9QDCPfzXfyFrOaCSSoRfqE1Kf1s5an66J5JZC62NewG+mK49jOCtQew==",
      "license": "MIT",
      "dependencies": {
        "chardet": "^0.7.0",
        "iconv-lite": "^0.4.24",
        "tmp": "^0.0.33"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/fast-equals": {
      "version": "5.2.2",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/fastq": {
      "version": "1.19.1",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/foreground-child": {
      "version": "3.3.1",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "cross-spawn": "^7.0.6",
        "signal-exit": "^4.0.1"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/fraction.js": {
      "version": "4.3.7",
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "patreon",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/fs-minipass": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fs-minipass/-/fs-minipass-2.1.0.tgz",
      "integrity": "sha512-V/JgOLFCS+R6Vcq0slCuaeWEdNC3ouDlJMNIsacH2VtALiu9mV4LPrHc5cDl8k5aw6J8jwgWWpiTo5RYhmIzvg==",
      "license": "ISC",
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/fs-minipass/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/fs.realpath": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
      "integrity": "sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==",
      "license": "ISC"
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gauge": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/gauge/-/gauge-3.0.2.tgz",
      "integrity": "sha512-+5J6MS/5XksCuXq++uFRsnUd7Ovu1XenbeuIuNRJxYWjgQbPuFhT14lAvsWfqfAmnwluf1OwMjz39HjfLPci0Q==",
      "deprecated": "This package is no longer supported.",
      "license": "ISC",
      "dependencies": {
        "aproba": "^1.0.3 || ^2.0.0",
        "color-support": "^1.1.2",
        "console-control-strings": "^1.0.0",
        "has-unicode": "^2.0.1",
        "object-assign": "^4.1.1",
        "signal-exit": "^3.0.0",
        "string-width": "^4.2.3",
        "strip-ansi": "^6.0.1",
        "wide-align": "^1.1.2"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/gauge/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/gauge/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT"
    },
    "node_modules/gauge/node_modules/signal-exit": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.7.tgz",
      "integrity": "sha512-wnD2ZE+l+SPC/uoS0vXeE9L1+0wuaMqKlfz9AMUo38JsyLSBWSFcHR1Rri62LZc12vLr1gb3jl7iwQhgwpAbGQ==",
      "license": "ISC"
    },
    "node_modules/gauge/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/gauge/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/get-nonce": {
      "version": "1.0.1",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/glob": {
      "version": "10.4.5",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "foreground-child": "^3.1.0",
        "jackspeak": "^3.1.2",
        "minimatch": "^9.0.4",
        "minipass": "^7.1.2",
        "package-json-from-dist": "^1.0.0",
        "path-scurry": "^1.11.1"
      },
      "bin": {
        "glob": "dist/esm/bin.mjs"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/glob/node_modules/brace-expansion": {
      "version": "2.0.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0"
      }
    },
    "node_modules/glob/node_modules/minimatch": {
      "version": "9.0.5",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^2.0.1"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-unicode": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/has-unicode/-/has-unicode-2.0.1.tgz",
      "integrity": "sha512-8Rf9Y83NBReMnx0gFzA8JImQACstCYWUplepDa9xprwwtmgEZUF0h/i5xSA625zB/I37EtrswSST6OXxwaaIJQ==",
      "license": "ISC"
    },
    "node_modules/hash.js": {
      "version": "1.1.7",
      "resolved": "https://registry.npmjs.org/hash.js/-/hash.js-1.1.7.tgz",
      "integrity": "sha512-taOaskGt4z4SOANNseOviYDvjEJinIkRgmp7LbKP2YTTmVxWBl87s/uzK9r+44BclBSp2X7K1hqeNfz9JbBeXA==",
      "license": "MIT",
      "dependencies": {
        "inherits": "^2.0.3",
        "minimalistic-assert": "^1.0.1"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hmac-drbg": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/hmac-drbg/-/hmac-drbg-1.0.1.tgz",
      "integrity": "sha512-Tti3gMqLdZfhOQY1Mzf/AanLiqh1WTiJgEj26ZuYQ9fbkLomzGchCws4FyrSd4VkpBfiNhaE1On+lOz894jvXg==",
      "license": "MIT",
      "dependencies": {
        "hash.js": "^1.0.3",
        "minimalistic-assert": "^1.0.0",
        "minimalistic-crypto-utils": "^1.0.1"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
      "integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
      "license": "MIT",
      "dependencies": {
        "agent-base": "6",
        "debug": "4"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.4.24",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz",
      "integrity": "sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/inflight": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
      "integrity": "sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==",
      "deprecated": "This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.",
      "license": "ISC",
      "dependencies": {
        "once": "^1.3.0",
        "wrappy": "1"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/input-otp": {
      "version": "1.4.1",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8 || ^17.0 || ^18.0 || ^19.0.0 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0.0 || ^19.0.0-rc"
      }
    },
    "node_modules/inquirer": {
      "version": "9.3.7",
      "resolved": "https://registry.npmjs.org/inquirer/-/inquirer-9.3.7.tgz",
      "integrity": "sha512-LJKFHCSeIRq9hanN14IlOtPSTe3lNES7TYDTE2xxdAy1LS5rYphajK1qtwvj3YmQXvvk0U2Vbmcni8P9EIQW9w==",
      "license": "MIT",
      "dependencies": {
        "@inquirer/figures": "^1.0.3",
        "ansi-escapes": "^4.3.2",
        "cli-width": "^4.1.0",
        "external-editor": "^3.1.0",
        "mute-stream": "1.0.0",
        "ora": "^5.4.1",
        "run-async": "^3.0.0",
        "rxjs": "^7.8.1",
        "string-width": "^4.2.3",
        "strip-ansi": "^6.0.1",
        "wrap-ansi": "^6.2.0",
        "yoctocolors-cjs": "^2.1.2"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/inquirer/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/inquirer/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT"
    },
    "node_modules/inquirer/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/inquirer/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/inquirer/node_modules/wrap-ansi": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-6.2.0.tgz",
      "integrity": "sha512-r6lPcBGxZXlIcymEu7InxDMhdW0KDxpLgoFLcguasxCaJ/SOIZwINatK9KY/tf+ZrlywOKU0UDj3ATXUBfxJXA==",
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/internmap": {
      "version": "2.0.3",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/ip-regex": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/ip-regex/-/ip-regex-5.0.0.tgz",
      "integrity": "sha512-fOCG6lhoKKakwv+C6KdsOnGvgXnmgfmp0myi3bcNwj3qfwPAxRKWEuFhvEFF7ceYIz6+1jRZ+yguLFAmUNPEfw==",
      "license": "MIT",
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-arrayish": {
      "version": "0.3.2",
      "devOptional": true,
      "license": "MIT"
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-docker": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-docker/-/is-docker-3.0.0.tgz",
      "integrity": "sha512-eljcgEDlEns/7AXFosB5K/2nCM4P7FQPkGc/DWLy5rmFEWvZayGrik1d9/QIY5nJ4f9YsVvBkA6kJpHn9rISdQ==",
      "license": "MIT",
      "bin": {
        "is-docker": "cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-inside-container": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-inside-container/-/is-inside-container-1.0.0.tgz",
      "integrity": "sha512-KIYLCCJghfHZxqjYBE7rEy0OBuTd5xCHS7tHVgvCLkx7StIoaxwNW3hCALgEUjFfeRk+MG/Qxmp/vtETEF3tRA==",
      "license": "MIT",
      "dependencies": {
        "is-docker": "^3.0.0"
      },
      "bin": {
        "is-inside-container": "cli.js"
      },
      "engines": {
        "node": ">=14.16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-interactive": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-interactive/-/is-interactive-1.0.0.tgz",
      "integrity": "sha512-2HvIEKRoqS62guEC+qBjpvRubdX910WCMuJTZ+I9yvqKU2/12eSL549HMwtabb4oupdj2sMP50k+XJfB/8JE6w==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-unicode-supported": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/is-unicode-supported/-/is-unicode-supported-0.1.0.tgz",
      "integrity": "sha512-knxG2q4UC3u8stRGyAVJCOdxFmv5DZiRcdlIaAQXAbSfJya+OhopNotLQrstBhququ4ZpuKbDc/8S6mgXgPFPw==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-wsl": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/is-wsl/-/is-wsl-3.1.0.tgz",
      "integrity": "sha512-UcVfVfaK4Sc4m7X3dUSoHoozQGBEFeDC+zVo06t98xe8CzHSZZBekNXH+tu0NalHolcJ/QAGqS46Hef7QXBIMw==",
      "license": "MIT",
      "dependencies": {
        "is-inside-container": "^1.0.0"
      },
      "engines": {
        "node": ">=16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/jackspeak": {
      "version": "3.4.3",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "@isaacs/cliui": "^8.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      },
      "optionalDependencies": {
        "@pkgjs/parseargs": "^0.11.0"
      }
    },
    "node_modules/jose": {
      "version": "5.10.0",
      "resolved": "https://registry.npmjs.org/jose/-/jose-5.10.0.tgz",
      "integrity": "sha512-s+3Al/p9g32Iq+oqXxkW//7jk2Vig6FF1CFqzVXoTUXt2qz89YWbL+OwS17NFYEvxC35n0FKeGO2LGYSxeM2Gg==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/js-cookie": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/js-cookie/-/js-cookie-3.0.5.tgz",
      "integrity": "sha512-cEiJEAEoIbWfCZYKWhVwFuvPX1gETRYPw6LlaTKoxD3s2AkXzkCjnp6h0V77ozyqj0jakteJ4YqDJT830+lVGw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "license": "MIT"
    },
    "node_modules/jsonwebtoken": {
      "version": "9.0.2",
      "resolved": "https://registry.npmjs.org/jsonwebtoken/-/jsonwebtoken-9.0.2.tgz",
      "integrity": "sha512-PRp66vJ865SSqOlgqS8hujT5U4AOgMfhrwYIuIhfKaoSCZcirrmASQr8CX7cUg+RMih+hgznrjp99o+W4pJLHQ==",
      "license": "MIT",
      "dependencies": {
        "jws": "^3.2.2",
        "lodash.includes": "^4.3.0",
        "lodash.isboolean": "^3.0.3",
        "lodash.isinteger": "^4.0.4",
        "lodash.isnumber": "^3.0.3",
        "lodash.isplainobject": "^4.0.6",
        "lodash.isstring": "^4.0.1",
        "lodash.once": "^4.0.0",
        "ms": "^2.1.1",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=12",
        "npm": ">=6"
      }
    },
    "node_modules/jwa": {
      "version": "1.4.1",
      "license": "MIT",
      "dependencies": {
        "buffer-equal-constant-time": "1.0.1",
        "ecdsa-sig-formatter": "1.0.11",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/jws": {
      "version": "3.2.2",
      "license": "MIT",
      "dependencies": {
        "jwa": "^1.4.1",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/lilconfig": {
      "version": "3.1.3",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/antonk52"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/lodash": {
      "version": "4.17.21",
      "license": "MIT"
    },
    "node_modules/lodash.includes": {
      "version": "4.3.0",
      "license": "MIT"
    },
    "node_modules/lodash.isboolean": {
      "version": "3.0.3",
      "license": "MIT"
    },
    "node_modules/lodash.isinteger": {
      "version": "4.0.4",
      "license": "MIT"
    },
    "node_modules/lodash.isnumber": {
      "version": "3.0.3",
      "license": "MIT"
    },
    "node_modules/lodash.isplainobject": {
      "version": "4.0.6",
      "license": "MIT"
    },
    "node_modules/lodash.isstring": {
      "version": "4.0.1",
      "license": "MIT"
    },
    "node_modules/lodash.once": {
      "version": "4.1.1",
      "license": "MIT"
    },
    "node_modules/log-symbols": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/log-symbols/-/log-symbols-4.1.0.tgz",
      "integrity": "sha512-8XPvpAA8uyhfteu8pIvQxpJZ7SYYdpUivZpGy6sFsBuKRY/7rQGavedeB8aK+Zkyq6upMFVL/9AW6vOYzfRyLg==",
      "license": "MIT",
      "dependencies": {
        "chalk": "^4.1.0",
        "is-unicode-supported": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-6.0.0.tgz",
      "integrity": "sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==",
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/lucide-react": {
      "version": "0.454.0",
      "license": "ISC",
      "peerDependencies": {
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0-rc"
      }
    },
    "node_modules/make-dir": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/make-dir/-/make-dir-3.1.0.tgz",
      "integrity": "sha512-g3FeP20LNwhALb/6Cz6Dd4F2ngze0jz7tbzrD2wAV+o9FeNHe4rL+yK2md0J/fiSf1sa1ADhXqi5+oVwOM/eGw==",
      "license": "MIT",
      "dependencies": {
        "semver": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/make-dir/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/make-error": {
      "version": "1.3.6",
      "resolved": "https://registry.npmjs.org/make-error/-/make-error-1.3.6.tgz",
      "integrity": "sha512-s8UhlNe7vPKomQhC1qFelMokr/Sc3AgNbso3n74mVPA5LTZwkB9NlXf4XPamLxJE8h0gh73rM94xvwRT2CVInw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/mimic-fn": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/mimic-fn/-/mimic-fn-2.1.0.tgz",
      "integrity": "sha512-OqbOk5oEQeAZ8WXWydlu9HJjz9WVdEIvamMCcXmuqUYjTknH/sqsWvhQ3vgwKFRR1HpjvNBKQ37nbJgYzGqGcg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/mini-svg-data-uri": {
      "version": "1.4.4",
      "license": "MIT",
      "bin": {
        "mini-svg-data-uri": "cli.js"
      }
    },
    "node_modules/minimalistic-assert": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/minimalistic-assert/-/minimalistic-assert-1.0.1.tgz",
      "integrity": "sha512-UtJcAD4yEaGtjPezWuO9wC4nwUnVH/8/Im3yEHQP4b67cXlD/Qr9hdITCU1xDbSEXg2XKNaP8jsReV7vQd00/A==",
      "license": "ISC"
    },
    "node_modules/minimalistic-crypto-utils": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/minimalistic-crypto-utils/-/minimalistic-crypto-utils-1.0.1.tgz",
      "integrity": "sha512-JIYlbt6g8i5jKfJ3xz7rF0LXmv2TkDxBLUkiBeZ7bAx4GnnNMr8xFpGnOxn6GhTEHx3SjRrZEoU+j04prX1ktg==",
      "license": "MIT"
    },
    "node_modules/minimatch": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz",
      "integrity": "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==",
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minipass": {
      "version": "7.1.2",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/minizlib": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/minizlib/-/minizlib-2.1.2.tgz",
      "integrity": "sha512-bAxsR8BVfj60DWXHE3u30oHzfl4G7khkSuPW+qvpd7jFRHm7dLxOjUk1EHACJ/hxLY8phGJ0YhYHZo7jil7Qdg==",
      "license": "MIT",
      "dependencies": {
        "minipass": "^3.0.0",
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/minizlib/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/mkdirp": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz",
      "integrity": "sha512-vVqVZQyf3WLx2Shd0qJ9xuvqgAyKPLAiqITEtqW0oIUjzo3PePDd6fW9iFz30ef7Ysp/oiWqbhszeGWW2T6Gzw==",
      "license": "MIT",
      "bin": {
        "mkdirp": "bin/cmd.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "license": "MIT"
    },
    "node_modules/mute-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/mute-stream/-/mute-stream-1.0.0.tgz",
      "integrity": "sha512-avsJQhyd+680gKXyG/sQc0nXaC6rBkPOfyHYcFb9+hdkqQkR9bdnkJ0AMZhke0oesPqIO+mFFJ+IdBc7mst4IA==",
      "license": "ISC",
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/mz": {
      "version": "2.7.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0",
        "object-assign": "^4.0.1",
        "thenify-all": "^1.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.9",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/next": {
      "version": "15.2.2",
      "resolved": "https://registry.npmjs.org/next/-/next-15.2.2.tgz",
      "integrity": "sha512-dgp8Kcx5XZRjMw2KNwBtUzhngRaURPioxoNIVl5BOyJbhi9CUgEtKDO7fx5wh8Z8vOVX1nYZ9meawJoRrlASYA==",
      "license": "MIT",
      "dependencies": {
        "@next/env": "15.2.2",
        "@swc/counter": "0.1.3",
        "@swc/helpers": "0.5.15",
        "busboy": "1.6.0",
        "caniuse-lite": "^1.0.30001579",
        "postcss": "8.4.31",
        "styled-jsx": "5.1.6"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": "^18.18.0 || ^19.8.0 || >= 20.0.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "15.2.2",
        "@next/swc-darwin-x64": "15.2.2",
        "@next/swc-linux-arm64-gnu": "15.2.2",
        "@next/swc-linux-arm64-musl": "15.2.2",
        "@next/swc-linux-x64-gnu": "15.2.2",
        "@next/swc-linux-x64-musl": "15.2.2",
        "@next/swc-win32-arm64-msvc": "15.2.2",
        "@next/swc-win32-x64-msvc": "15.2.2",
        "sharp": "^0.33.5"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.41.2",
        "babel-plugin-react-compiler": "*",
        "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/next-auth": {
      "version": "4.24.11",
      "resolved": "https://registry.npmjs.org/next-auth/-/next-auth-4.24.11.tgz",
      "integrity": "sha512-pCFXzIDQX7xmHFs4KVH4luCjaCbuPRtZ9oBUjUhOk84mZ9WVPf94n87TxYI4rSRf9HmfHEF8Yep3JrYDVOo3Cw==",
      "license": "ISC",
      "dependencies": {
        "@babel/runtime": "^7.20.13",
        "@panva/hkdf": "^1.0.2",
        "cookie": "^0.7.0",
        "jose": "^4.15.5",
        "oauth": "^0.9.15",
        "openid-client": "^5.4.0",
        "preact": "^10.6.3",
        "preact-render-to-string": "^5.1.19",
        "uuid": "^8.3.2"
      },
      "peerDependencies": {
        "@auth/core": "0.34.2",
        "next": "^12.2.5 || ^13 || ^14 || ^15",
        "nodemailer": "^6.6.5",
        "react": "^17.0.2 || ^18 || ^19",
        "react-dom": "^17.0.2 || ^18 || ^19"
      },
      "peerDependenciesMeta": {
        "@auth/core": {
          "optional": true
        },
        "nodemailer": {
          "optional": true
        }
      }
    },
    "node_modules/next-auth/node_modules/jose": {
      "version": "4.15.9",
      "resolved": "https://registry.npmjs.org/jose/-/jose-4.15.9.tgz",
      "integrity": "sha512-1vUQX+IdDMVPj4k8kOxgUqlcK518yluMuGZwqlr44FS1ppZB/5GWh4rZG89erpOBOJjU/OBsnCVFfapsRz6nEA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/next-auth/node_modules/uuid": {
      "version": "8.3.2",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-8.3.2.tgz",
      "integrity": "sha512-+NYs2QeMWy+GWFOEm9xnn6HCDp0l7QBD7ml8zLUmJ+93Q5NF0NocErnwkTkXVFNiX3/fpC6afS8Dhb/gz7R7eg==",
      "license": "MIT",
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/next-themes": {
      "version": "0.4.6",
      "resolved": "https://registry.npmjs.org/next-themes/-/next-themes-0.4.6.tgz",
      "integrity": "sha512-pZvgD5L0IEvX5/9GWyHMf3m8BKiVQwsCMHfoFosXtXBMnaS0ZnIJ9ST4b4NqLVKDEm8QBxoNNGNaBv2JNF6XNA==",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8 || ^17 || ^18 || ^19 || ^19.0.0-rc",
        "react-dom": "^16.8 || ^17 || ^18 || ^19 || ^19.0.0-rc"
      }
    },
    "node_modules/next/node_modules/postcss": {
      "version": "8.4.31",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.6",
        "picocolors": "^1.0.0",
        "source-map-js": "^1.0.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/node-addon-api": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-5.1.0.tgz",
      "integrity": "sha512-eh0GgfEkpnoWDq+VY8OyvYhFEzBk6jIYbRKdIlyTiAXIVJ8PyBaKb0rp7oDtoddbdoHWhq8wwr+XZ81F1rpNdA==",
      "license": "MIT"
    },
    "node_modules/node-fetch": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.7.0.tgz",
      "integrity": "sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==",
      "license": "MIT",
      "dependencies": {
        "whatwg-url": "^5.0.0"
      },
      "engines": {
        "node": "4.x || >=6.0.0"
      },
      "peerDependencies": {
        "encoding": "^0.1.0"
      },
      "peerDependenciesMeta": {
        "encoding": {
          "optional": true
        }
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.19",
      "license": "MIT"
    },
    "node_modules/nodemailer": {
      "version": "6.10.0",
      "resolved": "https://registry.npmjs.org/nodemailer/-/nodemailer-6.10.0.tgz",
      "integrity": "sha512-SQ3wZCExjeSatLE/HBaXS5vqUOQk6GtBdIIKxiFdmm01mOQZX/POJkO3SUX1wDiYcwUOJwT23scFSC9fY2H8IA==",
      "license": "MIT-0",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/nopt": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/nopt/-/nopt-5.0.0.tgz",
      "integrity": "sha512-Tbj67rffqceeLpcRXrT7vKAN8CwfPeIBgM7E6iBkmKLV7bEMwpGgYLGv0jACUsECaa/vuxP0IjEont6umdMgtQ==",
      "license": "ISC",
      "dependencies": {
        "abbrev": "1"
      },
      "bin": {
        "nopt": "bin/nopt.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/normalize-range": {
      "version": "0.1.2",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/npmlog": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/npmlog/-/npmlog-5.0.1.tgz",
      "integrity": "sha512-AqZtDUWOMKs1G/8lwylVjrdYgqA4d9nu8hc+0gzRxlDb1I10+FHBGMXs6aiQHFdCUUlqH99MUMuLfzWDNDtfxw==",
      "deprecated": "This package is no longer supported.",
      "license": "ISC",
      "dependencies": {
        "are-we-there-yet": "^2.0.0",
        "console-control-strings": "^1.1.0",
        "gauge": "^3.0.0",
        "set-blocking": "^2.0.0"
      }
    },
    "node_modules/oauth": {
      "version": "0.9.15",
      "resolved": "https://registry.npmjs.org/oauth/-/oauth-0.9.15.tgz",
      "integrity": "sha512-a5ERWK1kh38ExDEfoO6qUHJb32rd7aYmPHuyCu3Fta/cnICvYmgd2uhuKXvPD+PXB+gCEYYEaQdIRAjCOwAKNA==",
      "license": "MIT"
    },
    "node_modules/oauth4webapi": {
      "version": "2.17.0",
      "resolved": "https://registry.npmjs.org/oauth4webapi/-/oauth4webapi-2.17.0.tgz",
      "integrity": "sha512-lbC0Z7uzAFNFyzEYRIC+pkSVvDHJTbEW+dYlSBAlCYDe6RxUkJ26bClhk8ocBZip1wfI9uKTe0fm4Ib4RHn6uQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-2.2.0.tgz",
      "integrity": "sha512-gScRMn0bS5fH+IuwyIFgnh9zBdo4DV+6GhygmWM9HyNJSgS0hScp1f5vjtm7oIIOiT9trXrShAkLFSc2IqKNgw==",
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/obuf": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/obuf/-/obuf-1.1.2.tgz",
      "integrity": "sha512-PX1wu0AmAdPqOL1mWhqmlOd8kOIZQwGZw6rh7uby9fTc5lhaOWFLX3I6R1hrF9k3zUY40e6igsLGkDXK92LJNg==",
      "license": "MIT"
    },
    "node_modules/oidc-token-hash": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/oidc-token-hash/-/oidc-token-hash-5.1.0.tgz",
      "integrity": "sha512-y0W+X7Ppo7oZX6eovsRkuzcSM40Bicg2JEJkDJ4irIt1wsYAP5MLSNv+QAogO8xivMffw/9OvV3um1pxXgt1uA==",
      "license": "MIT",
      "engines": {
        "node": "^10.13.0 || >=12.0.0"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/onetime": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/onetime/-/onetime-5.1.2.tgz",
      "integrity": "sha512-kbpaSSGJTWdAY5KPVeMOKXSrPtr8C8C7wodJbcsd51jRnmD+GZu8Y0VoU6Dm5Z4vWr0Ig/1NKuWRKf7j5aaYSg==",
      "license": "MIT",
      "dependencies": {
        "mimic-fn": "^2.1.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/open": {
      "version": "10.1.0",
      "resolved": "https://registry.npmjs.org/open/-/open-10.1.0.tgz",
      "integrity": "sha512-mnkeQ1qP5Ue2wd+aivTD3NHd/lZ96Lu0jgf0pwktLPtx6cTZiH7tyeGRRHs0zX0rbrahXPnXlUnbeXyaBBuIaw==",
      "license": "MIT",
      "dependencies": {
        "default-browser": "^5.2.1",
        "define-lazy-prop": "^3.0.0",
        "is-inside-container": "^1.0.0",
        "is-wsl": "^3.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/openid-client": {
      "version": "5.7.1",
      "resolved": "https://registry.npmjs.org/openid-client/-/openid-client-5.7.1.tgz",
      "integrity": "sha512-jDBPgSVfTnkIh71Hg9pRvtJc6wTwqjRkN88+gCFtYWrlP4Yx2Dsrow8uPi3qLr/aeymPF3o2+dS+wOpglK04ew==",
      "license": "MIT",
      "dependencies": {
        "jose": "^4.15.9",
        "lru-cache": "^6.0.0",
        "object-hash": "^2.2.0",
        "oidc-token-hash": "^5.0.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/openid-client/node_modules/jose": {
      "version": "4.15.9",
      "resolved": "https://registry.npmjs.org/jose/-/jose-4.15.9.tgz",
      "integrity": "sha512-1vUQX+IdDMVPj4k8kOxgUqlcK518yluMuGZwqlr44FS1ppZB/5GWh4rZG89erpOBOJjU/OBsnCVFfapsRz6nEA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/ora": {
      "version": "5.4.1",
      "resolved": "https://registry.npmjs.org/ora/-/ora-5.4.1.tgz",
      "integrity": "sha512-5b6Y85tPxZZ7QytO+BQzysW31HJku27cRIlkbAXaNx+BdcVi+LlRFmVXzeF6a7JCwJpyw5c4b+YSVImQIrBpuQ==",
      "license": "MIT",
      "dependencies": {
        "bl": "^4.1.0",
        "chalk": "^4.1.0",
        "cli-cursor": "^3.1.0",
        "cli-spinners": "^2.5.0",
        "is-interactive": "^1.0.0",
        "is-unicode-supported": "^0.1.0",
        "log-symbols": "^4.1.0",
        "strip-ansi": "^6.0.0",
        "wcwidth": "^1.0.1"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ora/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ora/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/os-tmpdir": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/os-tmpdir/-/os-tmpdir-1.0.2.tgz",
      "integrity": "sha512-D2FR03Vir7FIu45XBY20mTb+/ZSWB00sjU9jdQXt83gDrI4Ztz5Fs7/yy74g2N5SVQY4xY1qDr4rNddwYRVX0g==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/package-json-from-dist": {
      "version": "1.0.1",
      "dev": true,
      "license": "BlueOak-1.0.0"
    },
    "node_modules/path-is-absolute": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
      "integrity": "sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/path-scurry": {
      "version": "1.11.1",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "lru-cache": "^10.2.0",
        "minipass": "^5.0.0 || ^6.0.2 || ^7.0.0"
      },
      "engines": {
        "node": ">=16 || 14 >=14.18"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/path-scurry/node_modules/lru-cache": {
      "version": "10.4.3",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/pg-int8": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/pg-int8/-/pg-int8-1.0.1.tgz",
      "integrity": "sha512-WCtabS6t3c8SkpDBUlb1kjOs7l66xsGdKpIPZsg4wR+B3+u9UAum2odSsF9tnvxg80h4ZxLWMy4pRjOsFIqQpw==",
      "license": "ISC",
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/pg-numeric": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/pg-numeric/-/pg-numeric-1.0.2.tgz",
      "integrity": "sha512-BM/Thnrw5jm2kKLE5uJkXqqExRUY/toLHda65XgFTBTFYZyopbKjBe29Ii3RbkvlsMoFwD+tHeGaCjjv0gHlyw==",
      "license": "ISC",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/pg-protocol": {
      "version": "1.8.0",
      "resolved": "https://registry.npmjs.org/pg-protocol/-/pg-protocol-1.8.0.tgz",
      "integrity": "sha512-jvuYlEkL03NRvOoyoRktBK7+qU5kOvlAwvmrH8sr3wbLrOdVWsRxQfz8mMy9sZFsqJ1hEWNfdWKI4SAmoL+j7g==",
      "license": "MIT"
    },
    "node_modules/pg-types": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/pg-types/-/pg-types-4.0.2.tgz",
      "integrity": "sha512-cRL3JpS3lKMGsKaWndugWQoLOCoP+Cic8oseVcbr0qhPzYD5DWXK+RZ9LY9wxRf7RQia4SCwQlXk0q6FCPrVng==",
      "license": "MIT",
      "dependencies": {
        "pg-int8": "1.0.1",
        "pg-numeric": "1.0.2",
        "postgres-array": "~3.0.1",
        "postgres-bytea": "~3.0.0",
        "postgres-date": "~2.1.0",
        "postgres-interval": "^3.0.0",
        "postgres-range": "^1.1.1"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pify": {
      "version": "2.3.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pirates": {
      "version": "4.0.6",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.3",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.8",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-import": {
      "version": "15.1.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "postcss-value-parser": "^4.0.0",
        "read-cache": "^1.0.0",
        "resolve": "^1.1.7"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "postcss": "^8.0.0"
      }
    },
    "node_modules/postcss-js": {
      "version": "4.0.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "camelcase-css": "^2.0.1"
      },
      "engines": {
        "node": "^12 || ^14 || >= 16"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/postcss/"
      },
      "peerDependencies": {
        "postcss": "^8.4.21"
      }
    },
    "node_modules/postcss-load-config": {
      "version": "4.0.2",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "lilconfig": "^3.0.0",
        "yaml": "^2.3.4"
      },
      "engines": {
        "node": ">= 14"
      },
      "peerDependencies": {
        "postcss": ">=8.0.9",
        "ts-node": ">=9.0.0"
      },
      "peerDependenciesMeta": {
        "postcss": {
          "optional": true
        },
        "ts-node": {
          "optional": true
        }
      }
    },
    "node_modules/postcss-nested": {
      "version": "6.2.0",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "postcss-selector-parser": "^6.1.1"
      },
      "engines": {
        "node": ">=12.0"
      },
      "peerDependencies": {
        "postcss": "^8.2.14"
      }
    },
    "node_modules/postcss-selector-parser": {
      "version": "6.1.2",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "util-deprecate": "^1.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "license": "MIT"
    },
    "node_modules/postgres-array": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/postgres-array/-/postgres-array-3.0.3.tgz",
      "integrity": "sha512-u8CaN44IzisrzULVvqoJ2968j6XDsFGdc+Kw/6vHNhD6bfu2FHDOHNhgBYgsl6t7ib9KwUi8vKjTR5gowTIMbg==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/postgres-bytea": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/postgres-bytea/-/postgres-bytea-3.0.0.tgz",
      "integrity": "sha512-CNd4jim9RFPkObHSjVHlVrxoVQXz7quwNFpz7RY1okNNme49+sVyiTvTRobiLV548Hx/hb1BG+iE7h9493WzFw==",
      "license": "MIT",
      "dependencies": {
        "obuf": "~1.1.2"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/postgres-date": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/postgres-date/-/postgres-date-2.1.0.tgz",
      "integrity": "sha512-K7Juri8gtgXVcDfZttFKVmhglp7epKb1K4pgrkLxehjqkrgPhfG6OO8LHLkfaqkbpjNRnra018XwAr1yQFWGcA==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/postgres-interval": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/postgres-interval/-/postgres-interval-3.0.0.tgz",
      "integrity": "sha512-BSNDnbyZCXSxgA+1f5UU2GmwhoI0aU5yMxRGO8CdFEcY2BQF9xm/7MqKnYoM1nJDk8nONNWDk9WeSmePFhQdlw==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/postgres-range": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/postgres-range/-/postgres-range-1.1.4.tgz",
      "integrity": "sha512-i/hbxIE9803Alj/6ytL7UHQxRvZkI9O4Sy+J3HGc4F4oo/2eQAjTSNJ0bfxyse3bH0nuVesCk+3IRLaMtG3H6w==",
      "license": "MIT"
    },
    "node_modules/preact": {
      "version": "10.26.4",
      "resolved": "https://registry.npmjs.org/preact/-/preact-10.26.4.tgz",
      "integrity": "sha512-KJhO7LBFTjP71d83trW+Ilnjbo+ySsaAgCfXOXUlmGzJ4ygYPWmysm77yg4emwfmoz3b22yvH5IsVFHbhUaH5w==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/preact"
      }
    },
    "node_modules/preact-render-to-string": {
      "version": "5.2.6",
      "resolved": "https://registry.npmjs.org/preact-render-to-string/-/preact-render-to-string-5.2.6.tgz",
      "integrity": "sha512-JyhErpYOvBV1hEPwIxc/fHWXPfnEGdRKxc8gFdAZ7XV4tlzyzG847XAyEZqoDnynP88akM4eaHcSOzNcLWFguw==",
      "license": "MIT",
      "dependencies": {
        "pretty-format": "^3.8.0"
      },
      "peerDependencies": {
        "preact": ">=10"
      }
    },
    "node_modules/pretty-format": {
      "version": "3.8.0",
      "resolved": "https://registry.npmjs.org/pretty-format/-/pretty-format-3.8.0.tgz",
      "integrity": "sha512-WuxUnVtlWL1OfZFQFuqvnvs6MiAGk9UNsBostyBOB0Is9wb5uRESevA6rnl/rkksXaGX3GzZhPup5d6Vp1nFew==",
      "license": "MIT"
    },
    "node_modules/prisma": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/prisma/-/prisma-6.5.0.tgz",
      "integrity": "sha512-yUGXmWqv5F4PByMSNbYFxke/WbnyTLjnJ5bKr8fLkcnY7U5rU9rUTh/+Fja+gOrRxEgtCbCtca94IeITj4j/pg==",
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@prisma/config": "6.5.0",
        "@prisma/engines": "6.5.0"
      },
      "bin": {
        "prisma": "build/index.js"
      },
      "engines": {
        "node": ">=18.18"
      },
      "optionalDependencies": {
        "fsevents": "2.3.3"
      },
      "peerDependencies": {
        "typescript": ">=5.1.0"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/prop-types": {
      "version": "15.8.1",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.4.0",
        "object-assign": "^4.1.1",
        "react-is": "^16.13.1"
      }
    },
    "node_modules/property-expr": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/property-expr/-/property-expr-2.0.6.tgz",
      "integrity": "sha512-SVtmxhRE/CGkn3eZY1T6pC8Nln6Fr/lu1mKSgRud0eC73whjGfoAogbn78LkD8aFL0zz3bAFerKSnOl7NlErBA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/react": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
      "integrity": "sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2iQ==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-day-picker": {
      "version": "9.6.1",
      "resolved": "https://registry.npmjs.org/react-day-picker/-/react-day-picker-9.6.1.tgz",
      "integrity": "sha512-PiRT/l6yk+fLpSmyMFUHIep8dbKAlilJGfDB0N2krXFhnxbitZf/t+ePDLk8kou/lYUVWAfIIxBJjFuvrNy7Hw==",
      "license": "MIT",
      "dependencies": {
        "@date-fns/tz": "^1.2.0",
        "date-fns": "^4.1.0",
        "date-fns-jalali": "^4.1.0-0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "individual",
        "url": "https://github.com/sponsors/gpbl"
      },
      "peerDependencies": {
        "react": ">=16.8.0"
      }
    },
    "node_modules/react-dom": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz",
      "integrity": "sha512-5m4nQKp+rZRb09LNH59GM4BxTh9251/ylbKIbpe7TpGxfJ+9kv6BLkLBXIjjspbgbnIBNqlI23tRnTWT0snUIw==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0",
        "scheduler": "^0.23.2"
      },
      "peerDependencies": {
        "react": "^18.3.1"
      }
    },
    "node_modules/react-hook-form": {
      "version": "7.54.2",
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/react-hook-form"
      },
      "peerDependencies": {
        "react": "^16.8.0 || ^17 || ^18 || ^19"
      }
    },
    "node_modules/react-icons": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/react-icons/-/react-icons-5.5.0.tgz",
      "integrity": "sha512-MEFcXdkP3dLo8uumGI5xN3lDFNsRtrjbOEKDLD7yv76v4wpnEq2Lt2qeHaQOr34I/wPN3s3+N08WkQ+CW37Xiw==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "react": "*"
      }
    },
    "node_modules/react-is": {
      "version": "16.13.1",
      "license": "MIT"
    },
    "node_modules/react-remove-scroll": {
      "version": "2.6.3",
      "license": "MIT",
      "dependencies": {
        "react-remove-scroll-bar": "^2.3.7",
        "react-style-singleton": "^2.2.3",
        "tslib": "^2.1.0",
        "use-callback-ref": "^1.3.3",
        "use-sidecar": "^1.1.3"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/react-remove-scroll-bar": {
      "version": "2.3.8",
      "license": "MIT",
      "dependencies": {
        "react-style-singleton": "^2.2.2",
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/react-resizable-panels": {
      "version": "2.1.7",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.14.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc",
        "react-dom": "^16.14.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      }
    },
    "node_modules/react-smooth": {
      "version": "4.0.4",
      "license": "MIT",
      "dependencies": {
        "fast-equals": "^5.0.1",
        "prop-types": "^15.8.1",
        "react-transition-group": "^4.4.5"
      },
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
        "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/react-style-singleton": {
      "version": "2.2.3",
      "license": "MIT",
      "dependencies": {
        "get-nonce": "^1.0.0",
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/react-transition-group": {
      "version": "4.4.5",
      "license": "BSD-3-Clause",
      "dependencies": {
        "@babel/runtime": "^7.5.5",
        "dom-helpers": "^5.0.1",
        "loose-envify": "^1.4.0",
        "prop-types": "^15.6.2"
      },
      "peerDependencies": {
        "react": ">=16.6.0",
        "react-dom": ">=16.6.0"
      }
    },
    "node_modules/read-cache": {
      "version": "1.0.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pify": "^2.3.0"
      }
    },
    "node_modules/readable-stream": {
      "version": "3.6.2",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.2.tgz",
      "integrity": "sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==",
      "license": "MIT",
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/readdirp": {
      "version": "3.6.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/recharts": {
      "version": "2.15.0",
      "license": "MIT",
      "dependencies": {
        "clsx": "^2.0.0",
        "eventemitter3": "^4.0.1",
        "lodash": "^4.17.21",
        "react-is": "^18.3.1",
        "react-smooth": "^4.0.0",
        "recharts-scale": "^0.4.4",
        "tiny-invariant": "^1.3.1",
        "victory-vendor": "^36.6.8"
      },
      "engines": {
        "node": ">=14"
      },
      "peerDependencies": {
        "react": "^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
        "react-dom": "^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/recharts-scale": {
      "version": "0.4.5",
      "license": "MIT",
      "dependencies": {
        "decimal.js-light": "^2.4.1"
      }
    },
    "node_modules/recharts/node_modules/react-is": {
      "version": "18.3.1",
      "license": "MIT"
    },
    "node_modules/regenerator-runtime": {
      "version": "0.14.1",
      "license": "MIT"
    },
    "node_modules/resolve": {
      "version": "1.22.10",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-core-module": "^2.16.0",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/restore-cursor": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-3.1.0.tgz",
      "integrity": "sha512-l+sSefzHpj5qimhFSE5a8nufZYAM3sBSVMAPtYkmC+4EH2anSGaEMXSD0izRQbu9nfyQ9y5JrVmp7E8oZrUjvA==",
      "license": "MIT",
      "dependencies": {
        "onetime": "^5.1.0",
        "signal-exit": "^3.0.2"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/restore-cursor/node_modules/signal-exit": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.7.tgz",
      "integrity": "sha512-wnD2ZE+l+SPC/uoS0vXeE9L1+0wuaMqKlfz9AMUo38JsyLSBWSFcHR1Rri62LZc12vLr1gb3jl7iwQhgwpAbGQ==",
      "license": "ISC"
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/run-applescript": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/run-applescript/-/run-applescript-7.0.0.tgz",
      "integrity": "sha512-9by4Ij99JUr/MCFBUkDKLWK3G9HVXmabKz9U5MlIAIuvuzkiOicRYs8XJLxX+xahD+mLiiCYDqF9dKAgtzKP1A==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/run-async": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/run-async/-/run-async-3.0.0.tgz",
      "integrity": "sha512-540WwVDOMxA6dN6We19EcT9sc3hkXPw5mzRNGM3FkdN/vtE9NFvj5lFAPNwUDmJjXidm3v7TC1cTE7t17Ulm1Q==",
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/rxjs": {
      "version": "7.8.2",
      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.2.tgz",
      "integrity": "sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/scheduler": {
      "version": "0.23.2",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.23.2.tgz",
      "integrity": "sha512-UOShsPwz7NrMUqhR6t0hWjFduvOzbtv7toDH1/hIrfRNIDBnnBWd0CwJTGvTpngVlmwGCdP9/Zl/tVrDqcuYzQ==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0"
      }
    },
    "node_modules/semver": {
      "version": "7.7.1",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/server-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/server-only/-/server-only-0.0.1.tgz",
      "integrity": "sha512-qepMx2JxAa5jjfzxG79yPPq+8BuFToHd1hm7kI+Z4zAq1ftQiP7HcxMhDDItrbtwVeLg/cY2JnKnrcFkmiswNA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/set-blocking": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/set-blocking/-/set-blocking-2.0.0.tgz",
      "integrity": "sha512-KiKBS8AnWGEyLzofFfmvKwpdPzqiy16LvQfK3yv/fVH7Bj13/wl3JSR1J+rfgRE9q7xUJK4qvgS8raSOeLUehw==",
      "license": "ISC"
    },
    "node_modules/shallowequal": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/shallowequal/-/shallowequal-1.1.0.tgz",
      "integrity": "sha512-y0m1JoUZSlPAjXVtPPW70aZWfIL/dSP7AFkRnniLCrK/8MDKog3TySTBmckD+RObVxH0v4Tox67+F14PdED2oQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/sharp": {
      "version": "0.33.5",
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "color": "^4.2.3",
        "detect-libc": "^2.0.3",
        "semver": "^7.6.3"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.33.5",
        "@img/sharp-darwin-x64": "0.33.5",
        "@img/sharp-libvips-darwin-arm64": "1.0.4",
        "@img/sharp-libvips-darwin-x64": "1.0.4",
        "@img/sharp-libvips-linux-arm": "1.0.5",
        "@img/sharp-libvips-linux-arm64": "1.0.4",
        "@img/sharp-libvips-linux-s390x": "1.0.4",
        "@img/sharp-libvips-linux-x64": "1.0.4",
        "@img/sharp-libvips-linuxmusl-arm64": "1.0.4",
        "@img/sharp-libvips-linuxmusl-x64": "1.0.4",
        "@img/sharp-linux-arm": "0.33.5",
        "@img/sharp-linux-arm64": "0.33.5",
        "@img/sharp-linux-s390x": "0.33.5",
        "@img/sharp-linux-x64": "0.33.5",
        "@img/sharp-linuxmusl-arm64": "0.33.5",
        "@img/sharp-linuxmusl-x64": "0.33.5",
        "@img/sharp-wasm32": "0.33.5",
        "@img/sharp-win32-ia32": "0.33.5",
        "@img/sharp-win32-x64": "0.33.5"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/signal-exit": {
      "version": "4.1.0",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/simple-swizzle": {
      "version": "0.2.2",
      "devOptional": true,
      "license": "MIT",
      "dependencies": {
        "is-arrayish": "^0.3.1"
      }
    },
    "node_modules/sonner": {
      "version": "1.7.4",
      "license": "MIT",
      "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0 || ^19.0.0-rc",
        "react-dom": "^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/streamsearch": {
      "version": "1.1.0",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "license": "MIT",
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/string-width": {
      "version": "5.1.2",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eastasianwidth": "^0.2.0",
        "emoji-regex": "^9.2.2",
        "strip-ansi": "^7.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/string-width-cjs": {
      "name": "string-width",
      "version": "4.2.3",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/string-width-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/string-width-cjs/node_modules/emoji-regex": {
      "version": "8.0.0",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/string-width-cjs/node_modules/strip-ansi": {
      "version": "6.0.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "7.1.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^6.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
      }
    },
    "node_modules/strip-ansi-cjs": {
      "name": "strip-ansi",
      "version": "6.0.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/styled-components": {
      "version": "6.1.15",
      "resolved": "https://registry.npmjs.org/styled-components/-/styled-components-6.1.15.tgz",
      "integrity": "sha512-PpOTEztW87Ua2xbmLa7yssjNyUF9vE7wdldRfn1I2E6RTkqknkBYpj771OxM/xrvRGinLy2oysa7GOd7NcZZIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@emotion/is-prop-valid": "1.2.2",
        "@emotion/unitless": "0.8.1",
        "@types/stylis": "4.2.5",
        "css-to-react-native": "3.2.0",
        "csstype": "3.1.3",
        "postcss": "8.4.49",
        "shallowequal": "1.1.0",
        "stylis": "4.3.2",
        "tslib": "2.6.2"
      },
      "engines": {
        "node": ">= 16"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/styled-components"
      },
      "peerDependencies": {
        "react": ">= 16.8.0",
        "react-dom": ">= 16.8.0"
      }
    },
    "node_modules/styled-components/node_modules/postcss": {
      "version": "8.4.49",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.4.49.tgz",
      "integrity": "sha512-OCVPnIObs4N29kxTjzLfUryOkvZEq+pf8jTF0lg8E7uETuWHA+v7j3c/xJmiqpX450191LlmZfUKkXxkTry7nA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.7",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/styled-components/node_modules/tslib": {
      "version": "2.6.2",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.6.2.tgz",
      "integrity": "sha512-AEYxH93jGFPn/a2iVAwW87VuUIkR1FVUKB77NwMF7nBTDkDrrT/Hpt/IrCJ0QXhW27jTBDcf5ZY7w6RiqTMw2Q==",
      "dev": true,
      "license": "0BSD"
    },
    "node_modules/styled-jsx": {
      "version": "5.1.6",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/stylis": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/stylis/-/stylis-4.3.2.tgz",
      "integrity": "sha512-bhtUjWd/z6ltJiQwg0dUfxEJ+W+jdqQd8TbWLWyeIJHlnsqmGLRFFd8e5mA0AZi/zx90smXRlN66YMTcaSFifg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/sucrase": {
      "version": "3.35.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.2",
        "commander": "^4.0.0",
        "glob": "^10.3.10",
        "lines-and-columns": "^1.1.6",
        "mz": "^2.7.0",
        "pirates": "^4.0.1",
        "ts-interface-checker": "^0.1.9"
      },
      "bin": {
        "sucrase": "bin/sucrase",
        "sucrase-node": "bin/sucrase-node"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tailwind-merge": {
      "version": "2.6.0",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/dcastil"
      }
    },
    "node_modules/tailwindcss": {
      "version": "3.4.17",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "arg": "^5.0.2",
        "chokidar": "^3.6.0",
        "didyoumean": "^1.2.2",
        "dlv": "^1.1.3",
        "fast-glob": "^3.3.2",
        "glob-parent": "^6.0.2",
        "is-glob": "^4.0.3",
        "jiti": "^1.21.6",
        "lilconfig": "^3.1.3",
        "micromatch": "^4.0.8",
        "normalize-path": "^3.0.0",
        "object-hash": "^3.0.0",
        "picocolors": "^1.1.1",
        "postcss": "^8.4.47",
        "postcss-import": "^15.1.0",
        "postcss-js": "^4.0.1",
        "postcss-load-config": "^4.0.2",
        "postcss-nested": "^6.2.0",
        "postcss-selector-parser": "^6.1.2",
        "resolve": "^1.22.8",
        "sucrase": "^3.35.0"
      },
      "bin": {
        "tailwind": "lib/cli.js",
        "tailwindcss": "lib/cli.js"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/tailwindcss-animate": {
      "version": "1.0.7",
      "license": "MIT",
      "peerDependencies": {
        "tailwindcss": ">=3.0.0 || insiders"
      }
    },
    "node_modules/tailwindcss/node_modules/fast-glob": {
      "version": "3.3.3",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/tailwindcss/node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/tailwindcss/node_modules/jiti": {
      "version": "1.21.7",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jiti": "bin/jiti.js"
      }
    },
    "node_modules/tailwindcss/node_modules/object-hash": {
      "version": "3.0.0",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/tar": {
      "version": "6.2.1",
      "resolved": "https://registry.npmjs.org/tar/-/tar-6.2.1.tgz",
      "integrity": "sha512-DZ4yORTwrbTj/7MZYq2w+/ZFdI6OZ/f9SFHR+71gIVUZhOQPHzVCLpvRnPgyaMpfWxxk/4ONva3GQSyNIKRv6A==",
      "license": "ISC",
      "dependencies": {
        "chownr": "^2.0.0",
        "fs-minipass": "^2.0.0",
        "minipass": "^5.0.0",
        "minizlib": "^2.1.1",
        "mkdirp": "^1.0.3",
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/tar/node_modules/minipass": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-5.0.0.tgz",
      "integrity": "sha512-3FnjYuehv9k6ovOEbyOswadCDPX1piCfhV8ncmYtHOjuPwylVWsghTLo7rabjC3Rx5xD4HDx8Wm1xnMF7S5qFQ==",
      "license": "ISC",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/thenify": {
      "version": "3.3.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0"
      }
    },
    "node_modules/thenify-all": {
      "version": "1.6.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "thenify": ">= 3.1.0 < 4"
      },
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/tiny-case": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/tiny-case/-/tiny-case-1.0.3.tgz",
      "integrity": "sha512-Eet/eeMhkO6TX8mnUteS9zgPbUMQa4I6Kkp5ORiBD5476/m+PIRiumP5tmh5ioJpH7k51Kehawy2UDfsnxxY8Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/tiny-invariant": {
      "version": "1.3.3",
      "license": "MIT"
    },
    "node_modules/tmp": {
      "version": "0.0.33",
      "resolved": "https://registry.npmjs.org/tmp/-/tmp-0.0.33.tgz",
      "integrity": "sha512-jRCJlojKnZ3addtTOjdIqoRuPEKBvNXcGYqzO6zWZX8KfKEpnGY5jfggJQ3EjKuu8D4bJRr0y+cYJFmYbImXGw==",
      "license": "MIT",
      "dependencies": {
        "os-tmpdir": "~1.0.2"
      },
      "engines": {
        "node": ">=0.6.0"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/toposort": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/toposort/-/toposort-2.0.2.tgz",
      "integrity": "sha512-0a5EOkAUp8D4moMi2W8ZF8jcga7BgZd91O/yabJCFY8az+XSzeGyTKs0Aoo897iV1Nj6guFq8orWDS96z91oGg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/tr46": {
      "version": "0.0.3",
      "resolved": "https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz",
      "integrity": "sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==",
      "license": "MIT"
    },
    "node_modules/ts-interface-checker": {
      "version": "0.1.13",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/ts-node": {
      "version": "10.9.2",
      "resolved": "https://registry.npmjs.org/ts-node/-/ts-node-10.9.2.tgz",
      "integrity": "sha512-f0FFpIdcHgn8zcPSbf1dRevwt047YMnaiJM3u2w2RewrB+fob/zePZcrOyQoLMMO7aBIddLcQIEK5dYjkLnGrQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@cspotcode/source-map-support": "^0.8.0",
        "@tsconfig/node10": "^1.0.7",
        "@tsconfig/node12": "^1.0.7",
        "@tsconfig/node14": "^1.0.0",
        "@tsconfig/node16": "^1.0.2",
        "acorn": "^8.4.1",
        "acorn-walk": "^8.1.1",
        "arg": "^4.1.0",
        "create-require": "^1.1.0",
        "diff": "^4.0.1",
        "make-error": "^1.1.1",
        "v8-compile-cache-lib": "^3.0.1",
        "yn": "3.1.1"
      },
      "bin": {
        "ts-node": "dist/bin.js",
        "ts-node-cwd": "dist/bin-cwd.js",
        "ts-node-esm": "dist/bin-esm.js",
        "ts-node-script": "dist/bin-script.js",
        "ts-node-transpile-only": "dist/bin-transpile.js",
        "ts-script": "dist/bin-script-deprecated.js"
      },
      "peerDependencies": {
        "@swc/core": ">=1.2.50",
        "@swc/wasm": ">=1.2.50",
        "@types/node": "*",
        "typescript": ">=2.7"
      },
      "peerDependenciesMeta": {
        "@swc/core": {
          "optional": true
        },
        "@swc/wasm": {
          "optional": true
        }
      }
    },
    "node_modules/ts-node/node_modules/arg": {
      "version": "4.1.3",
      "resolved": "https://registry.npmjs.org/arg/-/arg-4.1.3.tgz",
      "integrity": "sha512-58S9QDqG0Xx27YwPSt9fJxivjYl432YCwfDMfZ+71RAqUrZef7LrKQZ3LHLOwCS4FLNBplP533Zx895SeOCHvA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "license": "0BSD"
    },
    "node_modules/type-fest": {
      "version": "0.21.3",
      "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-0.21.3.tgz",
      "integrity": "sha512-t0rzBq87m3fVcduHDUFhKmyyX+9eo6WQjZvf51Ea/M0Q7+T374Jp1aUiyUl0GKxp8M/OETVHSDvmkyPgvX+X2w==",
      "license": "(MIT OR CC0-1.0)",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/typescript": {
      "version": "5.8.2",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.8.2.tgz",
      "integrity": "sha512-aJn6wq13/afZp/jT9QZmwEjDqqvSGp1VT5GVg+f/t6/oVyrgXM6BY1h9BRh/O5p3PlUPAe+WuiEZOmb/49RqoQ==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "license": "MIT"
    },
    "node_modules/update-browserslist-db": {
      "version": "1.1.3",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/use-callback-ref": {
      "version": "1.3.3",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/use-sidecar": {
      "version": "1.1.3",
      "license": "MIT",
      "dependencies": {
        "detect-node-es": "^1.1.0",
        "tslib": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/use-sync-external-store": {
      "version": "1.4.0",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "license": "MIT"
    },
    "node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "license": "MIT",
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/v8-compile-cache-lib": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/v8-compile-cache-lib/-/v8-compile-cache-lib-3.0.1.tgz",
      "integrity": "sha512-wa7YjyUGfNZngI/vtK0UHAN+lgDCxBPCylVXGp0zu59Fz5aiGtNXaq3DhIov063MorB+VfufLh3JlF2KdTK3xg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vaul": {
      "version": "0.9.9",
      "license": "MIT",
      "dependencies": {
        "@radix-ui/react-dialog": "^1.1.1"
      },
      "peerDependencies": {
        "react": "^16.8 || ^17.0 || ^18.0",
        "react-dom": "^16.8 || ^17.0 || ^18.0"
      }
    },
    "node_modules/victory-vendor": {
      "version": "36.9.2",
      "license": "MIT AND ISC",
      "dependencies": {
        "@types/d3-array": "^3.0.3",
        "@types/d3-ease": "^3.0.0",
        "@types/d3-interpolate": "^3.0.1",
        "@types/d3-scale": "^4.0.2",
        "@types/d3-shape": "^3.1.0",
        "@types/d3-time": "^3.0.0",
        "@types/d3-timer": "^3.0.0",
        "d3-array": "^3.1.6",
        "d3-ease": "^3.0.1",
        "d3-interpolate": "^3.0.1",
        "d3-scale": "^4.0.2",
        "d3-shape": "^3.1.0",
        "d3-time": "^3.0.0",
        "d3-timer": "^3.0.1"
      }
    },
    "node_modules/wcwidth": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/wcwidth/-/wcwidth-1.0.1.tgz",
      "integrity": "sha512-XHPEwS0q6TaxcvG85+8EYkbiCux2XtWG2mkc47Ng2A77BQu9+DqIOJldST4HgPkuea7dvKSj5VgX3P1d4rW8Tg==",
      "license": "MIT",
      "dependencies": {
        "defaults": "^1.0.3"
      }
    },
    "node_modules/webidl-conversions": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-3.0.1.tgz",
      "integrity": "sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==",
      "license": "BSD-2-Clause"
    },
    "node_modules/whatwg-url": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-5.0.0.tgz",
      "integrity": "sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==",
      "license": "MIT",
      "dependencies": {
        "tr46": "~0.0.3",
        "webidl-conversions": "^3.0.0"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/wide-align": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/wide-align/-/wide-align-1.1.5.tgz",
      "integrity": "sha512-eDMORYaPNZ4sQIuuYPDHdQvf4gyCF9rEEV/yPxGfwPkRodwEgiMUUXTx/dex+Me0wxx53S+NgUHaP7y3MGlDmg==",
      "license": "ISC",
      "dependencies": {
        "string-width": "^1.0.2 || 2 || 3 || 4"
      }
    },
    "node_modules/wide-align/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wide-align/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT"
    },
    "node_modules/wide-align/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wide-align/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi": {
      "version": "8.1.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.1.0",
        "string-width": "^5.0.1",
        "strip-ansi": "^7.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi-cjs": {
      "name": "wrap-ansi",
      "version": "7.0.0",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/emoji-regex": {
      "version": "8.0.0",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/wrap-ansi-cjs/node_modules/string-width": {
      "version": "4.2.3",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/strip-ansi": {
      "version": "6.0.1",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi/node_modules/ansi-styles": {
      "version": "6.2.1",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "license": "ISC"
    },
    "node_modules/ws": {
      "version": "8.18.1",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.18.1.tgz",
      "integrity": "sha512-RKW2aJZMXeMxVpnZ6bck+RswznaxmzdULiBr6KY7XkTnW8uvt0iT9H5DkHUChXrc+uurzwa0rVI16n/Xzjdz1w==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "license": "ISC"
    },
    "node_modules/yaml": {
      "version": "2.7.0",
      "dev": true,
      "license": "ISC",
      "bin": {
        "yaml": "bin.mjs"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/yn": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yn/-/yn-3.1.1.tgz",
      "integrity": "sha512-Ux4ygGWsu2c7isFWe8Yu1YluJmqVhxqK2cLXNQA5AcC3QfbGNpM7fu0Y8b/z16pXLnFxZYvWhd3fhBY9DLmC6Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/yoctocolors-cjs": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/yoctocolors-cjs/-/yoctocolors-cjs-2.1.2.tgz",
      "integrity": "sha512-cYVsTjKl8b+FrnidjibDWskAv7UKOfcwaVZdp/it9n1s9fU3IkgDbhdIRKCW4JDsAlECJY0ytoVPT3sK6kideA==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/yup": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/yup/-/yup-1.6.1.tgz",
      "integrity": "sha512-JED8pB50qbA4FOkDol0bYF/p60qSEDQqBD0/qeIrUCG1KbPBIQ776fCUNb9ldbPcSTxA69g/47XTo4TqWiuXOA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "property-expr": "^2.0.5",
        "tiny-case": "^1.0.3",
        "toposort": "^2.0.2",
        "type-fest": "^2.19.0"
      }
    },
    "node_modules/yup/node_modules/type-fest": {
      "version": "2.19.0",
      "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-2.19.0.tgz",
      "integrity": "sha512-RAH822pAdBgcNMAfWnCBU3CFZcfZ/i1eZjwFU/dsLKumyuuP3niueg2UAukXYF0E2AAoc82ZSSf9J0WQBinzHA==",
      "dev": true,
      "license": "(MIT OR CC0-1.0)",
      "engines": {
        "node": ">=12.20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "3.24.2",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    }
  }
}


```

## package.json

```json

{
  "name": "my-v0-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "postinstall": "prisma generate",
    "dev": "next dev",
    "build": "next build ",
    "start": "next start",
    "lint": "next lint",
    "type": "module",
    "setup-db": "ts-node --transpile-only scripts/setup-db.ts",
    "setup-rls": "ts-node --transpile-only scripts/setup-rls.ts"
  },
  "prisma": {
    "schema": "prisma/schema.prisma"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@neondatabase/serverless": "^0.10.4",
    "@prisma/adapter-neon": "^6.5.0",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-context-menu": "^2.2.4",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-hover-card": "^1.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.4",
    "@radix-ui/react-navigation-menu": "^1.2.3",
    "@radix-ui/react-popover": "latest",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "latest",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "latest",
    "@stackframe/init-stack": "^2.7.27",
    "@tailwindcss/forms": "latest",
    "autoprefixer": "^10.4.20",
    "bcryptjs": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "date-fns": "latest",
    "embla-carousel-react": "8.5.1",
    "input-otp": "1.4.1",
    "jsonwebtoken": "latest",
    "lucide-react": "^0.454.0",
    "next": "15.2.2",
    "next-auth": "^4.24.11",
    "next-themes": "latest",
    "nodemailer": "latest",
    "prisma": "^6.5.0",
    "react": "^18.3.1",
    "react-day-picker": "latest",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.1",
    "react-resizable-panels": "^2.1.7",
    "recharts": "2.15.0",
    "sonner": "^1.7.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss": "latest",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.6",
    "ws": "^8.18.1",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@prisma/client": "^6.5.0",
    "@stackframe/stack": "^2.4.8",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/node": "^22.13.10",
    "@types/nodemailer": "^6.4.17",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "postcss": "^8",
    "tailwindcss": "^3.4.17",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.2"
  }
}


```

## postcss.config.js

```javascript
// safetyfirst/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}



```

## prisma\seed.ts

```typescript
// safetyfirst/prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  console.log({ admin })

  // Create CEO user
  const ceoPassword = await bcrypt.hash("ceo123", 10)
  const ceo = await prisma.user.upsert({
    where: { email: "ceo@example.com" },
    update: {},
    create: {
      email: "ceo@example.com",
      name: "CEO User",
      password: ceoPassword,
      role: "CEO",
    },
  })

  console.log({ ceo })

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
      company: "ABC Construction",
      position: "Tradesman",
    },
  })

  console.log({ user })

  // Create a job site
  const jobSite = await prisma.jobSite.upsert({
    where: { id: "site_1" },
    update: {},
    create: {
      id: "site_1",
      name: "Downtown Tower Project",
      address: "123 Main St, Sydney NSW 2000",
      description: "A 30-story commercial tower development",
      createdById: admin.id,
    },
  })

  console.log({ jobSite })

  // Create an induction
  const induction = await prisma.induction.upsert({
    where: { id: "ind_1" },
    update: {},
    create: {
      id: "ind_1",
      title: "General Site Induction",
      description: "Basic safety induction for all workers",
      content: {
        sections: [
          {
            title: "Introduction",
            content: "Welcome to the site. This induction covers basic safety procedures.",
          },
          {
            title: "Emergency Procedures",
            content: "In case of emergency, proceed to the nearest exit and gather at the assembly point.",
          },
          {
            title: "PPE Requirements",
            content: "Hard hat, safety boots, and high-visibility vest are mandatory at all times.",
          },
        ],
      },
      jobSiteId: jobSite.id,
    },
  })

  console.log({ induction })

  // Create a SWMS
  const swms = await prisma.swms.upsert({
    where: { id: "swms_1" },
    update: {},
    create: {
      id: "swms_1",
      title: "Working at Heights",
      description: "Safe work method statement for working at heights above 2 meters",
      content: {
        hazards: [
          {
            description: "Falling from height",
            controls: "Use harness, secure anchor points, and ensure proper training",
            riskLevel: "high",
          },
          {
            description: "Falling objects",
            controls: "Secure tools, use tool lanyards, and establish exclusion zones below",
            riskLevel: "medium",
          },
        ],
      },
      status: "APPROVED",
      jobSiteId: jobSite.id,
      createdById: admin.id,
      approvedById: ceo.id,
      approvedAt: new Date(),
    },
  })

  console.log({ swms })
}

main()
  .catch((e) => console.error(e))
  .finally(() => {
    process.exit(0);
  });



```

## project_code.md

```markdown
# Project Code Documentation
Generated on 16/03/2025, 12:29:47 am


```

## README.md

```markdown
// safetyfirst/README.md
# SignInTransform Platform

## Cron Job Setup

This application includes a weekly report generation feature that should be triggered by a cron job. Here's how to set it up:

1. Ensure that the `CRON_SECRET` environment variable is set in your Vercel project settings.

2. Set up a cron job to make a GET request to the following endpoint every Monday at 9am:



```

## scrape-code-to-markdown.js

```javascript
const fs = require('fs').promises;
const path = require('path');

// Configuration
const outputFile = 'project_code.md';
const excludedFolders = ['.git', 'node_modules', '.next', '.vercel'];
const includeFileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json', '.md', '.py', '.php', '.txt'];

// Function to determine language for Markdown code block
function getCodeLanguage(extension) {
  switch (extension) {
    case '.js': return 'javascript';
    case '.jsx': return 'jsx';
    case '.ts': return 'typescript';
    case '.tsx': return 'tsx';
    case '.css': return 'css';
    case '.scss': return 'scss';
    case '.html': return 'html';
    case '.json': return 'json';
    case '.md': return 'markdown';
    case '.py': return 'python';
    case '.php': return 'php';
    case '.txt': return 'plaintext';
    default: return 'plaintext';
  }
}

// Recursive function to read files
async function readFiles(dir, fileList = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });  // Get file types

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (excludedFolders.includes(file.name)) {
      continue;  // Skip excluded folders
    }

    if (file.isDirectory()) {
      await readFiles(filePath, fileList);  // Recurse into subdirectories
    } else if (includeFileExtensions.includes(path.extname(file.name))) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        fileList.push({ path: filePath, content: content }); // Store content with path
      } catch (readError) {
        console.error(`Error reading file ${filePath}: ${readError.message}`);
      }
    }
  }

  return fileList;
}

async function generateMarkdown() {
  try {
    // Clear the output file
    await fs.writeFile(outputFile, '# Project Code Documentation\n', 'utf8');

    // Add timestamp
    await fs.appendFile(outputFile, `Generated on ${new Date().toLocaleString()}\n\n`, 'utf8');

    // Read all files
    const files = await readFiles(process.cwd());

    // Process each file
    for (const fileInfo of files) {
      const relativePath = path.relative(process.cwd(), fileInfo.path);
      const language = getCodeLanguage(path.extname(fileInfo.path));

      // Write file path as a header
      await fs.appendFile(outputFile, `## ${relativePath}\n\n`, 'utf8');

      // Write file content in a code block with language
      await fs.appendFile(outputFile, `\`\`\`${language}\n${fileInfo.content}\n\`\`\`\n\n`, 'utf8');
    }

    console.log('Completed! All code has been saved to', outputFile);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the script
generateMarkdown();

```

## scripts\apply-rls-policies.ts

```typescript
// safetyfirst/scripts/apply-rls-policies.ts
import { getAdminNeonDb } from "../lib/db/neon-rls"

async function applyRLSPolicies() {
  console.log("Applying RLS policies to tables...")

  try {
    const sql = getAdminNeonDb()

    // Enable RLS on users table
    console.log("Enabling RLS on users table...")
    await sql`
      -- Enable RLS
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      
      -- Users can see their own data
      CREATE POLICY users_select_own ON users
        FOR SELECT
        USING (id = auth.user_id());
        
      -- Users can update their own data
      CREATE POLICY users_update_own ON users
        FOR UPDATE
        USING (id = auth.user_id());
        
      -- Admins can see all users
      CREATE POLICY users_select_admin ON users
        FOR SELECT
        USING (auth.is_admin());
        
      -- Admins can update all users
      CREATE POLICY users_update_admin ON users
        FOR UPDATE
        USING (auth.is_admin());
    `

    // Enable RLS on job_sites table
    console.log("Enabling RLS on job_sites table...")
    await sql`
      -- Enable RLS
      ALTER TABLE job_sites ENABLE ROW LEVEL SECURITY;
      
      -- Everyone can see job sites
      CREATE POLICY job_sites_select_all ON job_sites
        FOR SELECT
        USING (true);
        
      -- Only creators and admins can update job sites
      CREATE POLICY job_sites_update_own ON job_sites
        FOR UPDATE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only creators and admins can delete job sites
      CREATE POLICY job_sites_delete_own ON job_sites
        FOR DELETE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only authenticated users can insert job sites
      CREATE POLICY job_sites_insert_auth ON job_sites
        FOR INSERT
        WITH CHECK (auth.is_authenticated());
    `

    // Enable RLS on attendances table
    console.log("Enabling RLS on attendances table...")
    await sql`
      -- Enable RLS
      ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
      
      -- Users can see their own attendances
      CREATE POLICY attendances_select_own ON attendances
        FOR SELECT
        USING (user_id = auth.user_id());
        
      -- Users can update their own attendances
      CREATE POLICY attendances_update_own ON attendances
        FOR UPDATE
        USING (user_id = auth.user_id());
        
      -- Users can insert their own attendances
      CREATE POLICY attendances_insert_own ON attendances
        FOR INSERT
        WITH CHECK (user_id = auth.user_id());
        
      -- Admins can see all attendances
      CREATE POLICY attendances_select_admin ON attendances
        FOR SELECT
        USING (auth.is_admin());
        
      -- Admins can update all attendances
      CREATE POLICY attendances_update_admin ON attendances
        FOR UPDATE
        USING (auth.is_admin());
        
      -- Admins can delete all attendances
      CREATE POLICY attendances_delete_admin ON attendances
        FOR DELETE
        USING (auth.is_admin());
    `

    // Enable RLS on inductions table
    console.log("Enabling RLS on inductions table...")
    await sql`
      -- Enable RLS
      ALTER TABLE inductions ENABLE ROW LEVEL SECURITY;
      
      -- Everyone can see inductions
      CREATE POLICY inductions_select_all ON inductions
        FOR SELECT
        USING (true);
        
      -- Only creators and admins can update inductions
      CREATE POLICY inductions_update_own ON inductions
        FOR UPDATE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only creators and admins can delete inductions
      CREATE POLICY inductions_delete_own ON inductions
        FOR DELETE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only authenticated users can insert inductions
      CREATE POLICY inductions_insert_auth ON inductions
        FOR INSERT
        WITH CHECK (auth.is_authenticated());
    `

    // Enable RLS on induction_completions table
    console.log("Enabling RLS on induction_completions table...")
    await sql`
      -- Enable RLS
      ALTER TABLE induction_completions ENABLE ROW LEVEL SECURITY;
      
      -- Users can see their own completions
      CREATE POLICY induction_completions_select_own ON induction_completions
        FOR SELECT
        USING (user_id = auth.user_id());
        
      -- Users can insert their own completions
      CREATE POLICY induction_completions_insert_own ON induction_completions
        FOR INSERT
        WITH CHECK (user_id = auth.user_id());
        
      -- Admins can see all completions
      CREATE POLICY induction_completions_select_admin ON induction_completions
        FOR SELECT
        USING (auth.is_admin());
    `

    // Enable RLS on swms table
    console.log("Enabling RLS on swms table...")
    await sql`
      -- Enable RLS
      ALTER TABLE swms ENABLE ROW LEVEL SECURITY;
      
      -- Everyone can see SWMS
      CREATE POLICY swms_select_all ON swms
        FOR SELECT
        USING (true);
        
      -- Only creators and admins can update SWMS
      CREATE POLICY swms_update_own ON swms
        FOR UPDATE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only creators and admins can delete SWMS
      CREATE POLICY swms_delete_own ON swms
        FOR DELETE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only authenticated users can insert SWMS
      CREATE POLICY swms_insert_auth ON swms
        FOR INSERT
        WITH CHECK (auth.is_authenticated());
    `

    // Enable RLS on swms_signoffs table
    console.log("Enabling RLS on swms_signoffs table...")
    await sql`
      -- Enable RLS
      ALTER TABLE swms_signoffs ENABLE ROW LEVEL SECURITY;
      
      -- Users can see their own signoffs
      CREATE POLICY swms_signoffs_select_own ON swms_signoffs
        FOR SELECT
        USING (user_id = auth.user_id());
        
      -- Users can insert their own signoffs
      CREATE POLICY swms_signoffs_insert_own ON swms_signoffs
        FOR INSERT
        WITH CHECK (user_id = auth.user_id());
        
      -- Admins can see all signoffs
      CREATE POLICY swms_signoffs_select_admin ON swms_signoffs
        FOR SELECT
        USING (auth.is_admin());
    `

    console.log("RLS policies applied successfully!")
  } catch (error) {
    console.error("Error applying RLS policies:", error)
    process.exit(1)
  }
}

applyRLSPolicies()



```

## scripts\setup-db.ts

```typescript
// safetyfirst/scripts/setup-db.ts
import { execSync } from "child_process"

async function setupDatabase() {
  console.log("Setting up database...")

  try {
    // Run migrations
    console.log("Running migrations...")
    execSync("npx prisma migrate deploy", { stdio: "inherit" })

    // Generate Prisma client
    console.log("Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    // Seed the database
    console.log("Seeding database...")
    execSync("npx prisma db seed", { stdio: "inherit" })

    console.log("Database setup complete!")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()



```

## scripts\setup-neon-rls.ts

```typescript
// safetyfirst/scripts/setup-neon-rls.ts
import { getAdminNeonDb } from "../lib/db/neon-rls"

async function setupNeonRLS() {
  console.log("Setting up Neon RLS...")

  try {
    const sql = getAdminNeonDb()

    // Install the pg_session_jwt extension
    console.log("Installing pg_session_jwt extension...")
    await sql`CREATE EXTENSION IF NOT EXISTS pg_session_jwt;`

    // Set up roles and permissions
    console.log("Setting up roles and permissions...")

    // Grant permissions to authenticated role
    await sql`
      -- For existing tables
      GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
        IN SCHEMA public
        to authenticated;
        
      -- For future tables
      ALTER DEFAULT PRIVILEGES
        IN SCHEMA public
        GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
        TO authenticated;
        
      -- Grant USAGE on "public" schema
      GRANT USAGE ON SCHEMA public TO authenticated;
    `

    // Grant permissions to anonymous role
    await sql`
      -- For existing tables
      GRANT SELECT ON ALL TABLES
        IN SCHEMA public
        to anonymous;
        
      -- For future tables
      ALTER DEFAULT PRIVILEGES
        IN SCHEMA public
        GRANT SELECT ON TABLES
        TO anonymous;
        
      -- Grant USAGE on "public" schema
      GRANT USAGE ON SCHEMA public TO anonymous;
    `

    // Create auth schema and functions
    console.log("Creating auth schema and functions...")
    await sql`
      -- Create auth schema if it doesn't exist
      CREATE SCHEMA IF NOT EXISTS auth;
      
      -- Create function to get the current user ID from JWT
      CREATE OR REPLACE FUNCTION auth.user_id() RETURNS text AS $$
      BEGIN
        RETURN nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
      EXCEPTION
        WHEN others THEN
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Create function to check if the current user is authenticated
      CREATE OR REPLACE FUNCTION auth.is_authenticated() RETURNS boolean AS $$
      BEGIN
        RETURN auth.user_id() IS NOT NULL;
      EXCEPTION
        WHEN others THEN
          RETURN false;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Create function to get user role from JWT
      CREATE OR REPLACE FUNCTION auth.user_role() RETURNS text AS $$
      BEGIN
        RETURN nullif(current_setting('request.jwt.claims', true)::json->>'role', '')::text;
      EXCEPTION
        WHEN others THEN
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Create function to check if the current user is an admin
      CREATE OR REPLACE FUNCTION auth.is_admin() RETURNS boolean AS $$
      DECLARE
        user_role text;
      BEGIN
        user_role := auth.user_role();
        RETURN user_role = 'ADMIN' OR user_role = 'CEO';
      EXCEPTION
        WHEN others THEN
          RETURN false;
      END;
      $$ LANGUAGE plpgsql;
    `

    console.log("Neon RLS setup completed successfully!")
  } catch (error) {
    console.error("Error setting up Neon RLS:", error)
    process.exit(1)
  }
}

setupNeonRLS()



```

## scripts\setup-rls.ts

```typescript
// safetyfirst/scripts/setup-rls.ts
import { neon } from "@neondatabase/serverless"
// Remove dotenv import and use process.env directly
// import dotenv from "dotenv";

// Load environment variables
// dotenv.config();

async function setupRLS() {
  try {
    console.log("Setting up Row-Level Security (RLS) in Neon database...")

    // Connect to the database
    const sql = neon(process.env.DATABASE_URL!)

    // Enable RLS on tables
    await sql`
      -- Enable RLS on job_sites table
      ALTER TABLE job_sites ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on attendances table
      ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on users table
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on inductions table
      ALTER TABLE inductions ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on swms table
      ALTER TABLE swms ENABLE ROW LEVEL SECURITY;
    `

    // Create auth schema and functions
    await sql`
      -- Create auth schema if it doesn't exist
      CREATE SCHEMA IF NOT EXISTS auth;
      
      -- Create function to get the current user ID from JWT
      CREATE OR REPLACE FUNCTION auth.uid() RETURNS text AS $$
      DECLARE
        jwt_payload json;
        user_id text;
      BEGIN
        -- Extract payload from JWT
        jwt_payload := current_setting('request.jwt.claims', true)::json;
        
        -- Get user ID from payload
        user_id := jwt_payload->>'id';
        
        RETURN user_id;
      EXCEPTION
        WHEN others THEN
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `

    // Create RLS policies
    await sql`
      -- Job Sites policies
      CREATE POLICY job_sites_select_policy ON job_sites
        FOR SELECT USING (true); -- Everyone can view job sites
        
      CREATE POLICY job_sites_insert_policy ON job_sites
        FOR INSERT WITH CHECK (created_by_id = auth.uid() OR 
                              EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY job_sites_update_policy ON job_sites
        FOR UPDATE USING (created_by_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY job_sites_delete_policy ON job_sites
        FOR DELETE USING (created_by_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
      
      -- Attendances policies
      CREATE POLICY attendances_select_policy ON attendances
        FOR SELECT USING (user_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY attendances_insert_policy ON attendances
        FOR INSERT WITH CHECK (user_id = auth.uid() OR 
                              EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY attendances_update_policy ON attendances
        FOR UPDATE USING (user_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY attendances_delete_policy ON attendances
        FOR DELETE USING (user_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
      
      -- Users policies
      CREATE POLICY users_select_policy ON users
        FOR SELECT USING (id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY users_update_policy ON users
        FOR UPDATE USING (id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
    `

    console.log("Row-Level Security setup completed successfully!")
  } catch (error) {
    console.error("Error setting up Row-Level Security:", error)
    process.exit(1)
  }
}

setupRLS()



```

## settings.json

```json
// safetyfirst/settings.json
// Place your settings in this file to overwrite the default settings
{
    "fileHeaderCommentHelper.languageConfigs": {
        "language_typescript": {
            "template": [
                "/*",
                " * Project: $(projectName)",
                " * Path: $(currentFile)",
                " */"
            ]
        }
    }
}




```

## stack.tsx

```tsx
// safetyfirst/stack.tsx
import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
});


```

## styles\globals.css

```css
// safetyfirst/styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}


```

## tailwind.config.js

```javascript
// safetyfirst/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
}



```

## tsconfig.json

```json
// safetyfirst/tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "target": "ES6",
    "noEmit": true,
    "module": "esnext",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}


```

## v0-user-next.config.js

```javascript
// safetyfirst/v0-user-next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig



```

