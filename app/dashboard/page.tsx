"use client"

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

