import { NextResponse } from "next/server"
import { getAuthenticatedNeonDb } from "@/lib/db/neon-rls"
import { verifyAuthToken } from "@/lib/auth-server"

export async function GET(request: Request) {
  try {
    // Verify the user's token
    const verifiedUser = await verifyAuthToken()

    if (!verifiedUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the authenticated database connection
    const sql = await getAuthenticatedNeonDb(verifiedUser.id)

    // Get query parameters
    const url = new URL(request.url)
    const limit = url.searchParams.get("limit")

    // Build the query
    let query = `
      SELECT j.*, 
        (SELECT COUNT(*) FROM attendances a WHERE a.job_site_id = j.id AND a.sign_out_time IS NULL) as active_workers
      FROM job_sites j
      ORDER BY j.created_at DESC
    `

    // Add limit if provided
    if (limit) {
      query += ` LIMIT ${Number.parseInt(limit)}`
    }

    // Execute the query
    const jobSites = await sql(query)

    // Transform the data to match the expected format
    const transformedJobSites = jobSites.map((site: any) => ({
      id: site.id,
      name: site.name,
      address: site.address,
      description: site.description,
      imageUrl: site.image_url,
      createdAt: site.created_at,
      activeWorkers: Number.parseInt(site.active_workers),
    }))

    return NextResponse.json({ jobSites: transformedJobSites })
  } catch (error) {
    console.error("Error fetching job sites:", error)
    return NextResponse.json({ message: "An error occurred while fetching job sites" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verify the user's token
    const verifiedUser = await verifyAuthToken()

    if (!verifiedUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the authenticated database connection
    const sql = await getAuthenticatedNeonDb(verifiedUser.id)

    const { name, address, description, imageUrl } = await request.json()

    if (!name || !address) {
      return NextResponse.json({ message: "Name and address are required" }, { status: 400 })
    }

    // Insert the job site
    // Note: created_by_id will be automatically set to auth.user_id() by RLS
    const result = await sql`
      INSERT INTO job_sites (name, address, description, image_url, created_by_id)
      VALUES (${name}, ${address}, ${description}, ${imageUrl}, auth.user_id())
      RETURNING *
    `

    const jobSite = result[0]

    return NextResponse.json({ jobSite })
  } catch (error) {
    console.error("Error creating job site:", error)
    return NextResponse.json({ message: "An error occurred while creating the job site" }, { status: 500 })
  }
}

