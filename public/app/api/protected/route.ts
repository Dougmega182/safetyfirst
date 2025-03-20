// safetyfirst/app/api/protected/route.ts
// app/api/protected/route.ts
import { verifyAuthToken } from "@/lib/auth-server"

export async function GET() {
  const user = await verifyAuthToken()
  
  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Handle authorized request
}

