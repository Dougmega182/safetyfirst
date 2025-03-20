// safetyfirst/lib/user-metadata.ts
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  // add more roles as needed
}
import prisma from "@/lib/prisma.js";
import { CurrentUser, StackServerApp } from "@stackframe/stack"; // Import the CurrentUser type

const stackServerApp = new StackServerApp({
  projectId: process.env.STACK_PROJECT_ID!,
  tokenStore: "memory"
});

(async () => {
  await stackServerApp.getUser();
})();

// Types for custom user metadata
export interface UserClientMetadata {
  preferredJobSite?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  onboarded?: boolean;
  lastActiveAt?: string;
}

export interface UserClientReadOnlyMetadata {
  role: Role;
  accountStatus: "active" | "suspended" | "pending";
  companyName?: string;
  jobTitle?: string;
}

// Update user details in Prisma database
export async function updateUserDetails(userId: string, data: {
  company?: string;
  position?: string;
  phone?: string;
  role?: Role;
}) {
  return await prisma.userDetails.update({
    where: { userId },
    data
  });
}

// Add these functions to lib/user-metadata.ts
export async function updateUserServerMetadata(userId: string, metadata: Record<string, UserClientReadOnlyMetadata[keyof UserClientReadOnlyMetadata]>) {
  const user = await stackServerApp.getUser(userId);
  if (!user) throw new Error("User not found");
  await user.setServerMetadata(metadata);
}

export async function updateUserClientReadOnlyMetadata(userId: string, metadata: Partial<UserClientReadOnlyMetadata>) {
  const user = await stackServerApp.getUser(userId);
  if (!user) throw new Error("User not found");
  // Wrap the metadata to differentiate the implementation
  await user.setServerMetadata({ clientReadOnlyMetadata: metadata });
}
// Client-side function for updating user client metadata in Stack
export async function updateUserClientMetadata(
  user: CurrentUser | null,
  data: Partial<UserClientMetadata>
) {
  if (!user) throw new Error("User not found");

  // Use an API route to update Stack metadata
  const response = await fetch(`/api/user/client-metadata`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.id,
      metadata: data
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user metadata');
  }
  
  return await response.json();
}

// Create or update a user's profile with all details
export async function initializeUserProfile(
  userId: string,
  userData: {
    role?: Role;
    company?: string;
    position?: string;
    phone?: string;
  },
  clientMetadata?: Partial<UserClientMetadata>,
  clientReadOnlyMetadata?: Partial<UserClientReadOnlyMetadata>
) {
  // First, create or update the UserDetails record in Prisma
  const userDetails = await prisma.userDetails.upsert({
    where: { userId },
    update: {
      role: userData.role ?? Role.USER,
      company: userData.company,
      position: userData.position,
      phone: userData.phone,
    },
    create: {
      userId,
      role: userData.role ?? Role.USER,
      company: userData.company,
      position: userData.position,
      phone: userData.phone,
    },
  });
  
  // Then update the Stack user metadata via API
  const response = await fetch(`/api/user/initialize-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      clientMetadata: clientMetadata || {
        onboarded: false,
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
        },
        lastActiveAt: new Date().toISOString(),
      },
      clientReadOnlyMetadata: clientReadOnlyMetadata || {
        role: userData.role ?? Role.USER,
        accountStatus: "pending",
        companyName: userData.company,
        jobTitle: userData.position,
      }
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to initialize user profile');
  }
  
  return userDetails;
}

// Update Prisma and Stack metadata in one function
export async function updateUserProfile(
  user: CurrentUser | null,
  prismaData: {
    company?: string;
    position?: string;
    phone?: string;
    role?: Role;
  },
  stackData: Partial<UserClientMetadata>
) {
  if (!user) throw new Error("User not found");
  
  // Update Prisma database
  const userDetails = await prisma.userDetails.update({
    where: { userId: user.id },
    data: prismaData
  });
  
  // Update Stack metadata
  await updateUserClientMetadata(user, stackData);
  
  return userDetails;
}
