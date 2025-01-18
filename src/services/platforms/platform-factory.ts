import type {
    NotificationPlatform,
    NotificationPlatformService,
} from "@/types/notification-platform";
import { SlackPlatform } from "./slack";

export function createPlatform(
    platform: NotificationPlatform,
): NotificationPlatformService {
    switch (platform) {
        case "slack":
            return new SlackPlatform();
        case "discord":
            // TODO: Implement DiscordPlatform
            throw new Error("Discord platform not implemented");
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
}
