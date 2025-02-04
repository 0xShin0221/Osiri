import { BaseRepository } from "./base.repository";
import type { Database } from "../types/database.types";
import type { ServiceResponse } from "../types/models";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];
type NotificationPlatform =
  Database["public"]["Enums"]["notification_platform"];
type NotificationStatus = Database["public"]["Enums"]["notification_status"];
type NotificationLogInsert =
  Database["public"]["Tables"]["notification_logs"]["Insert"];

type CreatePendingResult = {
  processedCount: number;
  insertedCount: number;
  skippedCount: number;
  newNotifications: NotificationLog[];
};

const DEFAULT_DAILY_LIMIT = 10; // Default limit for free plan

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
      console.log(
        "[NotificationRepository] Starting createPendingNotifications",
      );

      // First get all completed translations
      const { data: translations, error: translationsError } = await this.client
        .from("translations")
        .select(`
          article_id
        `)
        .eq("status", "completed")
        .order("updated_at", { ascending: false })
        .limit(50); // Limit to prevent processing too many at once

      if (translationsError) throw translationsError;

      console.log("[NotificationRepository] Found completed translations:", {
        count: translations?.length || 0,
      });

      if (!translations?.length) {
        return this.createEmptyResult(0);
      }

      // Filter out articles that already have notifications
      const articleIds = translations.map((t) => t.article_id).filter((
        id,
      ): id is string => id !== null);

      // Get existing notifications for these articles
      const { data: existingLogs, error: logsError } = await this.client
        .from(this.logsTable)
        .select("article_id")
        .in("article_id", articleIds);

      if (logsError) throw logsError;

      // Filter out articles that already have notifications
      const existingArticleIds = new Set(
        existingLogs?.map((log) => log.article_id) || [],
      );
      const newArticleIds = articleIds.filter((id) =>
        !existingArticleIds.has(id)
      );

      console.log("[NotificationRepository] Filtered article IDs:", {
        total: articleIds.length,
        existing: existingArticleIds.size,
        new: newArticleIds.length,
      });

      if (newArticleIds.length === 0) {
        return this.createEmptyResult(translations.length);
      }

      // Get articles and their feed IDs
      const { data: articles, error: articlesError } = await this.client
        .from("articles")
        .select("id, feed_id")
        .in("id", newArticleIds);

      if (articlesError) throw articlesError;

      if (!articles?.length) {
        return this.createEmptyResult(translations.length);
      }

      const feedIds = [
        ...new Set(
          articles
            .map((a) => a.feed_id)
            .filter((id): id is string => id !== null),
        ),
      ];

      if (feedIds.length === 0) {
        return this.createEmptyResult(translations.length);
      }

      // Get channels for these feeds
      const { data: channelFeeds, error: channelFeedsError } = await this.client
        .from("notification_channel_feeds")
        .select("channel_id")
        .in("feed_id", feedIds);

      if (channelFeedsError) throw channelFeedsError;

      if (!channelFeeds?.length) {
        return this.createEmptyResult(translations.length);
      }

      const channelIds = [
        ...new Set(
          channelFeeds
            .map((cf) => cf.channel_id)
            .filter((id): id is string => id !== null),
        ),
      ];

      const { data: channels, error: channelsError } = await this.client
        .from("notification_channels")
        .select()
        .in("id", channelIds)
        .eq("is_active", true);

      if (channelsError) throw channelsError;

      if (!channels?.length) {
        return this.createEmptyResult(translations.length);
      }

      console.log("[NotificationRepository] Found active channels:", {
        count: channels.length,
      });

      // Create notifications
      const insertData: NotificationLogInsert[] = [];
      for (const article of articles) {
        for (const channel of channels) {
          if (!channel.organization_id || !channel.is_active) continue;

          insertData.push({
            article_id: article.id,
            channel_id: channel.id,
            platform: channel.platform,
            organization_id: channel.organization_id,
            status: "pending",
            recipient: channel.channel_identifier_id || "",
          });
        }
      }

      if (insertData.length === 0) {
        return this.createEmptyResult(translations.length);
      }

      const { data: insertedData, error: insertError } = await this.client
        .from(this.logsTable)
        .insert(insertData)
        .select();

      if (insertError) throw insertError;

      const result = {
        processedCount: translations.length,
        insertedCount: insertedData?.length || 0,
        skippedCount: translations.length - (insertedData?.length || 0),
        newNotifications: insertedData || [],
      };

      console.log("[NotificationRepository] Created notifications:", {
        processedCount: result.processedCount,
        insertedCount: result.insertedCount,
        skippedCount: result.skippedCount,
      });

      return { success: true, data: result };
    } catch (error) {
      console.error(
        "[NotificationRepository] Error in createPendingNotifications:",
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

      const channelIds = channelFeeds.map((cf) => cf.channel_id).filter((
        id,
      ): id is string => id !== null);
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
    status: NotificationStatus,
    recipient: string,
    error?: string,
    platform?: NotificationPlatform,
    organization_id?: string,
  ): Promise<ServiceResponse<void>> {
    try {
      const updateData: Partial<NotificationLog> = {
        status,
        recipient,
        error,
        updated_at: new Date().toISOString(),
      };

      // Add platform and organization_id if provided (for backward compatibility)
      if (platform) updateData.platform = platform;
      if (organization_id) updateData.organization_id = organization_id;

      const { error: updateError } = await this.client
        .from(this.logsTable)
        .update(updateData)
        .eq("id", id);

      if (updateError) {
        console.error("Error updating notification status:", updateError);
        throw updateError;
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private createEmptyResult(
    totalProcessed: number,
  ): ServiceResponse<CreatePendingResult> {
    return {
      success: true,
      data: {
        processedCount: totalProcessed,
        insertedCount: 0,
        skippedCount: totalProcessed,
        newNotifications: [],
      },
    };
  }

  // Added monitoring methods
  async getMonthlyNotificationStats(
    organizationId: string,
    year: number,
    month: number,
  ): Promise<
    ServiceResponse<{
      total: number;
      successful: number;
      failed: number;
      platforms: Record<NotificationPlatform, number>;
    }>
  > {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const { data, error } = await this.client
        .from(this.logsTable)
        .select("id, status, platform")
        .eq("organization_id", organizationId)
        .gte("created_at", startDate.toISOString())
        .lt("created_at", endDate.toISOString());

      if (error) throw error;

      const stats = {
        total: data.length,
        successful: data.filter((log) => log.status === "success").length,
        failed: data.filter((log) => log.status === "failed").length,
        platforms: data.reduce((acc, log) => {
          acc[log.platform] = (acc[log.platform] || 0) + 1;
          return acc;
        }, {} as Record<NotificationPlatform, number>),
      };

      return { success: true, data: stats };
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

  async createNotificationLog(
    data: NotificationLogInsert,
  ): Promise<ServiceResponse<NotificationLog>> {
    try {
      const { data: existingLogs, error: existingError } = await this.client
        .from(this.logsTable)
        .select()
        .match({
          article_id: data.article_id,
          channel_id: data.channel_id,
          status: "success",
        })
        .maybeSingle();

      if (existingError) throw existingError;

      // If this combination already exists and was successful, skip
      if (existingLogs) {
        console.log(
          "[NotificationRepository] Skipping duplicate notification:",
          {
            articleId: data.article_id,
            channelId: data.channel_id,
            existingLogId: existingLogs.id,
          },
        );
        return {
          success: false,
          error: "Notification already exists and was successful",
        };
      }

      // Create new notification log if no successful one exists
      const { data: result, error: insertError } = await this.client
        .from(this.logsTable)
        .insert(data)
        .select()
        .single();

      if (insertError) throw insertError;

      console.log("[NotificationRepository] Created notification log:", {
        logId: result.id,
        articleId: data.article_id,
        channelId: data.channel_id,
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async updateOrganizationLimitNotification(
    organizationId: string,
  ): Promise<ServiceResponse<void>> {
    try {
      const { error } = await this.client
        .from("organizations")
        .update({
          last_limit_notification_at: new Date().toISOString(),
        })
        .eq("id", organizationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
  async getOrganizationSubscriptionStatus(
    organizationId: string,
  ): Promise<
    ServiceResponse<
      Database["public"]["Views"]["organization_subscription_status"]["Row"]
    >
  > {
    try {
      const { data, error } = await this.client
        .from("organization_subscription_status")
        .select()
        .eq("id", organizationId)
        .single();

      if (data && data.base_notifications_per_day === null) {
        data.base_notifications_per_day = DEFAULT_DAILY_LIMIT;
      }
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getNotificationsUsedToday(organizationId: string): Promise<number> {
    try {
      const { data: org } = await this.client
        .from("organizations")
        .select("notifications_used_this_month, last_usage_reset")
        .eq("id", organizationId)
        .single();

      if (!org) return 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // If the last reset is not today, return 0
      if (!org.last_usage_reset || new Date(org.last_usage_reset) < today) {
        return 0;
      }

      return org.notifications_used_this_month || 0;
    } catch (error) {
      console.error(
        "[NotificationRepository] Error getting notifications count:",
        error,
      );
      return 0;
    }
  }

  async shouldSendLimitNotification(
    organizationId: string,
  ): Promise<ServiceResponse<boolean>> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await this.client
        .from("organizations")
        .select("last_limit_notification_at")
        .eq("id", organizationId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: !data.last_limit_notification_at ||
          new Date(data.last_limit_notification_at) < today,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
  async incrementNotificationCount(organizationId: string): Promise<void> {
    try {
      await this.client.rpc("increment_notification_count", {
        p_organization_id: organizationId,
      });
    } catch (error) {
      console.error("Error incrementing notification count:", error);
    }
  }
}
