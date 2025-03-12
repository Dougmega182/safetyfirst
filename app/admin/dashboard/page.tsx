"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, ClipboardList, FileText, BarChart3, Search, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { format } from "date-fns"

type SiteOverview = {
  id: string
  name: string
  address: string
  activeWorkers: number
  totalWorkers: number
  completedInductions: number
  totalInductions: number
  signedSwms: number
  totalSwms: number
}

type WorkerAttendance = {
  id: string
  name: string
  email: string
  company: string
  currentSite: string | null
  signInTime: string | null
  totalHoursThisWeek: number
  completedInductions: number
  signedSwms: number
}

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sites, setSites] = useState<SiteOverview[]>([])
  const [workers, setWorkers] = useState<WorkerAttendance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedSite, setSelectedSite] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }

    if (!loading && user && user.role !== "CEO" && user.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const fetchData = async () => {
    try {
      setIsRefreshing(true)
      // Fetch site overviews
      const sitesResponse = await fetch("/api/admin/sites")
      if (!sitesResponse.ok) {
        throw new Error("Failed to fetch site data")
      }
      const sitesData = await sitesResponse.json()
      setSites(sitesData.sites)

      // Fetch worker attendance
      let url = "/api/admin/workers"
      const params = new URLSearchParams()

      if (selectedSite !== "all") {
        params.append("siteId", selectedSite)
      }

      if (dateRange.from) {
        params.append("from", dateRange.from.toISOString())
      }

      if (dateRange.to) {
        params.append("to", dateRange.to.toISOString())
      }

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const workersResponse = await fetch(url)
      if (!workersResponse.ok) {
        throw new Error("Failed to fetch worker data")
      }
      const workersData = await workersResponse.json()
      setWorkers(workersData.workers)
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (user && (user.role === "CEO" || user.role === "ADMIN")) {
      fetchData()
    }
  }, [user, selectedSite, dateRange])

  const handleRefresh = () => {
    fetchData()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
  }

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

  if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
    return null
  }

  // Count active workers across all sites
  const totalActiveWorkers = sites.reduce((total, site) => total + site.activeWorkers, 0)

  // Count sites with active workers
  const sitesWithActiveWorkers = sites.filter((site) => site.activeWorkers > 0).length

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor site activity and worker compliance</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites.length}</div>
            <p className="text-xs text-muted-foreground">Registered job sites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sitesWithActiveWorkers}</div>
            <p className="text-xs text-muted-foreground">Sites with active workers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveWorkers}</div>
            <p className="text-xs text-muted-foreground">Currently on site</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
            <p className="text-xs text-muted-foreground">Registered workers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Active Sites</TabsTrigger>
          <TabsTrigger value="workers">Active Workers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Site Overview</CardTitle>
              <CardDescription>Real-time activity across all job sites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Site</label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <DateRangePicker date={dateRange} setDate={setDateRange} />
                </div>
                <div className="space-y-2">
                  <form onSubmit={handleSearch}>
                    <label className="text-sm font-medium">Search</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search workers or sites..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Active Workers</TableHead>
                    <TableHead>Induction Completion</TableHead>
                    <TableHead>SWMS Compliance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{site.name}</p>
                          <p className="text-sm text-muted-foreground">{site.address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          {site.activeWorkers} / {site.totalWorkers}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
                          {site.completedInductions} / {site.totalInductions}
                          <span className="ml-2">
                            ({Math.round((site.completedInductions / Math.max(site.totalInductions, 1)) * 100)}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          {site.signedSwms} / {site.totalSwms}
                          <span className="ml-2">
                            ({Math.round((site.signedSwms / Math.max(site.totalSwms, 1)) * 100)}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/job-sites/${site.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sites.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No sites found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sites</CardTitle>
              <CardDescription>Sites with workers currently signed in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Site</label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <DateRangePicker date={dateRange} setDate={setDateRange} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sites
                  .filter((site) => site.activeWorkers > 0)
                  .map((site) => (
                    <Card key={site.id} className="overflow-hidden">
                      <CardHeader className="bg-blue-50 dark:bg-blue-950">
                        <CardTitle>{site.name}</CardTitle>
                        <CardDescription>{site.address}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Active Workers:</span>
                            <Badge className="bg-green-500">{site.activeWorkers}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Total Workers:</span>
                            <span>{site.totalWorkers}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Induction Completion:</span>
                            <span>
                              {Math.round((site.completedInductions / Math.max(site.totalInductions, 1)) * 100)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">SWMS Compliance:</span>
                            <span>{Math.round((site.signedSwms / Math.max(site.totalSwms, 1)) * 100)}%</span>
                          </div>
                          <Button asChild className="w-full mt-4">
                            <Link href={`/job-sites/${site.id}/attendance`}>
                              <Users className="mr-2 h-4 w-4" /> View Attendance
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {sites.filter((site) => site.activeWorkers > 0).length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 border rounded-lg">
                    <p className="mb-4 text-muted-foreground">No active sites found</p>
                    <p className="text-sm text-muted-foreground">
                      There are currently no workers signed in to any sites.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Worker Attendance</CardTitle>
              <CardDescription>Monitor worker attendance and compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Site</label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <DateRangePicker date={dateRange} setDate={setDateRange} />
                </div>
                <div className="space-y-2">
                  <form onSubmit={handleSearch}>
                    <label className="text-sm font-medium">Search</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by name or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Sign In Time</TableHead>
                    <TableHead>Hours This Week</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">{worker.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{worker.company || "N/A"}</TableCell>
                      <TableCell>
                        {worker.currentSite ? (
                          <Badge className="bg-green-500">On Site: {worker.currentSite}</Badge>
                        ) : (
                          <Badge variant="outline">Not On Site</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {worker.signInTime ? format(new Date(worker.signInTime), "dd MMM yyyy, h:mm a") : "N/A"}
                      </TableCell>
                      <TableCell>{worker.totalHoursThisWeek.toFixed(1)} hrs</TableCell>
                    </TableRow>
                  ))}
                  {workers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No workers found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

