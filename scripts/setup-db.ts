import { execSync } from "child_process"

async function setupDatabase() {
  console.log("Setting up database...")

  try {
    // Run migrations
    console.log("Running migrations...")
    execSync("npx prisma migrate deploy", { stdio: "inherit" })

    // Generate Prisma client
    console.log("Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    // Seed the database
    console.log("Seeding database...")
    execSync("npx prisma db seed", { stdio: "inherit" })

    console.log("Database setup complete!")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()

