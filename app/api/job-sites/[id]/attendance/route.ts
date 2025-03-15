// app/api/job-sites/[id]/attendance/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const attendances = await prisma.attendance.findMany({
      where: { jobSiteId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            position: true,
          },
        },
      },
      orderBy: {
        signInTime: "desc",
      },
    })

    return NextResponse.json({ attendances })
  } catch (error) {
    console.error("Error fetching attendances:", error)
    return NextResponse.json({ message: "An error occurred while fetching attendances" }, { status: 500 })
  }
}

