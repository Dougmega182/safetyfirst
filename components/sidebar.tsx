"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/use-auth"
import { BarChart3, ClipboardList, FileText, HardHat, LayoutDashboard, MapPin, Settings, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  const isAdmin = user?.role === "ADMIN" || user?.role === "CEO"

  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      variant: "default",
    },
    {
      title: "Job Sites",
      href: "/job-sites",
      icon: MapPin,
      variant: "default",
    },
    {
      title: "Inductions",
      href: "/inductions",
      icon: ClipboardList,
      variant: "default",
    },
    {
      title: "SWMS",
      href: "/swms",
      icon: FileText,
      variant: "default",
    },
  ]

  const adminRoutes = [
    {
      title: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
      variant: "default",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      variant: "default",
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      variant: "default",
    },
  ]

  return (
    <Sidebar className={className} {...props}>
      <SidebarHeader className="flex items-center">
        <Link href="/" className="flex items-center gap-2 px-2">
          <HardHat className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">SafetyFirst</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarMenu>
              {adminRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                    <Link href={route.href}>
                      <route.icon className="h-5 w-5" />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

