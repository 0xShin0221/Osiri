import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { ContentCleaner } from "./cleaner";
import type { ScrapedContent, ServiceResponse } from "../../types/models";
import { chromium } from "playwright";

export interface ScraperOptions {
  timeout?: number;
  waitUntil?: "domcontentloaded" | "networkidle0" | "networkidle2";
  batchSize?: number;
  delayBetweenBatches?: number;
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

  private async fetchWithNode(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private async getMetaTagsWithPlaywright(url: string): Promise<MetaTags> {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      });
      const page = await context.newPage();

      // Enable JavaScript execution
      await page.goto(url, { waitUntil: "networkidle" });

      const metaTags = await page.evaluate(() => {
        const getContent = (selectors: string[]): string | null => {
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && "content" in element) {
              const content = element.getAttribute("content");
              if (content) return content;
            }
          }
          return null;
        };

        // Define selectors in order of preference
        const imageSelectors = [
          'meta[property="og:image"]',
          'meta[property="og:image:secure_url"]',
          'meta[name="twitter:image"]',
          'meta[name="twitter:image:src"]',
          'link[rel="image_src"]',
        ];

        const titleSelectors = [
          'meta[property="og:title"]',
          'meta[name="twitter:title"]',
          'meta[name="title"]',
        ];

        const descriptionSelectors = [
          'meta[property="og:description"]',
          'meta[name="twitter:description"]',
          'meta[name="description"]',
        ];

        // For images, also try to find the largest image on the page as fallback
        const findLargestImage = (): string | null => {
          let maxArea = 0;
          let largestImageSrc = null;
          const images = document.getElementsByTagName("img");

          for (const img of Array.from(images)) {
            const width = img.naturalWidth || img.width;
            const height = img.naturalHeight || img.height;
            const area = width * height;

            if (area > maxArea && img.src) {
              maxArea = area;
              largestImageSrc = img.src;
            }
          }

          return largestImageSrc;
        };

        return {
          ogImage: getContent(imageSelectors) || findLargestImage(),
          ogTitle: getContent(titleSelectors) || document.title,
          ogDescription: getContent(descriptionSelectors),
        };
      });

      return metaTags;
    } finally {
      await browser.close();
    }
  }

  private async getMetaTagsWithRegex(html: string): Promise<MetaTags> {
    const metaTags: MetaTags = {};

    // Define all possible patterns for each meta tag
    const patterns = {
      ogImage: [
        /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i,
        /<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i,
        /<link[^>]*rel="image_src"[^>]*href="([^"]*)"[^>]*>/i,
      ],
      ogTitle: [
        /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*property="og:title"[^>]*>/i,
        /<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"[^>]*>/i,
        /<title[^>]*>([^<]*)<\/title>/i,
      ],
      ogDescription: [
        /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*property="og:description"[^>]*>/i,
        /<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i,
      ],
    };

    // Try each pattern for each meta tag
    for (const [key, patternList] of Object.entries(patterns)) {
      for (const pattern of patternList) {
        const match = html.match(pattern);
        if (match && match[1]) {
          metaTags[key as keyof MetaTags] = match[1];
          break;
        }
      }
    }

    return metaTags;
  }

  private async getAllMetaTags(url: string): Promise<MetaTags> {
    const results: MetaTags[] = [];
    const errors: Error[] = [];

    // Try different methods to get meta tags
    try {
      // Method 1: Fetch with Node and use regex
      const html = await this.fetchWithNode(url);
      results.push(await this.getMetaTagsWithRegex(html));
    } catch (error) {
      errors.push(error as Error);
    }

    try {
      // Method 2: Use Playwright
      results.push(await this.getMetaTagsWithPlaywright(url));
    } catch (error) {
      errors.push(error as Error);
    }

    // Combine results, taking the first non-null value for each field
    const combinedResults: MetaTags = {
      ogImage: results.find((r) => r.ogImage)?.ogImage || null,
      ogTitle: results.find((r) => r.ogTitle)?.ogTitle || null,
      ogDescription: results.find((r) => r.ogDescription)?.ogDescription ||
        null,
    };

    // Log results for debugging
    if (errors.length > 0) {
      console.warn(`Some methods failed for ${url}:`, errors);
    }

    return combinedResults;
  }

  async scrape(
    url: string,
    options?: ScraperOptions,
  ): Promise<ServiceResponse<ScrapedContent>> {
    this.log("start", url);

    try {
      // Get content using PlaywrightWebBaseLoader
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

      const pageContent = docs[0].pageContent;
      const cleanedContent = this.cleaner.clean(pageContent);

      // Get meta tags using multiple methods
      const metaTags = await this.getAllMetaTags(url);

      this.log(
        "success",
        url,
        `Content length: ${cleanedContent.length}, OG Image: ${
          metaTags.ogImage || "none"
        }`,
      );

      return {
        success: true,
        data: {
          content: cleanedContent,
          ...metaTags,
        },
      };
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

      // Process URLs in parallel within each batch
      const batchPromises = batch.map(async (url) => {
        try {
          return await this.scrape(url, {
            ...opts,
            timeout: Math.min(opts.timeout, 30000), // Ensure reasonable timeout for batch operations
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

      // Add delay between batches if there are more to process
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
}
