// safetyfirst/scripts/apply-rls-policies.ts
import { getAdminNeonDb } from "../lib/db/neon-rls"

async function applyRLSPolicies() {
  console.log("Applying RLS policies to tables...")

  try {
    const sql = getAdminNeonDb()

    // Enable RLS on users table
    console.log("Enabling RLS on users table...")
    await sql`
      -- Enable RLS
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      
      -- Users can see their own data
      CREATE POLICY users_select_own ON users
        FOR SELECT
        USING (id = auth.user_id());
        
      -- Users can update their own data
      CREATE POLICY users_update_own ON users
        FOR UPDATE
        USING (id = auth.user_id());
        
      -- Admins can see all users
      CREATE POLICY users_select_admin ON users
        FOR SELECT
        USING (auth.is_admin());
        
      -- Admins can update all users
      CREATE POLICY users_update_admin ON users
        FOR UPDATE
        USING (auth.is_admin());
    `

    // Enable RLS on job_sites table
    console.log("Enabling RLS on job_sites table...")
    await sql`
      -- Enable RLS
      ALTER TABLE job_sites ENABLE ROW LEVEL SECURITY;
      
      -- Everyone can see job sites
      CREATE POLICY job_sites_select_all ON job_sites
        FOR SELECT
        USING (true);
        
      -- Only creators and admins can update job sites
      CREATE POLICY job_sites_update_own ON job_sites
        FOR UPDATE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only creators and admins can delete job sites
      CREATE POLICY job_sites_delete_own ON job_sites
        FOR DELETE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only authenticated users can insert job sites
      CREATE POLICY job_sites_insert_auth ON job_sites
        FOR INSERT
        WITH CHECK (auth.is_authenticated());
    `

    // Enable RLS on attendances table
    console.log("Enabling RLS on attendances table...")
    await sql`
      -- Enable RLS
      ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
      
      -- Users can see their own attendances
      CREATE POLICY attendances_select_own ON attendances
        FOR SELECT
        USING (user_id = auth.user_id());
        
      -- Users can update their own attendances
      CREATE POLICY attendances_update_own ON attendances
        FOR UPDATE
        USING (user_id = auth.user_id());
        
      -- Users can insert their own attendances
      CREATE POLICY attendances_insert_own ON attendances
        FOR INSERT
        WITH CHECK (user_id = auth.user_id());
        
      -- Admins can see all attendances
      CREATE POLICY attendances_select_admin ON attendances
        FOR SELECT
        USING (auth.is_admin());
        
      -- Admins can update all attendances
      CREATE POLICY attendances_update_admin ON attendances
        FOR UPDATE
        USING (auth.is_admin());
        
      -- Admins can delete all attendances
      CREATE POLICY attendances_delete_admin ON attendances
        FOR DELETE
        USING (auth.is_admin());
    `

    // Enable RLS on inductions table
    console.log("Enabling RLS on inductions table...")
    await sql`
      -- Enable RLS
      ALTER TABLE inductions ENABLE ROW LEVEL SECURITY;
      
      -- Everyone can see inductions
      CREATE POLICY inductions_select_all ON inductions
        FOR SELECT
        USING (true);
        
      -- Only creators and admins can update inductions
      CREATE POLICY inductions_update_own ON inductions
        FOR UPDATE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only creators and admins can delete inductions
      CREATE POLICY inductions_delete_own ON inductions
        FOR DELETE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only authenticated users can insert inductions
      CREATE POLICY inductions_insert_auth ON inductions
        FOR INSERT
        WITH CHECK (auth.is_authenticated());
    `

    // Enable RLS on induction_completions table
    console.log("Enabling RLS on induction_completions table...")
    await sql`
      -- Enable RLS
      ALTER TABLE induction_completions ENABLE ROW LEVEL SECURITY;
      
      -- Users can see their own completions
      CREATE POLICY induction_completions_select_own ON induction_completions
        FOR SELECT
        USING (user_id = auth.user_id());
        
      -- Users can insert their own completions
      CREATE POLICY induction_completions_insert_own ON induction_completions
        FOR INSERT
        WITH CHECK (user_id = auth.user_id());
        
      -- Admins can see all completions
      CREATE POLICY induction_completions_select_admin ON induction_completions
        FOR SELECT
        USING (auth.is_admin());
    `

    // Enable RLS on swms table
    console.log("Enabling RLS on swms table...")
    await sql`
      -- Enable RLS
      ALTER TABLE swms ENABLE ROW LEVEL SECURITY;
      
      -- Everyone can see SWMS
      CREATE POLICY swms_select_all ON swms
        FOR SELECT
        USING (true);
        
      -- Only creators and admins can update SWMS
      CREATE POLICY swms_update_own ON swms
        FOR UPDATE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only creators and admins can delete SWMS
      CREATE POLICY swms_delete_own ON swms
        FOR DELETE
        USING (created_by_id = auth.user_id() OR auth.is_admin());
        
      -- Only authenticated users can insert SWMS
      CREATE POLICY swms_insert_auth ON swms
        FOR INSERT
        WITH CHECK (auth.is_authenticated());
    `

    // Enable RLS on swms_signoffs table
    console.log("Enabling RLS on swms_signoffs table...")
    await sql`
      -- Enable RLS
      ALTER TABLE swms_signoffs ENABLE ROW LEVEL SECURITY;
      
      -- Users can see their own signoffs
      CREATE POLICY swms_signoffs_select_own ON swms_signoffs
        FOR SELECT
        USING (user_id = auth.user_id());
        
      -- Users can insert their own signoffs
      CREATE POLICY swms_signoffs_insert_own ON swms_signoffs
        FOR INSERT
        WITH CHECK (user_id = auth.user_id());
        
      -- Admins can see all signoffs
      CREATE POLICY swms_signoffs_select_admin ON swms_signoffs
        FOR SELECT
        USING (auth.is_admin());
    `

    console.log("RLS policies applied successfully!")
  } catch (error) {
    console.error("Error applying RLS policies:", error)
    process.exit(1)
  }
}

applyRLSPolicies()


