// safetyfirst/components/job-site-attendances.tsx
"use client"

import { useAuthenticatedDb } from "@/lib/hooks/use-authenticated-db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/public/components/ui/table.jsx"
import { Badge } from "@/public/components/ui/badge.jsx"
import { Button } from "@/public/components/ui/button.jsx"
import { LogOut } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

interface JobSiteAttendancesProps {
  jobSiteId: string
}

interface Attendance {
  id: string;
  sign_in_time: string;
  sign_out_time: string | null;
  name: string;
  email: string;
}

export function JobSiteAttendances({ jobSiteId }: Readonly<JobSiteAttendancesProps>) {
  const { toast } = useToast()
  const [attendances, setAttendances] = useState<Attendance[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const dbQuery = useAuthenticatedDb
  useEffect(() => {
    const fetchAttendances = async () => {
        setLoading(true)
        setError(null)
        try {
          const { data, error: dbError } = dbQuery(
            `
              SELECT a.*, u.name, u.email
              FROM attendances a
              JOIN users u ON a.user_id = u.id
              WHERE a.job_site_id = $1
              ORDER BY a.sign_in_time DESC
            `,
            [jobSiteId]
          )
          if (dbError) {
            throw dbError
          }

        setAttendances(data as Attendance[])
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error(String(err)))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAttendances()
  }, [jobSiteId])
  const handleSignOut = async (attendanceId: string) => {
    try {
      // Use the authenticated database query function to update the attendance
      const { error } = dbQuery(
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
            <TableCell>{calculateDuration(attendance.sign_in_time, attendance.sign_out_time) ?? "-"}</TableCell>
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


