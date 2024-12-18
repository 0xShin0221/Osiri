do $$
begin
  execute format('alter database %I set app.base_url = %L', current_database(), current_setting('app.base_url'));
  execute format('alter database %I set app.service_role_key = %L', current_database(), current_setting('app.service_role_key'));
end;
$$ language plpgsql;