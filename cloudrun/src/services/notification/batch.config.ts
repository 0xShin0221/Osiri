interface NotificationBatchOptions {
    batchSize?: number;
    maxConcurrentPerPlatform?: number;
    priorityChannels?: string[];
    dryRun?: boolean;
}
// Default batch processing options
export const DEFAULT_BATCH_OPTIONS: Required<NotificationBatchOptions> = {
    batchSize: 50,
    maxConcurrentPerPlatform: 5,
    priorityChannels: [],
    dryRun: false,
};

// Configuration for different environments or scenarios
export const BATCH_CONFIG = {
    MIN_BATCH_SIZE: 10,
    MAX_BATCH_SIZE: 100,
    MIN_CONCURRENT: 1,
    MAX_CONCURRENT: 10,
    DEFAULT_TIMEOUT_MS: 300000, // 5 minutes
} as const;

// Validate and merge options with defaults
export function validateAndMergeOptions(
    options?: Partial<NotificationBatchOptions>,
): Required<NotificationBatchOptions> {
    if (!options) {
        return DEFAULT_BATCH_OPTIONS;
    }

    return {
        batchSize: Math.min(
            Math.max(
                options.batchSize || DEFAULT_BATCH_OPTIONS.batchSize,
                BATCH_CONFIG.MIN_BATCH_SIZE,
            ),
            BATCH_CONFIG.MAX_BATCH_SIZE,
        ),
        maxConcurrentPerPlatform: Math.min(
            Math.max(
                options.maxConcurrentPerPlatform ||
                    DEFAULT_BATCH_OPTIONS.maxConcurrentPerPlatform,
                BATCH_CONFIG.MIN_CONCURRENT,
            ),
            BATCH_CONFIG.MAX_CONCURRENT,
        ),
        priorityChannels: options.priorityChannels ||
            DEFAULT_BATCH_OPTIONS.priorityChannels,
        dryRun: options.dryRun || DEFAULT_BATCH_OPTIONS.dryRun,
    };
}
