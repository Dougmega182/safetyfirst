// safetyfirst/app/auth/stack-register/page.tsx
// /app/auth/stack-register/page.tsx 
"use client"

import { SignUp } from "@stackframe/stack"
import { HardHat } from "lucide-react"
import Link from "next/link"

export default function StackRegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <HardHat className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold">Safety Pass Pro</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <SignUp />
      </div>
    </div>
  )
}


