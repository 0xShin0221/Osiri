import { BatchResults } from "../../../types/batch";
import { ContentScraper } from "../../content/scraper";
import { ArticleRepository } from "../../../repositories/article.repository";
import { ScrapingStepResult, StepProcessor } from "./stepProcessor.types";
import { chunk } from "lodash";


export class ContentScrapingStep implements StepProcessor {
  private readonly CHUNK_SIZE = 5;

  constructor(
    private readonly contentScraper: ContentScraper,
    private readonly articleRepository: ArticleRepository,
    private readonly batchSize: number
  ) {}

  async execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void
  ): Promise<ScrapingStepResult> {
    try {
      // Get unprocessed articles
      const unprocessedResponse = await this.articleRepository.getUnprocessedArticles(this.batchSize);
      
      if (!unprocessedResponse.success || !unprocessedResponse.data) {
        return {
          scrapedArticles: 0,
          failedScrapes: 0,
          totalArticles: 0
        };
      }

      const articles = unprocessedResponse.data;
      const articleChunks = chunk(articles, this.CHUNK_SIZE);
      let scrapedCount = 0;
      let failedCount = 0;

      // Process each chunk
      for (const articleChunk of articleChunks) {
        await Promise.all(
          articleChunk.map(async (article) => {
            try {
              // Scrape content
              const scrapeResult = await this.contentScraper.scrape(article.url);
              
              if (scrapeResult.success && scrapeResult.data) {
                // Update article with scraped content
                const updateResult = await this.articleRepository.updateScrapedContent(
                  article.id,
                  scrapeResult.data
                );

                if (updateResult.success) {
                  scrapedCount++;
                  results.scraping.success++;
                  onProgress?.('scrape', results.scraping.success);
                } else {
                  failedCount++;
                  results.scraping.failed++;
                  onError?.(
                    'scraping_update',
                    new Error(updateResult.error || 'Failed to update scraped content'),
                    article.id
                  );
                }
              } else {
                failedCount++;
                results.scraping.failed++;
                onError?.(
                  'scraping',
                  new Error(scrapeResult.error || 'Failed to scrape content'),
                  article.id
                );
              }
            } catch (error) {
              failedCount++;
              results.scraping.failed++;
              onError?.(
                'scraping',
                error instanceof Error ? error : new Error('Unknown scraping error'),
                article.id
              );
            }
          })
        );

        // Optional: Add delay between chunks to prevent rate limiting
        if (articleChunks.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return {
        scrapedArticles: scrapedCount,
        failedScrapes: failedCount,
        totalArticles: articles.length
      };
    } catch (error) {
      onError?.(
        'scraping_step',
        error instanceof Error ? error : new Error('Unknown error in scraping step')
      );
      
      return {
        scrapedArticles: 0,
        failedScrapes: 1,
        totalArticles: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}