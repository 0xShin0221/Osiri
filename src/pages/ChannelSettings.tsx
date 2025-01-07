// src/pages/ChannelSettingsPage.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, RssIcon, Loader2 } from "lucide-react";

import { AddChannelForm } from "@/components/channel/AddChannelForm";
import { ChannelCard } from "@/components/channel/ChannelCard";
import { ChannelSettings } from "@/components/channel/ChannelSettings";
import type { Tables } from "@/types/database.types";
import { mockSchedules } from "@/mocks/notificationData";
import { useTranslation } from "react-i18next";
import { mockFeeds } from "@/mocks/feedData";
import { useChannels } from "@/hooks/useChannels";
import { useWorkspaceConnections } from "@/hooks/useWorkspaceConnections";
import { useAuth } from "@/hooks/useAuth";

type NotificationChannel = Tables<"notification_channels">;

export default function ChannelSettingsPage() {
  const [selectedChannel, setSelectedChannel] =
    useState<NotificationChannel | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { session } = useAuth();
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const { t } = useTranslation("channel");

  const {
    connections,
    loading: connectionsLoading,
    error: connectionsError,
  } = useWorkspaceConnections({ session });

  const {
    channels,
    loading: channelsLoading,
    error: channelsError,
    fetchChannels,
    updateChannel,
    deleteChannel,
    addChannel,
  } = useChannels();

  const loading = channelsLoading || connectionsLoading;
  const error = channelsError || connectionsError;

  const handleUpdateChannel = async (updatedChannel: NotificationChannel) => {
    try {
      const result = await updateChannel(updatedChannel);
      setSelectedChannel(result);
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

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchChannels} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {t("common.refresh")}
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("channel.add")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Channel List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-8 text-center text-red-600">
                {error}
              </CardContent>
            </Card>
          ) : channels.length > 0 ? (
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
                    <a href={`/${currentLang}/feeds`}>
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
          {selectedChannel && (
            <ChannelSettings
              channel={selectedChannel}
              feeds={mockFeeds}
              schedules={mockSchedules}
              onUpdate={handleUpdateChannel}
              onDelete={handleDeleteChannel}
            />
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
        workspaceConnections={connections || []}
      />
    </div>
  );
}
