-- Create profiles table with UUID primary key
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add unique constraint on user_id to ensure one profile per user
alter table public.profiles add constraint profiles_user_id_key unique (user_id);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = user_id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = user_id );

create policy "Users can create own profile"
  on public.profiles for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Anon can create profile"
  on public.profiles for insert
  to anon
  with check ( auth.uid() = user_id );

-- Add moddatetime trigger
create trigger set_profile_updated_at
  before update on article_categories
  for each row
  execute function moddatetime(updated_at);
