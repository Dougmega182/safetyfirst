// app/api/job-sites/[id]/attendance/check/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is signed in to this site
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        jobSiteId: params.id,
        signOutTime: null,
      },
    })

    return NextResponse.json({ isSignedIn: !!attendance })
  } catch (error) {
    console.error("Error checking attendance:", error)
    return NextResponse.json({ message: "An error occurred while checking attendance" }, { status: 500 })
  }
}

