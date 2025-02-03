import type { BatchResults } from "../../../types/batch";
import type { ContentScraper } from "../../content/scraper";
import type { ArticleRepository } from "../../../repositories/article.repository";
import type { ScrapingStepResult, StepProcessor } from "./stepProcessor.types";


export class ContentScrapingStep implements StepProcessor {
  private readonly API_DELAY_MS = 700; // 0.7 second between requests
  constructor(
    private readonly contentScraper: ContentScraper,
    private readonly articleRepository: ArticleRepository,
    private readonly batchSize: number
  ) {}

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void
  ): Promise<ScrapingStepResult> {
    try {
      // Get unprocessed articles
      const unprocessedResponse = await this.articleRepository.getUnprocessedArticles(this.batchSize);
      
      if (!unprocessedResponse.success || !unprocessedResponse.data?.length) {
        return {
          scrapedArticles: 0,
          failedScrapes: 0,
          totalArticles: 0
        };
      }

      const articles = unprocessedResponse.data;

      // Process articles in parallel
      const scrapingPromises = articles.map(async (article) => {
        try {
          // Scrape content
          const scrapeResult = await this.contentScraper.scrape(article.url);
          
          if (!scrapeResult.success || !scrapeResult.data) {
            await this.articleRepository.updateScrapingStatus(article.id, 'failed', scrapeResult.error || "Undefined content");
            return false;
          }

          // Update article with scraped content
          const updateResult = await this.articleRepository.updateScrapedContent(
            article.id,
            scrapeResult.data
          );

          if (!updateResult.success) {
            onError?.(
              'scraping_update',
              new Error(updateResult.error || 'Failed to update scraped content'),
              article.id
            );
            return false;
          }

          results.scraping.success++;
          onProgress?.('scrape', results.scraping.success);
          await this.delay(this.API_DELAY_MS);
          return true;
        } catch (error) {
          onError?.(
            'scraping',
            error instanceof Error ? error : new Error('Unknown scraping error'),
            article.id
          );
          return false;
        }
      });

      // Wait for all scraping attempts to complete
      const scrapingResults = await Promise.all(scrapingPromises);

      return {
        scrapedArticles: scrapingResults.filter(Boolean).length,
        failedScrapes: scrapingResults.filter(r => !r).length,
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