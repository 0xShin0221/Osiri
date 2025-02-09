import type { BatchResults } from "../../../types/batch";
import type { ContentTranslator } from "../../content/translator";
import type { StepProcessor, StepResult } from "./stepProcessor.types";
import { TranslationRepository } from "../../../repositories/translation.repository";
import type { FeedLanguage, TranslationStatus } from "../../../types/models";

export class ContentTranslationStep implements StepProcessor {
  private readonly translationRepository: TranslationRepository;
  // Increased delay to prevent rate limits while still maintaining good throughput
  private readonly API_DELAY_MS = 250; // 0.25 second between requests
  // Adjusted for GPT-4o-mini's performance characteristics
  private readonly MAX_CONCURRENT_TRANSLATIONS = 4;
  // Add backoff for retries
  private readonly INITIAL_RETRY_DELAY = 1000; // 1 second
  private readonly MAX_RETRY_DELAY = 8000; // 8 seconds
  private readonly MAX_RETRIES = 3;

  constructor(
    private readonly contentTranslator: ContentTranslator,
    private readonly batchSize: number,
  ) {
    this.translationRepository = new TranslationRepository();
  }

  async execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void,
  ): Promise<StepResult> {
    try {
      console.info("Starting ContentTranslationStep execution");

      const { articlesResponse, pendingResponse } = await this
        .fetchTranslationData();

      // Early return if no work to do
      if (this.shouldReturnEarly(articlesResponse, pendingResponse)) {
        return this.createEmptyResult();
      }

      // Create translation tasks for new articles if any
      if (articlesResponse.success && articlesResponse.data?.length) {
        await this.createTranslationTasks(articlesResponse.data);
      }

      // Return if no pending translations after task creation
      if (!pendingResponse.success || !pendingResponse.data?.length) {
        console.warn("No pending translations found");
        return this.createEmptyResult();
      }

      // Execute translations with controlled parallelism
      const translationResults = await this.processInParallel(
        pendingResponse.data,
        async (pending) =>
          this.processTranslation(pending, results, onProgress, onError),
      );

      return {
        translatedArticles: translationResults.filter(Boolean).length,
        failedTranslations: translationResults.filter((r) => !r).length,
        totalArticles: pendingResponse.data.length,
      };
    } catch (error) {
      return this.handleExecutionError(error, onError);
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchTranslationData() {
    const articlesResponse = await this.translationRepository
      .findArticlesForTranslation(this.batchSize);
    const pendingResponse = await this.translationRepository
      .getPendingTranslations(this.batchSize);
    console.log("Pending translations", pendingResponse);
    return { articlesResponse, pendingResponse };
  }

  private shouldReturnEarly(
    articlesResponse: any,
    pendingResponse: any,
  ): boolean {
    return (!articlesResponse.success || !articlesResponse.data?.length) &&
      (!pendingResponse.success || !pendingResponse.data?.length);
  }

  private createEmptyResult(): StepResult {
    return {
      translatedArticles: 0,
      failedTranslations: 0,
      totalArticles: 0,
    };
  }

  private async createTranslationTasks(articles: any[]): Promise<void> {
    const createTasksResponse = await this.translationRepository
      .createTranslationTasks(articles);
    if (!createTasksResponse.success) {
      console.error(
        "Failed to create translation tasks:",
        createTasksResponse.error,
      );
      throw new Error(createTasksResponse.error);
    }
  }
  private async exponentialBackoffDelay(attempt: number): Promise<void> {
    const delay = Math.min(
      this.INITIAL_RETRY_DELAY * 2 ** attempt,
      this.MAX_RETRY_DELAY,
    );
    await this.delay(delay);
  }

  private async processInParallel<T>(
    items: T[],
    processor: (item: T) => Promise<boolean>,
  ): Promise<boolean[]> {
    const results: boolean[] = [];
    const queue = [...items];
    const active = new Set<Promise<void>>();
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;

    while (queue.length > 0 || active.size > 0) {
      // Dynamically adjust concurrency based on error rate
      const currentMaxConcurrent = consecutiveErrors > 0
        ? Math.max(1, this.MAX_CONCURRENT_TRANSLATIONS - consecutiveErrors)
        : this.MAX_CONCURRENT_TRANSLATIONS;

      while (
        active.size < currentMaxConcurrent && queue.length > 0
      ) {
        const item = queue.shift();
        if (!item) continue;

        const promise = (async () => {
          try {
            const result = await processor(item);
            if (result) {
              consecutiveErrors = 0; // Reset on success
            } else {
              consecutiveErrors++;
            }
            results.push(result);
          } catch (error) {
            consecutiveErrors++;
            results.push(false);
            console.error("Error in parallel processing:", error);
          }
        })();

        active.add(promise);
        promise.then(() => active.delete(promise));

        // If too many consecutive errors, add delay
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          await this.exponentialBackoffDelay(
            consecutiveErrors - MAX_CONSECUTIVE_ERRORS,
          );
          consecutiveErrors = 0; // Reset after backoff
        }
      }

      if (active.size > 0) {
        await Promise.race(active);
        await this.delay(this.API_DELAY_MS);
      }
    }

    return results;
  }

  private async processTranslation(
    pending: any,
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void,
  ): Promise<boolean> {
    let retryCount = 0;

    while (retryCount < this.MAX_RETRIES) {
      try {
        await this.updateTranslationStatus(
          pending.translation_id,
          "processing",
        );

        const translateResult = await this.performTranslation(pending);
        await this.saveTranslationResult(
          pending.article_id,
          translateResult,
          pending.target_language,
        );

        results.translation.success++;
        onProgress?.("translate", results.translation.success);
        return true;
      } catch (error) {
        retryCount++;

        if (retryCount < this.MAX_RETRIES) {
          await this.exponentialBackoffDelay(retryCount);
          console.warn(
            `Retrying translation ${pending.translation_id}, attempt ${
              retryCount + 1
            }`,
          );
          continue;
        }

        return this.handleTranslationError(
          error,
          pending.translation_id,
          results,
          onError,
        );
      }
    }

    return false;
  }
  private async updateTranslationStatus(
    translationId: string,
    status: TranslationStatus,
    error?: string,
  ): Promise<void> {
    await this.translationRepository.updateTranslationStatus(
      translationId,
      status,
      error,
    );
  }

  private async performTranslation(pending: any) {
    const translateResult = await this.contentTranslator.translate(
      pending.original_title,
      pending.original_content,
      pending.source_language,
      pending.target_language,
    );

    if (!translateResult.success || !translateResult.data) {
      throw new Error(translateResult.error || "Translation failed");
    }

    return translateResult.data;
  }

  private async saveTranslationResult(
    articleId: string,
    translateResult: {
      titleTranslated: string;
      titleOriginal: string;
      translation: string;
      key_points: string[];
      summary: string;
    },
    targetLanguage: FeedLanguage,
  ): Promise<void> {
    const saveResult = await this.translationRepository.saveTranslation(
      articleId,
      {
        title: translateResult.titleTranslated + " - " +
          translateResult.titleOriginal,
        content: translateResult.translation,
        key_points: translateResult.key_points,
        summary: translateResult.summary,
        target_language: targetLanguage,
      },
    );

    if (!saveResult.success) {
      throw new Error(
        `Failed to save translation for article ${articleId}: ${
          saveResult.error || "Unknown error"
        }`,
      );
    }
  }

  private async handleTranslationError(
    error: any,
    translationId: string,
    results: BatchResults,
    onError?: (stage: string, error: Error, itemId?: string) => void,
  ): Promise<false> {
    console.error(`Error processing translation ID: ${translationId}`, error);
    results.translation.failed++;

    await this.updateTranslationStatus(
      translationId,
      "failed",
      error instanceof Error ? error.message : "Unknown error",
    );

    onError?.(
      "translation",
      error instanceof Error ? error : new Error("Unknown error"),
      translationId,
    );

    return false;
  }

  private handleExecutionError(
    error: any,
    onError?: (stage: string, error: Error, itemId?: string) => void,
  ): StepResult {
    console.error("Error in ContentTranslationStep execution", error);
    onError?.(
      "translation_step",
      error instanceof Error
        ? error
        : new Error("Unknown error in translation step"),
    );
    return {
      translatedArticles: 0,
      failedTranslations: 1,
      totalArticles: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
