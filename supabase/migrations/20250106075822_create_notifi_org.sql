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
  workspace_name text,
  workspace_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  is_active boolean not null default true,
  is_disconnected boolean not null default false,
  constraint valid_platform_data check (
    (platform in ('slack', 'discord') and workspace_id is not null and access_token is not null and workspace_name is not null) or
    (platform = 'email' and workspace_id is null and access_token is null and workspace_name is null)
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
  channel_identifier_id text,
  schedule_id uuid references notification_schedules(id),
  is_active boolean not null default true,
  category_ids uuid[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  last_notified_at timestamp with time zone,
  error_count integer default 0,
  last_error text,
  constraint valid_channel_identifier check (
    (platform = 'email' and channel_identifier_id is null) or
    (platform != 'email' and channel_identifier_id is not null)
  )
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

-- Create notification_channel_feeds table
CREATE TABLE notification_channel_feeds (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references notification_channels(id) on delete cascade,
  feed_id uuid references rss_feeds(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(channel_id, feed_id)
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

-- Add indexes for notification_channel_feeds
CREATE INDEX idx_notification_channel_feeds_channel ON notification_channel_feeds(channel_id);
CREATE INDEX idx_notification_channel_feeds_feed ON notification_channel_feeds(feed_id);


-- Add RLS policies
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table workspace_connections enable row level security;
alter table notification_channels enable row level security;
alter table notification_logs enable row level security;
alter table notification_schedules enable row level security;
alter table notification_channel_feeds enable row level security;

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

CREATE POLICY "Users can update their workspace connections"
  ON workspace_connections FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id
    FROM organization_members
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can select their organization channels"
  ON notification_channels
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id  
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert organization channels"
  ON notification_channels
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert notification channel feeds"
  ON notification_channel_feeds
  FOR INSERT
  TO authenticated
  WITH CHECK (
    channel_id IN (
      SELECT nc.id 
      FROM notification_channels nc
      WHERE nc.organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

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

CREATE POLICY "Users can update their organization channels"
  ON notification_channels
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );
-- Notification schedules policies
CREATE POLICY "Users can view notification schedules"
  ON notification_schedules FOR SELECT
  TO authenticated
  USING (true);

-- Notification channel feeds policies
CREATE POLICY "Users can view their notification channel feeds"
  ON notification_channel_feeds FOR SELECT
  TO authenticated
  USING (
    channel_id IN (
      SELECT nc.id 
      FROM notification_channels nc
      WHERE nc.organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Organization admins can manage notification channel feeds"
  ON notification_channel_feeds FOR ALL
  TO authenticated
  USING (
    channel_id IN (
      SELECT nc.id 
      FROM notification_channels nc
      WHERE nc.organization_id IN (
        SELECT organization_id 
        FROM organization_members 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
      )
    )
  );


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

CREATE POLICY "Service role can create notification channels"
  ON notification_channels FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can create notification logs"
  ON notification_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can create notification schedules"
  ON notification_schedules FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can create notification channel feeds"
  ON notification_channel_feeds FOR INSERT
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
comment on column workspace_connections.workspace_name is 'Display name of the Slack workspace or Discord server';
comment on column notification_channels.channel_identifier is 'Slack channel ID, Discord channel ID, or email address';
comment on column notification_channels.category_ids is 'Optional array of category IDs for filtering';

comment on column notification_logs.recipient is 'The recipient of the notification';
comment on column notification_logs.status is 'The status of the notification attempt';
comment on column notification_logs.error is 'The error message if the notification failed';
comment on column notification_logs.created_at is 'The timestamp of the notification attempt';
comment on column notification_channel_feeds.channel_id is 'The notification channel to notify';
comment on column notification_channel_feeds.feed_id is 'The RSS feed to notify about';


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

create trigger set_notification_logs_updated_at
  before update on notification_logs
  for each row
  execute function moddatetime(updated_at);

create trigger set_notification_channel_feeds_updated_at
  before update on notification_channel_feeds
  for each row
  execute function moddatetime(updated_at);