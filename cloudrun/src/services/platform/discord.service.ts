// src/services/platform/discord.service.ts

import { NotificationRepository } from "../../repositories/notification.repository";
import type { ServiceResponse } from "../../types/models";
import axios from "axios";
import type { Database } from "../../types/database.types";
import {
    createArticleMessage,
    createLimitNotificationMessage,
} from "../../templates/discord";
import { ConfigManager } from "../../lib/config";

export class DiscordService {
    private repository: NotificationRepository;
    private readonly config = ConfigManager.getInstance().getDiscordConfig();
    private readonly botToken: string;

    constructor() {
        this.repository = new NotificationRepository();
        this.botToken = this.config.botToken;

        if (!this.botToken) {
            throw new Error("Discord bot token not configured");
        }
    }

    async sendMessage(
        articleId: string,
        channel: Database["public"]["Tables"]["notification_channels"]["Row"],
    ): Promise<ServiceResponse<void>> {
        try {
            console.log("[DiscordService] Starting sendMessage:", {
                articleId,
                channelId: channel.id,
                workspaceConnectionId: channel.workspace_connection_id,
                language: channel.notification_language,
            });

            if (!channel.channel_identifier_id) {
                console.error(
                    "[DiscordService] No channel identifier found for channel:",
                    channel.id,
                );
                throw new Error("Channel has no identifier");
            }

            // Get translation
            const { data: translation, error: translationError } = await this
                .repository.getTranslation(
                    articleId,
                    channel.notification_language,
                );

            if (translationError || !translation) {
                console.error(
                    "[DiscordService] Translation error or not found:",
                    {
                        error: translationError,
                        articleId,
                        language: channel.notification_language,
                    },
                );
                throw new Error(translationError || "Translation not found");
            }

            // Get article
            const { data: article, error: articleError } = await this.repository
                .getArticle(articleId);

            if (articleError || !article) {
                console.error("[DiscordService] Article error or not found:", {
                    error: articleError,
                    articleId,
                });
                throw new Error(articleError || "Article not found");
            }

            // Create and send message
            const message = createArticleMessage(translation, article.url);

            const response = await axios.post(
                `https://discord.com/api/v10/channels/${channel.channel_identifier_id}/messages`,
                message,
                {
                    headers: {
                        Authorization: `Bot ${this.botToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status !== 200) {
                console.error("[DiscordService] Discord API error:", {
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data,
                });
                throw new Error(
                    `Discord API Error: ${response.status} - ${response.statusText}`,
                );
            }

            console.log("[DiscordService] Message sent successfully");
            return { success: true };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("[DiscordService] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            console.error("[DiscordService] Error in sendMessage:", {
                error: error instanceof Error
                    ? {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                    }
                    : error,
            });
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    async sendLimitNotification(
        channel: Database["public"]["Tables"]["notification_channels"]["Row"],
    ): Promise<ServiceResponse<void>> {
        try {
            const { data: status } = await this.repository
                .getOrganizationSubscriptionStatus(channel.organization_id);

            if (!status) {
                throw new Error("Organization status not found");
            }

            if (!channel.channel_identifier_id) {
                throw new Error("Channel has no identifier");
            }

            const message = createLimitNotificationMessage(
                status,
                channel.notification_language,
            );

            const response = await axios.post(
                `https://discord.com/api/v10/channels/${channel.channel_identifier_id}/messages`,
                message,
                {
                    headers: {
                        Authorization: `Bot ${this.botToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status !== 200) {
                throw new Error(
                    `Failed to send limit notification: ${response.status} - ${response.statusText}`,
                );
            }

            await this.repository.updateOrganizationLimitNotification(
                channel.organization_id,
            );

            return { success: true };
        } catch (error) {
            console.error(
                "[DiscordService] Error sending limit notification:",
                error,
            );
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
