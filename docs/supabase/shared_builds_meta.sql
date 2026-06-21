-- ============================================================================
-- Community-learning optimizer — Phase 2: meta tracker READ path
-- Roadmap: docs/community_feedback.md  (Report #142)
--
-- Run this ONCE in the Supabase SQL editor (after shared_builds.sql).
-- It adds `meta_counts(class, paragon, role)` — the only read path the public
-- key gets. It returns AGGREGATE COUNTS ONLY (never raw builds), computed live
-- from the table each call, so the tracker is always current.
--
-- Privacy floor: if fewer than MIN_BUILDS match a segment, it returns no counts
-- (just the total) — so a segment with 1–2 builds can't expose an individual
-- build's exact picks. Raise MIN_BUILDS for stricter k-anonymity.
-- ============================================================================

create or replace function public.meta_counts(
  p_class   text,
  p_paragon text,
  p_role    text
) returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  MIN_BUILDS constant int := 5;   -- privacy floor (k-anonymity)
  v_total  int;
  v_counts jsonb;
begin
  select count(*) into v_total
  from public.shared_builds
  where class = p_class and paragon = p_paragon and role = p_role;

  if v_total < MIN_BUILDS then
    return jsonb_build_object('total', v_total, 'insufficient', true, 'min', MIN_BUILDS, 'counts', '[]'::jsonb);
  end if;

  with f as (
    select build from public.shared_builds
    where class = p_class and paragon = p_paragon and role = p_role
  ),
  raw as (
    -- one (category, slot, name) row per pick, across every matching build
    select 'race'::text cat, null::text slot, (build->'s'->>'race') name from f
    union all select 'atwill', null, e from f, jsonb_array_elements_text(coalesce(build->'s'->'slottedAtWills','[]'::jsonb)) e
    union all select 'encounter', null, e from f, jsonb_array_elements_text(coalesce(build->'s'->'slottedEncounters','[]'::jsonb)) e
    union all select 'daily', null, e from f, jsonb_array_elements_text(coalesce(build->'s'->'slottedDailies','[]'::jsonb)) e
    union all select 'classfeature', null, e from f, jsonb_array_elements_text(coalesce(build->'s'->'slottedClassFeaturePicks','[]'::jsonb)) e
    union all select 'feat', null, e from f, jsonb_array_elements_text(coalesce(build->'s'->'slottedFeats','[]'::jsonb)) e
    union all select 'gear', g.key, g.value from f, jsonb_each_text(case when jsonb_typeof(build->'s'->'gear') = 'object' then build->'s'->'gear' else '{}'::jsonb end) g
    union all select 'summoned', null, (build->'s'->>'summoned') from f
    -- active companions: slot = 0-based position (maps to Off/Def/Univ/Univ/Util client-side)
    union all select 'activecomp', (ord-1)::text, val
              from f, jsonb_array_elements_text(coalesce(build->'s'->'activeComps','[]'::jsonb)) with ordinality as a(val, ord)
  ),
  agg as (
    select cat, slot, name, count(*)::int cnt
    from raw
    where name is not null and name <> ''
    group by cat, slot, name
  )
  select coalesce(
    jsonb_agg(jsonb_build_object('cat',cat,'slot',slot,'name',name,'cnt',cnt) order by cat, slot, cnt desc),
    '[]'::jsonb
  ) into v_counts
  from agg;

  return jsonb_build_object('total', v_total, 'insufficient', false, 'counts', v_counts);
end;
$$;

grant execute on function public.meta_counts(text, text, text) to anon, authenticated;

-- Quick check (replace values):
--   select public.meta_counts('Warlock','Hellbringer','DPS');
