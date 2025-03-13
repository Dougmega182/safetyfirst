import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// Paths that don't require authentication
const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/forgot-password"]

// API paths that don't require authentication
const publicApiPaths = ["/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/auth/session"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if the path is a public API path
  if (publicApiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if the path starts with /api/auth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // If no token and not a public path, redirect to login
  if (!token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  try {
    // Verify token
    verify(token, process.env.JWT_SECRET || "fallback-secret")
    return NextResponse.next()
  } catch (error) {
    // If token is invalid, redirect to login
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}