// src/templates/discord.ts

import type { Database } from "../types/database.types";
import { getLimitNotificationMessages } from "./limitNotification.i18n";

type Translation = Database["public"]["Tables"]["translations"]["Row"];
type OrganizationStatus =
    Database["public"]["Views"]["organization_subscription_status"]["Row"];
type FeedLanguage = Database["public"]["Enums"]["feed_language"];

interface DiscordEmbed {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>;
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    footer?: {
        text: string;
        icon_url?: string;
    };
    timestamp?: string;
}

interface DiscordMessage {
    content?: string;
    embeds?: DiscordEmbed[];
    components?: any[]; // For buttons and other interactive components
}

// Function to safely truncate text while preserving words
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength - 3).trim();
    return `${truncated.replace(/[^\.!\?]\s+\S*$/, "")}...`;
};

// Discord color constants
const COLORS = {
    PRIMARY: 0x5865F2, // Discord Blurple
    SUCCESS: 0x57F287, // Green
    WARNING: 0xFEE75C, // Yellow
    DANGER: 0xED4245, // Red
    DEFAULT: 0x2F3136, // Dark theme background
};

export const createArticleMessage = (
    translation: Translation,
    article_url: string,
): DiscordMessage => {
    const embed: DiscordEmbed = {
        title: truncateText(translation.title || "No title", 256), // Discord's title limit
        url: article_url,
        color: COLORS.PRIMARY,
        timestamp: new Date().toISOString(),
    };

    // Add summary if exists
    if (translation.summary) {
        embed.description = translation.summary;
    } else if (translation.content) {
        // Truncate content if too long (Discord's description limit is 4096 characters)
        embed.description = truncateText(translation.content, 4000);
    }

    // Add key points if they exist
    const keyPoints = [
        translation.key_point1,
        translation.key_point2,
        translation.key_point3,
        translation.key_point4,
        translation.key_point5,
    ].filter(Boolean);

    if (keyPoints.length > 0) {
        embed.fields = [{
            name: "Key Points",
            value: keyPoints.map((point) => `• ${point}`).join("\n"),
        }];
    }

    // Add footer
    embed.footer = {
        text: "Osiri News",
        icon_url: "https://o-siri.com/icon.png", // Make sure this exists
    };

    return {
        embeds: [embed],
    };
};

export const createLimitNotificationMessage = (
    status: OrganizationStatus,
    language: FeedLanguage = "en",
): DiscordMessage => {
    const messages = getLimitNotificationMessages(language);
    const baseUrl = "https://o-siri.com";

    const embed: DiscordEmbed = {
        title: messages.header,
        description: messages.limitReachedMessage,
        color: COLORS.WARNING,
        fields: [
            {
                name: messages.plan,
                value: status.plan_name || "Free Plan",
                inline: true,
            },
            {
                name: messages.dailyLimit,
                value: `${status.base_notifications_per_day} notifications/day`,
                inline: true,
            },
            {
                name: messages.usageStats,
                value: `${
                    status.notifications_used_this_month || 0
                }/${status.base_notifications_per_day}`,
                inline: true,
            },
            {
                name: "💡 Upgrade Info",
                value: messages.upgradeHint,
            },
        ],
        footer: {
            text: `Visit ${baseUrl} for more information`,
            icon_url: "https://o-siri.com/icon.png",
        },
        timestamp: new Date().toISOString(),
    };

    // Note: Discord buttons would require interaction endpoints
    // For now, we'll include the upgrade link in the message
    return {
        embeds: [embed],
        content: `${messages.upgradeButton}: ${baseUrl}/settings/subscription`,
    };
};

// Helper function to get emoji for each platform
export const getPlatformEmoji = (platform: string): string => {
    const emojis: Record<string, string> = {
        discord: "🎮",
        slack: "💬",
        email: "📧",
        webhook: "🔗",
    };
    return emojis[platform] || "📢";
};
