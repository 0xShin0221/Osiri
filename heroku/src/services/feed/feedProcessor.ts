import { ArticleRepository } from '../../repositories/article.repository';
import { ProcessResult, RSSItem } from '../../types/models';
import { ContentCleaner } from '../content/cleaner';

export class FeedProcessor {
  private cleaner: ContentCleaner;

  constructor(
    private readonly articleRepository: ArticleRepository
  ) {
    this.cleaner = new ContentCleaner();
  }

  async process(feedId: string, items: RSSItem[]): Promise<ProcessResult> {
    try {
      if (items.length === 0) {
        return {
          success: true,
          feedId,
          itemsProcessed: 0
        };
      }

      const articles = items.map(item => ({
        feed_id: feedId,
        title: item.title,
        content: this.cleaner.clean(item.content),
        url: item.link
      }));

      const result = await this.articleRepository.saveMany(articles);
      console.log("articles saved", result);
      return {
        feedId,
        itemsProcessed: result.length,
        success: true
      };
    } catch (error) {
      return {
        feedId,
        itemsProcessed: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}