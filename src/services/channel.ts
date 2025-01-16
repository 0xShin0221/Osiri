import { supabase } from "@/lib/supabase";
import { createPlatform } from "@/services/platforms/platform-factory";
import type { Tables } from "@/types/database.types";

type NotificationChannel = Tables<"notification_channels"> & {
  notification_channel_feeds?: {
    feed_id: string;
  }[];
};

export type NotificationChannelWithFeeds = NotificationChannel & {
  notification_channel_feeds: {
    feed_id: string;
  }[];
};

export class ChannelService {
  private async getChannelById(channelId: string) {
    const { data, error } = await supabase
      .from("notification_channels")
      .select(`
        *,
        notification_channel_feeds (
          feed_id
        )
      `)
      .eq("id", channelId);

    if (error) throw error;
    return data?.[0] || null;
  }

  async getChannels(): Promise<NotificationChannelWithFeeds[]> {
    const { data, error } = await supabase
      .from("notification_channels")
      .select(`
        *,
        notification_channel_feeds (
          feed_id
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateChannel(channel: NotificationChannel) {
    const { notification_channel_feeds, ...updateData } = channel;
    console.log("updateData", updateData);

    const { error } = await supabase
      .from("notification_channels")
      .update(updateData)
      .eq("id", channel.id);

    if (error) throw error;

    const updatedChannel = await this.getChannelById(channel.id);
    if (!updatedChannel) {
      throw new Error("Channel not found after update");
    }
    console.log("updatedChannel", updatedChannel);
    return updatedChannel;
  }

  async createChannel(channel: Partial<NotificationChannelWithFeeds>) {
    if (
      channel.platform && channel.workspace_connection_id &&
      channel.channel_identifier_id
    ) {
      const platform = createPlatform(channel.platform);
      await platform.joinChannel(
        channel.workspace_connection_id,
        channel.channel_identifier_id,
      );
    }

    const notificationLanguage = channel.notification_language || "en";
    const channelData = {
      ...channel,
      notification_language: notificationLanguage,
      workspace_connection_id: channel.platform === "email"
        ? null
        : channel.workspace_connection_id,
      schedule_id: channel.schedule_id || null,
      category_ids: channel.category_ids || [],
      is_active: channel.is_active ?? true,
    };

    const { notification_channel_feeds, ...cleanChannelData } = channelData;

    const { data: newChannel, error } = await supabase
      .from("notification_channels")
      .insert([cleanChannelData])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating channel:", error);
      throw error;
    }

    // If we have feeds to associate, create the relationships and activate feeds
    if (notification_channel_feeds && notification_channel_feeds.length > 0) {
      const feedRelations = notification_channel_feeds.map((feed) => ({
        channel_id: newChannel.id,
        feed_id: feed.feed_id,
      }));

      // Insert feed relations
      const { error: feedError } = await supabase
        .from("notification_channel_feeds")
        .insert(feedRelations);

      if (feedError) {
        console.error("Error adding channel feeds:", feedError);
        throw feedError;
      }

      // Activate feeds that are currently inactive
      const feedIds = notification_channel_feeds.map((feed) => feed.feed_id);
      await this.activateFeeds(feedIds);
    }

    const { data, error: selectError } = await supabase
      .from("notification_channels")
      .select(`
        *,
        notification_channel_feeds (
          feed_id
        )
      `)
      .eq("id", newChannel.id)
      .single();

    if (selectError) throw selectError;
    return data as NotificationChannelWithFeeds;
  }

  async deleteChannel(channelId: string) {
    console.log("channelId", channelId);
    try {
      // Get the channel's feeds before deactivating
      const channel = await this.getChannelById(channelId);
      if (!channel) throw new Error("Channel not found");

      const feedIds =
        channel.notification_channel_feeds?.map((f: { feed_id: string }) =>
          f.feed_id
        ) || [];

      // Deactivate the channel
      const { error } = await supabase
        .from("notification_channels")
        .update({ is_active: false })
        .eq("id", channelId);

      if (error) throw error;

      // Check if feeds should be deactivated
      await this.deactivateUnusedFeeds(feedIds);

      const updatedChannel = await this.getChannelById(channelId);
      if (!updatedChannel) {
        throw new Error("Channel not found after deactivation");
      }

      return updatedChannel;
    } catch (error) {
      console.error("Error deleting channel:", error);
      throw error;
    }
  }
  private async setFeedActiveStatus(feedId: string, isActive: boolean) {
    const { error } = await supabase
      .from("rss_feeds")
      .update({ is_active: isActive })
      .eq("id", feedId);

    if (error) throw error;
  }

  private async isTheFeedUsed(feedId: string): Promise<boolean> {
    const { data: usages, error } = await supabase
      .from("notification_channel_feeds")
      .select("channel_id")
      .eq("feed_id", feedId);

    if (error) throw error;
    return Boolean(usages && usages.length > 0);
  }
  async addFeedToChannel(channelId: string, feedId: string) {
    try {
      // Add feed to channel
      const { error } = await supabase
        .from("notification_channel_feeds")
        .insert({
          channel_id: channelId,
          feed_id: feedId,
        });

      if (error) throw error;

      // Activate the feed
      await this.setFeedActiveStatus(feedId, true);

      const updatedChannel = await this.getChannelById(channelId);
      if (!updatedChannel) {
        throw new Error("Channel not found after adding feed");
      }
      return updatedChannel;
    } catch (error) {
      console.error("Error adding feed to channel:", error);
      throw error;
    }
  }

  async removeFeedFromChannel(channelId: string, feedId: string) {
    try {
      // Remove feed from channel
      const { error } = await supabase
        .from("notification_channel_feeds")
        .delete()
        .eq("channel_id", channelId)
        .eq("feed_id", feedId);

      if (error) throw error;

      // Check if the feed is still used by any channel
      const isFeedUsed = await this.isTheFeedUsed(feedId);

      // If not used anymore, deactivate it
      if (!isFeedUsed) {
        await this.setFeedActiveStatus(feedId, false);
      }

      const updatedChannel = await this.getChannelById(channelId);
      if (!updatedChannel) {
        throw new Error("Channel not found after removing feed");
      }
      return updatedChannel;
    } catch (error) {
      console.error("Error removing feed from channel:", error);
      throw error;
    }
  }
  // Helper method to activate feeds
  private async activateFeeds(feedIds: string[]) {
    if (feedIds.length === 0) return;

    // First check which feeds are inactive
    const { data: inactiveFeeds } = await supabase
      .from("rss_feeds")
      .select("id")
      .in("id", feedIds)
      .eq("is_active", false);

    if (!inactiveFeeds || inactiveFeeds.length === 0) return;

    const inactiveFeedIds = inactiveFeeds.map((f) => f.id);

    const { error } = await supabase
      .from("rss_feeds")
      .update({ is_active: true })
      .in("id", inactiveFeedIds);

    if (error) {
      console.error("Error activating feeds:", error);
      throw error;
    }
  }

  // Helper method to deactivate unused feeds
  private async deactivateUnusedFeeds(feedIds: string[]) {
    if (feedIds.length === 0) return;

    // For each feed, check if it's used in any other active channel
    for (const feedId of feedIds) {
      const { data: usages } = await supabase
        .from("notification_channel_feeds")
        .select("channel_id")
        .eq("feed_id", feedId);

      // If this feed is not used in any other channel, deactivate it
      if (!usages || usages.length === 0) {
        const { error } = await supabase
          .from("rss_feeds")
          .update({ is_active: false })
          .eq("id", feedId);

        if (error) {
          console.error(`Error deactivating feed ${feedId}:`, error);
          throw error;
        }
      }
    }
  }
}
