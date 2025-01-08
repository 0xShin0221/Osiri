import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import type { Tables } from "@/types/database.types";
import { useTranslation } from "react-i18next";
import { GetPlatformIcon } from "../PlatformIcons";

// Types
type NotificationChannel = Tables<"notification_channels"> & {
  channel_feeds?: {
    feed_id: string;
    feeds: Tables<"rss_feeds">;
  }[];
};

interface ChannelCardProps {
  channel: NotificationChannel;
  selected: boolean;
  onSelect: (channel: NotificationChannel) => void;
  onUpdate: (channel: NotificationChannel) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  selected,
  onSelect,
  onUpdate,
}) => {
  const { t } = useTranslation("channel");
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(channel);
  };

  const feedCount = channel.channel_feeds?.length ?? 0;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        selected ? "ring-2 ring-primary" : "hover:shadow-md"
      }`}
      onClick={() => onSelect(channel)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {GetPlatformIcon(channel.platform)}
            <div>
              <h3 className="font-medium">{channel.channel_identifier}</h3>
              <p className="text-sm text-muted-foreground">
                {t("card.feedCount", { count: feedCount })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={channel.is_active}
              onCheckedChange={(checked) => {
                onUpdate({ ...channel, is_active: checked });
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
