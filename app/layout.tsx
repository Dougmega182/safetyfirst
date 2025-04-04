 
import type React from "react";
import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../../stack.jsx";
import '@/styles/globals.css';
import { ThemeProvider } from "../components/theme-provider.jsx";
import { AuthProvider } from "@/lib/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarNav } from "@/components/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MobileProviderWrapper } from "@/components/mobile-provider-wrapper";
import { Header } from "@/components/header";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: "Construction Safety Platform",
  description: "Site safety management platform",
};

export const dynamic = 'force-dynamic';
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ fontFamily: "Inter, sans-serif" }}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
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
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
