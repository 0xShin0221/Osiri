import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { MultiSelect } from "@/components/ui/multi-select";
import { DiscordIcon, EmailIcon, SlackIcon } from "../PlatformIcons";
import { useTranslation } from "react-i18next";
import type { Tables } from "@/types/database.types";

type NotificationChannel = Tables<"notification_channels">;
type RssFeed = Tables<"rss_feeds">;
type NotificationSchedule = Tables<"notification_schedules">;
type WorkspaceConnection = Tables<"workspace_connections">;

const mockSlackChannels = [
  { id: "ch1", name: "#general" },
  { id: "ch2", name: "#random" },
  { id: "ch3", name: "#tech-news" },
];

const mockDiscordChannels = [
  { id: "dc1", name: "#general" },
  { id: "dc2", name: "#announcements" },
  { id: "dc3", name: "#feed-updates" },
];

interface AddChannelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (channel: Partial<NotificationChannel>) => Promise<void>;
  feeds: RssFeed[];
  schedules: NotificationSchedule[];
  workspaceConnections: WorkspaceConnection[];
}

const getInitialPlatform = (connections: WorkspaceConnection[]) => {
  if (connections.some((conn) => conn.platform === "slack")) {
    return "slack";
  }
  if (connections.some((conn) => conn.platform === "discord")) {
    return "discord";
  }
  if (connections.some((conn) => conn.platform === "email")) {
    return "email";
  }
  return "email";
};

export function AddChannelForm({
  open,
  onOpenChange,
  onSubmit,
  feeds,
  schedules,
  workspaceConnections,
}: AddChannelFormProps) {
  const { t } = useTranslation("channel");
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const availablePlatforms = workspaceConnections.map((conn) => conn.platform);
  const [platform, setPlatform] = useState<"slack" | "discord" | "email" | "">(
    ""
  );
  const [channelId, setChannelId] = useState("");
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const newPlatform = getInitialPlatform(workspaceConnections);
    setPlatform(newPlatform);
  }, [workspaceConnections]);
  const handleSubmit = async (e: React.FormEvent) => {
    if (!platform || !channelId || selectedFeeds.length === 0) return;
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        platform,
        channel_identifier:
          platform === "email"
            ? channelId
            : platform === "slack"
            ? mockSlackChannels.find((ch) => ch.id === channelId)?.name ||
              channelId
            : mockDiscordChannels.find((ch) => ch.id === channelId)?.name ||
              channelId,
        feed_ids: selectedFeeds,
        schedule_id: scheduleId,
        is_active: true,
        category_ids: [],
      });
      onOpenChange(false);
      // Reset form
      setPlatform(
        (availablePlatforms[0] as "slack" | "discord" | "email") || "email"
      );
      setChannelId("");
      setSelectedFeeds([]);
      setScheduleId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("addChannel.title")}</DialogTitle>
            <DialogDescription>{t("addChannel.description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Platform Selection */}
            <div className="grid gap-2">
              <Label>{t("addChannel.platform")}</Label>
              <RadioGroup
                value={platform}
                onValueChange={(value: "slack" | "discord" | "email") => {
                  setPlatform(value);
                  setChannelId("");
                }}
                className="grid grid-cols-2 gap-4"
              >
                {availablePlatforms.length > 0 &&
                  availablePlatforms.includes("slack") && (
                    <div>
                      <RadioGroupItem
                        value="slack"
                        id="slack"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="slack"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <SlackIcon />
                        <span className="mt-2">Slack</span>
                      </Label>
                    </div>
                  )}
                {availablePlatforms.length > 0 &&
                  availablePlatforms.includes("discord") && (
                    <div>
                      <RadioGroupItem
                        value="discord"
                        id="discord"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="discord"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <DiscordIcon />
                        <span className="mt-2">Discord</span>
                      </Label>
                    </div>
                  )}
                <div>
                  <RadioGroupItem
                    value="email"
                    id="email"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="email"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <EmailIcon />
                    <span className="mt-2">Email</span>
                  </Label>
                </div>
              </RadioGroup>
              {availablePlatforms.length === 0 && (
                <Alert className="mt-4">
                  <AlertDescription>
                    {t("addChannel.noIntegrationsMessage")}
                    <a
                      href={`/${currentLang}/integrations`}
                      className="text-primary hover:underline ml-1"
                    >
                      {t("addChannel.setupIntegrations")}
                    </a>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Channel Selection */}
            {platform !== "email" ? (
              <div className="grid gap-2">
                <Label>{t("addChannel.channel")}</Label>
                <Select value={channelId} onValueChange={setChannelId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("addChannel.selectChannel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {platform === "slack"
                      ? mockSlackChannels.map((channel) => (
                          <SelectItem key={channel.id} value={channel.id}>
                            {channel.name}
                          </SelectItem>
                        ))
                      : mockDiscordChannels.map((channel) => (
                          <SelectItem key={channel.id} value={channel.id}>
                            {channel.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label>{t("addChannel.emailAddress")}</Label>
                <Input
                  type="email"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder={t("addChannel.emailPlaceholder")}
                />
              </div>
            )}

            {/* Feed Selection */}
            <div className="grid gap-2">
              <Label>{t("addChannel.selectFeeds")}</Label>
              <MultiSelect
                options={feeds.map((feed) => ({
                  label: feed.name,
                  value: feed.id,
                  description: feed.categories.join(", "),
                }))}
                selected={selectedFeeds}
                onChange={setSelectedFeeds}
                placeholder={t("addChannel.feedsPlaceholder")}
              />
            </div>

            {/* Schedule Selection */}
            <div className="grid gap-2">
              <Label>{t("addChannel.schedule")}</Label>
              <Select
                value={scheduleId || "realtime"}
                onValueChange={(value) =>
                  setScheduleId(value === "realtime" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("addChannel.selectSchedule")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">
                    {t("schedules.realtime")}
                  </SelectItem>
                  {schedules.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading || !channelId || selectedFeeds.length === 0}
            >
              {loading ? t("common.adding") : t("common.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
