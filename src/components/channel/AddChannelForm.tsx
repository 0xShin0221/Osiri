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
import { useAuth } from "@/hooks/useAuth";
import type { Database, Tables } from "@/types/database.types";
import { ChannelSelector } from "./ChannelSelector";
import { Alert, AlertDescription } from "../ui/alert";
import { MultiFeedSelect } from "./ChannelMultiCombobox";
import ScheduleSelector from "./ScheduleSelector";
import { useFilteredSchedules } from "@/hooks/useNotificationSchedules";
import type {
  NotificationPlatform,
  Channel,
} from "@/types/notification-platform";
import { createPlatform } from "@/services/platforms/platform-factory";
import { NotificationLanguageSelector } from "./NotificationLanguageSelector";

type RssFeed = Tables<"rss_feeds">;
type NotificationSchedule = Tables<"notification_schedules">;
type WorkspaceConnection = Tables<"workspace_connections">;
type FeedLanguage = Database["public"]["Enums"]["feed_language"];

interface NotificationChannelWithFeeds extends Tables<"notification_channels"> {
  notification_channel_feeds?: {
    feed_id: string;
  }[];
}

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

  const [platform, setPlatform] = useState<NotificationPlatform | "">("");
  const [notificationLanguage, setNotificationLanguage] =
    useState<FeedLanguage>(currentLang as FeedLanguage);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [channelId, setChannelId] = useState("");
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelLoadError, setChannelLoadError] = useState<string | null>(null);

  const { filteredSchedules, defaultScheduleId, userTimezone } =
    useFilteredSchedules(schedules, platform);

  // Get available workspaces for the selected platform
  const workspaces = workspaceConnections.filter(
    (conn) => conn.platform === platform && conn.is_active
  );

  // Initialize platform
  useEffect(() => {
    const newPlatform = getInitialPlatform(workspaceConnections);
    setPlatform(newPlatform);
    // Reset workspace selection when platform changes
    setSelectedWorkspaceId("");
  }, [workspaceConnections]);

  // Load channels when workspace is selected
  useEffect(() => {
    if (
      !organizationId ||
      !selectedWorkspaceId ||
      !platform ||
      platform === "email"
    )
      return;

    const loadChannels = async () => {
      setIsLoadingChannels(true);
      setChannelLoadError(null);

      try {
        const platformService = createPlatform(platform);
        const loadedChannels = await platformService.getChannels(
          selectedWorkspaceId
        );
        setChannels(loadedChannels);
      } catch (error) {
        console.error(`Error loading ${platform} channels:`, error);
        setChannelLoadError(t("addChannel.errorLoadingChannels"));
        setChannels([]); // Reset channels on error
      } finally {
        setIsLoadingChannels(false);
      }
    };

    // Clear existing channels before loading new ones
    setChannels([]);
    setChannelId("");
    loadChannels();
  }, [platform, organizationId, selectedWorkspaceId, t]);

  useEffect(() => {
    if (platform && defaultScheduleId) {
      setScheduleId(defaultScheduleId);
    }
  }, [platform, defaultScheduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!platform || !channelId || selectedFeeds.length === 0 || !scheduleId)
      return;
    e.preventDefault();
    setLoading(true);

    try {
      const selectedChannel = channels.find((c) => c.id === channelId);

      await onSubmit({
        organization_id: organizationId,
        platform,
        workspace_connection_id: selectedWorkspaceId,
        channel_identifier_id: platform === "email" ? null : channelId,
        channel_identifier:
          platform === "email" ? channelId : selectedChannel?.name,
        schedule_id: scheduleId,
        is_active: true,
        category_ids: [],
        notification_channel_feeds: selectedFeeds.map((feedId) => ({
          feed_id: feedId,
        })),
        notification_language: notificationLanguage,
      });

      onOpenChange(false);
      // Reset form
      setPlatform(getInitialPlatform(workspaceConnections));
      setSelectedWorkspaceId("");
      setChannelId("");
      setSelectedFeeds([]);
      setScheduleId(null);
      setNotificationLanguage(currentLang as FeedLanguage);
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
                    onValueChange={(value: NotificationPlatform) => {
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

                {/* Workspace Selection for Slack/Discord */}
                {(platform === "slack" || platform === "discord") &&
                  workspaces.length > 0 && (
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
                          {workspaces.map((workspace) => (
                            <SelectItem key={workspace.id} value={workspace.id}>
                              {workspace.workspace_name ||
                                workspace.workspace_id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                {/* Channel Selection */}
                {(platform === "slack" || platform === "discord") &&
                selectedWorkspaceId ? (
                  <ChannelSelector
                    platform={platform}
                    channels={channels}
                    value={channelId}
                    onChange={setChannelId}
                    error={channelLoadError}
                    isLoading={isLoadingChannels}
                  />
                ) : platform === "email" ? (
                  <div className="grid gap-2">
                    <Label>{t("addChannel.emailAddress")}</Label>
                    <Alert className="mt-4">
                      <AlertDescription>
                        Email notifications are currently unavailable.
                      </AlertDescription>
                    </Alert>
                    <Input
                      type="email"
                      disabled={true} // TODO: Add email channel
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

              <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
                <NotificationLanguageSelector
                  value={notificationLanguage}
                  onChange={(value: FeedLanguage) =>
                    setNotificationLanguage(value)
                  }
                  position="footer"
                />
                <div className="flex gap-2">
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
                      !scheduleId ||
                      ((platform === "slack" || platform === "discord") &&
                        !selectedWorkspaceId)
                    }
                  >
                    {loading ? t("common.adding") : t("common.add")}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
