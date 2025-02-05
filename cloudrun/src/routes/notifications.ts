import { Router } from "express";
import { SlackService } from "../services/platform/slack.service";
import type { ServiceResponse } from "../types/models";
import { NotificationRepository } from "../repositories/notification.repository";
import { NotificationBatchProcessor } from "../services/batch/notificationProcessor";

const router = Router();
const notificationRepo = new NotificationRepository();
const slackService = new SlackService();
const batchProcessor = new NotificationBatchProcessor(
    notificationRepo,
    slackService,
);

// Send a direct message to a specific channel
router.post("/send", async (req, res) => {
    const { channelId, articleId } = req.body;

    if (!channelId || !articleId) {
        return res.status(400).json({
            success: false,
            error: "Both channelId and articleId are required",
        });
    }

    try {
        // Get channel details first
        const { data: channel, error: channelError } = await notificationRepo
            .getChannelById(channelId);

        if (channelError || !channel) {
            return res.status(404).json({
                success: false,
                error: channelError || "Channel not found",
            });
        }

        // Send message using the appropriate service
        let result: ServiceResponse<void>;
        switch (channel.platform) {
            case "slack":
                result = await slackService.sendMessage(articleId, channel);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: `Unsupported platform: ${channel.platform}`,
                });
        }

        if (!result.success) {
            return res.status(500).json(result);
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

async function processNotificationsBatch() {
    try {
        console.info("Starting notifications batch process");
        const result = await batchProcessor.processNotifications();
        console.info("Notifications batch process completed:", result);
    } catch (error) {
        console.error("Notifications batch process failed:", {
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

// Process pending notifications with immediate response
router.post("/process", (req, res) => {
    // Send immediate response
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        message: "Notifications processing started",
    });

    // Start batch process in background
    setImmediate(() => {
        processNotificationsBatch().catch((error) => {
            console.error("Background notifications process failed:", error);
        });
    });
});

// Get pending notifications status
router.get("/pending", async (req, res) => {
    try {
        const { data: result, error } = await notificationRepo
            .createPendingNotifications();
        if (error) {
            return res.status(500).json({
                success: false,
                error,
            });
        }
        return res.json({
            success: true,
            data: {
                processedCount: result?.processedCount || 0,
                insertedCount: result?.insertedCount || 0,
                skippedCount: result?.skippedCount || 0,
                pendingCount: result?.newNotifications.length || 0,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;
