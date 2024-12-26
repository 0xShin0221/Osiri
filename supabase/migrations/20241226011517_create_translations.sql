-- Create enum type for translation status
create type translation_status as enum (
  'pending',
  'processing',
  'completed',
  'failed',
  'skipped'
);

-- Create translations table
create table translations (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  target_language feed_language not null,
  content text,
  key_term1 text,
  key_term2 text,
  key_term3 text,
  key_term4 text,
  key_term5 text,
  summary text,
  status translation_status not null default 'pending',
  attempt_count integer not null default 0,
  last_attempt timestamp with time zone,
  error text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(article_id, target_language)
);

-- Add indexes
create index idx_translations_status on translations(status);
create index idx_translations_article_lang on translations(article_id, target_language);
create index idx_translations_target_lang on translations(target_language);

-- Add moddatetime trigger
create trigger set_translations_updated_at
  before update on translations
  for each row
  execute function moddatetime(updated_at);

-- Create view for pending translations
create view pending_translations as
select 
  t.id as translation_id,
  t.article_id,
  t.target_language,
  a.content as original_content,
  a.title as original_title,
  f.language as source_language
from translations t
join articles a on t.article_id = a.id
join rss_feeds f on a.feed_id = f.id
where t.status = 'pending'
  and a.scraping_status = 'completed'
  and t.attempt_count < 3
order by t.created_at asc;

-- Set up RLS policies
create policy "Anyone can view translations"
  on translations for select
  to authenticated, anon
  using (true);

create policy "Only admins can modify translations"
  on translations for all
  to authenticated
  using (coalesce((auth.jwt()->'app_metadata'->>'is_admin')::boolean, false));

-- Add comments
comment on table translations is 'Stores article translations with status tracking';
comment on column translations.key_term1 is 'Preserved industry term 1';
comment on column translations.summary is 'Translated summary of key points (3-5 points)';
