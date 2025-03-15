// safetyfirst/app/api/user/onboarding.ts
// /app/api/user/onboarding.ts 
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { safetyTraining, jobTitle, company } = req.body;
    
    // Update user details in Prisma
    await prisma.userDetails.update({
      where: { userId: session.user.id },
      data: {
        company: company,
        position: jobTitle
        // You don't have safetyTraining as a direct field in UserDetails
        // Consider storing this information elsewhere or creating a related table
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
