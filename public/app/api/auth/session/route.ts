// safetyfirst/app/api/auth/session/route.ts
// app/api/auth/session/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { stackServerApp } from "@/lib/stack-auth"

export async function GET() {
  try {
    // Debug available methods
    console.log("Available methods on stackServerApp:", 
      Object.getOwnPropertyNames(Object.getPrototypeOf(stackServerApp))
        .filter(method => typeof stackServerApp[method as keyof typeof stackServerApp] === 'function')
    );
    
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("auth-session")?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }

    // Return the available methods for debugging
    return NextResponse.json({ 
      availableMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(stackServerApp))
        .filter(method => typeof stackServerApp[method as keyof typeof stackServerApp] === 'function'),
      user: null 
    });
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
