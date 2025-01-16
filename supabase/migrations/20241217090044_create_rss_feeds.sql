-- migration_name: 20240317000000_create_rss_feeds

-- Install required extension
create extension if not exists moddatetime schema extensions;

-- Create enum for feed languages
create type feed_language as enum (
  'en', 'ja', 'zh', 'ko', 'fr', 'es', 
  'hi', 'pt', 'bn', 'ru', 'id', 'de'
);

-- Create more detailed enum for feed categories
create type feed_category as enum (
  -- Learning & Personal Development
  'learning_productivity',
  'critical_thinking',
  'mental_models',
  'personal_development',
  
  -- Business & Startups
  'startup_news',
  'venture_capital',
  'entrepreneurship',
  'product_management',
  'leadership',
  'business_strategy',
  
  -- Technology
  'tech_news',
  'software_development',
  'web_development',
  'mobile_development',
  'devops',
  'cybersecurity',
  
  -- Engineering
  'engineering_general',
  'system_design',
  'backend_engineering',
  'frontend_engineering',
  'data_engineering',
  'infrastructure',
  
  -- AI & Data Science
  'machine_learning',
  'artificial_intelligence',
  'data_science',
  'deep_learning',
  'nlp',
  'computer_vision',
  
  -- Design
  'ux_design',
  'ui_design',
  'product_design',
  'design_systems',
  'web_design',
  'interaction_design',
  
  -- Science & Research
  'computer_science',
  'neuroscience',
  'psychology',
  'cognitive_science',
  'data_analytics',
  'research_papers',
  
  -- Marketing & Growth
  'digital_marketing',
  'growth_marketing',
  'content_marketing',
  'seo',
  'social_media',
  'marketing_analytics'
);

-- Create enum for technical feed status
create type feed_health_status as enum (
  'active',          -- Feed is working normally
  'error',           -- Feed has technical issues
  'invalid_format',  -- Feed format is invalid
  'not_found',       -- Feed URL returns 404
  'timeout',         -- Feed requests timeout
  'rate_limited',    -- Being rate limited by the source
  'blocked',         -- IP/Access blocked by the source
  'pending_check'    -- Newly added, pending verification
);

-- Create enum for content quality status
create type feed_content_status as enum (
  'verified',        -- Content quality verified by admin
  'unverified',      -- New feed, content not verified
  'low_quality',     -- Poor content quality
  'spam',            -- Contains spam content
  'duplicate',       -- Duplicate of another feed
  'inappropriate'    -- Inappropriate content
);


-- RSS Feed table
create table rss_feeds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  url text not null unique,
  site_icon text,
  categories feed_category[] not null default '{}',
  language feed_language not null default 'en',
  is_active boolean not null default false,
  last_fetched_at timestamp with time zone,
  health_status feed_health_status,
  content_status feed_content_status,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Performance indexes
create index idx_rss_feeds_active on rss_feeds(is_active) where is_active = true;
create index idx_rss_feeds_last_fetched on rss_feeds(last_fetched_at);
create index idx_rss_feeds_categories on rss_feeds using gin(categories);

-- Auto-update timestamp trigger
create trigger set_rss_feeds_updated_at
  before update on rss_feeds
  for each row
  execute function moddatetime(updated_at);

-- Enable RLS
alter table rss_feeds enable row level security;

-- RSS Feed policies
create policy "Anyone can view rss feeds"
  on rss_feeds for select
  to authenticated, anon
  using (true);

create policy "Allow authenticated users to modify rss feeds"
  on rss_feeds for update
  to authenticated
  using (true)
  with check (true);

create policy "Service role can insert rss feeds"
  on rss_feeds for insert
  to service_role
  with check (true);

-- Table and column comments
comment on table rss_feeds is 'RSS feed source information';
comment on column rss_feeds.name is 'Feed name';
comment on column rss_feeds.description is 'Feed description';
comment on column rss_feeds.url is 'Feed URL';
comment on column rss_feeds.language is 'Primary language of the feed';
comment on column rss_feeds.is_active is 'Active/inactive flag';
comment on column rss_feeds.last_fetched_at is 'Last fetched timestamp';
comment on column rss_feeds.categories is 'Array of feed categories';

-- Hacker News (multiple categories as it covers various topics)
insert into rss_feeds (
  name,
  description,
  site_icon,
  url,
  language,
  is_active,
  health_status,
  content_status,
  categories
) values (
  'Hacker News',
  'Tech news and interesting discussions from Hacker News',
  'https://news.ycombinator.com/favicon.ico',
  'http://news.ycombinator.com/rss',
  'en',
  true,
  'active',
  'verified',
  array['tech_news', 'software_development', 'startup_news']::feed_category[]
);
