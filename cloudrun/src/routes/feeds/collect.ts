import { Request, Response } from 'express';
import { FeedCollector } from '../../services/feed/collector';
import { FeedRepository } from '../../repositories/feed.repository';
import { ArticleRepository } from '../../repositories/article.repository';
import { withErrorHandling } from '../../middleware/errorHandler';


export const collectFeeds = withErrorHandling(async (req: Request, res: Response) => {
  const feedRepository = new FeedRepository();
  const articleRepository = new ArticleRepository();
  const collector = new FeedCollector(feedRepository, articleRepository);
  
  const result = await collector.collectFeeds();
  res.json(result);
});
