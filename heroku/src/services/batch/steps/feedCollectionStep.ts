import type { BatchResults } from "../../../types/batch";
import type { FeedCollector } from "../../feed/collector";
import type { FeedCollectionStepResult, StepProcessor} from "./stepProcessor.types";

export class FeedCollectionStep implements StepProcessor {
  constructor(private readonly feedCollector: FeedCollector) {}

  async execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void
  ): Promise<FeedCollectionStepResult> {
    const collectionResponse = await this.feedCollector.collectFeeds();
    
    if (!collectionResponse.success || !collectionResponse.data) {
      return {
        processedFeeds: 0,
        successfulFeeds: 0,
        failedFeeds: 0,
        error: collectionResponse.error || 'Feed collection failed'
      };
    }

    const collectedFeeds = collectionResponse.data;
    results.collection.success = collectedFeeds.successCount;
    results.collection.failed = collectedFeeds.failedFeeds.length;
    onProgress?.('feed', results.collection.success);

    return {
      processedFeeds: collectedFeeds.processedFeeds,
      successfulFeeds: collectedFeeds.successCount,
      failedFeeds: collectedFeeds.failedFeeds.length
    };
  }
}