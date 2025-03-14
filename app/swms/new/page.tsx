"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Import SignatureCanvas dynamically with no SSR to avoid hydration issues
const SignatureCanvas = dynamic(() => import("@/components/signature-canvas"), { ssr: false })

export default function NewSwmsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [hazards, setHazards] = useState([{ id: "hazard_1", description: "", controls: "", riskLevel: "medium" }])
  const [signature, setSignature] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const addHazard = () => {
    const newHazard = {
      id: `hazard_${hazards.length + 1}`,
      description: "",
      controls: "",
      riskLevel: "medium",
    }
    setHazards([...hazards, newHazard])
  }

  const updateHazard = (id: string, field: string, value: string) => {
    setHazards(hazards.map((hazard) => (hazard.id === id ? { ...hazard, [field]: value } : hazard)))
  }

  const removeHazard = (id: string) => {
    if (hazards.length > 1) {
      setHazards(hazards.filter((hazard) => hazard.id !== id))
    } else {
      toast({
        title: "Cannot remove hazard",
        description: "You must have at least one hazard in your SWMS",
        variant: "destructive",
      })
    }
  }

  const handleSave = () => {
    if (!signature) {
      toast({
        title: "Signature required",
        description: "Please sign the SWMS before submitting",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would save the SWMS to your database
    toast({
      title: "SWMS submitted",
      description: "Your Safe Work Method Statement has been submitted for approval",
    })
    router.push("/swms")
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/swms">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to SWMS
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New SWMS</h1>
        <p className="text-muted-foreground">Create a new Safe Work Method Statement</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="hazards">Hazards & Controls</TabsTrigger>
          <TabsTrigger value="signature">Signature</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SWMS Details</CardTitle>
              <CardDescription>Basic information about the work and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Work Activity Title</Label>
                <Input id="title" placeholder="e.g., Excavation Work" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Project/Location</Label>
                <Input id="location" placeholder="Project name or site location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Work Description</Label>
                <Textarea id="description" placeholder="Describe the work to be performed" rows={4} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Your company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input id="supervisor" placeholder="Name of supervisor" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("hazards")}>Continue to Hazards & Controls</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hazards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hazards & Controls</CardTitle>
              <CardDescription>Identify hazards and control measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {hazards.map((hazard, index) => (
                <div key={hazard.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Hazard {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHazard(hazard.id)}
                      disabled={hazards.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hazard-desc-${hazard.id}`}>Hazard Description</Label>
                    <Textarea
                      id={`hazard-desc-${hazard.id}`}
                      value={hazard.description}
                      onChange={(e) => updateHazard(hazard.id, "description", e.target.value)}
                      placeholder="Describe the hazard..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hazard-controls-${hazard.id}`}>Control Measures</Label>
                    <Textarea
                      id={`hazard-controls-${hazard.id}`}
                      value={hazard.controls}
                      onChange={(e) => updateHazard(hazard.id, "controls", e.target.value)}
                      placeholder="List control measures to mitigate this hazard..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`risk-level-${hazard.id}`}>Risk Level</Label>
                    <Select
                      value={hazard.riskLevel}
                      onValueChange={(value) => updateHazard(hazard.id, "riskLevel", value)}
                    >
                      <SelectTrigger id={`risk-level-${hazard.id}`}>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="extreme">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addHazard} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Hazard
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back to Details
              </Button>
              <Button onClick={() => setActiveTab("signature")}>Continue to Signature</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sign SWMS</CardTitle>
              <CardDescription>Review and sign the Safe Work Method Statement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">Declaration</h3>
                <p className="text-sm text-muted-foreground">
                  I have read and understood this Safe Work Method Statement (SWMS). I agree to comply with the control
                  measures outlined in this SWMS. I understand that I must stop work immediately and notify my
                  supervisor if the SWMS cannot be followed or if new hazards are identified.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Signature</Label>
                <div className="rounded-lg border p-4">{isMounted && <SignatureCanvas onSave={setSignature} />}</div>
                {signature && <p className="text-sm text-green-600">Signature captured successfully</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("hazards")}>
                Back to Hazards
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Submit SWMS
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

