// src/mocks/notificationData.ts

import type { Tables } from "@/types/database.types";

type NotificationSchedule = Tables<"notification_schedules">;

export const mockSchedules: NotificationSchedule[] = [
  {
    id: "1",
    name: "Daily Morning",
    schedule_type: "daily_morning",
    timezone: "UTC+9",
    cron_expression: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Daily Evening",
    schedule_type: "daily_evening",
    timezone: "UTC-5",
    cron_expression: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
