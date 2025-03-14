"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HardHat, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserButton } from "@stackframe/stack"
import { useAuth } from "@/lib/use-auth"
import { Sidebar } from "./sidebar"

export function Header() {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const isAuthenticated = !loading && user
  const isAdminRoute = pathname?.startsWith("/admin")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <HardHat className="h-6 w-6 text-blue-600" />
          <span>SafetyFirst</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isAuthenticated ? (
            <>
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/job-sites"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/job-sites") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Job Sites
                </Link>
                <Link
                  href="/inductions"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/inductions") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Inductions
                </Link>
                <Link
                  href="/swms"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith("/swms") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  SWMS
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isAdminRoute ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </nav>

              <UserButton
                showUserInfo={true}
                extraItems={[
                  {
                    text: "Dashboard",
                    icon: <HardHat className="h-4 w-4" />,
                    onClick: () => (window.location.href = "/dashboard"),
                  },
                ]}
              />

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="pr-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

