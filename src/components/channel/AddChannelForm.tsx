import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
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
import { DiscordIcon, EmailIcon, SlackIcon } from "../PlatformIcons";
import { useTranslation } from "react-i18next";
import { SlackService } from "@/services/slack";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/types/database.types";
import { ChannelSelector } from "./ChannelSelector";
import { Alert, AlertDescription } from "../ui/alert";
import { MultiFeedSelect } from "./ChannelMultiCombobox";
import ScheduleSelector from "./ScheduleSelector";
import { useFilteredSchedules } from "@/hooks/useNotificationSchedules";
type RssFeed = Tables<"rss_feeds">;
type NotificationSchedule = Tables<"notification_schedules">;
type WorkspaceConnection = Tables<"workspace_connections">;

interface SlackChannel {
  id: string;
  workspace_name?: string;
  name: string;
}

interface NotificationChannelWithFeeds extends Tables<"notification_channels"> {
  notification_channel_feeds?: {
    feed_id: string;
  }[];
}

const mockDiscordChannels = [
  { id: "dc1", name: "#general" },
  { id: "dc2", name: "#announcements" },
  { id: "dc3", name: "#feed-updates" },
];

interface AddChannelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (channel: Partial<NotificationChannelWithFeeds>) => Promise<void>;
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
  const { user } = useAuth();
  const organizationId = user?.organization_id;
  const currentLang = i18n.resolvedLanguage;
  const availablePlatforms = workspaceConnections.map((conn) => conn.platform);

  const [platform, setPlatform] = useState<"slack" | "discord" | "email" | "">(
    ""
  );
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [channelId, setChannelId] = useState("");
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([]);
  const [channelLoadError, setChannelLoadError] = useState<string | null>(null);

  const { filteredSchedules, defaultScheduleId, userTimezone } =
    useFilteredSchedules(schedules, platform);

  // Get available Slack workspaces
  const slackWorkspaces = workspaceConnections.filter(
    (conn) => conn.platform === "slack" && conn.is_active
  );

  // Initialize platform
  useEffect(() => {
    const newPlatform = getInitialPlatform(workspaceConnections);
    setPlatform(newPlatform);
    // Reset workspace selection when platform changes
    setSelectedWorkspaceId("");
  }, [workspaceConnections]);

  // Load Slack channels when workspace is selected
  useEffect(() => {
    if (!organizationId || !selectedWorkspaceId || platform !== "slack") return;

    const loadSlackChannels = async () => {
      setIsLoadingChannels(true);
      setChannelLoadError(null);

      try {
        const slackService = new SlackService();
        const channels = await slackService.getChannels(selectedWorkspaceId);
        setSlackChannels(channels);
      } catch (error) {
        console.error("Error loading Slack channels:", error);
        setChannelLoadError(t("addChannel.errorLoadingChannels"));
        setSlackChannels([]); // Reset channels on error
      } finally {
        setIsLoadingChannels(false);
      }
    };

    // Clear existing channels before loading new ones
    setSlackChannels([]);
    setChannelId("");
    loadSlackChannels();
  }, [platform, organizationId, selectedWorkspaceId, t]);

  useEffect(() => {
    if (platform && defaultScheduleId) {
      setScheduleId(defaultScheduleId);
    }
  }, [platform, defaultScheduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!platform || !channelId || selectedFeeds.length === 0) return;
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        organization_id: organizationId,
        platform,
        workspace_connection_id: selectedWorkspaceId,
        channel_identifier:
          platform === "email"
            ? channelId
            : platform === "slack"
            ? slackChannels.find((ch) => ch.id === channelId)?.name || channelId
            : mockDiscordChannels.find((ch) => ch.id === channelId)?.name ||
              channelId,
        schedule_id: scheduleId,
        is_active: true,
        category_ids: [],
        notification_channel_feeds: selectedFeeds.map((feedId) => ({
          feed_id: feedId,
        })),
      });

      onOpenChange(false);
      // Reset form
      setPlatform(getInitialPlatform(workspaceConnections));
      setSelectedWorkspaceId("");
      setChannelId("");
      setSelectedFeeds([]);
      setScheduleId(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent
            className="sm:max-w-[500px] overflow-y-auto touch-pan-y"
            style={{ maxHeight: "90vh" }}
          >
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{t("addChannel.title")}</DialogTitle>
                <DialogDescription>
                  {t("addChannel.description")}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Platform Selection */}
                <div className="grid gap-2">
                  <Label>{t("addChannel.platform")}</Label>
                  <RadioGroup
                    value={platform}
                    onValueChange={(value: "slack" | "discord" | "email") => {
                      setPlatform(value);
                      setSelectedWorkspaceId("");
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

                {/* Workspace Selection for Slack */}
                {platform === "slack" && slackWorkspaces.length > 0 && (
                  <div className="grid gap-2">
                    <Label>{t("addChannel.workspace")}</Label>
                    <Select
                      value={selectedWorkspaceId}
                      onValueChange={setSelectedWorkspaceId}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("addChannel.selectWorkspace")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {slackWorkspaces.map((workspace) => (
                          <SelectItem key={workspace.id} value={workspace.id}>
                            {workspace.workspace_name || workspace.workspace_id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Channel Selection */}
                {platform === "slack" && selectedWorkspaceId ? (
                  <ChannelSelector
                    platform="slack"
                    channels={slackChannels}
                    value={channelId}
                    onChange={setChannelId}
                    error={channelLoadError}
                    isLoading={isLoadingChannels}
                  />
                ) : platform === "discord" ? (
                  <ChannelSelector
                    platform="discord"
                    channels={mockDiscordChannels}
                    value={channelId}
                    onChange={setChannelId}
                  />
                ) : platform === "email" ? (
                  <div className="grid gap-2">
                    <Label>{t("addChannel.emailAddress")}</Label>
                    <Input
                      type="email"
                      value={channelId}
                      onChange={(e) => setChannelId(e.target.value)}
                      placeholder={t("addChannel.emailPlaceholder")}
                    />
                  </div>
                ) : null}

                {/* Feed Selection */}
                <div className="grid gap-2">
                  <Label>{t("addChannel.selectFeeds")}</Label>
                  <MultiFeedSelect
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
                  <ScheduleSelector
                    schedules={filteredSchedules}
                    value={scheduleId}
                    onChange={setScheduleId}
                    isDisabled={false}
                    userTimezone={userTimezone}
                  />
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
                  disabled={
                    loading ||
                    !channelId ||
                    selectedFeeds.length === 0 ||
                    (platform === "slack" && !selectedWorkspaceId)
                  }
                >
                  {loading ? t("common.adding") : t("common.add")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
