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
    ) {}

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
        // Group channels by platform
        const channelsByPlatform = channels.reduce((acc, channel) => {
            const platform = channel.platform;
            if (!acc[platform]) {
                acc[platform] = [];
            }
            acc[platform].push(channel);
            return acc;
        }, {} as Record<NotificationPlatform, NotificationChannel[]>);

        // Process each platform's channels
        for (
            const [platform, platformChannels] of Object.entries(
                channelsByPlatform,
            )
        ) {
            const processor = this.processors[platform as NotificationPlatform];
            if (!processor) {
                console.warn(`No processor found for platform: ${platform}`);
                continue;
            }

            // Process each channel
            for (const channel of platformChannels) {
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
                } else {
                    platformStat.failed++;
                    status.failedCount++;
                    status.errors.push({
                        stage: "notification_process",
                        error: result.error || "Unknown error",
                        platform: platform as NotificationPlatform,
                        channelId: channel.id,
                        articleId: notification.article_id || undefined,
                    });
                }
            }
        }
    }

    async processNotifications(
        onProgress?: (status: NotificationBatchStatus) => void,
    ): Promise<ServiceResponse<NotificationBatchStatus>> {
        const status = this.createEmptyBatchStatus();

        try {
            // Get pending notifications
            const { data: pendingResult, error: pendingError } = await this
                .notificationRepo.createPendingNotifications();

            if (pendingError || !pendingResult?.newNotifications?.length) {
                return { success: true, data: status };
            }

            // Filter and limit notifications
            const notifications = pendingResult.newNotifications
                .filter((log): log is NotificationLog => !!log.id)
                .slice(0, this.BATCH_SIZE);

            status.processedCount = notifications.length;

            // Process each notification
            for (const notification of notifications) {
                const { data: channels, error: channelsError } = await this
                    .notificationRepo.getActiveChannelsFromArticleId(
                        notification.article_id!,
                    );

                if (channelsError || !channels?.length) {
                    status.errors.push({
                        stage: "channel_fetch",
                        error: channelsError || "No active channels found",
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
                    await this.processChannelBatch(
                        channelBatch,
                        notification,
                        status,
                    );
                    onProgress?.(status);
                }
            }

            // Reset processors for next batch
            Object.values(this.processors).forEach((processor) =>
                processor.reset()
            );

            return { success: true, data: status };
        } catch (error) {
            console.error("Error in processNotifications:", error);
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
