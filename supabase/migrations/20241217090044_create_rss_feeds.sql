-- migration_name: 20240317000000_create_rss_feeds

-- Install required extension
create extension if not exists moddatetime schema extensions;

-- Create enum for feed languages
create type feed_language as enum (
  'en', 'ja', 'zh', 'ko', 'fr', 'es', 
  'hi', 'pt', 'bn', 'ru', 'id', 'de'
);

-- Create more detailed enum for feed categories
CREATE TYPE feed_category AS ENUM (
  -- Learning & Personal Development
  'learning_productivity',
  'critical_thinking',
  'mental_models',
  'personal_development',
  'self_improvement', -- Focus on personal growth and development
  'productivity_tools', -- Tools and techniques for increased productivity
  'time_management', -- Strategies for effective time use

  -- Business & Startups
  'startup_news',
  'venture_capital',
  'entrepreneurship',
  'product_management',
  'leadership',
  'business_strategy',
  'business_finance', -- Financial aspects of business operations
  'small_business', -- Topics relevant to small businesses
  'e_commerce', -- Online commerce and retail

  -- Technology
  'tech_news',
  'software_development',
  'web_development',
  'mobile_development',
  'devops',
  'cybersecurity',
  'cloud_computing', -- Cloud-based technologies and services
  'open_source', -- Open-source software and development
  'blockchain', -- Distributed ledger technology

  -- Engineering
  'engineering_general',
  'system_design',
  'backend_engineering',
  'frontend_engineering',
  'data_engineering',
  'infrastructure',
  'civil_engineering', -- Design and construction of infrastructure
  'mechanical_engineering', -- Design and manufacturing of mechanical systems
  'electrical_engineering', -- Design and application of electrical systems

  -- AI & Data Science
  'machine_learning',
  'artificial_intelligence',
  'data_science',
  'deep_learning',
  'nlp',
  'computer_vision',
  'data_mining', -- Extracting patterns from large datasets
  'big_data', -- Handling and processing large volumes of data
  'ai_ethics', -- Ethical considerations in AI development

  -- Design
  'ux_design',
  'ui_design',
  'product_design',
  'design_systems',
  'web_design',
  'interaction_design',
  'graphic_design', -- Visual communication and design
  'motion_graphics', -- Animated graphics and visual effects
  '3d_design', -- Three-dimensional design and modeling

  -- Science & Research
  'computer_science',
  'neuroscience',
  'psychology',
  'cognitive_science',
  'data_analytics',
  'research_papers',
  'physics', -- Study of the fundamental laws of nature
  'chemistry', -- Study of matter and its properties
  'biology', -- Study of living organisms

  -- Marketing & Growth
  'digital_marketing',
  'growth_marketing',
  'content_marketing',
  'seo',
  'social_media',
  'marketing_analytics',
  'email_marketing', -- Marketing through email campaigns
  'affiliate_marketing', -- Performance-based marketing
  'public_relations', -- Managing public image and communication

  -- Culture & Lifestyle (More granular categories)
  'art_and_culture', -- General arts and cultural topics
  'visual_arts', -- Painting, sculpture, photography, etc.
  'performing_arts', -- Theater, music, dance, etc.
  'literature', -- Novels, poetry, essays, etc.
  'film_and_cinema', -- Movies and filmmaking
  'music', -- General music topics
  'fashion', -- Clothing, style, and trends
  'beauty', -- Cosmetics, skincare, and personal care
  'food_and_beverage', -- Culinary arts, recipes, and dining
  'travel', -- Tourism, destinations, and experiences
  'lifestyle', -- General lifestyle topics
  'home_and_garden', -- Home decor, gardening, and DIY
  'parenting', -- Raising children and family life
  'health_and_fitness', -- Physical and mental well-being

  -- News & Current Events
  'news', -- General news and current events
  'world_news', -- International news and affairs
  'business_news', -- News related to business and finance
  'tech_news_general', -- General technology news
  'science_news', -- News related to scientific discoveries

  -- Mobile & Operating Systems
  'android', -- Android operating system and ecosystem
  'ios', -- iOS operating system and ecosystem

  -- Finance (More specific categories)
  'personal_finance', -- Managing personal finances
  'investing', -- Investing in stocks, bonds, etc.
  'real_estate', -- Real estate market and investments
  'economics', -- Economic theories and trends

  -- Development (More specific categories)
  'web_development_frontend', -- Client-side web development
  'web_development_backend', -- Server-side web development
  'mobile_app_development', -- Development of mobile applications
  'game_development', -- Development of video games
  'software_engineering', -- Principles and practices of software development

  -- Other/General Interest
  'space', -- Space exploration and astronomy
  'television', -- Television shows and programming
  'sports', -- General sports news and events
  'podcasts', -- Audio programs and discussions
  'video', -- Video content and streaming
  'comics', -- Comic books and graphic novels
  'gaming_general' -- General gaming news and reviews
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
