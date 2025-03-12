"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

type JobSite = {
  id: string
  name: string
  address: string
  imageUrl: string
}

export default function JobSiteCards() {
  const [jobSites, setJobSites] = useState<JobSite[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    fetchJobSites()
  }, [])

  if (isLoading) {
    return <div>Loading job sites...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobSites.map((site) => (
        <Card key={site.id} className="overflow-hidden">
          <div className="h-48 w-full overflow-hidden">
            <img
              src={site.imageUrl || `/placeholder.svg?height=200&width=400`}
              alt={site.name}
              className="h-full w-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle>{site.name}</CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" /> {site.address}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/job-sites/${site.id}`}>Enter Site</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

