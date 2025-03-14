import { NextResponse } from "next/server"
import * as jose from "jose"

// Cache the JWKS for performance
let jwksCache: jose.RemoteJWKSet<jose.JWTVerifyGetKey> | null = null

async function getJwks() {
  if (!jwksCache) {
    const projectId = process.env.NEXT_PUBLIC_STACK_CLIENT_ID
    jwksCache = jose.createRemoteJWKSet(
      new URL(`https://api.stack-auth.com/api/v1/projects/${projectId}/.well-known/jwks.json`),
    )
  }
  return jwksCache
}

export async function POST(request: Request) {
  try {
    // Get the access token from the request headers
    const accessToken = request.headers.get("x-stack-access-token")

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 401 })
    }

    // Verify the JWT token
    const jwks = await getJwks()
    const { payload } = await jose.jwtVerify(accessToken, jwks)

    // Return the verified user information
    return NextResponse.json({
      authenticated: true,
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      // Add any other claims you need
    })
  } catch (error) {
    console.error("Error verifying token:", error)
    return NextResponse.json({ error: "Invalid token", authenticated: false }, { status: 401 })
  }
}

