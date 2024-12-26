insert into rss_feeds (
  id,
  name,
  url,
  language,
  description,
  is_active,
  created_at,
  updated_at,
  last_fetched_at
)
values
  (
    'f0a80121-75c8-4c18-8e57-3af4bc3c61d1',
    'TechCrunch',
    'https://techcrunch.com/feed/',
    'en',
    'Technology news and analysis',
    false,
    now(),
    now(),
    now()
  ),
  (
    'f0a80121-75c8-4c18-8e57-3af4bc3c61d2',
    'MIT Technology Review',
    'https://www.technologyreview.com/feed/',
    'en',
    'Technology insights and analysis',
    false,
    now(),
    now(),
    now()
  );

-- Then insert articles
insert into articles (
  id,
  feed_id,
  title,
  content,
  url,
  created_at,
  updated_at,
  scraping_status,
  scraping_attempt_count
)
values
  (
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d1',
    'f0a80121-75c8-4c18-8e57-3af4bc3c61d1',
    'The Future of AI and Machine Learning',
    'This is a test article about AI and machine learning developments...',
    'https://example.com/ai-ml-article',
    now(),
    now(),
    'completed',
    1
  ),
  (
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d2',
    'f0a80121-75c8-4c18-8e57-3af4bc3c61d2',
    'Cloud Computing and DevOps Integration',
    'An article about integrating cloud computing with DevOps practices...',
    'https://example.com/cloud-devops',
    now(),
    now(),
    'completed',
    1
  ),
  (
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d3',
    'f0a80121-75c8-4c18-8e57-3af4bc3c61d1',
    'Failed Scraping Example',
    null,
    'https://example.com/failed-article',
    now(),
    now(),
    'failed',
    3
  ),
  (
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d4',
    'f0a80121-75c8-4c18-8e57-3af4bc3c61d2',
    'Pending Article',
    null,
    'https://example.com/pending-article',
    now(),
    now(),
    'pending',
    0
  ),
  (
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d6',
    'f0a80121-75c8-4c18-8e57-3af4bc3c61d2',
    'Skipped Article',
    null,
    'https://example.com/skipped-article',
    now(),
    now(),
    'skipped',
    1
  );
  
insert into article_categories (id, name, description, created_at, updated_at)
values
  (
    'c0a80121-75c8-4c18-8e57-3af4bc3c61d6',
    'Startup News',
    'Latest startup news, funding rounds, and company updates',
    now(),
    now()
  ),
  (
    'c0a80121-75c8-4c18-8e57-3af4bc3c61d7',
    'AI/ML',
    'Artificial Intelligence and Machine Learning developments',
    now(),
    now()
  ),
  (
    'c0a80121-75c8-4c18-8e57-3af4bc3c61d8',
    'Web Development',
    'Web technologies, frameworks, and best practices',
    now(),
    now()
  ),
  (
    'c0a80121-75c8-4c18-8e57-3af4bc3c61d9',
    'Cloud Computing',
    'Cloud platforms, services, and infrastructure',
    now(),
    now()
  ),
  (
    'c0a80121-75c8-4c18-8e57-3af4bc3c61da',
    'Cybersecurity',
    'Security news, threats, and protection strategies',
    now(),
    now()
  ),
  (
    'c0a80121-75c8-4c18-8e57-3af4bc3c61db',
    'FinTech',
    'Financial technology innovations and trends',
    now(),
    now()
  ),
  (
    'c0a80121-75c8-4c18-8e57-3af4bc3c61dc',
    'DevOps',
    'Development operations, CI/CD, and tooling',
    now(),
    now()
  );

-- Add some test article-category relations
insert into article_category_relations (article_id, category_id)
values
  ('a0a80121-75c8-4c18-8e57-3af4bc3c61d1', 'c0a80121-75c8-4c18-8e57-3af4bc3c61d6'),
  ('a0a80121-75c8-4c18-8e57-3af4bc3c61d1', 'c0a80121-75c8-4c18-8e57-3af4bc3c61d7'),
  ('a0a80121-75c8-4c18-8e57-3af4bc3c61d2', 'c0a80121-75c8-4c18-8e57-3af4bc3c61d8'),
  ('a0a80121-75c8-4c18-8e57-3af4bc3c61d2', 'c0a80121-75c8-4c18-8e57-3af4bc3c61d9');


  