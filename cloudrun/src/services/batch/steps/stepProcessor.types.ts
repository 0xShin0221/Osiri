import { BatchResults } from "../../../types/batch";

export interface StepResult {
  [key: string]: number | string | undefined;
  error?: string;
}

export interface StepProcessor {
  execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void
  ): Promise<StepResult>;
}

// Update ContentScrapingStep return types
export interface ScrapingStepResult extends StepResult {
  scrapedArticles: number;
  failedScrapes: number;
  totalArticles: number;
  error?: string;
}

// Update FeedCollectionStepResult
export interface FeedCollectionStepResult extends StepResult {
  processedFeeds: number;
  successfulFeeds: number;
  failedFeeds: number;
  error?: string;
}

// Update FeedProcessingStepResult
export interface FeedProcessingStepResult extends StepResult {
  processedArticles: number;
  failedArticles: number;
  error?: string;
}