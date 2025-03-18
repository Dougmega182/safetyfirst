// /app/job-sites/[id]/attendance/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
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
  useAuth() // Keep the auth check without destructuring
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
                    <TableCell>{calculateDuration(attendance.signInTime, attendance.signOutTime) ?? "-"}</TableCell>
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

