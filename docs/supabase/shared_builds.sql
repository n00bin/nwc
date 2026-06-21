-- ============================================================================
-- Community-learning optimizer — Phase 1: anonymized build capture
-- Roadmap: docs/community_feedback.md  (Report #142)
--
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL → New query → Run).
-- It creates the `shared_builds` table and the `submit_shared_build` RPC that
-- the Toon Forge "🌐 Share to community" button calls.
--
-- Privacy: there is NO account and NO PII. The build's user-entered name is
-- stripped in the browser before submit. `client_token` is a random, anonymous
-- per-browser string used only to group repeat shares — it identifies no one.
-- ============================================================================

-- 1) Table -------------------------------------------------------------------
create table if not exists public.shared_builds (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  class          text,
  paragon        text,
  role           text,
  total_il       integer,
  optimizer_used boolean not null default false,
  app_version    integer,
  client_token   text,            -- anonymous, random; NOT identifying
  build          jsonb not null   -- full serialized build, name stripped client-side
);

create index if not exists shared_builds_class_role_idx on public.shared_builds (class, role);
create index if not exists shared_builds_created_idx     on public.shared_builds (created_at desc);

-- 2) Lock the table down -----------------------------------------------------
-- RLS on + no policies = the anon/public key cannot read or write the table
-- directly. Every write goes through the SECURITY DEFINER RPC below. (Phase 2,
-- the community-meta read view, will add a separate read path — not here.)
alter table public.shared_builds enable row level security;

-- 3) Insert RPC --------------------------------------------------------------
create or replace function public.submit_shared_build(
  p_class          text,
  p_paragon        text,
  p_role           text,
  p_total_il       integer,
  p_optimizer_used boolean,
  p_build          jsonb,
  p_client_token   text,
  p_app_version    integer
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  -- Guard rails: require a real build object and cap its size.
  if p_build is null or jsonb_typeof(p_build) <> 'object' then
    return jsonb_build_object('ok', false, 'error', 'invalid build');
  end if;
  if length(p_build::text) > 200000 then
    return jsonb_build_object('ok', false, 'error', 'build too large');
  end if;

  insert into public.shared_builds
    (class, paragon, role, total_il, optimizer_used, app_version, client_token, build)
  values
    (left(coalesce(p_class,   ''), 40),
     left(coalesce(p_paragon, ''), 60),
     left(coalesce(p_role,    ''), 20),
     greatest(0, least(coalesce(p_total_il, 0), 100000000)),
     coalesce(p_optimizer_used, false),
     coalesce(p_app_version, 1),
     left(coalesce(p_client_token, ''), 80),
     p_build)
  returning id into new_id;

  return jsonb_build_object('ok', true, 'id', new_id);
end;
$$;

-- 4) Let the public (anon) and logged-in roles call ONLY the RPC -------------
grant execute on function public.submit_shared_build(
  text, text, text, integer, boolean, jsonb, text, integer
) to anon, authenticated;

-- ============================================================================
-- Quick checks (optional):
--   select count(*) from public.shared_builds;
--   select class, role, total_il, optimizer_used, created_at
--     from public.shared_builds order by created_at desc limit 20;
-- ============================================================================
