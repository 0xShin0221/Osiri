import { chunk } from 'lodash';
import { Article, ServiceResponse } from "../../types/models";
import { BatchOptions, BatchProcessResult, BatchResults } from "../../types/batch";
import { FeedRepository } from '../../repositories/feed.repository';
import { ArticleRepository } from '../../repositories/article.repository';
import { FeedCollector } from '../feed/collector';
import { FeedProcessor } from '../feed/feedProcessor';
import { ContentScraper } from '../content/scraper';
import { ContentTranslator } from '../content/translator';
import { FeedParser } from '../feed/parser';

export class BatchProcessor {
  private readonly feedCollector: FeedCollector;
  private readonly feedProcessor: FeedProcessor;
  private readonly contentScraper: ContentScraper;
  private readonly contentTranslator: ContentTranslator;
  private readonly feedParser: FeedParser;
  private readonly DEFAULT_BATCH_SIZE = 5;

  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly articleRepository: ArticleRepository
  ) {
    this.feedCollector = new FeedCollector(feedRepository, articleRepository);
    this.feedProcessor = new FeedProcessor(articleRepository);
    this.contentScraper = new ContentScraper();
    this.contentTranslator = new ContentTranslator();
    this.feedParser = new FeedParser();
  }

  async process(options: BatchOptions = {}): Promise<BatchProcessResult> {
    const startTime = Date.now();
    const batchId = crypto.randomUUID();
    const {
      forceFetch = false,
      batchSize = this.DEFAULT_BATCH_SIZE,
      onProgress,
      onError
    } = options;

    const batchResults: BatchResults = {
      collection: { success: 0, failed: 0 },
      processing: { success: 0, failed: 0 },
      scraping: { success: 0, failed: 0 },
      translation: { success: 0, failed: 0 },
    };

    try {
      // Step 1: Collect feeds
      console.log('Starting feed collection...');
      const collectionResponse = await this.feedCollector.collectFeeds();
      
      if (!collectionResponse.success || !collectionResponse.data) {
        throw new Error(collectionResponse.error || 'Feed collection failed');
      }

      const collectedFeeds = collectionResponse.data;
      batchResults.collection.success = collectedFeeds.successCount;
      batchResults.collection.failed = collectedFeeds.failedFeeds.length;
      onProgress?.('feed', batchResults.collection.success);

      // Step 2: Process feeds - Parse RSS and save articles
      console.log('Processing feeds...');
      const activeFeeds = await this.feedRepository.getActiveBatch(batchSize);

      for (const feed of activeFeeds) {
        try {
          // Parse RSS feed
          const rssItems = await this.feedParser.parse(feed.url);
          
          // Process articles
          const processResult = await this.feedProcessor.process(feed.id, rssItems);
          if (processResult.success) {
            batchResults.processing.success += processResult.itemsProcessed;
            onProgress?.('article', batchResults.processing.success);
          } else {
            batchResults.processing.failed++;
            onError?.('article_process', new Error(processResult.error || 'Processing failed'), feed.id);
          }

          // Update feed's last fetched timestamp
          await this.feedRepository.updateLastFetched(feed.id);

        } catch (error) {
          console.error(`Error processing feed ${feed.id}:`, error);
          batchResults.processing.failed++;
          onError?.('feed_process', error instanceof Error ? error : new Error('Unknown error'), feed.id);
        }
      }

      // Step 3: Scrape and translate content
      console.log('Processing content...');
      // const unprocessedResponse = await this.articleRepository.getUnprocessedArticles(batchSize);
      // if (unprocessedResponse.success && unprocessedResponse.data) {
      //   const articleChunks = chunk(unprocessedResponse.data, 5);

      //   for (const articles of articleChunks) {
      //     for (const article of articles) {
      //       try {
      //         // Scrape content
      //         const scrapeResult = await this.contentScraper.scrape(article.url);
      //         if (scrapeResult.success && scrapeResult.data) {
      //           await this.articleRepository.updateScrapedContent(
      //             article.id,
      //             scrapeResult.data
      //           );
      //           batchResults.scraping.success++;
      //           onProgress?.('scrape', batchResults.scraping.success);

      //           // Translate content
      //           try {
      //             const translateResult = await this.contentTranslator.translate(
      //               article.id,
      //               scrapeResult.data
      //             );
      //             if (translateResult.success) {
      //               batchResults.translation.success++;
      //               onProgress?.('translate', batchResults.translation.success);
      //             } else {
      //               batchResults.translation.failed++;
      //               onError?.('translation', new Error(translateResult.error || 'Translation failed'), article.id);
      //             }
      //           } catch (error) {
      //             batchResults.translation.failed++;
      //             onError?.('translation', error instanceof Error ? error : new Error('Unknown error'), article.id);
      //           }
      //         } else {
      //           batchResults.scraping.failed++;
      //           onError?.('scraping', new Error(scrapeResult.error || 'Scraping failed'), article.id);
      //         }
      //       } catch (error) {
      //         batchResults.scraping.failed++;
      //         onError?.('scraping', error instanceof Error ? error : new Error('Unknown error'), article.id);
      //       }
      //     }
      //   }
      // }

      return {
        message: 'Batch processing completed',
        results: batchResults,
        summary: {
          processedFeeds: collectedFeeds.processedFeeds,
          successfulFeeds: collectedFeeds.successCount,
          failedFeeds: collectedFeeds.failedFeeds.length,
        },
        processingTime: Date.now() - startTime,
        batchId,
        newArticlesCount: batchResults.processing.success,
        updatedArticlesCount: 0
      };

    } catch (error) {
      console.error('Error in batch processing:', error);
      onError?.('batch', error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    }
  }
}