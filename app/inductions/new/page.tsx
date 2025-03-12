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

export default function NewInductionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [sections, setSections] = useState([{ id: "section_1", title: "Introduction", content: "" }])

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

  const addSection = () => {
    const newSection = {
      id: `section_${sections.length + 1}`,
      title: `Section ${sections.length + 1}`,
      content: "",
    }
    setSections([...sections, newSection])
  }

  const updateSection = (id: string, field: string, value: string) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, [field]: value } : section)))
  }

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter((section) => section.id !== id))
    } else {
      toast({
        title: "Cannot remove section",
        description: "You must have at least one section in your induction",
        variant: "destructive",
      })
    }
  }

  const handleSave = () => {
    // In a real app, you would save the induction to your database
    toast({
      title: "Induction saved",
      description: "Your induction has been saved successfully",
    })
    router.push("/inductions")
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/inductions">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inductions
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Induction</h1>
        <p className="text-muted-foreground">Create a new site induction for workers</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Induction Details</CardTitle>
              <CardDescription>Basic information about your induction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., General Site Induction" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe what this induction covers" rows={4} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input id="duration" type="number" min="1" placeholder="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("content")}>Continue to Content</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Induction Content</CardTitle>
              <CardDescription>Add sections to your induction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sections.map((section, index) => (
                <div key={section.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Section {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSection(section.id)}
                      disabled={sections.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                    <Input
                      id={`section-title-${section.id}`}
                      value={section.title}
                      onChange={(e) => updateSection(section.id, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`section-content-${section.id}`}>Content</Label>
                    <Textarea
                      id={`section-content-${section.id}`}
                      value={section.content}
                      onChange={(e) => updateSection(section.id, "content", e.target.value)}
                      rows={6}
                      placeholder="Add content for this section..."
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addSection} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back to Details
              </Button>
              <Button onClick={() => setActiveTab("settings")}>Continue to Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Induction Settings</CardTitle>
              <CardDescription>Configure additional settings for your induction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requires-signature">Requires Signature</Label>
                <Select defaultValue="yes">
                  <SelectTrigger id="requires-signature">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Period (days)</Label>
                <Input id="expiry" type="number" min="0" placeholder="365" />
                <p className="text-xs text-muted-foreground">Set to 0 for no expiry</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select defaultValue="all-workers">
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-workers">All Workers</SelectItem>
                    <SelectItem value="specific-roles">Specific Roles</SelectItem>
                    <SelectItem value="admin-only">Admin Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("content")}>
                Back to Content
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Induction
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

