import Parser  from 'npm:rss-parser';
import { RSSItem } from './types.ts';
import { SupabaseClient } from "jsr:@supabase/supabase-js";

const parser = new Parser();

export async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(url);
    console.log("Fetched RSS feed:", feed);
    return feed.items.map(item => ({
      title: item.title ?? '',
      content: item.content ?? item.contentSnippet ?? '',
      link: item.link ?? '',
    }));
  } catch (error) {
    console.error(`Error fetching RSS from ${url}:`, error);
    throw error;
  }
}

export async function processFeedItems(
  supabaseClient: SupabaseClient,
  feedId: string,
  items: RSSItem[]
) {
  const results = [];
  
  for (const item of items) {
    try {
      const { error } = await supabaseClient
        .from('articles')
        .upsert({
          feed_id: feedId,
          title: item.title,
          content: item.content,
          url: item.link,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'url',
          ignoreDuplicates: true
        });

      if (error) throw error;
      
      results.push({
        url: item.link,
        success: true
      });
    } catch (error) {
      results.push({
        url: item.link,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}