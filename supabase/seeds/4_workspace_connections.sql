-- 3. Workspace Connections
INSERT INTO "public"."workspace_connections" (
  "id",
  "organization_id",
  "platform",
  "workspace_id",
  "access_token",
  "refresh_token",
  "token_expires_at",
  "workspace_name",
  "is_active",
  "is_disconnected",
  "created_at",
  "updated_at"
)
VALUES 
(
  '0c24bc65-50aa-4391-afe2-b39b5726b6ec',
  '5224c4d4-7f7e-414f-9f86-b0f1a70335e5',
  'slack',
  'T079THJ3Y3A',
  'xoxb-7333596134112-8237912842309-Sdh447x8HICuoFSjdvFL9tdf',
  NULL,
  NOW() + INTERVAL '30 days',
  'DDT extra 1',
  true,
  false,
  NOW(),
  NOW()
),
(
  '1c24bc65-50aa-4391-afe2-b39b5726b6ed',
  '5224c4d4-7f7e-414f-9f86-b0f1a70335e5',
  'slack',
  'T079THJ3Y3B',
  'xoxb-7333596134112-8237912842309-Sdh447x8HICuoFSjdvFL9tde',
  NULL,
  NOW() + INTERVAL '30 days',
  'Digital Data Team Jp',
  true,
  false,
  NOW(),
  NOW()
);
