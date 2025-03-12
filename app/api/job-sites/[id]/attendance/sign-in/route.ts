import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is already signed in to this site
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        jobSiteId: params.id,
        signOutTime: null,
      },
    })

    if (existingAttendance) {
      return NextResponse.json({ message: "You are already signed in to this site" }, { status: 400 })
    }

    // Create new attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        jobSiteId: params.id,
      },
    })

    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("Error signing in:", error)
    return NextResponse.json({ message: "An error occurred while signing in" }, { status: 500 })
  }
}

