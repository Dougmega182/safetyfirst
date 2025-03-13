import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}

