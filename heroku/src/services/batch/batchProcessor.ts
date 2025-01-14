import type {
  BatchOptions,
  BatchProcessResult,
  BatchResults,
} from "../../types/batch";
import type { FeedRepository } from "../../repositories/feed.repository";
import type { ArticleRepository } from "../../repositories/article.repository";
import { FeedCollectionStep } from "./steps/feedCollectionStep";
import { FeedProcessingStep } from "./steps/feedProcessingStep";
import { ContentScrapingStep } from "./steps/contentScrapingStep";
import { ContentTranslationStep } from "./steps/contentTranslationStep";
import { FeedCollector } from "../feed/collector";
import { FeedProcessor } from "../feed/feedProcessor";
import { FeedParser } from "../feed/parser";
import { ContentScraper } from "../content/scraper";
import { ContentTranslator } from "../content/translator";

export class BatchProcessor {
  private readonly feedCollectionStep: FeedCollectionStep;
  private readonly feedProcessingStep: FeedProcessingStep;
  private readonly contentScrapingStep: ContentScrapingStep;
  private readonly contentTranslationStep: ContentTranslationStep;
  private readonly DEFAULT_BATCH_SIZE = 10;

  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly articleRepository: ArticleRepository,
  ) {
    // Initialize dependencies
    const feedCollector = new FeedCollector(feedRepository, articleRepository);
    const feedProcessor = new FeedProcessor(articleRepository);
    const feedParser = new FeedParser();
    const contentScraper = new ContentScraper();
    const contentTranslator = new ContentTranslator();

    // Initialize steps
    this.feedCollectionStep = new FeedCollectionStep(feedCollector);
    this.feedProcessingStep = new FeedProcessingStep(
      feedProcessor,
      feedParser,
      feedRepository,
      this.DEFAULT_BATCH_SIZE,
    );
    this.contentScrapingStep = new ContentScrapingStep(
      contentScraper,
      articleRepository,
      this.DEFAULT_BATCH_SIZE,
    );
    this.contentTranslationStep = new ContentTranslationStep(
      contentTranslator,
      articleRepository,
      this.DEFAULT_BATCH_SIZE,
    );
  }

  async process(options: BatchOptions = {}): Promise<BatchProcessResult> {
    const startTime = Date.now();
    const batchId = crypto.randomUUID();
    const {
      onProgress,
      onError,
    } = options;

    const batchResults: BatchResults = {
      collection: { success: 0, failed: 0 },
      processing: { success: 0, failed: 0 },
      scraping: { success: 0, failed: 0 },
      translation: { success: 0, failed: 0 },
    };

    try {
      // Step 1: Collect feeds
      console.log("Starting feed collection...");
      const collectionResult = await this.feedCollectionStep.execute(
        batchResults,
        onProgress,
        onError,
      );

      // Step 2: Process feeds
      console.log("Processing feeds...");
      const processingResult = await this.feedProcessingStep.execute(
        batchResults,
        onProgress,
        onError,
      );

      // Step 3: Scrape content
      console.log("Scraping content...");
      const scrapingResult = await this.contentScrapingStep.execute(
        batchResults,
        onProgress,
        onError,
      );

      // Step 4: Translate content
      console.log("Translating content...");
      const translationResult = await this.contentTranslationStep.execute(
        batchResults,
        onProgress,
        onError,
      );

      return {
        message: "Batch processing completed",
        results: batchResults,
        summary: {
          processedFeeds: collectionResult.processedFeeds,
          successfulFeeds: collectionResult.successfulFeeds,
          failedFeeds: collectionResult.failedFeeds,
        },
        processingTime: Date.now() - startTime,
        batchId,
        newArticlesCount: processingResult.processedArticles,
        updatedArticlesCount: 0,
      };
    } catch (error) {
      console.error("Error in batch processing:", error);
      onError?.(
        "batch",
        error instanceof Error ? error : new Error("Unknown error"),
      );
      throw error;
    }
  }
}
