-- migration_name: 20240317000000_create_rss_feeds

-- Install required extension
create extension if not exists moddatetime schema extensions;

-- Create enum for feed languages
create type feed_language as enum (
  'en', 'ja', 'zh', 'ko', 'fr', 'es', 
  'hi', 'pt', 'bn', 'ru', 'id', 'de'
);

-- RSS Feed table
create table rss_feeds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  url text not null unique,
  language feed_language not null default 'en',
  is_active boolean not null default true,
  last_fetched_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Performance indexes
create index idx_rss_feeds_active on rss_feeds(is_active) where is_active = true;
create index idx_rss_feeds_last_fetched on rss_feeds(last_fetched_at);

-- Auto-update timestamp trigger
create trigger set_rss_feeds_updated_at
  before update on rss_feeds
  for each row
  execute function moddatetime();

-- Enable RLS
alter table rss_feeds enable row level security;

-- RSS Feed policies
create policy "Anyone can view rss feeds"
  on rss_feeds for select
  to authenticated, anon
  using (true);

create policy "Only admins can modify rss feeds"
  on rss_feeds for all
  to authenticated
  using (coalesce((auth.jwt()->'app_metadata'->>'is_admin')::boolean, false));

-- Table and column comments
comment on table rss_feeds is 'RSS feed source information';
comment on column rss_feeds.name is 'Feed name';
comment on column rss_feeds.description is 'Feed description';
comment on column rss_feeds.url is 'Feed URL';
comment on column rss_feeds.language is 'Primary language of the feed';
comment on column rss_feeds.is_active is 'Active/inactive flag';
comment on column rss_feeds.last_fetched_at is 'Last fetched timestamp';