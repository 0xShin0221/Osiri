import { ContentCleaner } from "./cleaner";
import type { ScrapedContent, ServiceResponse } from "../../types/models";
import { Browser, BrowserContext, chromium } from "playwright-chromium";

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

  private readonly defaultOptions: Required<ScraperOptions> = {
    timeout: 30000,
    waitUntil: "domcontentloaded",
    batchSize: 3,
    delayBetweenBatches: 500,
    maxRetries: 3,
    retryDelay: 2000,
  };

  constructor() {
    this.cleaner = new ContentCleaner();
    process.on("exit", () => this.cleanup());
    process.on("SIGTERM", () => this.cleanup());
    process.on("SIGINT", () => this.cleanup());
  }

  private async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      try {
        this.browser = await chromium.launch({
          headless: true,
          chromiumSandbox: false, // Required for Heroku
          args: [
            "--disable-dev-shm-usage",
            "--no-sandbox", // Required for Heroku
            "--disable-setuid-sandbox",
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
      });
    }
    return this.browserContext;
  }

  private log(
    type: "start" | "success" | "error" | "batch",
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

        await this.cleanup();
        await this.delay(delay);
      }
    }

    throw lastError;
  }

  private async getMetaTags(page: any): Promise<MetaTags> {
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

          try {
            // Block unnecessary resources
            await page.route(
              "**/*.{png,jpg,jpeg,gif,css,svg,woff,woff2,eot,ttf,otf}",
              (route) => route.abort(),
            );
            await page.route("**/*", (route) => {
              if (
                route.request().resourceType() === "xhr" ||
                route.request().resourceType() === "fetch"
              ) {
                route.abort();
              } else {
                route.continue();
              }
            });

            await page.goto(url, {
              waitUntil: opts.waitUntil
                ? waitUntilMapping[opts.waitUntil]
                : "domcontentloaded",
              timeout: opts.timeout,
            });

            const content = await page.content();
            const metaTags = await this.getMetaTags(page);
            const cleanedContent = this.cleaner.clean(content);

            await page.close();

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

      if (i + opts.batchSize < urls.length) {
        this.log(
          "batch",
          `Batch ${batchNumber}`,
          `Waiting ${opts.delayBetweenBatches}ms before next batch`,
        );
        await this.delay(opts.delayBetweenBatches);
      }
    }

    return results;
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
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }
}
