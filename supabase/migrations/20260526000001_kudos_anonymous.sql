-- Add anonymous kudos support
-- is_anonymous: hides real sender identity in feed display
-- anonymous_nickname: display name shown instead of real sender name

ALTER TABLE kudos
  ADD COLUMN IF NOT EXISTS is_anonymous       BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS anonymous_nickname TEXT;
