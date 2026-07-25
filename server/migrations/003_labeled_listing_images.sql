-- Converts listings.images from TEXT[] (bare URLs) to JSONB
-- (array of {url, label}), preserving any images already uploaded.
-- Run against BOTH local and Render DBs.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS images_v2 JSONB DEFAULT '[]';

UPDATE listings
SET images_v2 = COALESCE(
  (SELECT jsonb_agg(jsonb_build_object('url', img, 'label', ''))
   FROM unnest(images) AS img),
  '[]'::jsonb
)
WHERE images IS NOT NULL;

ALTER TABLE listings DROP COLUMN images;
ALTER TABLE listings RENAME COLUMN images_v2 TO images;