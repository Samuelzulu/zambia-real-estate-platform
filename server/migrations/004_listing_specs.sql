-- Adds property specifics beyond bedrooms/bathrooms.
-- Run against BOTH local and Render DBs.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS square_footage INTEGER;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS year_built INTEGER;