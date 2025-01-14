import e from "express";
import { NotificationRepository } from "../repositories/notification.repository";
import type { ServiceResponse } from "../types/models";
import axios from "axios";
import type { Database } from "../types/database.types";

export class SlackService {
    private repository: NotificationRepository;

    constructor() {
        this.repository = new NotificationRepository();
    }

    async sendMessageToChannel(
        channelId: string,
        message: string,
    ): Promise<ServiceResponse<void>> {
        try {
            // Get channel details
            const { data: channel, error: channelError } = await this.repository
                .getChannelById(channelId);
            if (channelError || !channel) {
                throw new Error(channelError || "Channel not found");
            }

            // Get workspace connection
            if (!channel.workspace_connection_id) {
                throw new Error(
                    "Channel has no associated workspace connection",
                );
            }

            const { data: connection, error: connectionError } = await this
                .repository.getWorkspaceConnection(
                    channel.workspace_connection_id,
                );

            if (connectionError || !connection?.access_token) {
                throw new Error(
                    connectionError ||
                        "Workspace connection not found or invalid",
                );
            }
            if (
                channel.platform !== "slack" || !channel.channel_identifier_id
            ) {
                throw new Error(
                    "Channel is not a slack channel or channel identifier is not provided",
                );
            }
            console.log("req details", {
                channel: channel.channel_identifier_id,
                text: message,
            }, {
                headers: {
                    Authorization: `Bearer ${connection.access_token}`,
                    "Content-Type": "application/json",
                },
            });
            // Send message to Slack
            const response = await axios.post(
                "https://slack.com/api/chat.postMessage",
                {
                    channel: channel.channel_identifier_id,
                    text: message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${connection.access_token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.data.ok) {
                throw new Error(
                    response.data.error || "Failed to send message",
                );
            }

            await this.repository.logNotification(
                channelId,
                "success",
                channel.channel_identifier_id,
            );

            return { success: true };
        } catch (error) {
            // Log failed notification
            await this.repository.logNotification(
                channelId,
                "failed",
                "",
                error instanceof Error ? error.message : "Unknown error",
            );

            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    async processArticleNotifications(): Promise<ServiceResponse<void>> {
        try {
            // 1. Get unsent articles
            const { data: articles, error: articlesError } = await this
                .repository.getUnsentArticles();
            if (articlesError || !articles) {
                throw new Error(articlesError || "No articles found");
            }

            console.log("articles", articles);

            // 2. Get channels for each article
            // for (const article of articles) {
            //     const { data: channels, error: channelsError } = await this
            //         .repository.getChannelsForFeed(article.article.feed_id);
            //     if (channelsError) {
            //         console.error(
            //             `Error getting channels for feed ${article.article.feed_id}:`,
            //             channelsError,
            //         );
            //         continue;
            //     }

            //     // 3. Send message to each channel
            //     for (const channel of channels || []) {
            //         const message = this.formatArticleMessage(
            //             article.article,
            //             article.translation,
            //         );
            //         await this.sendMessageToChannel(channel.id, message);
            //     }
            // }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    private formatArticleMessage(
        article: Database["public"]["Tables"]["articles"]["Row"],
        translation: Database["public"]["Tables"]["translations"]["Row"],
    ): string {
        return `
*${translation.title || article.title}*

${translation.summary || translation.content || article.content}

${article.url}
    `.trim();
    }
}
