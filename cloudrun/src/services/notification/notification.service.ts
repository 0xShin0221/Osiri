// src/services/notification/notification.service.ts
import type { NotificationRepository } from "../../repositories/notification.repository";
import type { Database } from "../../types/database.types";
import type { ServiceResponse } from "../../types/models";
import type { NotificationProcessor } from "./interfaces/notification-processor.interface";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];
type NotificationChannel =
    Database["public"]["Tables"]["notification_channels"]["Row"];
type NotificationPlatform =
    Database["public"]["Enums"]["notification_platform"];

interface NotificationBatchStatus {
    processedCount: number;
    successCount: number;
    failedCount: number;
    platformStats: Record<NotificationPlatform, {
        processed: number;
        success: number;
        failed: number;
    }>;
    errors: Array<{
        stage: string;
        error: string;
        platform?: NotificationPlatform;
        channelId?: string;
        articleId?: string;
    }>;
}

export class NotificationService {
    private readonly BATCH_SIZE = 50;
    private readonly CHANNEL_BATCH_SIZE = 20;

    constructor(
        private readonly notificationRepo: NotificationRepository,
        private readonly processors: Record<
            NotificationPlatform,
            NotificationProcessor
        >,
        private readonly logger = console,
    ) {
        // Log available processors on initialization
        this.logger.info(
            `NotificationService initialized with processors: ${
                Object.keys(processors).join(", ")
            }`,
        );
    }

    private createEmptyBatchStatus(): NotificationBatchStatus {
        const platformStats = Object.keys(this.processors).reduce(
            (acc, platform) => {
                acc[platform as NotificationPlatform] = {
                    processed: 0,
                    success: 0,
                    failed: 0,
                };
                return acc;
            },
            {} as Record<
                NotificationPlatform,
                { processed: number; success: number; failed: number }
            >,
        );

        this.logger.debug(
            "Created empty batch status with platforms:",
            Object.keys(platformStats),
        );
        return {
            processedCount: 0,
            successCount: 0,
            failedCount: 0,
            platformStats,
            errors: [],
        };
    }

    private async processChannelBatch(
        channels: NotificationChannel[],
        notification: NotificationLog,
        status: NotificationBatchStatus,
    ): Promise<void> {
        this.logger.info(
            `Processing channel batch for notification ${notification.id}. Channels count: ${channels.length}`,
        );

        // Group channels by platform
        const channelsByPlatform = channels.reduce((acc, channel) => {
            const platform = channel.platform;
            if (!acc[platform]) {
                acc[platform] = [];
            }
            acc[platform].push(channel);
            return acc;
        }, {} as Record<NotificationPlatform, NotificationChannel[]>);

        this.logger.debug(
            "Grouped channels by platform:",
            Object.entries(channelsByPlatform).map(([platform, channels]) =>
                `${platform}: ${channels.length} channels`
            ),
        );

        // Process each platform's channels
        for (
            const [platform, platformChannels] of Object.entries(
                channelsByPlatform,
            )
        ) {
            const processor = this.processors[platform as NotificationPlatform];
            if (!processor) {
                this.logger.warn(
                    `No processor found for platform: ${platform}`,
                );
                continue;
            }

            this.logger.info(
                `Processing ${platformChannels.length} channels for platform ${platform}`,
            );

            // Process each channel
            for (const channel of platformChannels) {
                this.logger.debug(
                    `Processing channel ${channel.id} for platform ${platform}`,
                );

                const result = await processor.processNotification(
                    notification,
                    channel,
                );

                // Update notification status
                await processor.updateStatus(
                    notification.id,
                    result.success ? "success" : "failed",
                    channel,
                    result.error,
                );

                // Update stats
                const platformStat =
                    status.platformStats[platform as NotificationPlatform];
                platformStat.processed++;
                if (result.success) {
                    platformStat.success++;
                    status.successCount++;
                    this.logger.debug(
                        `Successfully processed notification for channel ${channel.id}`,
                    );
                } else {
                    platformStat.failed++;
                    status.failedCount++;
                    this.logger.error(
                        `Failed to process notification for channel ${channel.id}:`,
                        result.error,
                    );
                    status.errors.push({
                        stage: "notification_process",
                        error: result.error || "Unknown error",
                        platform: platform as NotificationPlatform,
                        channelId: channel.id,
                        articleId: notification.article_id || undefined,
                    });
                }
            }

            this.logger.info(
                `Completed processing for platform ${platform}. Success: ${
                    status.platformStats[platform as NotificationPlatform]
                        .success
                }, Failed: ${
                    status.platformStats[platform as NotificationPlatform]
                        .failed
                }`,
            );
        }
    }

    async processNotifications(
        onProgress?: (status: NotificationBatchStatus) => void,
    ): Promise<ServiceResponse<NotificationBatchStatus>> {
        this.logger.info("Starting notification batch processing");
        const status = this.createEmptyBatchStatus();

        try {
            // Get pending notifications
            this.logger.debug("Fetching pending notifications");
            const { data: pendingResult, error: pendingError } = await this
                .notificationRepo
                .createPendingNotifications();

            if (pendingError) {
                this.logger.error(
                    "Error fetching pending notifications:",
                    pendingError,
                );
                return { success: true, data: status };
            }

            if (!pendingResult?.newNotifications?.length) {
                this.logger.info("No pending notifications found");
                return { success: true, data: status };
            }

            // Filter and limit notifications
            const notifications = pendingResult.newNotifications
                .filter((log): log is NotificationLog => !!log.id)
                .slice(0, this.BATCH_SIZE);

            status.processedCount = notifications.length;
            this.logger.info(
                `Processing ${notifications.length} notifications`,
            );

            // Process each notification
            for (const notification of notifications) {
                this.logger.debug(`Processing notification ${notification.id}`);

                const { data: channels, error: channelsError } = await this
                    .notificationRepo
                    .getActiveChannelsFromArticleId(notification.article_id!);

                if (channelsError) {
                    this.logger.error(
                        `Error fetching channels for article ${notification.article_id}:`,
                        channelsError,
                    );
                    status.errors.push({
                        stage: "channel_fetch",
                        error: channelsError,
                        articleId: notification.article_id!,
                    });
                    continue;
                }

                if (!channels?.length) {
                    this.logger.warn(
                        `No active channels found for article ${notification.article_id}`,
                    );
                    status.errors.push({
                        stage: "channel_fetch",
                        error: "No active channels found",
                        articleId: notification.article_id!,
                    });
                    continue;
                }

                // Process channels in batches
                for (
                    let i = 0;
                    i < channels.length;
                    i += this.CHANNEL_BATCH_SIZE
                ) {
                    const channelBatch = channels.slice(
                        i,
                        i + this.CHANNEL_BATCH_SIZE,
                    );
                    this.logger.debug(
                        `Processing channel batch ${
                            i / this.CHANNEL_BATCH_SIZE + 1
                        } of ${
                            Math.ceil(channels.length / this.CHANNEL_BATCH_SIZE)
                        }`,
                    );

                    await this.processChannelBatch(
                        channelBatch,
                        notification,
                        status,
                    );
                    onProgress?.(status);
                }
            }

            // Reset processors for next batch
            this.logger.debug("Resetting processors for next batch");
            for (const processor of Object.values(this.processors)) {
                processor.reset();
            }

            this.logger.info("Completed notification batch processing", {
                processed: status.processedCount,
                success: status.successCount,
                failed: status.failedCount,
            });

            return { success: true, data: status };
        } catch (error) {
            this.logger.error("Critical error in processNotifications:", error);
            status.errors.push({
                stage: "batch_process",
                error: error instanceof Error ? error.message : "Unknown error",
            });

            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
                data: status,
            };
        }
    }
}
