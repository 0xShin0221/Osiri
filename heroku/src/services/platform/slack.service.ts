import { NotificationRepository } from "../../repositories/notification.repository";
import type { ServiceResponse } from "../../types/models";
import axios from "axios";
import type { Database } from "../../types/database.types";
import { createArticleMessage } from "../../templates/slack";

export class SlackService {
    private repository: NotificationRepository;

    constructor() {
        this.repository = new NotificationRepository();
    }

    async sendMessage(
        articleId: string,
        channel: Database["public"]["Tables"]["notification_channels"]["Row"],
    ): Promise<ServiceResponse<void>> {
        try {
            if (!channel.workspace_connection_id) {
                throw new Error(
                    "Channel has no associated workspace connection",
                );
            }

            // Get translation todo: move to service
            const { data: translation, error: translationError } = await this
                .repository.getTranslation(
                    articleId,
                    channel.notification_language,
                );

            if (translationError || !translation) {
                console.error(
                    "[SlackService] Error getting translation:",
                    translationError,
                );
                throw new Error(translationError || "Translation not found");
            }
            const { data: article, error: articleError } = await this.repository
                .getArticle(articleId);

            if (articleError || !article) {
                throw new Error(articleError || "Article not found");
            }
            // Get workspace connection
            const { data: connection, error: connectionError } = await this
                .repository.getWorkspaceConnection(
                    channel.workspace_connection_id,
                );

            if (connectionError || !connection?.access_token) {
                console.error(
                    "[SlackService] Error getting workspace connection:",
                    connectionError,
                );
                throw new Error("Workspace connection not found or invalid");
            }

            const message = createArticleMessage(translation, article.url);
            console.log("[SlackService] Sending message:", message);
            const response = await axios.post(
                "https://slack.com/api/chat.postMessage",
                {
                    channel: channel.channel_identifier_id,
                    ...message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${connection.access_token}`,
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
            );
            console.log("response", response.data);
            if (!response.data.ok) {
                console.error(
                    "[SlackService] Error sending message:",
                    response.data.error,
                );
                throw new Error(
                    response.data.error || "Failed to send message",
                );
            }

            return { success: true };
        } catch (error) {
            console.error("[SlackService] Error sending message:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
