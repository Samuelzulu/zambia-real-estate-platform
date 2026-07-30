-- Stores the admin's reason when rejecting a listing, so the agent can
-- see what to fix. Run against BOTH local and Render DBs.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS rejection_reason TEXT;