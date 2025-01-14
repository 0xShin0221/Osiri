import type { BatchResults } from "../../../types/batch";
import type { ContentTranslator } from "../../content/translator";
import type { ArticleRepository } from "../../../repositories/article.repository";
import type { StepProcessor, StepResult } from "./stepProcessor.types";
import { TranslationRepository } from "../../../repositories/translation.repository";
import type { FeedLanguage, TranslationStatus } from "../../../types/models";

export class ContentTranslationStep implements StepProcessor {
  private readonly translationRepository: TranslationRepository;
  private readonly API_DELAY_MS = 100; // 0.1 second between requests
  private readonly MAX_CONCURRENT_TRANSLATIONS = 3;

  constructor(
    private readonly contentTranslator: ContentTranslator,
    private readonly articleRepository: ArticleRepository,
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

  private async processInParallel<T>(
    items: T[],
    processor: (item: T) => Promise<boolean>,
  ): Promise<boolean[]> {
    const results: boolean[] = [];
    const queue = [...items];
    const active = new Set<Promise<void>>();

    while (queue.length > 0 || active.size > 0) {
      // Add new processes up to the concurrent limit
      while (
        active.size < this.MAX_CONCURRENT_TRANSLATIONS && queue.length > 0
      ) {
        const item = queue.shift()!;
        const promise = (async () => {
          const result = await processor(item);
          results.push(result);
        })();

        active.add(promise);
        // Cleanup promise from active set upon completion
        promise.then(() => active.delete(promise));
      }

      // Wait for at least one active process to complete
      if (active.size > 0) {
        await Promise.race(active);
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
    try {
      await this.updateTranslationStatus(pending.translation_id, "processing");
      const translateResult = await this.performTranslation(pending);
      await this.saveTranslationResult(
        pending.article_id,
        translateResult,
        pending.target_language,
      );

      results.translation.success++;
      onProgress?.("translate", results.translation.success);
      await this.delay(this.API_DELAY_MS);
      return true;
    } catch (error) {
      return this.handleTranslationError(
        error,
        pending.translation_id,
        results,
        onError,
      );
    }
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

    return translateResult;
  }

  private async saveTranslationResult(
    articleId: string,
    translateResult: any,
    targetLanguage: FeedLanguage,
  ): Promise<void> {
    const saveResult = await this.translationRepository.saveTranslation(
      articleId,
      {
        title: translateResult.data.title,
        content: translateResult.data.translation,
        key_points: translateResult.data.key_points,
        summary: translateResult.data.summary,
        target_language: targetLanguage,
      },
    );

    if (!saveResult.success) {
      throw new Error(saveResult.error || "Failed to save translation");
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
