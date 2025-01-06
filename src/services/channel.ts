import { supabase } from '@/lib/supabase';
import { type Tables } from '@/types/database.types';

type NotificationChannel = Tables<'notification_channels'>;

export class ChannelService {

  async getChannels() {
    const { data, error } = await supabase
      .from('notification_channels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateChannel(channel: NotificationChannel) {
    const { error } = await supabase
      .from('notification_channels')
      .update({
        feed_ids: channel.feed_ids,
        is_active: channel.is_active,
        schedule_id: channel.schedule_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', channel.id);

    if (error) throw error;
    return channel;
  }

  async deleteChannel(channelId: string) {
    const { error } = await supabase
      .from('notification_channels')
      .delete()
      .eq('id', channelId);

    if (error) throw error;
  }

  async createChannel(channel: Partial<NotificationChannel>) {
    const { data, error } = await supabase
      .from('notification_channels')
      .insert({
        ...channel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        feed_ids: [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}