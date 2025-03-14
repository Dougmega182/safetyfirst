"use client"

import { UserButton } from "@stackframe/stack"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/use-auth"
import Link from "next/link"

export function UserMenu() {
  const { setTheme, theme } = useTheme()
  const { user } = useAuth()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/auth/stack-login" className="text-sm font-medium text-muted-foreground hover:text-primary">
          Sign in with Stack
        </Link>
      </div>
    )
  }

  return (
    <UserButton
      showUserInfo={true}
      colorModeToggle={toggleTheme}
      extraItems={[
        {
          text: "Dashboard",
          icon: <span className="i-lucide-layout-dashboard" />,
          onClick: () => (window.location.href = "/dashboard"),
        },
        {
          text: "Job Sites",
          icon: <span className="i-lucide-map-pin" />,
          onClick: () => (window.location.href = "/job-sites"),
        },
      ]}
    />
  )
}

