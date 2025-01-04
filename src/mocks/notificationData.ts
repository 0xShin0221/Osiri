// src/mocks/notificationData.ts

import { type Tables } from '@/types/database.types';

type NotificationChannel = Tables<'notification_channels'>;
type RssFeed = Tables<'rss_feeds'>;
type NotificationSchedule = Tables<'notification_schedules'>;

export const mockChannels: NotificationChannel[] = [
  {
    id: '1',
    platform: 'slack',
    channel_identifier: '#tech-news',
    feed_ids: ['1', '2'],
    is_active: true,
    schedule_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_ids: null,
    error_count: null,
    last_error: null,
    last_notified_at: null,
    organization_id: null,
    workspace_connection_id: null,
  },
  {
    id: '2',
    platform: 'discord',
    channel_identifier: '#startup-feeds',
    feed_ids: ['2', '3'],
    is_active: true,
    schedule_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_ids: null,
    error_count: null,
    last_error: null,
    last_notified_at: null,
    organization_id: null,
    workspace_connection_id: null,
  },
];

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

export const mockSchedules: NotificationSchedule[] = [
  {
    id: '1',
    name: 'Daily Morning',
    schedule_type: 'daily_morning',
    timezone: 'UTC',
    cron_expression: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Daily Evening',
    schedule_type: 'daily_evening',
    timezone: 'UTC',
    cron_expression: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
