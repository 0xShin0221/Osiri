-- migration_name: 20240317000001_create_articles
create extension if not exists moddatetime schema extensions;

create type article_scraping_status as enum (
  'pending',     -- Initial state, not yet attempted
  'processing',  -- Currently being scraped
  'completed',   -- Successfully scraped
  'failed',      -- Failed to scrape
  'skipped'      -- Scraping was skipped (e.g., invalid URL)
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  feed_id uuid not null references rss_feeds(id) on delete cascade,
  title text not null,
  content text,
  og_title text,
  og_description text,
  og_image text,
  url text not null,
  scraping_status article_scraping_status not null default 'pending',
  scraping_attempt_count integer not null default 0,
  last_scraping_attempt timestamp with time zone,
  scraping_error text,
  published_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Performance indexes
create index idx_articles_feed_id on articles(feed_id);
create unique index idx_articles_url on articles(url);

-- Auto-update timestamp trigger
create trigger set_articles_updated_at
  before update on articles
  for each row
  execute function moddatetime(updated_at);

-- Enable RLS
alter table articles enable row level security;

-- Article policies
create policy "Anyone can view articles"
  on articles for select
  to authenticated, anon
  using (true);

-- Create index for faster querying of unprocessed articles
create index idx_articles_scraping_status on articles(scraping_status);

-- Add combined index for status and timestamp
create index idx_articles_scraping_status_attempt on articles(scraping_status, last_scraping_attempt);


-- Table and column comments
comment on table articles is 'Articles fetched from RSS feeds';
comment on column articles.feed_id is 'Reference to the source feed';
comment on column articles.title is 'Article title';
comment on column articles.content is 'Article content';
comment on column articles.url is 'Article URL';
comment on column articles.scraping_status is 'Current status of article content scraping';
comment on column articles.scraping_attempt_count is 'Number of times scraping has been attempted';
comment on column articles.last_scraping_attempt is 'Timestamp of the last scraping attempt';
comment on column articles.scraping_error is 'Error message from the last failed scraping attempt';
comment on column articles.og_image is 'Open Graph image URL from article';
comment on column articles.og_title is 'Open Graph title from article';
comment on column articles.og_description is 'Open Graph description from article';


create policy "Service role can insert articles"
  on articles for insert
  with check (true);


create extension if not exists "pg_net" with schema "public" version '0.13.0';

drop policy "Service role can insert articles" on "public"."articles";

alter table "public"."waitlist" alter column "name" set not null;

create policy "Only admins can modify articles"
on "public"."articles"
as permissive
for all
to authenticated
using (COALESCE((((auth.jwt() -> 'app_metadata'::text) ->> 'is_admin'::text))::boolean, false));

create or replace function increment_attempt_count(row_id uuid)
returns integer
language sql
as $$
  update articles
  set scraping_attempt_count = scraping_attempt_count + 1
  where id = row_id
  returning scraping_attempt_count;
$$;

-- Grant necessary permissions
grant execute on function increment_attempt_count(uuid) to authenticated;
grant execute on function increment_attempt_count(uuid) to service_role;