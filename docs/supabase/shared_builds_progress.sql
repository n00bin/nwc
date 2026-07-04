-- ============================================================================
-- Shared Builds — PUBLIC collection-progress read path (counts only)
-- Companion to: shared_builds.sql (capture), shared_builds_meta.sql (meta
-- counts w/ privacy floor), shared_builds_monitor.sql (owner-only feed).
-- Roadmap: #142. Powers the public page community-meta.html.
--
-- Run ONCE in Supabase (Dashboard -> SQL -> New query -> Run), or deploy via
-- the Management API. Idempotent / safe to re-run.
--
-- WHY THIS IS SAFE TO EXPOSE WITHOUT A PASSWORD:
--   * Returns AGGREGATE COUNTS ONLY — how many builds exist per
--     class + paragon + role segment, plus the overall total. It can never
--     return a build's contents (gear, powers, IL, timestamps per build).
--   * No parameters — nothing to probe or enumerate with.
--   * Counting build types is exactly what the owner monitor's stream-safe
--     "Present" view already shows on video; this is that view's data source
--     made self-serve.
--   * Test rows (build_hash IS NULL) are excluded so the public number only
--     counts real community shares.
-- ============================================================================

create or replace function public.meta_progress()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'ok', true,
    'total',  (select count(*) from public.shared_builds where build_hash is not null),
    'latest', (select max(created_at) from public.shared_builds where build_hash is not null),
    'segments', coalesce((
      select jsonb_agg(
               jsonb_build_object('class', t.class, 'paragon', t.paragon,
                                  'role', t.role, 'n', t.n)
               order by t.n desc, t.class, t.paragon
             )
      from (
        select class, paragon, lower(coalesce(role, '')) as role,
               count(*)::int as n
        from public.shared_builds
        where build_hash is not null
        group by class, paragon, lower(coalesce(role, ''))
      ) t
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.meta_progress() to anon, authenticated;

-- ============================================================================
-- Quick check (optional):
--   select public.meta_progress();
-- ============================================================================
