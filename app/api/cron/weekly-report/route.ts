import { NextResponse } from "next/server"
import { generateWeeklyReport } from "@/lib/weekly-report"

export async function GET(request: Request) {
  try {
    // Verify the request is authorized using the CRON_SECRET
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.CRON_SECRET

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
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
    console.error("Error in weekly report cron job:", error)
    return NextResponse.json({ message: "An error occurred in the weekly report cron job" }, { status: 500 })
  }
}

