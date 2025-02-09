// src/services/notification/processors/slack.processor.ts
import type { NotificationRepository } from "../../../repositories/notification.repository";
import type { SlackService } from "../../platform/slack.service";
import { BaseNotificationProcessor } from "./base.processor";
import { Database } from "../../../types/database.types";
import { PLATFORM_CONFIGS } from "../../platform/platform.config";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];

type NotificationChannel =
    Database["public"]["Tables"]["notification_channels"]["Row"];

export class SlackNotificationProcessor extends BaseNotificationProcessor {
    constructor(
        private readonly slackService: SlackService,
        notificationRepo: NotificationRepository,
    ) {
        super(PLATFORM_CONFIGS.slack, notificationRepo);
    }

    protected async sendNotification(
        notification: NotificationLog,
        channel: NotificationChannel,
    ): Promise<void> {
        if (!notification.article_id) {
            throw new Error("Article ID is required for Slack notifications");
        }

        await this.slackService.sendMessage(
            notification.article_id,
            channel,
        );
    }

    protected async sendLimitNotification(
        channel: NotificationChannel,
    ): Promise<void> {
        await this.slackService.sendLimitNotification(channel);
        await this.notificationRepo.updateOrganizationLimitNotification(
            channel.organization_id,
        );
    }
}
