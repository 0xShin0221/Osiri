create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Organization members can view profiles"
  on public.profiles for select
  using (
    exists (
      select 1 
      from organization_members om
      where om.user_id = auth.uid()
      and exists (
        select 1 
        from organization_members
        where organization_id = om.organization_id
        and user_id = profiles.id
      )
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Create trigger function
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add moddatetime trigger
create trigger set_profile_updated_at
  before update on profiles
  for each row
  execute function moddatetime(updated_at);