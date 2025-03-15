// safetyfirst/scripts/setup-rls.ts
import { neon } from "@neondatabase/serverless"
// Remove dotenv import and use process.env directly
// import dotenv from "dotenv";

// Load environment variables
// dotenv.config();

async function setupRLS() {
  try {
    console.log("Setting up Row-Level Security (RLS) in Neon database...")

    // Connect to the database
    const sql = neon(process.env.DATABASE_URL!)

    // Enable RLS on tables
    await sql`
      -- Enable RLS on job_sites table
      ALTER TABLE job_sites ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on attendances table
      ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on users table
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on inductions table
      ALTER TABLE inductions ENABLE ROW LEVEL SECURITY;
      
      -- Enable RLS on swms table
      ALTER TABLE swms ENABLE ROW LEVEL SECURITY;
    `

    // Create auth schema and functions
    await sql`
      -- Create auth schema if it doesn't exist
      CREATE SCHEMA IF NOT EXISTS auth;
      
      -- Create function to get the current user ID from JWT
      CREATE OR REPLACE FUNCTION auth.uid() RETURNS text AS $$
      DECLARE
        jwt_payload json;
        user_id text;
      BEGIN
        -- Extract payload from JWT
        jwt_payload := current_setting('request.jwt.claims', true)::json;
        
        -- Get user ID from payload
        user_id := jwt_payload->>'id';
        
        RETURN user_id;
      EXCEPTION
        WHEN others THEN
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `

    // Create RLS policies
    await sql`
      -- Job Sites policies
      CREATE POLICY job_sites_select_policy ON job_sites
        FOR SELECT USING (true); -- Everyone can view job sites
        
      CREATE POLICY job_sites_insert_policy ON job_sites
        FOR INSERT WITH CHECK (created_by_id = auth.uid() OR 
                              EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY job_sites_update_policy ON job_sites
        FOR UPDATE USING (created_by_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY job_sites_delete_policy ON job_sites
        FOR DELETE USING (created_by_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
      
      -- Attendances policies
      CREATE POLICY attendances_select_policy ON attendances
        FOR SELECT USING (user_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY attendances_insert_policy ON attendances
        FOR INSERT WITH CHECK (user_id = auth.uid() OR 
                              EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY attendances_update_policy ON attendances
        FOR UPDATE USING (user_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY attendances_delete_policy ON attendances
        FOR DELETE USING (user_id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
      
      -- Users policies
      CREATE POLICY users_select_policy ON users
        FOR SELECT USING (id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
        
      CREATE POLICY users_update_policy ON users
        FOR UPDATE USING (id = auth.uid() OR 
                         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'CEO')));
    `

    console.log("Row-Level Security setup completed successfully!")
  } catch (error) {
    console.error("Error setting up Row-Level Security:", error)
    process.exit(1)
  }
}

setupRLS()


