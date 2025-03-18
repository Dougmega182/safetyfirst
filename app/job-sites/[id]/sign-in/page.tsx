// /app/job-sites/[id]/sign-in/page.tsx 
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, CheckCircle, ClipboardList } from "lucide-react"
import Link from "next/link"
import SignatureCanvas from "@/components/signature-canvas"

type JobSite = {
  id: string
  name: string
  address: string
}

type Induction = {
  id: string
  title: string
  completed: boolean
}

type SWMS = {
  id: string
  title: string
  signed: boolean
}

export default function SiteSignInPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [jobSite, setJobSite] = useState<JobSite | null>(null)
  const [inductions, setInductions] = useState<Induction[]>([])
  const [swmsList, setSwmsList] = useState<SWMS[]>([])
  const [signature, setSignature] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const siteId = params.id as string

        // Fetch job site details
        const siteResponse = await fetch(`/api/job-sites/${siteId}`)
        if (!siteResponse.ok) {
          throw new Error("Failed to fetch job site")
        }
        const siteData = await siteResponse.json()
        setJobSite(siteData.jobSite)

        // Fetch inductions for this site
        const inductionsResponse = await fetch(`/api/job-sites/${siteId}/inductions?userId=${user?.id}`)
        if (!inductionsResponse.ok) {
          throw new Error("Failed to fetch inductions")
        }
        const inductionsData = await inductionsResponse.json()
        setInductions(inductionsData.inductions)

        // Fetch SWMS for this site
        const swmsResponse = await fetch(`/api/job-sites/${siteId}/swms?userId=${user?.id}`)
        if (!swmsResponse.ok) {
          throw new Error("Failed to fetch SWMS")
        }
        const swmsData = await swmsResponse.json()
        setSwmsList(swmsData.swmsList)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load site data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id && user) {
      fetchSiteData()
    }
  }, [params.id, user, toast])

  const handleSignIn = async () => {
    if (!signature) {
      toast({
        variant: "destructive",
        title: "Signature required",
        description: "Please provide your signature to sign in",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobSiteId: jobSite?.id,
          signature,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to sign in")
      }

      toast({
        title: "Signed in successfully",
        description: `You have been signed in to ${jobSite?.name}`,
      })

      router.push(`/job-sites/${jobSite?.id}`)
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An error occurred during sign in",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load site data</p>
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

  const allInductionsCompleted = inductions.every((induction) => induction.completed)
  const allSwmsSigned = swmsList.every((swms) => swms.signed)

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/job-sites/${jobSite.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Sign In to {jobSite.name}</h1>
        <p className="text-muted-foreground">{jobSite.address}</p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Site Inductions</CardTitle>
              <CardDescription>Complete all required inductions before signing in</CardDescription>
            </CardHeader>
            <CardContent>
              {inductions.length === 0 ? (
                <p className="text-center py-4">No inductions required for this site</p>
              ) : (
                <div className="space-y-4">
                  {inductions.map((induction) => (
                    <div key={induction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{induction.title}</p>
                        </div>
                      </div>
                      <div>
                        {induction.completed ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => router.push(`/inductions/${induction.id}`)}>
                            Complete Induction
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep(2)} disabled={!allInductionsCompleted}>
                {allInductionsCompleted ? "Continue to SWMS" : "Complete All Inductions to Continue"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Safe Work Method Statements</CardTitle>
              <CardDescription>Review and sign all required SWMS before signing in</CardDescription>
            </CardHeader>
            <CardContent>
              {swmsList.length === 0 ? (
                <p className="text-center py-4">No SWMS required for this site</p>
              ) : (
                <div className="space-y-4">
                  {swmsList.map((swms) => (
                    <div key={swms.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{swms.title}</p>
                        </div>
                      </div>
                      <div>
                        {swms.signed ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Signed</span>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => router.push(`/swms/${swms.id}`)}>
                            Review & Sign
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back to Inductions
              </Button>
              <Button onClick={() => setStep(3)} disabled={!allSwmsSigned}>
                {allSwmsSigned ? "Continue to Sign In" : "Sign All SWMS to Continue"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Sign In to Site</CardTitle>
              <CardDescription>Provide your signature to complete the sign-in process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">Declaration</h3>
                <p className="text-sm text-muted-foreground">
                  I confirm that I have completed all required inductions and reviewed all Safe Work Method Statements
                  for this site. I understand and will comply with all safety requirements and procedures.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Signature</h3>
                <div className="rounded-lg border p-4">
                  <SignatureCanvas onSave={setSignature} />
                </div>
                {signature && <p className="text-sm text-green-600">Signature captured successfully</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to SWMS
              </Button>
              <Button onClick={handleSignIn} disabled={!signature || isSubmitting}>
                {isSubmitting ? "Signing In..." : "Complete Sign In"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

