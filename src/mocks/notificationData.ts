// src/mocks/notificationData.ts

import { type Tables } from '@/types/database.types';

type NotificationChannel = Tables<'notification_channels'>;
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


export const mockSchedules: NotificationSchedule[] = [
  {
    id: '1',
    name: 'Daily Morning',
    schedule_type: 'daily_morning',
    timezone: 'UTC+9',
    cron_expression: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Daily Evening',
    schedule_type: 'daily_evening',
    timezone: 'UTC-5',
    cron_expression: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
