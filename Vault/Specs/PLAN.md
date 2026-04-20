# PLAN.md — Skillset360° MVP (Fase 1)

**Versión:** 1.0
**Fecha:** 17 de abril de 2026
**Horizonte:** 8 semanas (2 meses)
**Fase:** 1 — MVP con evaluaciones a nivel mockup
**Equipo:** 2-3 desarrolladores trabajando en paralelo

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Decisiones arquitectónicas fijadas](#2-decisiones-arquitectónicas-fijadas)
3. [Stack tecnológico](#3-stack-tecnológico)
4. [Estructura del monorepo](#4-estructura-del-monorepo)
5. [Modelo de datos (schema inicial)](#5-modelo-de-datos-schema-inicial)
6. [RBAC con Supabase RLS](#6-rbac-con-supabase-rls)
7. [Estrategia de IA](#7-estrategia-de-ia)
8. [Estrategia de colaboración: worktrees, branches, PRs](#8-estrategia-de-colaboración-worktrees-branches-prs)
9. [Bloque 0: Setup de tooling](#9-bloque-0-setup-de-tooling)
10. [Roadmap por épicas](#10-roadmap-por-épicas)
11. [Épicas detalladas (stories + tasks + tests + DoD)](#11-épicas-detalladas)
12. [Grafo de dependencias y paralelización](#12-grafo-de-dependencias-y-paralelización)
13. [Calendario de 8 semanas](#13-calendario-de-8-semanas)
14. [Convenciones de código](#14-convenciones-de-código)
15. [Testing strategy](#15-testing-strategy)
16. [Observabilidad y auditoría](#16-observabilidad-y-auditoría)
17. [Riesgos y mitigaciones](#17-riesgos-y-mitigaciones)
18. [Criterios de cierre de Fase 1](#18-criterios-de-cierre-de-fase-1)
19. [Qué queda fuera (Fase 2+)](#19-qué-queda-fuera-fase-2)

---

## 1. Resumen ejecutivo

Skillset360° es una plataforma HR-tech **skills-based** para desarrollo profesional (coaching) y selección, construida alrededor de **SkillBoards** (canvas estructurados con templates) y un framework propietario de ~60-80 habilidades organizadas en 5 dimensiones.

**Objetivo de Fase 1 (MVP en 8 semanas):**
Lanzar un producto utilizable por Skill Coaches reales para ejecutar SkillBoards end-to-end, con evaluaciones **simuladas a nivel UX** (sin motor real). Los pagos reales se habilitan en Fase 2, junto con el motor de evaluaciones.

**Alcance Fase 1 (in-scope):**

- Autenticación + RBAC (5 roles + invitado magic-link)
- Framework de skills editable por Admin (60-80 skills, 5 dims, 5 niveles con comportamientos observables)
- SkillBoards con templates **hardcodeados en código** (React components tipados)
- Dashboards por rol (5 roles)
- Magic links para terceros (formularios sin auth)
- Evaluaciones como mockup UX navegable (shell + flujos, sin scoring)
- Asistentes IA contextuales (chatbots en dashboards + sugerencias en SkillBoards)
- Admin panel (CRUD completo de framework, templates, usuarios, licencias manuales)
- Auditoría + trazabilidad básica
- Landing comercial (signup + onboarding self-service, sin Stripe todavía)

**Fuera de alcance Fase 1 (Fase 2+):**

- Motor de evaluaciones real (scoring, niveles, persistencia)
- Integración Stripe y facturación automática
- Roleplays con voz
- Organizaciones y multi-tenancy complejo
- Exportación avanzada de PDFs (básica sí, avanzada no)

**Criterio de éxito (definition of done) Fase 1:**
Un Skill Coach se registra → crea un Profesional → ejecuta 2+ SkillBoard templates end-to-end → genera plan de acción → asigna evaluaciones mockup → el Profesional ve su dashboard con objetivos, habilidades priorizadas y acciones → todo ello con auditoría registrada y RBAC enforced por RLS.

---

## 2. Decisiones arquitectónicas fijadas

Estas decisiones están **confirmadas** y no deben cambiar durante Fase 1 sin redefinición explícita.

| #   | Decisión                                                                               | Racional                                                                                                                   |
| --- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Next.js 15 App Router + TypeScript estricto**                                        | RSC para dashboards, Server Actions para mutaciones, excelente integración con Vercel, soporte nativo de streaming para IA |
| D2  | **Supabase como único backend** (Postgres + Auth + Storage + Edge Functions)           | Simplicidad, RLS nativo, reduce superficie de ataque, acelera tiempo a MVP                                                 |
| D3  | **RBAC 100% en Supabase RLS**                                                          | Seguridad a nivel de DB es fuente de verdad; middleware Next.js es defensa en profundidad, no autorización primaria        |
| D4  | **SkillBoard templates como React components tipados** (contrato `SkillBoardTemplate`) | Máxima flexibilidad en Fase 1; motor genérico editable por Admin queda para Fase 2+                                        |
| D5  | **Schema versionado con Supabase CLI migrations**                                      | Cada cambio de schema pasa por PR; nunca se edita schema desde la UI de Supabase                                           |
| D6  | **Feature flags desde día 1** (tabla `feature_flags`)                                  | Permite mergear código de Fase 2 a `main` sin activarlo en prod                                                            |
| D7  | **Mockups de evaluaciones como shells navegables reales**                              | En Fase 2 solo se enchufa el motor de scoring; la UX queda construida                                                      |
| D8  | **Monorepo con Turborepo + pnpm workspaces**                                           | Paquetes compartidos (`ui`, `types`, `skill-framework`, `db-client`); builds cacheados                                     |
| D9  | **dnd-kit para drag & drop** (no react-beautiful-dnd)                                  | Mantenido activamente, accesible, soporte touch, mejor API                                                                 |
| D10 | **shadcn/ui + Tailwind + Sora font**                                                   | Alineado a estética HR-tech del PRD; componentes copiados al repo (no dependencia externa)                                 |
| D11 | **2 ambientes desde día 1: dev / prod + Vercel Preview Deployments**                  | Requisito SRD §12; 2 proyectos Supabase (dev + prod); PRs generan preview automático apuntando a dev                      |
| D12 | **Claude Code GitHub Action para PR reviews automáticos**                              | Review automático en cada PR antes del merge                                                                               |
| D13 | **Zod para validación en runtime** (todo input de usuario y toda respuesta de IA)      | Seguridad de tipos extremo-a-extremo; protege contra prompt injection parcialmente                                         |
| D14 | **Branch protection en `main` + PRs obligatorios + CI verde**                          | No se puede pushear directo a `main`; cada PR requiere CI + 1 review                                                       |

---

## 3. Stack tecnológico

### 3.1 Frontend

| Componente             | Elección                                                        | Versión objetivo |
| ---------------------- | --------------------------------------------------------------- | ---------------- |
| Framework              | Next.js (App Router)                                            | 15.x             |
| Lenguaje               | TypeScript (strict mode)                                        | 5.x              |
| UI kit                 | shadcn/ui (copy-paste, no npm)                                  | last             |
| Estilos                | Tailwind CSS                                                    | 4.x              |
| Tipografía             | Sora (Google Fonts, self-hosted via `next/font`)                | -                |
| Drag & drop            | @dnd-kit/core + @dnd-kit/sortable                               | last             |
| Forms                  | react-hook-form + zod resolver                                  | last             |
| State (client)         | Zustand (solo donde RSC no alcanza)                             | last             |
| Data fetching (client) | TanStack Query (solo para cliente-lado; por default usamos RSC) | last             |
| Animaciones            | Framer Motion (para card flip, transiciones de SkillBoard)      | last             |
| Charts                 | Recharts (radar, barras para dashboards)                        | last             |
| Tests                  | Vitest + React Testing Library + Playwright                     | last             |

### 3.2 Backend

| Componente             | Elección                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| Base de datos          | Supabase Postgres 15+                                              |
| Auth                   | Supabase Auth (email/password + Google OAuth + magic links)        |
| RLS                    | Postgres Row Level Security (policies por rol)                     |
| Storage                | Supabase Storage (para PDFs exportados, avatares)                  |
| Edge Functions         | Deno (para webhooks, envío de emails, orquestación IA server-side) |
| ORM/Query builder      | Supabase JS client + tipos generados con `supabase gen types`      |
| Migrations             | Supabase CLI (`supabase migration new`)                            |
| Emails transaccionales | Resend (integración con Edge Functions)                            |

### 3.3 IA

| Componente                                                                    | Elección                                                                              |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Proveedor                                                                     | Anthropic                                                                             |
| SDK                                                                           | `@anthropic-ai/sdk`                                                                   |
| Modelo default (chat, sugerencias)                                            | `claude-haiku-4-5` ($1 in / $5 out por MTok)                                          |
| Modelo complejo (skillset inicial desde descripción de rol, planes de acción) | `claude-sonnet-4-6` ($3 in / $15 out por MTok)                                        |
| Modelo reservado Fase 2 (orquestación de evaluaciones complejas)              | `claude-opus-4-7` (el más capaz)                                                      |
| Patrón                                                                        | Streaming por default para chatbots; no-stream para sugerencias estructuradas con Zod |
| Caching                                                                       | Prompt caching en system prompts largos (90% ahorro en cache hits)                    |

**Regla:** nunca pasar datos personales identificables a la IA; siempre usar IDs anonimizados cuando el contenido se persiste (SRD §11).

### 3.4 Infra y DevOps

| Componente         | Elección                                           |
| ------------------ | -------------------------------------------------- |
| Hosting frontend   | Vercel (2 envs: dev/prod + Preview Deployments)    |
| Hosting DB/backend | Supabase Cloud (2 proyectos: dev + prod)           |
| CI/CD              | GitHub Actions                                     |
| PR review IA       | Claude Code GitHub Action                          |
| Observabilidad     | Vercel Analytics + Sentry + Supabase logs          |
| Feature flags      | Tabla `feature_flags` + helper `useFeatureFlag()`  |
| Secrets            | Vercel env vars + Supabase secrets (nunca en repo) |

### 3.5 Testing

| Capa                 | Herramienta                                          | Target                                            |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| Unit                 | Vitest                                               | ≥70% cobertura en utils, validators, domain logic |
| Component            | Vitest + Testing Library                             | Componentes críticos (SkillBoard, forms)          |
| Integration (DB/RLS) | Vitest + Supabase local                              | 100% de RLS policies deben tener test             |
| E2E                  | Playwright                                           | 1 flujo E2E por rol + flujo crítico de SkillBoard |
| Visual               | Playwright snapshots (solo dashboards y SkillBoards) | Opcional, post MVP si hay tiempo                  |

---

## 4. Estructura del monorepo

```
skillset360/
├── apps/
│   └── web/                          # Next.js app (única app en Fase 1)
│       ├── app/
│       │   ├── (public)/             # Landing, signup, login
│       │   ├── (auth)/               # Flujos post-login, onboarding
│       │   ├── (professional-dev)/   # Dashboard Profesional desarrollo
│       │   ├── (professional-sel)/   # Dashboard Profesional selección
│       │   ├── (coach)/              # Dashboard Coach + SkillBoards
│       │   ├── (selector)/           # Dashboard Seleccionador + SkillBoards
│       │   ├── (admin)/              # Panel administrador Skillset360
│       │   ├── (external)/           # Magic link forms (terceros)
│       │   └── api/                  # Route handlers (webhooks, IA streaming)
│       ├── components/
│       ├── lib/
│       │   ├── supabase/             # Clientes (server, client, service)
│       │   ├── ai/                   # Wrappers Anthropic
│       │   ├── auth/                 # Helpers de sesión
│       │   └── rbac/                 # Helpers de autorización (defensa en profundidad)
│       └── tests/
│           └── e2e/                  # Playwright
├── packages/
│   ├── ui/                           # shadcn components compartidos + Sora font
│   ├── types/                        # Tipos TS compartidos (DB, dominio)
│   ├── skill-framework/              # Seed data de skills, dims, niveles
│   ├── skillboard-templates/         # Componentes React de templates
│   │   ├── src/
│   │   │   ├── _contract/            # Interface SkillBoardTemplate
│   │   │   ├── development/          # Templates para desarrollo
│   │   │   ├── selection/            # Templates para selección
│   │   │   └── shared/               # Componentes comunes (Drag&Drop grid, Card, etc.)
│   │   └── registry.ts               # Registro de templates → id: component
│   ├── config/                       # Config compartida (eslint, tsconfig, tailwind)
│   └── validators/                   # Schemas Zod compartidos
├── supabase/
│   ├── migrations/                   # SQL migrations versionadas
│   ├── seed.sql                      # Seed mínimo para dev
│   └── functions/                    # Edge Functions (Deno)
├── .github/
│   └── workflows/                    # CI, PR reviews IA, deploys
├── docs/
│   ├── CLAUDE.md                     # Fuente de verdad para Claude Code (ambos devs)
│   ├── ARCHITECTURE.md
│   ├── RBAC.md
│   ├── SKILLBOARD_TEMPLATES.md
│   └── WORKFLOW.md                   # Git worktrees, PRs, convenciones
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Principios del monorepo:**

- Cada `package` puede ser desarrollado de forma independiente y tiene sus propios tests
- Cambios en `packages/types` o `packages/validators` disparan rebuild de todo lo que importa
- `packages/skillboard-templates` es el único lugar donde se definen templates; nada de templates inline en la app

---

## 5. Modelo de datos (schema inicial)

Schema base para Fase 1. Cada tabla tiene `id uuid PK`, `created_at`, `updated_at` implícitos (omitidos del listado).

### 5.1 Identidad y acceso

```sql
-- Profiles: extiende auth.users de Supabase con metadata de negocio
profiles (
  id uuid PK REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  primary_role text NOT NULL,  -- 'admin' | 'coach' | 'selector' | 'professional_dev' | 'professional_sel'
  status text NOT NULL DEFAULT 'active',  -- 'active' | 'suspended' | 'archived'
  metadata jsonb DEFAULT '{}'
)

-- Un usuario puede tener múltiples roles (Coach + Seleccionador con una licencia)
user_roles (
  user_id uuid REFERENCES profiles(id),
  role text NOT NULL,
  granted_by uuid REFERENCES profiles(id),
  granted_at timestamptz,
  PRIMARY KEY (user_id, role)
)

-- Licencias (Fase 1: creadas manualmente por Admin; Fase 2: Stripe)
licenses (
  id uuid PK,
  user_id uuid REFERENCES profiles(id),
  plan text NOT NULL,            -- 'coach_monthly' | 'selector_monthly' | etc.
  status text NOT NULL,          -- 'active' | 'cancelled' | 'expired'
  starts_at timestamptz,
  ends_at timestamptz,
  stripe_subscription_id text,   -- NULL en Fase 1
  metadata jsonb
)
```

### 5.2 Relaciones (Coach↔Profesional, Seleccionador↔Candidato)

```sql
coach_professional_links (
  id uuid PK,
  coach_id uuid REFERENCES profiles(id),
  professional_id uuid REFERENCES profiles(id),
  status text NOT NULL DEFAULT 'active',  -- 'active' | 'archived'
  invited_at timestamptz,
  accepted_at timestamptz,
  UNIQUE(coach_id, professional_id)
)

selection_processes (
  id uuid PK,
  selector_id uuid REFERENCES profiles(id),
  role_name text NOT NULL,
  seniority text,
  industry text,
  context text,
  status text NOT NULL,  -- 'skills_definition' | 'assessments_assigned' | ... | 'closed'
  created_at timestamptz
)

process_candidates (
  id uuid PK,
  process_id uuid REFERENCES selection_processes(id),
  candidate_id uuid REFERENCES profiles(id),
  status text NOT NULL,  -- 'invited' | 'assessment_pending' | 'completed' | 'archived'
  invited_at timestamptz,
  UNIQUE(process_id, candidate_id)
)
```

### 5.3 Framework de skills

```sql
dimensions (
  id uuid PK,
  slug text UNIQUE NOT NULL,  -- 'inner_compass' | 'collaborative_synergy' | ...
  name text NOT NULL,
  description text,
  sort_order int,
  is_archived boolean DEFAULT false
)

skills (
  id uuid PK,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  dimension_id uuid REFERENCES dimensions(id),
  description text,
  is_archived boolean DEFAULT false
)

skill_levels (
  id uuid PK,
  skill_id uuid REFERENCES skills(id),
  level int NOT NULL CHECK (level BETWEEN 1 AND 5),
  observable_behaviors text,  -- visible solo para Coach/Selector
  UNIQUE(skill_id, level)
)
```

### 5.4 SkillBoards

```sql
-- Registro de templates disponibles (sincronizado con packages/skillboard-templates/registry.ts)
skillboard_templates (
  id uuid PK,
  template_key text UNIQUE NOT NULL,  -- coincide con registry.ts
  name text NOT NULL,
  description text,
  process_type text,        -- 'development' | 'selection' | 'coaching' | ...
  participation_mode text,  -- 'individual' | '1on1' | 'team' | 'multilevel'
  process_moment text,
  scope text,
  estimated_time text,
  output_depth text,
  instructions_md text,     -- contenido del panel de instrucciones
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id)
)

-- Instancia ejecutada de un SkillBoard
skillboards (
  id uuid PK,
  template_key text REFERENCES skillboard_templates(template_key),
  owner_id uuid REFERENCES profiles(id),  -- Coach o Seleccionador
  target_type text NOT NULL,              -- 'professional' | 'selection_process'
  target_id uuid NOT NULL,                -- FK polimórfica (enforzada vía trigger)
  status text NOT NULL,                    -- 'draft' | 'in_progress' | 'closed'
  state jsonb NOT NULL DEFAULT '{}',       -- estado del template (flexible)
  closed_at timestamptz
)

-- Outputs estructurados generados al cerrar un SkillBoard
skillboard_outputs (
  id uuid PK,
  skillboard_id uuid REFERENCES skillboards(id),
  output_type text NOT NULL,   -- 'prioritized_skills' | 'target_levels' | 'actions' | 'insights'
  data jsonb NOT NULL
)

-- Participaciones asincrónicas (Profesional completa inputs en un SkillBoard del Coach)
skillboard_participations (
  id uuid PK,
  skillboard_id uuid REFERENCES skillboards(id),
  participant_id uuid REFERENCES profiles(id),
  status text NOT NULL,        -- 'pending' | 'in_progress' | 'submitted'
  inputs jsonb DEFAULT '{}',
  submitted_at timestamptz
)

-- Magic links para terceros (no requieren auth)
external_form_links (
  id uuid PK,
  token text UNIQUE NOT NULL,           -- random 32 bytes
  skillboard_id uuid REFERENCES skillboards(id),
  form_schema jsonb NOT NULL,           -- definición del formulario
  expires_at timestamptz NOT NULL,
  used_at timestamptz,                  -- NULL hasta que se envía
  submitted_data jsonb,
  created_by uuid REFERENCES profiles(id)
)
```

### 5.5 Objetivos, habilidades priorizadas y planes de acción

```sql
development_goals (
  id uuid PK,
  professional_id uuid REFERENCES profiles(id),
  coach_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  horizon text,
  context text,
  priority int,  -- para drag&drop ordering
  created_at timestamptz
)

-- Habilidades priorizadas por un SkillBoard para un profesional o proceso
assigned_skills (
  id uuid PK,
  source_skillboard_id uuid REFERENCES skillboards(id),
  assignee_type text NOT NULL,   -- 'professional' | 'candidate_in_process'
  assignee_id uuid NOT NULL,
  skill_id uuid REFERENCES skills(id),
  target_level int CHECK (target_level BETWEEN 1 AND 5),
  min_level int CHECK (min_level BETWEEN 1 AND 5),  -- solo selección
  category text,  -- 'critical' | 'desirable' | 'differentiating' (solo selección)
  assessment_status text DEFAULT 'pending'  -- 'pending' | 'in_progress' | 'evaluated' | 're_evaluation'
)

action_items (
  id uuid PK,
  source_skillboard_id uuid REFERENCES skillboards(id),
  professional_id uuid REFERENCES profiles(id),
  skill_id uuid REFERENCES skills(id),
  description text NOT NULL,
  responsible text,
  timeframe text,
  notes text,
  status text NOT NULL DEFAULT 'in_progress',  -- 'in_progress' | 'done' | 'delegated' | 'dismissed'
  created_at timestamptz
)
```

### 5.6 Evaluaciones (mockup en Fase 1)

```sql
-- En Fase 1: solo para trackear asignaciones y estados UX, sin scoring
assessment_assignments (
  id uuid PK,
  assigned_by uuid REFERENCES profiles(id),  -- Coach o Selector
  assignee_id uuid REFERENCES profiles(id),  -- Profesional o Candidato
  skill_id uuid REFERENCES skills(id),
  context_type text NOT NULL,  -- 'development' | 'selection'
  context_id uuid,             -- skillboard_id o process_id
  status text NOT NULL DEFAULT 'pending',  -- 'pending' | 'in_progress' | 'completed_mock'
  assigned_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz
)

-- Regla de unicidad: enforced por trigger, no por constraint (más legible en errores)
-- - 1 sola evaluación 'in_progress' por assignee_id
-- - Max 2 por (assignee_id, skill_id) en rolling 6 meses
-- - Override: Coach puede bypass con action explícita (registrada en audit)
```

### 5.7 Auditoría, feature flags, notificaciones

```sql
audit_log (
  id uuid PK,
  actor_id uuid REFERENCES profiles(id),
  actor_role text,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  ip inet,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
)

feature_flags (
  key text PK,
  enabled boolean NOT NULL DEFAULT false,
  rollout_percentage int DEFAULT 0,
  description text,
  updated_by uuid,
  updated_at timestamptz
)

notifications (
  id uuid PK,
  user_id uuid REFERENCES profiles(id),
  type text NOT NULL,
  title text,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz
)
```

**Notas importantes sobre el schema:**

- Toda tabla con datos de usuario tiene RLS habilitado (ver §6)
- `metadata jsonb` está presente en varias tablas como escape hatch, pero cualquier dato crítico debe tener su propia columna
- Los triggers de `updated_at` se aplican a TODAS las tablas via migration compartida
- El schema se versiona con `supabase migration new` — nunca editar desde la UI

---

## 6. RBAC con Supabase RLS

### 6.1 Principio rector

**Supabase RLS es la fuente de verdad para autorización.** Si una query al cliente de Supabase retorna datos, el usuario tiene permiso para verlos. Si retorna vacío, no lo tiene. Nunca se debe confiar en que la UI oculte datos — la UI es secundaria.

**Middleware de Next.js es defensa en profundidad**, no autorización primaria. El middleware redirige a login si no hay sesión y a `/403` si el `primary_role` no está habilitado para la ruta, pero las policies de RLS son quienes impiden la fuga de datos.

### 6.2 Roles canónicos

```
admin              → acceso total (políticas bypass con claim `admin_bypass`)
coach              → ve solo sus profesionales vinculados
selector           → ve solo sus procesos de selección
professional_dev   → ve solo su propia data
professional_sel   → ve solo sus evaluaciones asignadas
external           → acceso por magic link, solo al form específico
```

### 6.3 Patrones de policies

**Patrón 1 — "Eres el dueño" (profiles, development_goals, etc.):**

```sql
CREATE POLICY "owner_select" ON table_x
  FOR SELECT USING (user_id = auth.uid());
```

**Patrón 2 — "Coach ve a sus profesionales":**

```sql
CREATE POLICY "coach_views_his_professionals_skills" ON assigned_skills
  FOR SELECT USING (
    assignee_type = 'professional'
    AND EXISTS (
      SELECT 1 FROM coach_professional_links
      WHERE coach_id = auth.uid()
        AND professional_id = assigned_skills.assignee_id
        AND status = 'active'
    )
  );
```

**Patrón 3 — "Seleccionador ve solo sus procesos":**

```sql
CREATE POLICY "selector_views_own_processes" ON selection_processes
  FOR ALL USING (selector_id = auth.uid());
```

**Patrón 4 — "Admin bypass" (en TODAS las tablas):**

```sql
CREATE POLICY "admin_full_access" ON table_x
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
```

**Patrón 5 — "Magic link externo" (no auth, uso de función custom):**

```sql
-- El cliente envía el token en header; una función PL/pgSQL valida y retorna filas
CREATE FUNCTION get_external_form(p_token text) RETURNS TABLE (...) AS $$
  -- valida expires_at, used_at, y retorna el form_schema
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6.4 Testing de RLS (obligatorio)

Cada policy debe tener un test en `apps/web/tests/rls/*.test.ts` que:

1. Crea usuarios de prueba con distintos roles
2. Intenta SELECT/INSERT/UPDATE/DELETE como cada rol
3. Verifica que los resultados coincidan con la policy esperada
4. **Un PR que agregue tabla sin test RLS NO se mergea.**

Ver §15 para detalles de la infra de testing con Supabase local.

### 6.5 Claims y JWT

- `auth.uid()` → lo provee Supabase automáticamente
- Custom claims para `primary_role` y roles múltiples → se inyectan en un hook de Supabase (`auth.jwt()`) al login
- El frontend lee el rol desde el JWT, no desde la DB, para decisiones de UI

---

## 7. Estrategia de IA

### 7.1 Matriz de uso de modelos (Fase 1)

| Caso de uso                                                      | Modelo              | Streaming              | Razón                                         |
| ---------------------------------------------------------------- | ------------------- | ---------------------- | --------------------------------------------- |
| Chatbot contextual en dashboard (Coach/Selector)                 | `claude-haiku-4-5`  | Sí                     | Volumen alto, respuestas cortas, bajo costo   |
| Chatbot contextual para Profesional                              | `claude-haiku-4-5`  | Sí                     | Idem                                          |
| Sugerencia de skillset desde descripción de rol (Selector)       | `claude-sonnet-4-6` | No (JSON estructurado) | Requiere razonamiento + output tipado con Zod |
| Generación de plan de acción a partir de habilidades priorizadas | `claude-sonnet-4-6` | No                     | Output estructurado                           |
| Panel de instrucciones dinámico en SkillBoard                    | `claude-haiku-4-5`  | Sí                     | UX conversacional                             |
| Resumen de SkillBoard para output final                          | `claude-sonnet-4-6` | No                     | Calidad narrativa importa                     |
| Reservado Fase 2: roleplays, evaluaciones complejas              | `claude-opus-4-7`   | Stream                 | Máximo razonamiento                           |

### 7.2 Arquitectura IA

```
Cliente (Next.js RSC/Client)
    ↓
Route Handler /api/ai/* (Next.js)
    ↓
Valida sesión + rate limit + anonimiza datos
    ↓
Llamada a Anthropic SDK (streaming o no)
    ↓
Zod.parse() en respuesta si es structured output
    ↓
Persistencia (si aplica) + audit log
```

### 7.3 Reglas duras para IA

1. **Nunca** enviar nombres, emails, teléfonos, o cualquier PII a Anthropic. Reemplazar con IDs opacos (`user_abc123`, `skill_xyz`) antes del prompt.
2. **Siempre** validar respuestas con Zod cuando se espera JSON. Si falla el parse, reintentar con un prompt explícito de "devolvé solo JSON válido con este schema" o caer en un default seguro.
3. **Prompt caching** en system prompts que sean > 1024 tokens (descripciones del framework, instrucciones del rol, etc.). Ahorro ~90%.
4. **Rate limit por usuario** en Edge (ej: 30 mensajes de chatbot por hora, 5 generaciones de skillset por día). Tabla `ai_usage_quotas`.
5. **Audit log** de cada llamada a IA: user_id, model, input_tokens, output_tokens, latency, feature (para trackear COGS y patrones).
6. **Kill switch** por feature flag: `ai_chatbot_enabled`, `ai_skillset_suggestion_enabled`. Si falla Anthropic, se apaga el feature sin deployar.

### 7.4 Prompts base (templates)

Los prompts viven en `apps/web/lib/ai/prompts/` como archivos `.ts` que exportan funciones builder. Cada prompt tiene:

- `systemPrompt: string` (cacheable)
- `buildUserMessage(input): string` (no cacheable)
- `outputSchema: ZodSchema` (si aplica)
- `model: 'haiku' | 'sonnet' | 'opus'`
- `temperature, max_tokens`

---

## 8. Estrategia de colaboración: worktrees, branches, PRs

### 8.1 Modelo de branching

```
main              ← prod, protegido, solo via PR con CI verde + 1 review
  ↑
develop           ← integración/preview, protegido, solo via PR → despliega a env dev
  ↑
feat/<epic>-<short-desc>   ← feature branches cortos
fix/<issue>
chore/<desc>
```

- **Ningún push directo a `main` ni a `develop`.**
- PRs de `feat/*` → `develop`. Merge a `main` se hace por "release PR" semanal (o antes si hay hotfix).
- Cada PR debe ser chico (<400 líneas de diff idealmente) y atomic.

### 8.2 Git worktrees para paralelización

Cada dev mantiene múltiples worktrees locales para trabajar en varias features sin cambios de contexto:

```bash
# Setup inicial (una vez)
git clone <repo> skillset360-main
cd skillset360-main
git worktree add ../skillset360-feat-auth feat/auth
git worktree add ../skillset360-feat-skillboard feat/skillboard-drag-drop
```

Cada worktree tiene su propia instancia de Claude Code abierta. Esto permite que un dev trabaje en dos features en paralelo sin stashes ni merges innecesarios.

### 8.3 Reglas de merge y conflictos

- **Antes de abrir PR:** rebase sobre `develop` (`git rebase origin/develop`)
- **Conflictos de schema:** si dos devs tocan migrations, el que mergea segundo renombra su migration con un timestamp posterior
- **Conflictos de `registry.ts` (templates):** es un archivo particionado por exports; cada template tiene su propio archivo y se registra en el index, minimizando colisiones
- **Ownership soft de archivos:** CODEOWNERS lista qué áreas del repo tiende a tocar cada dev, pero no es bloqueante

### 8.4 PR workflow

1. Dev abre PR de `feat/*` → `develop`
2. CI corre: lint + type-check + unit tests + integration tests + e2e smoke
3. Claude Code GitHub Action hace review automático (comentarios inline)
4. Otro dev hace review humano
5. Si todo verde + 1 approval → se mergea con squash
6. Preview deploy automático en cada PR (Vercel, apunta a Supabase dev)
7. Deploy a env dev al mergear a `develop`; deploy a prod al mergear a `main` (release PR)

### 8.5 Convención de commits

Conventional Commits:

```
feat(auth): add google sign-in for coaches
fix(skillboard): prevent drag of disabled cards
chore(deps): bump tailwind to 4.1
test(rls): add tests for coach_views_professionals
docs(plan): update roadmap for week 4
```

---

## 9. Bloque 0: Setup de tooling

**Duración estimada:** 3-4 días antes de escribir código de features. Este bloque es **BLOQUEANTE** para todo lo demás.

### 9.1 Tareas de setup

| #    | Tarea                                                                                    | DoD                                                                                  | Dependencias         |
| ---- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------- |
| 0.1  | Resolver instalación de Superpowers en Claude Code v2.1.84                               | Comando `/plugin install` funciona o se documenta el método alternativo (MCP server) | -                    |
| 0.2  | Instalar y configurar MCPs: Context7, GitHub, Supabase, Playwright, Taskmaster AI        | Cada MCP aparece en `/mcp list` y responde a un comando básico                       | 0.1                  |
| 0.3  | Crear organización GitHub + repo + branch protection rules                               | `main` y `develop` protegidos, CODEOWNERS configurado                                | -                    |
| 0.4  | Configurar Claude Code GitHub Action para PR reviews                                     | Un PR de prueba recibe review automático                                             | 0.3                  |
| 0.5  | Crear 2 proyectos Supabase (dev, prod)                                                   | URLs y keys documentados en 1Password / Bitwarden                                    | -                    |
| 0.6  | Crear proyecto Vercel con 2 environments (develop→dev, main→prod) + Preview Deployments  | Preview deploy funciona en un PR de prueba; PRs apuntan a Supabase dev               | 0.3, 0.5             |
| 0.7  | Scaffolding del monorepo (Turborepo + pnpm)                                              | `pnpm install` + `pnpm dev` levantan la app con página "Hello"                       | 0.3                  |
| 0.8  | Configurar ESLint, Prettier, TypeScript strict, Husky, lint-staged                       | Pre-commit falla si hay errores de lint/type                                         | 0.7                  |
| 0.9  | Configurar Tailwind 4 + shadcn/ui + Sora font                                            | Componente Button renderiza con estilo correcto                                      | 0.7                  |
| 0.10 | Configurar Supabase CLI + primera migration (profiles)                                   | `supabase db push` funciona contra dev; tipos generados en `packages/types`          | 0.5, 0.7             |
| 0.11 | Configurar Vitest (unit + integration) + Playwright (e2e)                                | Tests de ejemplo pasan en CI                                                         | 0.7, 0.8             |
| 0.12 | Configurar GitHub Actions CI: lint, type-check, test, build                              | PR de prueba corre los 4 jobs en paralelo y pasa                                     | 0.7, 0.8, 0.11       |
| 0.13 | Setup de Sentry + logging básico                                                         | Errores en dev aparecen en dashboard Sentry                                          | 0.7                  |
| 0.14 | Crear `docs/CLAUDE.md` compartido con convenciones                                       | Archivo presente, linkeado desde README, revisado por ambos devs                     | Todas las anteriores |
| 0.15 | Documentar workflow de git worktrees en `docs/WORKFLOW.md`                               | Ambos devs configuran worktrees siguiendo la guía                                    | 0.3                  |
| 0.16 | Cuentas Anthropic + Resend + Sentry con límites de spending                              | API keys en env vars; spending cap configurado                                       | -                    |

### 9.2 CLAUDE.md (contenido mínimo)

El archivo `docs/CLAUDE.md` es la **fuente de verdad compartida** para las instancias de Claude Code de ambos devs. Contiene:

```markdown
# CLAUDE.md — Skillset360°

## Contexto del producto

(resumen del §1 de este plan, versión condensada)

## Stack

(resumen del §3)

## Convenciones de código

- TypeScript strict, sin `any` salvo en wrappers a libs externas
- Todo mutación server: Server Action (no route handler salvo streaming IA / webhooks)
- Todo input validado con Zod
- Nunca usar `supabase.auth.admin` desde el cliente
- Nunca editar schema desde la UI de Supabase; siempre via migration

## Reglas RLS

(resumen del §6.3, patrones 1-5)

## Flujo git

(resumen del §8)

## Comandos frecuentes

pnpm dev, pnpm test, pnpm supabase start, supabase migration new, etc.

## Cosas que NO se hacen nunca

- Exponer service_role key al cliente
- Usar localStorage para tokens (Supabase maneja cookies HttpOnly)
- Introducir libs nuevas sin PR aprobado (evitar bloat)
- Commits directos a main/develop
```

---

## 10. Roadmap por épicas

### 10.1 Mapa de épicas

| #       | Épica                                                                                  | Bloque             | Semana target     | Dependencias duras |
| ------- | -------------------------------------------------------------------------------------- | ------------------ | ----------------- | ------------------ |
| **E0**  | Setup de tooling                                                                       | 0                  | 1                 | —                  |
| **E1**  | Esqueleto del monorepo + landing pública                                               | Fundación          | 1                 | E0                 |
| **E2**  | Auth + onboarding (email/password, Google OAuth, magic links)                          | Fundación          | 1-2               | E0, E1             |
| **E3**  | Schema DB base + migrations + RLS policies core                                        | Fundación          | 1-2               | E0                 |
| **E4**  | RBAC: middleware + helpers + testing infra                                             | Fundación          | 2                 | E2, E3             |
| **E5**  | Framework de Skills: seed + CRUD Admin                                                 | Framework          | 2-3               | E3, E4             |
| **E6**  | Design system + Skill Cards + Skill Library                                            | UI core            | 2-3               | E1, E5             |
| **E7**  | Dashboards base por rol (shells vacíos con navegación)                                 | UI core            | 3                 | E4, E6             |
| **E8**  | Gestión de relaciones (Coach↔Profesional, Selector↔Proceso)                            | Relaciones         | 3-4               | E4, E7             |
| **E9**  | Motor de SkillBoards: contrato, runtime, estado, persistencia                          | SkillBoards        | 3-4               | E4, E5             |
| **E10** | Template 1: Diagnóstico inicial de habilidades (Desarrollo, 1:1)                       | SkillBoards        | 4-5               | E9                 |
| **E11** | Template 2: Definición de skillset para rol (Selección)                                | SkillBoards        | 4-5               | E9                 |
| **E12** | Template 3: Priorización de objetivos de desarrollo (asíncrono, Profesional participa) | SkillBoards        | 5-6               | E9, E10            |
| **E13** | Magic links + formularios externos (terceros)                                          | SkillBoards        | 5-6               | E9                 |
| **E14** | Outputs estructurados: habilidades priorizadas, niveles objetivo, acciones             | SkillBoards        | 5-6               | E9, E10, E11       |
| **E15** | Plan de acción: creación, estados, seguimiento                                         | Output/Seguimiento | 5-6               | E14                |
| **E16** | Objetivos de desarrollo (CRUD, drag&drop ordering)                                     | Output/Seguimiento | 6                 | E7                 |
| **E17** | Evaluaciones mockup: shell navegable por rol                                           | Evaluaciones       | 6-7               | E7, E14            |
| **E18** | Reglas de evaluación (1 activa, 2 en 6m, override Coach)                               | Evaluaciones       | 6-7               | E17                |
| **E19** | IA: chatbot contextual en dashboards                                                   | IA                 | 5-7 (incremental) | E7                 |
| **E20** | IA: sugerencia de skillset desde descripción de rol                                    | IA                 | 6-7               | E11                |
| **E21** | IA: generación de plan de acción                                                       | IA                 | 6-7               | E14, E15           |
| **E22** | Dashboards completos con data real (radar placeholder, estados)                        | UI polish          | 7                 | E14, E15, E17      |
| **E23** | Admin panel completo (templates, usuarios, licencias manuales, supervisión)            | Admin              | 6-7               | E5, E9             |
| **E24** | Auditoría y trazabilidad                                                               | Cross-cutting      | 7                 | E3 en adelante     |
| **E25** | Feature flags runtime                                                                  | Cross-cutting      | 2 en adelante     | E3                 |
| **E26** | Emails transaccionales (invitaciones, magic links, bajas)                              | Cross-cutting      | 4-7               | E2, E13            |
| **E27** | Landing comercial + signup self-service (sin pagos)                                    | Comercial          | 7                 | E2, E5             |
| **E28** | Hardening: rate limits, bot protection, accessibility, mobile                          | Hardening          | 8                 | Todas las de UI    |
| **E29** | QA completo + bugfixing + UAT con 2-3 coaches reales                                   | QA                 | 8                 | Todas              |

### 10.2 Tracks de trabajo en paralelo

Agrupo las épicas en **tracks** que pueden avanzar en paralelo con mínima fricción entre devs.

- **Track A — Fundación y plataforma:** E0, E1, E2, E3, E4, E25, E24 (cross-cutting), E27
- **Track B — Framework y contenido:** E5, E6, E23 (partes), E26
- **Track C — Motor de SkillBoards y templates:** E9, E10, E11, E12, E13, E14
- **Track D — Output, seguimiento, evaluaciones:** E15, E16, E17, E18, E22
- **Track E — IA:** E19, E20, E21
- **Track F — Polish y hardening:** E28, E29

**Propuesta de reparto (sin asignar nombres):**

- **Dev 1:** Track A → Track B (parcial) → Track F
- **Dev 2:** Track C → Track D → Track F
- **Dev 3 (si existe):** Track E → Track B (parcial) → Track D (parcial) → Track F

Las dependencias duras entre tracks están marcadas explícitamente en §12.

---

## 11. Épicas detalladas

> **Formato:** Cada épica incluye: objetivo, user stories con criterios de aceptación, tasks técnicas, tests requeridos, definition of done.

---

### Épica E0 — Setup de tooling

**Objetivo:** Dejar el entorno de desarrollo listo para que 2-3 devs puedan trabajar en paralelo sin fricciones.

**Stories:** ver §9 (tareas 0.1 a 0.16). No se detallan aquí porque son tareas de infraestructura, no features de producto.

**DoD:**

- Ambos devs pueden clonar el repo, correr `pnpm install && pnpm dev` y ver la app
- Un PR de prueba desde una rama `feat/smoke-test` pasa CI + recibe review IA automática
- `supabase start` levanta entorno local
- Tests de ejemplo (unit, integration, e2e) pasan en local y en CI
- `docs/CLAUDE.md` existe y está revisado por ambos

---

### Épica E1 — Esqueleto del monorepo + landing pública

**Objetivo:** Tener el scaffolding del proyecto con una landing mínima accesible públicamente.

**Stories:**

**E1.1 — Monorepo configurado**

- Como dev, puedo correr `pnpm dev` en la raíz y levantar `apps/web` con hot reload
- `packages/ui`, `packages/types`, `packages/validators`, `packages/skill-framework`, `packages/skillboard-templates` existen como paquetes vacíos con su propio `package.json`
- Turbo pipeline configurado: `build`, `dev`, `lint`, `test`, `type-check`

**E1.2 — Landing pública mínima**

- Como visitante, puedo ver `/` con el nombre Skillset360°, un hero, y botones "Ingresar" / "Registrarme"
- La página está en SSG (no requiere DB)
- Usa tipografía Sora y la paleta de Upskill Labs (colores a definir en `packages/ui/src/tokens.ts`)
- Accessible: navegable por teclado, contraste WCAG AA, meta tags OG

**E1.3 — Health check**

- Ruta `/api/health` retorna `{ status: 'ok', timestamp, version }`
- Se usa por Vercel y para smoke tests de CI

**Tasks técnicas:**

1. `turbo.json` con pipeline
2. `tsconfig.base.json` en root, extendido por cada paquete
3. `packages/ui` con `Button`, `Card`, `Input` de shadcn/ui inicial
4. `packages/ui/src/tokens.ts` con paleta + tipografía Sora via `next/font`
5. `apps/web/app/layout.tsx` con font loader, HTML lang="es", metadatos
6. `apps/web/app/(public)/page.tsx` con landing
7. `apps/web/app/api/health/route.ts`

**Tests:**

- Unit: `Button` renderiza con variants correctos
- E2E: `/` carga, muestra "Skillset360°", tiene botones "Ingresar" y "Registrarme"
- E2E: `/api/health` retorna 200 con shape correcto

**DoD:**

- Deploy preview en Vercel para un PR de prueba funciona
- Lighthouse score >90 en performance/accessibility/SEO para `/`
- Código mergeado a `develop`

---

### Épica E2 — Auth + onboarding

**Objetivo:** Usuarios pueden registrarse (por ahora, con flag de "usuario principal" → Coach/Selector, o por invitación), iniciar sesión, y completar un onboarding mínimo.

**Stories:**

**E2.1 — Sign-up con email + contraseña**

- Como visitante, puedo registrarme en `/signup` con email + contraseña
- Si el email ya existe, veo mensaje claro ("Ya tenés cuenta, inicia sesión")
- Validaciones client + server (email válido, password ≥ 8 chars con regla de complejidad)
- Recibo email de verificación (Supabase Auth default)
- Al confirmar, se me redirige a onboarding
- **Rol asignado al signup directo:** ninguno por default; el onboarding pregunta si es Coach o Selector (y en Fase 2 esto define qué plan contrata). En Fase 1, ambos roles están disponibles.

**E2.2 — Sign-up con Google OAuth**

- Como visitante, puedo "Continuar con Google" en `/signup` y `/login`
- Al retornar de Google, se crea el profile automáticamente con nombre + avatar

**E2.3 — Login**

- Como usuario existente, puedo iniciar sesión en `/login`
- Soporta email+password y Google
- Rate limit: max 5 intentos fallidos por IP en 15 min (devuelve 429)
- Al loguear, se me redirige a mi dashboard según `primary_role`

**E2.4 — Magic link (para invitaciones)**

- Como Coach, puedo invitar a un Profesional enviando magic link a su email
- El profesional recibe email → click → aterriza en flujo de onboarding específico para Profesional
- El magic link es uso único, expira en 30 días (por SRD §7)
- Reintentos: si el link ya se usó, muestra mensaje "Este link ya fue utilizado. Iniciá sesión normalmente."

**E2.5 — Onboarding por rol**

- Post-signup, el usuario ve un wizard de 3-4 pantallas con:
  - Bienvenida + explicación breve del producto
  - Copy específico por rol (Coach/Selector/Profesional/Candidato)
  - Selector de rol principal si aplica (solo en signup directo Coach/Selector)
  - CTA final → dashboard correspondiente
- Skippable pero se registra en `profiles.metadata.onboarding_completed = true`

**E2.6 — Logout**

- Link visible en menú de usuario
- Al hacer logout, se invalida la sesión y se redirige a `/`

**E2.7 — Reset de contraseña**

- Flujo estándar de Supabase: `/forgot-password` → email con link → `/reset-password`
- Rate limit: 3 pedidos por hora por email

**Tasks técnicas:**

1. Migración `profiles` + trigger que se dispara en `auth.users` insert para crear profile
2. Migración `user_roles`
3. `apps/web/lib/supabase/server.ts` (cliente server), `client.ts` (browser), `service.ts` (service_role, solo server)
4. Server Actions: `signUp`, `signIn`, `signInWithGoogle`, `signOut`, `requestMagicLink`, `requestPasswordReset`
5. Middleware de Next.js: refresco de sesión + redirect a login si no autenticado
6. Rutas: `/signup`, `/login`, `/onboarding`, `/forgot-password`, `/reset-password`, `/auth/callback`
7. Componente `<RoleGate role="..." />` para proteger subtrees del UI (defensa en profundidad)
8. Helper `getSession()` server-side con cache por request
9. Emails transaccionales configurados en Supabase dashboard (templates custom)

**Tests:**

- Unit: validadores Zod de signup/login
- Integration (con Supabase local): flujo completo signup → trigger → profile creado
- Integration: rate limit de login retorna 429 al 6to intento
- E2E: signup + email verification (mock) + login + dashboard redirect
- E2E: Google OAuth (con cuenta de test en Google)
- E2E: reset password end-to-end
- RLS test: un user no puede leer profile de otro user (excepto admin, coach→professional vinculado, etc.)

**DoD:**

- Los 5 roles pueden ser asignados (admin por seed, coach/selector por signup, professional_dev/sel por invitación de Coach/Selector respectivamente)
- Login + signup funciona en preview deploy
- Auditoría: eventos `user.signup`, `user.login`, `user.logout`, `user.password_reset` registrados en `audit_log`
- Tests unit + integration + e2e verdes en CI

---

### Épica E3 — Schema DB base + migrations + RLS policies core

**Objetivo:** Tener el schema de la DB versionado, tipado y con RLS aplicado a todas las tablas críticas.

**Stories:**

**E3.1 — Migrations iniciales**

- Como dev, las tablas del §5 existen como migrations SQL separadas por dominio (`001_profiles.sql`, `002_framework.sql`, `003_relationships.sql`, `004_skillboards.sql`, `005_assessments.sql`, `006_audit_flags.sql`)
- `supabase db reset` corre todas las migrations sin errores
- Trigger `updated_at` aplicado a todas las tablas

**E3.2 — Tipos generados**

- `packages/types/src/db.ts` contiene los tipos generados por `supabase gen types typescript`
- Script `pnpm types:gen` regenera los tipos contra el proyecto dev
- CI verifica que los tipos estén sincronizados con las migrations (si hay drift, falla)

**E3.3 — RLS habilitado en todas las tablas de usuario**

- RLS `ENABLED` en: `profiles`, `user_roles`, `licenses`, `coach_professional_links`, `selection_processes`, `process_candidates`, todas las de SkillBoards, goals, actions, assignments, audit_log, notifications
- Cada tabla tiene al menos una policy (no dejar tablas sin policies con RLS on, eso bloquea todo)

**E3.4 — Helper para tests de RLS**

- `apps/web/tests/rls/_helpers.ts` provee `createTestUser(role)`, `asUser(userId)`, `resetDb()`
- Corre contra Supabase local (`supabase start`)

**Tasks técnicas:**

1. Escribir las 6 migrations iniciales
2. Triggers: `updated_at`, `auto_create_profile_on_signup`
3. Policies según patrones de §6.3 para cada tabla
4. Script `types:gen` + workflow CI que lo verifica
5. Helpers de testing

**Tests:**

- Integration: `supabase db reset && pnpm test:rls` corre todos los tests de RLS contra DB limpia
- Para cada policy, al menos un caso "permitido" y un caso "denegado"

**DoD:**

- 100% de tablas con datos de usuario tienen RLS ON y policies
- `pnpm types:gen` produce tipos sin errores
- Tests de RLS pasan en CI
- `docs/RBAC.md` actualizado con tabla: tabla → roles → qué pueden hacer

---

### Épica E4 — RBAC: middleware + helpers + testing infra

**Objetivo:** Defensa en profundidad en la app Next.js, más la infraestructura para testear RLS de forma automatizada.

**Stories:**

**E4.1 — Middleware de autenticación y redirección por rol**

- `apps/web/middleware.ts` lee la sesión
- Si no hay sesión y ruta requiere auth → redirige a `/login?redirect=<ruta>`
- Si hay sesión pero el rol no matchea con el route group → redirige a dashboard correcto
- Rutas públicas (`/`, `/signup`, `/login`, `/external/*`) no requieren sesión

**E4.2 — Helper `requireRole()` en Server Components**

- `const session = await requireRole(['coach', 'admin'])`
- Si no matchea, tira 403 (renderiza página `/403`)

**E4.3 — Componente `<RoleGate>` en client**

- `<RoleGate roles={['coach']}>...</RoleGate>` oculta children si el rol no matchea
- Lee rol del JWT (no hace round-trip a DB)

**E4.4 — Testing infra para RLS**

- Scripts en `package.json`: `test:rls` (corre solo tests contra Supabase local)
- CI job separado para RLS tests (usa el action de Supabase)

**Tasks técnicas:**

1. `middleware.ts` con matcher correcto (no matchear `/api/health`, `/_next/*`, etc.)
2. `lib/auth/requireRole.ts`
3. `components/RoleGate.tsx`
4. Script `test:rls` con setup/teardown de DB local

**Tests:**

- Unit: `requireRole` con mocks de sesión
- Integration: tests E2E de redirección según rol
- Tests RLS: los patrones 1-4 de §6.3 tienen al menos 2 tests cada uno (permitido + denegado)

**DoD:**

- Un Coach no puede acceder a `/admin/*` (middleware redirige o 403)
- Un Profesional no puede leer habilidades de otro Profesional (RLS + UI)
- Tests de RLS + middleware pasan en CI

---

### Épica E5 — Framework de Skills: seed + CRUD Admin

**Objetivo:** Tener las 60-80 skills, 5 dimensiones y 5 niveles con comportamientos observables cargados, editables por Admin.

**Stories:**

**E5.1 — Seed inicial del framework**

- Al correr `supabase db seed`, se insertan las 5 dimensiones, las ~60-80 skills y sus 5 niveles con comportamientos observables
- El seed se carga desde `packages/skill-framework/src/seed.json` (estructurado)
- Admin puede re-ejecutar el seed para una skill sin duplicar

**E5.2 — Admin CRUD de Dimensiones**

- Admin ve lista de dimensiones en `/admin/framework/dimensions`
- Puede crear, editar, archivar (soft delete) una dimensión
- No puede eliminar una dimensión que tiene skills asociadas (hard rule)

**E5.3 — Admin CRUD de Skills**

- Admin ve tabla paginada en `/admin/framework/skills` con filtros por dimensión y búsqueda por nombre
- Click en skill → detalle con 5 niveles editables
- Puede crear nueva skill, editar, archivar
- Archive de skill la saca del flujo de asignación futura pero mantiene data histórica

**E5.4 — Admin CRUD de Niveles + Comportamientos Observables**

- Cada skill tiene exactamente 5 niveles
- Admin edita texto libre (markdown) del comportamiento observable por nivel
- Preview side-by-side (Coach view vs Professional view — este último no los ve)

**E5.5 — Exportar framework**

- Admin puede descargar el framework completo como JSON (backup + versionado externo)

**Tasks técnicas:**

1. `packages/skill-framework/src/seed.json` (colaborar con Gabriel para contenido real)
2. Script `scripts/seed-framework.ts` que upsertea desde el JSON
3. CRUD routes en `/admin/framework/*` con Server Actions
4. Componente `SkillDetailForm` con editor de niveles
5. Validadores Zod en `packages/validators/framework.ts`

**Tests:**

- Unit: validadores Zod rechazan skill con <5 niveles o niveles duplicados
- Integration: seed idempotente (correr 2 veces no duplica)
- E2E: Admin crea una skill, agrega niveles, la archiva
- RLS: solo Admin puede mutar; Coach/Selector pueden SELECT

**DoD:**

- Seed carga sin errores con el contenido real (cuando Gabriel lo provea) o con placeholders razonables
- Admin puede gestionar todo el framework sin tocar SQL
- Tests verdes

---

### Épica E6 — Design system + Skill Cards + Skill Library

**Objetivo:** Tener los componentes visuales core del producto listos para consumir en todas las vistas.

**Stories:**

**E6.1 — Design tokens y paleta**

- `packages/ui/src/tokens.ts` exporta colores, spacing, radius, shadows
- Paleta Upskill Labs configurada en Tailwind (`packages/config/tailwind.preset.ts`)
- Storybook o Ladle (opcional) configurado para previsualizar componentes

**E6.2 — Componentes base de shadcn**

- `Button`, `Input`, `Select`, `Checkbox`, `Dialog`, `Sheet`, `Tabs`, `Badge`, `Avatar`, `Tooltip`, `DropdownMenu`, `Toast` instalados en `packages/ui`
- Todos con variants documentados

**E6.3 — Skill Card (con flip)**

- Componente `<SkillCard skill={...} viewerRole="coach|professional" />`
- Frente: nombre + dimensión (color) + mini-ícono
- Dorso (flip con Framer Motion): descripción breve
- Si `viewerRole` es coach/selector, hay un botón "Ver niveles" que abre un Dialog con los 5 niveles y comportamientos
- Si es professional, no se muestran los niveles/comportamientos (SRD + PRD)

**E6.4 — Skill Library**

- Vista `/library` (accesible por Coach, Selector, Admin)
- Grid de Skill Cards con filtros (dimensión, búsqueda, favoritos)
- Favoritos persistidos en `profiles.metadata.favorite_skills: string[]`
- Sidebar con contador por dimensión

**Tasks técnicas:**

1. Config Tailwind preset compartida
2. Instalación de shadcn components (via CLI de shadcn)
3. Componente `SkillCard` con Framer Motion para flip
4. Página `/library` con server component + client filtering
5. Server Action `toggleFavoriteSkill`

**Tests:**

- Unit: `SkillCard` no muestra niveles cuando viewerRole=professional
- Component: filtros de Library funcionan
- E2E: Coach ve library, filtra por dimensión, marca favorita, refresca → favorita persiste

**DoD:**

- Library renderiza con las 60-80 skills en <1s
- Skill Card flip funciona fluido (60fps)
- Tests verdes + visual smoke test en preview deploy

---

### Épica E7 — Dashboards base por rol (shells vacíos con navegación)

**Objetivo:** Cada rol tiene su dashboard con la estructura de navegación completa, aunque con contenido placeholder.

**Stories:**

**E7.1 — Dashboard Coach shell**

- `/coach` con sidebar (Home, Profesionales, SkillBoards, Library, Perfil)
- Top bar con nombre + avatar + notificaciones + logout
- Contenido home: placeholders de "Mis profesionales", "SkillBoards recientes", "Evaluaciones pendientes"

**E7.2 — Dashboard Seleccionador shell**

- `/selector` con sidebar (Home, Procesos, SkillBoards, Library, Perfil)
- Home con placeholders de "Procesos activos", "Candidatos", "Evaluaciones"

**E7.3 — Dashboard Profesional (desarrollo) shell**

- `/me/dev` con sidebar (Home, Mis habilidades, Mi plan, Evaluaciones, Perfil)
- Home con objetivos, radar placeholder, acciones

**E7.4 — Dashboard Profesional (selección) shell**

- `/me/sel` con UI mínima (no hay sidebar complejo)
- Solo muestra lista de evaluaciones asignadas

**E7.5 — Dashboard Admin shell**

- `/admin` con sidebar (Resumen, Framework, SkillBoards, Usuarios, Licencias, Auditoría)
- Home con KPIs placeholder

**E7.6 — Layout responsive + mobile**

- Sidebar colapsable en tablet
- Navegación bottom-tab en mobile para roles críticos

**Tasks técnicas:**

1. Route groups `(coach)`, `(selector)`, `(professional-dev)`, `(professional-sel)`, `(admin)` con layouts independientes
2. Componente `<Sidebar />` parametrizado por items
3. Componente `<TopBar />` con notificaciones y menu de usuario
4. Middleware agregado para redirección por rol si entra a route group equivocado

**Tests:**

- E2E por rol: login → landing en dashboard correcto → navegación funciona
- Responsive: sidebar colapsa bajo 1024px

**DoD:**

- Cada rol tiene dashboard accesible según RBAC
- Navegación entre secciones funciona
- Mobile: usable sin scroll horizontal

---

### Épica E8 — Gestión de relaciones (Coach↔Profesional, Selector↔Proceso)

**Objetivo:** Un Coach puede invitar y listar sus profesionales. Un Selector puede crear y listar procesos + invitar candidatos.

**Stories:**

**E8.1 — Coach invita a Profesional**

- `/coach/professionals` tiene botón "Invitar profesional"
- Modal pide email (y opcional: nombre)
- Al enviar: crea registro en `coach_professional_links` con status `pending`, genera magic link, envía email
- Si el email ya es profesional de otro coach, muestra error (MVP = 1 coach por profesional)

**E8.2 — Profesional acepta invitación**

- Al hacer click en magic link → flujo de onboarding Profesional → auto-vincula con Coach → status `active`

**E8.3 — Coach lista sus profesionales**

- Tabla paginada: nombre, estado, #skillboards, #evaluaciones, última actividad
- Filtros por estado (active/archived)
- Click → perfil del profesional (shell en E7)

**E8.4 — Coach archiva profesional**

- Acción "Archivar" en menú de 3 puntos
- Confirmación: "El profesional perderá acceso a su dashboard. La data se conserva. ¿Continuar?"
- Al archivar: `coach_professional_links.status = archived` + profile del professional → `status = suspended`

**E8.5 — Selector crea proceso de selección**

- `/selector/processes/new` con form: nombre rol, seniority, industria, contexto
- Al crear: `/selector/processes/:id` (estado inicial `skills_definition`)

**E8.6 — Selector lista procesos**

- Tabla con procesos activos + archivados (tab separado)
- Filtros por estado
- Click → detalle del proceso

**E8.7 — Selector invita candidato a proceso**

- Dentro de `/selector/processes/:id/candidates`, botón "Invitar candidato"
- Email → magic link → onboarding específico de Candidato (muy minimal, solo evaluaciones)

**Tasks técnicas:**

1. Server Actions: `inviteProfessional`, `acceptCoachInvite`, `archiveProfessional`, `createSelectionProcess`, `inviteCandidate`
2. Email templates con Resend (invitación Coach→Profesional, invitación Selector→Candidato)
3. Componente `<InviteByEmailDialog />`
4. Listados con paginación server-side

**Tests:**

- Integration: invitación completa (Coach invita → email → Profesional acepta → link activo)
- RLS: Coach A no ve profesionales de Coach B
- E2E: Coach invita Profesional, Profesional acepta, Coach lo ve en su lista

**DoD:**

- Un Coach puede gestionar su lista de profesionales end-to-end
- Un Selector puede crear procesos e invitar candidatos
- Emails se envían correctamente en preview deploy

---

### Épica E9 — Motor de SkillBoards: contrato, runtime, estado, persistencia

**Objetivo:** Tener el runtime que ejecuta cualquier template de SkillBoard, con persistencia de estado, resumen de outputs, y cierre.

**Stories:**

**E9.1 — Contrato `SkillBoardTemplate`**

- Definido en `packages/skillboard-templates/src/_contract/index.ts`:

```ts
export interface SkillBoardTemplate<TState = unknown> {
  key: string; // unique id, e.g. "dev_initial_diagnostic"
  meta: {
    name: string;
    description: string;
    processType:
      | "development"
      | "selection"
      | "coaching"
      | "mentoring"
      | "culture"
      | "transformation";
    participation: "individual" | "1on1" | "team" | "multilevel";
    processMoment: "diagnostic" | "prioritization" | "goal_setting" | "review";
    scope: "role" | "area" | "org" | "project";
    estimatedTime: "quick" | "brief" | "medium" | "deep";
    outputDepth: "exploratory" | "guided" | "deep";
  };
  initialState: (ctx: InitContext) => TState;
  Component: React.ComponentType<SkillBoardRuntimeProps<TState>>;
  validateClose: (state: TState) => { valid: boolean; errors?: string[] };
  buildOutputs: (state: TState, ctx: OutputContext) => SkillBoardOutput[];
}
```

**E9.2 — Runtime del SkillBoard**

- `/coach/skillboards/:id` y `/selector/processes/:id/skillboards/:id` renderizan el runtime
- Runtime hace:
  - Lee `skillboards` row + `skillboard_templates.template_key` → resuelve component desde registry
  - Pasa `state`, `onStateChange`, `ctx` al componente del template
  - Persiste `state` debounced (cada 2 segundos de inactividad) a `skillboards.state`
  - Al cerrar: valida, llama `buildOutputs`, persiste en `skillboard_outputs`, cambia status a `closed`

**E9.3 — Galería de templates**

- `/coach/skillboards/new` muestra grid de templates disponibles filtrados por procesos de desarrollo
- `/selector/processes/:id/skillboards/new` muestra los de selección
- Cada card: meta info + "Usar este template"

**E9.4 — Estado persistente y resumible**

- Si el usuario cierra el tab y vuelve, encuentra el board donde lo dejó
- Auto-save visible con indicador "Guardado hace 3s"
- En caso de conflicto (mismo user en 2 tabs), last-write-wins con toast warning

**E9.5 — Panel de instrucciones**

- Sidebar derecho con markdown renderizado de `skillboard_templates.instructions_md`
- Colapsable, toggleable por user

**Tasks técnicas:**

1. Definir interface + helper types en `_contract`
2. `SkillBoardRuntime` component (client) que resuelve y renderiza template
3. Server Actions: `createSkillBoard`, `updateSkillBoardState` (debounced), `closeSkillBoard`
4. Registry `packages/skillboard-templates/src/registry.ts`: `Map<key, Template>`
5. Migration para sincronizar `skillboard_templates` DB rows con el registry (script idempotente)
6. Panel de instrucciones con `react-markdown` + sanitización

**Tests:**

- Unit: registry no tiene keys duplicados
- Unit: `validateClose` de un template con estado inválido retorna errores
- Integration: crear board → editar state → refresh → state persistido
- E2E: Coach abre galería, selecciona template, aparece runtime vacío

**DoD:**

- El motor puede correr un template de prueba ("hello world") end-to-end
- State se persiste y resume correctamente
- Tests verdes

---

### Épica E10 — Template 1: Diagnóstico inicial de habilidades (Desarrollo, 1:1)

**Objetivo:** Primer template usable end-to-end. Coach + Profesional hacen diagnóstico de habilidades críticas a desarrollar.

**Stories:**

**E10.1 — Coach abre template de diagnóstico**

- Desde perfil de un profesional, Coach elige "Iniciar Skill Board" → galería → selecciona "Diagnóstico inicial"
- Se crea instancia vinculada al profesional

**E10.2 — Layout del board**

- 3 zonas (columnas): "Banco de habilidades" (library lateral), "Fortalezas" (centro izq), "A desarrollar" (centro der)
- Coach arrastra skills de banco → columnas (drag & drop con dnd-kit)
- Límite: min 3, max 7 en cada columna

**E10.3 — Definir nivel objetivo por skill**

- Al soltar skill en "A desarrollar", se abre popover para elegir nivel objetivo (1-5)
- Coach ve descripción del nivel elegido (comportamiento observable) como ayuda

**E10.4 — Inputs del Coach**

- Sección inferior del board: textarea "Insights y reflexiones" + textarea "Riesgos observados"
- Opcional pero recomendado

**E10.5 — Cierre del board**

- Botón "Cerrar Skill Board" con confirmación
- Si hay <3 skills en "A desarrollar" → no permite cerrar, muestra mensaje
- Al cerrar: genera outputs (habilidades priorizadas con nivel objetivo + insights), navega a vista de outputs

**E10.6 — Vista de outputs del board**

- `/coach/skillboards/:id/outputs` muestra resumen bonito
- Botón "Ver en dashboard del profesional" → abre perfil del profesional

**Tasks técnicas:**

1. Component `DevInitialDiagnosticBoard` en `packages/skillboard-templates/src/development/dev_initial_diagnostic.tsx`
2. Componente genérico `<DndSkillColumn />` reusable en otros templates
3. Componente `<LevelPicker />` con popover
4. Validación del cierre
5. `buildOutputs` → genera filas en `skillboard_outputs` + `assigned_skills` para el profesional
6. Registrar en el registry

**Tests:**

- Component: DnD funciona (simulado con dnd-kit testing utils)
- Unit: validateClose rechaza si <3 skills en columna "a desarrollar"
- Integration: cerrar board crea `assigned_skills` rows correctas
- E2E: Coach ejecuta el template completo, cierra, ve outputs

**DoD:**

- Template es usable por un Coach real en <15 min
- Outputs aparecen en dashboard del profesional (cuando E22 esté listo)
- Tests verdes

---

### Épica E11 — Template 2: Definición de skillset para rol (Selección)

**Objetivo:** Template que permite al Seleccionador definir el perfil de habilidades para un rol, con soporte para IA y magic links a terceros.

**Stories:**

**E11.1 — Selector abre template**

- Desde un proceso de selección, elige template "Skillset para rol" de la galería
- Se crea instancia vinculada al proceso

**E11.2 — Input descriptivo del rol**

- Primera pantalla: textarea grande "Describí el rol, responsabilidades, contexto del equipo y desafíos clave"
- Opcional: botón "Sugerir skills con IA" (consume feature de E20)

**E11.3 — Selección de habilidades con categorización**

- Drag & drop desde library a 3 columnas: "Críticas", "Deseables", "Diferenciadoras"
- Cada skill se clasifica exactamente en una columna
- Límites: 3-10 en críticas, 0-10 en deseables, 0-5 en diferenciadoras

**E11.4 — Definir nivel mínimo + deseable por skill**

- Al colocar skill, se abre popover: "Nivel mínimo requerido (1-5)" + "Nivel deseable (1-5)"
- Selector ve comportamientos observables de ambos niveles

**E11.5 — Solicitud de info a tercero (magic link)**

- Botón "Pedir input a manager" abre modal → email del tercero + schema de formulario (preguntas abiertas + ranking de skills)
- Se genera magic link, se envía email
- Vista del board muestra: "Esperando input de manager@..." con estado
- Cuando el tercero completa, aparece sección "Input del manager" en el board

**E11.6 — Insights del proceso (inputs manuales)**

- Textareas para "Reflexiones sobre el perfil", "Riesgos del rol", "Contexto del equipo", "Otros"

**E11.7 — Cierre del board**

- Genera outputs: skillset requerido (con categorías + niveles), insights, magic link responses

**Tasks técnicas:**

1. Component `SelectionRoleSkillsetBoard` en `packages/skillboard-templates/src/selection/`
2. Integración con E13 (magic links) para terceros
3. Integración con E20 (IA) para sugerencia
4. Componentes `<LevelRangePicker />` (para nivel mínimo + deseable)
5. buildOutputs → genera `assigned_skills` con `category` y `min_level`/`target_level`

**Tests:**

- E2E: Selector completa el flow, envía magic link, tercero completa form, Selector cierra board
- Integration: outputs correctos en DB

**DoD:**

- Selector puede definir un perfil completo end-to-end
- Magic link flow funciona
- Outputs usables por flujo de evaluaciones asignadas

---

### Épica E12 — Template 3: Priorización de objetivos de desarrollo (asíncrono, Profesional participa)

**Objetivo:** Template que demuestra participación asincrónica del Profesional. El Coach inicia, el Profesional completa su parte, el Coach finaliza.

**Stories:**

**E12.1 — Coach inicia board asíncrono**

- Selecciona template "Priorización de objetivos"
- Etapa 1: Coach propone 8-12 habilidades candidatas desde library
- Coach envía al Profesional para su parte

**E12.2 — Profesional recibe notificación**

- Email + notificación in-app: "Tu Coach quiere que ordenes tus prioridades"
- Al entrar al board: ve solo su parte (priorizar top 5 con drag & drop), sin comportamientos observables

**E12.3 — Profesional completa y envía**

- Ordena las 8-12 skills de mayor a menor prioridad
- Botón "Enviar mis prioridades" → `skillboard_participations.status = submitted`

**E12.4 — Coach finaliza**

- Recibe notificación "Profesional completó su parte"
- Ve lado a lado: propuesta Coach vs priorización Profesional
- Toma decisión final (última palabra) y cierra board

**Tasks técnicas:**

1. Component con 2 "vistas": coach-view y professional-view
2. `skillboard_participations` row creada al enviar al profesional
3. Props del runtime: `viewerRole` + `currentState` determina qué se renderiza
4. Email + notification al profesional

**Tests:**

- E2E: flow completo Coach → Profesional → Coach cierra
- RLS: Profesional solo ve board de sus propios Coaches

**DoD:**

- Participación asíncrona funciona
- El Profesional no ve información que no debe ver (comportamientos observables)
- Ambas partes pueden guardar progreso y retomar

---

### Épica E13 — Magic links + formularios externos (terceros)

**Objetivo:** Permitir que usuarios externos (sin cuenta) completen formularios estructurados vía magic link seguro.

**Stories:**

**E13.1 — Generar magic link**

- Desde un SkillBoard, el owner (Coach/Selector) puede "Solicitar input a tercero" con:
  - Email del tercero
  - Schema del formulario (ya definido por el template, no editable por el owner)
  - Mensaje personalizado opcional
- Se crea `external_form_links` con token random 32 bytes, expira en 30 días, uso único
- Se envía email con link `/external/forms/:token`

**E13.2 — Tercero accede al formulario**

- `/external/forms/:token` (ruta pública, sin auth)
- Valida token vía función SECURITY DEFINER (no expone datos hasta que se valide)
- Si token expiró, usado, o inválido → muestra error amigable
- Si válido: muestra form con schema renderizado dinámicamente (soporta: text, textarea, single-choice, multi-choice, ranking de skills)

**E13.3 — Guardado parcial**

- El form guarda borrador cada 2s en `external_form_links.submitted_data` (pero `used_at` sigue NULL)
- Si el tercero cierra el tab y vuelve, retoma el progreso

**E13.4 — Envío final**

- Al enviar, `used_at = now()` y el link queda inutilizable
- Muestra mensaje de confirmación "Formulario enviado. Gracias."

**E13.5 — Notificación al owner**

- Email + notification in-app al Coach/Selector cuando el tercero envía
- El SkillBoard se actualiza automáticamente con los datos

**Tasks técnicas:**

1. Migration `external_form_links` + function `get_external_form(token)` SECURITY DEFINER
2. Ruta pública `/external/forms/[token]` con validación server-side
3. Form renderer dinámico basado en schema Zod
4. Edge Function para envío de email

**Tests:**

- Integration: token expirado retorna error
- Integration: token usado retorna error
- E2E: Coach genera link, tercero completa form, Coach ve el resultado
- Security: token inválido no filtra información

**DoD:**

- Flujo funciona end-to-end en preview deploy
- Seguridad verificada (no hay fugas de info con token inválido)
- Logs de auditoría de uso de magic links

---

### Épica E14 — Outputs estructurados

**Objetivo:** Cuando se cierra un SkillBoard, se generan outputs bien tipados que alimentan dashboards y planes de acción.

**Stories:**

**E14.1 — Generación de outputs en cierre**

- Cada template implementa `buildOutputs(state, ctx)` que retorna array de `SkillBoardOutput`
- Tipos de output: `prioritized_skills`, `target_levels`, `role_skillset`, `actions_plan`, `insights`
- El runtime persiste cada output en `skillboard_outputs` y propaga a tablas derivadas (`assigned_skills`, `action_items`, `development_goals`)

**E14.2 — Vista de outputs de un SkillBoard**

- Página `/coach/skillboards/:id/outputs` (y equivalente selector)
- Secciones colapsables por tipo de output
- Acciones: "Asignar evaluaciones", "Editar plan de acción", "Imprimir PDF" (básico)

**E14.3 — Exportación PDF básica**

- Botón "Exportar PDF" genera PDF con React-PDF (server-side en Edge Function)
- Incluye: nombre del SkillBoard, fecha, outputs principales, watermark "Skillset360° - Generado para {nombre}"

**Tasks técnicas:**

1. Interfaces de outputs en `packages/types/src/outputs.ts`
2. Propagación: al cerrar board → trigger DB o Server Action que crea filas en `assigned_skills`, `action_items` etc.
3. Componente `<OutputsView />`
4. Edge Function `export-pdf` con React-PDF

**Tests:**

- Integration: cerrar template 1 → `assigned_skills` tiene las filas correctas
- E2E: export PDF baja archivo válido

**DoD:**

- Cada template produce outputs consistentes
- Outputs son consumidos por dashboards y plan de acción
- PDF se descarga correctamente

---

### Épica E15 — Plan de acción: creación, estados, seguimiento

**Objetivo:** Los `action_items` generados por SkillBoards son visibles, editables y seguibles.

**Stories:**

**E15.1 — Vista del plan de acción del Profesional**

- `/me/dev/plan` muestra lista de acciones agrupadas por skill
- Cada acción: descripción, responsable, timeframe, estado
- Profesional puede cambiar estado (In Progress → Done / Delegated / Dismissed)

**E15.2 — Vista del plan desde Coach**

- `/coach/professionals/:id/plan` muestra el mismo plan con capacidad de editar descripción/timeframe/responsable
- Coach puede agregar acciones manualmente (no necesariamente desde SkillBoard)

**E15.3 — Historial de cambios de estado**

- Cada cambio de estado registra entrada en `audit_log` + puede verse en "timeline de la acción"

**E15.4 — Filtros en vista del plan**

- Por estado, por skill, por timeframe

**Tasks técnicas:**

1. Server Actions: `updateActionStatus`, `createActionItem`, `editActionItem`
2. Componente `<ActionItemCard />` con dropdown de estado
3. Componente `<ActionTimeline />` que muestra historial desde audit_log

**Tests:**

- RLS: Profesional puede mutar solo sus propios `action_items`; Coach puede mutar los de sus profesionales
- E2E: Profesional cambia estado → Coach lo ve actualizado

**DoD:**

- Plan de acción es usable por ambos roles
- Estados se actualizan en tiempo real (supabase realtime o polling ligero)

---

### Épica E16 — Objetivos de desarrollo

**Objetivo:** Coach define objetivos macro de desarrollo para cada profesional, ordenables por prioridad.

**Stories:**

**E16.1 — Coach crea objetivo**

- Desde perfil de profesional: "Nuevo objetivo de desarrollo"
- Form: título, descripción, horizonte temporal, contexto, prioridad (numérica)

**E16.2 — Reordenar con drag & drop**

- Lista de objetivos ordenable con dnd-kit
- Al soltar, guarda nuevo orden en `development_goals.priority`

**E16.3 — Profesional ve sus objetivos**

- `/me/dev` dashboard home muestra objetivos en orden de prioridad
- Read-only para Profesional

**Tasks técnicas:**

1. CRUD routes + Server Actions
2. `<SortableGoalList />` con dnd-kit
3. Integration con dashboard Profesional

**Tests:**

- E2E: Coach crea 3 objetivos, reordena, Profesional ve en el nuevo orden
- RLS: Profesional A no ve objetivos del Profesional B

**DoD:**

- Drag & drop fluido, persistencia correcta

---

### Épica E17 — Evaluaciones mockup: shell navegable por rol

**Objetivo:** Flujo de evaluación completamente navegable (sin scoring real), diseñado para que en Fase 2 se enchufe el motor.

**Stories:**

**E17.1 — Pantalla de lista de evaluaciones asignadas (Profesional dev)**

- `/me/dev/assessments` muestra lista con: título genérico por orden, tiempo estimado, estado
- Profesional no ve el nombre de la skill asociada

**E17.2 — Pantalla de lista (Profesional selección/Candidato)**

- `/me/sel/assessments` igual pero con reglas adicionales: mostrar timer si la evaluación tiene regla de "sesión única"

**E17.3 — Flujo de evaluación — Introducción**

- `/assessments/:id/intro` con explicación, reglas, tiempo estimado, "Iniciar"

**E17.4 — Flujo de evaluación — Pantallas de items**

- Secuencia de items mockup: 3-5 pantallas con:
  - Pregunta Likert ("Del 1 al 5, cuánto te identifica esto")
  - Escenario breve con opciones
  - Reflexión con textarea
- Cada pantalla graba input en `assessment_assignments.metadata.mock_responses` (para trazar UX)

**E17.5 — Flujo de evaluación — Cierre**

- Pantalla final: "Gracias. Esta evaluación está en etapa de diseño"
- `assessment_assignments.status = completed_mock`
- Redirige a dashboard

**E17.6 — Pantalla de resultado mockup**

- `/assessments/:id/result` muestra placeholder "Resultados próximamente (Fase 2)"
- Solo para Profesional dev (Candidatos no ven resultados, mensaje claro)

**Tasks técnicas:**

1. Route group `/assessments/[id]/` con layout sin sidebar (fullscreen focus)
2. Componentes de items (`LikertItem`, `ScenarioItem`, `ReflectionItem`)
3. Server Actions para progresión
4. Copy y textos finales revisados

**Tests:**

- E2E: Profesional completa una evaluación mockup end-to-end
- E2E: Candidato completa, ve mensaje final, no ve resultados
- UX: flow es claro y no tiene loops rotos

**DoD:**

- Cualquier evaluación asignada puede "completarse" (aunque no haya scoring)
- Data de UX queda persistida para Fase 2 (research)

---

### Épica E18 — Reglas de evaluación (1 activa, 2 en 6m, override Coach)

**Objetivo:** Aplicar las reglas de negocio del PRD §5.3.

**Stories:**

**E18.1 — Solo 1 evaluación activa por usuario**

- Al asignar nueva evaluación, si ya hay una con status `in_progress` → error "El usuario tiene una evaluación en curso, debe completarla primero"
- UX: muestra cuál evaluación está pendiente + CTA "ir a completarla"

**E18.2 — Max 2 evaluaciones por skill en 6 meses**

- Al asignar: query `COUNT(*) FROM assessment_assignments WHERE assignee_id = X AND skill_id = Y AND completed_at > now() - 6 months` ≥ 2 → bloquear
- UX: muestra última evaluación de esa skill

**E18.3 — Override Coach**

- Coach (único rol que puede) tiene botón "Habilitar nueva evaluación" con confirmación
- Se registra en `audit_log` con action `assessment.override_frequency_rule`
- Motivo opcional

**Tasks técnicas:**

1. Trigger DB que valida las reglas antes de INSERT en `assessment_assignments`
2. Server Action `overrideEvaluationLimit` solo para rol Coach
3. UX de errores informativos

**Tests:**

- Integration: intentar crear 3ra evaluación de misma skill en <6m → error
- Integration: override Coach bypassa y registra audit
- Integration: Selector NO puede hacer override (solo Coach)

**DoD:**

- Reglas enforcidas en DB (trigger) + en UI (bloqueo preventivo)

---

### Épica E19 — IA: chatbot contextual en dashboards

**Objetivo:** Coach, Selector y Profesional tienen un chatbot con contexto de sus datos (anonimizado).

**Stories:**

**E19.1 — Chatbot Coach**

- Floating button en dashboard `/coach/*`
- Al abrir: chat con system prompt que incluye contexto anonimizado (sus profesionales, skills asignadas, últimos SkillBoards — sin nombres ni emails)
- Respuestas streameadas (SSE)

**E19.2 — Chatbot Selector**

- Idem pero con contexto de sus procesos y candidatos

**E19.3 — Chatbot Profesional**

- Idem pero con contexto de sus habilidades, objetivos, plan de acción
- Más conservador: no sugiere cosas médicas, profesionales, legales, etc.

**E19.4 — Rate limit + kill switch**

- Rate limit: 30 mensajes/hora por user
- Feature flag `ai_chatbot_enabled` apaga el feature

**Tasks técnicas:**

1. Route handler `/api/ai/chat` con streaming
2. Builder de context que anonimiza datos (reemplaza nombres con tokens)
3. Wrapper Anthropic con retries + fallback
4. UI de chat con `useChat`-like hook

**Tests:**

- Unit: anonimizador no deja pasar emails, nombres, phones
- Integration: rate limit dispara 429 al msg 31
- E2E: chatbot responde a un mensaje en preview deploy

**DoD:**

- Chat funciona en los 3 roles con contexto pertinente
- Sin leaks de PII (auditado manualmente + tests)

---

### Épica E20 — IA: sugerencia de skillset desde descripción de rol

**Objetivo:** Selector ingresa descripción de rol → IA sugiere 5-10 skills del framework con justificación.

**Stories:**

**E20.1 — UI de sugerencia**

- Botón "Sugerir skills con IA" en template de selección
- Textarea con la descripción del rol
- Al enviar → loading → lista de skills sugeridas (con justificación + categoría sugerida)
- Selector acepta/rechaza individualmente, las aceptadas se agregan al board

**E20.2 — Prompt estructurado con Zod output**

- System prompt con framework completo (cacheable)
- User prompt con descripción
- Output schema Zod: `{ suggestions: Array<{ skill_slug: string; category: 'critical'|'desirable'|'differentiating'; rationale: string }> }`
- Validación estricta; si falla, reintentar una vez

**Tasks técnicas:**

1. `lib/ai/prompts/suggestSkillset.ts`
2. Route handler `/api/ai/suggest-skillset`
3. UI que renderiza sugerencias con accept/reject

**Tests:**

- Integration: prompt con mock → output parsed correctamente
- Integration: si Anthropic falla, UI muestra error amigable

**DoD:**

- En preview deploy, una descripción de rol produce sugerencias coherentes
- Selector puede consumir sugerencias fácilmente

---

### Épica E21 — IA: generación de plan de acción

**Objetivo:** Dado un SkillBoard cerrado, generar acciones concretas por skill priorizada.

**Stories:**

**E21.1 — Botón "Generar plan con IA"**

- En vista de outputs, para cada skill priorizada (o globalmente)
- IA produce 2-4 acciones por skill, con responsable sugerido y timeframe

**E21.2 — Coach revisa y edita**

- Lista editable de acciones sugeridas
- Coach acepta, edita texto, o descarta
- Acciones aceptadas se crean como `action_items`

**Tasks técnicas:**

1. Prompt con Zod output
2. UI de review
3. Server Action para crear `action_items` en bulk

**Tests:**

- Integration + E2E: Coach genera plan → revisa → acepta → action_items creados

**DoD:**

- Plan de acción automático funciona y produce resultados coherentes

---

### Épica E22 — Dashboards completos con data real

**Objetivo:** Llenar los dashboards shell (E7) con data real conectada a SkillBoards, outputs, goals, actions, evaluaciones.

**Stories:**

**E22.1 — Dashboard Coach completo**

- Cards con KPIs: #profesionales activos, #skillboards en curso, #evaluaciones mockup pendientes
- Tabla de profesionales con datos reales
- Widget "Actividad reciente" (últimos 10 eventos)

**E22.2 — Dashboard Seleccionador completo**

- KPIs: #procesos activos, #candidatos, #evaluaciones
- Tabla de procesos con estado
- Widget "Candidatos recientes"

**E22.3 — Dashboard Profesional (dev) completo**

- Objetivos de desarrollo (ordenados, de E16)
- Habilidades asignadas (de E14) con estado
- Radar chart placeholder (Fase 2)
- Acciones próximas (top 3 de E15)
- Evaluaciones asignadas (mockup, de E17)

**E22.4 — Dashboard Admin con KPIs**

- #usuarios por rol, #skillboards ejecutados, #evaluaciones, consumo IA tokens

**Tasks técnicas:**

1. Queries con joins optimizados (RSC)
2. Componentes `<KpiCard />`, `<ActivityFeed />`, `<SkillRadarChart />`
3. Caching con `revalidateTag` para invalidar al cerrar board

**Tests:**

- Integration: dashboard carga en <1.5s para user con 50 profesionales
- E2E: datos se actualizan tras cerrar board

**DoD:**

- Dashboards útiles y performantes
- No queries N+1

---

### Épica E23 — Admin panel completo

**Objetivo:** Admin puede gestionar todo lo necesario desde la UI.

**Stories:**

**E23.1 — CRUD Templates de SkillBoards (Admin)**

- Sincronización con registry: Admin ve lista de templates, puede editar `instructions_md`, `meta.name`, `meta.description`, `is_active`
- No puede cambiar la lógica (eso es código), solo metadata y activación

**E23.2 — Gestión de usuarios**

- Tabla con todos los usuarios, filtros por rol/estado
- Acciones: activar, suspender, resetear contraseña, cambiar rol, crear usuario manualmente

**E23.3 — Gestión de licencias manuales (sin Stripe)**

- Crear licencia manual para un usuario (plan + fechas)
- Listar licencias activas/expiradas

**E23.4 — Auditoría**

- Lectura de `audit_log` con filtros (usuario, acción, fecha, resource_type)
- Exportar como CSV

**E23.5 — KPIs generales**

- Consumo de IA tokens por usuario
- SkillBoards ejecutados por tipo
- Evaluaciones asignadas

**Tasks técnicas:**

1. Route group `/admin/*` con protección RBAC
2. CRUD forms con Server Actions
3. Tabla de auditoría con paginación cursor-based
4. Export CSV con Edge Function

**Tests:**

- RLS: solo admin accede
- E2E: flujos críticos (crear usuario manual, suspender, auditoría)

**DoD:**

- Admin puede operar el sistema sin tocar DB directamente

---

### Épica E24 — Auditoría y trazabilidad

**Objetivo:** Registrar eventos relevantes y tener una infraestructura limpia para hacerlo.

**Stories:**

**E24.1 — Helper de audit**

- `audit.log(actor, action, resource, metadata)` disponible en Server Actions
- Inserta en `audit_log` con IP y user-agent

**E24.2 — Eventos trackeados (mínimo)**

- Auth: signup, login, logout, password_reset
- Gestión: invite, accept_invite, archive, suspend
- SkillBoards: create, update, close
- Evaluaciones: assign, start, complete_mock, override_rule
- Admin: create_user, change_role, create_license
- IA: chatbot_message, skillset_suggestion, action_plan_generation (con token counts)

**E24.3 — Retención**

- Retention: 1 mes (SRD §14) — cron job diario que elimina entries >30 días

**Tasks técnicas:**

1. Helper `lib/audit.ts`
2. Integración en todas las Server Actions de otras épicas
3. Edge Function programada (cron) para purga

**Tests:**

- Unit: helper inserta con shape correcto
- Integration: eventos críticos aparecen en audit_log

**DoD:**

- Todos los eventos del PRD/SRD §14 están registrados

---

### Épica E25 — Feature flags runtime

**Objetivo:** Poder activar/desactivar features sin deploy.

**Stories:**

**E25.1 — Tabla + helper**

- Tabla `feature_flags` (key, enabled, rollout_percentage)
- Hook `useFeatureFlag(key)` (client) + helper `isFeatureEnabled(key, userId)` (server)

**E25.2 — Admin UI**

- `/admin/flags` con lista de flags + toggle + % rollout
- Cambios se aplican en <1 min (cache con revalidate)

**E25.3 — Flags clave**

- `ai_chatbot_enabled`, `ai_skillset_suggestion_enabled`, `ai_action_plan_enabled`
- `skillboard_template_<key>_enabled` (para rollout gradual de templates)

**Tasks técnicas:**

1. Migración de tabla + seed de flags iniciales (todos ON)
2. Helpers + hook
3. UI Admin

**Tests:**

- Integration: flag OFF oculta feature en UI
- E2E: admin cambia flag → feature se apaga en otra sesión en <1 min

**DoD:**

- Puedo apagar el chatbot IA desde admin sin redeploy

---

### Épica E26 — Emails transaccionales

**Objetivo:** Emails bien diseñados y confiables para invitaciones, magic links y cambios importantes.

**Stories:**

**E26.1 — Setup Resend**

- API key, dominio verificado (DNS), from address `noreply@skillset360.com`

**E26.2 — Templates**

- Invitación Coach→Profesional
- Invitación Selector→Candidato
- Magic link a tercero (formulario externo)
- Reset password (usa Supabase default pero custom template)
- Archivado de profesional (notificación al profesional)
- Magic link reutilizado / expirado (notificación al emisor)

**E26.3 — Edge Function `send-email`**

- Wrapper que encola emails (con retry + logging)
- Llamable desde Server Actions

**Tasks técnicas:**

1. Templates React-Email en `packages/emails`
2. Edge Function con Resend
3. Tests de smoke: enviar email real a env dev

**Tests:**

- Integration: envío a email real en preview deploy se recibe
- Unit: templates renderizan sin errores con props válidas

**DoD:**

- Emails se entregan con spam score bajo
- Templates consistentes con branding

---

### Épica E27 — Landing comercial + signup self-service

**Objetivo:** Landing pública con copy comercial, signup funcional para Coaches/Selectores (sin pagos aún).

**Stories:**

**E27.1 — Landing mejorada**

- Hero + secciones: "Para Coaches", "Para Seleccionadores", "Cómo funciona", "FAQ"
- Copy revisado, imágenes ilustrativas (placeholder o stock)

**E27.2 — Signup flow sin pago**

- `/signup/coach` y `/signup/selector` llevan al mismo signup pero pre-seteando el rol
- Al completar onboarding, la cuenta queda activa (en Fase 2 esto requeriría pago exitoso)
- Mensaje "Versión beta: acceso gratuito durante el periodo de lanzamiento"

**E27.3 — Plan comercial visible**

- Página `/pricing` que explica el modelo (del PRD §9) aunque no cobre aún
- CTA "Sumarme a la beta"

**Tasks técnicas:**

1. Contenido landing (copy colaborativo con Gabriel)
2. Flow diferenciado por rol
3. Feature flag `billing_enabled = false` en Fase 1

**DoD:**

- Landing usable para captar primeros coaches
- Signup funciona end-to-end

---

### Épica E28 — Hardening: rate limits, bot protection, accessibility, mobile

**Objetivo:** Endurecer el producto antes del lanzamiento.

**Stories:**

**E28.1 — Rate limits**

- Login: 5 intentos por IP/15min
- Magic link requests: 3 por email/hora
- Formularios externos: 10 por IP/hora
- IA: 30 msg chatbot/hora, 5 suggestSkillset/día
- Implementado con Supabase + tabla `rate_limits` (simple token bucket)

**E28.2 — Bot protection básica**

- Honeypot en signup y formularios externos
- Rate limit por IP
- (Post-MVP: Cloudflare Turnstile)

**E28.3 — Accessibility audit**

- Lighthouse score ≥90 en todas las páginas críticas
- Navegación por teclado en SkillBoards (DnD accesible con arrows)
- Labels y aria en todos los forms

**E28.4 — Mobile responsive**

- Dashboards y Skill Library usables en mobile
- SkillBoards funcionan en tablet (drag & drop con touch)

**Tasks técnicas:**

1. Middleware de rate limit
2. Audit con axe + Playwright
3. Testing en dispositivos reales (iPhone + Android)

**Tests:**

- E2E mobile: flows críticos pasan en viewport 375px
- Automated a11y: 0 violations críticas

**DoD:**

- Producto usable en mobile
- Rate limits enforcidos
- No hay regresiones a11y

---

### Épica E29 — QA completo + UAT con 2-3 coaches reales

**Objetivo:** Validar con usuarios reales antes del lanzamiento público.

**Stories:**

**E29.1 — QA interno**

- Checklist exhaustivo por rol (ver apéndice A — a generar)
- Bugs críticos/bloqueantes resueltos

**E29.2 — UAT con 2-3 coaches externos**

- Selección de 2-3 coaches voluntarios
- Sesiones de 45 min: usan el producto con 1 profesional real
- Feedback estructurado

**E29.3 — Iteración sobre feedback**

- Triage de feedback: bug / mejora / post-MVP
- Fix de bugs críticos antes del lanzamiento

**Tasks técnicas:**

1. Generar checklist QA
2. Reclutamiento UAT
3. Sessions estructuradas con notas

**DoD:**

- 2 de 3 coaches UAT pueden usar el producto sin ayuda
- 0 bugs críticos abiertos
- Plan de trabajo para iteración post-lanzamiento

---

## 12. Grafo de dependencias y paralelización

### 12.1 Dependencias duras (lo que no puede empezar hasta terminar X)

```
E0 (setup)
 └─▶ E1 (monorepo + landing)
      └─▶ E2 (auth)
           └─▶ E4 (RBAC app layer)
      └─▶ E3 (schema + RLS core)
           └─▶ E4
                └─▶ E5 (framework CRUD)
                     └─▶ E6 (design system + cards)
                          └─▶ E7 (dashboard shells)
                               └─▶ E8 (relaciones)
                                    └─▶ E9 (motor skillboards)
                                         ├─▶ E10 (template 1)
                                         ├─▶ E11 (template 2) ─┬─▶ E13 (magic links)
                                         └─▶ E12 (template 3)  │
                                              └─▶ E14 (outputs) ◀┘
                                                   ├─▶ E15 (plan acción)
                                                   └─▶ E17 (evaluaciones mockup)
                                                        └─▶ E18 (reglas eval)
```

### 12.2 Tracks paralelizables

Una vez que **E0+E1+E3+E4** están listos (fin de semana 2), se pueden abrir estos tracks **simultáneos**:

**Track Plataforma/Framework (necesita DB + auth + RLS)**

- E5 → E6 → E23 (admin) + E25 (feature flags) + E24 (auditoría) + E26 (emails) + E27 (landing)

**Track SkillBoards (necesita E5 + E7)**

- E9 → E10 → E11 → E12 → E13 → E14 → E15 → E16

**Track IA (necesita E7 + E14 para contexto)**

- E19 → E20 → E21 (pueden arrancar con mocks antes de tener data real)

**Track Evaluaciones mockup (necesita E7 + E14)**

- E17 → E18

### 12.3 Puntos de sincronización obligatorios

1. **Fin de semana 2:** Merge de E0+E1+E2+E3+E4 a `develop`. **Ningún otro track avanza hasta aquí.** Daily sync.
2. **Fin de semana 3:** Merge de E5+E6+E7. Templates pueden empezar (E9). Dashboards tienen shells.
3. **Fin de semana 5:** Merge de E9+E10+E14. Es el checkpoint clave — si esto está, el resto es relleno.
4. **Fin de semana 7:** Feature freeze. Solo bugfixes y polish.
5. **Fin de semana 8:** UAT + lanzamiento beta.

### 12.4 Sugerencia de reparto por perfil (sin asignar persona)

**DEV A** (orientado a infraestructura y backend):

- E0 (con DEV B), E1, E2, E3, E4, E5, E23, E24, E25, E26, E28

**DEV B** (orientado a frontend y UX):

- E0 (con DEV A), E6, E7, E8, E16, E22, E27, E28

**DEV C** (si existe, orientado a producto/IA):

- E9, E10, E11, E12, E13, E14, E15, E17, E18, E19, E20, E21

Si son solo 2 devs, las tareas de DEV C se reparten: DEV A toma E9, E14 (integraciones DB); DEV B toma los templates (E10-E13) y E17. IA (E19-E21) la toman los dos alternadamente.

**Restricciones adicionales:**

- Quien hace E9 bloquea a quien haga E10/E11/E12 hasta que E9 esté mergeada
- Quien hace E14 bloquea a quien haga E15/E22
- E19-E21 pueden desarrollarse con mocks y enchufarse luego → no bloquean al resto

---

## 13. Calendario de 8 semanas

### Semana 1 — Setup + fundación

- E0 (setup tooling, 3-4 días)
- E1 (monorepo + landing pública)
- E2 inicia (auth email/password + Google)
- E3 inicia (migrations iniciales: profiles, user_roles, framework)

**Checkpoint semana 1:** Ambos devs pueden pushear a ramas, CI pasa, landing en Vercel preview deploy.

### Semana 2 — Auth + RLS + Framework CRUD

- E2 completa (magic links, onboarding, reset password)
- E3 completa (todas las migrations + RLS policies)
- E4 completa (middleware, helpers, testing infra de RLS)
- E5 inicia (seed framework, CRUD dimensiones)
- E25 (feature flags base)
- E24 (helper de auditoría base)

**Checkpoint semana 2:** Un usuario se registra, se loguea, RLS funciona, Admin puede crear skills.

### Semana 3 — Design system + Dashboards shell + Relaciones

- E6 completa (design tokens, skill cards con flip, skill library)
- E7 completa (shells de los 5 dashboards + navegación)
- E8 inicia (invitaciones Coach→Profesional)
- E5 completa (CRUD full framework + export JSON)
- E26 inicia (Resend setup + templates base)

**Checkpoint semana 3:** Coach puede invitar Profesional, ambos ven sus dashboards shell con navegación.

### Semana 4 — Motor SkillBoards + Template 1

- E8 completa
- E9 completa (motor SkillBoards, contract, runtime, persistencia)
- E10 completa (Template 1: Diagnóstico inicial)
- E26 completa

**Checkpoint semana 4:** Un Coach puede ejecutar el Template 1 end-to-end con un Profesional y cerrarlo.

### Semana 5 — Templates 2 y 3 + Outputs

- E11 completa (Template 2: Skillset para rol)
- E13 completa (magic links + formularios externos)
- E12 completa (Template 3: Priorización asíncrona)
- E14 completa (outputs estructurados, PDF básico)

**Checkpoint semana 5:** Los 3 templates funcionan. Magic links externos funcionan. Outputs se persisten.

### Semana 6 — Plan acción + Objetivos + Evaluaciones mockup + IA chat

- E15 completa (plan de acción con estados)
- E16 completa (objetivos de desarrollo + drag&drop)
- E17 completa (evaluaciones mockup)
- E18 completa (reglas de evaluación)
- E19 (chatbot IA en 3 roles)

**Checkpoint semana 6:** Plan de acción operativo. Evaluaciones mockup navegables. Chatbot funciona.

### Semana 7 — IA estructurada + Admin + Dashboards con data real

- E20 completa (sugerencia IA de skillset)
- E21 completa (plan de acción con IA)
- E22 completa (dashboards con data real + radar placeholder)
- E23 completa (admin panel full)
- E27 (landing comercial + signup)

**Checkpoint semana 7:** Producto feature-complete. **Feature freeze.**

### Semana 8 — Hardening + QA + UAT

- E28 completa (rate limits, a11y, mobile, bot protection)
- E29 (QA interno + UAT con 2-3 coaches reales)
- Bugfixes críticos
- Documentación de usuario (básica: FAQ, guía Coach, guía Profesional)

**Checkpoint semana 8:** Lanzamiento beta con coaches reales.

---

## 14. Convenciones de código

### 14.1 TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- Prohibido `any`; si es necesario, `unknown` + refinement
- Interfaces sobre types para shapes públicos; type aliases para unions/intersections
- `import type` cuando solo se usa el tipo

### 14.2 Naming

- Componentes: PascalCase (`SkillCard.tsx`)
- Hooks: `useCamelCase` (`useSkillBoard.ts`)
- Server Actions: camelCase con verb (`createSkill`, `inviteProfessional`)
- Archivos de utilidades: kebab-case (`rate-limit.ts`)
- Variables: camelCase; constantes: UPPER_SNAKE_CASE
- Tablas DB: snake_case plural (`assigned_skills`); columnas: snake_case

### 14.3 Supabase

- **Nunca** usar service_role desde el cliente
- **Nunca** desactivar RLS en una tabla con datos de usuario
- Cada query en Server Component o Server Action usa `createServerClient()`
- Para cargas batch/seed: `createServiceClient()` solo desde scripts o Edge Functions

### 14.4 Server Actions vs Route Handlers

- Server Actions → default para mutaciones (forms, botones)
- Route Handlers → webhooks, streaming IA, uploads grandes, endpoints consumidos por clientes externos

### 14.5 Error handling

- Server Actions devuelven `{ ok: true, data } | { ok: false, error: { code, message } }`
- El cliente usa `useActionState()` de React 19 para UI
- Errores no esperados → Sentry + log audit + mensaje genérico al user

### 14.6 Imports ordenados

- 1. externos, 2) `@skillset360/*` (workspace), 3) `@/*` (app local), 4) relativos
- Configurado con ESLint import/order

### 14.7 Commits y PRs

- Conventional Commits (§8.5)
- PR template en `.github/pull_request_template.md` con:
  - What, Why, How tested
  - Screenshots si hay cambios visuales
  - Migrations involved (Y/N)
  - Feature flag required (Y/N)
  - Breaking change (Y/N)

---

## 15. Testing strategy

### 15.1 Pirámide

```
      ┌──────┐
      │ E2E  │  ← flows críticos por rol (~15 tests)
      └──────┘
     ┌────────┐
     │ Integ  │  ← Server Actions + RLS (~80 tests)
     └────────┘
   ┌────────────┐
   │   Unit     │  ← utils, validators, domain (~150 tests)
   └────────────┘
```

### 15.2 Unit tests (Vitest)

- `packages/validators/*.test.ts` → todo schema Zod con casos edge
- `lib/utils/*.test.ts` → helpers de fechas, strings, rate limits
- `lib/ai/anonymize.test.ts` → verifica que no pasa PII
- Target: ≥70% coverage en packages + `lib/`

### 15.3 Integration tests (Vitest + Supabase local)

- Cada Server Action tiene al menos 1 test de happy path
- Cada RLS policy tiene test "allowed" + "denied"
- Scripts:
  - `pnpm test:unit` → solo unit
  - `pnpm test:integration` → setup DB local y corre integration
  - `pnpm test:rls` → subset de integration específicamente para RLS
- CI corre los 3 en jobs paralelos

### 15.4 E2E (Playwright)

- 5 flows críticos:
  1. Coach se registra, invita Profesional, ejecuta SkillBoard, cierra, ve outputs
  2. Profesional acepta invitación, completa evaluación mockup, ve plan
  3. Selector crea proceso, define skillset con IA, invita candidato
  4. Candidato completa evaluación mockup
  5. Admin crea skill manualmente, la archiva, revisa auditoría
- Corren en CI en cada PR contra preview deploy

### 15.5 Mocks

- Anthropic mockeado en tests con fixtures (`mocks/anthropic/*.json`)
- Emails mockeados (Resend intercepted)
- Sin mocks de Supabase: se usa DB local real

### 15.6 Datos de prueba

- Script `pnpm seed:test` genera: 1 admin, 2 coaches, 5 profesionales, 2 selectores, 10 candidatos
- Reproducible y no depende de la seed de producción

---

## 16. Observabilidad y auditoría

### 16.1 Logs

- Todo error no esperado → Sentry
- Supabase logs para queries lentas (>1s)
- Vercel logs para edge/function logs

### 16.2 Métricas

- Vercel Analytics (Core Web Vitals)
- Custom: `ai_tokens_consumed`, `skillboards_closed`, `assessments_assigned`
- Dashboard en Supabase o Grafana (post-MVP)

### 16.3 Alertas

- Sentry: cualquier error nuevo
- Supabase: queries >5s, CPU >80%
- Costo IA: alerta si pasa de $50/día en Anthropic

### 16.4 Auditoría (business)

- Ver E24
- Exportable por admin
- Retención 30 días (MVP), extensible a 90 en Fase 2

---

## 17. Riesgos y mitigaciones

| Riesgo                                                                 | Prob  | Impacto | Mitigación                                                                            |
| ---------------------------------------------------------------------- | ----- | ------- | ------------------------------------------------------------------------------------- |
| Schema evoluciona mucho en sem 3-5 y migrations chocan entre devs      | Alta  | Medio   | Reglas claras en §8.3 + 1 persona "schema owner" por semana                           |
| RLS bugs filtran data                                                  | Media | Alto    | Tests RLS obligatorios por PR + audit de policies antes de lanzar                     |
| SkillBoard templates se vuelven muy complejos y cada uno toma 1 semana | Alta  | Alto    | Invertir fuerte en E9 (motor) + componentes reusables (DnD columns, LevelPicker)      |
| IA cuesta más de lo esperado                                           | Media | Medio   | Usar Haiku para chat (90% del volumen); cache de prompts; rate limits; alertas        |
| Gabriel no tiene framework de skills listo                             | Media | Alto    | Arrancar con placeholder (3 dims, 10 skills) y reemplazar cuando esté                 |
| Usuarios UAT encuentran UX confusa                                     | Alta  | Medio   | Reservar semana 8 completa para iteración; tener 2-3 UAT sessions tempranas (sem 5-6) |
| Supabase rate limits en plan free bloquean UAT                         | Baja  | Medio   | Monitorear uso en env dev; upgrade a Pro solo si se supera el límite cercano al UAT   |
| Dev clave enferma o rota a otro proyecto                               | Media | Alto    | Documentación en CLAUDE.md + README; pair programming en features críticas            |
| Conflicto Google OAuth callbacks entre envs                            | Baja  | Bajo    | Config separada por env desde día 1                                                   |
| Superpowers plugin sigue sin instalar                                  | Media | Bajo    | Usar Claude Code sin Superpowers; no es crítico — lo importante son MCPs              |

---

## 18. Criterios de cierre de Fase 1

### 18.1 Criterios funcionales (must have)

- [ ] 5 roles funcionan con RBAC enforcido por RLS
- [ ] Coach puede invitar Profesional, ejecutar 3+ templates, cerrarlos, generar plan
- [ ] Profesional ve dashboard con objetivos, habilidades priorizadas, acciones, evaluaciones asignadas
- [ ] Selector puede crear proceso, definir skillset con y sin IA, invitar candidatos
- [ ] Candidato completa evaluación mockup y ve mensaje final
- [ ] Admin gestiona framework completo + usuarios + licencias manuales + auditoría
- [ ] Magic links externos funcionan para terceros
- [ ] Emails transaccionales llegan
- [ ] IA: chatbot + sugerencias + plan de acción funcionan y están rate-limited
- [ ] Evaluaciones mockup son un shell completo (intro → items → cierre)
- [ ] Reglas de evaluación (1 activa, 2 en 6m, override) enforzadas

### 18.2 Criterios no funcionales

- [ ] Lighthouse ≥90 en landing, login, dashboards principales
- [ ] Mobile responsive (funciona bien en 375px)
- [ ] Accessibility: 0 violations críticas en axe
- [ ] Tests: unit ≥70% coverage, 100% de RLS policies cubiertas, 5 E2E flows verdes
- [ ] Auditoría captura los eventos del SRD §14
- [ ] Rate limits enforcidos en endpoints críticos
- [ ] 2 ambientes (dev/prod) + Vercel Preview Deployments configurados y estables
- [ ] Feature flags funcionan

### 18.3 Criterios de calidad (validación humana)

- [ ] 2 de 3 coaches UAT completan un flujo end-to-end sin ayuda
- [ ] 0 bugs críticos abiertos
- [ ] ≤5 bugs menores abiertos (documentados con workaround)
- [ ] Documentación usuario básica publicada

---

## 19. Qué queda fuera (Fase 2+)

### 19.1 Fase 2 (post-lanzamiento beta, ~3 meses)

- **Motor real de evaluaciones:** scoring, niveles, persistencia, recomendaciones
- **Integración Stripe:** pagos self-service, webhooks, estados de suscripción, variable billing por profesional/candidato
- **Radar charts reales** con data evaluada
- **Más templates** de SkillBoards (12-15 total)
- **Roleplays con IA** (con texto; voz queda pendiente de proveedor)
- **Notificaciones push** (web push + email batching)
- **Auditoría extendida** (90 días, filtros avanzados)
- **MFA para todos** los usuarios

### 19.2 Fase 3+

- SSO enterprise (SAML)
- Multi-tenancy real (organizaciones)
- Roleplays con voz (proveedor TBD)
- Motor configurable de SkillBoards (Admin crea templates sin código)
- Data residency (LATAM / EU / US)
- Analytics y benchmarking agregado anonimizado
- SOC2 / ISO readiness
- API pública para integraciones (ATS, LMS)

---

## Apéndice A — Checklist de QA por rol (a completar en semana 8)

_Se genera en la semana 7-8 a partir de las user stories de §11._

## Apéndice B — Glosario

- **SkillBoard:** canvas estructurado con template que guía una dinámica de mapeo/priorización de habilidades
- **Skillset:** conjunto de habilidades asociadas a un objetivo o rol
- **Dimensión:** agrupación de habilidades (5 en el framework: Inner Compass, Collaborative Synergy, Impactful Leadership, Next Frontier Thinking, Customer Centricity)
- **Magic link:** URL con token único, uso limitado, para acceso sin auth (a terceros) o para invitaciones
- **RLS:** Row Level Security de Postgres, donde las policies definen qué filas ve cada usuario
- **RBAC:** Role-Based Access Control, control de acceso basado en roles
- **Template:** definición de un tipo de SkillBoard (React component + metadata)
- **Participación asíncrona:** cuando dos roles completan partes distintas de un SkillBoard en momentos distintos

## Apéndice C — Referencias

- PRD (1).docx — Producto
- SRD.docx — Seguridad
- App flow (1).docx — Flujos por rol
- [Anthropic docs](https://docs.claude.com)
- [Supabase RLS guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js App Router](https://nextjs.org/docs/app)
- [dnd-kit](https://dndkit.com/)

---

**Fin del PLAN.md v1.0**

_Este documento es un living document. Actualizarlo al cierre de cada checkpoint semanal._
