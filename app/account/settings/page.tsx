"use client"

import { AccountSettings } from "@stackframe/stack"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/stack-login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your account settings</p>
        </div>
      </div>
    )
  }

  return (
    <AccountSettings
      fullPage={true}
      extraItems={[
        {
          title: "Job Sites",
          iconName: "MapPin",
          content: (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Your Job Sites</h2>
              <p>Manage your job site preferences and notifications.</p>
            </div>
          ),
          subpath: "/job-sites",
        },
        {
          title: "Safety Certifications",
          iconName: "Award",
          content: (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Safety Certifications</h2>
              <p>Manage your safety certifications and training records.</p>
            </div>
          ),
          subpath: "/certifications",
        },
      ]}
    />
  )
}

