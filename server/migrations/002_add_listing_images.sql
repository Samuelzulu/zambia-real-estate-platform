-- Run this against BOTH your local dev DB and Render's zrp-db.
-- Safe to re-run.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';