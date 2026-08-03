-- ============================================================
-- NWCB — Tool run counters
-- Run this WHOLE file once in the Supabase SQL Editor.
--
-- Two numbers, nothing else: how many times the Optimizer has run, and how
-- many times the Forgemaster's Verdict has run. Per month, so you can see a
-- trend rather than one number that only ever goes up.
--
-- Stores a month, a tool name, and a count. Nothing about WHO ran it, nothing
-- about the build. Same model as the page counter in site_analytics.sql.
-- Readable only in admin.html, behind the admin password. Never shown publicly.
-- ============================================================


-- ============================================================
-- STEP 1 — the counter table
-- ============================================================
CREATE TABLE IF NOT EXISTS tool_runs (
  period text    NOT NULL,          -- 'YYYY-MM' (UTC)
  tool   text    NOT NULL,          -- 'optimizer' | 'forgemaster'
  runs   integer NOT NULL DEFAULT 0,
  PRIMARY KEY (period, tool)
);

ALTER TABLE tool_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON tool_runs FROM anon, authenticated;


-- ============================================================
-- STEP 2 — record_tool_run: called by the gated optimizer script when a run
-- finishes. Anon-callable and password-free by design: it takes no member
-- id and stores nothing personal, so there's nothing here to protect. It
-- can only increment — it cannot read anything back.
--
-- Accepted risk (same as the page counter): someone who found this endpoint
-- could inflate the numbers. These are personal decision-making figures, not
-- billing, so that's a shrug rather than a hole.
-- ============================================================
CREATE OR REPLACE FUNCTION record_tool_run(p_tool text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cur_period text := to_char((now() AT TIME ZONE 'utc'), 'YYYY-MM');
  v_tool     text;
BEGIN
  v_tool := lower(coalesce(p_tool, ''));
  IF v_tool NOT IN ('optimizer', 'forgemaster') THEN
    RETURN json_build_object('ok', false, 'reason', 'unknown_tool');
  END IF;

  INSERT INTO tool_runs (period, tool, runs)
  VALUES (cur_period, v_tool, 1)
  ON CONFLICT (period, tool) DO UPDATE
    SET runs = tool_runs.runs + 1;

  RETURN json_build_object('ok', true);
END;
$$;


-- ============================================================
-- STEP 3 — get_tool_runs: admin-only read, for admin.html.
-- ============================================================
CREATE OR REPLACE FUNCTION get_tool_runs(
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
  v_months integer := LEAST(GREATEST(COALESCE(p_months, 12), 1), 60);
  v_from   text    := to_char((now() AT TIME ZONE 'utc') - ((v_months - 1) || ' months')::interval, 'YYYY-MM');
  v_rows   json;
  v_opt    bigint;
  v_forge  bigint;
BEGIN
  SELECT value INTO stored_pass FROM admin_config WHERE key = 'admin_password';
  IF stored_pass IS NULL OR p_admin_pass IS DISTINCT FROM stored_pass THEN
    RETURN json_build_object('ok', false, 'reason', 'unauthorized');
  END IF;

  -- One row per month, both tools side by side.
  SELECT COALESCE(json_agg(t ORDER BY t.period DESC), '[]'::json) INTO v_rows
  FROM (
    SELECT period,
           COALESCE(SUM(runs) FILTER (WHERE tool = 'optimizer'), 0)::bigint   AS optimizer,
           COALESCE(SUM(runs) FILTER (WHERE tool = 'forgemaster'), 0)::bigint AS forgemaster
      FROM tool_runs
     WHERE period >= v_from
     GROUP BY period
  ) t;

  SELECT COALESCE(SUM(runs) FILTER (WHERE tool = 'optimizer'), 0)::bigint,
         COALESCE(SUM(runs) FILTER (WHERE tool = 'forgemaster'), 0)::bigint
    INTO v_opt, v_forge
    FROM tool_runs WHERE period >= v_from;

  RETURN json_build_object(
    'ok', true,
    'totals', json_build_object('optimizer', v_opt, 'forgemaster', v_forge),
    'months', v_rows
  );
END;
$$;


-- ============================================================
-- STEP 4 — grants (functions run as owner; the table stays sealed).
-- ============================================================
GRANT EXECUTE ON FUNCTION record_tool_run(text) TO anon;
GRANT EXECUTE ON FUNCTION get_tool_runs(integer, text) TO anon;


-- ============================================================
-- QUICK TEST (optional)
--   SELECT record_tool_run('optimizer');
--   SELECT get_tool_runs(12, '<your admin password>');
--   DELETE FROM tool_runs;   -- clean up the test
-- ============================================================


-- ============================================================
-- ROLLBACK (uncomment to undo everything)
-- ============================================================
-- DROP FUNCTION IF EXISTS record_tool_run(text);
-- DROP FUNCTION IF EXISTS get_tool_runs(integer, text);
-- DROP TABLE IF EXISTS tool_runs;
