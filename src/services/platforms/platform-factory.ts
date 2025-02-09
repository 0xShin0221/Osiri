import type {
    NotificationPlatform,
    NotificationPlatformService,
} from "@/types/notification-platform";
import { SlackPlatform } from "./slack";
import { DiscordPlatform } from "./discord";

export function createPlatform(
    platform: NotificationPlatform,
): NotificationPlatformService {
    switch (platform) {
        case "slack":
            return new SlackPlatform();
        case "discord":
            return new DiscordPlatform();
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
}
