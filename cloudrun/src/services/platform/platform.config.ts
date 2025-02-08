import { Database } from "../../types/database.types";

type NotificationPlatform =
    Database["public"]["Enums"]["notification_platform"];

interface NotificationProcessorConfig {
    maxConcurrent: number;
    baseDelayMs: number;
    maxRetries: number;
    maxBatchSize: number;
    retryDelayMs: number;
}

// Base configuration for retrying
const DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    retryDelayMs: 2000,
};

// Base configuration for rate limiting
const DEFAULT_RATE_LIMIT = {
    maxBatchSize: 20,
    baseDelayMs: 1000,
};

// Platform-specific configurations
export const PLATFORM_CONFIGS: Record<
    NotificationPlatform,
    NotificationProcessorConfig
> = {
    // Slack configuration
    slack: {
        maxConcurrent: 5,
        baseDelayMs: 1100, // Slack's rate limit: ~1 request/second
        maxRetries: 3,
        retryDelayMs: 2000,
        maxBatchSize: 20,
    },

    // Discord configuration
    discord: {
        maxConcurrent: 5,
        baseDelayMs: 1000, // Discord's rate limit: ~50 requests/second per token
        maxRetries: 3,
        retryDelayMs: 2000,
        maxBatchSize: 20,
    },

    // Email configuration
    email: {
        maxConcurrent: 10,
        baseDelayMs: 100,
        maxRetries: 2,
        retryDelayMs: 1000,
        maxBatchSize: 50,
    },

    // LINE configuration
    line: {
        maxConcurrent: 3,
        ...DEFAULT_RETRY_CONFIG,
        ...DEFAULT_RATE_LIMIT,
    },

    // Chatwork configuration
    chatwork: {
        maxConcurrent: 3,
        ...DEFAULT_RETRY_CONFIG,
        ...DEFAULT_RATE_LIMIT,
        baseDelayMs: 1200, // Chatwork's rate limit considerations
    },

    // KakaoTalk configuration
    kakaotalk: {
        maxConcurrent: 3,
        ...DEFAULT_RETRY_CONFIG,
        ...DEFAULT_RATE_LIMIT,
    },

    // WeChat configuration
    wechat: {
        maxConcurrent: 3,
        baseDelayMs: 1500, // WeChat's strict rate limiting
        maxRetries: 2,
        retryDelayMs: 3000,
        maxBatchSize: 15,
    },

    // Facebook Messenger configuration
    facebook_messenger: {
        maxConcurrent: 5,
        baseDelayMs: 1000,
        ...DEFAULT_RETRY_CONFIG,
        maxBatchSize: 30,
    },

    // Google Chat configuration
    google_chat: {
        maxConcurrent: 5,
        baseDelayMs: 800,
        ...DEFAULT_RETRY_CONFIG,
        maxBatchSize: 25,
    },

    // WhatsApp configuration
    whatsapp: {
        maxConcurrent: 3,
        baseDelayMs: 1200,
        maxRetries: 2,
        retryDelayMs: 2500,
        maxBatchSize: 15,
    },

    // Telegram configuration
    telegram: {
        maxConcurrent: 8,
        baseDelayMs: 500, // Telegram's generous rate limits
        ...DEFAULT_RETRY_CONFIG,
        maxBatchSize: 30,
    },

    // Twitter configuration (now X)
    twitter: {
        maxConcurrent: 2,
        baseDelayMs: 2000, // Twitter's strict rate limiting
        maxRetries: 2,
        retryDelayMs: 5000,
        maxBatchSize: 10,
    },

    // Generic webhook configuration
    webhook: {
        maxConcurrent: 5,
        baseDelayMs: 500,
        ...DEFAULT_RETRY_CONFIG,
        maxBatchSize: 30,
    },
} as const;

// Utility functions for platform configurations
export function getPlatformConfig(
    platform: NotificationPlatform,
): NotificationProcessorConfig {
    return PLATFORM_CONFIGS[platform];
}

export function adjustConfigForOrganization(
    config: NotificationProcessorConfig,
    organizationId: string,
): NotificationProcessorConfig {
    // Here you could add logic to adjust configs based on organization settings
    // For example, premium customers might get higher rate limits
    return {
        ...config,
        // Customize based on organization settings if needed
    };
}

export function isRateLimited(
    platform: NotificationPlatform,
    recentRequests: number,
): boolean {
    const config = PLATFORM_CONFIGS[platform];
    // Implement rate limiting logic
    return recentRequests >= config.maxBatchSize;
}

export const DEFAULT_CONFIG: NotificationProcessorConfig = {
    maxConcurrent: 3,
    ...DEFAULT_RETRY_CONFIG,
    ...DEFAULT_RATE_LIMIT,
    baseDelayMs: 1000,
};
