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
    } catch {
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
    } catch {
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

