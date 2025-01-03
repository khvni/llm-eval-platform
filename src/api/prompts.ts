import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const prompts = await prisma.prompt.findMany({
    include: {
      responses: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  });

  return res.status(200).json(prompts);
}