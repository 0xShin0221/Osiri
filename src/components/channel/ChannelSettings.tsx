import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Database, Tables } from "@/types/database.types";
import { useTranslation } from "react-i18next";
import { GetPlatformIcon } from "../PlatformIcons";
import ScheduleSelector from "./ScheduleSelector";

import { useFilteredSchedules } from "@/hooks/useNotificationSchedules";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LANGUAGES } from "@/lib/i18n/languages";

// Types
type NotificationChannel = Tables<"notification_channels"> & {
  notification_channel_feeds: {
    feed_id: string;
  }[];
};

type RssFeed = Tables<"rss_feeds">;
type NotificationSchedule = Tables<"notification_schedules">;
type FeedLanguage = Database["public"]["Enums"]["feed_language"];
interface ChannelSettingsProps {
  channel: NotificationChannel;
  feeds: RssFeed[];
  schedules: NotificationSchedule[];
  onUpdate: (channel: NotificationChannel) => void;
  onDelete: (channelId: string) => void;
  onToggleFeed: (
    channelId: string,
    feedId: string,
    isAdding: boolean
  ) => Promise<void>;
}

export const ChannelSettings: React.FC<ChannelSettingsProps> = ({
  channel,
  feeds,
  schedules,
  onUpdate,
  onDelete,
  onToggleFeed,
}) => {
  const { t } = useTranslation("channel");

  // Get current feed IDs from notification_channel_feeds
  const currentFeedIds =
    channel.notification_channel_feeds?.map((cf) => cf.feed_id) || [];

  const { filteredSchedules, userTimezone } = useFilteredSchedules(
    schedules,
    channel.platform
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {GetPlatformIcon(channel.platform)} {channel.channel_identifier}
          </div>
        </CardTitle>
        <CardDescription>{t("settings.configureDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language Setting */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("settings.language")}</h3>
          <Select
            value={channel.notification_language}
            onValueChange={(value: FeedLanguage) => {
              onUpdate({ ...channel, notification_language: value });
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("settings.selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.SUPPORTED.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {t("settings.languageDescription")}
          </p>
        </div>
        {/* Feed Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("settings.selectedFeeds")}</h3>
          <div className="grid grid-cols-1 gap-2">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center justify-between p-2 border rounded hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={currentFeedIds.includes(feed.id)}
                    onCheckedChange={(checked) => {
                      onToggleFeed(channel.id, feed.id, checked);
                    }}
                  />
                  <span>{feed.name}</span>
                </div>
                <div className="flex gap-1">
                  {feed.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Setting */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("settings.notificationSchedule")}
          </h3>

          <ScheduleSelector
            schedules={filteredSchedules}
            value={channel.schedule_id}
            onChange={(value) => {
              onUpdate({ ...channel, schedule_id: value });
            }}
            isDisabled={false}
            userTimezone={userTimezone}
          />
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t">
          <Button variant="destructive" onClick={() => onDelete(channel.id)}>
            <Trash2 className="h-4 w-4 mr-2" /> {t("settings.deleteChannel")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
