import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Channel {
  id: string;
  name: string;
  topic?: {
    value?: string;
  };
}

interface ChannelSelectorProps {
  platform: "slack" | "discord";
  channels: Channel[];
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

export const ChannelSelector = ({
  // platform, // will be used in the future
  channels,
  value,
  onChange,
  error,
  isLoading = false,
}: ChannelSelectorProps) => {
  const { t } = useTranslation("channel");
  const [channelSearch, setChannelSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredChannels = useMemo(() => {
    if (!channelSearch) return channels;

    const searchLower = channelSearch.toLowerCase();
    return channels.filter(
      (channel) =>
        channel.name.toLowerCase().includes(searchLower) ||
        channel.topic?.value?.toLowerCase().includes(searchLower)
    );
  }, [channels, channelSearch]);

  // Get selected channel name
  const selectedChannelName = useMemo(() => {
    if (!value) return t("addChannel.selectChannel");
    const channel = channels.find((ch) => ch.id === value);
    return channel ? channel.name : t("addChannel.selectChannel");
  }, [value, channels, t]);

  return (
    <div className="space-y-2 w-full">
      <Label>{t("addChannel.channel")}</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">{selectedChannelName}</span>
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[400px]"
          align="start"
        >
          <div className="sticky top-0 bg-background z-10 px-3 py-2 border-b">
            <Input
              placeholder={t("addChannel.searchPlaceholder")}
              onChange={(e) => {
                setChannelSearch(e.target.value);
              }}
              value={channelSearch}
              className="h-9 w-full focus-visible:ring-0"
            />
          </div>
          <ScrollArea className="h-[300px] overflow-y-auto">
            {filteredChannels.length > 0 ? (
              filteredChannels.map((channel) => (
                <DropdownMenuItem
                  key={channel.id}
                  onSelect={() => {
                    onChange(channel.id);
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-start gap-1 py-2.5 px-4 cursor-pointer hover:bg-accent/50"
                >
                  <span className="text-sm font-medium">{channel.name}</span>
                  {channel.topic?.value && (
                    <span className="text-xs text-muted-foreground line-clamp-2 text-left">
                      {channel.topic.value}
                    </span>
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t("addChannel.noChannelsFound")}
              </div>
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
