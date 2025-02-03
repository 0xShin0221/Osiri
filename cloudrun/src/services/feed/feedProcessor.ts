import type { ArticleRepository } from "../../repositories/article.repository";
import type {
  ArticleInsert,
  ArticleScrapingStatus,
  ProcessResult,
  RSSItem,
} from "../../types/models";

export class FeedProcessor {
  private readonly MAX_ITEMS_TO_PROCESS = 10;
  private readonly MIN_CONTENT_LENGTH = 100;
  private readonly MAX_BATCH_SIZE = 5;

  constructor(private readonly articleRepository: ArticleRepository) {}

  async process(feedId: string, items: RSSItem[]): Promise<ProcessResult> {
    try {
      // Filter out items that are too short
      const validItems = items
        .filter((item) =>
          item.content && item.content.length >= this.MIN_CONTENT_LENGTH
        )
        .slice(0, this.MAX_ITEMS_TO_PROCESS);

      if (validItems.length === 0) {
        return {
          feedId,
          success: true,
          itemsProcessed: 0,
        };
      }

      // Process items in smaller batches to prevent overwhelming the database
      const batches = this.chunkArray(validItems, this.MAX_BATCH_SIZE);
      let totalProcessed = 0;

      for (const batch of batches) {
        const articles: Omit<ArticleInsert, "created_at" | "updated_at">[] =
          batch.map((item) => ({
            feed_id: feedId,
            title: item.title,
            url: item.link,
            content: item.content,
            published_at: item.pubDate
              ? new Date(item.pubDate).toISOString()
              : new Date().toISOString(),
            scraping_status: "pending" as ArticleScrapingStatus,
            scraping_attempt_count: 0,
          }));

        const savedArticles = await this.articleRepository.saveMany(articles);
        totalProcessed += savedArticles.length;
      }

      return {
        feedId,
        success: true,
        itemsProcessed: totalProcessed,
      };
    } catch (error) {
      return {
        feedId,
        success: false,
        itemsProcessed: 0,
        error: error instanceof Error
          ? error.message
          : "Unknown error processing feed",
      };
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
