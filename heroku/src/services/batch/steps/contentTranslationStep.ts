// src/services/batch/steps/contentTranslationStep.ts
import { BatchResults } from "../../../types/batch";
import { ContentTranslator } from "../../content/translator";
import { ArticleRepository } from "../../../repositories/article.repository";
import { StepProcessor, StepResult } from "./stepProcessor.types";
import { TranslationRepository } from "../../../repositories/translation.repository";

export class ContentTranslationStep implements StepProcessor {
  private readonly translationRepository: TranslationRepository;
  private readonly API_DELAY_MS = 100; // 0.1 second between requests

  constructor(
    private readonly contentTranslator: ContentTranslator,
    private readonly articleRepository: ArticleRepository,
    private readonly batchSize: number
  ) {
    this.translationRepository = new TranslationRepository();
  }
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async execute(
    results: BatchResults,
    onProgress?: (stage: string, count: number) => void,
    onError?: (stage: string, error: Error, itemId?: string) => void
  ): Promise<StepResult> {
    try {
      console.info("Starting ContentTranslationStep execution");

    // Find articles that need translation
    const articlesResponse = await this.translationRepository.findArticlesForTranslation(this.batchSize);

    // Get pending translations regardless of new articles
    const pendingResponse = await this.translationRepository.getPendingTranslations(this.batchSize);
    console.log("Pending translations", pendingResponse);

    // If no new articles and no pending translations, return early
    if ((!articlesResponse.success || !articlesResponse.data?.length) && 
        (!pendingResponse.success || !pendingResponse.data?.length)) {
      return {
        translatedArticles: 0,
        failedTranslations: 0,
        totalArticles: 0
      };
    }

    // Create translation tasks for new articles if any
    if (articlesResponse.success && articlesResponse.data?.length) {
      const createTasksResponse = await this.translationRepository.createTranslationTasks(articlesResponse.data);
      if (!createTasksResponse.success) {
        console.error("Failed to create translation tasks:", createTasksResponse.error);
        throw new Error(createTasksResponse.error);
      }
    }

    // If no pending translations after creating tasks, return
    if (!pendingResponse.success || !pendingResponse.data?.length) {
      console.warn("No pending translations found");
      return {
        translatedArticles: 0,
        failedTranslations: 0,
        totalArticles: 0
      };
    }

      // Process translations in parallel
      const translationPromises = pendingResponse.data.map(async (pending) => {
        try {
          // Update status to processing
          await this.translationRepository.updateTranslationStatus(
            pending.translation_id,
            'processing'
          );

          // Translate content
          const translateResult = await this.contentTranslator.translate(
            pending.original_title,
            pending.original_content,
            pending.source_language,
            pending.target_language
          );

          if (!translateResult.success || !translateResult.data) {
            throw new Error(translateResult.error || 'Translation failed');
          }

          // Save translation
          const saveResult = await this.translationRepository.saveTranslation(
            pending.article_id,
            {
              title: translateResult.data.title,
              content: translateResult.data.translation,
              key_points: translateResult.data.key_points,
              summary: translateResult.data.summary,
              target_language: pending.target_language
            }
          );

          if (!saveResult.success) {
            throw new Error(saveResult.error || 'Failed to save translation');
          }

          results.translation.success++;
          onProgress?.('translate', results.translation.success);
          await this.delay(this.API_DELAY_MS);
          return true;
        } catch (error) {
          console.error(`Error processing translation ID: ${pending.translation_id}`, error);
          results.translation.failed++;
          await this.translationRepository.updateTranslationStatus(
            pending.translation_id,
            'failed',
            error instanceof Error ? error.message : 'Unknown error'
          );
          onError?.(
            'translation',
            error instanceof Error ? error : new Error('Unknown error'),
            pending.translation_id
          );
          return false;
        }
      });

      // Wait for all translations to complete
      const translationResults = await Promise.all(translationPromises);

      return {
        translatedArticles: translationResults.filter(Boolean).length,
        failedTranslations: translationResults.filter(r => !r).length,
        totalArticles: pendingResponse.data.length
      };
    } catch (error) {
      console.error("Error in ContentTranslationStep execution", error);
      onError?.(
        'translation_step',
        error instanceof Error ? error : new Error('Unknown error in translation step')
      );
      return {
        translatedArticles: 0,
        failedTranslations: 1,
        totalArticles: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}