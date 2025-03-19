// safetyfirst/app/onboarding/page.tsx
// /app/onboarding/page.tsx 
"use client"

import { useState } from "react"
import { useUser } from "@stackframe/stack"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { HardHat } from "lucide-react"
import { updateUserClientMetadata } from "@/lib/user-metadata"

export default function OnboardingPage() {
  const user = useUser()
  const router = useRouter()
  const [step, setStep] = useState(1)
  interface UserWithReadOnlyMetadata {
    clientReadOnlyMetadata?: { jobTitle?: string; companyName?: string }
    clientMetadata?: { preferredJobSite?: string; notificationPreferences?: { email?: boolean; sms?: boolean; push?: boolean } }
  }
  
  const typedUser = user as UserWithReadOnlyMetadata | null;
  
  const [formData, setFormData] = useState({
    jobTitle: typedUser?.clientReadOnlyMetadata?.jobTitle ?? "",
    company: typedUser?.clientReadOnlyMetadata?.companyName ?? "",
    preferredJobSite: typedUser?.clientMetadata?.preferredJobSite ?? "",
    notifications: {
      email: (user?.clientMetadata as { notificationPreferences?: { email?: boolean } })?.notificationPreferences?.email !== false,
      sms: (user?.clientMetadata as { notificationPreferences?: { sms?: boolean } })?.notificationPreferences?.sms === true,
      push: (user?.clientMetadata as { notificationPreferences?: { push?: boolean } })?.notificationPreferences?.push !== false,
    },
    safetyTraining: {
      generalInduction: false,
      heightsTraining: false,
      firstAid: false,
      equipmentOperation: false,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateForm = (field: string, value: string | boolean | { [key: string]: boolean }) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!user) {
      // If user is null, redirect or show error message
      return;
    }
  
    setIsSubmitting(true);
    try {
      // Update client metadata
      await updateUserClientMetadata(user, {
        preferredJobSite: formData.preferredJobSite,
        notificationPreferences: {
          email: formData.notifications.email,
          sms: formData.notifications.sms,
          push: formData.notifications.push,
        },
        onboarded: true,
        lastActiveAt: new Date().toISOString(),
      });
  
      // Call server API to update server metadata
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          safetyTraining: formData.safetyTraining,
          jobTitle: formData.jobTitle,
          company: formData.company,
        }),
      });
  
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    // Show a loading state or handle the case where the user is not available
    return <div>Loading...</div>
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mb-8 flex items-center">
        <HardHat className="h-10 w-10 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold">Safety Pass Onboarding</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Personal Information"}
            {step === 2 && "Notification Preferences"}
            {step === 3 && "Safety Training"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Tell us about your role and company"}
            {step === 2 && "How would you like to be notified?"}
            {step === 3 && "Select any safety training you've completed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => updateForm("jobTitle", e.target.value)}
                  placeholder="e.g., Site Manager, Electrician, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredJobSite">Preferred Job Site</Label>
                <Select
                  value={formData.preferredJobSite}
                  onValueChange={(value) => updateForm("preferredJobSite", value)}
                >
                  <SelectTrigger id="preferredJobSite">
                    <SelectValue placeholder="Select a job site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site_1">Downtown Tower Project</SelectItem>
                    <SelectItem value="site_2">Harbour Bridge Upgrade</SelectItem>
                    <SelectItem value="site_3">WestConnex Tunnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-notifications"
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) =>
                    updateForm("notifications", { ...formData.notifications, email: !!checked })
                  }
                />
                <Label htmlFor="email-notifications">Email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms-notifications"
                  checked={formData.notifications.sms}
                  onCheckedChange={(checked) =>
                    updateForm("notifications", { ...formData.notifications, sms: !!checked })
                  }
                />
                <Label htmlFor="sms-notifications">SMS notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="push-notifications"
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) =>
                    updateForm("notifications", { ...formData.notifications, push: !!checked })
                  }
                />
                <Label htmlFor="push-notifications">Push notifications</Label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="general-induction"
                  checked={formData.safetyTraining.generalInduction}
                  onCheckedChange={(checked) =>
                    updateForm("safetyTraining", {
                      ...formData.safetyTraining,
                      generalInduction: !!checked,
                    })
                  }
                />
                <Label htmlFor="general-induction">General Site Induction</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="heights-training"
                  checked={formData.safetyTraining.heightsTraining}
                  onCheckedChange={(checked) =>
                    updateForm("safetyTraining", {
                      ...formData.safetyTraining,
                      heightsTraining: !!checked,
                    })
                  }
                />
                <Label htmlFor="heights-training">Working at Heights</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="first-aid"
                  checked={formData.safetyTraining.firstAid}
                  onCheckedChange={(checked) =>
                    updateForm("safetyTraining", {
                      ...formData.safetyTraining,
                      firstAid: !!checked,
                    })
                  }
                />
                <Label htmlFor="first-aid">First Aid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="equipment-operation"
                  checked={formData.safetyTraining.equipmentOperation}
                  onCheckedChange={(checked) =>
                    updateForm("safetyTraining", {
                      ...formData.safetyTraining,
                      equipmentOperation: !!checked,
                    })
                  }
                />
                <Label htmlFor="equipment-operation">Equipment Operation</Label>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

