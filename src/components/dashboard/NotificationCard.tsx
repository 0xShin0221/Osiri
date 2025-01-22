import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageSquare, Pin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Database } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { DiscordIcon, EmailIcon, SlackIcon } from "../PlatformIcons";
import { MediaCard } from "./MediaCard";

type Translation = Database["public"]["Tables"]["translations"]["Row"];
type Article = Database["public"]["Tables"]["articles"]["Row"] & {
  feed: Database["public"]["Tables"]["rss_feeds"]["Row"];
};
type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];

interface TranslationWithRelations extends Translation {
  article: Article;
  notification_logs?: NotificationLog[];
}

interface NotificationCardProps {
  translation: TranslationWithRelations;
}

export function NotificationCard({ translation }: NotificationCardProps) {
  const { t } = useTranslation("dashboard");
  const [expanded, setExpanded] = useState(false);

  const platformIcons: Record<
    Database["public"]["Enums"]["notification_platform"],
    React.ReactNode
  > = {
    slack: <SlackIcon className="w-4 h-4" />,
    discord: <DiscordIcon className="w-4 h-4" />,
    email: <EmailIcon className="w-4 h-4" />,
    twitter: null,
    line: null,
    chatwork: null,
    kakaotalk: null,
    wechat: null,
    facebook_messenger: null,
    google_chat: null,
    whatsapp: null,
    telegram: null,
    webhook: null,
  };

  const statusVariants: Record<
    Database["public"]["Enums"]["translation_status"],
    string
  > = {
    completed: "bg-green-500",
    failed: "bg-red-500",
    processing: "bg-blue-500",
    pending: "bg-gray-500",
    skipped: "bg-yellow-500",
  };

  const successfulLogs =
    translation.notification_logs?.filter((log) => log.status === "success") ||
    [];

  const keyPoints = [
    translation.key_point1,
    translation.key_point2,
    translation.key_point3,
    translation.key_point4,
    translation.key_point5,
  ].filter(Boolean);

  const getStatusTranslation = (
    status: Database["public"]["Enums"]["translation_status"]
  ) => {
    /* i18next-extract-disable-next-line */
    return t(`notifications.status.${status}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header Image */}
        <div className="relative h-48">
          <MediaCard
            imageUrl={translation.article.og_image}
            fallbackImage="https://fkmjhtjgaeoqbgzpwxif.supabase.co/storage/v1/object/public/assets/osiri-loader-dark_caab40cf.gif?t=2025-01-22T04%3A27%3A38.464Z"
            className="h-full"
            onError={() => {
              console.warn(
                `Failed to load image for article: ${translation.article.url}`
              );
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <Badge className={statusVariants[translation.status]}>
              {getStatusTranslation(translation.status)}
            </Badge>
            {translation.article.feed.categories
              ?.slice(0, 2)
              .map((category, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-black/50 backdrop-blur-sm text-white border-none"
                >
                  {category}
                </Badge>
              ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
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
          <h3 className="text-lg font-semibold mb-3">
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
            <p
              className={`text-sm text-muted-foreground ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {translation.summary}
            </p>
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
                    className="flex items-center gap-1"
                  >
                    {platformIcons[log.platform]}
                    <span className="text-xs">{log.recipient}</span>
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
