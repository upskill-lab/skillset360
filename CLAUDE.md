# CLAUDE.md — Skillset360°

> **Source of truth:** `Vault/Specs/PLAN.md` (no tocar sin redefinición explícita).
> **Puerta de entrada:** `Vault/INDEX.md` (mapa navegable).

## Reglas obligatorias para Claude Code

### 1. Arranque de sesión
Al inicio de **toda** sesión, leé `Vault/INDEX.md`. **Nunca** leas `Vault/Specs/PLAN.md` completo — son 2718 líneas que reventarían el contexto. El INDEX te dice qué secciones cargar según el tipo de sesión.

**Excepción — modo checkpoint / actualización del PLAN:** En sesiones de checkpoint semanal o de modificación de PLAN.md, sí podés cargar secciones extensas (típicamente 10, 11, 12, 13), pero **solo las que estés modificando**. Avisá explícitamente cuando entrés en este modo (ej. "Entro en modo checkpoint, cargo sección 12 completa").

### 2. Carga selectiva por tipo de sesión
El bloque 2 del INDEX agrupa wikilinks por tipo de sesión (DB, UI, SkillBoards, IA, evaluaciones, admin, auth, checkpoint). Cargá solo las secciones de PLAN.md listadas para el tipo en curso. Si la sesión no encaja en ninguna categoría, leé bloque 3 (contexto crítico) y preguntá antes de cargar más.

### 3. Decisiones inmutables
Las decisiones **D1-D14** en `[[Specs/PLAN#2. Decisiones arquitectónicas fijadas]]` son inmutables durante Fase 1. Si una tarea sugiere modificarlas, **parar y consultar con Gabriel** — no improvisar workarounds.

### 4. Decisiones operativas durante una sesión
Si surge una decisión técnica no cubierta por PLAN.md (ej. patrón de un lib nuevo, workaround de tipo, convención de nombres no estandarizada), registrala en `Vault/Tracks/track-XXX.md` del track en curso. Si el archivo no existe, creálo. Estas decisiones se **promueven a PLAN.md en el checkpoint semanal** — no las dejes solo en memoria de la conversación.

## Estructura del vault

- `Vault/INDEX.md` — puerta de entrada (~75 líneas)
- `Vault/Specs/PLAN.md` — plan maestro inmutable
- `Vault/Tracks/` — notas operativas por track (se crean on-demand)
- `Vault/Sessions/` — handoffs entre sesiones

## Convenciones rápidas (overrides al PLAN)

Ninguna por ahora. Si surge una desviación, documentarla acá citando la sección de PLAN que se está modulando.
