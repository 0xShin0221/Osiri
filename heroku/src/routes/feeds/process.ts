import { Request, Response } from 'express';
import { ArticleRepository } from '../../repositories/article.repository';
import { z } from 'zod';
import { FeedProcessor } from '../../services/feed/feedprocessor';
import { withValidation } from '../../middleware/requestHandler';

const processRequestSchema = z.object({
  feedId: z.string().uuid(),
  items: z.array(z.object({
    title: z.string(),
    content: z.string(),
    link: z.string().url()
  }))
});

export const processFeeds = withValidation(processRequestSchema)(
  async (req: Request, res: Response) => {
    const articleRepository = new ArticleRepository();
    const processor = new FeedProcessor(articleRepository);
    
    const result = await processor.process(
      req.body.feedId,
      req.body.items
    );
    
    res.json(result);
  }
);