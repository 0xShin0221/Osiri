-- Function to convert UTC offset to timezone offset string
CREATE OR REPLACE FUNCTION get_timezone_offset(tz utc_offset) 
RETURNS text AS $$
BEGIN
  -- Remove 'UTC' prefix and convert to PostgreSQL compatible format
  RETURN regexp_replace(tz::text, 'UTC', '');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- scheduled_notifications_view
CREATE VIEW scheduled_notifications_view AS
SELECT 
  nc.id as channel_id,
  nc.organization_id,
  nc.channel_identifier,
  ns.timezone,
  ns.schedule_type,
  (NOW() + get_timezone_offset(ns.timezone)::interval)::TIME as local_time,
  EXTRACT(DOW FROM (NOW() + get_timezone_offset(ns.timezone)::interval)) as local_dow
FROM 
  notification_channels nc
JOIN 
  notification_schedules ns ON nc.schedule_id = ns.id
WHERE 
  nc.is_active = true;


-- typescript
-- async function processScheduledNotifications() {
--   const db = getDatabase();

--   // スケジュールタイプに応じた通知処理
--   const scheduledChannels = await db.query(`
--     SELECT * FROM scheduled_notifications_view
--     WHERE (
--       -- リアルタイム
--       schedule_type = 'realtime'
--       OR
--       -- 毎日朝9時
--       (schedule_type = 'daily_morning' 
--        AND local_time BETWEEN '09:00' AND '09:02')
--       OR
--       -- 毎日夕方18時
--       (schedule_type = 'daily_evening' 
--        AND local_time BETWEEN '18:00' AND '18:02')
--       OR
--       -- 平日朝のみ9時
--       (schedule_type = 'weekday_morning' 
--        AND local_dow BETWEEN 1 AND 5
--        AND local_time BETWEEN '09:00' AND '09:02')
--       OR
--       -- 月曜朝9時
--       (schedule_type = 'weekly_monday' 
--        AND local_dow = 1
--        AND local_time BETWEEN '09:00' AND '09:02')
--     )
--   `);

--   for (const channel of scheduledChannels) {
--     await processChannelNotifications(channel);
--   }
-- }