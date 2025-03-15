// safetyfirst/app/api/user/client-metadata.ts
// /app/api/user/client-metadata.ts
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
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { userId, metadata } = req.body;
    
    // Security check: only allow users to update their own metadata
    if (session.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get the Stack user
    const stackUser = await stackServerApp.getUser(userId);
    if (!stackUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the client metadata in Stack
    // You'll need to use the actual method provided by the Stack API
    // This is just a placeholder - replace with actual Stack API call
    if (typeof stackUser.setClientMetadata === 'function') {
      await stackUser.setClientMetadata({
        ...(stackUser.clientMetadata || {}),
        ...metadata
      });
    } else {
      // Alternative approach if direct method not available
      await fetch(`${process.env.STACK_API_URL}/users/${userId}/metadata`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.STACK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientMetadata: metadata
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return res.status(500).json({ error: 'Failed to update user metadata' });
  }
}




