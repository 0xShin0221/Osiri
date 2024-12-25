import Parser from 'rss-parser';
import { RSSItem } from '../../types/models';
import { ContentCleaner } from '../content/cleaner';

export class FeedParser {
  private parser: Parser;
  private cleaner: ContentCleaner;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['content:encoded', 'description']
      }
    });
    this.cleaner = new ContentCleaner();
  }

  async parse(url: string): Promise<RSSItem[]> {
    try {
      const feed = await this.parser.parseURL(url);
      
      return feed.items.map(item => ({
        title: item.title || '',
        content: this.cleaner.clean(
          item.content || 
          item['content:encoded'] || 
          item.description || ''
        ),
        link: item.link || '',
        pubDate: item.pubDate
      }));
    } catch (error) {
      console.error(`Error parsing feed from ${url}:`, error);
      throw new Error(`Failed to parse feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}