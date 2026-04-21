-- ─────────────────────────────────────────────
-- Coach ↔ Professional links
-- ─────────────────────────────────────────────
CREATE TABLE coach_professional_links (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status          text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived')),
  invited_at      timestamptz NOT NULL DEFAULT now(),
  accepted_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (coach_id, professional_id)
);

CREATE TRIGGER set_coach_professional_links_updated_at
  BEFORE UPDATE ON coach_professional_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- Selection processes
-- ─────────────────────────────────────────────
CREATE TABLE selection_processes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  selector_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_name   text NOT NULL,
  seniority   text,
  industry    text,
  context     text,
  status      text NOT NULL DEFAULT 'skills_definition'
    CHECK (status IN ('skills_definition', 'assessments_assigned', 'in_progress', 'evaluating', 'closed')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_selection_processes_updated_at
  BEFORE UPDATE ON selection_processes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE process_candidates (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id   uuid NOT NULL REFERENCES selection_processes(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'invited'
    CHECK (status IN ('invited', 'assessment_pending', 'completed', 'archived')),
  invited_at   timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (process_id, candidate_id)
);

CREATE TRIGGER set_process_candidates_updated_at
  BEFORE UPDATE ON process_candidates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────
ALTER TABLE coach_professional_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE selection_processes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_candidates       ENABLE ROW LEVEL SECURITY;

-- coach_professional_links
CREATE POLICY "cpl_coach_select" ON coach_professional_links
  FOR SELECT USING (coach_id = auth.uid());

CREATE POLICY "cpl_professional_select" ON coach_professional_links
  FOR SELECT USING (professional_id = auth.uid());

CREATE POLICY "cpl_coach_insert" ON coach_professional_links
  FOR INSERT WITH CHECK (coach_id = auth.uid());

CREATE POLICY "cpl_coach_update" ON coach_professional_links
  FOR UPDATE USING (coach_id = auth.uid());

CREATE POLICY "cpl_admin" ON coach_professional_links
  FOR ALL USING (is_admin());

-- selection_processes
CREATE POLICY "sp_selector_all" ON selection_processes
  FOR ALL USING (selector_id = auth.uid());

CREATE POLICY "sp_admin" ON selection_processes
  FOR ALL USING (is_admin());

-- process_candidates
CREATE POLICY "pc_selector_all" ON process_candidates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM selection_processes
      WHERE id = process_candidates.process_id AND selector_id = auth.uid()
    )
  );

CREATE POLICY "pc_candidate_select" ON process_candidates
  FOR SELECT USING (candidate_id = auth.uid());

CREATE POLICY "pc_admin" ON process_candidates
  FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- Cross-table: coach reads profiles of linked professionals
-- (deferred from migration 001 until coach_professional_links existed)
-- ─────────────────────────────────────────────
CREATE POLICY "profiles_coach_reads_linked" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coach_professional_links
      WHERE coach_id = auth.uid()
        AND professional_id = profiles.id
        AND status = 'active'
    )
  );

-- Selector reads candidate profiles in their processes
CREATE POLICY "profiles_selector_reads_candidates" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM process_candidates pc
      JOIN selection_processes sp ON sp.id = pc.process_id
      WHERE sp.selector_id = auth.uid()
        AND pc.candidate_id = profiles.id
    )
  );
