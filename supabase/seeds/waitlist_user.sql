insert into public.waitlist (email, name, company, role, language)
values
  ('test1@example.com', 'Test User 1', 'Company A', 'Founder', 'en'),
  ('test2@example.com', 'テストユーザー2', '株式会社B', 'CTO', 'ja')
on conflict (email) do nothing;