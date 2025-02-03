import { FeedRepository } from '../../repositories/feed.repository';
import { ArticleRepository } from '../../repositories/article.repository';
import { ServiceResponse } from '../../types/models';

interface CollectionResult {
  processedFeeds: number;
  successCount: number;
  failedFeeds: Array<{
    url: string;
    error: string;
  }>;
}

export class FeedCollector {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly articleRepository: ArticleRepository
  ) {}

  async collectFeeds(): Promise<ServiceResponse<CollectionResult>> {
    try {
      const feeds = await this.feedRepository.getActiveBatch();
      
      const result: CollectionResult = {
        processedFeeds: feeds.length,
        successCount: 0,
        failedFeeds: []
      };

      for (const feed of feeds) {
        try {
          await this.feedRepository.updateLastFetched(feed.id);
          result.successCount++;
        } catch (error) {
          result.failedFeeds.push({
            url: feed.url,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return { 
        success: true, 
        data: result 
      };
    } catch (error) {
      console.error('Feed collection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}