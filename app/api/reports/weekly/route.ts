// safetyfirst/app/api/reports/weekly/route.ts
// app/api/reports/weekly/route.ts
import { NextResponse } from "next/server"
import { generateWeeklyReport } from "@/lib/weekly-report"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const result = await generateWeeklyReport()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Weekly report generated and sent successfully",
        reportId: result.reportId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate weekly report",
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error generating weekly report:", error)
    return NextResponse.json({ message: "An error occurred while generating the weekly report" }, { status: 500 })
  }
}


