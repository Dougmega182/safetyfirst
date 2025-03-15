// safetyfirst/lib/auth-server.ts
import { headers } from "next/headers"
import { createRemoteJWKSet, jwtVerify } from "jose"

const JWKS_CACHE_TTL = 60 * 60 * 1000 // 1 hour cache
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null
let cacheTimestamp = 0

export interface VerifiedUser {
  id: string
  email?: string
  name?: string
  roles?: string[]
}

export async function verifyAuthToken(): Promise<VerifiedUser | null> {
  try {
    // Await the headers() to resolve the promise
    const headersList = await headers()
    const accessToken = headersList.get("x-stack-access-token")

    if (!accessToken?.startsWith("Bearer ")) return null

    const token = accessToken.split(" ")[1]
    
    // Refresh JWKS cache if needed
    if (!jwksCache || Date.now() - cacheTimestamp > JWKS_CACHE_TTL) {
      const projectId = process.env.STACK_PROJECT_ID
      if (!projectId) throw new Error("Missing STACK_PROJECT_ID")
      
      jwksCache = createRemoteJWKSet(
        new URL(`https://api.stack-auth.com/api/v1/projects/83d8c330-6a21-48d7-a06b-15ee669f4292/.well-known/jwks.json`)
      )
      cacheTimestamp = Date.now()
    }

    const { payload } = await jwtVerify(token, jwksCache, {
      issuer: "stack-auth",
      audience: "api"
    })

    // Type assertion here to ensure payload has the correct type
    return {
      id: (payload as any).sub!,
      email: (payload as any).email,
      name: (payload as any).name,
      roles: (payload as any).roles || []
    }
  } catch (error) {
    console.error("Auth verification failed:", error)
    return null
  }
}

