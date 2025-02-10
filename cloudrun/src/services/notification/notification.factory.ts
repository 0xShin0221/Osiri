// src/services/notification/notification.factory.ts

import type { NotificationProcessor } from "./interfaces/notification-processor.interface";
import type { NotificationRepository } from "../../repositories/notification.repository";
import type { SlackService } from "../platform/slack.service";
import { SlackNotificationProcessor } from "./processors/slack.processor";
import { NotificationService } from "./notification.service";
import type { Database } from "../../types/database.types";
import { DiscordNotificationProcessor } from "./processors/discord.processor";
import type { DiscordService } from "../platform/discord.service";

type NotificationPlatform =
    Database["public"]["Enums"]["notification_platform"];

export class NotificationFactory {
    constructor(
        private readonly notificationRepo: NotificationRepository,
        private readonly slackService: SlackService,
        private readonly discordService: DiscordService,
    ) {}

    createProcessor(platform: NotificationPlatform): NotificationProcessor {
        switch (platform) {
            case "slack":
                return new SlackNotificationProcessor(
                    this.slackService,
                    this.notificationRepo,
                );
            case "discord":
                return new DiscordNotificationProcessor(
                    this.discordService,
                    this.notificationRepo,
                );
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    createNotificationService(): NotificationService {
        // Create processors for all supported platforms
        const processors = {
            slack: this.createProcessor("slack"),
            // Add other platform processors here
        } as Record<NotificationPlatform, NotificationProcessor>;

        return new NotificationService(
            this.notificationRepo,
            processors,
        );
    }
}
