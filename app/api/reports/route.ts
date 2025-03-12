import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Fetch all reports
    const reports = await prisma.weeklyReport.findMany({
      orderBy: {
        weekStarting: "desc",
      },
    })

    // Transform data for the frontend
    const transformedReports = reports.map((report) => ({
      id: report.id,
      weekStarting: report.weekStarting.toISOString(),
      weekEnding: report.weekEnding.toISOString(),
      sentAt: report.sentAt ? report.sentAt.toISOString() : null,
      sentTo: report.sentTo,
    }))

    return NextResponse.json({ reports: transformedReports })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ message: "Anrror occurred while fetching reports" }, { status: 500 })
  }
}

