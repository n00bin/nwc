-- ============================================================
-- NWCB AMI Reconciliation Migration
-- Run each step in order in the Supabase SQL Editor.
--
-- IMPORTANT: Run these steps IN ORDER — top to bottom.
-- Step A2 (add updated_at column) MUST be run BEFORE Step A4c
-- (replace update_report_status). If you run A4c first, the UPDATE
-- inside that function will throw a "column not found" error because
-- the updated_at column won't exist yet.
-- ============================================================


-- ============================================================
-- STEP A0 — Pre-flight: inspect existing columns
-- Run this first to see what columns reports already has.
-- ============================================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'reports'
ORDER BY ordinal_position;

-- Safe to run even if admin_notes already exists:
ALTER TABLE reports ADD COLUMN IF NOT EXISTS admin_notes text;


-- ============================================================
-- STEP A1 — Add resolved_gear_id column
-- Stores the canonical gear.json id once admin merges the item.
-- This is NOT a Postgres foreign key — it references the id field
-- in the data/gear.json file, not another database table.
-- ============================================================
ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolved_gear_id bigint;

COMMENT ON COLUMN reports.resolved_gear_id IS
  'Set by admin after merging. References the id field in data/gear.json — not a Postgres FK.';


-- ============================================================
-- STEP A2 — Add updated_at column
-- *** MUST RUN BEFORE STEP A4c ***
-- All existing reports will receive the current timestamp as
-- their updated_at. That is expected — created_at remains the
-- source of truth for when a report was originally submitted.
-- ============================================================
ALTER TABLE reports ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- NOTE: When this migration runs, all existing reports receive the migration
-- timestamp as their updated_at. They will not have their original creation time.
-- created_at remains the source of truth for original creation.


-- ============================================================
-- STEP A3 — Rebuild reports_public view with explicit columns
-- Drops the old view and recreates it to include the new columns.
-- The explicit column list means future ALTER TABLE additions
-- won't automatically appear in the view (intentional — prevents
-- accidentally exposing new sensitive columns).
-- ============================================================
DROP VIEW IF EXISTS reports_public;

CREATE VIEW reports_public AS
SELECT
  id,
  created_at,
  title,
  description,
  category,
  status,
  upvotes,
  image_url,
  admin_notes,
  resolved_gear_id,
  updated_at
FROM reports;


-- ============================================================
-- STEP A4 — Create mark_ami_resolved RPC
-- Admin-only function. Sets resolved_gear_id, marks status Fixed,
-- and stamps updated_at. Used by the reconcile_ami.py script.
-- SECURITY DEFINER runs as the function owner (postgres), bypassing
-- RLS so it can UPDATE the reports table from a server-side call.
-- ============================================================
CREATE OR REPLACE FUNCTION mark_ami_resolved(
  p_report_id  bigint,
  p_gear_id    bigint,
  p_admin_pass text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_pass text;
BEGIN
  SELECT value INTO stored_pass FROM admin_config WHERE key = 'admin_password';

  IF stored_pass IS NULL OR p_admin_pass != stored_pass THEN
    RETURN json_build_object('ok', false, 'error', 'unauthorized');
  END IF;

  UPDATE reports
  SET resolved_gear_id = p_gear_id,
      status           = 'Fixed',
      updated_at       = now()
  WHERE id = p_report_id;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'error', 'not_found');
  END IF;

  RETURN json_build_object('ok', true);
END;
$$;


-- ============================================================
-- STEP A4b — INSERT RLS policy audit
-- Run this query to see the current RLS policies on the reports table.
-- Look for the INSERT policy and confirm its WITH CHECK constraint.
-- The submit_missing_item_report function (Step A5) hard-codes
-- status='New', upvotes=0, voter_hashes='{}' to satisfy that constraint
-- — the audit just needs to confirm no ADDITIONAL protections exist
-- beyond those three fields.
-- ============================================================
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'reports';

-- Expected INSERT policy WITH CHECK (from original supabase-setup.sql lines 36-41):
--   status = 'New' AND upvotes = 0 AND voter_hashes = '{}'
--
-- If the output shows a different or additional INSERT policy, update
-- submit_missing_item_report (Step A5) before running it.
--
-- Template to add a new policy if needed (fill in the blanks):
-- CREATE POLICY "policy_name_here"
--   ON reports FOR INSERT
--   WITH CHECK ( /* your constraints here */ );


-- ============================================================
-- STEP A4c — Replace update_report_status RPC
-- *** REQUIRES STEP A2 TO HAVE BEEN RUN FIRST ***
-- Adds updated_at = now() to the existing UPDATE. Signature is
-- identical to the old function — nothing else in the codebase needs
-- to change to use this replacement.
-- ============================================================
CREATE OR REPLACE FUNCTION update_report_status(
  report_id  bigint,
  new_status text,
  admin_pass text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_pass text;
BEGIN
  SELECT value INTO stored_pass FROM admin_config WHERE key = 'admin_password';

  IF stored_pass IS NULL OR admin_pass != stored_pass THEN
    RETURN json_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  IF new_status NOT IN ('New', 'Confirmed', 'In Progress', 'Fixed', 'Won''t Fix') THEN
    RETURN json_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  UPDATE reports SET status = new_status, updated_at = now() WHERE id = report_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'reason', 'not_found');
  END IF;

  RETURN json_build_object('success', true);
END;
$$;


-- ============================================================
-- STEP A5 — Create submit_missing_item_report RPC
-- Public-facing function for Toon Forge's "Add Missing Item" form.
-- SECURITY DEFINER is required — without it, the existing RLS INSERT
-- policy on reports would block the INSERT (anon role can't bypass it).
--
-- The WITH CHECK constraint from the original INSERT policy is:
--   status = 'New' AND upvotes = 0 AND voter_hashes = '{}'
-- These values are hard-coded in the INSERT below (not accepted as
-- parameters) so this function always satisfies that constraint.
-- status, upvotes, and voter_hashes are NOT accepted as RPC parameters.
-- ============================================================
CREATE OR REPLACE FUNCTION submit_missing_item_report(
  p_title       text,
  p_description text,
  p_category    text,
  p_image_url   text DEFAULT ''
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id bigint;
BEGIN
  -- Validate category
  IF p_category NOT IN ('Bug', 'Missing Item', 'Suggestion') THEN
    RETURN json_build_object('ok', false, 'error', 'invalid_category');
  END IF;

  -- Validate title length (mirrors table CHECK constraint)
  IF char_length(p_title) < 3 OR char_length(p_title) > 200 THEN
    RETURN json_build_object('ok', false, 'error', 'invalid_title_length');
  END IF;

  -- Validate description length (mirrors table CHECK constraint)
  IF char_length(p_description) < 10 OR char_length(p_description) > 2000 THEN
    RETURN json_build_object('ok', false, 'error', 'invalid_description_length');
  END IF;

  -- Insert with hard-coded safe defaults (satisfies the INSERT RLS WITH CHECK):
  --   status = 'New', upvotes = 0, voter_hashes = '{}'
  INSERT INTO reports (title, description, category, status, upvotes, voter_hashes, image_url)
  VALUES (
    p_title,
    p_description,
    p_category,
    'New',
    0,
    '{}',
    COALESCE(NULLIF(p_image_url, ''), '')
  )
  RETURNING id INTO new_id;

  RETURN json_build_object('ok', true, 'report_id', new_id);

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('ok', false, 'error', SQLERRM);
END;
$$;


-- ============================================================
-- ROLLBACK SQL (commented out — uncomment only if you need to revert)
-- Run these in reverse order (A5 first, A0 last) if you need to undo.
-- ============================================================

-- -- Revert A5
-- DROP FUNCTION IF EXISTS submit_missing_item_report(text, text, text, text);

-- -- Revert A4c (restore original update_report_status without updated_at)
-- CREATE OR REPLACE FUNCTION update_report_status(
--   report_id  bigint,
--   new_status text,
--   admin_pass text
-- )
-- RETURNS json
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- DECLARE
--   stored_pass text;
-- BEGIN
--   SELECT value INTO stored_pass FROM admin_config WHERE key = 'admin_password';
--   IF stored_pass IS NULL OR admin_pass != stored_pass THEN
--     RETURN json_build_object('success', false, 'reason', 'unauthorized');
--   END IF;
--   IF new_status NOT IN ('New', 'Confirmed', 'In Progress', 'Fixed', 'Won''t Fix') THEN
--     RETURN json_build_object('success', false, 'reason', 'invalid_status');
--   END IF;
--   UPDATE reports SET status = new_status WHERE id = report_id;
--   IF NOT FOUND THEN
--     RETURN json_build_object('success', false, 'reason', 'not_found');
--   END IF;
--   RETURN json_build_object('success', true);
-- END;
-- $$;

-- -- Revert A4 (mark_ami_resolved)
-- DROP FUNCTION IF EXISTS mark_ami_resolved(bigint, bigint, text);

-- -- Revert A3 (rebuild reports_public without new columns)
-- DROP VIEW IF EXISTS reports_public;
-- CREATE VIEW reports_public AS
--   SELECT id, created_at, title, description, category, status, upvotes, image_url, admin_notes
--   FROM reports;

-- -- Revert A2
-- ALTER TABLE reports DROP COLUMN IF EXISTS updated_at;

-- -- Revert A1
-- ALTER TABLE reports DROP COLUMN IF EXISTS resolved_gear_id;

-- -- Revert A0 (admin_notes — only drop if it wasn't there before)
-- -- ALTER TABLE reports DROP COLUMN IF EXISTS admin_notes;
