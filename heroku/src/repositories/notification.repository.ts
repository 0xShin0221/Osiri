import { BaseRepository } from "./base.repository";
import type { Database } from "../types/database.types";
import type { ServiceResponse } from "../types/models";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];
type InsertNotificationLog =
  Database["public"]["Tables"]["notification_logs"]["Insert"];

type CreatePendingResult = {
  processedCount: number;
  insertedCount: number;
  skippedCount: number;
  newNotifications: NotificationLog[];
};
export class NotificationRepository extends BaseRepository {
  private readonly channelsTable = "notification_channels";
  private readonly logsTable = "notification_logs";
  private readonly connectionsTable = "workspace_connections";

  async getActiveChannels(): Promise<
    ServiceResponse<
      Database["public"]["Tables"]["notification_channels"]["Row"][]
    >
  > {
    try {
      const { data, error } = await this.client
        .from(this.channelsTable)
        .select()
        .eq("is_active", true);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getChannelById(
    channelId: string,
  ): Promise<
    ServiceResponse<
      Database["public"]["Tables"]["notification_channels"]["Row"]
    >
  > {
    try {
      const { data, error } = await this.client
        .from(this.channelsTable)
        .select()
        .eq("id", channelId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getWorkspaceConnection(
    connectionId: string,
  ): Promise<
    ServiceResponse<
      Database["public"]["Tables"]["workspace_connections"]["Row"]
    >
  > {
    try {
      console.log("getWorkspaceConnection", connectionId);
      const { data, error } = await this.client
        .from(this.connectionsTable)
        .select()
        .eq("id", connectionId)
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async logNotification(
    channelId: string,
    status: Database["public"]["Enums"]["notification_status"],
    recipient: string,
    error?: string,
  ): Promise<ServiceResponse<void>> {
    try {
      const { error: insertError } = await this.client
        .from(this.logsTable)
        .insert({
          channel_id: channelId,
          status,
          recipient,
          error,
          platform: "slack",
        });

      if (insertError) throw insertError;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getChannelsForFeed(
    feedId: string,
  ): Promise<
    ServiceResponse<
      Database["public"]["Tables"]["notification_channels"]["Row"][]
    >
  > {
    try {
      const { data, error } = await this.client
        .from("notification_channels")
        .select(`
          *,
          notification_channel_feeds!inner (
            feed_id
          )
        `)
        .eq("notification_channel_feeds.feed_id", feedId)
        .eq("is_active", true)
        .eq("platform", "slack");

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async createPendingNotifications(): Promise<
    ServiceResponse<CreatePendingResult>
  > {
    try {
      // 1. Get completed translations
      const query = this.client
        .from("translations")
        .select("article_id")
        .eq("status", "completed");

      const { data: translations, error: translationsError } = await query;
      if (translationsError) throw translationsError;

      if (!translations?.length) {
        return {
          success: true,
          data: {
            processedCount: 0,
            insertedCount: 0,
            skippedCount: 0,
            newNotifications: [],
          },
        };
      }

      // 2. Get article_id that is not yet registered in notification_logs
      const logsQuery = this.client
        .from("notification_logs")
        .select("article_id")
        .in("article_id", translations.map((t) => t.article_id));

      const { data: existingLogs, error: logsError } = await logsQuery;
      if (logsError) throw logsError;

      const existingArticleIds = new Set(
        existingLogs?.map((log) => log.article_id),
      );
      const newArticleIds = translations
        .map((t) => t.article_id)
        .filter((id) => !existingArticleIds.has(id));

      if (!newArticleIds.length) {
        return {
          success: true,
          data: {
            processedCount: translations.length,
            insertedCount: 0,
            skippedCount: translations.length,
            newNotifications: [],
          },
        };
      }

      const insertData: InsertNotificationLog[] = newArticleIds.map(
        (articleId) => ({
          article_id: articleId,
          status: "pending",
          recipient: "",
        }),
      );

      const { data: insertedData, error: insertError } = await this.client
        .from("notification_logs")
        .insert(insertData)
        .select();

      if (insertError) throw insertError;

      console.log("[NotificationRepository] Created pending notifications:", {
        totalProcessed: translations.length,
        totalInserted: insertedData?.length || 0,
        totalSkipped: translations.length - (insertedData?.length || 0),
        newNotificationIds: insertedData?.map((n) => n.id) || [],
      });

      return {
        success: true,
        data: {
          processedCount: translations.length,
          insertedCount: insertedData?.length || 0,
          skippedCount: translations.length - (insertedData?.length || 0),
          newNotifications: insertedData || [],
        },
      };
    } catch (error) {
      console.error(
        "[NotificationRepository] Error creating pending notifications:",
        error,
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
  async getTranslation(
    articleId: string,
    targetLanguage: Database["public"]["Enums"]["feed_language"],
  ): Promise<
    ServiceResponse<Database["public"]["Tables"]["translations"]["Row"]>
  > {
    try {
      console.log("getTranslation", { articleId, targetLanguage });
      const { data, error } = await this.client
        .from("translations")
        .select()
        .eq("article_id", articleId)
        .eq("target_language", targetLanguage)
        .eq("status", "completed")
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getActiveChannelsFromArticleId(
    articleId: string,
  ): Promise<
    ServiceResponse<
      Database["public"]["Tables"]["notification_channels"]["Row"][]
    >
  > {
    try {
      // First get the feed_id from the article
      const { data: article, error: articleError } = await this.client
        .from("articles")
        .select("feed_id")
        .eq("id", articleId)
        .single();

      if (articleError || !article) {
        throw articleError || new Error("Article not found");
      }
      console.log("Got article's feed_id", article.feed_id);

      // First get the channel_ids from notification_channel_feeds
      const { data: channelFeeds, error: feedsError } = await this.client
        .from("notification_channel_feeds")
        .select("channel_id")
        .eq("feed_id", article.feed_id);

      if (feedsError) throw feedsError;

      if (!channelFeeds?.length) {
        console.log("No channel feeds found for feed_id", article.feed_id);
        return { success: true, data: [] };
      }

      const channelIds = channelFeeds.map((cf) => cf.channel_id).filter(
        Boolean,
      );

      // Then get the active channels
      const { data: channels, error: channelsError } = await this.client
        .from("notification_channels")
        .select("*")
        .in("id", channelIds)
        .eq("is_active", true);

      if (channelsError) throw channelsError;

      return { success: true, data: channels || [] };
    } catch (error) {
      console.error("Error in getActiveChannelsFromArticleId:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async updateNotificationStatus(
    id: string,
    status: Database["public"]["Enums"]["notification_status"],
    recipient: string,
    error?: string,
  ): Promise<ServiceResponse<void>> {
    try {
      const { error: updateError } = await this.client
        .from("notification_logs")
        .update({
          status,
          recipient,
          error,
          updated_at: new Date().toISOString(),
        })
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
  async getArticle(
    articleId: string,
  ): Promise<ServiceResponse<Database["public"]["Tables"]["articles"]["Row"]>> {
    try {
      const { data, error } = await this.client
        .from("articles")
        .select()
        .eq("id", articleId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
