create table if not exists public.newsletter_subscriptions (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  language text not null,
  status text not null default 'active', -- active, unsubscribed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists newsletter_subscriptions_email_idx on newsletter_subscriptions(email);
create index if not exists newsletter_subscriptions_status_idx on newsletter_subscriptions(status);
create index if not exists newsletter_subscriptions_created_at_idx on newsletter_subscriptions(created_at);

-- Add updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_newsletter_subscriptions_updated_at
    before update on newsletter_subscriptions
    for each row
    execute procedure update_updated_at_column();