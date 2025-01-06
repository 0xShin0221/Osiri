import { useState, useEffect, useCallback } from 'react';
import { ChannelService } from '@/services/channel';
import { type Tables } from '@/types/database.types';

type NotificationChannel = Tables<'notification_channels'>;

export function useChannels() {
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelService = new ChannelService();

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await channelService.getChannels();
      setChannels(data);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError(err instanceof Error ? err.message : 'Failed to load channels');
    } finally {
      setLoading(false);
    }
  }, [channelService]);

  const updateChannel = async (channel: NotificationChannel) => {
    try {
      const updatedChannel = await channelService.updateChannel(channel);
      setChannels(prev =>
        prev.map(ch => ch.id === updatedChannel.id ? updatedChannel : ch)
      );
      return updatedChannel;
    } catch (err) {
      console.error('Error updating channel:', err);
      throw err;
    }
  };

  const deleteChannel = async (channelId: string) => {
    try {
      await channelService.deleteChannel(channelId);
      setChannels(prev => prev.filter(ch => ch.id !== channelId));
    } catch (err) {
      console.error('Error deleting channel:', err);
      throw err;
    }
  };

  const addChannel = async (channel: Partial<NotificationChannel>) => {
    try {
      const newChannel = await channelService.createChannel(channel);
      setChannels(prev => [...prev, newChannel]);
      return newChannel;
    } catch (err) {
      console.error('Error adding channel:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return {
    channels,
    loading,
    error,
    fetchChannels,
    updateChannel,
    deleteChannel,
    addChannel
  };
}