import { BatchResults } from "../../../types/batch";
import { FeedProcessor } from "../../feed/feedProcessor";
import { FeedParser } from "../../feed/parser";
import { FeedRepository } from "../../../repositories/feed.repository";
import { FeedProcessingStepResult, StepProcessor} from "./stepProcessor.types";

export class FeedProcessingStep implements StepProcessor {
  constructor(
    private readonly feedProcessor: FeedProcessor,
    private readonly feedParser: FeedParser,
    private readonly feedRepository: FeedRepository,
    private readonly batchSize: number
  ) {}

  async execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void
  ): Promise<FeedProcessingStepResult> {
    let processedCount = 0;
    let failedCount = 0;

    const activeFeeds = await this.feedRepository.getActiveBatch(this.batchSize);
    
    for (const feed of activeFeeds) {
      try {
        const rssItems = await this.feedParser.parse(feed.url);
        const processResult = await this.feedProcessor.process(feed.id, rssItems);

        if (processResult.success) {
          processedCount += processResult.itemsProcessed;
          results.processing.success += processResult.itemsProcessed;
          onProgress?.('article', results.processing.success);
        } else {
          failedCount++;
          results.processing.failed++;
          onError?.('article_process', new Error(processResult.error || 'Processing failed'), feed.id);
        }

        await this.feedRepository.updateLastFetched(feed.id);
      } catch (error) {
        failedCount++;
        results.processing.failed++;
        onError?.('feed_process', error instanceof Error ? error : new Error('Unknown error'), feed.id);
      }
    }

    return {
      processedArticles: processedCount,
      failedArticles: failedCount
    };
  }
}