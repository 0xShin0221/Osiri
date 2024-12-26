-- Create article categories table
create table article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create article_category_relations table for many-to-many
create table article_category_relations (
  article_id uuid references articles(id) on delete cascade,
  category_id uuid references article_categories(id) on delete cascade,
  primary key (article_id, category_id)
);

-- Set up RLS policies
create policy "Anyone can view article categories"
  on article_categories for select
  to authenticated, anon
  using (true);

create policy "Only admins can modify article categories"
  on article_categories for all
  to authenticated
  using (coalesce((auth.jwt()->'app_metadata'->>'is_admin')::boolean, false));

create policy "Anyone can view article category relations"
  on article_category_relations for select
  to authenticated, anon
  using (true);

create policy "Only admins can modify article category relations"
  on article_category_relations for all
  to authenticated
  using (coalesce((auth.jwt()->'app_metadata'->>'is_admin')::boolean, false));

-- Add moddatetime trigger
create trigger set_article_categories_updated_at
  before update on article_categories
  for each row
  execute function moddatetime(updated_at);
