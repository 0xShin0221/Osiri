import type { NotificationRepository } from "../../repositories/notification.repository";
import type { Database } from "../../types/database.types";
import type { ServiceResponse } from "../../types/models";
import type { SlackService } from "../platform/slack.service";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];
type NotificationChannel =
    Database["public"]["Tables"]["notification_channels"]["Row"];
type NotificationStatus = Database["public"]["Enums"]["notification_status"];

const API_DELAY_MS = 1100;

export class NotificationBatchProcessor {
    constructor(
        private notificationRepo: NotificationRepository,
        private slackService: SlackService,
    ) {}

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async updateNotificationWithChannel(
        logId: string,
        status: NotificationStatus,
        channel: NotificationChannel,
        error?: string,
    ): Promise<void> {
        console.log("[NotificationBatch] Updating notification status:", {
            logId,
            status,
            channelInfo: {
                id: channel.id,
                platform: channel.platform,
                identifier: channel.channel_identifier,
                identifierId: channel.channel_identifier_id,
            },
            error,
        });
        await this.notificationRepo.updateNotificationStatus(
            logId,
            status,
            channel.channel_identifier,
            error,
            channel.platform,
            channel.organization_id,
        );
    }

    async processNotifications(): Promise<ServiceResponse<void>> {
        try {
            const { data, error: logsError } = await this.notificationRepo
                .createPendingNotifications();

            if (logsError) {
                console.error(
                    "[NotificationBatch] Error getting pending notifications:",
                    logsError,
                );
                throw new Error(logsError);
            }

            if (!data || !data.newNotifications?.length) {
                console.log(
                    "[NotificationBatch] No pending notifications found",
                );
                return { success: true };
            }

            const logs = data.newNotifications.filter((
                log,
            ): log is NotificationLog => !!log.id);

            for (const log of logs) {
                try {
                    if (!log.article_id) continue;

                    const { data: channels, error: channelsError } = await this
                        .notificationRepo
                        .getActiveChannelsFromArticleId(log.article_id);

                    if (channelsError || !channels?.length) {
                        console.error(
                            `[NotificationBatch] No active channels for article ${log.article_id}:`,
                            channelsError,
                        );
                        continue;
                    }

                    for (const channel of channels) {
                        try {
                            switch (channel.platform) {
                                case "slack": {
                                    const {
                                        data: notifLog,
                                        error: createError,
                                    } = await this.notificationRepo
                                        .createNotificationLog({
                                            article_id: log.article_id,
                                            channel_id: channel.id,
                                            platform: channel.platform,
                                            organization_id:
                                                channel.organization_id,
                                            status: "pending",
                                            recipient:
                                                channel.channel_identifier_id ||
                                                "",
                                        });
                                    if (
                                        createError ===
                                            "Notification already exists and was successful"
                                    ) {
                                        console.log(
                                            `[NotificationBatch] Skipping existing successful notification for article ${log.article_id} and channel ${channel.id}`,
                                        );
                                        continue;
                                    }

                                    if (createError || !notifLog) {
                                        console.error(
                                            "[NotificationBatch] Error creating notification log:",
                                            createError,
                                        );
                                        continue;
                                    }

                                    try {
                                        await this.slackService.sendMessage(
                                            log.article_id,
                                            channel,
                                        );
                                        await this
                                            .updateNotificationWithChannel(
                                                notifLog.id,
                                                "success",
                                                channel,
                                            );
                                    } catch (error) {
                                        await this
                                            .updateNotificationWithChannel(
                                                notifLog.id,
                                                "failed",
                                                channel,
                                                error instanceof Error
                                                    ? error.message
                                                    : "Unknown error",
                                            );
                                        throw error;
                                    }
                                    break;
                                }
                                default:
                                    console.log(
                                        `[NotificationBatch] Unsupported platform: ${channel.platform}`,
                                    );
                            }
                        } catch (error) {
                            console.error(
                                `[NotificationBatch] Error processing channel ${channel.id}:`,
                                error,
                            );
                        }
                    }
                } catch (error) {
                    console.error(
                        `[NotificationBatch] Error processing notification ${log.id}:`,
                        error,
                    );
                }
            }

            return { success: true };
        } catch (error) {
            console.error(
                "[NotificationBatch] Error in processNotifications:",
                error,
            );
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
