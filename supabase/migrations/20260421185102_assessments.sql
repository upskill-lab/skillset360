-- ─────────────────────────────────────────────
-- Development goals
-- ─────────────────────────────────────────────
CREATE TABLE development_goals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id        uuid NOT NULL REFERENCES profiles(id),
  title           text NOT NULL,
  description     text,
  horizon         text,
  context         text,
  priority        int NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_development_goals_updated_at
  BEFORE UPDATE ON development_goals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- Assigned skills (output of SkillBoard)
-- ─────────────────────────────────────────────
CREATE TABLE assigned_skills (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_skillboard_id uuid REFERENCES skillboards(id),
  assignee_type       text NOT NULL CHECK (assignee_type IN ('professional', 'candidate_in_process')),
  assignee_id         uuid NOT NULL,
  skill_id            uuid NOT NULL REFERENCES skills(id),
  target_level        int CHECK (target_level BETWEEN 1 AND 5),
  min_level           int CHECK (min_level BETWEEN 1 AND 5),
  category            text CHECK (category IN ('critical', 'desirable', 'differentiating')),
  assessment_status   text NOT NULL DEFAULT 'pending'
    CHECK (assessment_status IN ('pending', 'in_progress', 'evaluated', 're_evaluation')),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_assigned_skills_updated_at
  BEFORE UPDATE ON assigned_skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- Action items
-- ─────────────────────────────────────────────
CREATE TABLE action_items (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_skillboard_id uuid REFERENCES skillboards(id),
  professional_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id             uuid REFERENCES skills(id),
  description          text NOT NULL,
  responsible          text,
  timeframe            text,
  notes                text,
  status               text NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'done', 'delegated', 'dismissed')),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_action_items_updated_at
  BEFORE UPDATE ON action_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- Assessment assignments (mockup Phase 1 — no scoring)
-- ─────────────────────────────────────────────
CREATE TABLE assessment_assignments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_by  uuid NOT NULL REFERENCES profiles(id),
  assignee_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id     uuid NOT NULL REFERENCES skills(id),
  context_type text NOT NULL CHECK (context_type IN ('development', 'selection')),
  context_id   uuid,
  status       text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed_mock')),
  assigned_at  timestamptz NOT NULL DEFAULT now(),
  started_at   timestamptz,
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_assessment_assignments_updated_at
  BEFORE UPDATE ON assessment_assignments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Uniqueness rules enforced via trigger (see PLAN §5.6)
CREATE OR REPLACE FUNCTION check_assessment_constraints()
RETURNS TRIGGER AS $$
BEGIN
  -- Max 1 in_progress per assignee
  IF NEW.status = 'in_progress' THEN
    IF EXISTS (
      SELECT 1 FROM assessment_assignments
      WHERE assignee_id = NEW.assignee_id
        AND status = 'in_progress'
        AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Assignee already has an assessment in progress';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_assessment_constraints
  BEFORE INSERT OR UPDATE ON assessment_assignments
  FOR EACH ROW EXECUTE FUNCTION check_assessment_constraints();

-- ─────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────
ALTER TABLE development_goals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_assignments ENABLE ROW LEVEL SECURITY;

-- development_goals
CREATE POLICY "dg_professional_all" ON development_goals
  FOR ALL USING (professional_id = auth.uid());

CREATE POLICY "dg_coach_select" ON development_goals
  FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "dg_coach_insert" ON development_goals
  FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "dg_coach_update" ON development_goals
  FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "dg_admin" ON development_goals
  FOR ALL USING (is_admin());

-- assigned_skills: coach via linked professional, selector via process
CREATE POLICY "as_professional_select" ON assigned_skills
  FOR SELECT USING (
    assignee_type = 'professional' AND assignee_id = auth.uid()
  );

CREATE POLICY "as_coach_all" ON assigned_skills
  FOR ALL USING (
    assignee_type = 'professional'
    AND EXISTS (
      SELECT 1 FROM coach_professional_links
      WHERE coach_id = auth.uid()
        AND professional_id = assigned_skills.assignee_id
        AND status = 'active'
    )
  );

CREATE POLICY "as_selector_all" ON assigned_skills
  FOR ALL USING (
    assignee_type = 'candidate_in_process'
    AND EXISTS (
      SELECT 1 FROM process_candidates pc
      JOIN selection_processes sp ON sp.id = pc.process_id
      WHERE sp.selector_id = auth.uid()
        AND pc.candidate_id = assigned_skills.assignee_id
    )
  );

CREATE POLICY "as_admin" ON assigned_skills
  FOR ALL USING (is_admin());

-- action_items
CREATE POLICY "ai_professional_select" ON action_items
  FOR SELECT USING (professional_id = auth.uid());

CREATE POLICY "ai_coach_all" ON action_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM coach_professional_links
      WHERE coach_id = auth.uid()
        AND professional_id = action_items.professional_id
        AND status = 'active'
    )
  );

CREATE POLICY "ai_admin" ON action_items
  FOR ALL USING (is_admin());

-- assessment_assignments
CREATE POLICY "aa_assignee_select" ON assessment_assignments
  FOR SELECT USING (assignee_id = auth.uid());

CREATE POLICY "aa_assignee_update" ON assessment_assignments
  FOR UPDATE USING (assignee_id = auth.uid());

CREATE POLICY "aa_assigner_all" ON assessment_assignments
  FOR ALL USING (assigned_by = auth.uid());

CREATE POLICY "aa_admin" ON assessment_assignments
  FOR ALL USING (is_admin());
