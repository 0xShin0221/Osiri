DO $$
DECLARE
    yc_feed_id UUID := gen_random_uuid();
    tc_feed_id UUID := gen_random_uuid();
BEGIN

INSERT INTO public.rss_feeds (
  id, name, url, language, description, site_icon, is_active, last_fetched_at
)
VALUES
  (
    yc_feed_id, 
    'Y Combinator Blog', 
    'https://www.ycombinator.com/blog/rss/', 
    'en',
    'Official blog of Y Combinator, featuring advice and insights for startups',
    'https://ycombinator.com/favicon.ico',
    true,
    NOW()
  ),
  (
    tc_feed_id, 
    'TechCrunch', 
    'https://techcrunch.com/feed', 
    'en',
    'Leading technology media property, dedicated to startup coverage',
    'https://techcrunch.com/favicon.ico',
    false,
    NOW()
  );

INSERT INTO public.articles (
  id, feed_id, title, url, content, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(), 
    yc_feed_id,
    'How to Build a Successful Startup in 2024',
    'https://www.ycombinator.com/blog/startup-success-2024',
    'Building a successful startup requires more than just a good idea. Here are the key lessons...',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    yc_feed_id,
    'Startup School: Building Your MVP',
    'https://www.ycombinator.com/blog/startup-school-building-mvp',
    'Learn how to build and validate your MVP efficiently...',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    tc_feed_id,
    'AI Startup Raises $100M Series A',
    'https://techcrunch.com/ai-startup-funding',
    'Leading AI startup announced today their Series A funding round...',
    NOW(),
    NOW()
  );

END $$;