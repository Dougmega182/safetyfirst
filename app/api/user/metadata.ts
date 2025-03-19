// safetyfirst/app/api/user/metadata.ts
// /app/api/user/metadata.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/lib/auth';
import { stackServerApp } from '@/lib/stack-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the user is authenticated
  const session = await getServerAuthSession({ req, res });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { userId, clientMetadata } = req.body;
    
    // Security check: only allow users to update their own metadata
    if (session.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get the user from Stack
    const user = await stackServerApp.users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the client metadata using Stack's API
    await user.setClientMetadata({
      ...user.clientMetadata,
      ...clientMetadata
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return res.status(500).json({ error: 'Failed to update user metadata' });
  }
}

