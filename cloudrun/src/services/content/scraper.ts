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

  private readonly defaultOptions: Required<ScraperOptions> = {
    timeout: 30000,
    waitUntil: "domcontentloaded",
    batchSize: 3,
    delayBetweenBatches: 800,
    maxRetries: 3,
    retryDelay: 2000,
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

    const memoryCheckInterval = setInterval(() => {
      const memoryUsage = process.memoryUsage();
      const usedHeapSize = memoryUsage.heapUsed / 1024 / 1024;
      const totalHeapSize = memoryUsage.heapTotal / 1024 / 1024;

      this.log(
        "memory",
        "MemoryCheck",
        `Used: ${usedHeapSize.toFixed(2)}MB / Total: ${
          totalHeapSize.toFixed(2)
        }MB (${(usedHeapSize / totalHeapSize * 100).toFixed(2)}%)`,
      );
    }, 60000);

    this.cleanupHandlers.push(() => clearInterval(memoryCheckInterval));
  }

  async cleanup(): Promise<void> {
    try {
      this.log("info", "Cleanup", "Starting browser cleanup...");

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

      this.log("info", "Cleanup", "Browser cleanup completed");
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }

  private async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      try {
        this.log("info", "Browser", "Initializing browser...");

        this.browser = await chromium.launch({
          headless: true,
          chromiumSandbox: false,
          args: [
            "--disable-dev-shm-usage",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--single-process",
            "--no-zygote",
          ],
        });

        this.log("info", "Browser", "Browser initialized successfully");
      } catch (error) {
        this.log(
          "error",
          "Browser",
          `Failed to launch browser: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        throw error;
      }
    }
    return this.browser;
  }

  private async getContext(): Promise<BrowserContext> {
    if (!this.browserContext) {
      this.log("info", "Browser", "Creating new browser context");

      const browser = await this.initBrowser();
      this.browserContext = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        viewport: { width: 1280, height: 720 },
      });
    }
    return this.browserContext;
  }

  private log(
    type:
      | "start"
      | "success"
      | "error"
      | "batch"
      | "info"
      | "memory"
      | "debug"
      | "warn",
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
        this.log("debug", "Retry", `Attempt ${attempt}/${retries} starting`);
        const result = await operation();
        this.log("debug", "Retry", `Attempt ${attempt}/${retries} succeeded`);
        return result;
      } catch (error) {
        lastError = error as Error;
        this.log(
          "error",
          "Retry",
          `Attempt ${attempt}/${retries} failed: ${lastError.message}`,
        );

        if (attempt === retries) break;

        this.log(
          "info",
          "Retry",
          `Cleaning up browser before retrying in ${delay}ms`,
        );
        await this.cleanup();
        await this.delay(delay);
      }
    }

    throw lastError;
  }

  private async getMetaTags(page: any): Promise<MetaTags> {
    this.log("debug", "MetaTags", "Extracting meta tags from page");

    return await page.evaluate(() => {
      const getContent = (selectors: string[]): string | null => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element && element.getAttribute("content")) {
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

  async scrape(
    url: string,
    options?: ScraperOptions,
  ): Promise<ServiceResponse<ScrapedContent>> {
    this.log("start", url);
    const opts = { ...this.defaultOptions, ...options };

    try {
      const result = await this.withRetry(
        async () => {
          const context = await this.getContext();
          const page = await context.newPage();
          this.log("debug", url, "Page created");

          try {
            this.log("debug", url, "Setting up resource blocking");
            await page.route(
              "**/*.{png,jpg,jpeg,gif,svg,woff,woff2,eot,ttf,otf}",
              (route) => route.abort(),
            );

            await page.route("**/*", (route) => {
              const resourceType = route.request().resourceType();
              if (resourceType === "xhr" || resourceType === "fetch") {
                route.abort();
              } else {
                route.continue();
              }
            });

            this.log(
              "debug",
              url,
              `Navigating to page with timeout ${opts.timeout}ms and waitUntil: ${opts.waitUntil}`,
            );
            await page.goto(url, {
              waitUntil: opts.waitUntil
                ? waitUntilMapping[opts.waitUntil]
                : "domcontentloaded",
              timeout: opts.timeout,
            });
            this.log("debug", url, "Navigation complete");

            this.log("debug", url, "Getting page content");
            const content = await page.content();

            this.log("debug", url, "Extracting meta tags");
            const metaTags = await this.getMetaTags(page);

            this.log("debug", url, "Cleaning content");
            const cleanedContent = this.cleaner.clean(content);

            this.log("debug", url, "Closing page");
            await page.close();

            this.log("debug", url, "Content successfully scraped");
            return {
              success: true,
              data: {
                content: cleanedContent,
                ...metaTags,
              },
            };
          } catch (error) {
            this.log(
              "error",
              url,
              `Error during scraping: ${
                error instanceof Error ? error.message : String(error)
              }`,
            );
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

      if (opts.batchSize > 2) {
        const batchPromises = batch.map(async (url) => {
          try {
            return await this.scrape(url, {
              ...opts,
              timeout: Math.min(opts.timeout, 30000),
            });
          } catch (error) {
            this.log(
              "error",
              url,
              `Batch processing error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            );
            return {
              success: false,
              error: error instanceof Error
                ? error.message
                : "Unknown batch processing error",
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      } else {
        for (const url of batch) {
          try {
            const result = await this.scrape(url, {
              ...opts,
              timeout: Math.min(opts.timeout, 30000),
            });
            results.push(result);
          } catch (error) {
            this.log(
              "error",
              url,
              `Sequential batch processing error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            );
            results.push({
              success: false,
              error: error instanceof Error
                ? error.message
                : "Unknown batch processing error",
            });
          }

          await this.delay(500);
        }
      }

      if (i + opts.batchSize < urls.length) {
        this.log(
          "batch",
          `Batch ${batchNumber}`,
          `Waiting ${opts.delayBetweenBatches}ms before next batch`,
        );

        const memoryUsage = process.memoryUsage();
        this.log(
          "memory",
          `Batch ${batchNumber}`,
          `Heap used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB / ${
            (memoryUsage.heapTotal / 1024 / 1024).toFixed(2)
          }MB (${
            (memoryUsage.heapUsed / memoryUsage.heapTotal * 100).toFixed(2)
          }%)`,
        );

        await this.delay(opts.delayBetweenBatches);
      }
    }

    return results;
  }
}
