// safetyfirst/app/api/inductions/route.ts
// app/apiinductions/route.ts
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

    const inductions = await prisma.induction.findMany({
      where: jobSiteId ? { jobSiteId } : undefined,
      include: {
        jobSite: {
          select: { name: true },
        },
        completions: {
          where: { userId: user.id },
        },
      },
    })

    return NextResponse.json({ inductions })
  } catch (error) {
    console.error("Error fetching inductions:", error)
    return NextResponse.json({ message: "An error occurred while fetching inductions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "ADMIN" && user.role !== "CEO")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, jobSiteId, content, requiresSignature, expiryDays } = await request.json()

    if (!title || !jobSiteId || !content) {
      return NextResponse.json({ message: "Title, job site, and content are required" }, { status: 400 })
    }

    const induction = await prisma.induction.create({
      data: {
        title,
        description,
        jobSiteId,
        content,
        requiresSignature,
        expiryDays,
      },
    })

    return NextResponse.json({ induction })
  } catch (error) {
    console.error("Error creating induction:", error)
    return NextResponse.json({ message: "An error occurred while creating the induction" }, { status: 500 })
  }
}


