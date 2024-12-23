import { Request, Response } from 'express';
import { FeedCollector } from '../../services/feed/collector';
import { FeedRepository } from '../../repositories/feed.repository';
import { ArticleRepository } from '../../repositories/article.repository';


export const collectFeeds = async (req: Request, res: Response) => {
  try {
    const feedRepository = new FeedRepository();
    const articleRepository = new ArticleRepository();
    const collector = new FeedCollector(feedRepository, articleRepository);
    
    const result = await collector.collectFeeds();
    res.json(result);
  } catch (error) {
    console.error('Feed collection error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Feed collection failed'
    });
  }
};
