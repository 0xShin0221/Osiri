-- migration_name: 20240317000001_create_articles
create extension if not exists moddatetime schema extensions;

create table articles (
  id uuid primary key default gen_random_uuid(),
  feed_id uuid not null references rss_feeds(id) on delete cascade,
  title text not null,
  content text,
  url text not null,
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
  execute function moddatetime();

-- Enable RLS
alter table articles enable row level security;

-- Article policies
create policy "Anyone can view articles"
  on articles for select
  to authenticated, anon
  using (true);

create policy "Only admins can modify articles"
  on articles for all
  to authenticated
  using (coalesce((auth.jwt()->'app_metadata'->>'is_admin')::boolean, false));

-- Table and column comments
comment on table articles is 'Articles fetched from RSS feeds';
comment on column articles.feed_id is 'Reference to the source feed';
comment on column articles.title is 'Article title';
comment on column articles.content is 'Article content';
comment on column articles.url is 'Article URL';