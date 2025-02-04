import type { Database } from "../types/database.types";
import type {
    ContextBlock,
    DividerBlock,
    HeaderBlock,
    SectionBlock,
    SlackMessage,
} from "../types/slack";

type Translation = Database["public"]["Tables"]["translations"]["Row"];
type OrganizationStatus =
    Database["public"]["Views"]["organization_subscription_status"]["Row"];

// Function to safely truncate text while preserving words
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength - 3).trim();
    return `${truncated.replace(/[^\.!\?]\s+\S*$/, "")}...`;
};

export const createArticleMessage = (
    translation: Translation,
    article_url: string,
): SlackMessage => {
    // Truncate title for header (Slack limit is 150 chars)
    const headerTitle = truncateText(translation.title || "No title", 150);

    const blocks: (HeaderBlock | DividerBlock | SectionBlock | ContextBlock)[] =
        [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: headerTitle,
                    emoji: true,
                },
            },
        ];

    // If title was truncated, add full title in a section block
    if (headerTitle !== translation.title) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*Full Title:*\n${translation.title}`,
            },
        });
    }

    // Add summary if exists, handling line breaks correctly
    if (translation.summary) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*:memo: Summary*\n\n${
                    translation.summary.replace(/\n/g, "\n\n")
                }`,
            },
        });
    } else if (translation.content) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*:memo: Content*\n\n${
                    translation.content.replace(/\n/g, "\n\n")
                }`,
            },
        });
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
        blocks.push(
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*:pushpin: Key Points*",
                },
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: keyPoints.map((point) => `• ${point}`).join("\n\n"),
                },
            },
        );
    }

    // Add link to article
    blocks.push({
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: `:link: <${article_url}|Read full article> • :calendar: ${
                    new Date().toLocaleDateString()
                }`,
            },
        ],
    });

    return {
        blocks,
        text: headerTitle,
    };
};

export const createLimitNotificationMessage = (
    status: OrganizationStatus,
): SlackMessage => {
    return {
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "🚨 Daily Notification Limit Reached",
                    emoji: true,
                },
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text:
                        `The daily notification limit (${status.base_notifications_per_day}) has been reached. Notifications will resume tomorrow.`,
                },
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Plan:*\n${status.plan_name || "Current Plan"}`,
                    },
                    {
                        type: "mrkdwn",
                        text:
                            `*Daily Limit:*\n${status.base_notifications_per_day} notifications`,
                    },
                ],
            },
            {
                type: "divider",
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text:
                            "💡 Consider upgrading your plan if you need more notifications.",
                    },
                ],
            },
        ],
        text: "Daily Notification Limit Reached", // フォールバックテキスト
    };
};
