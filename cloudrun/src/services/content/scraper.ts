import { ContentCleaner } from "./cleaner";
import type { ScrapedContent, ServiceResponse } from "../../types/models";
import {
  type Browser,
  type BrowserContext,
  chromium,
} from "playwright-chromium";

export interface ScraperOptions {
  timeout?: number;
  waitUntil?: "domcontentloaded" | "networkidle0" | "networkidle2";
  batchSize?: number;
  delayBetweenBatches?: number;
  maxRetries?: number;
  retryDelay?: number;
  maxConcurrent?: number;
}

interface MetaTags {
  ogImage?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
}

const waitUntilMapping = {
  "domcontentloaded": "domcontentloaded",
  "networkidle0": "networkidle",
  "networkidle2": "networkidle",
} as const;

export class ContentScraper {
  private cleaner: ContentCleaner;
  private browser: Browser | null = null;
  private browserContext: BrowserContext | null = null;
  private readonly cleanupHandlers: Array<() => void> = [];
  private activePages = 0;

  private readonly defaultOptions: Required<ScraperOptions> = {
    timeout: 30000,
    waitUntil: "domcontentloaded",
    // Reduced batch size to prevent memory issues
    batchSize: 2,
    // Increased delay between batches for memory cleanup
    delayBetweenBatches: 2000,
    maxRetries: 3,
    retryDelay: 2000,
    // Maximum concurrent operations
    maxConcurrent: 2,
  };

  constructor() {
    this.cleaner = new ContentCleaner();

    const exitHandler = () => this.cleanup();
    const sigtermHandler = () => this.cleanup();
    const sigintHandler = () => this.cleanup();

    process.on("exit", exitHandler);
    process.on("SIGTERM", sigtermHandler);
    process.on("SIGINT", sigintHandler);

    this.cleanupHandlers.push(
      () => process.removeListener("exit", exitHandler),
      () => process.removeListener("SIGTERM", sigtermHandler),
      () => process.removeListener("SIGINT", sigintHandler),
    );

    // Set up memory monitoring interval for logging only (no automatic restart)
    const memoryCheckInterval = setInterval(() => {
      // Get current memory usage
      const memoryUsage = process.memoryUsage();
      const usedHeapSize = memoryUsage.heapUsed / 1024 / 1024;
      const totalHeapSize = memoryUsage.heapTotal / 1024 / 1024;

      console.log(
        `Memory usage - Used: ${usedHeapSize.toFixed(2)}MB / Total: ${
          totalHeapSize.toFixed(2)
        }MB (${(usedHeapSize / totalHeapSize * 100).toFixed(2)}%)`,
      );
    }, 60000); // Check every minute

    this.cleanupHandlers.push(() => clearInterval(memoryCheckInterval));
  }

  async cleanup(): Promise<void> {
    try {
      if (this.browserContext) {
        await this.browserContext.close();
        this.browserContext = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }

      for (const handler of this.cleanupHandlers) {
        handler();
      }
      this.cleanupHandlers.length = 0;
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }

  // Explicit browser restart method
  async restartBrowser(): Promise<void> {
    console.log("Restarting browser to free memory...");
    await this.cleanup();
    this.activePages = 0;

    // Force garbage collection if available
    if (global.gc) {
      try {
        global.gc();
        console.log("Garbage collection triggered.");
      } catch (e) {
        console.log("Failed to trigger garbage collection.");
      }
    }
  }

  private async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      try {
        this.browser = await chromium.launch({
          headless: true,
          chromiumSandbox: false,
          args: [
            "--disable-dev-shm-usage",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            // Use less memory
            "--disable-gpu",
            "--disable-software-rasterizer",
            "--disable-extensions",
            "--mute-audio",
            // Additional memory management flags
            "--js-flags=--max-old-space-size=512",
            // Reduced process count
            "--single-process",
            "--no-zygote",
          ],
        });
      } catch (error) {
        console.error("Failed to launch browser:", error);
        throw error;
      }
    }
    return this.browser;
  }

  private async getContext(): Promise<BrowserContext> {
    if (!this.browserContext) {
      const browser = await this.initBrowser();
      this.browserContext = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        viewport: { width: 1280, height: 720 },
        // Disable unnecessary features to save memory
        hasTouch: false,
        isMobile: false,
        javaScriptEnabled: true,
      });
    }
    return this.browserContext;
  }

  private log(
    type: "start" | "success" | "error" | "batch" | "memory",
    url: string,
    details?: string,
  ) {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] [Scraper] [${type.toUpperCase()}] ${url}${
        details ? ` - ${details}` : ""
      }`,
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = this.defaultOptions.maxRetries,
    delay: number = this.defaultOptions.retryDelay,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.log(
          "error",
          "Retry",
          `Attempt ${attempt}/${retries} failed: ${lastError.message}`,
        );

        if (attempt === retries) break;

        // If we encounter errors, restart the browser more aggressively
        if (attempt > 1) {
          await this.restartBrowser();
        } else {
          await this.delay(delay);
        }
      }
    }

    throw lastError;
  }

  private async getMetaTags(page: any): Promise<MetaTags> {
    return await page.evaluate(() => {
      const getContent = (selectors: string[]): string | null => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element?.getAttribute("content")) {
            return element.getAttribute("content");
          }
        }
        return null;
      };

      const selectors = {
        image: [
          'meta[property="og:image"]',
          'meta[property="og:image:secure_url"]',
          'meta[name="twitter:image"]',
          'meta[name="twitter:image:src"]',
        ],
        title: [
          'meta[property="og:title"]',
          'meta[name="twitter:title"]',
          'meta[name="title"]',
        ],
        description: [
          'meta[property="og:description"]',
          'meta[name="twitter:description"]',
          'meta[name="description"]',
        ],
      };

      return {
        ogImage: getContent(selectors.image),
        ogTitle: getContent(selectors.title) || document.title,
        ogDescription: getContent(selectors.description),
      };
    });
  }

  // Semaphore implementation to limit concurrent operations
  private async acquireSemaphore(maxConcurrent: number): Promise<void> {
    while (this.activePages >= maxConcurrent) {
      await this.delay(100);
    }
    this.activePages++;
  }

  private releaseSemaphore(): void {
    this.activePages--;
  }

  async scrape(
    url: string,
    options?: ScraperOptions,
  ): Promise<ServiceResponse<ScrapedContent>> {
    this.log("start", url);
    const opts = { ...this.defaultOptions, ...options };

    // Wait until we can process this URL (concurrency control)
    await this.acquireSemaphore(opts.maxConcurrent);

    try {
      const result = await this.withRetry(
        async () => {
          const context = await this.getContext();
          const page = await context.newPage();

          try {
            // Block unnecessary resources more aggressively
            await page.route(
              "**/*.{png,jpg,jpeg,gif,css,svg,woff,woff2,eot,ttf,otf,mp4,webm,ogg,mp3,wav}",
              (route) => route.abort(),
            );

            // Block more resource types
            await page.route("**/*", (route) => {
              const resourceType = route.request().resourceType();
              if (
                [
                  "xhr",
                  "fetch",
                  "websocket",
                  "eventsource",
                  "manifest",
                  "other",
                ].includes(resourceType) ||
                route.request().url().includes("google-analytics") ||
                route.request().url().includes("facebook") ||
                route.request().url().includes("youtube") ||
                route.request().url().includes("twitter") ||
                route.request().url().includes("ads")
              ) {
                route.abort();
              } else {
                route.continue();
              }
            });

            // Set a shorter navigation timeout
            await page.goto(url, {
              waitUntil: opts.waitUntil
                ? waitUntilMapping[opts.waitUntil]
                : "domcontentloaded",
              timeout: opts.timeout,
            });

            const content = await page.content();
            const metaTags = await this.getMetaTags(page);

            // Close page as soon as possible to free memory
            await page.close();

            // Clean content after page is closed to reduce memory pressure
            const cleanedContent = this.cleaner.clean(content);

            return {
              success: true,
              data: {
                content: cleanedContent,
                ...metaTags,
              },
            };
          } catch (error) {
            await page.close();
            throw error;
          }
        },
        opts.maxRetries,
        opts.retryDelay,
      );

      this.log("success", url);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to scrape content";
      this.log("error", url, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      this.releaseSemaphore();
    }
  }

  async scrapeBatch(
    urls: string[],
    options?: ScraperOptions,
  ): Promise<ServiceResponse<ScrapedContent>[]> {
    const opts = { ...this.defaultOptions, ...options };
    const results: ServiceResponse<ScrapedContent>[] = [];
    const totalBatches = Math.ceil(urls.length / opts.batchSize);

    for (let i = 0; i < urls.length; i += opts.batchSize) {
      const batchNumber = Math.floor(i / opts.batchSize) + 1;
      const batch = urls.slice(i, i + opts.batchSize);

      this.log(
        "batch",
        `Batch ${batchNumber}/${totalBatches}`,
        `Processing ${batch.length} URLs`,
      );

      // Process URLs one at a time in each batch to better control memory usage
      const batchResults = [];
      for (const url of batch) {
        try {
          const result = await this.scrape(url, {
            ...opts,
            timeout: Math.min(opts.timeout, 30000),
          });
          batchResults.push(result);

          // Add a small delay between individual scrapes within a batch
          await this.delay(500);
        } catch (error) {
          this.log(
            "error",
            url,
            `Batch processing error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          );
          batchResults.push({
            success: false,
            error: error instanceof Error
              ? error.message
              : "Unknown batch processing error",
          });
        }
      }

      results.push(...batchResults);

      // Log memory usage after each batch
      const memoryUsage = process.memoryUsage();
      this.log(
        "memory",
        `Batch ${batchNumber}`,
        `Heap used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB / ${
          (memoryUsage.heapTotal / 1024 / 1024).toFixed(2)
        }MB`,
      );

      if (i + opts.batchSize < urls.length) {
        this.log(
          "batch",
          `Batch ${batchNumber}`,
          `Waiting ${opts.delayBetweenBatches}ms before next batch`,
        );

        // After each batch, check if we need to restart the browser
        if (batchNumber % 3 === 0) { // Every 3 batches
          await this.restartBrowser();
        }

        await this.delay(opts.delayBetweenBatches);
      }
    }

    return results;
  }
}
