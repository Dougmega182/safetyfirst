// safetyfirst/app/account/page.tsx
"use client"
// acount page.tsx
import { AccountSettings } from "@stackframe/stack"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
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
    <div>
      <AccountSettings fullPage={true} />
  
      {/* Manually render extra sections */}
      <div className="mt-8">
        <div className="p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Your Job Sites</h2>
          <p>Manage your job site preferences and notifications.</p>
        </div>
  
        <div className="p-4 border rounded-lg mt-4">
          <h2 className="text-2xl font-bold mb-4">Safety Certifications</h2>
          <p>Manage your safety certifications and training records.</p>
        </div>
      </div>
    </div>
  );
  
}


