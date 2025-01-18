-- Install required extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  company text,
  role text,
  language text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists waitlist_email_idx on public.waitlist(email);
create index if not exists waitlist_created_at_idx on public.waitlist(created_at);