import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { LLMService } from '@/services/llm';
import { rateLimit } from '@/lib/rate-limit';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Add rate limiting
    const identifier = req.headers['x-forwarded-for'] || 'anonymous';
    await rateLimit(identifier);

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { prompt, systemPrompt, providers, models } = req.body;
    
    if (!prompt || !providers?.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const llmService = new LLMService();

    // Create a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      const savedPrompt = await tx.prompt.create({
        data: { content: prompt, systemPrompt }
      });

      const responses = await Promise.all(
        providers.map(async (provider: string) => {
          const response = await llmService.getCompletion(
            prompt, 
            systemPrompt,
            provider,
            models?.[provider]
          );
          
          return tx.response.create({
            data: {
              promptId: savedPrompt.id,
              llmProvider: provider,
              ...response
            }
          });
        })
      );

      return { prompt: savedPrompt, responses };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Evaluation error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}