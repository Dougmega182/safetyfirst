// safetyfirst/lib/weekly-report.ts
import { prisma } from "./prisma"
import { startOfWeek, endOfWeek, format } from "date-fns"
import nodemailer from "nodemailer"

export async function generateWeeklyReport() {
  try {
    // Get the start and end of the current week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday as start of week
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

    // Format dates for display
    const weekStartFormatted = format(weekStart, "yyyy-MM-dd")
    const weekEndFormatted = format(weekEnd, "yyyy-MM-dd")

    // Get all job sites
    const jobSites = await prisma.jobSite.findMany({
      include: {
        attendances: {
          where: {
            signInTime: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
          include: {
            user: true,
          },
        },
        inductions: {
          include: {
            completions: {
              where: {
                completedAt: {
                  gte: weekStart,
                  lte: weekEnd,
                },
              },
            },
          },
        },
        swms: {
          include: {
            signoffs: {
              where: {
                signedAt: {
                  gte: weekStart,
                  lte: weekEnd,
                },
              },
            },
          },
        },
      },
    })

    // Calculate statistics
    const totalAttendances = jobSites.reduce((total, site) => total + site.attendances.length, 0)

    const uniqueWorkers = new Set()
    jobSites.forEach((site) => {
      site.attendances.forEach((attendance) => {
        uniqueWorkers.add(attendance.userId)
      })
    })

    const totalInductionsCompleted = jobSites.reduce(
      (total, site) =>
        total + site.inductions.reduce((siteTotal, induction) => siteTotal + induction.completions.length, 0),
      0,
    )

    const totalSwmsSigned = jobSites.reduce(
      (total, site) => total + site.swms.reduce((siteTotal, swms) => siteTotal + swms.signoffs.length, 0),
      0,
    )

    // Calculate total hours worked
    let totalHoursWorked = 0
    jobSites.forEach((site) => {
      site.attendances.forEach((attendance) => {
        if (attendance.signOutTime) {
          const signInTime = new Date(attendance.signInTime).getTime()
          const signOutTime = new Date(attendance.signOutTime).getTime()
          const durationHours = (signOutTime - signInTime) / (1000 * 60 * 60)
          totalHoursWorked += durationHours
        }
      })
    })

    // Prepare site-specific data
    const siteData = jobSites.map((site) => {
      const siteHours = site.attendances.reduce((total, attendance) => {
        if (!attendance.signOutTime) return total

        const signInTime = new Date(attendance.signInTime).getTime()
        const signOutTime = new Date(attendance.signOutTime).getTime()
        const durationHours = (signOutTime - signInTime) / (1000 * 60 * 60)

        return total + durationHours
      }, 0)

      return {
        name: site.name,
        attendances: site.attendances.length,
        uniqueWorkers: new Set(site.attendances.map((a) => a.userId)).size,
        hoursWorked: siteHours,
        inductionsCompleted: site.inductions.reduce((total, induction) => total + induction.completions.length, 0),
        swmsSigned: site.swms.reduce((total, swms) => total + swms.signoffs.length, 0),
      }
    })

    // Create report data
    const reportData = {
      weekStarting: weekStartFormatted,
      weekEnding: weekEndFormatted,
      totalAttendances,
      uniqueWorkers: uniqueWorkers.size,
      totalHoursWorked,
      totalInductionsCompleted,
      totalSwmsSigned,
      sites: siteData,
    }

    // Save report to database
    const reports = await prisma.weeklyReport.findMany({
      data: {
        weekStarting: weekStart,
        weekEnding: weekEnd,
        reportData: reportData as any,
        sentTo: [process.env.REPORT_EMAIL || "admin@example.com"],
      },
    })

    // Create email transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Generate HTML content
    const htmlContent = `
    <h1>Weekly Site Activity Report</h1>
    <p>Week: ${reportData.weekStarting} to ${reportData.weekEnding}</p>
    
    <h2>Summary</h2>
    <ul>
      <li>Total Attendances: ${reportData.totalAttendances}</li>
      <li>Unique Workers: ${reportData.uniqueWorkers}</li>
      <li>Total Hours Worked: ${reportData.totalHoursWorked.toFixed(1)}</li>
      <li>Inductions Completed: ${reportData.totalInductionsCompleted}</li>
      <li>SWMS Signed: ${reportData.totalSwmsSigned}</li>
    </ul>
    
    <h2>Site Breakdown</h2>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <th>Site Name</th>
        <th>Attendances</th>
        <th>Unique Workers</th>
        <th>Hours Worked</th>
        <th>Inductions</th>
        <th>SWMS</th>
      </tr>
      ${reportData.sites
        .map(
          (site: any) => `
        <tr>
          <td>${site.name}</td>
          <td>${site.attendances}</td>
          <td>${site.uniqueWorkers}</td>
          <td>${site.hoursWorked.toFixed(1)}</td>
          <td>${site.inductionsCompleted}</td>
          <td>${site.swmsSigned}</td>
        </tr>
      `,
        )
        .join("")}
    </table>
    
    <p>View detailed report in the admin dashboard.</p>
  `

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.REPORT_EMAIL,
      subject: `Weekly Site Activity Report: ${reportData.weekStarting} to ${reportData.weekEnding}`,
      html: htmlContent,
    })

    // Update report with sent timestamp
    await prisma.weeklyReport.update({
      where: { id: report.id },
      data: { sentAt: new Date() },
    })

    return { success: true, reportId: report.id }
  } catch (error) {
    console.error("Error generating weekly report:", error)
    return { success: false, error }
  }
}


