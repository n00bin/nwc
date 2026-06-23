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
--
-- Thin-data fallback (2026-06-23): a brand-new sharer whose exact
-- class+paragon+role is still below the floor used to hit a dead end. Now the
-- function falls back one level — to the whole CLASS+role (every paragon) —
-- so the reward isn't empty during cold-start. It returns a `scope` field
-- ('exact' | 'class' | 'none') so the client can label what it's showing.
--
-- Why stop at class and NOT fall back to role-only (all classes): at-wills,
-- encounters, dailies, class features, feats and the class-specific gear slots
-- are class-bound. Mixing classes would present misleading "meta" (a Wizard's
-- encounter next to a Barbarian's), which breaks the project's no-fabricated-
-- data rule. Within ONE class those power pools are shared across paragons, so
-- the 'class' view stays honest while clearing the floor far sooner.
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
  v_scope  text;
  v_total  int;
  v_counts jsonb;
begin
  -- 1) Try the ideal, fully on-build segment: class + paragon + role.
  select count(*) into v_total
  from public.shared_builds
  where class = p_class and paragon = p_paragon and role = p_role;

  if v_total >= MIN_BUILDS then
    v_scope := 'exact';
  else
    -- 2) Fall back to the whole class + role (every paragon). Still honest:
    --    powers are shared across a class's paragons.
    select count(*) into v_total
    from public.shared_builds
    where class = p_class and role = p_role;

    if v_total >= MIN_BUILDS then
      v_scope := 'class';
    else
      -- Not enough even at class scope. Return the class+role total so the
      -- client can nudge ("only N <role> <class> builds shared so far").
      return jsonb_build_object(
        'total', v_total, 'insufficient', true, 'min', MIN_BUILDS,
        'scope', 'none', 'counts', '[]'::jsonb);
    end if;
  end if;

  with f as (
    -- 'exact' → this paragon only; 'class' → every paragon of the class.
    select build from public.shared_builds
    where role = p_role
      and class = p_class
      and (v_scope = 'class' or paragon = p_paragon)
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

  return jsonb_build_object('total', v_total, 'insufficient', false, 'scope', v_scope, 'counts', v_counts);
end;
$$;

grant execute on function public.meta_counts(text, text, text) to anon, authenticated;

-- Quick check (replace values):
--   select public.meta_counts('Warlock','Hellbringer','DPS');
--   -- thin paragon, but the class has 5+ across paragons → scope:'class'
