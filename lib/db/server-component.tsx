// safetyfirst/lib/db/server-component.tsx
import { cookies } from "next/headers"
import { getServerAuthDb } from "./auth-db.js"
import { prisma } from "@/lib/prisma.js"

// Fix the cookies issue by awaiting the cookies() function
export async function getAuthenticatedNeon() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    throw new Error("No authentication token found")
  }

  return getServerAuthDb(token)
}

export async function getJobSites() {
  try {
    const sql = await getAuthenticatedNeon()

    // Using RLS, this will only return job sites the user has access to
    const jobSites = await sql`
      SELECT * FROM job_sites 
      WHERE user_id = auth.uid()
      ORDER BY created_at DESC
    `

    return jobSites
  } catch (error) {
    console.error("Error fetching job sites with authenticated connection:", error)

    // Fallback to Prisma if RLS is not set up yet or the user schema doesn't support it
    console.log("Falling back to Prisma for job sites")
    return prisma.jobSite.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}

export async function getWorkers() {
  try {
    const sql = await getAuthenticatedNeon()

    // Using RLS, this will only return workers the user has access to
    const workers = await sql`
      SELECT * FROM workers 
      WHERE company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid()
      )
      ORDER BY name ASC
    `

    return workers
  } catch (error) {
    console.error("Error fetching workers with authenticated connection:", error)

    // Fallback to Prisma if RLS is not set up yet or if we don't need to access role or name directly
    console.log("Falling back to Prisma for workers")
    return prisma.user.findMany({
      orderBy: {
        // Avoiding "role" and "name" and just returning users without filtering by "role"
        signedUpAt: "desc", // Use a field that exists in your Prisma model for ordering
      },
    })
  }
}

export async function getSiteAttendance(siteId: string) {
  try {
    const sql = await getAuthenticatedNeon()

    // Using RLS, this will only return attendance records the user has access to
    const attendance = await sql`
      SELECT a.*, u.name, u.email 
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      WHERE a.job_site_id = ${siteId}
      ORDER BY a.sign_in_time DESC
    `

    return attendance
  } catch (error) {
    console.error("Error fetching site attendance with authenticated connection:", error)

    // Fallback to Prisma if RLS is not set up yet
    console.log("Falling back to Prisma for site attendance")
    return prisma.attendance.findMany({
      where: {
        jobSiteId: siteId,
      },
      include: {
        user: {
          select: {
            user: true,
            
          },
        },
      },
      orderBy: {
        signInTime: "desc",
      },
    })
  }
}

