import { Article } from "./models";

export interface BatchResults {
    collection: { success: number; failed: number };
    processing: { success: number; failed: number };
    scraping: { success: number; failed: number };
    translation: { success: number; failed: number };
  }
  
  export interface CollectionResult {
    newArticles: Article[];
    updatedArticles: Article[];
    skippedArticles: Article[];
    errors: Error[];
  }
  
  export interface BatchOptions {
    forceFetch?: boolean;
    batchSize?: number;
    retryCount?: number;
    onProgress?: (stage: string, count: number) => void;
    onError?: (stage: string, error: Error, itemId?: string) => void;
  }
  export interface BatchProcessResult {
    message: string;
    results: BatchResults;
    summary: {
      processedFeeds: number;
      successfulFeeds: number;
      failedFeeds: number;
    };
    processingTime?: number;
    batchId?: string;
    newArticlesCount?: number;
    updatedArticlesCount?: number;
  }