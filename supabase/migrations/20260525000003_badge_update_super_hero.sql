-- Update badge_title to support 4 tiers based on distinct sender count
-- Thresholds: New Hero (1-4), Rising Hero (5-9), Super Hero (10-20), Legend Hero (21+)

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_badge_title_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_badge_title_check
  CHECK (badge_title IN ('New Hero', 'Rising Hero', 'Super Hero', 'Legend Hero'));

-- Recompute badge based on distinct number of people who sent kudos
CREATE OR REPLACE FUNCTION update_profile_badge(p_id UUID) RETURNS VOID
LANGUAGE plpgsql AS $$
DECLARE
  v_senders INTEGER;
BEGIN
  SELECT COUNT(DISTINCT sender_id) INTO v_senders FROM kudos WHERE receiver_id = p_id;
  UPDATE profiles
  SET
    badge_title = CASE
      WHEN v_senders >= 21 THEN 'Legend Hero'
      WHEN v_senders >= 10 THEN 'Super Hero'
      WHEN v_senders >= 5  THEN 'Rising Hero'
      WHEN v_senders >= 1  THEN 'New Hero'
      ELSE NULL
    END,
    star_level = 0
  WHERE id = p_id;
END;
$$;

-- Refresh all existing profiles with new badge logic
DO $$
DECLARE p UUID;
BEGIN
  FOR p IN SELECT id FROM profiles LOOP
    PERFORM update_profile_badge(p);
  END LOOP;
END;
$$;
