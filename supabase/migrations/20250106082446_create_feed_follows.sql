-- Create organization feed follows table
create table organization_feed_follows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade not null,
  feed_id uuid references rss_feeds(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  -- Ensure unique follows per organization
  unique(organization_id, feed_id)
);

-- Add indexes for performance
create index idx_org_feed_follows_org on organization_feed_follows(organization_id);
create index idx_org_feed_follows_feed on organization_feed_follows(feed_id);
create index idx_org_feed_follows_created on organization_feed_follows(created_at);

-- Enable RLS
alter table organization_feed_follows enable row level security;

-- RLS policies
create policy "Organization members can view feed follows"
  on organization_feed_follows for select
  to authenticated
  using (
    organization_id in (
      select organization_id 
      from organization_members 
      where user_id = auth.uid()
    )
  );

create policy "Organization admins can manage feed follows"
  on organization_feed_follows for all
  to authenticated
  using (
    organization_id in (
      select organization_id 
      from organization_members 
      where user_id = auth.uid() 
      and role = 'admin'
    )
  );

-- Add moddatetime trigger
create trigger set_org_feed_follows_updated_at
  before update on organization_feed_follows
  for each row
  execute function moddatetime(updated_at);

-- Add comments
comment on table organization_feed_follows is 'Tracks which RSS feeds organizations are following';
comment on column organization_feed_follows.organization_id is 'The organization following the feed';
comment on column organization_feed_follows.feed_id is 'The RSS feed being followed';
