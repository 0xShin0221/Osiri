import type { Database } from "./database.types";

export type FeedLanguage = Database["public"]["Enums"]["feed_language"];

export type RssFeed = Database["public"]["Tables"]["rss_feeds"]["Row"];
export type RssFeedInsert = Database["public"]["Tables"]["rss_feeds"]["Insert"];
export type RssFeedUpdate = Database["public"]["Tables"]["rss_feeds"]["Update"];

export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
export type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];
export type ArticleScrapingStatus =
  Database["public"]["Enums"]["article_scraping_status"];

export type Translation = Database["public"]["Tables"]["translations"]["Row"];
export type TranslationInsert =
  Database["public"]["Tables"]["translations"]["Insert"];
export type TranslationUpdate =
  Database["public"]["Tables"]["translations"]["Update"];
export type TranslationStatus =
  Database["public"]["Enums"]["translation_status"];

export type ArticleCategory =
  Database["public"]["Tables"]["article_categories"]["Row"];
export type ArticleCategoryInsert =
  Database["public"]["Tables"]["article_categories"]["Insert"];

export type ArticleForTranslation = {
  id: string;
  title: string;
  content: string;
  source_language: Database["public"]["Enums"]["feed_language"];
}; // Same as Database['public']['Functions']['get_articles_for_translation']['Returns'];

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

export interface ScrapedContent {
  content: string;
  ogImage?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
}
