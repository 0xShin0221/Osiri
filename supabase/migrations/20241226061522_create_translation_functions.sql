-- Get articles that need translation
create or replace function get_articles_for_translation(max_articles int)
returns table (
  id uuid,
  title text,
  content text,
  source_language feed_language
) security definer 
set search_path = public
as $$
begin
  return query
    select 
      a.id,
      a.title,
      a.content,
      f.language as source_language
    from articles a
    join rss_feeds f on a.feed_id = f.id
    where a.scraping_status = 'completed'
    and not exists (
      select 1 
      from translations t 
      where t.article_id = a.id
    )
    limit max_articles;
end;
$$ language plpgsql;

-- Create translation tasks for all target languages
create or replace function create_translation_tasks(
  p_article_ids uuid[],
  p_target_languages feed_language[]
)
returns setof translations 
security definer
set search_path = public
as $$
declare
  v_article record;
  v_target_lang feed_language;
  v_result translations;
  v_now timestamp with time zone;
begin
  v_now := now();
  
  -- For each article and target language combination
  for v_article in 
    select a.id, f.language as source_language
    from articles a
    join rss_feeds f on a.feed_id = f.id
    where a.id = any(p_article_ids)
  loop
    foreach v_target_lang in array p_target_languages
    loop
      -- Skip if target language is same as source language
      if v_target_lang != v_article.source_language then
        insert into translations (
          article_id,
          target_language,
          status,
          attempt_count,
          created_at,
          updated_at
        ) values (
          v_article.id,
          v_target_lang,
          'pending',
          0,
          v_now,
          v_now
        ) returning * into v_result;
        
        return next v_result;
      end if;
    end loop;
  end loop;

  return;
end;
$$ language plpgsql;

-- Add debug logging
create or replace function create_translation_tasks_with_logging(
  p_article_ids uuid[],
  p_target_languages feed_language[]
)
returns setof translations 
security definer
set search_path = public
as $$
declare
  v_article record;
  v_target_lang feed_language;
  v_result translations;
  v_now timestamp with time zone;
begin
  raise log 'Starting create_translation_tasks with % articles and % languages', 
    array_length(p_article_ids, 1), 
    array_length(p_target_languages, 1);
  
  v_now := now();
  
  for v_article in 
    select a.id, f.language as source_language
    from articles a
    join rss_feeds f on a.feed_id = f.id
    where a.id = any(p_article_ids)
  loop
    raise log 'Processing article % with source language %', 
      v_article.id, 
      v_article.source_language;
      
    foreach v_target_lang in array p_target_languages
    loop
      if v_target_lang != v_article.source_language then
        raise log 'Creating translation task for language %', v_target_lang;
        
        insert into translations (
          article_id,
          target_language,
          status,
          attempt_count,
          created_at,
          updated_at
        ) values (
          v_article.id,
          v_target_lang,
          'pending',
          0,
          v_now,
          v_now
        ) returning * into v_result;
        
        return next v_result;
      end if;
    end loop;
  end loop;

  raise log 'Finished create_translation_tasks';
  return;
end;
$$ language plpgsql;

-- Comments
comment on function get_articles_for_translation is 'Get articles that need translation based on scraping status and existing translations';
comment on function create_translation_tasks is 'Create translation tasks for specified articles and target languages';
comment on function create_translation_tasks_with_logging is 'Create translation tasks with detailed logging for debugging';

-- Revoke default privileges
revoke execute on function get_articles_for_translation from public;
revoke execute on function create_translation_tasks from public;
revoke execute on function create_translation_tasks_with_logging from public;

-- Grant to specific roles
grant execute on function get_articles_for_translation to service_role;
grant execute on function create_translation_tasks to service_role;
grant execute on function create_translation_tasks_with_logging to service_role;

create or replace function get_required_translation_languages(
  p_article_ids uuid[]
)
returns table (
  article_id uuid,
  source_language feed_language,
  required_languages feed_language[]
) security definer 
set search_path = public
as $$
begin
  return query
    with article_feeds as (
      -- Get source language for each article
      select 
        a.id as article_id,
        f.id as feed_id,
        f.language as source_language
      from articles a
      join rss_feeds f on a.feed_id = f.id
      where a.id = any(p_article_ids)
    ),
    required_translations as (
      -- Get unique required languages for each feed from active channels
      select distinct
        af.article_id,
        af.source_language,
        array_agg(distinct nc.notification_language) filter (
          where nc.notification_language != af.source_language
        ) as required_languages
      from article_feeds af
      -- Join with notification channels through feed follows
      join notification_channel_feeds ncf on ncf.feed_id = af.feed_id
      join notification_channels nc on nc.id = ncf.channel_id
      where nc.is_active = true
      group by af.article_id, af.source_language
    )
    select * from required_translations;
end;
$$ language plpgsql;

-- Function to create translation tasks only for required languages
create or replace function create_smart_translation_tasks(
  p_article_ids uuid[]
)
returns setof translations
security definer
set search_path = public
as $$
declare
  v_article record;
  v_target_lang feed_language;
  v_result translations;
  v_now timestamp with time zone;
begin
  v_now := now();
  
  -- Get required languages for each article
  for v_article in 
    select * from get_required_translation_languages(p_article_ids)
  loop
    -- Skip if no translations required
    if v_article.required_languages is null or array_length(v_article.required_languages, 1) = 0 then
      continue;
    end if;
    
    -- Create translation task for each required language
    foreach v_target_lang in array v_article.required_languages
    loop
      -- Skip if translation already exists
      if not exists (
        select 1 
        from translations t
        where t.article_id = v_article.article_id
        and t.target_language = v_target_lang
      ) then
        insert into translations (
          article_id,
          target_language,
          status,
          attempt_count,
          created_at,
          updated_at
        ) values (
          v_article.article_id,
          v_target_lang,
          'pending',
          0,
          v_now,
          v_now
        ) returning * into v_result;
        
        return next v_result;
      end if;
    end loop;
  end loop;

  return;
end;
$$ language plpgsql;

-- Add debug logging version
create or replace function create_smart_translation_tasks_with_logging(
  p_article_ids uuid[]
)
returns setof translations
security definer
set search_path = public
as $$
declare
  v_article record;
  v_target_lang feed_language;
  v_result translations;
  v_now timestamp with time zone;
begin
  raise log 'Starting create_smart_translation_tasks with % articles', 
    array_length(p_article_ids, 1);
  
  v_now := now();
  
  for v_article in 
    select * from get_required_translation_languages(p_article_ids)
  loop
    raise log 'Processing article % with source language % and required languages %',
      v_article.article_id,
      v_article.source_language,
      v_article.required_languages;
      
    if v_article.required_languages is null or array_length(v_article.required_languages, 1) = 0 then
      raise log 'No translations required for article %', v_article.article_id;
      continue;
    end if;
    
    foreach v_target_lang in array v_article.required_languages
    loop
      if not exists (
        select 1 
        from translations t
        where t.article_id = v_article.article_id
        and t.target_language = v_target_lang
      ) then
        raise log 'Creating translation task for article % to language %',
          v_article.article_id,
          v_target_lang;
          
        insert into translations (
          article_id,
          target_language,
          status,
          attempt_count,
          created_at,
          updated_at
        ) values (
          v_article.article_id,
          v_target_lang,
          'pending',
          0,
          v_now,
          v_now
        ) returning * into v_result;
        
        return next v_result;
      else
        raise log 'Translation already exists for article % to language %',
          v_article.article_id,
          v_target_lang;
      end if;
    end loop;
  end loop;

  raise log 'Finished create_smart_translation_tasks';
  return;
end;
$$ language plpgsql;

-- Comments
comment on function get_required_translation_languages is 'Get required translation languages for articles based on active notification channels';
comment on function create_smart_translation_tasks is 'Create translation tasks only for required target languages';
comment on function create_smart_translation_tasks_with_logging is 'Create translation tasks with detailed logging for debugging';

-- Revoke and grant permissions
revoke execute on function get_required_translation_languages from public;
revoke execute on function create_smart_translation_tasks from public;
revoke execute on function create_smart_translation_tasks_with_logging from public;

grant execute on function get_required_translation_languages to service_role;
grant execute on function create_smart_translation_tasks to service_role;
grant execute on function create_smart_translation_tasks_with_logging to service_role;