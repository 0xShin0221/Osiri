create type article_scraping_status as enum (
  'pending',     -- Initial state, not yet attempted
  'processing',  -- Currently being scraped
  'completed',   -- Successfully scraped
  'failed',      -- Failed to scrape
  'skipped'      -- Scraping was skipped (e.g., invalid URL)
);

-- Add scraping_status column to articles table
alter table articles
  add column scraping_status article_scraping_status not null default 'pending',
  add column scraping_attempt_count integer not null default 0,
  add column last_scraping_attempt timestamp with time zone,
  add column scraping_error text;

-- Create index for faster querying of unprocessed articles
create index idx_articles_scraping_status on articles(scraping_status);

-- Add combined index for status and timestamp
create index idx_articles_scraping_status_attempt on articles(scraping_status, last_scraping_attempt);

-- Comment on columns
comment on column articles.scraping_status is 'Current status of article content scraping';
comment on column articles.scraping_attempt_count is 'Number of times scraping has been attempted';
comment on column articles.last_scraping_attempt is 'Timestamp of the last scraping attempt';
comment on column articles.scraping_error is 'Error message from the last failed scraping attempt';
