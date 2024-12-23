import puppeteer, { Browser, Page } from 'puppeteer';
import { ContentCleaner } from './cleaner';
import { ServiceResponse } from '../../types/models';

interface ScraperOptions {
  timeout?: number;
  waitUntil?: 'domcontentloaded' | 'networkidle0' | 'networkidle2';
}

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
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: 'new'
      });

      const page = await browser.newPage();
      await this.setupPage(page);
      await page.goto(url, {
        waitUntil: opts.waitUntil,
        timeout: opts.timeout
      });

      const content = await this.extractContent(page);
      const cleanedContent = this.cleaner.clean(content);

      return {
        success: true,
        data: cleanedContent
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape content'
      };
    } finally {
      if (browser) await browser.close();
    }
  }

  private async setupPage(page: Page): Promise<void> {
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  private async extractContent(page: Page): Promise<string> {
    return page.evaluate(() => {
      // Remove unwanted elements
      const elementsToRemove = document.querySelectorAll(
        'header, footer, nav, aside, script, style, iframe, .ads, .comments, .social'
      );
      elementsToRemove.forEach(el => el.remove());

      // Try to find main content
      const article = document.querySelector('article');
      if (article) return article.innerText;

      const main = document.querySelector('main');
      if (main) return main.innerText;
      const content = document.querySelector('.content, .post-content, .entry-content');
      if (content) return content.textContent || '';

      return document.body.textContent || '';
    });
  }
}