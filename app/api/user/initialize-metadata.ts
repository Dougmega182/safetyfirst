// safetyfirst/app/api/user/initialize-metadata.ts
// /app/api/user/initialize-metadata.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stackServerApp } from '@/lib/stack-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the user is authenticated and is an admin
  const session = await getServerAuthSession({ req, res });
  if (session?.user?.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { 
      userId, 
      clientMetadata, 
      serverMetadata, 
      clientReadOnlyMetadata 
    } = req.body;

    // Get the user from Stack
    const user = await stackServerApp.user.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update client metadata
    if (clientMetadata) {
      await user.setClientMetadata(clientMetadata);
    }

    // Update server metadata
    if (serverMetadata) {
      await user.setServerMetadata(serverMetadata);
    }

    // Update client read-only metadata
    if (clientReadOnlyMetadata) {
      await user.setClientReadOnlyMetadata(clientReadOnlyMetadata);
    }

    // Update user details in Prisma if needed
    await prisma.userDetails.upsert({
      where: { userId },
      update: {
        company: clientReadOnlyMetadata?.companyName,
        role: clientReadOnlyMetadata?.role,
      },
      create: {
        userId,
        company: clientReadOnlyMetadata?.companyName,
        role: clientReadOnlyMetadata?.role,
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error initializing user metadata:', error);
    return res.status(500).json({ error: 'Failed to initialize user metadata' });
  }
}
