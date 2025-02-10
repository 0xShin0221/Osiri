// src/services/notification/processors/discord.processor.ts

import type { NotificationRepository } from "../../../repositories/notification.repository";
import type { DiscordService } from "../../platform/discord.service";
import { BaseNotificationProcessor } from "./base.processor";
import type { Database } from "../../../types/database.types";
import { PLATFORM_CONFIGS } from "../../platform/platform.config";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];
type NotificationChannel =
    Database["public"]["Tables"]["notification_channels"]["Row"];

export class DiscordNotificationProcessor extends BaseNotificationProcessor {
    constructor(
        private readonly discordService: DiscordService,
        notificationRepo: NotificationRepository,
    ) {
        super(PLATFORM_CONFIGS.discord, notificationRepo);
    }

    protected async sendNotification(
        notification: NotificationLog,
        channel: NotificationChannel,
    ): Promise<void> {
        if (!notification.article_id) {
            throw new Error("Article ID is required for Discord notifications");
        }

        await this.discordService.sendMessage(
            notification.article_id,
            channel,
        );
    }

    protected async sendLimitNotification(
        channel: NotificationChannel,
    ): Promise<void> {
        await this.discordService.sendLimitNotification(channel);
        await this.notificationRepo.updateOrganizationLimitNotification(
            channel.organization_id,
        );
    }
}
