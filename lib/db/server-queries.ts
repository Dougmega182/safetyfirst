// safetyfirst/lib/db/server-queries.ts
import { getAuthenticatedNeonDb } from "./neon-rls"

// Function to get job sites for the current user
export async function getUserJobSites() {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will automatically filter to show only the job sites the user has access to
    return await sql`
      SELECT * FROM job_sites
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Error fetching user job sites:", error)
    throw error
  }
}

// Function to get a specific job site
export async function getJobSite(jobSiteId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure the user has access to this job site
    const results = await sql`
      SELECT * FROM job_sites
      WHERE id = ${jobSiteId}
    `

    return results[0] || null
  } catch (error) {
    console.error(`Error fetching job site ${jobSiteId}:`, error)
    throw error
  }
}

// Function to get attendances for a job site
export async function getJobSiteAttendances(jobSiteId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure the user only sees attendances they're allowed to see
    return await sql`
      SELECT a.*, u.name, u.email
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      WHERE a.job_site_id = ${jobSiteId}
      ORDER BY a.sign_in_time DESC
    `
  } catch (error) {
    console.error(`Error fetching attendances for job site ${jobSiteId}:`, error)
    throw error
  }
}

// Function to get inductions for a job site
export async function getJobSiteInductions(jobSiteId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure the user only sees inductions they're allowed to see
    return await sql`
      SELECT i.*, 
        (SELECT COUNT(*) FROM induction_completions ic WHERE ic.induction_id = i.id) as completion_count
      FROM inductions i
      WHERE i.job_site_id = ${jobSiteId}
      ORDER BY i.created_at DESC
    `
  } catch (error) {
    console.error(`Error fetching inductions for job site ${jobSiteId}:`, error)
    throw error
  }
}

// Function to check if a user has completed an induction
export async function hasUserCompletedInduction(inductionId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure we're only checking the current user's completions
    const results = await sql`
      SELECT * FROM induction_completions
      WHERE induction_id = ${inductionId}
      AND user_id = auth.user_id()
    `

    return results.length > 0
  } catch (error) {
    console.error(`Error checking induction completion for ${inductionId}:`, error)
    throw error
  }
}

// Function to get SWMS for a job site
export async function getJobSiteSwms(jobSiteId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure the user only sees SWMS they're allowed to see
    return await sql`
      SELECT s.*, 
        (SELECT COUNT(*) FROM swms_signoffs ss WHERE ss.swms_id = s.id) as signoff_count
      FROM swms s
      WHERE s.job_site_id = ${jobSiteId}
      ORDER BY s.created_at DESC
    `
  } catch (error) {
    console.error(`Error fetching SWMS for job site ${jobSiteId}:`, error)
    throw error
  }
}

// Function to check if a user has signed off on a SWMS
export async function hasUserSignedSwms(swmsId: string) {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure we're only checking the current user's signoffs
    const results = await sql`
      SELECT * FROM swms_signoffs
      WHERE swms_id = ${swmsId}
      AND user_id = auth.user_id()
    `

    return results.length > 0
  } catch (error) {
    console.error(`Error checking SWMS signoff for ${swmsId}:`, error)
    throw error
  }
}

// Function for admins to get all users
export async function getAllUsers() {
  try {
    const sql = await getAuthenticatedNeonDb()

    // RLS will ensure only admins can execute this query successfully
    return await sql`
      SELECT * FROM users
      ORDER BY name ASC
    `
  } catch (error) {
    console.error("Error fetching all users:", error)
    throw error
  }
}


