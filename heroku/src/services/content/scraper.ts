import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { ContentCleaner } from './cleaner';
import { ServiceResponse } from '../../types/models';

export interface ScraperOptions {
  timeout?: number;
  waitUntil?: 'domcontentloaded' | 'networkidle0' | 'networkidle2';
}

const waitUntilMapping = {
  'domcontentloaded': 'domcontentloaded',
  'networkidle0': 'networkidle',
  'networkidle2': 'networkidle'
} as const;

export class ContentScraper {
  private cleaner: ContentCleaner;
  private readonly defaultOptions: Required<ScraperOptions> = {
    timeout: 30000,
    waitUntil: 'domcontentloaded'
  };

  constructor() {
    this.cleaner = new ContentCleaner();
  }

  async scrape(url: string, options?: ScraperOptions): Promise<ServiceResponse<string>> {
    const opts = { ...this.defaultOptions, ...options };

    try {
      const loader = new PlaywrightWebBaseLoader(url, {
        launchOptions: {
          headless: true
        },
        gotoOptions: {
          timeout: opts.timeout,
          waitUntil: opts.waitUntil ? waitUntilMapping[opts.waitUntil] : 'domcontentloaded'
        }
      });

      const docs = await loader.load();
      if (!docs || docs.length === 0) {
        return {
          success: false,
          error: 'No content found'
        };
      }

      const cleanedContent = this.cleaner.clean(docs[0].pageContent);
      return {
        success: true,
        data: cleanedContent
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape content'
      };
    }
  }
}