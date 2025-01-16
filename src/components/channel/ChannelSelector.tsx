import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

interface Channel {
  id: string;
  name: string;
  topic?: {
    value?: string;
  };
}

interface ChannelSelectorProps {
  platform: Database["public"]["Enums"]["notification_platform"];
  channels: Channel[];
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

export const ChannelSelector = ({
  platform,
  channels,
  value,
  onChange,
  error,
  isLoading = false,
}: ChannelSelectorProps) => {
  const { t } = useTranslation("channel");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(search.toLowerCase()) ||
      channel.topic?.value?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedChannel = channels.find((channel) => channel.id === value);

  const handleSelect = (channelId: string) => {
    onChange(channelId);
    setSearch("");
    setOpen(false);
  };

  const handleChannelInteraction =
    (channelId: string) => (e: React.MouseEvent | React.KeyboardEvent) => {
      if (
        e.type === "click" ||
        (e as React.KeyboardEvent).key === "Enter" ||
        (e as React.KeyboardEvent).key === " "
      ) {
        e.preventDefault();
        handleSelect(channelId);
      }
    };

  const dialogTitle =
    platform === "slack"
      ? t("addChannel.selectSlackChannel")
      : t("addChannel.selectDiscordChannel");

  return (
    <div className="space-y-2 w-full">
      <Label>{t("addChannel.channel")}</Label>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={isLoading}
          >
            <span className="truncate">
              {selectedChannel?.name || t("addChannel.selectChannel")}
            </span>
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <DialogPrimitive.Title className="sr-only">
              {dialogTitle}
            </DialogPrimitive.Title>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("addChannel.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full">
              <div className="p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : filteredChannels.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {t("addChannel.noChannelsFound")}
                  </div>
                ) : (
                  filteredChannels.map((channel) => (
                    <div
                      key={channel.id}
                      onClick={handleChannelInteraction(channel.id)}
                      onKeyDown={handleChannelInteraction(channel.id)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
                        value === channel.id && "bg-accent/50"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{channel.name}</span>
                        {channel.topic?.value && (
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {channel.topic.value}
                          </span>
                        )}
                      </div>
                      {value === channel.id && (
                        <Check className="h-4 w-4 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
