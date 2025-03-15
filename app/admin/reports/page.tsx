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


