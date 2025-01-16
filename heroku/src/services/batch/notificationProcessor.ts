import type { NotificationRepository } from "../../repositories/notification.repository";
import type { Database } from "../../types/database.types";
import type { ServiceResponse } from "../../types/models";
import type { SlackService } from "../platform/slack.service";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];

const API_DELAY_MS = 1100;

export class NotificationBatchProcessor {
    constructor(
        private notificationRepo: NotificationRepository,
        private slackService: SlackService,
    ) {}

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
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

            // 2. For each pending notification, get channels
            for (const log of logs) {
                try {
                    if (!log.article_id) continue;

                    const { data: channels, error: channelsError } = await this
                        .notificationRepo
                        .getActiveChannelsFromArticleId(log.article_id);

                    if (channelsError || !channels?.length) {
                        console.log(
                            `[NotificationBatch] No active channels for article ${log.article_id}`,
                        );
                        await this.notificationRepo.updateNotificationStatus(
                            log.id,
                            "skipped",
                            "",
                            channelsError || "No active channels found",
                        );
                        continue;
                    }

                    const lastSentTime: Record<string, number> = {};

                    console.log(
                        "[NotificationBatch] Processing notification channels",
                        channels,
                    );

                    // 3. Send to each channel based on platform
                    for (const channel of channels) {
                        console.log(
                            "[NotificationBatch] Sending to channel",
                            channel,
                        );
                        const channelId = channel.channel_identifier_id;
                        if (!channelId) {
                            console.error(
                                "[NotificationBatch] Channel has no identifier",
                            );
                            await this.notificationRepo
                                .updateNotificationStatus(
                                    log.id,
                                    "failed",
                                    channel.channel_identifier,
                                    "Channel has no identifier",
                                );
                            continue;
                        }
                        try {
                            switch (channel.platform) {
                                case "slack": {
                                    const now = Date.now();
                                    const lastSent = lastSentTime[channelId] ||
                                        0;
                                    const timeSinceLastSent = now - lastSent;

                                    // Calculate the necessary delay time
                                    if (timeSinceLastSent < API_DELAY_MS) {
                                        const delayNeeded = API_DELAY_MS -
                                            timeSinceLastSent;
                                        await this.delay(delayNeeded);
                                    }

                                    await this.slackService.sendMessage(
                                        log.article_id,
                                        channel,
                                    );
                                    lastSentTime[channelId] = Date.now();

                                    await this.notificationRepo
                                        .updateNotificationStatus(
                                            log.id,
                                            "success",
                                            channel.channel_identifier,
                                        );
                                    break;
                                }
                                default:
                                    console.log(
                                        `[NotificationBatch] Unsupported platform: ${channel.platform}`,
                                    );
                            }
                        } catch (error) {
                            console.error(
                                `[NotificationBatch] Error sending to channel ${channel.id}:`,
                                error,
                            );
                            await this.notificationRepo
                                .updateNotificationStatus(
                                    log.id,
                                    "failed",
                                    channel.channel_identifier,
                                    error instanceof Error
                                        ? error.message
                                        : "Unknown error",
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
