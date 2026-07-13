-- ============================================================================
-- Community Meta — cross-paragon aggregated top companions (public, read-only)
-- Companion to meta_counts()/meta_progress(). Powers the Toon Forge party-buff
-- "Fill" helper: instead of a hardcoded list or hand-tuned scoring, it pulls
-- what the community ACTUALLY runs.
--
-- HOW: for every UNLOCKED bucket (class+paragon+role with >= 5 shared builds —
-- the same k-anonymity floor as meta_counts), rank that bucket's companions
-- (the summoned comp + the 5 active-comp slots) by usage and take its TOP 5.
-- Then aggregate those per-bucket top-5 lists across every unlocked paragon:
-- a comp is ranked first by BREADTH (how many paragons' top-5 it appears in),
-- then by TOTAL usage. This makes the result a cross-paragon "what everyone
-- runs" list that keeps rebalancing as more builds arrive — and it works as
-- long as at least ONE paragon is unlocked, regardless of your own paragon.
--
-- Returns non-identifying aggregate counts only. Deploy via the Management API
-- or Supabase Dashboard -> SQL. Idempotent / safe to re-run.
-- ============================================================================
create or replace function public.meta_top_comps(p_limit integer default 24)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with unlocked as (
    select class, paragon, lower(coalesce(role, '')) as role
    from public.shared_builds
    where build_hash is not null
    group by class, paragon, lower(coalesce(role, ''))
    having count(*) >= 5
  ),
  picks as (
    -- one row per companion pick (summoned + each active slot), tagged by bucket
    select u.class, u.paragon, u.role, c.name
    from public.shared_builds sb
    join unlocked u
      on u.class = sb.class
     and u.paragon = sb.paragon
     and u.role = lower(coalesce(sb.role, ''))
    cross join lateral (
      select (sb.build->'s'->>'summoned') as name
      union all
      select val
      from jsonb_array_elements_text(coalesce(sb.build->'s'->'activeComps', '[]'::jsonb)) as val
    ) c
    where sb.build_hash is not null and c.name is not null and c.name <> ''
  ),
  per_bucket as (
    select class, paragon, role, name, count(*)::int as cnt,
           row_number() over (
             partition by class, paragon, role
             order by count(*) desc, name
           ) as rn
    from picks
    group by class, paragon, role, name
  ),
  top5 as (
    select * from per_bucket where rn <= 5
  ),
  agg as (
    select name,
           count(*)::int as buckets,   -- how many paragons' top-5 include it
           sum(cnt)::int  as total      -- total usage across those top-5 lists
    from top5
    group by name
  )
  select jsonb_build_object(
    'ok', true,
    'unlocked_buckets', (select count(*) from unlocked),
    'comps', coalesce((
      select jsonb_agg(jsonb_build_object('name', name, 'buckets', buckets, 'total', total)
                       order by buckets desc, total desc, name)
      from (
        select * from agg
        order by buckets desc, total desc, name
        limit greatest(1, least(coalesce(p_limit, 24), 60))
      ) x
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.meta_top_comps(integer) to anon, authenticated;

-- Smoke test:
--   select public.meta_top_comps();
