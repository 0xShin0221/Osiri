INSERT INTO "public"."profiles" ("id", "onboarding_completed", "created_at", "updated_at")
VALUES 
('08b28622-06fb-4ae5-aa5c-9881cfe1796f', true, '2025-01-06 18:20:51.542958+00', '2025-01-06 18:20:51.542958+00'),
('18b28622-06fb-4ae5-aa5c-9881cfe1796f', true, '2025-01-06 18:20:51.542958+00', '2025-01-06 18:20:51.542958+00')
ON CONFLICT (id) 
DO UPDATE SET 
  onboarding_completed = EXCLUDED.onboarding_completed,
  updated_at = EXCLUDED.updated_at;