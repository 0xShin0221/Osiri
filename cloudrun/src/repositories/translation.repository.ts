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
    limit = 50,
  ): Promise<ServiceResponse<ArticleForTranslation[]>> {
    try {
      // Execute direct SQL query instead of RPC
      const { data, error } = await this.client
        .from("articles")
        .select(`
          id,
          title,
          content,
          feed:rss_feeds(language)
        `)
        .eq("scraping_status", "completed")
        .not("content", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.log("Error fetching articles for translation", error);
        throw error;
      }
      console.log("Fetched articles for translation", data);

      // Map the results to the expected format
      const articles = data?.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        source_language: article.feed.language,
      })) || [];
      return { success: true, data: articles as ArticleForTranslation[] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async createTranslationTasks(
    articleIds: string[],
  ): Promise<ServiceResponse<void>> {
    try {
      console.log(
        `[TranslationService] Starting translation tasks for ${articleIds.length} articles: ${
          articleIds.slice(0, 3).join(", ")
        }${articleIds.length > 3 ? "..." : ""}`,
      );

      // Step 1: Get articles with their source language
      const { data: articles, error: articlesError } = await this.client
        .from("articles")
        .select(`
      id,
      rss_feeds!inner (
        id,
        language
      )
    `)
        .in("id", articleIds);

      if (articlesError) {
        console.error(
          `[TranslationService] Error fetching articles: ${articlesError.message}`,
        );
        throw articlesError;
      }

      if (!articles || articles.length === 0) {
        console.log(
          `[TranslationService] No articles found for IDs: ${
            articleIds.join(", ")
          }`,
        );
        return { success: true }; // No articles to process
      }

      console.log(
        `[TranslationService] Found ${articles.length} articles to process`,
      );

      // Step 2: Get notification channels for these articles
      const feedIds = articles.map((article) => article.rss_feeds.id);
      console.log(
        `[TranslationService] Fetching notification channels for feed IDs: ${
          feedIds.slice(0, 3).join(", ")
        }${feedIds.length > 3 ? "..." : ""}`,
      );

      const { data: channelFeeds, error: channelError } = await this.client
        .from("notification_channel_feeds")
        .select(`
      feed_id,
      channel_id,
      notification_channels!inner (
        id,
        notification_language,
        is_active
      )
    `)
        .in("feed_id", feedIds);

      if (channelError) {
        console.error(
          `[TranslationService] Error fetching notification channels: ${channelError.message}`,
        );
        throw channelError;
      }

      console.log(
        `[TranslationService] Found ${channelFeeds.length} channel-feed relations`,
      );

      // Map feed_id to active notification languages
      const feedLanguageMap = new Map<string, Set<FeedLanguage>>();

      for (const cf of channelFeeds) {
        const channel = cf.notification_channels;
        if (channel?.is_active) {
          const feedId = cf.feed_id;
          if (feedId) {
            // Get or create target language set for this feed
            if (!feedLanguageMap.has(feedId)) {
              feedLanguageMap.set(feedId, new Set<FeedLanguage>());
            }
            feedLanguageMap.get(feedId)?.add(channel.notification_language);
          }
        }
      }

      console.log(
        `[TranslationService] Created language map for ${feedLanguageMap.size} feeds`,
      );

      // Debug log for language mappings
      feedLanguageMap.forEach((languages, feedId) => {
        console.log(
          `[TranslationService] Feed ${feedId} requires translations to: ${
            Array.from(languages).join(", ")
          }`,
        );
      });

      // Prepare translation tasks
      const translationTasks: TranslationInsert[] = [];
      const now = new Date().toISOString();

      // Process each article
      for (const article of articles) {
        const sourceLanguage = article.rss_feeds.language;
        const feedId = article.rss_feeds.id;
        const targetLanguageSet = feedLanguageMap.get(feedId) ||
          new Set<FeedLanguage>();

        console.log(
          `[TranslationService] Article ${article.id} from feed ${feedId} (source: ${sourceLanguage}) needs translation to ${
            Array.from(targetLanguageSet).length
          } languages`,
        );

        // Create translation tasks for target languages different from source
        for (const targetLang of targetLanguageSet) {
          if (targetLang !== sourceLanguage) {
            translationTasks.push({
              article_id: article.id,
              target_language: targetLang,
              status: "pending",
              attempt_count: 0,
              created_at: now,
              updated_at: now,
            });
            console.log(
              `[TranslationService] Created task: Article ${article.id} → ${targetLang}`,
            );
          } else {
            console.log(
              `[TranslationService] Skipping translation for article ${article.id} to ${targetLang} (same as source)`,
            );
          }
        }
      }

      // Insert tasks if any exist
      if (translationTasks.length > 0) {
        console.log(
          `[TranslationService] Inserting ${translationTasks.length} translation tasks to database`,
        );

        const { error: insertError } = await this.client
          .from(this.table)
          .upsert(translationTasks, {
            onConflict: "article_id,target_language",
            ignoreDuplicates: true,
          });

        if (insertError) {
          console.error(
            `[TranslationService] Error inserting translation tasks: ${insertError.message}`,
          );
          throw insertError;
        }

        console.log(
          `[TranslationService] Successfully created ${translationTasks.length} translation tasks for ${articleIds.length} articles`,
        );
      } else {
        console.log(
          `[TranslationService] No translation tasks needed for ${articleIds.length} articles - either all languages match source or no channels configured`,
        );
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Unknown error";
      console.error(
        `[TranslationService] Error creating translation tasks: ${errorMessage}`,
        error,
      );
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getPendingTranslations(
    limit = 50,
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
