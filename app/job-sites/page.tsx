"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Plus, FileEdit, Trash2, Users, ClipboardList } from "lucide-react"
import Link from "next/link"

type JobSite = {
  id: string
  name: string
  address: string
  description?: string
  createdAt: string
  activeWorkers: number
  completedInductions: number
}

export default function JobSitesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [jobSites, setJobSites] = useState<JobSite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchJobSites = async () => {
      try {
        const response = await fetch("/api/job-sites")
        if (response.ok) {
          const data = await response.json()
          setJobSites(data.jobSites)
        }
      } catch (error) {
        console.error("Error fetching job sites:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchJobSites()
    }
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your job sites</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

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

      <Card>
        <CardHeader>
          <CardTitle>All Job Sites</CardTitle>
          <CardDescription>View and manage all your job sites</CardDescription>
        </CardHeader>
        <CardContent>
          {jobSites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="mb-4 text-muted-foreground">No job sites found</p>
              <Button asChild>
                <Link href="/job-sites/new">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Job Site
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Active Workers</TableHead>
                  <TableHead>Inductions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>{site.address}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        {site.activeWorkers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
                        {site.completedInductions}
                      </div>
                    </TableCell>
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
                            <Link href={`/job-sites/${site.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/job-sites/${site.id}/attendance`}>
                              <Users className="mr-2 h-4 w-4" /> View Attendance
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/job-sites/${site.id}/edit`}>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

