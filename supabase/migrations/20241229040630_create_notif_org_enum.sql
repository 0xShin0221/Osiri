-- Create platform type
create type notification_platform as enum (
   'slack',    -- Social media and messaging
   'twitter',
   'discord', 
   'line',
   'chatwork',
   'kakaotalk',
   'wechat',
   'facebook_messenger',
   'google_chat',
   'whatsapp',
   'telegram',
   'webhook',    -- System integration
   'email'
);

-- Create schedule type
create type notification_schedule_type as enum (
  'realtime',
  'daily_morning',    -- Every day at 8:00 AM
  'daily_evening',    -- Every day at 6:00 PM
  'weekday_morning',  -- Weekdays at 8:00 AM
  'weekday_evening',  -- Weekdays at 6:00 PM
  'weekly_monday',    -- Monday at 8:00 AM
  'weekly_sunday',    -- Sunday at 8:00 AM
  'custom'            -- For special cases, uses cron_expression
);

--Create roles
create type member_role as enum (
  'admin',              -- Administrator with full permissions
  'member',             -- Regular member with limited permissions
  'viewer',             -- (Unused)Read-only access
  'guest',              -- (Unused)Guest user with minimal access
  'owner',              -- (Unused)Organization owner with ultimate control
  'moderator',          -- (Unused)Responsible for managing specific content or users
  'editor',             -- (Unused)Can edit content but not manage settings
  'support',            -- (Unused)Support role for troubleshooting and assistance
  'external_contributor' -- (Unused)External partner with limited permissions
);

create type utc_offset as enum (
  'UTC+14', 'UTC+13', 'UTC+12', 'UTC+11', 'UTC+10', 'UTC+9', 'UTC+8',
  'UTC+7', 'UTC+6', 'UTC+5', 'UTC+4', 'UTC+3', 'UTC+2', 'UTC+1',
  'UTC+0', 'UTC-1', 'UTC-2', 'UTC-3', 'UTC-4', 'UTC-5', 'UTC-6',
  'UTC-7', 'UTC-8', 'UTC-9', 'UTC-10', 'UTC-11', 'UTC-12'
);
