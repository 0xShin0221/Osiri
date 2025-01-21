import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageSquare, Pin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Database } from "@/types/database.types";
import { TranslationWithRelations } from "@/services/translation";
import { MediaCard } from "./MediaCard";
import { Button } from "@/components/ui/button";
import { DiscordIcon, EmailIcon, SlackIcon } from "../PlatformIcons";
import { useState } from "react";

interface NotificationCardProps {
  translation: TranslationWithRelations;
}

const getPlatformIcon = (
  platform: Database["public"]["Enums"]["notification_platform"]
) => {
  switch (platform) {
    case "slack":
      return <SlackIcon className="w-4 h-4" />;
    case "discord":
      return <DiscordIcon className="w-4 h-4" />;
    case "email":
      return <EmailIcon className="w-4 h-4" />;
    default:
      return "📱";
  }
};

const getStatusBadge = (
  status: Database["public"]["Enums"]["translation_status"]
) => {
  const { t } = useTranslation("dashboard");

  const statusText = t(`notifications.status.${status}`);

  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">{statusText}</Badge>;
    case "failed":
      return <Badge variant="destructive">{statusText}</Badge>;
    case "processing":
      return <Badge variant="secondary">{statusText}</Badge>;
    case "pending":
      return <Badge variant="outline">{statusText}</Badge>;
    default:
      return <Badge variant="outline">{statusText}</Badge>;
  }
};

export function NotificationCard({ translation }: NotificationCardProps) {
  const { t } = useTranslation("dashboard");
  const [expanded, setExpanded] = useState(false);

  const successfulLogs =
    translation.notification_logs?.filter((log) => log.status === "success") ||
    [];

  const keyPoints = [
    translation.key_point1,
    translation.key_point2,
    translation.key_point3,
  ].filter(Boolean);

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative h-48">
          <MediaCard
            imageUrl={translation.article.og_image}
            fallbackImage="https://fkmjhtjgaeoqbgzpwxif.supabase.co/storage/v1/object/public/assets/loader.gif"
            className="h-full"
            onError={() => {
              console.warn(
                `Failed to load image for article: ${translation.article.url}`
              );
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {getStatusBadge(translation.status)}
            {translation.article.feed.categories
              ?.slice(0, 2)
              .map((category, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-black/50 backdrop-blur-sm text-white border-none"
                >
                  {category}
                </Badge>
              ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Feed Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <img
              src={
                translation.article.feed.site_icon || "/assets/default-icon.png"
              }
              alt="Feed icon"
              className="w-4 h-4 rounded-full"
            />
            <span>{translation.article.feed.name}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-3">
            <a
              href={translation.article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {translation.title}
            </a>
          </h3>

          {/* Summary */}
          <div className="mb-4">
            <div className="text-sm text-muted-foreground">
              {/* Increase line-clamp from 3 to 5 */}
              <p
                className={`line-clamp-5 ${expanded ? "line-clamp-none" : ""}`}
              >
                {translation.summary}
              </p>
              {/* Add show more/less toggle if summary is long */}
              {translation.summary && translation.summary.length > 300 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-primary hover:text-primary/90 text-sm mt-1"
                >
                  {expanded
                    ? t("notifications.card.showLess")
                    : t("notifications.card.showMore")}
                </button>
              )}
            </div>
          </div>

          {/* Key Points */}
          {keyPoints.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <Pin className="h-4 w-4" />
                {t("notifications.card.keyPoints")}
              </div>
              <div className="space-y-1">
                {keyPoints.map((point, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    • {point}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Distribution Channels */}
          {successfulLogs.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("notifications.card.channels")}
              </div>
              <div className="flex flex-wrap gap-2">
                {successfulLogs.map((log) => (
                  <Badge
                    key={log.id}
                    variant="outline"
                    className="flex items-center gap-1 px-2 py-0.5 text-xs"
                  >
                    {getPlatformIcon(log.platform)}
                    {log.recipient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2 mt-auto"
            asChild
          >
            <a
              href={translation.article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              {t("notifications.card.readOriginal")}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
