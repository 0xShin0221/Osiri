import { useState } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from 'lucide-react';

import { AddChannelForm } from '@/components/channel/AddChannelForm';
import { ChannelCard } from '@/components/channel/ChannelCard';
import { ChannelSettings } from '@/components/channel/ChannelSettings';
import { type Tables } from '@/types/database.types';
import { mockChannels, mockFeeds, mockSchedules } from '@/mocks/notificationData';

// Types
type NotificationChannel = Tables<'notification_channels'>;


export default function ChannelSettingsPage() {
  const [channels, setChannels] = useState<NotificationChannel[]>(mockChannels);
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleUpdateChannel = (updatedChannel: NotificationChannel) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === updatedChannel.id ? updatedChannel : ch))
    );
    setSelectedChannel(updatedChannel);
  };

  const handleDeleteChannel = (channelId: string) => {
    setChannels((prev) => prev.filter((ch) => ch.id !== channelId));
    setSelectedChannel(null);
  };

  const handleAddChannel = async (newChannel: Partial<NotificationChannel>): Promise<void> => {
    return new Promise((resolve) => {
      const channel: NotificationChannel = {
        ...newChannel,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        feed_ids: [],
        schedule_id: null,
      } as NotificationChannel;
      setChannels((prev) => [...prev, channel]);
      resolve();
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Channel Settings</h1>
          <p className="text-muted-foreground">
            Manage your notification channels and feed preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Channel
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel List */}
        <div className="space-y-4">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              selected={selectedChannel?.id === channel.id}
              onSelect={setSelectedChannel}
              onUpdate={handleUpdateChannel}
            />
          ))}
          {channels.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No channels configured yet
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Panel */}
        <div className="lg:sticky lg:top-4">
          {selectedChannel ? (
            <ChannelSettings
              channel={selectedChannel}
              feeds={mockFeeds}
              schedules={mockSchedules}
              onUpdate={handleUpdateChannel}
              onDelete={handleDeleteChannel}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Select a channel to configure
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Channel Dialog */}
      <AddChannelForm
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddChannel}
        feeds={mockFeeds}
        schedules={mockSchedules}
      />
    </div>
  );
}
