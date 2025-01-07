INSERT INTO "public"."organizations" ("id", "name", "created_at", "updated_at") 
VALUES ('5224c4d4-7f7e-414f-9f86-b0f1a70335e5', 'DigDaTech', '2025-01-06 18:21:47.068159+00', '2025-01-06 18:21:47.068159+00'),
('6224c4d4-7f7e-414f-9f86-b0f1a70335e5', 'DDT', '2025-01-06 18:21:47.068159+00', '2025-01-06 18:21:47.068159+00');


INSERT INTO "public"."organization_members" ("id", "organization_id", "user_id", "role", "created_at", "updated_at")
VALUES 
('2968c161-a3ad-4ef4-b175-7bd444f78d93', '5224c4d4-7f7e-414f-9f86-b0f1a70335e5', '08b28622-06fb-4ae5-aa5c-9881cfe1796f', 'admin', '2025-01-06 18:21:47.334607+00', '2025-01-06 18:21:47.334607+00'),
('3968c161-a3ad-4ef4-b175-7bd444f78d94', '6224c4d4-7f7e-414f-9f86-b0f1a70335e5', '18b28622-06fb-4ae5-aa5c-9881cfe1796f', 'admin', '2025-01-06 18:21:47.334607+00', '2025-01-06 18:21:47.334607+00');
