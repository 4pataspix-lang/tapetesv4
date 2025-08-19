/*
  # Add header banner URL field

  1. Changes
    - Add `header_banner_url` column to `store_settings` table
    - Separate header banner from homepage banner
    - Default empty string for new field

  2. Purpose
    - Allow different banners for header and homepage
    - Better customization control
    - Smaller header banner (1000x50px) vs larger homepage banner
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'header_banner_url'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN header_banner_url text DEFAULT '' NOT NULL;
  END IF;
END $$;