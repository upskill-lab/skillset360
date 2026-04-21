-- ─────────────────────────────────────────────
-- SkillBoard templates registry
-- ─────────────────────────────────────────────
CREATE TABLE skillboard_templates (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key       text UNIQUE NOT NULL,
  name               text NOT NULL,
  description        text,
  process_type       text,
  participation_mode text,
  process_moment     text,
  scope              text,
  estimated_time     text,
  output_depth       text,
  instructions_md    text,
  is_active          boolean NOT NULL DEFAULT true,
  created_by         uuid REFERENCES profiles(id),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_skillboard_templates_updated_at
  BEFORE UPDATE ON skillboard_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- SkillBoard instances
-- ─────────────────────────────────────────────
CREATE TABLE skillboards (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL REFERENCES skillboard_templates(template_key),
  owner_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type  text NOT NULL CHECK (target_type IN ('professional', 'selection_process')),
  target_id    uuid NOT NULL,
  status       text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_progress', 'closed')),
  state        jsonb NOT NULL DEFAULT '{}',
  closed_at    timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_skillboards_updated_at
  BEFORE UPDATE ON skillboards
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE skillboard_outputs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skillboard_id uuid NOT NULL REFERENCES skillboards(id) ON DELETE CASCADE,
  output_type   text NOT NULL
    CHECK (output_type IN ('prioritized_skills', 'target_levels', 'actions', 'insights')),
  data          jsonb NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE skillboard_participations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skillboard_id uuid NOT NULL REFERENCES skillboards(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'submitted')),
  inputs        jsonb NOT NULL DEFAULT '{}',
  submitted_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (skillboard_id, participant_id)
);

CREATE TRIGGER set_skillboard_participations_updated_at
  BEFORE UPDATE ON skillboard_participations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Magic links for external (unauthenticated) participants
CREATE TABLE external_form_links (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token          text UNIQUE NOT NULL,
  skillboard_id  uuid NOT NULL REFERENCES skillboards(id) ON DELETE CASCADE,
  form_schema    jsonb NOT NULL,
  expires_at     timestamptz NOT NULL,
  used_at        timestamptz,
  submitted_data jsonb,
  created_by     uuid REFERENCES profiles(id),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────
ALTER TABLE skillboard_templates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillboards               ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillboard_outputs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillboard_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_form_links       ENABLE ROW LEVEL SECURITY;

-- skillboard_templates: read-only for authenticated users, full access for admin
CREATE POLICY "sbt_select_authenticated" ON skillboard_templates
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "sbt_admin" ON skillboard_templates
  FOR ALL USING (is_admin());

-- skillboards: owner (coach/selector) has full access
CREATE POLICY "sb_owner_all" ON skillboards
  FOR ALL USING (owner_id = auth.uid());

-- professional can read skillboards they participate in
CREATE POLICY "sb_participant_select" ON skillboards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM skillboard_participations
      WHERE skillboard_id = skillboards.id AND participant_id = auth.uid()
    )
  );

CREATE POLICY "sb_admin" ON skillboards
  FOR ALL USING (is_admin());

-- skillboard_outputs: owner reads; professional reads their own
CREATE POLICY "sbo_owner_select" ON skillboard_outputs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM skillboards WHERE id = skillboard_outputs.skillboard_id AND owner_id = auth.uid())
  );

CREATE POLICY "sbo_owner_insert" ON skillboard_outputs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM skillboards WHERE id = skillboard_outputs.skillboard_id AND owner_id = auth.uid())
  );

CREATE POLICY "sbo_participant_select" ON skillboard_outputs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM skillboard_participations
      WHERE skillboard_id = skillboard_outputs.skillboard_id AND participant_id = auth.uid()
    )
  );

CREATE POLICY "sbo_admin" ON skillboard_outputs
  FOR ALL USING (is_admin());

-- skillboard_participations
CREATE POLICY "sbp_owner_all" ON skillboard_participations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM skillboards WHERE id = skillboard_participations.skillboard_id AND owner_id = auth.uid())
  );

CREATE POLICY "sbp_participant_all" ON skillboard_participations
  FOR ALL USING (participant_id = auth.uid());

CREATE POLICY "sbp_admin" ON skillboard_participations
  FOR ALL USING (is_admin());

-- external_form_links: no RLS for anonymous access — handled via SECURITY DEFINER function in E13
CREATE POLICY "efl_owner_all" ON external_form_links
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "efl_admin" ON external_form_links
  FOR ALL USING (is_admin());
