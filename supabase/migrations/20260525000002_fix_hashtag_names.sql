-- Fix hashtag names: strip leading '#' so the UI can add it consistently.
-- Also inserts any missing hashtags from the canonical list.

UPDATE kudos_hashtags
SET name = SUBSTRING(name FROM 2)
WHERE name LIKE '#%';

INSERT INTO kudos_hashtags (name) VALUES
  ('High-performing'),('BE PROFESSIONAL'),('BE OPTIMISTIC'),
  ('BE A TEAM'),('THINK OUTSIDE THE BOX'),('GET RISKY'),
  ('GO FAST'),('WASSHOI'),('Dedicated'),('Inspiring')
ON CONFLICT (name) DO NOTHING;
