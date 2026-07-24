-- Run this against zrp-db on Render (psql or a one-off script).
-- Safe to re-run: IF NOT EXISTS guards every column.
ALTER TABLE users
ADD COLUMN IF NOT EXISTS agency VARCHAR(150);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS location VARCHAR(100);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(30);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);