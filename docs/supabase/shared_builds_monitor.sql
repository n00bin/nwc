-- ============================================================================
-- Shared Builds — Live Monitor read path (owner-only)
-- Companion to: shared_builds.sql (Phase 1 capture). Roadmap: #142.
--
-- Run ONCE in Supabase (Dashboard -> SQL -> New query -> Run), or deploy via
-- the Management API. Idempotent / safe to re-run.
--
-- WHY THIS EXISTS: public.shared_builds has RLS ON with NO read policy, so the
-- public (anon) key cannot read it at all. These two SECURITY DEFINER functions
-- are the ONLY read path, and BOTH require the admin password (the same secret
-- the reports admin tools use, stored in admin_config). They power
-- builds-monitor.html.
-- ============================================================================

-- 1) Live feed: summary rows (no heavy build blob), newest first, + total ----
create or replace function public.list_shared_builds(
  p_admin_pass text,
  p_limit      integer default 200,
  p_since      timestamptz default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  builds jsonb;
  total  integer;
begin
  if not exists (
    select 1 from public.admin_config
    where key = 'admin_password' and value = p_admin_pass
  ) then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select count(*) into total from public.shared_builds;

  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
  into builds
  from (
    select id, class, paragon, role, total_il,
           optimizer_used, app_version, created_at
    from public.shared_builds
    where p_since is null or created_at > p_since
    order by created_at desc
    limit greatest(1, least(coalesce(p_limit, 200), 500))
  ) t;

  return jsonb_build_object('ok', true, 'count', total, 'builds', builds);
end;
$$;

-- 2) Detail: the full build blob for one row (fetched on expand) -------------
create or replace function public.get_shared_build(
  p_admin_pass text,
  p_id         uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  m record;
begin
  if not exists (
    select 1 from public.admin_config
    where key = 'admin_password' and value = p_admin_pass
  ) then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select * into m from public.shared_builds where id = p_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not found');
  end if;

  return jsonb_build_object(
    'ok', true,
    'id', m.id,
    'class', m.class,
    'paragon', m.paragon,
    'role', m.role,
    'total_il', m.total_il,
    'optimizer_used', m.optimizer_used,
    'created_at', m.created_at,
    'build', m.build
  );
end;
$$;

-- 3) Only these two read RPCs are callable by the public key -----------------
grant execute on function public.list_shared_builds(text, integer, timestamptz) to anon, authenticated;
grant execute on function public.get_shared_build(text, uuid) to anon, authenticated;

-- ============================================================================
-- Quick check (optional, run in SQL editor where you can paste the password):
--   select public.list_shared_builds('<admin_password>', 50, null);
-- ============================================================================
