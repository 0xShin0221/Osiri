DO $$
DECLARE
    digdatech_org_id UUID := '5224c4d4-7f7e-414f-9f86-b0f1a70335e5'::uuid;  -- DigDaTech
    ddt_org_id UUID := '6224c4d4-7f7e-414f-9f86-b0f1a70335e5'::uuid;        -- DDT
    workspace_conn_id1 UUID := '0c24bc65-50aa-4391-afe2-b39b5726b6ec'::uuid;
    workspace_conn_id2 UUID := '1c24bc65-50aa-4391-afe2-b39b5726b6ed'::uuid;
    schedule_id1 UUID;
    schedule_id2 UUID;
    schedule_id3 UUID;
    schedule_id4 UUID;
    schedule_id5 UUID;
    channel_id1 UUID;
    channel_id2 UUID;
    channel_id3 UUID;
BEGIN
    -- First create schedules
    INSERT INTO notification_schedules (
        id,
        name,
        schedule_type,
        timezone,
        cron_expression,
        created_at,
        updated_at
    ) VALUES (
        '9224c4d4-7f7e-414f-9f86-b0f1a70335e1',
        'Tokyo Office Daily Morning',
        'daily_morning',
        'UTC+9',
        NULL,
        '2025-01-06 18:21:47.068159+00',
        '2025-01-06 18:21:47.068159+00'
    ) RETURNING id INTO schedule_id1;

    INSERT INTO notification_schedules (
        id,
        name,
        schedule_type,
        timezone,
        cron_expression,
        created_at,
        updated_at
    ) VALUES (
        '9224c4d4-7f7e-414f-9f86-b0f1a70335e2',
        'NY Office Updates',
        'weekday_morning',
        'UTC-5',
        NULL,
        '2025-01-06 18:21:47.068159+00',
        '2025-01-06 18:21:47.068159+00'
    ) RETURNING id INTO schedule_id2;

    INSERT INTO notification_schedules (
        id,
        name,
        schedule_type,
        timezone,
        cron_expression,
        created_at,
        updated_at
    ) VALUES (
        '9224c4d4-7f7e-414f-9f86-b0f1a70335e3',
        'London Weekly Report',
        'weekly_monday',
        'UTC+0',
        NULL,
        '2025-01-06 18:21:47.068159+00',
        '2025-01-06 18:21:47.068159+00'
    ) RETURNING id INTO schedule_id3;

    -- Verify organizations exist
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = digdatech_org_id) THEN
        RAISE EXCEPTION 'Organization DigDaTech not found';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = ddt_org_id) THEN
        RAISE EXCEPTION 'Organization DDT not found';
    END IF;

    -- Create notification channels
    INSERT INTO notification_channels (
        id,
        organization_id,
        workspace_connection_id,
        platform,
        channel_identifier,
        schedule_id,
        is_active,
        category_ids,
        created_at,
        updated_at,
        last_notified_at
    ) VALUES (
        'a224c4d4-7f7e-414f-9f86-b0f1a70335e1',
        digdatech_org_id,
        workspace_conn_id1,
        'slack',
        '#tokyo-updates',
        schedule_id1,
        true,
        ARRAY['c0a80121-75c8-4c18-8e57-3af4bc3c61d7']::uuid[],
        '2025-01-06 18:21:47.068159+00',
        '2025-01-06 18:21:47.068159+00',
        '2025-01-05 18:21:47.068159+00'
    ) RETURNING id INTO channel_id1;

    INSERT INTO notification_channels (
        id,
        organization_id,
        workspace_connection_id,
        platform,
        channel_identifier,
        schedule_id,
        is_active,
        category_ids,
        created_at,
        updated_at,
        last_notified_at
    ) VALUES (
        'a224c4d4-7f7e-414f-9f86-b0f1a70335e2',
        digdatech_org_id,
        workspace_conn_id1,
        'slack',
        '#ny-tech-news',
        schedule_id2,
        true,
        NULL,
        '2025-01-06 18:21:47.068159+00',
        '2025-01-06 18:21:47.068159+00',
        '2025-01-05 18:21:47.068159+00'
    ) RETURNING id INTO channel_id2;

    -- Link channels to feeds
    INSERT INTO notification_channel_feeds (
        id,
        channel_id,
        feed_id,
        created_at,
        updated_at
    ) VALUES 
    (
        'b224c4d4-7f7e-414f-9f86-b0f1a70335e1',
        channel_id1,
        'f0a80121-75c8-4c18-8e57-3af4bc3c61d1',
        '2025-01-06 18:21:47.068159+00',
        '2025-01-06 18:21:47.068159+00'
    ),
    (
        'b224c4d4-7f7e-414f-9f86-b0f1a70335e2',
        channel_id2,
        'f0a80121-75c8-4c18-8e57-3af4bc3c61d2',
        '2025-01-06 18:21:47.068159+00',
        '2025-01-06 18:21:47.068159+00'
    );

END $$;