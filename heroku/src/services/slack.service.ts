import e from "express";
import { NotificationRepository } from "../repositories/notification.repository";
import type { ServiceResponse } from "../types/models";
import axios from "axios";

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
}
