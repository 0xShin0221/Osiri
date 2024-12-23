import { Request, Response } from 'express';
import { ArticleRepository } from '../../repositories/article.repository';
import { z } from 'zod';
import { FeedProcessor } from '../../services/feed/feedprocessor';

const processRequestSchema = z.object({
  feedId: z.string().uuid(),
  items: z.array(z.object({
    title: z.string(),
    content: z.string(),
    link: z.string().url()
  }))
});

export const processFeeds = async (req: Request, res: Response) => {
  try {
    const validatedData = processRequestSchema.parse(req.body);
    
    const articleRepository = new ArticleRepository();
    const processor = new FeedProcessor(articleRepository);
    
    const result = await processor.process(
      validatedData.feedId,
      validatedData.items
    );
    
    res.json(result);
  } catch (error) {
    console.error('Feed processing error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Feed processing failed'
    });
  }
};