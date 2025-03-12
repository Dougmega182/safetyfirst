import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    // Get job sites (public route, no auth required)
    const jobSites = await prisma.jobSite.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        imageUrl: true,
        description: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ jobSites })
  } catch (error) {
    console.error("Error fetching job sites:", error)
    return NextResponse.json({ message: "An error occurred while fetching job sites" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, address, description, imageUrl } = await request.json()

    if (!name || !address) {
      return NextResponse.json({ message: "Name and address are required" }, { status: 400 })
    }

    const jobSite = await prisma.jobSite.create({
      data: {
        name,
        address,
        description,
        imageUrl,
        createdById: user.id,
      },
    })

    return NextResponse.json({ jobSite })
  } catch (error) {
    console.error("Error creating job site:", error)
    return NextResponse.json({ message: "An error occurred while creating the job site" }, { status: 500 })
  }
}

