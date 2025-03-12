import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MobileProviderWrapper } from "@/components/mobile-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Construction Safety Platform",
  description: "Site safety management platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SidebarProvider>
              <MobileProviderWrapper>
                <div className="flex min-h-screen">
                  <SidebarNav />
                  <SidebarInset>
                    <div className="flex min-h-screen flex-col">
                      <Header />
                      <main className="flex-1">{children}</main>
                    </div>
                  </SidebarInset>
                </div>
              </MobileProviderWrapper>
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

