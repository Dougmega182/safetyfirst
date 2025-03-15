// safetyfirst/app/api/admin/workers/route.ts
// api/admin/workers routes.ts
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get basic user information from a request
 */
export async function getUserFromRequest(request: Request) {
  try {
    // For API routes, get the token from the cookie in the request
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        displayName: true,
        email: true,
        authMethod: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

/**
 * Get user details from request
 */
export async function getUserDetailsFromRequest(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { id: string };

    // Find the user first
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return null;

    // Then find the user details using the userId field
    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: user.id },
    });

    return userDetails;
  } catch (error) {
    console.error("Error getting user details from request:", error);
    return null;
  }
}

/**
 * Get complete user profile with details
 */
export async function getCompleteUserProfile(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        details: true, // This is the correct field name from your schema
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting complete user profile:", error);
    return null;
  }
}

// Helper function to parse cookies from header
function parseCookies(cookieHeader: string) {
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {} as Record<string, string>);
}

