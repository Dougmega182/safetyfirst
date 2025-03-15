// safetyfirst/lib/onboarding.ts
"use client";

import { useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter, usePathname } from "next/navigation";

// Paths that don't require onboarding
const EXEMPT_PATHS = [
  "/onboarding",
  "/auth/login",
  "/auth/register",
  "/auth/stack-login",
  "/auth/stack-register",
  "/auth/forgot-password",
];

export function useRequireOnboarding() {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return; // Ensure user is loaded

    // Skip if we're already on an exempt path
    if (EXEMPT_PATHS.some((path) => pathname?.startsWith(path))) {
      return;
    }

    // Redirect to onboarding if user is not onboarded
    if (!user?.clientMetadata?.onboarded) {
      router.push("/onboarding");
    }
  }, [user, router, pathname]);

  return { isOnboarded: user?.clientMetadata?.onboarded === true };
}

