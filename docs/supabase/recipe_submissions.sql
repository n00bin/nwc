-- ============================================================
-- NWCB — Crafting Codex: community recipe submissions
-- Run this WHOLE file once in the Supabase SQL Editor.
--
-- The Crafting Codex (recipes.html) is a material-tree calculator: pick an
-- item, see every material it needs all the way down to raw gathered mats.
-- It can only do that if it HAS the recipes, and Neverwinter has hundreds of
-- them. This file is the plumbing that lets the community type them in.
--
-- Flow:
--   1. Anyone fills the "Add a Recipe" form  -> submit_recipe()  -> pending
--   2. n00b reviews on the Review tab        -> review_recipe_submission()
--   3. Approved rows are served live by      -> get_approved_recipes()
--      and exported to data/recipes.js when convenient (JSON stays the
--      long-term source of truth; the table is the intake queue).
--
-- Nothing a contributor types goes live until it is approved. Approving is
-- the ONLY thing that makes a recipe visible to other people.
-- ============================================================


-- ============================================================
-- STEP 1 — the queue table
-- ============================================================
CREATE TABLE IF NOT EXISTS recipe_submissions (
  id           bigserial   PRIMARY KEY,
  created_at   timestamptz NOT NULL DEFAULT now(),
  reviewed_at  timestamptz,

  -- 'pending' | 'approved' | 'rejected'
  status       text        NOT NULL DEFAULT 'pending',

  -- Denormalised out of payload so the review list and the duplicate check
  -- do not have to dig through jsonb on every row.
  output_name  text        NOT NULL,
  profession   text        NOT NULL,
  tier         text        NOT NULL DEFAULT 'Normal',

  -- The whole recipe object, exactly as recipes.html stores it.
  payload      jsonb       NOT NULL,

  -- Optional display handle the contributor typed. Never an email, never
  -- an account: it exists so n00b can credit people, nothing else.
  submitter    text,

  -- Browser fingerprint, same shape as the reports page uses. Spam control
  -- only — it identifies a browser, not a person.
  fingerprint  text,

  admin_notes  text
);

CREATE INDEX IF NOT EXISTS recipe_submissions_status_idx
  ON recipe_submissions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS recipe_submissions_output_idx
  ON recipe_submissions (lower(output_name));

-- Locked down. Only the SECURITY DEFINER functions below may touch it.
ALTER TABLE recipe_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON recipe_submissions FROM anon, authenticated;
REVOKE ALL ON SEQUENCE recipe_submissions_id_seq FROM anon, authenticated;


-- ============================================================
-- STEP 2 — submit_recipe: the only write the website exposes.
--
-- Anon-callable (every contributor's browser calls it). It can only INSERT
-- a pending row; it cannot read, approve, or change anything. Validation
-- here is deliberately strict — a malformed payload is rejected at the door
-- rather than landing in the queue for a human to puzzle over.
-- ============================================================
CREATE OR REPLACE FUNCTION submit_recipe(
  p_payload     jsonb,
  p_submitter   text DEFAULT NULL,
  p_fingerprint text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_output  text;
  v_prof    text;
  v_tier    text;
  v_mats    jsonb;
  v_recent  integer;
  v_dupe    integer;
  v_id      bigint;
  valid_profs text[] := ARRAY[
    'Adventuring','Alchemy','Armorsmithing','Artificing',
    'Blacksmithing','Jewelcrafting','Leatherworking','Tailoring'
  ];
  valid_tiers text[] := ARRAY['Normal','MW I','MW II','MW III','MW IV','MW V'];
BEGIN
  IF p_payload IS NULL OR jsonb_typeof(p_payload) <> 'object' THEN
    RETURN json_build_object('ok', false, 'error', 'Nothing was submitted.');
  END IF;

  -- Whole-payload size guard: a real recipe is well under 4 KB.
  IF length(p_payload::text) > 8000 THEN
    RETURN json_build_object('ok', false, 'error', 'That recipe is too large to accept.');
  END IF;

  v_output := btrim(coalesce(p_payload->>'name', ''));
  v_prof   := btrim(coalesce(p_payload->>'profession', ''));
  v_tier   := btrim(coalesce(p_payload->>'tier', 'Normal'));
  v_mats   := p_payload->'materials';

  IF v_output = '' OR length(v_output) > 120 THEN
    RETURN json_build_object('ok', false, 'error', 'The crafted item needs a name (120 characters or fewer).');
  END IF;

  IF NOT (v_prof = ANY(valid_profs)) THEN
    RETURN json_build_object('ok', false, 'error', 'Pick one of the eight professions.');
  END IF;

  IF NOT (v_tier = ANY(valid_tiers)) THEN
    RETURN json_build_object('ok', false, 'error', 'Tier must be Normal or Masterwork I to V.');
  END IF;

  IF v_mats IS NULL OR jsonb_typeof(v_mats) <> 'array'
     OR jsonb_array_length(v_mats) = 0 THEN
    RETURN json_build_object('ok', false, 'error', 'A recipe needs at least one material.');
  END IF;

  IF jsonb_array_length(v_mats) > 20 THEN
    RETURN json_build_object('ok', false, 'error', 'That is more materials than any Neverwinter recipe uses.');
  END IF;

  -- Rate limit: 40 pending submissions per browser per day. Generous enough
  -- that someone working through a whole profession is never stopped, tight
  -- enough that a script cannot fill the queue overnight.
  SELECT count(*) INTO v_recent
  FROM recipe_submissions
  WHERE fingerprint = p_fingerprint
    AND created_at > now() - interval '1 day';

  IF p_fingerprint IS NOT NULL AND v_recent >= 40 THEN
    RETURN json_build_object('ok', false,
      'error', 'That is 40 recipes today — thank you. Please come back tomorrow.');
  END IF;

  -- Same item, same tier, already waiting to be reviewed? Say so instead of
  -- queueing a second copy of it.
  SELECT count(*) INTO v_dupe
  FROM recipe_submissions
  WHERE status = 'pending'
    AND lower(output_name) = lower(v_output)
    AND tier = v_tier;

  IF v_dupe > 0 THEN
    RETURN json_build_object('ok', false,
      'error', 'Someone has already submitted this recipe and it is waiting to be checked.');
  END IF;

  INSERT INTO recipe_submissions (output_name, profession, tier, payload, submitter, fingerprint)
  VALUES (
    v_output,
    v_prof,
    v_tier,
    p_payload,
    nullif(btrim(left(coalesce(p_submitter, ''), 40)), ''),
    left(coalesce(p_fingerprint, ''), 64)
  )
  RETURNING id INTO v_id;

  RETURN json_build_object('ok', true, 'id', v_id);
END;
$fn$;

REVOKE ALL ON FUNCTION submit_recipe(jsonb, text, text) FROM public;
GRANT EXECUTE ON FUNCTION submit_recipe(jsonb, text, text) TO anon, authenticated;


-- ============================================================
-- STEP 3 — get_approved_recipes: what the public page reads.
--
-- Approved rows only. A pending submission is invisible to everyone except
-- n00b, so nothing unchecked can ever appear in someone's material tree.
-- ============================================================
CREATE OR REPLACE FUNCTION get_approved_recipes()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  RETURN coalesce((
    SELECT json_agg(
             payload || jsonb_build_object(
               'submissionId', id,
               'submitter',    coalesce(submitter, ''),
               'approvedAt',   reviewed_at
             )
             ORDER BY id
           )
    FROM recipe_submissions
    WHERE status = 'approved'
  ), '[]'::json);
END;
$fn$;

REVOKE ALL ON FUNCTION get_approved_recipes() FROM public;
GRANT EXECUTE ON FUNCTION get_approved_recipes() TO anon, authenticated;


-- ============================================================
-- STEP 4 — public progress counter.
--
-- Counts only. It is there so the page can say "142 recipes so far, 9
-- waiting to be checked" and people can see their help landing.
-- ============================================================
CREATE OR REPLACE FUNCTION get_recipe_progress()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  RETURN (
    SELECT json_build_object(
      'approved', count(*) FILTER (WHERE status = 'approved'),
      'pending',  count(*) FILTER (WHERE status = 'pending')
    )
    FROM recipe_submissions
  );
END;
$fn$;

REVOKE ALL ON FUNCTION get_recipe_progress() FROM public;
GRANT EXECUTE ON FUNCTION get_recipe_progress() TO anon, authenticated;


-- ============================================================
-- STEP 5 — admin side. Same admin_config password as the reports RPCs.
-- ============================================================
CREATE OR REPLACE FUNCTION list_recipe_submissions(
  p_status     text,
  p_admin_pass text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_stored text;
BEGIN
  SELECT value INTO v_stored FROM admin_config WHERE key = 'admin_password';
  IF v_stored IS NULL OR p_admin_pass IS DISTINCT FROM v_stored THEN
    RETURN json_build_object('ok', false, 'error', 'Wrong password.');
  END IF;

  RETURN json_build_object('ok', true, 'rows', coalesce((
    SELECT json_agg(row_to_json(r) ORDER BY r.id DESC)
    FROM (
      SELECT id, created_at, reviewed_at, status, output_name,
             profession, tier, payload, submitter, admin_notes
      FROM recipe_submissions
      WHERE p_status IS NULL OR p_status = '' OR status = p_status
      ORDER BY id DESC
      LIMIT 500
    ) r
  ), '[]'::json));
END;
$fn$;

REVOKE ALL ON FUNCTION list_recipe_submissions(text, text) FROM public;
GRANT EXECUTE ON FUNCTION list_recipe_submissions(text, text) TO anon, authenticated;


-- Approve, reject, or edit-and-approve a submission. p_payload is optional:
-- pass a corrected recipe object to fix a contributor's typo while approving.
CREATE OR REPLACE FUNCTION review_recipe_submission(
  p_id         bigint,
  p_status     text,
  p_admin_pass text,
  p_payload    jsonb DEFAULT NULL,
  p_note       text  DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_stored text;
BEGIN
  SELECT value INTO v_stored FROM admin_config WHERE key = 'admin_password';
  IF v_stored IS NULL OR p_admin_pass IS DISTINCT FROM v_stored THEN
    RETURN json_build_object('ok', false, 'error', 'Wrong password.');
  END IF;

  IF p_status NOT IN ('pending', 'approved', 'rejected') THEN
    RETURN json_build_object('ok', false, 'error', 'Unknown status.');
  END IF;

  UPDATE recipe_submissions
  SET status      = p_status,
      reviewed_at = now(),
      payload     = coalesce(p_payload, payload),
      output_name = coalesce(btrim(p_payload->>'name'), output_name),
      profession  = coalesce(btrim(p_payload->>'profession'), profession),
      tier        = coalesce(btrim(p_payload->>'tier'), tier),
      admin_notes = coalesce(p_note, admin_notes)
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'error', 'No submission with that id.');
  END IF;

  RETURN json_build_object('ok', true);
END;
$fn$;

REVOKE ALL ON FUNCTION review_recipe_submission(bigint, text, text, jsonb, text) FROM public;
GRANT EXECUTE ON FUNCTION review_recipe_submission(bigint, text, text, jsonb, text) TO anon, authenticated;


CREATE OR REPLACE FUNCTION delete_recipe_submission(
  p_id         bigint,
  p_admin_pass text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_stored text;
BEGIN
  SELECT value INTO v_stored FROM admin_config WHERE key = 'admin_password';
  IF v_stored IS NULL OR p_admin_pass IS DISTINCT FROM v_stored THEN
    RETURN json_build_object('ok', false, 'error', 'Wrong password.');
  END IF;

  DELETE FROM recipe_submissions WHERE id = p_id;
  RETURN json_build_object('ok', true);
END;
$fn$;

REVOKE ALL ON FUNCTION delete_recipe_submission(bigint, text) FROM public;
GRANT EXECUTE ON FUNCTION delete_recipe_submission(bigint, text) TO anon, authenticated;
