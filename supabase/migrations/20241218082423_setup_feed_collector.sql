-- migration_name: 20240317000003_setup_feed_collector

-- Install required extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Set up cron job for feed collection (every 15 minutes)
select cron.schedule(
  'collect-feeds-every-15min',
  '*/15 * * * *',
  $$
  select
    net.http_post(
      url:=current_setting('app.base_url') || '/functions/v1/feed-collector-controller',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);