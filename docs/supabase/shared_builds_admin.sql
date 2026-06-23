-- ============================================================================
-- Community-learning optimizer — admin read path (count / stats)
-- Roadmap: docs/community_feedback.md  (Report #142)
--
-- Run this ONCE in the Supabase SQL editor (after shared_builds.sql).
-- It adds `admin_shared_build_stats(admin_pass)` — a password-gated read path
-- so the maintainer (or Claude) can answer "how many builds have been shared?"
-- without the service_role key.
--
-- The public `shared_builds` table is locked by RLS with no read policy, so the
-- anon/publishable key can submit builds but cannot count them. This RPC is
-- SECURITY DEFINER and checks the same admin password used by the reports admin
-- RPCs (admin_config.key = 'admin_password'), so a wrong/missing password
-- returns only {ok:false, reason:'unauthorized'} and never any build data.
--
-- Privacy note: builds carry NO PII (the user-entered name is stripped in the
-- browser before submit), so the admin summary is metadata only — class,
-- paragon, role, total IL, optimizer flag, timestamps. Raw build JSON is NOT
-- returned by this function.
--
-- Safe to re-run: create-or-replace + idempotent grant.
-- ============================================================================

create or replace function public.admin_shared_build_stats(
  admin_pass text
) returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  stored_pass    text;
  v_total        int;
  v_with_opt     int;
  v_test_rows    int;
  v_first        timestamptz;
  v_last         timestamptz;
  v_by_segment   jsonb;
  v_recent       jsonb;
begin
  -- Same password check as the reports admin RPCs.
  select value into stored_pass
  from public.admin_config
  where key = 'admin_password';

  if stored_pass is null or admin_pass is distinct from stored_pass then
    return jsonb_build_object('ok', false, 'reason', 'unauthorized');
  end if;

  -- Headline numbers.
  select count(*),
         count(*) filter (where optimizer_used),
         count(*) filter (where build_hash is null),  -- leftover old test rows
         min(created_at),
         max(created_at)
    into v_total, v_with_opt, v_test_rows, v_first, v_last
  from public.shared_builds;

  -- Breakdown by class / paragon / role, most-shared first.
  select coalesce(jsonb_agg(
           jsonb_build_object('class', class, 'paragon', paragon,
                              'role', role, 'cnt', cnt)
           order by cnt desc, class, paragon, role), '[]'::jsonb)
    into v_by_segment
  from (
    select class, paragon, role, count(*)::int cnt
    from public.shared_builds
    group by class, paragon, role
  ) s;

  -- Latest 20 shares (metadata only — no raw build JSON).
  select coalesce(jsonb_agg(
           jsonb_build_object('class', class, 'paragon', paragon, 'role', role,
                              'total_il', total_il, 'optimizer_used', optimizer_used,
                              'app_version', app_version, 'created_at', created_at)
           order by created_at desc), '[]'::jsonb)
    into v_recent
  from (
    select class, paragon, role, total_il, optimizer_used, app_version, created_at
    from public.shared_builds
    order by created_at desc
    limit 20
  ) r;

  return jsonb_build_object(
    'ok',             true,
    'total',          v_total,
    'with_optimizer', v_with_opt,
    'old_test_rows',  v_test_rows,
    'first_share',    v_first,
    'last_share',     v_last,
    'by_segment',     v_by_segment,
    'recent',         v_recent
  );
end;
$$;

grant execute on function public.admin_shared_build_stats(text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Maintenance: clear leftover TEST rows (build_hash is null).
-- Rows created by the very first version of shared_builds.sql have a null
-- build_hash (the dedupe column didn't exist yet) — these are test shares, not
-- real community submissions. Genuine shares from the live button always carry
-- a hash, so this never touches real data. Password-gated, returns the count
-- removed. Safe to re-run (deletes nothing once they're gone).
-- ----------------------------------------------------------------------------
create or replace function public.admin_clear_test_builds(
  admin_pass text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  stored_pass text;
  v_deleted   int;
begin
  select value into stored_pass
  from public.admin_config
  where key = 'admin_password';

  if stored_pass is null or admin_pass is distinct from stored_pass then
    return jsonb_build_object('ok', false, 'reason', 'unauthorized');
  end if;

  delete from public.shared_builds where build_hash is null;
  get diagnostics v_deleted = row_count;

  return jsonb_build_object('ok', true, 'deleted', v_deleted);
end;
$$;

grant execute on function public.admin_clear_test_builds(text) to anon, authenticated;

-- ============================================================================
-- Quick check (replace PASSWORD with the admin password):
--   select public.admin_shared_build_stats('PASSWORD');
--   select public.admin_clear_test_builds('PASSWORD');   -- removes test rows
--
-- From the publishable/anon key (PostgREST RPC):
--   curl -s "https://ynrfmmccarrpqjdrpvqn.supabase.co/rest/v1/rpc/admin_shared_build_stats" \
--     -H "apikey: <publishable_key>" -H "Authorization: Bearer <publishable_key>" \
--     -H "Content-Type: application/json" \
--     -d '{"admin_pass":"PASSWORD"}'
-- ============================================================================
