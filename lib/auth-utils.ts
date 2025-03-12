import { verify } from "jsonwebtoken"
import { prisma } from "./prisma"

export async function getUserFromRequest(request: Request) {
  try {
    // For API routes, get the token from the cookie in the request
    const cookieHeader = request.headers.get("cookie")
    if (!cookieHeader) return null

    const cookies = parseCookies(cookieHeader)
    const token = cookies["auth-token"]

    if (!token) return null

    const decoded = verify(token, process.env.JWT_SECRET || "fallback-secret") as { id: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        position: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error getting user from request:", error)
    return null
  }
}

// Helper function to parse cookies from header
function parseCookies(cookieHeader: string) {
  return cookieHeader.split(";").reduce(
    (cookies, cookie) => {
      const [name, value] = cookie.trim().split("=")
      cookies[name] = decodeURIComponent(value)
      return cookies
    },
    {} as Record<string, string>,
  )
}

