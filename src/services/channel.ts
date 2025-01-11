import { supabase } from "@/lib/supabase";
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
    // Handle platform-specific logic
    const channelData = {
      ...channel,
      // For email platform, workspace_connection_id should be null
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

    // If we have feeds to associate, create the relationships
    if (notification_channel_feeds && notification_channel_feeds.length > 0) {
      const feedRelations = notification_channel_feeds.map((feed) => ({
        channel_id: newChannel.id,
        feed_id: feed.feed_id,
      }));

      const { error: feedError } = await supabase
        .from("notification_channel_feeds")
        .insert(feedRelations);

      if (feedError) {
        console.error("Error adding channel feeds:", feedError);
        throw feedError;
      }
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
      const { error } = await supabase
        .from("notification_channels")
        .update({ is_active: false })
        .eq("id", channelId);

      if (error) throw error;

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

  async addFeedToChannel(channelId: string, feedId: string) {
    const { error } = await supabase
      .from("notification_channel_feeds")
      .insert({
        channel_id: channelId,
        feed_id: feedId,
      });

    if (error) throw error;

    const updatedChannel = await this.getChannelById(channelId);
    if (!updatedChannel) {
      throw new Error("Channel not found after adding feed");
    }
    return updatedChannel;
  }

  async removeFeedFromChannel(channelId: string, feedId: string) {
    const { error } = await supabase
      .from("notification_channel_feeds")
      .delete()
      .eq("channel_id", channelId)
      .eq("feed_id", feedId);

    if (error) throw error;

    const updatedChannel = await this.getChannelById(channelId);
    if (!updatedChannel) {
      throw new Error("Channel not found after removing feed");
    }
    return updatedChannel;
  }
}
