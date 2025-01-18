import Parser from "rss-parser";
import type { RSSItem, ServiceResponse } from "../../types/models";
import { ContentCleaner } from "../content/cleaner";

export class FeedParser {
  private parser: Parser;
  private cleaner: ContentCleaner;
  private readonly MAX_ITEMS_PER_FEED = 10;
  private readonly MAX_CONTENT_LENGTH = 50000;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ["media:content", "media"],
          ["content:encoded", "contentEncoded"],
        ],
      },
    });
    this.cleaner = new ContentCleaner();
  }

  async parse(url: string): Promise<ServiceResponse<RSSItem[]>> {
    try {
      const feed = await this.parser.parseURL(url);

      // Sort items by date (newest first) and limit the number of items
      const sortedItems = feed.items
        .sort((a, b) => {
          const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
          const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, this.MAX_ITEMS_PER_FEED);

      const processedItems = sortedItems.map((item) => {
        // Get the richest content available
        const rawContent = item.contentEncoded || item.content ||
          item.description || "";
        const cleanedContent = this.cleaner.clean(rawContent);

        return {
          title: item.title || "",
          content: this.truncateContent(cleanedContent),
          link: item.link || "",
          pubDate: item.pubDate || undefined,
        };
      });

      return {
        success: true,
        data: processedItems,
      };
    } catch (error) {
      console.error(`Error parsing feed: ${url}`, error);
      return {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Unknown error parsing feed",
      };
    }
  }

  private truncateContent(content: string): string {
    if (content.length <= this.MAX_CONTENT_LENGTH) {
      return content;
    }
    return `${content.substring(0, this.MAX_CONTENT_LENGTH)}...`;
  }
}
