-- 20241229000000_create_notification_system.sql

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
  role text not null,
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
  timezone text not null default 'UTC',
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
create policy "Users can view organizations they belong to"
  on organizations for select
  to authenticated
  using (
    exists (
      select 1 from organization_members
      where organization_id = organizations.id
      and user_id = auth.uid()
    )
  );

-- Organization members policies
create policy "Users can view organization members"
  on organization_members for select
  to authenticated
  using (
    exists (
      select 1 from organization_members
      where organization_id = organization_members.organization_id
      and user_id = auth.uid()
    )
  );

-- Workspace connections policies
create policy "Users can view workspace connections of their organizations"
  on workspace_connections for select
  to authenticated
  using (
    exists (
      select 1 from organization_members
      where organization_id = workspace_connections.organization_id
      and user_id = auth.uid()
    )
  );

-- Notification channels policies
create policy "Users can view notification channels of their organizations"
  on notification_channels for select
  to authenticated
  using (
    exists (
      select 1 from organization_members
      where organization_id = notification_channels.organization_id
      and user_id = auth.uid()
    )
  );

-- Notification logs policies
create policy "Users can view notification logs of their channels"
  on notification_logs for select
  to authenticated
  using (
    exists (
      select 1 from notification_channels nc
      join organization_members om on nc.organization_id = om.organization_id
      where nc.id = notification_logs.channel_id
      and om.user_id = auth.uid()
    )
  );

-- Anon can create organizations
create policy "Anon can create organizations"
  on organizations for insert
  to anon
  with check (true);

-- Anon can create workspace connections
create policy "Anon can create workspace connections"
  on workspace_connections for insert
  to anon
  with check (true);

-- Anon can create organization members
create policy "Anon can create organization members"
  on organization_members for insert
  to anon
  with check (true);

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