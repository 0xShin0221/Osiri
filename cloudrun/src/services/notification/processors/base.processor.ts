// src/services/notification/processors/base.processor.ts
import type { NotificationRepository } from "../../../repositories/notification.repository";

import type {
    NotificationProcessor,
    ProcessorStats,
} from "../interfaces/notification-processor.interface";

import { Database } from "../../../types/database.types";
import { PlatformConfig } from "../interfaces/platform-config.interface.ts";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];
type NotificationStatus = Database["public"]["Enums"]["notification_status"];
type NotificationChannel =
    Database["public"]["Tables"]["notification_channels"]["Row"];

export abstract class BaseNotificationProcessor
    implements NotificationProcessor {
    protected stats: ProcessorStats = {
        processed: 0,
        success: 0,
        failed: 0,
        errors: [],
    };

    constructor(
        protected readonly config: PlatformConfig,
        protected readonly notificationRepo: NotificationRepository,
    ) {}

    // Template method pattern - subclasses must implement this
    protected abstract sendNotification(
        notification: NotificationLog,
        channel: NotificationChannel,
    ): Promise<void>;

    async processNotification(
        notification: NotificationLog,
        channel: NotificationChannel,
    ) {
        this.stats.processed++;

        try {
            const { isWithinLimit, shouldNotify } = await this
                .checkNotificationLimit(channel);

            if (!isWithinLimit) {
                if (shouldNotify) {
                    await this.sendLimitNotification(channel);
                }
                return { success: false, error: "Rate limit exceeded" };
            }

            let retryCount = 0;
            while (retryCount < this.config.maxRetries) {
                try {
                    await this.sendNotification(notification, channel);
                    this.stats.success++;
                    return { success: true };
                } catch (error) {
                    retryCount++;
                    if (retryCount < this.config.maxRetries) {
                        await this.delay(
                            this.config.retryDelayMs * Math.pow(2, retryCount),
                        );
                    }
                }
            }

            // All retries failed
            const error = `Failed after ${this.config.maxRetries} attempts`;
            this.stats.failed++;
            this.stats.errors.push({
                channelId: channel.id,
                error,
                retryable: false,
            });

            return { success: false, error, retryable: false };
        } catch (error) {
            this.stats.failed++;
            this.stats.errors.push({
                channelId: channel.id,
                error: error instanceof Error ? error.message : "Unknown error",
                retryable: true,
            });

            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
                retryable: true,
            };
        }
    }

    async updateStatus(
        notificationId: string,
        status: NotificationStatus,
        channel: NotificationChannel,
        error?: string,
    ): Promise<void> {
        await this.notificationRepo.updateNotificationStatus(
            notificationId,
            status,
            channel.channel_identifier,
            error,
            channel.platform,
            channel.organization_id,
        );

        if (status === "success") {
            await this.notificationRepo.incrementNotificationCount(
                channel.organization_id,
            );
        }
    }

    getStats(): ProcessorStats {
        return { ...this.stats };
    }

    reset(): void {
        this.stats = {
            processed: 0,
            success: 0,
            failed: 0,
            errors: [],
        };
    }

    protected async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async checkNotificationLimit(
        channel: NotificationChannel,
    ): Promise<{
        isWithinLimit: boolean;
        shouldNotify: boolean;
    }> {
        const { data: status } = await this.notificationRepo
            .getOrganizationSubscriptionStatus(channel.organization_id);

        if (!status?.base_notifications_per_day) {
            return { isWithinLimit: true, shouldNotify: false };
        }

        const usedToday = await this.notificationRepo
            .getNotificationsUsedToday(channel.organization_id);

        const isWithinLimit = usedToday < status.base_notifications_per_day;

        if (!isWithinLimit) {
            const { data: shouldNotify } = await this.notificationRepo
                .shouldSendLimitNotification(channel.organization_id);
            return { isWithinLimit, shouldNotify: shouldNotify || false };
        }

        return { isWithinLimit: true, shouldNotify: false };
    }

    protected abstract sendLimitNotification(
        channel: NotificationChannel,
    ): Promise<void>;
}
