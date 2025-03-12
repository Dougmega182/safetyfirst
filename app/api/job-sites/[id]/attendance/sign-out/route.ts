import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Find the active attendance record
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        jobSiteId: params.id,
        signOutTime: null,
      },
    })

    if (!attendance) {
      return NextResponse.json({ message: "No active attendance record found" }, { status: 404 })
    }

    // Update the attendance record with sign-out time
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        signOutTime: new Date(),
      },
    })

    return NextResponse.json({ attendance: updatedAttendance })
  } catch (error) {
    console.error("Error signing out:", error)
    return NextResponse.json({ message: "An error occurred while signing out" }, { status: 500 })
  }
}

