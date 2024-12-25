import type { Database } from './database.types';

export type RssFeed = Database['public']['Tables']['rss_feeds']['Row'];
export type RssFeedInsert = Database['public']['Tables']['rss_feeds']['Insert'];
export type RssFeedUpdate = Database['public']['Tables']['rss_feeds']['Update'];
export type FeedLanguage = Database['public']['Enums']['feed_language'];

export type Article = Database['public']['Tables']['articles']['Row'];
export type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
export type ArticleUpdate = Database['public']['Tables']['articles']['Update'];

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RSSItem {
  title: string;
  content: string;
  link: string;
  pubDate?: string;
}

export interface ProcessResult {
  feedId: string;
  itemsProcessed: number;
  success: boolean;
  error?: string;
}