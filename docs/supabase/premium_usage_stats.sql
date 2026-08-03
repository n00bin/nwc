-- ============================================================
-- NWCB Premium — usage READ path + Verdict/Optimize split
-- Run this WHOLE file once in the Supabase SQL Editor.
--
-- Context: premium_usage (see premium/supabase-premium-usage-setup.sql)
-- already counts AI calls per member per month, but ONLY as a quota — there
-- was no way to read it back, and no way to tell a Forgemaster's Verdict
-- apart from the post-optimize explanation. This adds both.
--
-- DELIBERATELY does NOT touch record_premium_run or the premium_usage
-- table. That function is on the live quota path — replacing its signature
-- would briefly leave the deployed backend calling an argument list that no
-- longer exists, and it fails CLOSED, which would lock members out of a tool
-- they pay for. The mode split rides in a separate, best-effort call instead.
-- ============================================================


-- ============================================================
-- STEP 1 — mode counters, per UTC month.
--   'inspect'  = Forgemaster's Verdict (audit my current build)
--   'optimize' = the AI explanation of an optimizer result
--   'unknown'  = older client that didn't send a mode
-- ============================================================
CREATE TABLE IF NOT EXISTS premium_mode_stats (
  period text    NOT NULL,          -- 'YYYY-MM' (UTC)
  mode   text    NOT NULL,
  runs   integer NOT NULL DEFAULT 0,
  PRIMARY KEY (period, mode)
);

ALTER TABLE premium_mode_stats ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON premium_mode_stats FROM anon, authenticated;


-- ============================================================
-- STEP 2 — record_premium_mode: called by the premium backend right after a
-- run is successfully reserved. Best-effort by design — the caller swallows
-- failures, so a problem here can never block a paying member's run.
-- ============================================================
CREATE OR REPLACE FUNCTION record_premium_mode(
  p_mode       text,
  p_admin_pass text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_pass text;
  cur_period  text := to_char((now() AT TIME ZONE 'utc'), 'YYYY-MM');
  v_mode      text;
BEGIN
  SELECT value INTO stored_pass FROM admin_config WHERE key = 'admin_password';
  IF stored_pass IS NULL OR p_admin_pass IS DISTINCT FROM stored_pass THEN
    RETURN json_build_object('ok', false, 'reason', 'unauthorized');
  END IF;

  v_mode := lower(coalesce(p_mode, ''));
  IF v_mode NOT IN ('inspect', 'optimize') THEN
    v_mode := 'unknown';
  END IF;

  INSERT INTO premium_mode_stats (period, mode, runs)
  VALUES (cur_period, v_mode, 1)
  ON CONFLICT (period, mode) DO UPDATE
    SET runs = premium_mode_stats.runs + 1;

  RETURN json_build_object('ok', true);
END;
$$;


-- ============================================================
-- STEP 3 — get_premium_stats: admin-only read, for admin.html.
--
-- IMPORTANT about what these numbers mean: premium_usage counts AI CALLS,
-- not optimizer runs. The gear search itself runs client-side and never
-- touches the server, and the AI review after it is an opt-in button. So
-- 'optimize' here means "ran the optimizer AND asked the AI to explain it",
-- which is a FLOOR on optimizer runs, not the count.
-- ============================================================
CREATE OR REPLACE FUNCTION get_premium_stats(
  p_months     integer,
  p_admin_pass text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_pass text;
  v_months integer := LEAST(GREATEST(COALESCE(p_months, 6), 1), 60);
  v_from   text    := to_char((now() AT TIME ZONE 'utc') - ((v_months - 1) || ' months')::interval, 'YYYY-MM');
  v_periods json;
  v_modes   json;
  v_runs    bigint;
  v_members bigint;
BEGIN
  SELECT value INTO stored_pass FROM admin_config WHERE key = 'admin_password';
  IF stored_pass IS NULL OR p_admin_pass IS DISTINCT FROM stored_pass THEN
    RETURN json_build_object('ok', false, 'reason', 'unauthorized');
  END IF;

  -- Per month: total AI calls, and how many distinct members made them.
  SELECT COALESCE(json_agg(t ORDER BY t.period DESC), '[]'::json) INTO v_periods
  FROM (
    SELECT period,
           SUM(runs)::bigint               AS runs,
           COUNT(DISTINCT member_id)::bigint AS members
      FROM premium_usage
     WHERE period >= v_from
     GROUP BY period
  ) t;

  -- Per month, split by what was asked for.
  SELECT COALESCE(json_agg(t ORDER BY t.period DESC, t.mode), '[]'::json) INTO v_modes
  FROM (
    SELECT period, mode, runs::bigint AS runs
      FROM premium_mode_stats
     WHERE period >= v_from
  ) t;

  SELECT COALESCE(SUM(runs), 0)::bigint, COALESCE(COUNT(DISTINCT member_id), 0)::bigint
    INTO v_runs, v_members
    FROM premium_usage WHERE period >= v_from;

  RETURN json_build_object(
    'ok', true,
    'months', v_months,
    'totals', json_build_object('runs', v_runs, 'members', v_members),
    'periods', v_periods,
    'modes', v_modes
  );
END;
$$;


-- ============================================================
-- STEP 4 — grants (functions run as owner; tables stay sealed).
-- ============================================================
GRANT EXECUTE ON FUNCTION record_premium_mode(text, text) TO anon;
GRANT EXECUTE ON FUNCTION get_premium_stats(integer, text) TO anon;


-- ============================================================
-- QUICK TEST (optional)
--   SELECT get_premium_stats(6, '<your admin password>');
-- ============================================================


-- ============================================================
-- ROLLBACK (uncomment to undo everything). Safe: nothing here is on the
-- quota path, so dropping it cannot lock anyone out.
-- ============================================================
-- DROP FUNCTION IF EXISTS record_premium_mode(text, text);
-- DROP FUNCTION IF EXISTS get_premium_stats(integer, text);
-- DROP TABLE IF EXISTS premium_mode_stats;
