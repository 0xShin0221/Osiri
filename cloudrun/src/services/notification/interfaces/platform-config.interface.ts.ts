export interface PlatformConfig {
    maxConcurrent: number;
    baseDelayMs: number;
    maxRetries: number;
    retryDelayMs: number;
    maxBatchSize: number;
}
