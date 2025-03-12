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

