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
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateChannel(channel: NotificationChannel) {
    const { notification_channel_feeds, ...updateData } = channel;

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

  async createChannel(channel: Partial<NotificationChannel>) {
    const { notification_channel_feeds, ...createData } = channel;

    const { data, error } = await supabase
      .from("notification_channels")
      .insert(createData)
      .select(`
        *,
        notification_channel_feeds (
          feed_id
        )
      `);

    if (error) throw error;
    return data?.[0] || null;
  }

  async deleteChannel(channelId: string) {
    const { error } = await supabase
      .from("notification_channels")
      .delete()
      .eq("id", channelId);

    if (error) throw error;
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
