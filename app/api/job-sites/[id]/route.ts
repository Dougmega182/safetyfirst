// app/api/job-sites/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const jobSite = await prisma.jobSite.findUnique({
      where: { id: params.id },
      include: {
        inductions: {
          select: {
            id: true,
            title: true,
            description: true,
            requiresSignature: true,
          },
        },
        swms: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
          },
        },
      },
    })

    if (!jobSite) {
      return NextResponse.json({ message: "Job site not found" }, { status: 404 })
    }

    return NextResponse.json({ jobSite })
  } catch (error) {
    console.error("Error fetching job site:", error)
    return NextResponse.json({ message: "An error occurred while fetching the job site" }, { status: 500 })
  }
}

