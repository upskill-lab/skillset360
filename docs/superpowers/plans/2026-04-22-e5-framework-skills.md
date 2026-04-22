# E5 — Framework de Skills: Seed + CRUD Admin

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cargar el framework de skills en DB (5 dims, 15 skills placeholder, 75 niveles) e instalar shadcn/ui + construir el CRUD admin completo para que un Admin pueda gestionar dimensiones, skills y niveles sin tocar código.

**Architecture:** `packages/skill-framework/src/seed.json` es la fuente de verdad del contenido. `supabase/seed.sql` refleja ese contenido en SQL idempotente. Las páginas admin viven en el route group `(admin)` con layout propio que aplica `RoleGate`. Todas las mutaciones son Server Actions en `framework.ts` con validación Zod + redirect para errores — mismo patrón que `auth.ts`.

**Tech Stack:** Next.js 16.2.4 App Router (RSC + Server Actions), Supabase JS v2, shadcn/ui + Tailwind v4, Zod v4, React 19

---

## Mapa de archivos

| Archivo | Acción |
|---------|--------|
| `packages/skill-framework/src/seed.json` | Crear |
| `packages/skill-framework/src/index.ts` | Reemplazar |
| `supabase/seed.sql` | Crear |
| `apps/web/src/lib/actions/framework.ts` | Crear |
| `apps/web/src/app/(admin)/layout.tsx` | Crear |
| `apps/web/src/app/(admin)/_components/admin-sidebar.tsx` | Crear |
| `apps/web/src/app/403/page.tsx` | Crear |
| `apps/web/src/app/(admin)/admin/framework/dimensions/page.tsx` | Crear |
| `apps/web/src/app/(admin)/admin/framework/dimensions/_components/archive-dimension-button.tsx` | Crear |
| `apps/web/src/app/(admin)/admin/framework/dimensions/new/page.tsx` | Crear |
| `apps/web/src/app/(admin)/admin/framework/dimensions/[id]/edit/page.tsx` | Crear |
| `apps/web/src/app/(admin)/admin/framework/skills/page.tsx` | Crear |
| `apps/web/src/app/(admin)/admin/framework/skills/new/page.tsx` | Crear |
| `apps/web/src/app/(admin)/admin/framework/skills/[id]/page.tsx` | Crear |
| `apps/web/src/app/(admin)/admin/framework.json/route.ts` | Crear |

---

## Notas críticas de Next.js 16

> ⚠️ Antes de escribir cualquier page o layout, leer:
> `node_modules/next/dist/docs/02-app/02-api-reference/02-file-conventions/page.md`

- `searchParams` y `params` son **Promises** — siempre `await` ambos
- Server Actions devuelven `Promise<void>` — errores via `redirect('...?error=...')`
- `revalidatePath()` antes del `redirect()` final en mutaciones

---

## Task 1: Instalar shadcn/ui

**Files:**
- Create: `apps/web/components.json` (generado por shadcn)
- Modify: `apps/web/src/app/globals.css` (variables CSS — generado por shadcn)

- [ ] **Step 1: Correr init desde apps/web**

```bash
cd apps/web
npx shadcn@latest init --yes --style default --base-color neutral --css-variables true
```

Si pide confirmaciones interactivas, elegir:
- Style: **Default**
- Base color: **Neutral**
- CSS variables: **Yes**

- [ ] **Step 2: Instalar todos los componentes necesarios**

```bash
npx shadcn@latest add button input label textarea select badge table dialog alert-dialog form card separator skeleton
```

Responder **Yes** a todas las confirmaciones de instalación.

- [ ] **Step 3: Verificar que los componentes existen**

```bash
ls apps/web/src/components/ui/
```

Esperado: ver `button.tsx`, `table.tsx`, `badge.tsx`, `dialog.tsx`, `alert-dialog.tsx`, etc.

- [ ] **Step 4: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores. Si hay errores en archivos generados por shadcn, son normales en versiones canary — ignorar o parchear.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components.json apps/web/src/components/ui/ apps/web/src/lib/utils.ts apps/web/src/app/globals.css
git commit -m "feat(e5): install shadcn/ui — button, table, badge, dialog, form, card"
```

---

## Task 2: skill-framework package — seed.json + tipos

**Files:**
- Create: `packages/skill-framework/src/seed.json`
- Modify: `packages/skill-framework/src/index.ts`

- [ ] **Step 1: Crear seed.json**

Crear `packages/skill-framework/src/seed.json`:

```json
{
  "dimensions": [
    { "slug": "inner-compass", "name": "Inner Compass", "sort_order": 1, "description": "Autoconocimiento, gestión emocional y propósito personal." },
    { "slug": "collaborative-synergy", "name": "Collaborative Synergy", "sort_order": 2, "description": "Capacidad para crear relaciones de trabajo de alto valor." },
    { "slug": "impactful-leadership", "name": "Impactful Leadership", "sort_order": 3, "description": "Inspirar, decidir y responsabilizarse por resultados colectivos." },
    { "slug": "next-frontier-thinking", "name": "Next Frontier Thinking", "sort_order": 4, "description": "Pensamiento sistémico, innovación y agilidad de aprendizaje." },
    { "slug": "customer-centricity", "name": "Customer Centricity", "sort_order": 5, "description": "Orientación al cliente, empatía y cultura de feedback." }
  ],
  "skills": [
    { "slug": "self-awareness", "name": "Self-Awareness", "dimension": "inner-compass", "description": "Conocimiento profundo de las propias emociones, fortalezas y áreas de mejora." },
    { "slug": "resilience", "name": "Resilience", "dimension": "inner-compass", "description": "Capacidad de recuperarse ante adversidades y mantener el desempeño bajo presión." },
    { "slug": "emotional-regulation", "name": "Emotional Regulation", "dimension": "inner-compass", "description": "Gestión efectiva de las emociones propias en contextos de alta exigencia." },
    { "slug": "active-listening", "name": "Active Listening", "dimension": "collaborative-synergy", "description": "Escucha genuina y comprensión profunda de las perspectivas de otros." },
    { "slug": "conflict-resolution", "name": "Conflict Resolution", "dimension": "collaborative-synergy", "description": "Gestión constructiva de conflictos para fortalecer relaciones y resultados." },
    { "slug": "trust-building", "name": "Trust Building", "dimension": "collaborative-synergy", "description": "Generación de confianza sostenida a través de consistencia e integridad." },
    { "slug": "vision-setting", "name": "Vision Setting", "dimension": "impactful-leadership", "description": "Articulación clara de un futuro inspirador que moviliza a otros." },
    { "slug": "decision-making", "name": "Decision Making", "dimension": "impactful-leadership", "description": "Toma de decisiones ágiles y fundamentadas en contextos de incertidumbre." },
    { "slug": "accountability", "name": "Accountability", "dimension": "impactful-leadership", "description": "Responsabilidad personal y del equipo por compromisos y resultados." },
    { "slug": "systems-thinking", "name": "Systems Thinking", "dimension": "next-frontier-thinking", "description": "Comprensión de interrelaciones complejas y efectos de segundo orden." },
    { "slug": "innovation-mindset", "name": "Innovation Mindset", "dimension": "next-frontier-thinking", "description": "Apertura a explorar nuevas ideas y tolerar la ambigüedad del cambio." },
    { "slug": "learning-agility", "name": "Learning Agility", "dimension": "next-frontier-thinking", "description": "Velocidad para adquirir nuevas competencias y aplicarlas efectivamente." },
    { "slug": "customer-empathy", "name": "Customer Empathy", "dimension": "customer-centricity", "description": "Comprensión profunda de las necesidades y experiencias del cliente." },
    { "slug": "service-orientation", "name": "Service Orientation", "dimension": "customer-centricity", "description": "Disposición genuina a agregar valor en cada interacción con el cliente." },
    { "slug": "feedback-culture", "name": "Feedback Culture", "dimension": "customer-centricity", "description": "Capacidad de dar y recibir feedback de forma constructiva y continua." }
  ]
}
```

- [ ] **Step 2: Reemplazar index.ts con tipos y exports**

Reemplazar `packages/skill-framework/src/index.ts` con:

```typescript
import seedData from './seed.json'

export interface FrameworkDimension {
  slug: string
  name: string
  sort_order: number
  description: string
}

export interface FrameworkSkill {
  slug: string
  name: string
  dimension: string
  description: string
}

export interface FrameworkData {
  dimensions: FrameworkDimension[]
  skills: FrameworkSkill[]
}

export const FRAMEWORK_VERSION = '0.1.0-placeholder'

export const framework = seedData as FrameworkData
export const { dimensions, skills } = framework
```

- [ ] **Step 3: Asegurarse de que el tsconfig del package permite import de JSON**

En `packages/skill-framework/tsconfig.json`, verificar que tiene `"resolveJsonModule": true`. Si no lo tiene, agregarlo:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "resolveJsonModule": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Type-check del package**

```bash
cd packages/skill-framework && pnpm type-check
```

Esperado: 0 errores.

- [ ] **Step 5: Commit**

```bash
git add packages/skill-framework/src/seed.json packages/skill-framework/src/index.ts packages/skill-framework/tsconfig.json
git commit -m "feat(e5): skill-framework seed.json — 5 dims, 15 skills placeholder"
```

---

## Task 3: supabase/seed.sql + aplicar en DB

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Crear seed.sql**

Crear `supabase/seed.sql`:

```sql
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
```

- [ ] **Step 2: Aplicar el seed en la DB remota via Supabase MCP**

Usar el tool `mcp__claude_ai_Supabase__execute_sql` con `project_id: "jwjeezdzqmmjqwgtqhpn"` y el SQL completo del seed.sql.

- [ ] **Step 3: Verificar que los datos se cargaron**

Correr via MCP `execute_sql`:

```sql
SELECT
  d.name AS dimension,
  COUNT(s.id) AS skills,
  (SELECT COUNT(*) FROM skill_levels sl WHERE sl.skill_id = s.id LIMIT 1) AS has_levels
FROM dimensions d
LEFT JOIN skills s ON s.dimension_id = d.id
GROUP BY d.id, d.name
ORDER BY d.sort_order;
```

Esperado: 5 filas, cada una con 3 skills.

- [ ] **Step 4: Commit**

```bash
git add supabase/seed.sql
git commit -m "feat(e5): seed.sql — 5 dims + 15 skills + 75 niveles placeholder"
```

---

## Task 4: Server Actions — framework.ts

**Files:**
- Create: `apps/web/src/lib/actions/framework.ts`

- [ ] **Step 1: Crear framework.ts con schemas y todas las actions**

Crear `apps/web/src/lib/actions/framework.ts`:

```typescript
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

function encodeError(msg: string) {
  return encodeURIComponent(msg)
}

// ─── Schemas ────────────────────────────────────────────────────────────────

const DimensionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string().optional(),
})

const SkillSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  dimension_id: z.string().uuid('Seleccioná una dimensión válida'),
  description: z.string().optional(),
})

// ─── Dimensions ─────────────────────────────────────────────────────────────

export async function createDimension(formData: FormData): Promise<void> {
  const result = DimensionSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
  })
  if (!result.success) {
    redirect(`/admin/framework/dimensions/new?error=${encodeError(result.error.issues[0]?.message ?? 'Error de validación')}`)
  }
  const supabase = await createClient()
  const { error } = await supabase.from('dimensions').insert(result.data)
  if (error) {
    const msg = error.message.includes('unique') ? 'Ya existe una dimensión con ese slug.' : error.message
    redirect(`/admin/framework/dimensions/new?error=${encodeError(msg)}`)
  }
  revalidatePath('/admin/framework/dimensions')
  redirect('/admin/framework/dimensions')
}

export async function updateDimension(id: string, formData: FormData): Promise<void> {
  const result = DimensionSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
  })
  if (!result.success) {
    redirect(`/admin/framework/dimensions/${id}/edit?error=${encodeError(result.error.issues[0]?.message ?? 'Error de validación')}`)
  }
  const supabase = await createClient()
  const { error } = await supabase.from('dimensions').update(result.data).eq('id', id)
  if (error) {
    const msg = error.message.includes('unique') ? 'Ya existe una dimensión con ese slug.' : error.message
    redirect(`/admin/framework/dimensions/${id}/edit?error=${encodeError(msg)}`)
  }
  revalidatePath('/admin/framework/dimensions')
  redirect('/admin/framework/dimensions')
}

export async function archiveDimension(id: string): Promise<void> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('dimension_id', id)
    .eq('is_archived', false)

  if (count && count > 0) {
    redirect(`/admin/framework/dimensions?error=${encodeError('No se puede archivar: la dimensión tiene skills activas.')}`)
  }
  const { error } = await supabase.from('dimensions').update({ is_archived: true }).eq('id', id)
  if (error) redirect(`/admin/framework/dimensions?error=${encodeError(error.message)}`)
  revalidatePath('/admin/framework/dimensions')
  redirect('/admin/framework/dimensions')
}

// ─── Skills ─────────────────────────────────────────────────────────────────

export async function createSkill(formData: FormData): Promise<void> {
  const result = SkillSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    dimension_id: formData.get('dimension_id'),
    description: formData.get('description') || undefined,
  })
  if (!result.success) {
    redirect(`/admin/framework/skills/new?error=${encodeError(result.error.issues[0]?.message ?? 'Error de validación')}`)
  }
  const supabase = await createClient()
  const { data: skill, error } = await supabase
    .from('skills')
    .insert(result.data)
    .select('id')
    .single()
  if (error) {
    const msg = error.message.includes('unique') ? 'Ya existe una skill con ese slug.' : error.message
    redirect(`/admin/framework/skills/new?error=${encodeError(msg)}`)
  }
  // Crear los 5 niveles vacíos
  const levels = ([1, 2, 3, 4, 5] as const).map((n) => ({
    skill_id: skill.id,
    level: n,
    observable_behaviors: '',
  }))
  await supabase.from('skill_levels').insert(levels)
  revalidatePath('/admin/framework/skills')
  redirect(`/admin/framework/skills/${skill.id}`)
}

export async function updateSkill(id: string, formData: FormData): Promise<void> {
  const result = SkillSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    dimension_id: formData.get('dimension_id'),
    description: formData.get('description') || undefined,
  })
  if (!result.success) {
    redirect(`/admin/framework/skills/${id}?error=${encodeError(result.error.issues[0]?.message ?? 'Error de validación')}`)
  }
  const supabase = await createClient()
  const { error } = await supabase.from('skills').update(result.data).eq('id', id)
  if (error) {
    const msg = error.message.includes('unique') ? 'Ya existe una skill con ese slug.' : error.message
    redirect(`/admin/framework/skills/${id}?error=${encodeError(msg)}`)
  }
  revalidatePath(`/admin/framework/skills/${id}`)
  redirect(`/admin/framework/skills/${id}`)
}

export async function archiveSkill(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').update({ is_archived: true }).eq('id', id)
  if (error) redirect(`/admin/framework/skills/${id}?error=${encodeError(error.message)}`)
  revalidatePath('/admin/framework/skills')
  redirect('/admin/framework/skills')
}

// ─── Skill Levels ────────────────────────────────────────────────────────────

export async function updateSkillLevels(formData: FormData): Promise<void> {
  const skillId = String(formData.get('skill_id') ?? '')
  if (!skillId) redirect(`/admin/framework/skills?error=${encodeError('Skill inválida')}`)

  const levels = ([1, 2, 3, 4, 5] as const).map((n) => ({
    skill_id: skillId,
    level: n,
    observable_behaviors: String(formData.get(`level_${n}`) ?? ''),
  }))

  const supabase = await createClient()
  const { error } = await supabase
    .from('skill_levels')
    .upsert(levels, { onConflict: 'skill_id,level' })

  if (error) redirect(`/admin/framework/skills/${skillId}?error=${encodeError(error.message)}`)
  revalidatePath(`/admin/framework/skills/${skillId}`)
  redirect(`/admin/framework/skills/${skillId}?success=1`)
}
```

- [ ] **Step 2: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/actions/framework.ts
git commit -m "feat(e5): server actions — dimensions + skills + skill levels crud"
```

---

## Task 5: Admin layout + sidebar + 403

**Files:**
- Create: `apps/web/src/app/(admin)/layout.tsx`
- Create: `apps/web/src/app/(admin)/_components/admin-sidebar.tsx`
- Create: `apps/web/src/app/403/page.tsx`

- [ ] **Step 1: Crear 403/page.tsx**

Crear `apps/web/src/app/403/page.tsx`:

```tsx
export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">403</h1>
        <p className="mt-2 text-gray-600">No tenés permisos para acceder a esta sección.</p>
        <a href="/dashboard" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Ir al dashboard
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Crear admin-sidebar.tsx**

Crear `apps/web/src/app/(admin)/_components/admin-sidebar.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dimensiones', href: '/admin/framework/dimensions' },
  { label: 'Skills', href: '/admin/framework/skills' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-gray-50 p-4">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Skillset360</p>
        <p className="text-sm font-medium text-gray-900">Admin</p>
      </div>
      <nav className="space-y-1">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Framework
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              pathname.startsWith(item.href)
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 3: Crear (admin)/layout.tsx**

Crear `apps/web/src/app/(admin)/layout.tsx`:

```tsx
import { RoleGate } from '@/components/auth/role-gate'
import { AdminSidebar } from './_components/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="admin" fallback={null}>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </RoleGate>
  )
}
```

> Nota: `RoleGate` sin `fallback` redirige a `/403`. Aquí pasamos `fallback={null}` porque el layout no tiene un fallback — `RoleGate` hace redirect a `/403` cuando el rol no coincide.

Verificar en `apps/web/src/components/auth/role-gate.tsx` que el comportamiento de redirect es correcto. Si `fallback` es `null` y el rol no coincide, el componente redirige a `/403`.

- [ ] **Step 4: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/403/ apps/web/src/app/\(admin\)/
git commit -m "feat(e5): admin layout + sidebar + 403 page"
```

---

## Task 6: Dimensions list page

**Files:**
- Create: `apps/web/src/app/(admin)/admin/framework/dimensions/page.tsx`
- Create: `apps/web/src/app/(admin)/admin/framework/dimensions/_components/archive-dimension-button.tsx`

- [ ] **Step 1: Crear ArchiveDimensionButton (client component)**

Crear `apps/web/src/app/(admin)/admin/framework/dimensions/_components/archive-dimension-button.tsx`:

```tsx
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { archiveDimension } from '@/lib/actions/framework'

interface Props {
  id: string
  hasActiveSkills: boolean
}

export function ArchiveDimensionButton({ id, hasActiveSkills }: Props) {
  if (hasActiveSkills) {
    return (
      <Button variant="ghost" size="sm" disabled title="Tiene skills activas — archivalas primero">
        Archivar
      </Button>
    )
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Archivar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Archivar dimensión?</AlertDialogTitle>
          <AlertDialogDescription>
            La dimensión dejará de aparecer en el flujo activo. Se puede reactivar en cualquier
            momento editándola.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={async () => archiveDimension(id)}>
            Archivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 2: Crear dimensions/page.tsx**

Crear `apps/web/src/app/(admin)/admin/framework/dimensions/page.tsx`:

```tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArchiveDimensionButton } from './_components/archive-dimension-button'

export default async function DimensionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, slug, name, is_archived, sort_order')
    .order('sort_order')

  const { data: activeSkills } = await supabase
    .from('skills')
    .select('dimension_id')
    .eq('is_archived', false)

  const activeCountByDim = (activeSkills ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.dimension_id] = (acc[s.dimension_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dimensiones</h1>
        <Button asChild>
          <Link href="/admin/framework/dimensions/new">+ Nueva dimensión</Link>
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Skills activas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(dimensions ?? []).map((dim) => (
            <TableRow key={dim.id}>
              <TableCell className="font-medium">{dim.name}</TableCell>
              <TableCell className="font-mono text-sm text-gray-500">{dim.slug}</TableCell>
              <TableCell>{activeCountByDim[dim.id] ?? 0}</TableCell>
              <TableCell>
                <Badge variant={dim.is_archived ? 'secondary' : 'default'}>
                  {dim.is_archived ? 'Archivada' : 'Activa'}
                </Badge>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/framework/dimensions/${dim.id}/edit`}>Editar</Link>
                </Button>
                <ArchiveDimensionButton
                  id={dim.id}
                  hasActiveSkills={(activeCountByDim[dim.id] ?? 0) > 0}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/\(admin\)/admin/framework/dimensions/
git commit -m "feat(e5): dimensions list page + archive button"
```

---

## Task 7: Dimension create + edit forms

**Files:**
- Create: `apps/web/src/app/(admin)/admin/framework/dimensions/new/page.tsx`
- Create: `apps/web/src/app/(admin)/admin/framework/dimensions/[id]/edit/page.tsx`
- Create: `apps/web/src/app/(admin)/admin/framework/dimensions/_components/dimension-form.tsx`

- [ ] **Step 1: Crear DimensionForm (componente reutilizable)**

Crear `apps/web/src/app/(admin)/admin/framework/dimensions/_components/dimension-form.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface DimensionFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: { name?: string; slug?: string; description?: string }
  submitLabel?: string
  error?: string
}

export function DimensionForm({
  action,
  defaultValues,
  submitLabel = 'Guardar',
  error,
}: DimensionFormProps) {
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')
  const [slugManual, setSlugManual] = useState(!!defaultValues?.slug)

  return (
    <form action={action} className="max-w-lg space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
          onChange={(e) => {
            if (!slugManual) setSlug(slugify(e.target.value))
          }}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          required
          pattern="[a-z0-9-]+"
          onChange={(e) => {
            setSlugManual(true)
            setSlug(e.target.value)
          }}
        />
        <p className="text-xs text-gray-500">Solo letras minúsculas, números y guiones.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea id="description" name="description" defaultValue={defaultValues?.description} rows={3} />
      </div>

      <div className="flex gap-3">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="ghost" asChild>
          <a href="/admin/framework/dimensions">Cancelar</a>
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Crear new/page.tsx**

Crear `apps/web/src/app/(admin)/admin/framework/dimensions/new/page.tsx`:

```tsx
import { createDimension } from '@/lib/actions/framework'
import { DimensionForm } from '../_components/dimension-form'

export default async function NewDimensionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nueva dimensión</h1>
      <DimensionForm action={createDimension} submitLabel="Crear dimensión" error={error} />
    </div>
  )
}
```

- [ ] **Step 3: Crear [id]/edit/page.tsx**

Crear `apps/web/src/app/(admin)/admin/framework/dimensions/[id]/edit/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateDimension } from '@/lib/actions/framework'
import { DimensionForm } from '../../_components/dimension-form'

export default async function EditDimensionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: dimension } = await supabase
    .from('dimensions')
    .select('id, name, slug, description')
    .eq('id', id)
    .single()

  if (!dimension) notFound()

  const action = updateDimension.bind(null, id)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar dimensión</h1>
      <DimensionForm
        action={action}
        defaultValues={dimension}
        submitLabel="Guardar cambios"
        error={error}
      />
    </div>
  )
}
```

- [ ] **Step 4: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/\(admin\)/admin/framework/dimensions/
git commit -m "feat(e5): dimension create + edit forms"
```

---

## Task 8: Skills list page (paginación + filtros)

**Files:**
- Create: `apps/web/src/app/(admin)/admin/framework/skills/page.tsx`
- Create: `apps/web/src/app/(admin)/admin/framework/skills/_components/skills-filters.tsx`

- [ ] **Step 1: Crear SkillsFilters (client component para búsqueda)**

Crear `apps/web/src/app/(admin)/admin/framework/skills/_components/skills-filters.tsx`:

```tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCallback } from 'react'

interface Dimension {
  id: string
  name: string
}

export function SkillsFilters({ dimensions }: { dimensions: Dimension[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="mb-4 flex gap-3">
      <Input
        placeholder="Buscar skill..."
        defaultValue={searchParams.get('q') ?? ''}
        onChange={(e) => update('q', e.target.value)}
        className="max-w-xs"
      />
      <Select
        defaultValue={searchParams.get('dimension') ?? ''}
        onValueChange={(v) => update('dimension', v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Todas las dimensiones" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las dimensiones</SelectItem>
          {dimensions.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
```

- [ ] **Step 2: Crear skills/page.tsx**

Crear `apps/web/src/app/(admin)/admin/framework/skills/page.tsx`:

```tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SkillsFilters } from './_components/skills-filters'

const PAGE_SIZE = 20

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; dimension?: string; page?: string; error?: string }>
}) {
  const { q, dimension, page: pageStr, error } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let query = supabase
    .from('skills')
    .select('id, slug, name, is_archived, dimension_id, dimensions(name)', { count: 'exact' })
    .order('name')
    .range(from, to)

  if (q) query = query.ilike('name', `%${q}%`)
  if (dimension) query = query.eq('dimension_id', dimension)

  const { data: skills, count } = await query

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, name')
    .eq('is_archived', false)
    .order('sort_order')

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Button asChild>
          <Link href="/admin/framework/skills/new">+ Nueva skill</Link>
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <SkillsFilters dimensions={dimensions ?? []} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Dimensión</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(skills ?? []).map((skill) => (
            <TableRow key={skill.id} className="cursor-pointer hover:bg-gray-50">
              <TableCell className="font-medium">
                <Link href={`/admin/framework/skills/${skill.id}`} className="hover:underline">
                  {skill.name}
                </Link>
              </TableCell>
              <TableCell className="font-mono text-sm text-gray-500">{skill.slug}</TableCell>
              <TableCell>
                {Array.isArray(skill.dimensions)
                  ? skill.dimensions[0]?.name
                  : (skill.dimensions as { name: string } | null)?.name ?? '—'}
              </TableCell>
              <TableCell>
                <Badge variant={skill.is_archived ? 'secondary' : 'default'}>
                  {skill.is_archived ? 'Archivada' : 'Activa'}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/framework/skills/${skill.id}`}>Ver</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            {from + 1}–{Math.min(to + 1, count ?? 0)} de {count}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`?${new URLSearchParams({ ...(q ? { q } : {}), ...(dimension ? { dimension } : {}), page: String(page - 1) })}`}
                >
                  ← Anterior
                </Link>
              </Button>
            )}
            {page < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`?${new URLSearchParams({ ...(q ? { q } : {}), ...(dimension ? { dimension } : {}), page: String(page + 1) })}`}
                >
                  Siguiente →
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores. Si hay error en el tipo de `skill.dimensions`, ajustar el cast según lo que retorne Supabase (puede ser `{ name: string }` o `{ name: string }[]`).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/\(admin\)/admin/framework/skills/page.tsx apps/web/src/app/\(admin\)/admin/framework/skills/_components/
git commit -m "feat(e5): skills list page — pagination + dimension filter + search"
```

---

## Task 9: Skill create form

**Files:**
- Create: `apps/web/src/app/(admin)/admin/framework/skills/_components/skill-form.tsx`
- Create: `apps/web/src/app/(admin)/admin/framework/skills/new/page.tsx`

- [ ] **Step 1: Crear SkillForm (reutilizable para create + edit)**

Crear `apps/web/src/app/(admin)/admin/framework/skills/_components/skill-form.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface Dimension {
  id: string
  name: string
}

interface SkillFormProps {
  action: (formData: FormData) => Promise<void>
  dimensions: Dimension[]
  defaultValues?: { name?: string; slug?: string; dimension_id?: string; description?: string }
  submitLabel?: string
  error?: string
}

export function SkillForm({
  action,
  dimensions,
  defaultValues,
  submitLabel = 'Guardar',
  error,
}: SkillFormProps) {
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')
  const [slugManual, setSlugManual] = useState(!!defaultValues?.slug)

  return (
    <form action={action} className="max-w-lg space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
          onChange={(e) => {
            if (!slugManual) setSlug(slugify(e.target.value))
          }}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          required
          pattern="[a-z0-9-]+"
          onChange={(e) => {
            setSlugManual(true)
            setSlug(e.target.value)
          }}
        />
        <p className="text-xs text-gray-500">Solo letras minúsculas, números y guiones.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="dimension_id">Dimensión</Label>
        <Select name="dimension_id" defaultValue={defaultValues?.dimension_id} required>
          <SelectTrigger id="dimension_id">
            <SelectValue placeholder="Seleccioná una dimensión" />
          </SelectTrigger>
          <SelectContent>
            {dimensions.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="ghost" asChild>
          <a href="/admin/framework/skills">Cancelar</a>
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Crear skills/new/page.tsx**

Crear `apps/web/src/app/(admin)/admin/framework/skills/new/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { createSkill } from '@/lib/actions/framework'
import { SkillForm } from '../_components/skill-form'

export default async function NewSkillPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, name')
    .eq('is_archived', false)
    .order('sort_order')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nueva skill</h1>
      <SkillForm
        action={createSkill}
        dimensions={dimensions ?? []}
        submitLabel="Crear skill"
        error={error}
      />
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/\(admin\)/admin/framework/skills/new/ apps/web/src/app/\(admin\)/admin/framework/skills/_components/skill-form.tsx
git commit -m "feat(e5): skill create form"
```

---

## Task 10: Skill detail + edit + levels editor

**Files:**
- Create: `apps/web/src/app/(admin)/admin/framework/skills/[id]/page.tsx`
- Create: `apps/web/src/app/(admin)/admin/framework/skills/[id]/_components/skill-levels-form.tsx`
- Create: `apps/web/src/app/(admin)/admin/framework/skills/[id]/_components/archive-skill-button.tsx`

- [ ] **Step 1: Crear ArchiveSkillButton**

Crear `apps/web/src/app/(admin)/admin/framework/skills/[id]/_components/archive-skill-button.tsx`:

```tsx
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { archiveSkill } from '@/lib/actions/framework'

export function ArchiveSkillButton({ id }: { id: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Archivar skill
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Archivar skill?</AlertDialogTitle>
          <AlertDialogDescription>
            La skill dejará de aparecer en el flujo de asignación. Los datos históricos se
            conservan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={async () => archiveSkill(id)}>Archivar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

- [ ] **Step 2: Crear SkillLevelsForm**

Crear `apps/web/src/app/(admin)/admin/framework/skills/[id]/_components/skill-levels-form.tsx`:

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateSkillLevels } from '@/lib/actions/framework'

interface Level {
  level: number
  observable_behaviors: string | null
}

const LEVEL_LABELS = ['', 'Inicial', 'En desarrollo', 'Competente', 'Avanzado', 'Experto']

export function SkillLevelsForm({ skillId, levels }: { skillId: string; levels: Level[] }) {
  const sortedLevels = [...levels].sort((a, b) => a.level - b.level)

  return (
    <form action={updateSkillLevels} className="space-y-4">
      <input type="hidden" name="skill_id" value={skillId} />
      {sortedLevels.map((lvl) => (
        <Card key={lvl.level}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">
              Nivel {lvl.level} — {LEVEL_LABELS[lvl.level]}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Label htmlFor={`level_${lvl.level}`} className="sr-only">
              Comportamientos observables nivel {lvl.level}
            </Label>
            <Textarea
              id={`level_${lvl.level}`}
              name={`level_${lvl.level}`}
              defaultValue={lvl.observable_behaviors ?? ''}
              rows={4}
              placeholder="Describí los comportamientos observables para este nivel..."
            />
          </CardContent>
        </Card>
      ))}
      <Button type="submit">Guardar niveles</Button>
    </form>
  )
}
```

- [ ] **Step 3: Crear skills/[id]/page.tsx**

Crear `apps/web/src/app/(admin)/admin/framework/skills/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { updateSkill } from '@/lib/actions/framework'
import { SkillForm } from '../_components/skill-form'
import { SkillLevelsForm } from './_components/skill-levels-form'
import { ArchiveSkillButton } from './_components/archive-skill-button'

export default async function SkillDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { id } = await params
  const { error, success } = await searchParams
  const supabase = await createClient()

  const { data: skill } = await supabase
    .from('skills')
    .select('id, name, slug, description, is_archived, dimension_id, dimensions(name)')
    .eq('id', id)
    .single()

  if (!skill) notFound()

  const { data: levels } = await supabase
    .from('skill_levels')
    .select('level, observable_behaviors')
    .eq('skill_id', id)
    .order('level')

  const { data: dimensions } = await supabase
    .from('dimensions')
    .select('id, name')
    .eq('is_archived', false)
    .order('sort_order')

  const dimName = Array.isArray(skill.dimensions)
    ? skill.dimensions[0]?.name
    : (skill.dimensions as { name: string } | null)?.name

  const updateSkillWithId = updateSkill.bind(null, id)

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{skill.name}</h1>
            <Badge variant={skill.is_archived ? 'secondary' : 'default'}>
              {skill.is_archived ? 'Archivada' : 'Activa'}
            </Badge>
          </div>
          {dimName && <p className="mt-1 text-sm text-gray-500">{dimName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/framework/skills">← Volver</Link>
          </Button>
          {!skill.is_archived && <ArchiveSkillButton id={id} />}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Niveles guardados correctamente.
        </div>
      )}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-medium">Datos generales</h2>
        <SkillForm
          action={updateSkillWithId}
          dimensions={dimensions ?? []}
          defaultValues={{
            name: skill.name,
            slug: skill.slug,
            dimension_id: skill.dimension_id,
            description: skill.description ?? undefined,
          }}
          submitLabel="Guardar cambios"
          error={undefined}
        />
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="mb-4 text-lg font-medium">Comportamientos observables por nivel</h2>
        <SkillLevelsForm skillId={id} levels={levels ?? []} />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/\(admin\)/admin/framework/skills/\[id\]/
git commit -m "feat(e5): skill detail — edit + levels editor + archive"
```

---

## Task 11: JSON export route

**Files:**
- Create: `apps/web/src/app/(admin)/admin/framework.json/route.ts`

- [ ] **Step 1: Crear route handler**

Crear `apps/web/src/app/(admin)/admin/framework.json/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getRole } from '@/lib/session'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const role = await getRole()
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = await createClient()

  const [{ data: dimensions }, { data: skills }, { data: levels }] = await Promise.all([
    supabase.from('dimensions').select('*').order('sort_order'),
    supabase.from('skills').select('*').order('name'),
    supabase.from('skill_levels').select('*').order('skill_id, level'),
  ])

  const payload = {
    exported_at: new Date().toISOString(),
    dimensions,
    skills,
    levels,
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="framework.json"',
    },
  })
}
```

- [ ] **Step 2: Agregar link de descarga en la sidebar**

Modificar `apps/web/src/app/(admin)/_components/admin-sidebar.tsx` — agregar al final del nav:

```tsx
// Agregar después del cierre de </nav>:
<div className="mt-auto pt-4 border-t">
  <a
    href="/admin/framework.json"
    className="block rounded-md px-3 py-2 text-xs text-gray-500 hover:bg-gray-200"
    download
  >
    ↓ Exportar framework JSON
  </a>
</div>
```

- [ ] **Step 3: Type-check**

```bash
cd apps/web && pnpm type-check
```

Esperado: 0 errores.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/\(admin\)/admin/framework.json/ apps/web/src/app/\(admin\)/_components/admin-sidebar.tsx
git commit -m "feat(e5): json export route + sidebar link"
```

---

## Task 12: Type-check final + verificación DoD

- [ ] **Step 1: Type-check global**

```bash
cd c:/dev/skillset360 && pnpm --filter @skillset360/web type-check && pnpm --filter @skillset360/skill-framework type-check
```

Esperado: 0 errores en ambos paquetes.

- [ ] **Step 2: Verificar seed en DB**

Via MCP execute_sql en proyecto `jwjeezdzqmmjqwgtqhpn`:

```sql
SELECT
  d.name AS dimension,
  COUNT(DISTINCT s.id) AS skills,
  COUNT(sl.id) AS levels
FROM dimensions d
LEFT JOIN skills s ON s.dimension_id = d.id AND s.is_archived = false
LEFT JOIN skill_levels sl ON sl.skill_id = s.id
GROUP BY d.id, d.name
ORDER BY d.sort_order;
```

Esperado: 5 filas, 3 skills y 15 niveles cada una.

- [ ] **Step 3: Verificar DoD del spec**

- [ ] `seed.sql` idempotente cargó 5 dims + 15 skills + 75 niveles
- [ ] Admin puede listar, crear, editar y archivar dimensiones
- [ ] Admin puede listar (con filtros), crear, editar y archivar skills
- [ ] Admin puede editar los 5 niveles de cualquier skill
- [ ] Admin puede descargar framework como JSON
- [ ] Un non-admin que accede a `/admin/*` es redirigido a `/403`
- [ ] Type-check: 0 errores

- [ ] **Step 4: Commit final si hay cambios sin commitear**

```bash
git add -A
git commit -m "feat(e5): framework skills — seed + admin crud completo"
```
