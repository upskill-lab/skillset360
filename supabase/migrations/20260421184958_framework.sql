-- ─────────────────────────────────────────────
-- Framework de Skills
-- ─────────────────────────────────────────────
CREATE TABLE dimensions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  description text,
  sort_order  int NOT NULL DEFAULT 0,
  is_archived boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_dimensions_updated_at
  BEFORE UPDATE ON dimensions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE skills (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  name         text NOT NULL,
  dimension_id uuid NOT NULL REFERENCES dimensions(id),
  description  text,
  is_archived  boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE skill_levels (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id            uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level               int NOT NULL CHECK (level BETWEEN 1 AND 5),
  observable_behaviors text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (skill_id, level)
);

CREATE TRIGGER set_skill_levels_updated_at
  BEFORE UPDATE ON skill_levels
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- RLS — framework data is read-only for authenticated users; admin manages it
-- ─────────────────────────────────────────────
ALTER TABLE dimensions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_levels ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read active framework data
CREATE POLICY "dimensions_select_authenticated" ON dimensions
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_archived = false);

CREATE POLICY "dimensions_admin" ON dimensions
  FOR ALL USING (is_admin());

CREATE POLICY "skills_select_authenticated" ON skills
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_archived = false);

CREATE POLICY "skills_admin" ON skills
  FOR ALL USING (is_admin());

-- Coaches and selectors can read observable_behaviors; professionals see limited info
-- Row-level is sufficient here; column-level security handled at the API layer (E4)
CREATE POLICY "skill_levels_select_authenticated" ON skill_levels
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "skill_levels_admin" ON skill_levels
  FOR ALL USING (is_admin());
