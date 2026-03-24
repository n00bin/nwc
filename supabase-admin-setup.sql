-- ============================================================
-- NWCB Admin Setup — Run this in Supabase SQL Editor
-- ============================================================

-- 1. Config table to store admin password
CREATE TABLE admin_config (
  key   text PRIMARY KEY,
  value text NOT NULL
);

-- 2. Insert your admin password (change 'your-password-here' to whatever you want)
INSERT INTO admin_config (key, value)
VALUES ('admin_password', 'your-password-here');

-- 3. Lock down the config table — no public access at all
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;
-- No policies = no public read/write. Only service_role and SECURITY DEFINER functions can access it.

-- 4. Server-side function to update report status (checks password)
CREATE OR REPLACE FUNCTION update_report_status(
  report_id bigint,
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
  -- Get the stored admin password
  SELECT value INTO stored_pass
  FROM admin_config
  WHERE key = 'admin_password';

  -- Check password
  IF stored_pass IS NULL OR admin_pass != stored_pass THEN
    RETURN json_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  -- Validate new status
  IF new_status NOT IN ('New', 'Confirmed', 'In Progress', 'Fixed', 'Won''t Fix') THEN
    RETURN json_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  -- Update the report
  UPDATE reports SET status = new_status WHERE id = report_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'reason', 'not_found');
  END IF;

  RETURN json_build_object('success', true);
END;
$$;
