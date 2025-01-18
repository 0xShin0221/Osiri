-- Seed data for notification_schedules table
DO $$
BEGIN
  -- First, insert realtime schedule for Slack and Discord
  INSERT INTO notification_schedules (
    id,
    name,
    schedule_type,
    timezone,
    created_at,
    updated_at
  )
  VALUES
    (
      gen_random_uuid(),
      'Realtime Notifications',
      'realtime',
      'UTC+0',
      NOW(),
      NOW()
    );

  -- Then, insert daily morning schedules for each UTC offset
  INSERT INTO notification_schedules (
    id,
    name,
    schedule_type,
    timezone,
    created_at,
    updated_at
  )
  VALUES
    -- UTC+14 to UTC+0
    (gen_random_uuid(), 'Daily Morning Update UTC+14', 'daily_morning', 'UTC+14', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+13', 'daily_morning', 'UTC+13', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+12', 'daily_morning', 'UTC+12', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+11', 'daily_morning', 'UTC+11', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+10', 'daily_morning', 'UTC+10', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+9', 'daily_morning', 'UTC+9', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+8', 'daily_morning', 'UTC+8', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+7', 'daily_morning', 'UTC+7', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+6', 'daily_morning', 'UTC+6', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+5', 'daily_morning', 'UTC+5', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+4', 'daily_morning', 'UTC+4', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+3', 'daily_morning', 'UTC+3', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+2', 'daily_morning', 'UTC+2', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+1', 'daily_morning', 'UTC+1', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC+0', 'daily_morning', 'UTC+0', NOW(), NOW()),
    -- UTC-1 to UTC-12
    (gen_random_uuid(), 'Daily Morning Update UTC-1', 'daily_morning', 'UTC-1', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-2', 'daily_morning', 'UTC-2', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-3', 'daily_morning', 'UTC-3', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-4', 'daily_morning', 'UTC-4', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-5', 'daily_morning', 'UTC-5', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-6', 'daily_morning', 'UTC-6', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-7', 'daily_morning', 'UTC-7', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-8', 'daily_morning', 'UTC-8', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-9', 'daily_morning', 'UTC-9', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-10', 'daily_morning', 'UTC-10', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-11', 'daily_morning', 'UTC-11', NOW(), NOW()),
    (gen_random_uuid(), 'Daily Morning Update UTC-12', 'daily_morning', 'UTC-12', NOW(), NOW());
END $$;