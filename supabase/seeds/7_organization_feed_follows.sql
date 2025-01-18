INSERT INTO "public"."organization_feed_follows" ("id", "organization_id", "feed_id", "created_at", "updated_at")
VALUES 
(
  gen_random_uuid(),
  '5224c4d4-7f7e-414f-9f86-b0f1a70335e5', -- DigDaTech organization
  'f0a80121-75c8-4c18-8e57-3af4bc3c61d1', -- TechCrunch feed
  '2025-01-06 18:21:47.068159+00',
  '2025-01-06 18:21:47.068159+00'
),
(
  gen_random_uuid(),
  '5224c4d4-7f7e-414f-9f86-b0f1a70335e5', -- DigDaTech organization
  'f0a80121-75c8-4c18-8e57-3af4bc3c61d2', -- MIT Technology Review feed
  '2025-01-06 18:21:47.068159+00',
  '2025-01-06 18:21:47.068159+00'
),
(
  gen_random_uuid(),
  '6224c4d4-7f7e-414f-9f86-b0f1a70335e5', -- DDT organization
  'f0a80121-75c8-4c18-8e57-3af4bc3c61d1', -- TechCrunch feed
  '2025-01-06 18:21:47.068159+00',
  '2025-01-06 18:21:47.068159+00'
);
