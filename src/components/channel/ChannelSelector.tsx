import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

export const ChannelSelector = ({
  channels,
  value,
  onChange,
  error,
}: {
  platform: "slack" | "discord";
  channels: { id: string; name: string; topic?: { value?: string } }[];
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}) => {
  const { t } = useTranslation("channel");
  const [channelSearch, setChannelSearch] = useState("");

  const filteredChannels = useMemo(() => {
    if (!channelSearch) return channels;

    const searchLower = channelSearch.toLowerCase();
    return channels.filter(
      (channel) =>
        channel.name.toLowerCase().includes(searchLower) ||
        channel.topic?.value?.toLowerCase().includes(searchLower)
    );
  }, [channels, channelSearch]);

  return (
    <div className="space-y-2 w-full">
      <Label>{t("addChannel.channel")}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {value
              ? channels.find((channel) => channel.id === value)?.name ||
                t("addChannel.selectChannel")
              : t("addChannel.selectChannel")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto">
          <div className="sticky top-0 bg-background z-10 px-3 py-2 border-b">
            <Input
              placeholder={t("addChannel.searchPlaceholder")}
              onChange={(e) => {
                setChannelSearch(e.target.value);
                onChange("");
              }}
              value={channelSearch}
              className="h-9 w-full focus-visible:ring-0"
            />
          </div>
          <ScrollArea className="h-[200px]">
            {filteredChannels.length > 0 ? (
              filteredChannels.map((channel) => (
                <DropdownMenuItem
                  key={channel.id}
                  onSelect={() => onChange(channel.id)}
                  className="flex flex-col gap-1 py-2.5 px-4 cursor-pointer hover:bg-accent/50"
                >
                  <span className="text-sm font-medium">{channel.name}</span>
                  {channel.topic?.value && (
                    <span className="text-xs text-muted-foreground line-clamp-2">
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
