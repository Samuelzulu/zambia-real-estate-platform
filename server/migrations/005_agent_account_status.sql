-- Adds a suspend/reactivate lifecycle for agent accounts, separate from
-- ZIEA verification. verified = "passed identity/license check" (permanent
-- fact). account_status = "currently allowed to publish" (can change).
-- Run against BOTH local and Render DBs.

ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'active';