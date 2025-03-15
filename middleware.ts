// safetyfirst/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// STACK AUTH API DETAILS
const STACK_AUTH_URL = process.env.STACK_AUTH_URL;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/forgot-password"];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  // If no token, redirect to login
  if (!token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  try {
    // 🔹 Verify token with Stack Auth API
    const stackAuthResponse = await fetch(`${STACK_AUTH_URL}/auth/validate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    if (!stackAuthResponse.ok) throw new Error("Invalid token");

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
}

