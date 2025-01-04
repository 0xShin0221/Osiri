-- SQL migration for profiles table
create table public.profiles (
  user_id uuid primary key references auth.users on delete cascade,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = user_id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = user_id );