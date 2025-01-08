import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";

type NotificationChannel = Tables<"notification_channels">;

export class ChannelService {
  async getChannels() {
    const { data, error } = await supabase
      .from("notification_channels")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async createChannel(channel: Partial<NotificationChannel>) {
    try {
      const { data, error } = await supabase
        .from("notification_channels")
        .insert(channel)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
  }

  async updateChannel(channel: NotificationChannel) {
    try {
      const { data, error } = await supabase
        .from("notification_channels")
        .update(channel)
        .eq("id", channel.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating channel:", error);
      throw error;
    }
  }

  async deleteChannel(channelId: string) {
    try {
      const { error } = await supabase
        .from("notification_channels")
        .delete()
        .eq("id", channelId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting channel:", error);
      throw error;
    }
  }

  async addFeedToChannel(channelId: string, feedId: string) {
    try {
      const { error } = await supabase
        .from("notification_channel_feeds")
        .insert({
          channel_id: channelId,
          feed_id: feedId,
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error adding feed to channel:", error);
      throw error;
    }
  }

  async removeFeedFromChannel(channelId: string, feedId: string) {
    try {
      const { error } = await supabase
        .from("notification_channel_feeds")
        .delete()
        .eq("channel_id", channelId)
        .eq("feed_id", feedId);

      if (error) throw error;
    } catch (error) {
      console.error("Error removing feed from channel:", error);
      throw error;
    }
  }
}
