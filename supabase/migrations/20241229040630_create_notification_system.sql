-- Create platform type
create type notification_platform as enum (
  'slack',
  'discord',
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

-- Organizations table
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Organization members table
create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role member_role not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(organization_id, user_id)
);

-- Workspace connections table
create table workspace_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  platform notification_platform not null,
  workspace_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint valid_platform_data check (
    (platform in ('slack', 'discord') and workspace_id is not null and access_token is not null) or
    (platform = 'email' and workspace_id is null and access_token is null)
  )
);

-- Notification schedules table
create table notification_schedules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  schedule_type notification_schedule_type not null,
  cron_expression text,
  timezone utc_offset not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint valid_custom_schedule check (
    (schedule_type = 'custom' and cron_expression is not null) or
    (schedule_type != 'custom' and cron_expression is null)
  )
);

-- Notification channels table
create table notification_channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  workspace_connection_id uuid references workspace_connections(id) on delete cascade,
  platform notification_platform not null,
  channel_identifier text not null,
  schedule_id uuid references notification_schedules(id),
  is_active boolean not null default true,
  feed_ids uuid[] not null,
  category_ids uuid[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  last_notified_at timestamp with time zone,
  error_count integer default 0,
  last_error text,
  constraint feed_ids_not_empty check (array_length(feed_ids, 1) > 0)
);

-- Notification logs table
create table notification_logs (
  id uuid primary key default gen_random_uuid(),
  platform notification_platform not null,
  channel_id uuid references notification_channels(id),
  article_id uuid references articles(id) on delete cascade,
  recipient text not null,
  status text not null,
  error text,
  created_at timestamp with time zone default now()
);

-- Add indexes for organizations
create index idx_organization_members_user on organization_members(user_id);
create index idx_organization_members_org on organization_members(organization_id);

-- Add indexes for workspace connections
create index idx_workspace_connections_org on workspace_connections(organization_id);
create index idx_workspace_connections_platform on workspace_connections(platform);

-- Add indexes for notification channels
create index idx_notification_channels_org on notification_channels(organization_id);
create index idx_notification_channels_active on notification_channels(is_active) where is_active = true;
create index idx_notification_channels_schedule on notification_channels(schedule_id);
create index idx_notification_channels_feed_ids on notification_channels using gin (feed_ids);
create index idx_notification_channels_category_ids on notification_channels using gin (category_ids);
create index idx_realtime_channels on notification_channels(is_active) 
  where is_active = true;
create index idx_scheduled_notifications on notification_channels(schedule_id, last_notified_at)
  where is_active = true;
create index idx_channel_errors on notification_channels(error_count)
  where error_count > 0;

-- Add indexes for notification logs
create index idx_notification_logs_platform on notification_logs(platform);
create index idx_notification_logs_channel on notification_logs(channel_id);
create index idx_notification_logs_article on notification_logs(article_id);
create index idx_notification_logs_created on notification_logs(created_at);
create index idx_notification_logs_status on notification_logs(status);

-- Add RLS policies
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table workspace_connections enable row level security;
alter table notification_channels enable row level security;
alter table notification_logs enable row level security;
alter table notification_schedules enable row level security;

-- Organization policies
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Organization members policies
CREATE POLICY "Users can view their organization memberships"
  ON organization_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Workspace connections policies
CREATE POLICY "Users can view their workspace connections"
  ON workspace_connections FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  ));

-- Notification channels policies
CREATE POLICY "Users can view their notification channels"
  ON notification_channels FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  ));

-- Notification logs policies
CREATE POLICY "Users can view their notification logs"
  ON notification_logs FOR SELECT
  TO authenticated
  USING (channel_id IN (
    SELECT nc.id 
    FROM notification_channels nc
    WHERE nc.organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  ));

-- Service Role policies
CREATE POLICY "Service role can create organizations"
  ON organizations FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can create workspace connections"
  ON workspace_connections FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can create organization members"
  ON organization_members FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Add comments
comment on table organizations is 'Organizations using the notification system';
comment on table organization_members is 'Users belonging to organizations with their roles';
comment on table workspace_connections is 'OAuth tokens and connection info for Slack/Discord workspaces';
comment on table notification_schedules is 'Configurable notification schedule patterns';
comment on table notification_channels is 'Channel configurations for notifications';
comment on table notification_logs is 'History of all notification attempts';

comment on column workspace_connections.workspace_id is 'Unique identifier for Slack workspace or Discord guild';
comment on column notification_channels.channel_identifier is 'Slack channel ID, Discord channel ID, or email address';
comment on column notification_channels.feed_ids is 'Array of RSS feed IDs to follow';
comment on column notification_channels.category_ids is 'Optional array of category IDs for filtering';

-- Add moddatetime triggers
create trigger set_organizations_updated_at
  before update on organizations
  for each row
  execute function moddatetime(updated_at);

create trigger set_organization_members_updated_at
  before update on organization_members
  for each row
  execute function moddatetime(updated_at);

create trigger set_workspace_connections_updated_at
  before update on workspace_connections
  for each row
  execute function moddatetime(updated_at);

create trigger set_notification_schedules_updated_at
  before update on notification_schedules
  for each row
  execute function moddatetime(updated_at);

create trigger set_notification_channels_updated_at
  before update on notification_channels
  for each row
  execute function moddatetime(updated_at);