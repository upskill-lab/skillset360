# E5 — Framework de Skills: Seed + CRUD Admin

**Fecha:** 2026-04-22
**Épica:** E5 (depende de E3, E4)
**Estado:** Aprobado — listo para implementación

---

## Contexto

Skillset360° tiene un framework propietario de ~60-80 habilidades organizadas en 5 dimensiones, cada una con 5 niveles de comportamientos observables. El framework vive en la DB (tablas `dimensions`, `skills`, `skill_levels` — ya migradas en E3) y es editable exclusivamente por Admin.

En E5 se carga el contenido inicial (seed provisional) y se construye el admin CRUD completo. La lista definitiva de skills llega en ~1 semana; el seed provisional usa 3 skills por dimensión (15 total) y se reemplaza con un solo `DELETE + re-seed`.

---

## Dimensiones del framework (definitivas)

| Slug | Nombre |
|------|--------|
| `inner-compass` | Inner Compass |
| `collaborative-synergy` | Collaborative Synergy |
| `impactful-leadership` | Impactful Leadership |
| `next-frontier-thinking` | Next Frontier Thinking |
| `customer-centricity` | Customer Centricity |

---

## Arquitectura

### 1. Fuente de verdad del framework

```
packages/skill-framework/src/
  seed.json          ← datos del framework (dims + skills + niveles)
  index.ts           ← exporta tipos TypeScript + loadFramework()
  tsconfig.json
```

`seed.json` es el único lugar donde vive el contenido del framework en código. El seed SQL lo lee y hace `INSERT … ON CONFLICT DO NOTHING` para ser idempotente.

### 2. Seed SQL

```
supabase/seed.sql
```

Inserta las 5 dimensiones, ~15 skills placeholder (3 por dim) y 5 niveles por skill. Idempotente: usa `ON CONFLICT (slug) DO NOTHING` en dims/skills y `ON CONFLICT (skill_id, level) DO NOTHING` en niveles.

### 3. shadcn/ui

Se instala completo en E5 (no el mínimo). Componentes requeridos:

```
button input label textarea select badge table dialog alert-dialog
form card separator skeleton toast
```

Se instala en `apps/web`. Los componentes quedan en `apps/web/src/components/ui/`.

### 4. Rutas del admin

Route group `(admin)` con layout propio (RoleGate + sidebar). Todas las rutas requieren rol `admin`.

```
apps/web/src/app/
  (admin)/
    layout.tsx                          ← RoleGate admin + sidebar
    admin/
      framework/
        dimensions/
          page.tsx                      ← E5.2: lista de dimensiones
          new/page.tsx                  ← E5.2: crear dimensión
          [id]/edit/page.tsx            ← E5.2: editar dimensión
        skills/
          page.tsx                      ← E5.3: tabla paginada + filtros
          new/page.tsx                  ← E5.3: crear skill
          [id]/page.tsx                 ← E5.4: detalle skill + 5 niveles editables
      framework.json/
        route.ts                        ← E5.5: GET → descarga JSON completo
```

### 5. Server Actions

```
apps/web/src/lib/actions/framework.ts
```

Todas las mutaciones como Server Actions. Patrón idéntico a `auth.ts`:
- `Promise<void>`, errores via `redirect('...?error=mensaje')`
- Zod validation en cada action antes de tocar la DB
- RLS enforcea que solo admin puede escribir (policy `*_admin` ya existe)

**Actions:**
- `createDimension(formData)`
- `updateDimension(id, formData)`
- `archiveDimension(id)`
- `createSkill(formData)`
- `updateSkill(id, formData)`
- `archiveSkill(id)`
- `updateSkillLevels(skillId, levels[])` — guarda los 5 niveles en un batch; `levels` es `Array<{ level: 1|2|3|4|5, observable_behaviors: string }>`

### 6. Editor de comportamientos observables (E5.4)

`<textarea>` estándar. Los behaviors son texto libre sin renderizado en esta vista. Si en UAT (semana 8) se necesita preview markdown, se agrega en E6.

---

## Páginas en detalle

### `/admin/framework/dimensions`
- Tabla con columnas: nombre, slug, skills activas (count), estado (activa/archivada), acciones
- Botón "Nueva dimensión" → `/admin/framework/dimensions/new`
- Archivar: alert-dialog de confirmación. Bloquea si tiene skills activas.
- No hay hard delete.

### `/admin/framework/dimensions/new` y `[id]/edit`
- Form: nombre (text), slug (auto-generado desde nombre, editable), descripción (textarea)
- Validación Zod: nombre requerido, slug único (validado en action)

### `/admin/framework/skills`
- Tabla paginada (20 por página): nombre, dimensión (badge), estado
- Filtros: select de dimensión + input de búsqueda por nombre — ambos como URL search params (`?dimension=...&q=...&page=...`), sin client state
- Click en fila → `/admin/framework/skills/[id]`
- Botón "Nueva skill"

### `/admin/framework/skills/new`
- Form: nombre, slug, dimensión (select), descripción (textarea)

### `/admin/framework/skills/[id]`
- Header: nombre + dimensión + badge estado + botón archivar
- 5 cards de nivel colapsables, cada una con textarea de behaviors observables
- Botón "Guardar niveles" → `updateSkillLevels` action (batch)

### `GET /admin/framework.json`
- Route handler que lee toda la data de `dimensions + skills + skill_levels`
- Responde con `Content-Disposition: attachment; filename="framework.json"`
- Solo accesible con session activa de admin (verificado en el route handler)

---

## Datos provisionales (seed.json)

```json
{
  "dimensions": [
    { "slug": "inner-compass", "name": "Inner Compass", "sort_order": 1 },
    { "slug": "collaborative-synergy", "name": "Collaborative Synergy", "sort_order": 2 },
    { "slug": "impactful-leadership", "name": "Impactful Leadership", "sort_order": 3 },
    { "slug": "next-frontier-thinking", "name": "Next Frontier Thinking", "sort_order": 4 },
    { "slug": "customer-centricity", "name": "Customer Centricity", "sort_order": 5 }
  ],
  "skills": [
    { "slug": "self-awareness", "name": "Self-Awareness", "dimension": "inner-compass" },
    { "slug": "resilience", "name": "Resilience", "dimension": "inner-compass" },
    { "slug": "emotional-regulation", "name": "Emotional Regulation", "dimension": "inner-compass" },
    { "slug": "active-listening", "name": "Active Listening", "dimension": "collaborative-synergy" },
    { "slug": "conflict-resolution", "name": "Conflict Resolution", "dimension": "collaborative-synergy" },
    { "slug": "trust-building", "name": "Trust Building", "dimension": "collaborative-synergy" },
    { "slug": "vision-setting", "name": "Vision Setting", "dimension": "impactful-leadership" },
    { "slug": "decision-making", "name": "Decision Making", "dimension": "impactful-leadership" },
    { "slug": "accountability", "name": "Accountability", "dimension": "impactful-leadership" },
    { "slug": "systems-thinking", "name": "Systems Thinking", "dimension": "next-frontier-thinking" },
    { "slug": "innovation-mindset", "name": "Innovation Mindset", "dimension": "next-frontier-thinking" },
    { "slug": "learning-agility", "name": "Learning Agility", "dimension": "next-frontier-thinking" },
    { "slug": "customer-empathy", "name": "Customer Empathy", "dimension": "customer-centricity" },
    { "slug": "service-orientation", "name": "Service Orientation", "dimension": "customer-centricity" },
    { "slug": "feedback-culture", "name": "Feedback Culture", "dimension": "customer-centricity" }
  ]
}
```

Cada skill tiene 5 niveles con texto placeholder: `"Placeholder — nivel {n} de {skill_name}"`.

---

## Seguridad

- RLS policies `*_admin` (existentes desde E3) bloquean escritura a non-admins a nivel DB
- `RoleGate` en `(admin)/layout.tsx` bloquea acceso a la UI
- Route handler de export verifica session admin antes de responder
- Zod valida todo input antes de llegar a la DB

---

## Lo que NO entra en E5

- Editor markdown para behaviors (E6+)
- Colores/iconos de dimensión (E6 — design system)
- Reorder drag & drop de skills (E6+)
- Historial de cambios del framework (E24 — auditoría)
- CRUD de usuarios y licencias desde admin (E23)

---

## Definition of Done

- [ ] `supabase/seed.sql` idempotente carga las 5 dims + 15 skills + 75 niveles placeholder
- [ ] Admin puede listar, crear, editar y archivar dimensiones
- [ ] Admin puede listar (con filtros), crear, editar y archivar skills
- [ ] Admin puede editar los 5 niveles de cualquier skill
- [ ] Admin puede descargar el framework completo como JSON
- [ ] Un non-admin que accede a `/admin/*` es redirigido a `/403`
- [ ] Type-check: 0 errores
