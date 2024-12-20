import { createClient } from "jsr:@supabase/supabase-js";
import { RSSFeed } from "../types.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

export const rssFeeds = {
  /**
   * Fetch all active RSS feeds
   */
  getActive: async (): Promise<RSSFeed[]> => {
    const { data: feeds, error } = await supabase
      .from("rss_feeds")
      .select("id, name, url")
      .eq("is_active", true);

    if (error) throw error;
    return feeds;
  },

  /**
   * Get a specific RSS feed by ID
   */
  getById: async (id: string): Promise<RSSFeed | null> => {
    const { data, error } = await supabase
      .from("rss_feeds")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update the last fetched timestamp for a feed
   */
  updateLastFetched: async (feedId: string): Promise<void> => {
    const { error } = await supabase
      .from("rss_feeds")
      .update({ last_fetched_at: new Date().toISOString() })
      .eq("id", feedId);

    if (error) throw error;
  },

  /**
   * Deactivate a feed
   */
  deactivate: async (feedId: string): Promise<void> => {
    const { error } = await supabase
      .from("rss_feeds")
      .update({ is_active: false })
      .eq("id", feedId);

    if (error) throw error;
  },

  /**
   * Add a new RSS feed
   */
  add: async (feed: Omit<RSSFeed, "id">): Promise<RSSFeed> => {
    const { data, error } = await supabase
      .from("rss_feeds")
      .insert(feed)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getActiveBatch: async (batchSize: number) => {
    const { data: feeds, error } = await supabase
      .from("rss_feeds")
      .select("id, name, url")
      .eq("is_active", true)
      .limit(batchSize);

    if (error) throw error;
    return feeds ?? [];
  },

  hasMoreActiveFeeds: async (lastId: string): Promise<boolean> => {
    const { count, error } = await supabase
      .from("rss_feeds")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .gt("id", lastId);

    if (error) throw error;
    return (count ?? 0) > 0;
  },
};
