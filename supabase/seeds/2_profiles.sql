INSERT INTO "public"."profiles" (
    "id", 
    "email",
    "onboarding_completed", 
    "created_at", 
    "updated_at"
)
VALUES 
(
    '08b28622-06fb-4ae5-aa5c-9881cfe1796f',
    'user1@example.com',
    true,
    '2025-01-06 18:20:51.542958+00',
    '2025-01-06 18:20:51.542958+00'
),
(
    '18b28622-06fb-4ae5-aa5c-9881cfe1796f',
    'user2@example.com',
    true,
    '2025-01-06 18:20:51.542958+00',
    '2025-01-06 18:20:51.542958+00'
)
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  onboarding_completed = EXCLUDED.onboarding_completed,
  updated_at = EXCLUDED.updated_at;