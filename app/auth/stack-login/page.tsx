// safetyfirst/app/auth/stack-login/page.tsx
// /app/auth/stack-login/page.tsx 
"use client"

import { SignIn } from "@stackframe/stack"
import { HardHat } from "lucide-react"
import Link from "next/link"

export default function StackLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <HardHat className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold">SafetyFirst</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <SignIn
          automaticRedirect={true}
          firstTab="password"
          extraInfo={
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-blue-600 underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="mt-2">
                <Link href="/auth/login" className="text-blue-600 underline-offset-4 hover:underline">
                  Use traditional login
                </Link>
              </p>
            </div>
          }
        />
      </div>
    </div>
  )
}


