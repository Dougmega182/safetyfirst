import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sign } from "jsonwebtoken"
import nodemailer from "nodemailer"

// If you need to use cookies in this route in the future:
// const cookieStore = await cookies()

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      })
    }

    // Create a reset token
    const resetToken = sign({ id: user.id, action: "reset_password" }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "1h",
    })

    // In a production app, you would send an email with the reset link
    // For now, we'll just log it and return a success message
    console.log(`Reset token for ${email}: ${resetToken}`);


    // If SMTP is configured, send an actual email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Safety First" <noreply@example.com>',
        to: email,
        subject: "Reset your password",
        html: `
          <h1>Reset Your Password</h1>
          <p>You requested a password reset for your Safety First account.</p>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 })
  }
}

