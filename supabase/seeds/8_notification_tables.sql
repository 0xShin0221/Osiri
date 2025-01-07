DO $$
DECLARE
    schedule_id1 UUID;
    schedule_id2 UUID;
    schedule_id3 UUID;
    channel_id1 UUID;
    channel_id2 UUID;
    channel_id3 UUID;
    digdatech_org_id UUID;
    ddt_org_id UUID;
    workspace_conn_id1 UUID := '0c24bc65-50aa-4391-afe2-b39b5726b6ec'::uuid; -- From workspace_connections.sql
    workspace_conn_id2 UUID := '1c24bc65-50aa-4391-afe2-b39b5726b6ed'::uuid; -- From workspace_connections.sql
BEGIN
  -- Get organization IDs
  select id into digdatech_org_id from organizations where name = 'DigDaTech';
  select id into ddt_org_id from organizations where name = 'DDT';

  -- Verify organizations exist
  if digdatech_org_id is null or ddt_org_id is null then
    raise exception 'Required organizations not found. Please ensure organizations.sql seed has been run first.';
  end if;

  -- First create schedules
INSERT INTO notification_schedules (
  id,
  name,
  schedule_type,
  timezone,
  created_at,
  updated_at
)
VALUES
  (
    gen_random_uuid(),
    'Morning News Update',
    'daily_morning',
    'UTC+9',
    NOW(),
    NOW()
  )
  RETURNING id INTO schedule_id1;

INSERT INTO notification_schedules (
  id,
  name,
  schedule_type,
  timezone,
  created_at,
  updated_at
)
VALUES
  (
    gen_random_uuid(),
    'Weekly Monday Digest',
    'weekly_monday',
    'UTC+9',
    NOW(),
    NOW()
  )
  RETURNING id INTO schedule_id2;

INSERT INTO notification_schedules (
  id,
  name,
  schedule_type,
  cron_expression,
  timezone,
  created_at,
  updated_at
)
VALUES
  (
    gen_random_uuid(),
    'Custom Schedule',
    'custom',
    '0 */2 * * *', -- Every 2 hours
    'UTC+0',
    NOW(),
    NOW()
  )
  RETURNING id INTO schedule_id3;

-- Notification channels referencing workspace connections
INSERT INTO notification_channels (
  id,
  organization_id,
  workspace_connection_id,
  platform,
  channel_identifier,
  schedule_id,
  is_active,
  feed_ids,
  category_ids,
  created_at,
  updated_at,
  last_notified_at,
  error_count,
  last_error
)
VALUES
  (
    gen_random_uuid(),
    digdatech_org_id,
    workspace_conn_id1,
    'slack',
    'C04MXMRP9H6', -- Example Slack channel ID
    schedule_id1,
    true,
    ARRAY['f0a80121-75c8-4c18-8e57-3af4bc3c61d1']::uuid[], -- TechCrunch feed from article_categories.sql
    ARRAY['c0a80121-75c8-4c18-8e57-3af4bc3c61d7']::uuid[], -- AI/ML category from article_categories.sql
    NOW(),
    NOW(),
    NOW() - INTERVAL '1 day',
    0,
    NULL
  )
  RETURNING id INTO channel_id1;

INSERT INTO notification_channels (
  id,
  organization_id,
  workspace_connection_id,
  platform,
  channel_identifier,
  schedule_id,
  is_active,
  feed_ids,
  category_ids,
  created_at,
  updated_at,
  last_notified_at,
  error_count,
  last_error
)
VALUES
  (
    gen_random_uuid(),
    digdatech_org_id,
    workspace_conn_id1,
    'slack',
    'C04MXMRP9H7', -- Example Slack channel ID
    schedule_id2,
    true,
    ARRAY['f0a80121-75c8-4c18-8e57-3af4bc3c61d2']::uuid[], -- MIT Tech Review feed
    NULL,
    NOW(),
    NOW(),
    NOW() - INTERVAL '1 week',
    0,
    NULL
  )
  RETURNING id INTO channel_id2;

INSERT INTO notification_channels (
  id,
  organization_id,
  workspace_connection_id,
  platform,
  channel_identifier,
  schedule_id,
  is_active,
  feed_ids,
  category_ids,
  created_at,
  updated_at,
  last_notified_at,
  error_count,
  last_error
)
VALUES
  (
    gen_random_uuid(),
    ddt_org_id,
    workspace_conn_id2,
    'slack',
    'C04MXMRP9H8', -- Example Slack channel ID
    schedule_id3,
    true,
    ARRAY['f0a80121-75c8-4c18-8e57-3af4bc3c61d1', 'f0a80121-75c8-4c18-8e57-3af4bc3c61d2']::uuid[],
    ARRAY['c0a80121-75c8-4c18-8e57-3af4bc3c61d6', 'c0a80121-75c8-4c18-8e57-3af4bc3c61d7']::uuid[],
    NOW(),
    NOW(),
    NOW() - INTERVAL '2 days',
    1,
    'Rate limit exceeded'
  )
  RETURNING id INTO channel_id3;

-- Notification logs
INSERT INTO notification_logs (
  id,
  platform,
  channel_id,
  article_id,
  recipient,
  status,
  error,
  created_at
)
VALUES
  (
    gen_random_uuid(),
    'slack',
    channel_id1,
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d1'::uuid,
    'C04MXMRP9H6',
    'success',
    NULL,
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'slack',
    channel_id1,
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d2'::uuid,
    'C04MXMRP9H6',
    'failed',
    'Channel not found in workspace',
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    'slack',
    channel_id2,
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d3'::uuid,
    'C04MXMRP9H7',
    'success',
    NULL,
    NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(),
    'slack',
    channel_id3,
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d4'::uuid,
    'C04MXMRP9H8',
    'pending',
    NULL,
    NOW()
  ),
  (
    gen_random_uuid(),
    'slack',
    channel_id3,
    'a0a80121-75c8-4c18-8e57-3af4bc3c61d6'::uuid,
    'C04MXMRP9H8',
    'failed',
    'No new articles to send',
    NOW() - INTERVAL '1 day'
  );

END $$;
