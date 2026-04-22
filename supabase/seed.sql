-- ─────────────────────────────────────────────
-- E5 seed — Framework de Skills (placeholder)
-- Idempotente: ON CONFLICT DO NOTHING en todas las tablas.
-- Reemplazar contenido cuando llegue el framework definitivo.
-- ─────────────────────────────────────────────

-- Dimensiones
INSERT INTO public.dimensions (slug, name, description, sort_order) VALUES
  ('inner-compass',        'Inner Compass',        'Autoconocimiento, gestión emocional y propósito personal.',            1),
  ('collaborative-synergy','Collaborative Synergy', 'Capacidad para crear relaciones de trabajo de alto valor.',            2),
  ('impactful-leadership', 'Impactful Leadership',  'Inspirar, decidir y responsabilizarse por resultados colectivos.',     3),
  ('next-frontier-thinking','Next Frontier Thinking','Pensamiento sistémico, innovación y agilidad de aprendizaje.',        4),
  ('customer-centricity',  'Customer Centricity',   'Orientación al cliente, empatía y cultura de feedback.',              5)
ON CONFLICT (slug) DO NOTHING;

-- Skills (referencia dimension por slug usando subquery)
INSERT INTO public.skills (slug, name, description, dimension_id) VALUES
  ('self-awareness',    'Self-Awareness',    'Conocimiento profundo de las propias emociones, fortalezas y áreas de mejora.',               (SELECT id FROM public.dimensions WHERE slug = 'inner-compass')),
  ('resilience',        'Resilience',        'Capacidad de recuperarse ante adversidades y mantener el desempeño bajo presión.',              (SELECT id FROM public.dimensions WHERE slug = 'inner-compass')),
  ('emotional-regulation','Emotional Regulation','Gestión efectiva de las emociones propias en contextos de alta exigencia.',               (SELECT id FROM public.dimensions WHERE slug = 'inner-compass')),
  ('active-listening',  'Active Listening',  'Escucha genuina y comprensión profunda de las perspectivas de otros.',                         (SELECT id FROM public.dimensions WHERE slug = 'collaborative-synergy')),
  ('conflict-resolution','Conflict Resolution','Gestión constructiva de conflictos para fortalecer relaciones y resultados.',                (SELECT id FROM public.dimensions WHERE slug = 'collaborative-synergy')),
  ('trust-building',    'Trust Building',    'Generación de confianza sostenida a través de consistencia e integridad.',                     (SELECT id FROM public.dimensions WHERE slug = 'collaborative-synergy')),
  ('vision-setting',    'Vision Setting',    'Articulación clara de un futuro inspirador que moviliza a otros.',                             (SELECT id FROM public.dimensions WHERE slug = 'impactful-leadership')),
  ('decision-making',   'Decision Making',   'Toma de decisiones ágiles y fundamentadas en contextos de incertidumbre.',                     (SELECT id FROM public.dimensions WHERE slug = 'impactful-leadership')),
  ('accountability',    'Accountability',    'Responsabilidad personal y del equipo por compromisos y resultados.',                          (SELECT id FROM public.dimensions WHERE slug = 'impactful-leadership')),
  ('systems-thinking',  'Systems Thinking',  'Comprensión de interrelaciones complejas y efectos de segundo orden.',                         (SELECT id FROM public.dimensions WHERE slug = 'next-frontier-thinking')),
  ('innovation-mindset','Innovation Mindset','Apertura a explorar nuevas ideas y tolerar la ambigüedad del cambio.',                         (SELECT id FROM public.dimensions WHERE slug = 'next-frontier-thinking')),
  ('learning-agility',  'Learning Agility',  'Velocidad para adquirir nuevas competencias y aplicarlas efectivamente.',                      (SELECT id FROM public.dimensions WHERE slug = 'next-frontier-thinking')),
  ('customer-empathy',  'Customer Empathy',  'Comprensión profunda de las necesidades y experiencias del cliente.',                          (SELECT id FROM public.dimensions WHERE slug = 'customer-centricity')),
  ('service-orientation','Service Orientation','Disposición genuina a agregar valor en cada interacción con el cliente.',                   (SELECT id FROM public.dimensions WHERE slug = 'customer-centricity')),
  ('feedback-culture',  'Feedback Culture',  'Capacidad de dar y recibir feedback de forma constructiva y continua.',                        (SELECT id FROM public.dimensions WHERE slug = 'customer-centricity'))
ON CONFLICT (slug) DO NOTHING;

-- Niveles (5 por skill, texto placeholder — editar desde /admin/framework/skills)
INSERT INTO public.skill_levels (skill_id, level, observable_behaviors)
SELECT s.id, lvl.level, 'Placeholder — nivel ' || lvl.level || ' de ' || s.name || '. Editar desde Admin → Framework → Skills.'
FROM public.skills s
CROSS JOIN (VALUES (1),(2),(3),(4),(5)) AS lvl(level)
ON CONFLICT (skill_id, level) DO NOTHING;
