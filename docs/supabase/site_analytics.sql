-- ============================================================
-- NWCB — Private Site Analytics
-- Run this WHOLE file once in the Supabase SQL Editor.
--
-- Counts page views privately, for n00b's own decisions only. There is NO
-- public counter anywhere on the site — the numbers are readable only
-- through get_site_stats(), which is guarded by the admin password in the
-- admin_config table (same pattern as update_report_status).
--
-- What is stored: a page name, a date, and a referring hostname.
-- What is NOT stored: no IP addresses, no user agents, no per-visit rows,
-- no cookies, nothing that identifies a person. The tables below are pure
-- counters — three integers and a date.
-- ============================================================


-- ============================================================
-- STEP 1 — the three counter tables
-- ============================================================

-- Views and unique browsers, per page, per UTC day.
CREATE TABLE IF NOT EXISTS site_page_stats (
  page     text    NOT NULL,
  day      date    NOT NULL,
  views    integer NOT NULL DEFAULT 0,
  visitors integer NOT NULL DEFAULT 0,   -- unique browsers that opened THIS page today
  PRIMARY KEY (page, day)
);

-- Unique browsers across the whole site, per UTC day. Kept separately
-- because site_page_stats.visitors CANNOT be summed across pages without
-- double-counting anyone who read two pages.
CREATE TABLE IF NOT EXISTS site_daily (
  day      date    NOT NULL PRIMARY KEY,
  visitors integer NOT NULL DEFAULT 0
);

-- Where people arrived from, per UTC day. Hostname only — never a full URL,
-- so query strings and paths (which can carry personal data) never land here.
CREATE TABLE IF NOT EXISTS site_referrers (
  host  text    NOT NULL,
  day   date    NOT NULL,
  views integer NOT NULL DEFAULT 0,
  PRIMARY KEY (host, day)
);

-- Lock all three down. Only the SECURITY DEFINER functions below (which run
-- as the table owner) may touch them; anon gets no direct read or write.
ALTER TABLE site_page_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_daily      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_referrers  ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON site_page_stats FROM anon, authenticated;
REVOKE ALL ON site_daily      FROM anon, authenticated;
REVOKE ALL ON site_referrers  FROM anon, authenticated;


-- ============================================================
-- STEP 2 — record_pageview: the only thing the website calls.
--
-- Anon-callable by necessity (every visitor's browser calls it). It can
-- ONLY increment counters — it cannot read anything back, so it leaks
-- nothing. Worst case someone spams it and inflates the numbers; these are
-- personal decision-making figures, not billing, so that is an accepted
-- risk rather than a hole.
--
-- p_first_for_page — browser's first view of THIS page today
-- p_first_today    — browser's first view of ANY page today
-- p_referrer       — referring hostname, or '' for direct / same-site
-- ============================================================
CREATE OR REPLACE FUNCTION record_pageview(
  p_page           text,
  p_first_for_page boolean DEFAULT false,
  p_first_today    boolean DEFAULT false,
  p_referrer       text    DEFAULT ''
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cur_day date := (now() AT TIME ZONE 'utc')::date;
  v_page  text;
  v_host  text;
  -- Known pages. Anything else is bucketed as 'other' so a spammer can't
  -- grow this table without bound. ADD NEW PAGES HERE when the site gains one.
  known_pages text[] := ARRAY[
    'index.html', 'companions.html', 'mounts.html', 'artifacts.html',
    'consumables.html', 'mekaniks.html', 'professions.html',
    'campaign-boosters.html', 'patchnotes.html', 'reports.html',
    'toon-forge.html', 'creators-tools.html', 'insignia-priority.html',
    'preview.html'
  ];
BEGIN
  v_page := lower(coalesce(p_page, ''));
  IF NOT (v_page = ANY(known_pages)) THEN
    v_page := 'other';
  END IF;

  -- Referrer: hostname-shaped strings only, everything else bucketed.
  v_host := lower(coalesce(p_referrer, ''));
  IF v_host = '' THEN
    v_host := 'direct';
  ELSIF v_host !~ '^[a-z0-9][a-z0-9.-]{0,62}$' THEN
    v_host := 'other';
  END IF;

  INSERT INTO site_page_stats (page, day, views, visitors)
  VALUES (v_page, cur_day, 1, CASE WHEN p_first_for_page THEN 1 ELSE 0 END)
  ON CONFLICT (page, day) DO UPDATE
    SET views    = site_page_stats.views + 1,
        visitors = site_page_stats.visitors + CASE WHEN p_first_for_page THEN 1 ELSE 0 END;

  IF p_first_today THEN
    INSERT INTO site_daily (day, visitors)
    VALUES (cur_day, 1)
    ON CONFLICT (day) DO UPDATE
      SET visitors = site_daily.visitors + 1;
  END IF;

  INSERT INTO site_referrers (host, day, views)
  VALUES (v_host, cur_day, 1)
  ON CONFLICT (host, day) DO UPDATE
    SET views = site_referrers.views + 1;

  RETURN json_build_object('ok', true);
END;
$$;


-- ============================================================
-- STEP 3 — get_site_stats: the admin dashboard's only read path.
-- Guarded by the admin password, exactly like update_report_status.
--
-- Returns:
--   totals.views          — all page views in the window
--   totals.visitors       — SUM OF DAILY uniques (a person visiting on 3
--                           separate days counts 3 times). Not unique-over-window.
--   pages[]               — {page, views, visitors} sorted by views
--   daily[]               — {day, views, visitors} oldest first
--   referrers[]           — {host, views} top 25
-- ============================================================
CREATE OR REPLACE FUNCTION get_site_stats(
  p_days       integer,
  p_admin_pass text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_pass text;
  v_days   integer := LEAST(GREATEST(COALESCE(p_days, 30), 1), 365);
  v_from   date    := (now() AT TIME ZONE 'utc')::date - (v_days - 1);
  v_pages  json;
  v_daily  json;
  v_refs   json;
  v_views  bigint;
  v_uniqs  bigint;
BEGIN
  SELECT value INTO stored_pass FROM admin_config WHERE key = 'admin_password';
  IF stored_pass IS NULL OR p_admin_pass IS DISTINCT FROM stored_pass THEN
    RETURN json_build_object('ok', false, 'reason', 'unauthorized');
  END IF;

  SELECT COALESCE(json_agg(t ORDER BY t.views DESC), '[]'::json) INTO v_pages
  FROM (
    SELECT page,
           SUM(views)::bigint    AS views,
           SUM(visitors)::bigint AS visitors
      FROM site_page_stats
     WHERE day >= v_from
     GROUP BY page
  ) t;

  SELECT COALESCE(json_agg(t ORDER BY t.day), '[]'::json) INTO v_daily
  FROM (
    -- generate_series over dates yields timestamps, which would serialise as
    -- "2026-08-03T00:00:00" in the JSON. Cast back to date so the dashboard
    -- gets plain "2026-08-03".
    SELECT d.day::date AS day,
           COALESCE(p.views, 0)::bigint    AS views,
           COALESCE(sd.visitors, 0)::bigint AS visitors
      FROM generate_series(v_from::timestamp,
                           ((now() AT TIME ZONE 'utc')::date)::timestamp,
                           '1 day'::interval) AS d(day)
      LEFT JOIN (
        SELECT day, SUM(views) AS views FROM site_page_stats
         WHERE day >= v_from GROUP BY day
      ) p  ON p.day  = d.day
      LEFT JOIN site_daily sd ON sd.day = d.day
  ) t;

  SELECT COALESCE(json_agg(t ORDER BY t.views DESC), '[]'::json) INTO v_refs
  FROM (
    SELECT host, SUM(views)::bigint AS views
      FROM site_referrers
     WHERE day >= v_from
     GROUP BY host
     ORDER BY 2 DESC
     LIMIT 25
  ) t;

  SELECT COALESCE(SUM(views), 0)::bigint INTO v_views
    FROM site_page_stats WHERE day >= v_from;
  SELECT COALESCE(SUM(visitors), 0)::bigint INTO v_uniqs
    FROM site_daily WHERE day >= v_from;

  RETURN json_build_object(
    'ok', true,
    'days', v_days,
    'totals', json_build_object('views', v_views, 'visitors', v_uniqs),
    'pages', v_pages,
    'daily', v_daily,
    'referrers', v_refs
  );
END;
$$;


-- ============================================================
-- STEP 4 — grants. Both functions run as the owner internally, so the
-- tables stay sealed; get_site_stats still refuses without the password.
-- ============================================================
GRANT EXECUTE ON FUNCTION record_pageview(text, boolean, boolean, text) TO anon;
GRANT EXECUTE ON FUNCTION get_site_stats(integer, text) TO anon;


-- ============================================================
-- QUICK TEST (optional)
--   SELECT record_pageview('index.html', true, true, 'youtube.com');
--   SELECT get_site_stats(30, '<your admin password>');
--   DELETE FROM site_page_stats WHERE page = 'index.html' AND views = 1;
-- ============================================================


-- ============================================================
-- ROLLBACK (uncomment to undo everything)
-- ============================================================
-- DROP FUNCTION IF EXISTS record_pageview(text, boolean, boolean, text);
-- DROP FUNCTION IF EXISTS get_site_stats(integer, text);
-- DROP TABLE IF EXISTS site_page_stats;
-- DROP TABLE IF EXISTS site_daily;
-- DROP TABLE IF EXISTS site_referrers;
