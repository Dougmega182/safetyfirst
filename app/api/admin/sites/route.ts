import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const dateFrom = url.searchParams.get("from") ? new Date(url.searchParams.get("from") as string) : undefined
    const dateTo = url.searchParams.get("to") ? new Date(url.searchParams.get("to") as string) : undefined

    // Fetch all job sites with related data
    const jobSites = await prisma.jobSite.findMany({
      include: {
        attendances: {
          where: {
            signOutTime: null, // Only active attendances
            ...(dateFrom && {
              signInTime: {
                gte: dateFrom,
              },
            }),
            ...(dateTo && {
              signInTime: {
                lte: dateTo,
              },
            }),
          },
          include: {
            user: true,
          },
        },
        inductions: {
          include: {
            completions: {
              where: {
                ...(dateFrom && {
                  completedAt: {
                    gte: dateFrom,
                  },
                }),
                ...(dateTo && {
                  completedAt: {
                    lte: dateTo,
                  },
                }),
              },
            },
          },
        },
        swms: {
          include: {
            signoffs: {
              where: {
                ...(dateFrom && {
                  signedAt: {
                    gte: dateFrom,
                  },
                }),
                ...(dateTo && {
                  signedAt: {
                    lte: dateTo,
                  },
                }),
              },
            },
          },
        },
      },
    })

    // Get all users for total count
    const allUsers = await prisma.user.count({
      where: {
        role: "USER", // Only count regular users, not admins or CEOs
      },
    })

    // Transform data for the frontend
    const sites = jobSites.map((site) => {
      // Count unique users who have attended this site
      const uniqueUsers = new Set(site.attendances.map((a) => a.userId))

      // Count total inductions and completed inductions
      const totalInductions = site.inductions.length * allUsers
      const completedInductions = site.inductions.reduce((total, induction) => total + induction.completions.length, 0)

      // Count total SWMS and signed SWMS
      const totalSwms = site.swms.length * allUsers
      const signedSwms = site.swms.reduce((total, swms) => total + swms.signoffs.length, 0)

      return {
        id: site.id,
        name: site.name,
        address: site.address,
        activeWorkers: site.attendances.length,
        totalWorkers: uniqueUsers.size,
        completedInductions,
        totalInductions,
        signedSwms,
        totalSwms,
      }
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error("Error fetching admin site data:", error)
    return NextResponse.json({ message: "An error occurred while fetching site data" }, { status: 500 })
  }
}

