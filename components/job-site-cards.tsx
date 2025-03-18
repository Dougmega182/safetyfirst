// safetyfirst/components/job-site-cards.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Users } from "lucide-react"

type JobSite = {
  id: string
  name: string
  address: string
  description?: string
  activeWorkers?: number
}

const MOCK_JOBSITES: JobSite[] = [
  {
    id: "site_1",
    name: "Downtown Tower Project",
    address: "123 Main St, Sydney NSW 2000",
    description: "A 30-story commercial tower development",
    activeWorkers: 15,
  },
  {
    id: "site_2",
    name: "Harbour Bridge Upgrade",
    address: "Sydney Harbour Bridge, Sydney NSW 2060",
    description: "Maintenance and upgrade of the iconic Harbour Bridge",
    activeWorkers: 8,
  },
  {
    id: "site_3",
    name: "WestConnex Tunnel",
    address: "M4 East, Haberfield NSW 2045",
    description: "Construction of the WestConnex tunnel",
    activeWorkers: 22,
  },
]

export default function JobSiteCards() {
  const [jobSites] = useState<JobSite[]>(MOCK_JOBSITES)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobSites.map((site) => (
        <Card key={site.id}>
          <CardHeader>
            <CardTitle>{site.name}</CardTitle>
            <CardDescription>{site.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{site.description}</span>
            </div>
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
    </div>
  )
}


