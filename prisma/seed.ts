const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  console.log({ admin })

  // Create CEO user
  const ceoPassword = await bcrypt.hash("ceo123", 10)
  const ceo = await prisma.user.upsert({
    where: { email: "ceo@example.com" },
    update: {},
    create: {
      email: "ceo@example.com",
      name: "CEO User",
      password: ceoPassword,
      role: "CEO",
    },
  })

  console.log({ ceo })

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
      company: "ABC Construction",
      position: "Tradesman",
    },
  })

  console.log({ user })

  // Create a job site
  const jobSite = await prisma.jobSite.upsert({
    where: { id: "site_1" },
    update: {},
    create: {
      id: "site_1",
      name: "Downtown Tower Project",
      address: "123 Main St, Sydney NSW 2000",
      description: "A 30-story commercial tower development",
      createdById: admin.id,
    },
  })

  console.log({ jobSite })

  // Create an induction
  const induction = await prisma.induction.upsert({
    where: { id: "ind_1" },
    update: {},
    create: {
      id: "ind_1",
      title: "General Site Induction",
      description: "Basic safety induction for all workers",
      content: {
        sections: [
          {
            title: "Introduction",
            content: "Welcome to the site. This induction covers basic safety procedures.",
          },
          {
            title: "Emergency Procedures",
            content: "In case of emergency, proceed to the nearest exit and gather at the assembly point.",
          },
          {
            title: "PPE Requirements",
            content: "Hard hat, safety boots, and high-visibility vest are mandatory at all times.",
          },
        ],
      },
      jobSiteId: jobSite.id,
    },
  })

  console.log({ induction })

  // Create a SWMS
  const swms = await prisma.swms.upsert({
    where: { id: "swms_1" },
    update: {},
    create: {
      id: "swms_1",
      title: "Working at Heights",
      description: "Safe work method statement for working at heights above 2 meters",
      content: {
        hazards: [
          {
            description: "Falling from height",
            controls: "Use harness, secure anchor points, and ensure proper training",
            riskLevel: "high",
          },
          {
            description: "Falling objects",
            controls: "Secure tools, use tool lanyards, and establish exclusion zones below",
            riskLevel: "medium",
          },
        ],
      },
      status: "APPROVED",
      jobSiteId: jobSite.id,
      createdById: admin.id,
      approvedById: ceo.id,
      approvedAt: new Date(),
    },
  })

  console.log({ swms })
}

main()
  .catch((e) => console.error(e))
  .finally(() => {
    process.exit(0);
  });

