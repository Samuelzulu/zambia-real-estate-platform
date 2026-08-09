-- Simple property-view counter. Increments on every GET of a listing's
-- detail page — a reasonable approximation of "impressions" without
-- building session/IP-based deduplication.
-- "Sold" itself needs no schema change — it's just a new value in the
-- existing status column.
-- Run against BOTH local and Render DBs.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;