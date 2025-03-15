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


