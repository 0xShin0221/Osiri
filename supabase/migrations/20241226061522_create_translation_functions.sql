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
