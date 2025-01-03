import { LANGUAGE_EMOJIS } from "./languages.ts";
import {
  NotificationTemplate,
  SlackPayload,
  TemplateConfigs,
} from "./database.types.ts";

/**
 * Template-specific notification settings
 */
const TEMPLATE_CONFIGS: TemplateConfigs = {
  "early-access": {
    title: "New Waitlist Registration",
    showData: false,
    emoji: "🎉",
  },
  "contact": {
    title: "New Contact Request",
    showData: true,
    emoji: "📧",
  },
  "feedback": {
    title: "New Feedback Received",
    showData: true,
    emoji: "💫",
  },
  "newsletter": {
    title: "New Newsletter Subscription",
    showData: false,
    emoji: "📮",
  },
  "default": {
    title: "New Notification",
    showData: true,
    emoji: "📫",
  },
} as const;

/**
 * Get the appropriate Slack webhook URL based on the template type
 */
const getWebhookUrl = (template: NotificationTemplate): string | null => {
  const webhookMap: Record<NotificationTemplate, string | undefined> = {
    "early-access": Deno.env.get("SLACK_WAITLIST_WEBHOOK_URL"),
    "contact": Deno.env.get("SLACK_CONTACT_WEBHOOK_URL"),
    "feedback": Deno.env.get("SLACK_FEEDBACK_WEBHOOK_URL"),
    "newsletter": Deno.env.get("SLACK_NEWSLETTER_WEBHOOK_URL"),
  };

  const webhookUrl = webhookMap[template];
  if (!webhookUrl) {
    console.info(`Slack webhook URL for template "${template}" is not set.`);
    return null;
  }

  return webhookUrl;
};

/**
 * Sends a notification to Slack
 * @param payload The notification payload containing details
 * @returns Promise<Response | null> The Slack API response or null if notification fails
 */
export async function slackNotify(
  payload: SlackPayload,
): Promise<Response | null> {
  const { email, language = "en", template = "early-access", data } = payload;

  const SLACK_WEBHOOK_URL = getWebhookUrl(template);
  if (!SLACK_WEBHOOK_URL) {
    return null;
  }

  try {
    const languageEmoji = LANGUAGE_EMOJIS[language] || "🌐";
    const templateConfig = TEMPLATE_CONFIGS[template] ||
      TEMPLATE_CONFIGS.default;

    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${templateConfig.emoji} ${templateConfig.title}`,
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Email:*\n${email || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Language:*\n${languageEmoji} ${language}`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Template:*\n${template}`,
          },
          {
            type: "mrkdwn",
            text: `*Timestamp:*\n${new Date().toISOString()}`,
          },
        ],
      },
    ];

    if (templateConfig.showData && data && Object.keys(data).length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Additional Data:*\n\`\`\`${
            JSON.stringify(data, null, 2)
          }\`\`\``,
        },
      });
    }

    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blocks,
        text: `${templateConfig.emoji} ${templateConfig.title} from ${
          email || "unknown"
        } (${language})`,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to send Slack notification: ${response.statusText}`,
      );
    }

    console.info("Slack notification sent successfully");
    return response;
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return null;
  }
}
