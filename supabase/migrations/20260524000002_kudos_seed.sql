-- Sun* Kudos Live Board — Lookup Data
-- Reference data required in all environments (local + cloud).
-- Demo users / kudos / likes live in supabase/seed.sql (local only).

INSERT INTO departments (name) VALUES
  ('CEVC1'),('CEVC2'),('CEVC3'),('CEVC4'),('CEVC10'),
  ('OPD'),('Infra'),('Engineering'),('Product'),('Design')
ON CONFLICT (name) DO NOTHING;

INSERT INTO kudos_categories (name) VALUES
  ('IDOL GIỚI TRẺ'),('TOP TALENT'),('TOP PROJECT'),
  ('BEST MANAGER'),('MVP'),('SIGNATURE CREATOR')
ON CONFLICT (name) DO NOTHING;

INSERT INTO kudos_hashtags (name) VALUES
  ('High-performing'),('BE PROFESSIONAL'),('BE OPTIMISTIC'),
  ('BE A TEAM'),('THINK OUTSIDE THE BOX'),('GET RISKY'),
  ('GO FAST'),('WASSHOI'),('Dedicated'),('Inspiring')
ON CONFLICT (name) DO NOTHING;
