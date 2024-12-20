import { rssFeeds } from "../db/rssFeed.ts";

interface ProcessFeedResult {
  feedId: string;
  name: string;
  status: number;
  result: any;
}

interface BatchProcessResult {
  batchSize: number;
  hasMoreFeeds: boolean;
  results: ProcessFeedResult[];
}

export class FeedCollectorService {
  private readonly BATCH_SIZE = 5;
  private readonly baseUrl: string;
  private readonly serviceRoleKey: string;

  constructor() {
    this.baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    this.serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  }

  private async processSingleFeed(feed: any): Promise<ProcessFeedResult> {
    const response = await fetch(
      `${this.baseUrl}/functions/v1/feed-processor`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feed }),
      },
    );

    return {
      feedId: feed.id,
      name: feed.name,
      status: response.status,
      result: await response.json(),
    };
  }

  private async triggerNextBatch(): Promise<void> {
    await fetch(
      `${this.baseUrl}/functions/v1/feed-collector-controller`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.serviceRoleKey}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  public async processBatch(): Promise<BatchProcessResult> {
    // Get active feeds for this batch
    const feeds = await rssFeeds.getActiveBatch(this.BATCH_SIZE);

    if (!feeds.length) {
      return {
        batchSize: 0,
        hasMoreFeeds: false,
        results: [],
      };
    }

    // Process all feeds in parallel
    const results = await Promise.all(
      feeds.map((feed) => this.processSingleFeed(feed)),
    );

    // Check for more feeds
    const hasMoreFeeds = await rssFeeds.hasMoreActiveFeeds(
      feeds[feeds.length - 1].id,
    );

    // Trigger next batch if needed
    if (hasMoreFeeds) {
      await this.triggerNextBatch();
    }

    return {
      batchSize: feeds.length,
      hasMoreFeeds,
      results,
    };
  }
}
