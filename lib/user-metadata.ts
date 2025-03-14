import { stackServerApp } from "@/lib/stack-auth"
import type { User } from "@stackframe/stack"

// Types for our custom user metadata
export interface UserClientMetadata {
  preferredJobSite?: string
  notificationPreferences?: {
    email: boolean
    sms: boolean
    push: boolean
  }
  onboarded?: boolean
  lastActiveAt?: string
}

export interface UserServerMetadata {
  verifiedCertifications?: string[]
  safetyTrainingCompleted?: boolean
  adminNotes?: string
  companyId?: string
  onboardingCompleted?: boolean
}

export interface UserClientReadOnlyMetadata {
  role: "worker" | "supervisor" | "admin" | "ceo"
  certificationLevel: "basic" | "intermediate" | "advanced"
  accountStatus: "active" | "suspended" | "pending"
  companyName?: string
  jobTitle?: string
}

// Client-side functions for updating user metadata
export async function updateUserClientMetadata(user: User, data: Partial<UserClientMetadata>) {
  return await user.update({
    clientMetadata: {
      ...user.clientMetadata,
      ...data,
    },
  })
}

// Server-side functions for updating user metadata
export async function updateUserServerMetadata(userId: string, data: Partial<UserServerMetadata>) {
  const user = await stackServerApp.getUser(userId)
  return await user.update({
    serverMetadata: {
      ...user.serverMetadata,
      ...data,
    },
  })
}

export async function updateUserClientReadOnlyMetadata(userId: string, data: Partial<UserClientReadOnlyMetadata>) {
  const user = await stackServerApp.getUser(userId)
  return await user.update({
    clientReadOnlyMetadata: {
      ...user.clientReadOnlyMetadata,
      ...data,
    },
  })
}

// Function to set initial metadata for a new user
export async function initializeUserMetadata(
  userId: string,
  userData: {
    role: UserClientReadOnlyMetadata["role"]
    companyName?: string
    jobTitle?: string
  },
) {
  const user = await stackServerApp.getUser(userId)

  await user.update({
    clientMetadata: {
      onboarded: false,
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
      },
      lastActiveAt: new Date().toISOString(),
    },
    serverMetadata: {
      verifiedCertifications: [],
      safetyTrainingCompleted: false,
      onboardingCompleted: false,
    },
    clientReadOnlyMetadata: {
      role: userData.role,
      certificationLevel: "basic",
      accountStatus: "pending",
      companyName: userData.companyName,
      jobTitle: userData.jobTitle,
    },
  })

  return user
}

