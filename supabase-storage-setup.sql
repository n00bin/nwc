-- ============================================================
-- NWCB Reports Storage — Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create a public storage bucket for report images
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-images', 'report-images', true);

-- 2. Allow anyone to upload images (max 5MB, images only)
CREATE POLICY "Anyone can upload report images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'report-images'
  AND (LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
);

-- 3. Allow anyone to view uploaded images
CREATE POLICY "Anyone can view report images"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-images');

-- 4. Add image_url column to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';

-- 5. Update the public view to include image_url
DROP VIEW IF EXISTS reports_public;
CREATE VIEW reports_public AS
  SELECT id, created_at, title, description, category, status, upvotes, image_url
  FROM reports;
