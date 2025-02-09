import { NotificationRepository } from "../../repositories/notification.repository";
import type { ServiceResponse } from "../../types/models";
import axios from "axios";
import type { Database } from "../../types/database.types";
import {
    createArticleMessage,
    createLimitNotificationMessage,
} from "../../templates/slack";
import { ConfigManager } from "../../lib/config";

export class SlackService {
    private repository: NotificationRepository;
    private readonly config = ConfigManager.getInstance().getSlackConfig();

    constructor() {
        this.repository = new NotificationRepository();
    }
    private async getValidAccessToken(
        connection:
            Database["public"]["Tables"]["workspace_connections"]["Row"],
    ): Promise<string> {
        try {
            // Validate token existence
            if (!connection.access_token) {
                throw new Error("No access token available");
            }
            if (!connection.refresh_token) {
                throw new Error("No refresh token available");
            }

            // Prepare form data for token refresh
            const params = new URLSearchParams({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                grant_type: "refresh_token",
                refresh_token: connection.refresh_token,
            });

            // Request new token from Slack OAuth endpoint
            const response = await axios.post<{
                ok: boolean;
                access_token: string;
                refresh_token: string;
                expires_in: number;
            }>("https://slack.com/api/oauth.v2.access", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            // Check if token refresh was successful
            if (!response.data.ok) {
                console.error(
                    "[SlackService] Token refresh response:",
                    response.data,
                );
                throw new Error(
                    `Failed to refresh token: ${"Unknown error"}`,
                );
            }

            // Update tokens in database
            await this.repository.updateWorkspaceConnectionTokens(
                connection.id,
                {
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    token_expires_at: new Date(
                        Date.now() + response.data.expires_in * 1000,
                    ).toISOString(),
                },
            );

            return response.data.access_token;
        } catch (error) {
            // Enhanced error logging for debugging
            if (axios.isAxiosError(error)) {
                console.error("[SlackService] HTTP Error:", {
                    status: error.response?.status,
                    data: error.response?.data,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        headers: error.config?.headers,
                    },
                });
            } else {
                console.error("[SlackService] Non-HTTP Error:", error);
            }
            throw error;
        }
    }

    async sendMessage(
        articleId: string,
        channel: Database["public"]["Tables"]["notification_channels"]["Row"],
    ): Promise<ServiceResponse<void>> {
        try {
            console.log("[SlackService] Starting sendMessage:", {
                articleId,
                channelId: channel.id,
                workspaceConnectionId: channel.workspace_connection_id,
                language: channel.notification_language,
            });

            if (!channel.workspace_connection_id) {
                console.error(
                    "[SlackService] No workspace connection ID found for channel:",
                    channel.id,
                );
                throw new Error(
                    "Channel has no associated workspace connection",
                );
            }

            // Get translation
            console.log(
                "[SlackService] Fetching translation for article:",
                articleId,
            );
            const { data: translation, error: translationError } = await this
                .repository.getTranslation(
                    articleId,
                    channel.notification_language,
                );

            if (translationError || !translation) {
                console.error(
                    "[SlackService] Translation error or not found:",
                    {
                        error: translationError,
                        articleId,
                        language: channel.notification_language,
                    },
                );
                throw new Error(translationError || "Translation not found");
            }
            console.log("[SlackService] Translation found:", {
                translationId: translation.id,
                status: translation.status,
            });

            // Get article
            console.log("[SlackService] Fetching article:", articleId);
            const { data: article, error: articleError } = await this.repository
                .getArticle(articleId);

            if (articleError || !article) {
                console.error("[SlackService] Article error or not found:", {
                    error: articleError,
                    articleId,
                });
                throw new Error(articleError || "Article not found");
            }
            console.log("[SlackService] Article found:", {
                articleId: article.id,
                url: article.url,
            });

            // Get workspace connection
            console.log(
                "[SlackService] Fetching workspace connection:",
                channel.workspace_connection_id,
            );
            const { data: connection, error: connectionError } = await this
                .repository.getWorkspaceConnection(
                    channel.workspace_connection_id,
                );

            if (connectionError || !connection?.access_token) {
                console.error("[SlackService] Workspace connection error:", {
                    error: connectionError,
                    connectionId: channel.workspace_connection_id,
                    hasAccessToken: !!connection?.access_token,
                });
                throw new Error("Workspace connection not found or invalid");
            }
            console.log(
                "[SlackService] Workspace connection found,",
                connection,
            );
            console.log(
                "[SlackService] Workspace connection found, getting valid access token",
            );

            // Get valid access token
            const accessToken = await this.getValidAccessToken(connection);
            console.log("[SlackService] Valid access token obtained");

            // Create and send message
            const message = createArticleMessage(translation, article.url);
            console.log("[SlackService] Sending message to Slack:", {
                channelId: channel.channel_identifier_id,
                messageLength: JSON.stringify(message).length,
            });

            const response = await axios.post(
                "https://slack.com/api/chat.postMessage",
                {
                    channel: channel.channel_identifier_id,
                    ...message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
            );

            console.log("[SlackService] Slack API response:", {
                ok: response.data.ok,
                error: response.data.error,
                warning: response.data.warning,
                messageTs: response.data.ts,
            });

            if (!response.data.ok) {
                console.error("[SlackService] Slack API error:", {
                    error: response.data.error,
                    warning: response.data.warning,
                    responseData: response.data,
                });
                throw new Error(
                    response.data.error || "Failed to send message",
                );
            }

            console.log("[SlackService] Message sent successfully");
            return { success: true };
        } catch (error) {
            // Enhanced error logging
            if (axios.isAxiosError(error)) {
                console.error("[SlackService] Axios error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        baseURL: error.config?.baseURL,
                        headers: error.config?.headers,
                    },
                });
            }
            console.error("[SlackService] Error in sendMessage:", {
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
            if (!channel.workspace_connection_id) {
                throw new Error(
                    "Channel has no associated workspace connection",
                );
            }

            const { data: status } = await this.repository
                .getOrganizationSubscriptionStatus(channel.organization_id);

            if (!status) {
                throw new Error("Organization status not found");
            }

            const { data: connection, error: connectionError } = await this
                .repository.getWorkspaceConnection(
                    channel.workspace_connection_id,
                );

            if (connectionError || !connection?.access_token) {
                throw new Error("Workspace connection not found or invalid");
            }

            const accessToken = await this.getValidAccessToken(connection);

            const message = createLimitNotificationMessage(
                status,
                channel.notification_language,
            );

            const response = await axios.post(
                "https://slack.com/api/chat.postMessage",
                {
                    channel: channel.channel_identifier_id,
                    ...message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
            );

            if (!response.data.ok) {
                throw new Error(
                    response.data.error || "Failed to send limit notification",
                );
            }

            return { success: true };
        } catch (error) {
            console.error(
                "[SlackService] Error sending limit notification:",
                error,
            );
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
