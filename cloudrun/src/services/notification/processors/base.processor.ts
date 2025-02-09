// src/services/notification/processors/base.processor.ts
import type { NotificationRepository } from "../../../repositories/notification.repository";
import type {
    NotificationProcessor,
    ProcessorStats,
} from "../interfaces/notification-processor.interface";
import type { Database } from "../../../types/database.types";
import type { PlatformConfig } from "../interfaces/platform-config.interface.ts";

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
        protected readonly logger = console,
    ) {
        this.logger.info(`Initializing ${this.constructor.name} with config:`, {
            maxRetries: config.maxRetries,
            retryDelayMs: config.retryDelayMs,
        });
    }

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
        this.logger.debug(
            `Processing notification ${notification.id} for channel ${channel.id}`,
        );

        try {
            const { isWithinLimit, shouldNotify } = await this
                .checkNotificationLimit(channel);

            if (!isWithinLimit) {
                this.logger.warn(
                    `Rate limit exceeded for organization ${channel.organization_id}`,
                );
                if (shouldNotify) {
                    this.logger.info(
                        `Sending limit notification to organization ${channel.organization_id}`,
                    );
                    await this.sendLimitNotification(channel);
                }
                return { success: false, error: "Rate limit exceeded" };
            }

            let retryCount = 0;
            while (retryCount < this.config.maxRetries) {
                try {
                    this.logger.debug(
                        `Attempt ${
                            retryCount + 1
                        }/${this.config.maxRetries} to send notification`,
                    );
                    await this.sendNotification(notification, channel);
                    this.stats.success++;
                    this.logger.info(
                        `Successfully sent notification ${notification.id} to channel ${channel.id}`,
                    );
                    return { success: true };
                } catch (error) {
                    retryCount++;
                    this.logger.warn(`Attempt ${retryCount} failed:`, error);

                    if (retryCount < this.config.maxRetries) {
                        const delayMs = this.config.retryDelayMs *
                            (2 ** retryCount);
                        this.logger.debug(`Retrying in ${delayMs}ms`);
                        await this.delay(delayMs);
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

            this.logger.error(
                `All retry attempts failed for notification ${notification.id}`,
                {
                    channel: channel.id,
                    error,
                },
            );

            return { success: false, error, retryable: false };
        } catch (error) {
            this.stats.failed++;
            const errorMessage = error instanceof Error
                ? error.message
                : "Unknown error";

            this.stats.errors.push({
                channelId: channel.id,
                error: errorMessage,
                retryable: true,
            });

            this.logger.error(
                `Error processing notification ${notification.id}:`,
                {
                    error: errorMessage,
                    channel: channel.id,
                },
            );

            return {
                success: false,
                error: errorMessage,
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
        this.logger.debug(
            `Updating status for notification ${notificationId}`,
            {
                status,
                channel: channel.id,
                error,
            },
        );

        await this.notificationRepo.updateNotificationStatus(
            notificationId,
            status,
            channel.channel_identifier,
            error,
            channel.platform,
            channel.organization_id,
        );

        if (status === "success") {
            this.logger.debug(
                `Incrementing notification count for organization ${channel.organization_id}`,
            );
            await this.notificationRepo.incrementNotificationCount(
                channel.organization_id,
            );
        }
    }

    getStats(): ProcessorStats {
        this.logger.debug("Current processor stats:", this.stats);
        return { ...this.stats };
    }

    reset(): void {
        this.logger.debug("Resetting processor stats");
        this.stats = {
            processed: 0,
            success: 0,
            failed: 0,
            errors: [],
        };
    }

    protected async delay(ms: number): Promise<void> {
        this.logger.debug(`Delaying execution for ${ms}ms`);
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async checkNotificationLimit(
        channel: NotificationChannel,
    ): Promise<{
        isWithinLimit: boolean;
        shouldNotify: boolean;
    }> {
        this.logger.debug(
            `Checking notification limit for organization ${channel.organization_id}`,
        );

        const { data: status } = await this.notificationRepo
            .getOrganizationSubscriptionStatus(channel.organization_id);

        if (!status?.base_notifications_per_day) {
            this.logger.debug(
                `No notification limit found for organization ${channel.organization_id}`,
            );
            return { isWithinLimit: true, shouldNotify: false };
        }

        const usedToday = await this.notificationRepo
            .getNotificationsUsedToday(channel.organization_id);

        this.logger.debug(
            `Organization ${channel.organization_id} has used ${usedToday} of ${status.base_notifications_per_day} notifications today`,
        );

        const isWithinLimit = usedToday < status.base_notifications_per_day;

        if (!isWithinLimit) {
            this.logger.warn(
                `Organization ${channel.organization_id} has exceeded daily notification limit`,
            );
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
