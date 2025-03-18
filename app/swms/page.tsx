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
  const [swms] = useState(mockSwms)

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
                  <TableCell>{swmsItem.approvedBy ?? "-"}</TableCell>
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


