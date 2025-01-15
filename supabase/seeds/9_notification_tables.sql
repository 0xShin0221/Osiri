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
    workspace_conn_id1 UUID := '0c24bc65-50aa-4391-afe2-b39b5726b6ec'::uuid;
    workspace_conn_id2 UUID := '1c24bc65-50aa-4391-afe2-b39b5726b6ed'::uuid;
BEGIN
  -- Get organization IDs
  SELECT id INTO digdatech_org_id FROM organizations WHERE name = 'DigDaTech';
  SELECT id INTO ddt_org_id FROM organizations WHERE name = 'DDT';

  -- Verify organizations exist
  IF digdatech_org_id IS NULL OR ddt_org_id IS NULL THEN
    RAISE EXCEPTION 'Required organizations not found. Please ensure organizations.sql seed has been run first.';
  END IF;

  -- Create notification channels
  INSERT INTO notification_channels (
    id,
    organization_id,
    workspace_connection_id,
    platform,
    channel_identifier,
    channel_identifier_id,
    schedule_id,
    is_active,
    category_ids,
    created_at,
    updated_at,
    last_notified_at,
    error_count,
    last_error,
    notification_language
  )
  VALUES
    (
      gen_random_uuid(),
      digdatech_org_id,
      workspace_conn_id1,
      'slack',
      '#dev-news-ycom',
      'C07PATAAAAP',
      schedule_id1,
      true,
      ARRAY['c0a80121-75c8-4c18-8e57-3af4bc3c61d7']::uuid[],
      NOW(),
      NOW(),
      NOW() - INTERVAL '1 day',
      0,
      NULL,
      'zh'
    )
    RETURNING id INTO channel_id1;

  INSERT INTO notification_channels (
    id,
    organization_id,
    workspace_connection_id,
    platform,
    channel_identifier,
    channel_identifier_id,
    schedule_id,
    is_active,
    category_ids,
    created_at,
    updated_at,
    last_notified_at,
    error_count,
    last_error,
    notification_language
  )
  VALUES
    (
      gen_random_uuid(),
      digdatech_org_id,
      workspace_conn_id1,
      'slack',
      '#general-tech',
      'BB2PATAAAAP',
      schedule_id2,
      true,
      NULL,
      NOW(),
      NOW(),
      NOW() - INTERVAL '1 week',
      0,
      NULL,
      'ja'
    )
    RETURNING id INTO channel_id2;

  INSERT INTO notification_channels (
    id,
    organization_id,
    workspace_connection_id,
    platform,
    channel_identifier,
    channel_identifier_id,
    schedule_id,
    is_active,
    category_ids,
    created_at,
    updated_at,
    last_notified_at,
    error_count,
    last_error,
    notification_language
  )
  VALUES
    (
      gen_random_uuid(),
      ddt_org_id,
      workspace_conn_id2,
      'slack',
      '#ai-ml-updates',
      'C07PA0A4AAP',
      schedule_id3,
      true,
      ARRAY['c0a80121-75c8-4c18-8e57-3af4bc3c61d6', 'c0a80121-75c8-4c18-8e57-3af4bc3c61d7']::uuid[],
      NOW(),
      NOW(),
      NOW() - INTERVAL '2 days',
      1,
      'Rate limit exceeded',
      'ja'
    )
    RETURNING id INTO channel_id3;

  -- Link feeds to channels
  INSERT INTO notification_channel_feeds (
    channel_id,
    feed_id,
    created_at,
    updated_at
  )
  VALUES
    -- Channel 1 feeds
    (channel_id1, 'f0a80121-75c8-4c18-8e57-3af4bc3c61d1', NOW(), NOW()),
    -- Channel 2 feeds
    (channel_id2, 'f0a80121-75c8-4c18-8e57-3af4bc3c61d2', NOW(), NOW()),
    -- Channel 3 feeds
    (channel_id3, 'f0a80121-75c8-4c18-8e57-3af4bc3c61d1', NOW(), NOW()),
    (channel_id3, 'f0a80121-75c8-4c18-8e57-3af4bc3c61d2', NOW(), NOW());

  -- Create notification logs
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