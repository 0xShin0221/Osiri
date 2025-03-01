import type { BatchResults } from "../../../types/batch";
import type { ContentScraper } from "../../content/scraper";
import type { ArticleRepository } from "../../../repositories/article.repository";
import type { ScrapingStepResult, StepProcessor } from "./stepProcessor.types";

export class ContentScrapingStep implements StepProcessor {
  // Increased API delay between requests to reduce server load
  private readonly API_DELAY_MS = 1000; // 1 second between requests

  // Maximum number of concurrent scraping operations
  private readonly MAX_CONCURRENT = 5; // Only process 10 articles at a time

  // Delay between batches to allow memory to be released
  private readonly BATCH_DELAY_MS = 3000; // 3 seconds between batches

  constructor(
    private readonly contentScraper: ContentScraper,
    private readonly articleRepository: ArticleRepository,
    private readonly batchSize: number,
  ) {}

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Process articles in controlled batches to prevent memory overload
   */
  async execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void,
  ): Promise<ScrapingStepResult> {
    try {
      // Get unprocessed articles
      const unprocessedResponse = await this.articleRepository
        .getUnprocessedArticles(this.batchSize);

      if (!unprocessedResponse.success || !unprocessedResponse.data?.length) {
        return {
          scrapedArticles: 0,
          failedScrapes: 0,
          totalArticles: 0,
        };
      }

      const articles = unprocessedResponse.data;
      let scrapedCount = 0;
      let failedCount = 0;

      // Process articles in smaller batches to manage memory better
      for (let i = 0; i < articles.length; i += this.MAX_CONCURRENT) {
        // Create a smaller batch of the appropriate size
        const currentBatch = articles.slice(i, i + this.MAX_CONCURRENT);

        console.log(
          `[Batch ${Math.floor(i / this.MAX_CONCURRENT) + 1}/${
            Math.ceil(articles.length / this.MAX_CONCURRENT)
          }] Processing ${currentBatch.length} articles`,
        );

        // Process each article in the current batch
        const batchPromises = currentBatch.map(async (article) => {
          try {
            console.log(`[Article] Processing ${article.id}: ${article.url}`);

            // Scrape content
            const scrapeResult = await this.contentScraper.scrape(article.url);

            if (!scrapeResult.success || !scrapeResult.data) {
              await this.articleRepository.updateScrapingStatus(
                article.id,
                "failed",
                scrapeResult.error || "Undefined content",
              );
              failedCount++;
              return false;
            }

            // Update article with scraped content
            const updateResult = await this.articleRepository
              .updateScrapedContent(
                article.id,
                scrapeResult.data,
              );

            if (!updateResult.success) {
              onError?.(
                "scraping_update",
                new Error(
                  updateResult.error || "Failed to update scraped content",
                ),
                article.id,
              );
              failedCount++;
              return false;
            }

            scrapedCount++;
            results.scraping.success++;
            onProgress?.("scrape", results.scraping.success);
            return true;
          } catch (error) {
            onError?.(
              "scraping",
              error instanceof Error
                ? error
                : new Error("Unknown scraping error"),
              article.id,
            );
            failedCount++;
            return false;
          }
        });

        // Wait for the current batch to complete
        await Promise.all(batchPromises);

        // Wait between batches to allow memory cleanup
        if (i + this.MAX_CONCURRENT < articles.length) {
          console.log(
            `Waiting ${this.BATCH_DELAY_MS}ms between batches to release memory...`,
          );
          await this.delay(this.BATCH_DELAY_MS);

          // Force garbage collection if Node.js allows it
          if (global.gc) {
            try {
              global.gc();
              console.log("Garbage collection triggered.");
            } catch (e) {
              console.log("Failed to trigger garbage collection.");
            }
          }
        }
      }

      return {
        scrapedArticles: scrapedCount,
        failedScrapes: failedCount,
        totalArticles: articles.length,
      };
    } catch (error) {
      onError?.(
        "scraping_step",
        error instanceof Error
          ? error
          : new Error("Unknown error in scraping step"),
      );

      return {
        scrapedArticles: 0,
        failedScrapes: 1,
        totalArticles: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
