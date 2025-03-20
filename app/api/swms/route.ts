// safetyfirst/app/api/swms/route.ts
// app/api/swms/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobSiteId = searchParams.get("jobSiteId")

    const swmsList = await prisma.swms.findMany({
      where: jobSiteId ? { jobSiteId } : undefined,
      include: {
        jobSite: {
          select: { name: true },
        },
        signoffs: {
          where: { userId: user.id },
        },
      },
    })

    return NextResponse.json({ swmsList })
  } catch (error) {
    console.error("Error fetching SWMS:", error)
    return NextResponse.json({ message: "An error occurred while fetching SWMS" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, jobSiteId, content } = await request.json()

    if (!title || !jobSiteId || !content) {
      return NextResponse.json({ message: "Title, job site, and content are required" }, { status: 400 })
    }

    const swms = await prisma.swms.create({
      data: {
        title,
        description,
        jobSiteId,
        content,
        createdById: user.id,
      },
    })

    return NextResponse.json({ swms })
  } catch (error) {
    console.error("Error creating SWMS:", error)
    return NextResponse.json({ message: "An error occurred while creating the SWMS" }, { status: 500 })
  }
}


