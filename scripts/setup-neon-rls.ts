// safetyfirst/scripts/setup-neon-rls.ts
import { getAdminNeonDb } from "../lib/db/neon-rls"

async function setupNeonRLS() {
  console.log("Setting up Neon RLS...")

  try {
    const sql = getAdminNeonDb()

    // Install the pg_session_jwt extension
    console.log("Installing pg_session_jwt extension...")
    await sql`CREATE EXTENSION IF NOT EXISTS pg_session_jwt;`

    // Set up roles and permissions
    console.log("Setting up roles and permissions...")

    // Grant permissions to authenticated role
    await sql`
      -- For existing tables
      GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
        IN SCHEMA public
        to authenticated;
        
      -- For future tables
      ALTER DEFAULT PRIVILEGES
        IN SCHEMA public
        GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
        TO authenticated;
        
      -- Grant USAGE on "public" schema
      GRANT USAGE ON SCHEMA public TO authenticated;
    `

    // Grant permissions to anonymous role
    await sql`
      -- For existing tables
      GRANT SELECT ON ALL TABLES
        IN SCHEMA public
        to anonymous;
        
      -- For future tables
      ALTER DEFAULT PRIVILEGES
        IN SCHEMA public
        GRANT SELECT ON TABLES
        TO anonymous;
        
      -- Grant USAGE on "public" schema
      GRANT USAGE ON SCHEMA public TO anonymous;
    `

    // Create auth schema and functions
    console.log("Creating auth schema and functions...")
    await sql`
      -- Create auth schema if it doesn't exist
      CREATE SCHEMA IF NOT EXISTS auth;
      
      -- Create function to get the current user ID from JWT
      CREATE OR REPLACE FUNCTION auth.user_id() RETURNS text AS $$
      BEGIN
        RETURN nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
      EXCEPTION
        WHEN others THEN
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Create function to check if the current user is authenticated
      CREATE OR REPLACE FUNCTION auth.is_authenticated() RETURNS boolean AS $$
      BEGIN
        RETURN auth.user_id() IS NOT NULL;
      EXCEPTION
        WHEN others THEN
          RETURN false;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Create function to get user role from JWT
      CREATE OR REPLACE FUNCTION auth.user_role() RETURNS text AS $$
      BEGIN
        RETURN nullif(current_setting('request.jwt.claims', true)::json->>'role', '')::text;
      EXCEPTION
        WHEN others THEN
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Create function to check if the current user is an admin
      CREATE OR REPLACE FUNCTION auth.is_admin() RETURNS boolean AS $$
      DECLARE
        user_role text;
      BEGIN
        user_role := auth.user_role();
        RETURN user_role = 'ADMIN' OR user_role = 'CEO';
      EXCEPTION
        WHEN others THEN
          RETURN false;
      END;
      $$ LANGUAGE plpgsql;
    `

    console.log("Neon RLS setup completed successfully!")
  } catch (error) {
    console.error("Error setting up Neon RLS:", error)
    process.exit(1)
  }
}

setupNeonRLS()


