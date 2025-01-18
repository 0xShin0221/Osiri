import { BaseRepository } from "./base.repository";
import type {
  ArticleForTranslation,
  FeedLanguage,
  ServiceResponse,
  Translation,
  TranslationInsert,
  TranslationStatus,
  TranslationUpdate,
} from "../types/models";

export interface PendingTranslation {
  translation_id: string;
  article_id: string;
  target_language: FeedLanguage;
  original_content: string;
  original_title: string;
  source_language: FeedLanguage;
}

export class TranslationRepository extends BaseRepository {
  private readonly table = "translations";

  async findArticlesForTranslation(
    limit: number = 50,
  ): Promise<ServiceResponse<ArticleForTranslation[]>> {
    try {
      const { data, error } = await this.client
        .rpc("get_articles_for_translation", {
          max_articles: limit,
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async createTranslationTasks(
    articles: ArticleForTranslation[],
  ): Promise<ServiceResponse<void>> {
    try {
      const articleIds = articles.map((article) => article.id);

      const { error } = await this.client
        .rpc("create_smart_translation_tasks_with_logging", {
          p_article_ids: articleIds,
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getPendingTranslations(
    limit: number = 50,
  ): Promise<ServiceResponse<PendingTranslation[]>> {
    try {
      const { data, error } = await this.client
        .from("pending_translations")
        .select()
        .limit(limit);
      if (error) throw error;
      return {
        success: true,
        data: data?.map((item) => ({
          translation_id: item.translation_id!,
          article_id: item.article_id!,
          target_language: item.target_language!,
          original_content: item.original_content!,
          original_title: item.original_title!,
          source_language: item.source_language!,
        })) ?? [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async saveTranslation(
    articleId: string,
    translation: {
      title: string;
      content: string;
      key_points: string[];
      summary: string;
      target_language: FeedLanguage;
    },
  ): Promise<ServiceResponse<Translation>> {
    try {
      // First, try to update existing translation if it exists
      const { data: existingTranslation, error: fetchError } = await this.client
        .from(this.table)
        .select()
        .eq("article_id", articleId)
        .eq("target_language", translation.target_language)
        .single();

      if (existingTranslation) {
        // Update existing translation
        const { data, error } = await this.client
          .from(this.table)
          .update({
            title: translation.title,
            content: translation.content,
            key_point1: translation.key_points[0] ?? null,
            key_point2: translation.key_points[1] ?? null,
            key_point3: translation.key_points[2] ?? null,
            key_point4: translation.key_points[3] ?? null,
            key_point5: translation.key_points[4] ?? null,
            summary: translation.summary,
            status: "completed",
          })
          .eq("article_id", articleId)
          .eq("target_language", translation.target_language)
          .select()
          .single();

        if (error) {
          console.error("Error updating existing translation", error);
          throw error;
        }

        return { success: true, data };
      }

      // If no existing translation, insert new
      const { data, error } = await this.client
        .from(this.table)
        .insert(
          {
            article_id: articleId,
            title: translation.title,
            content: translation.content,
            key_point1: translation.key_points[0] ?? null,
            key_point2: translation.key_points[1] ?? null,
            key_point3: translation.key_points[2] ?? null,
            key_point4: translation.key_points[3] ?? null,
            key_point5: translation.key_points[4] ?? null,
            summary: translation.summary,
            target_language: translation.target_language,
            status: "completed",
          } satisfies TranslationInsert,
        )
        .select()
        .single();

      if (error) {
        console.error("Error saving translation", error);
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async updateTranslationStatus(
    id: string,
    status: TranslationStatus,
    error?: string,
  ): Promise<ServiceResponse<void>> {
    try {
      const { data: currentTranslation, error: fetchError } = await this.client
        .from(this.table)
        .select("attempt_count")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await this.client
        .from(this.table)
        .update(
          {
            status,
            error,
            attempt_count: (currentTranslation?.attempt_count ?? 0) + 1,
            last_attempt: new Date().toISOString(),
          } satisfies TranslationUpdate,
        )
        .eq("id", id);

      if (updateError) throw updateError;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
