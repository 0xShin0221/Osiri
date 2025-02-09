import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, RssIcon } from "lucide-react";
import { AddChannelForm } from "@/components/channel/AddChannelForm";
import { ChannelCard } from "@/components/channel/ChannelCard";
import { ChannelSettings } from "@/components/channel/ChannelSettings";
import type { Tables } from "@/types/database.types";
import { useTranslation } from "react-i18next";
import { useFeeds } from "@/hooks/useFeeds";
import { useChannels } from "@/hooks/useChannels";
import { useWorkspaceConnections } from "@/hooks/useWorkspaceConnections";
import { useNotificationSchedules } from "@/hooks/useNotificationSchedules";
import { useAuth } from "@/hooks/useAuth";
import {
  ChannelListSkeleton,
  NoChannelsState,
  ErrorState,
} from "@/components/channel/ChannelSkeltons";

type NotificationChannel = Tables<"notification_channels"> & {
  notification_channel_feeds: {
    feed_id: string;
  }[];
};

export default function ChannelSettingsPage() {
  const [selectedChannel, setSelectedChannel] =
    useState<NotificationChannel | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { session } = useAuth();
  const { t, i18n } = useTranslation("channel");
  const currentLang = i18n.resolvedLanguage;

  const {
    connections,
    loading: connectionsLoading,
    error: connectionsError,
  } = useWorkspaceConnections({ session });

  const {
    schedules,
    loading: schedulesLoading,
    error: schedulesError,
  } = useNotificationSchedules();

  const {
    channels,
    loading: channelsLoading,
    error: channelsError,
    fetchChannels,
    updateChannel,
    deleteChannel,
    addChannel,
    toggleChannelFeed,
  } = useChannels();

  const {
    followingFeeds: organizationFeeds,
    isInitialLoading: isInitialFeedLoading,
  } = useFeeds({
    itemsPerPage: 100,
  });

  const isLoading =
    channelsLoading ||
    connectionsLoading ||
    schedulesLoading ||
    isInitialFeedLoading;
  const error = channelsError || connectionsError || schedulesError;

  const handleSelectChannel = (channel: NotificationChannel) => {
    setSelectedChannel((prev) => (prev?.id === channel.id ? null : channel));
  };

  const handleUpdateChannel = async (updatedChannel: NotificationChannel) => {
    try {
      const result = await updateChannel(updatedChannel);
      setSelectedChannel(result as NotificationChannel);
    } catch (err) {
      console.error("Error updating channel:", err);
    }
  };

  const handleDeleteChannel = async (channelId: string) => {
    try {
      await deleteChannel(channelId);
      setSelectedChannel(null);
    } catch (err) {
      console.error("Error deleting channel:", err);
    }
  };

  const handleAddChannel = async (newChannel: Partial<NotificationChannel>) => {
    try {
      await addChannel(newChannel);
      setShowAddDialog(false);
    } catch (err) {
      console.error("Error adding channel:", err);
      throw err;
    }
  };

  const handleToggleFeed = async (
    channelId: string,
    feedId: string,
    isAdding: boolean
  ) => {
    try {
      await toggleChannelFeed(channelId, feedId, isAdding);
      setSelectedChannel((prev) => {
        if (!prev) return null;
        const updatedFeeds = isAdding
          ? [...(prev.notification_channel_feeds || []), { feed_id: feedId }]
          : prev.notification_channel_feeds.filter((f) => f.feed_id !== feedId);
        return { ...prev, notification_channel_feeds: updatedFeeds };
      });
    } catch (err) {
      console.error("Error toggling feed:", err);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ChannelListSkeleton />;
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    if (channels.length === 0) {
      return <NoChannelsState message={t("noChannels")} />;
    }

    if (organizationFeeds.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <RssIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">{t("feeds.noFeeds.title")}</h3>
            <p className="text-muted-foreground pb-4">
              {t("feeds.noFeeds.description")}
            </p>
            <a href={`/${currentLang}/feeds`}>
              <Button>
                <RssIcon className="h-4 w-4 mr-2" />
                {t("feeds.noFeeds.action")}
              </Button>
            </a>
          </CardContent>
        </Card>
      );
    }

    return channels.map((channel) => (
      <div key={channel.id} className="space-y-4">
        <ChannelCard
          channel={channel as NotificationChannel}
          selected={selectedChannel?.id === channel.id}
          onSelect={handleSelectChannel}
          onUpdate={handleUpdateChannel}
        />
        {selectedChannel?.id === channel.id && (
          <ChannelSettings
            channel={selectedChannel}
            feeds={organizationFeeds}
            schedules={schedules}
            onUpdate={handleUpdateChannel}
            onDelete={handleDeleteChannel}
            onToggleFeed={handleToggleFeed}
          />
        )}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchChannels}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {t("feeds.refreshText")}
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("feeds.addText")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">{renderContent()}</div>
      </div>

      <AddChannelForm
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddChannel}
        feeds={organizationFeeds}
        schedules={schedules}
        workspaceConnections={connections || []}
      />
    </div>
  );
}
