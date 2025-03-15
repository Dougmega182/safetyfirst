// safetyfirst/app/api/user/initialize-profile.ts
// app/api/user/initialize-profile.ts
import { getServerSession } from 'next-auth/next'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 1. Authenticate user
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. Check admin role
    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: session.user.id }
    })
    
    if (!userDetails || userDetails.role !== Role.ADMIN) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' })
    }

    // 3. Validate request body
    const { userId, clientMetadata, clientReadOnlyMetadata } = req.body
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    // 4. Update user metadata
    const updatedUser = await prisma.userDetails.update({
      where: { userId },
      data: {
        clientMetadata: clientMetadata || {},
        clientReadOnlyMetadata: clientReadOnlyMetadata || {},
      }
    })

    return res.status(200).json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Profile initialization error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

