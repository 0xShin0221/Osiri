import { useState } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, RssIcon } from 'lucide-react';

import { AddChannelForm } from '@/components/channel/AddChannelForm';
import { ChannelCard } from '@/components/channel/ChannelCard';
import { ChannelSettings } from '@/components/channel/ChannelSettings';
import { type Tables } from '@/types/database.types';
import { mockChannels, mockSchedules } from '@/mocks/notificationData';
import { useTranslation } from 'react-i18next';
import { mockFeeds } from '@/mocks/feedData';

// Types
type NotificationChannel = Tables<'notification_channels'>;


export default function ChannelSettingsPage() {
  const [channels, setChannels] = useState<NotificationChannel[]>(mockChannels);
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { t } = useTranslation("channel");

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
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">
            {t("page.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" /> {t("common.refresh")}
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> {t("channel.add")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel List */}
        <div className="space-y-4">
          {channels.length > 0 ? (
            <>
              {mockFeeds.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="flex justify-center">
                      <RssIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg">
                      {t("feeds.noFeeds.title")}
                    </h3>
                    <p className="text-muted-foreground pb-4">
                      {t("feeds.noFeeds.description")}
                    </p>
                    <a href="/feeds">
                      <Button>
                        <RssIcon className="h-4 w-4 mr-2" />
                        {t("feeds.noFeeds.action")}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ) : (
                channels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    selected={selectedChannel?.id === channel.id}
                    onSelect={setSelectedChannel}
                    onUpdate={handleUpdateChannel}
                  />
                ))
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {t("channel.noChannels")}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Panel */}
        <div className="lg:sticky lg:top-4">
          {selectedChannel&&
            <ChannelSettings
              channel={selectedChannel}
              feeds={mockFeeds}
              schedules={mockSchedules}
              onUpdate={handleUpdateChannel}
              onDelete={handleDeleteChannel}
            />
          }
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
