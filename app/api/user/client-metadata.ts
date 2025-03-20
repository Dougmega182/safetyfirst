import { getServerSession } from "next-auth";
import { authOptions } from "@/public/app/api/auth/[...nextauth].js";
import { stackServerApp } from "@/lib/stack-auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { userId, metadata }: { userId: string; metadata: Record<string, unknown> } = req.body || {};
    if (!userId || typeof metadata !== "object") {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Ensure only self-updates unless admin
    const userRole = session.user?.role ?? "USER";
    const isAdmin = ["ADMIN", "CEO"].includes(userRole.toUpperCase());
    if (!isAdmin && session.user.id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Correct `getUser()` call
    const stackUser = await stackServerApp.getUser();
    if (!stackUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle `clientMetadata` safely
    interface ClientMetadata {
      preferredJobSite?: string;
      [key: string]: unknown;
    }
    const clientMetadata: ClientMetadata = (stackUser?.clientMetadata as ClientMetadata) || {};

    // Update metadata via API
    await fetch(`${process.env.STACK_API_URL}/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${process.env.STACK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientMetadata: { ...clientMetadata, ...metadata } }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return res.status(500).json({ error: "Failed to update user metadata" });
  }
}
