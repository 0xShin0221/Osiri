import { BaseRepository } from "./base.repository";
import type { Database } from "../types/database.types";
import type { ServiceResponse } from "../types/models";
import type { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import type { QueryData, SupabaseClient } from "@supabase/supabase-js";
type TranslationWithArticle =
  & Database["public"]["Tables"]["translations"]["Row"]
  & {
    articles:
      | Pick<
        Database["public"]["Tables"]["articles"]["Row"],
        "id" | "title" | "content" | "url" | "feed_id"
      >
      | null;
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

  async getUnsentArticles() {
    try {
      const query = this.client
        .from("translations")
        .select()
        .eq("status", "completed")
        .limit(3);

      type Translations = QueryData<typeof query>;
      const { data, error } = await query;

      if (error) throw error;
      return {
        success: true,
        data: (data || []) as Translations,
      };
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
}
