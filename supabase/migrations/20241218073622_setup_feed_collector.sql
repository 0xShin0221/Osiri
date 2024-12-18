create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Set up cron job for feed collection (every 15 minutes)
select cron.schedule(
  'collect-feeds-every-15min',
  '*/15 * * * *',
  $$
  select
    net.http_post(
      url:='/functions/v1/feed-collector-controller',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);