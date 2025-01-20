import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { ContentCleaner } from "./cleaner";
import type { ServiceResponse } from "../../types/models";

export interface ScraperOptions {
  timeout?: number;
  waitUntil?: "domcontentloaded" | "networkidle0" | "networkidle2";
  batchSize?: number;
  delayBetweenBatches?: number;
}

const waitUntilMapping = {
  "domcontentloaded": "domcontentloaded",
  "networkidle0": "networkidle",
  "networkidle2": "networkidle",
} as const;

export class ContentScraper {
  private cleaner: ContentCleaner;
  private readonly defaultOptions: Required<ScraperOptions> = {
    timeout: 65000,
    waitUntil: "networkidle0",
    batchSize: 10,
    delayBetweenBatches: 200,
  };

  constructor() {
    this.cleaner = new ContentCleaner();
  }

  private log(
    type: "start" | "success" | "error",
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

  async scrape(
    url: string,
    options?: ScraperOptions,
  ): Promise<ServiceResponse<string>> {
    this.log("start", url);

    try {
      const loader = new PlaywrightWebBaseLoader(url, {
        launchOptions: {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          timeout: options?.timeout ?? this.defaultOptions.timeout,
        },
        gotoOptions: {
          timeout: options?.timeout ?? this.defaultOptions.timeout,
          waitUntil: options?.waitUntil
            ? waitUntilMapping[options.waitUntil]
            : "domcontentloaded",
        },
      });

      const docs = await loader.load();
      if (!docs || docs.length === 0) {
        this.log("error", url, "No content found");
        return { success: false, error: "No content found" };
      }

      const cleanedContent = this.cleaner.clean(docs[0].pageContent);
      this.log("success", url, `Content length: ${cleanedContent.length}`);
      return { success: true, data: cleanedContent };
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
  ): Promise<ServiceResponse<string>[]> {
    const opts = { ...this.defaultOptions, ...options };
    const results: ServiceResponse<string>[] = [];

    for (let i = 0; i < urls.length; i += opts.batchSize) {
      const batch = urls.slice(i, i + opts.batchSize);
      console.log(
        `[Scraper] Processing batch ${i / opts.batchSize + 1}/${
          Math.ceil(urls.length / opts.batchSize)
        }`,
      );

      const batchResults = await Promise.all(
        batch.map((url) => this.scrape(url, opts)),
      );
      results.push(...batchResults);

      if (i + opts.batchSize < urls.length) {
        await this.delay(opts.delayBetweenBatches);
      }
    }

    return results;
  }
}
