import { Router } from "express";
import { SlackService } from "../services/slack.service";
import type { ServiceResponse } from "../types/models";

const router = Router();
const slackService = new SlackService();

router.post("/send", async (req, res) => {
    const { channelId, message } = req.body;

    if (!channelId || !message) {
        return res.status(400).json({
            success: false,
            error: "Both channelId and message are required",
        });
    }

    try {
        const result = await slackService.sendMessageToChannel(
            channelId,
            message,
        );

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

export default router;
