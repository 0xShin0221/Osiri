// src/routes/notifications.ts
import { Router } from "express";
import { NotificationFactory } from "../../services/notification/notification.factory";
import { NotificationRepository } from "../../repositories/notification.repository";
import { SlackService } from "../../services/platform/slack.service";
import { validateAndMergeOptions } from "../../services/notification/batch.config";
import { DiscordService } from "../../services/platform/discord.service";

interface NotificationBatchOptions {
    batchSize?: number;
    maxConcurrentPerPlatform?: number;
    priorityChannels?: string[];
    dryRun?: boolean;
}

// Initialize dependencies
const router = Router();
const notificationRepo = new NotificationRepository();
const slackService = new SlackService();
const discordService = new DiscordService();
// Add other platform services here

const factory = new NotificationFactory(
    notificationRepo,
    slackService,
    discordService,
);

const notificationService = factory.createNotificationService();

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

        // Get processor for the channel's platform
        const processor = factory.createProcessor(channel.platform);

        // Create notification log
        const { data: notificationLog, error: logError } =
            await notificationRepo
                .createNotificationLog({
                    article_id: articleId,
                    channel_id: channelId,
                    platform: channel.platform,
                    organization_id: channel.organization_id,
                    status: "pending",
                    recipient: channel.channel_identifier_id || "",
                });

        if (logError) {
            return res.status(500).json({
                success: false,
                error: logError,
            });
        }
        if (!notificationLog) {
            return res.status(500).json({
                success: false,
                error: "Failed to create notification log",
            });
        }
        // Process notification
        const result = await processor.processNotification(
            notificationLog,
            channel,
        );

        // Update notification status
        await processor.updateStatus(
            notificationLog.id,
            result.success ? "success" : "failed",
            channel,
            result.error,
        );

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error,
                retryable: result.retryable,
                rateLimitInfo: result.rateLimitInfo,
            });
        }

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

async function processNotificationsBatch(options?: NotificationBatchOptions) {
    try {
        console.info("Starting notifications batch process");
        const result = await notificationService.processNotifications(
            (status) => {
                console.info("Batch progress:", {
                    processed: status.processedCount,
                    success: status.successCount,
                    failed: status.failedCount,
                    platformStats: status.platformStats,
                });
            },
        );
        console.info("Notifications batch process completed:", result);
    } catch (error) {
        console.error("Notifications batch process failed:", {
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

// Process pending notifications with immediate response
router.post("/process", (req, res) => {
    const rawOptions: Partial<NotificationBatchOptions> = {
        batchSize: req.body.batchSize,
        maxConcurrentPerPlatform: req.body.maxConcurrent,
        priorityChannels: req.body.priorityChannels,
        dryRun: req.body.dryRun,
    };

    const options = validateAndMergeOptions(rawOptions);

    // Send immediate response
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        message: "Notifications processing started",
        options,
    });

    // Start batch process in background
    setImmediate(() => {
        processNotificationsBatch(options).catch((error) => {
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
                pendingCount: result?.newNotifications?.length || 0,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// Get notification stats by platform
// router.get("/stats", async (req, res) => {
//     try {
//         const days = parseInt(req.query.days as string) || 7;
//         const { data: stats, error } = await notificationRepo
//             .getChannelNotificationStats(days);

//         if (error) {
//             return res.status(500).json({
//                 success: false,
//                 error,
//             });
//         }

//         return res.json({
//             success: true,
//             data: stats,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             error: error instanceof Error ? error.message : "Unknown error",
//         });
//     }
// });

export default router;
