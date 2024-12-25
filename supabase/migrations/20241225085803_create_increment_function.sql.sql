create or replace function increment_attempt_count(row_id uuid)
returns integer
language sql
as $$
  update articles
  set scraping_attempt_count = scraping_attempt_count + 1
  where id = row_id
  returning scraping_attempt_count;
$$;

-- Grant necessary permissions
grant execute on function increment_attempt_count(uuid) to authenticated;
grant execute on function increment_attempt_count(uuid) to service_role;