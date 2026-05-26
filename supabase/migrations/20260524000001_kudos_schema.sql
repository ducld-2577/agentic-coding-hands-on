-- Sun* Kudos Live Board — Schema Migration
-- Tables: departments, kudos_categories, kudos_hashtags, profiles,
--         kudos, kudos_to_hashtags, kudos_likes, secret_boxes, prize_recipients

-- ─────────────────────────────────────────────
-- Lookup tables
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS departments (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS kudos_categories (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS kudos_hashtags (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- ─────────────────────────────────────────────
-- Profiles (extends auth.users)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name            TEXT NOT NULL,
  avatar_url           TEXT,
  department_id        INTEGER REFERENCES departments(id),
  badge_title          TEXT CHECK (badge_title IN ('New Hero', 'Rising Hero', 'Legend Hero')),
  star_level           SMALLINT NOT NULL DEFAULT 0 CHECK (star_level BETWEEN 0 AND 3),
  kudos_received_count INTEGER NOT NULL DEFAULT 0,
  kudos_sent_count     INTEGER NOT NULL DEFAULT 0,
  hearts_received      INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Kudos
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kudos (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  category_id INTEGER REFERENCES kudos_categories(id),
  image_urls  TEXT[] NOT NULL DEFAULT '{}',
  like_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kudos_to_hashtags (
  kudos_id   UUID    NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  hashtag_id INTEGER NOT NULL REFERENCES kudos_hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (kudos_id, hashtag_id)
);

-- ─────────────────────────────────────────────
-- Likes
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kudos_likes (
  id             UUID     NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kudos_id       UUID     NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  user_id        UUID     NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_special_day BOOLEAN  NOT NULL DEFAULT FALSE,
  hearts_added   SMALLINT NOT NULL DEFAULT 1 CHECK (hearts_added IN (1, 2)),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (kudos_id, user_id)
);

-- ─────────────────────────────────────────────
-- Secret boxes + Prize recipients
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS secret_boxes (
  id                UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_opened         BOOLEAN     NOT NULL DEFAULT FALSE,
  prize_description TEXT,
  opened_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prize_recipients (
  id                UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prize_description TEXT        NOT NULL,
  received_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_kudos_sender       ON kudos (sender_id);
CREATE INDEX IF NOT EXISTS idx_kudos_receiver      ON kudos (receiver_id);
CREATE INDEX IF NOT EXISTS idx_kudos_created_at    ON kudos (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kudos_like_count    ON kudos (like_count DESC);
CREATE INDEX IF NOT EXISTS idx_kudos_likes_kudos   ON kudos_likes (kudos_id);
CREATE INDEX IF NOT EXISTS idx_kudos_likes_user    ON kudos_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_dept       ON profiles (department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_kudos_rcvd ON profiles (kudos_received_count DESC);
CREATE INDEX IF NOT EXISTS idx_prize_received_at   ON prize_recipients (received_at DESC);

-- ─────────────────────────────────────────────
-- Helper: recompute badge + star_level for a profile
-- Called after kudos_received_count changes
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_profile_badge(p_id UUID) RETURNS VOID
LANGUAGE plpgsql AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT kudos_received_count INTO v_count FROM profiles WHERE id = p_id;
  UPDATE profiles
  SET
    star_level  = CASE WHEN v_count >= 50 THEN 3
                       WHEN v_count >= 20 THEN 2
                       WHEN v_count >= 10 THEN 1
                       ELSE 0 END,
    badge_title = CASE WHEN v_count >= 50 THEN 'Legend Hero'
                       WHEN v_count >= 20 THEN 'Rising Hero'
                       WHEN v_count >= 10 THEN 'New Hero'
                       ELSE NULL END
  WHERE id = p_id;
END;
$$;

-- ─────────────────────────────────────────────
-- Atomic counter helpers (avoids read-modify-write races)
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_kudos_like_count(p_kudos_id UUID) RETURNS VOID
LANGUAGE sql AS $$
  UPDATE kudos SET like_count = like_count + 1 WHERE id = p_kudos_id;
$$;

CREATE OR REPLACE FUNCTION decrement_kudos_like_count(p_kudos_id UUID) RETURNS VOID
LANGUAGE sql AS $$
  UPDATE kudos SET like_count = GREATEST(0, like_count - 1) WHERE id = p_kudos_id;
$$;

CREATE OR REPLACE FUNCTION increment_profile_hearts(p_profile_id UUID, p_amount INT) RETURNS VOID
LANGUAGE sql AS $$
  UPDATE profiles SET hearts_received = hearts_received + p_amount WHERE id = p_profile_id;
$$;

CREATE OR REPLACE FUNCTION decrement_profile_hearts(p_profile_id UUID, p_amount INT) RETURNS VOID
LANGUAGE sql AS $$
  UPDATE profiles SET hearts_received = GREATEST(0, hearts_received - p_amount) WHERE id = p_profile_id;
$$;

CREATE OR REPLACE FUNCTION increment_kudos_sent(p_profile_id UUID) RETURNS VOID
LANGUAGE sql AS $$
  UPDATE profiles SET kudos_sent_count = kudos_sent_count + 1 WHERE id = p_profile_id;
$$;

CREATE OR REPLACE FUNCTION increment_kudos_received(p_profile_id UUID) RETURNS VOID
LANGUAGE sql AS $$
  UPDATE profiles SET kudos_received_count = kudos_received_count + 1 WHERE id = p_profile_id;
$$;
