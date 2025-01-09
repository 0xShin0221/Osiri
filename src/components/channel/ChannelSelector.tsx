import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const ChannelSelector = ({
  // platform, channels, value, onChange, error
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
    <div className="space-y-2">
      <Label>{t("addChannel.channel")}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("addChannel.selectChannel")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <div className="px-2 py-2 border-b border-input">
            <Input
              placeholder={t("addChannel.searchPlaceholder")}
              onChange={(e) => {
                setChannelSearch(e.target.value);
                onChange("");
              }}
              value={channelSearch}
              className="h-8 focus-visible:ring-0"
            />
          </div>
          <ScrollArea className="h-[200px]">
            <SelectGroup>
              {filteredChannels.length > 0 ? (
                filteredChannels.map((channel) => (
                  <SelectItem
                    key={channel.id}
                    value={channel.id}
                    className="py-2 px-8 cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {channel.name}
                      </span>
                      {channel.topic?.value && (
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {channel.topic.value}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {t("addChannel.noChannelsFound")}
                </div>
              )}
            </SelectGroup>
          </ScrollArea>
        </SelectContent>
      </Select>
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
