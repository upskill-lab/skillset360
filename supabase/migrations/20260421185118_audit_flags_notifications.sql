-- ─────────────────────────────────────────────
-- Audit log
-- ─────────────────────────────────────────────
CREATE TABLE audit_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      uuid REFERENCES profiles(id),
  actor_role    text,
  action        text NOT NULL,
  resource_type text,
  resource_id   uuid,
  ip            inet,
  user_agent    text,
  metadata      jsonb NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_actor_idx    ON audit_log (actor_id);
CREATE INDEX audit_log_action_idx   ON audit_log (action);
CREATE INDEX audit_log_created_idx  ON audit_log (created_at DESC);

-- ─────────────────────────────────────────────
-- Feature flags
-- ─────────────────────────────────────────────
CREATE TABLE feature_flags (
  key                text PRIMARY KEY,
  enabled            boolean NOT NULL DEFAULT false,
  rollout_percentage int NOT NULL DEFAULT 0,
  description        text,
  updated_by         uuid REFERENCES profiles(id),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Notifications
-- ─────────────────────────────────────────────
CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       text NOT NULL,
  title      text,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_idx ON notifications (user_id, created_at DESC);

-- ─────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────
ALTER TABLE audit_log     ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;

-- audit_log: append-only for system; admin reads all; users read their own
CREATE POLICY "al_actor_select" ON audit_log
  FOR SELECT USING (actor_id = auth.uid());

CREATE POLICY "al_admin" ON audit_log
  FOR ALL USING (is_admin());

-- feature_flags: all authenticated users can read; admin manages
CREATE POLICY "ff_select_authenticated" ON feature_flags
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "ff_admin" ON feature_flags
  FOR ALL USING (is_admin());

-- notifications: users read and update their own
CREATE POLICY "notif_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notif_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notif_admin" ON notifications
  FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- Seed: initial feature flags
-- ─────────────────────────────────────────────
INSERT INTO feature_flags (key, enabled, rollout_percentage, description) VALUES
  ('ai_suggestions',     false, 0, 'IA: sugerencia de skillset desde descripción de rol (E20)'),
  ('ai_action_plan',     false, 0, 'IA: generación de plan de acción (E21)'),
  ('stripe_billing',     false, 0, 'Fase 2: pagos con Stripe'),
  ('magic_link_external',true,  100, 'Magic links para terceros externos (E13)');
