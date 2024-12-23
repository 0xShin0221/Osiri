create extension if not exists "pg_net" with schema "public" version '0.13.0';

drop policy "Service role can insert articles" on "public"."articles";

alter table "public"."waitlist" alter column "name" set not null;

create policy "Only admins can modify articles"
on "public"."articles"
as permissive
for all
to authenticated
using (COALESCE((((auth.jwt() -> 'app_metadata'::text) ->> 'is_admin'::text))::boolean, false));



