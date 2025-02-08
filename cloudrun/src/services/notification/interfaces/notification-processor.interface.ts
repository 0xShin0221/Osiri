import { Database } from "../../../types/database.types";

type NotificationLog = Database["public"]["Tables"]["notification_logs"]["Row"];
type NotificationStatus = Database["public"]["Enums"]["notification_status"];
type NotificationChannel =
    Database["public"]["Tables"]["notification_channels"]["Row"];

export interface NotificationResult {
    success: boolean;
    error?: string;
    retryable?: boolean;
    rateLimitInfo?: string;
}

export interface ProcessorStats {
    processed: number;
    success: number;
    failed: number;
    errors: Array<{
        channelId: string;
        error: string;
        retryable: boolean;
    }>;
}

export interface NotificationProcessor {
    processNotification(
        notification: NotificationLog,
        channel: NotificationChannel,
    ): Promise<NotificationResult>;

    updateStatus(
        notificationId: string,
        status: NotificationStatus,
        channel: NotificationChannel,
        error?: string,
    ): Promise<void>;

    getStats(): ProcessorStats;

    reset(): void;
}
