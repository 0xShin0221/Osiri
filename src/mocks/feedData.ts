import { Tables } from "@/types/database.types";

type RssFeed = Tables<'rss_feeds'>;

export const mockFeeds: RssFeed[] = [
    {
      id: '1',
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed',
      categories: ['tech_news', 'startup_news'],
      language: 'en',
      is_active: true,
      description: 'Tech news and analysis',
      site_icon: null,
      last_fetched_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Hacker News',
      url: 'https://news.ycombinator.com/rss',
      categories: ['tech_news', 'software_development'],
      language: 'en',
      is_active: true,
      description: 'Hacker News RSS',
      site_icon: null,
      last_fetched_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  