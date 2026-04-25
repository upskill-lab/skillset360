---
tags: [index, navegacion]
updated: 2026-04-25
source-of-truth: "Vault/Specs/PLAN.md"
---

# Índice de navegación — Skillset360°

> Capa de navegación sobre PLAN.md. Cargá solo las secciones relevantes a la sesión en curso. **Nunca leas PLAN.md entero.**

## 1. Estado del proyecto

- **Semana en curso:** 4 de 8 — inicia 2026-04-27. Progreso adelantado vs. calendario original.
- **Tracks activos:** `track-plataforma` (E5 ✅ → E6 desbloqueada)
- **Próxima épica desbloqueada:** E6 (design system) → habilita E7 → E8 → abre `track-skillboards`
- **Bloqueadores:** ninguno técnico. E9, E17, E19 no pueden arrancar hasta tener E7 + E14
- **Última actualización:** 2026-04-25

## 2. Navegación a PLAN.md por tipo de sesión

### Sesión de DB / migrations / RLS
- [[Specs/PLAN#5. Modelo de datos (schema inicial)]]
- [[Specs/PLAN#6. RBAC con Supabase RLS]]
- [[Specs/PLAN#14.3 Supabase]]
- [[Specs/PLAN#15.3 Integration tests (Vitest + Supabase local)]]

### Sesión de UI / componentes / design system
- [[Specs/PLAN#3.1 Frontend]]
- [[Specs/PLAN#Épica E6 — Design system + Skill Cards + Skill Library]]
- [[Specs/PLAN#Épica E7 — Dashboards base por rol (shells vacíos con navegación)]]

### Sesión de SkillBoards (motor o templates)
- [[Specs/PLAN#5.4 SkillBoards]]
- [[Specs/PLAN#Épica E9 — Motor de SkillBoards: contrato, runtime, estado, persistencia]]
- [[Specs/PLAN#Épica E10 — Template 1: Diagnóstico inicial de habilidades (Desarrollo, 1:1)]]
- [[Specs/PLAN#Épica E11 — Template 2: Definición de skillset para rol (Selección)]]
- [[Specs/PLAN#Épica E12 — Template 3: Priorización de objetivos de desarrollo (asíncrono, Profesional participa)]]

### Sesión de IA (chatbot, sugerencias, generación)
- [[Specs/PLAN#7. Estrategia de IA]]
- [[Specs/PLAN#Épica E19 — IA: chatbot contextual en dashboards]]
- [[Specs/PLAN#Épica E20 — IA: sugerencia de skillset desde descripción de rol]]
- [[Specs/PLAN#Épica E21 — IA: generación de plan de acción]]

### Sesión de evaluaciones mockup
- [[Specs/PLAN#5.6 Evaluaciones (mockup en Fase 1)]]
- [[Specs/PLAN#Épica E17 — Evaluaciones mockup: shell navegable por rol]]
- [[Specs/PLAN#Épica E18 — Reglas de evaluación (1 activa, 2 en 6m, override Coach)]]

### Sesión de admin / framework de skills
- [[Specs/PLAN#5.3 Framework de skills]]
- [[Specs/PLAN#Épica E5 — Framework de Skills: seed + CRUD Admin]]
- [[Specs/PLAN#Épica E23 — Admin panel completo]]

### Sesión de auth / RBAC
- [[Specs/PLAN#5.1 Identidad y acceso]]
- [[Specs/PLAN#6. RBAC con Supabase RLS]]
- [[Specs/PLAN#Épica E2 — Auth + onboarding]]
- [[Specs/PLAN#Épica E4 — RBAC: middleware + helpers + testing infra]]

### Sesión de checkpoint semanal / actualización de PLAN
- [[Specs/PLAN#12. Grafo de dependencias y paralelización]]
- [[Specs/PLAN#13. Calendario de 8 semanas]]
- [[Specs/PLAN#18. Criterios de cierre de Fase 1]]

## 3. Contexto crítico (siempre relevante)

- [[Specs/PLAN#2. Decisiones arquitectónicas fijadas]] — D1-D14 inmutables
- [[Specs/PLAN#3. Stack tecnológico]]
- [[Specs/PLAN#8. Estrategia de colaboración: worktrees, branches, PRs]]
- [[Specs/PLAN#14. Convenciones de código]]

## 4. Tracks operativos

| Track | Estado | Épicas | Dev (sec. 12.4) | Nota |
|-------|--------|--------|-----------------|------|
| Fundación | ✅ Cerrado | E0, E1, E2, E3, E4 | DEV A | — |
| Plataforma | 🟡 En curso | E5 ✅, E6, E22, E23, E24, E25, E26, E27 | A + B | [[Tracks/track-plataforma]] |
| SkillBoards | ⚪ Esperando E7 | E9, E10, E11, E12, E13, E14, E15, E16 | DEV C | [[Tracks/track-skillboards]] |
| IA | ⚪ Esperando E14 | E19, E20, E21 | DEV C | [[Tracks/track-ia]] |
| Evaluaciones | ⚪ Esperando E14 | E17, E18 | DEV C | [[Tracks/track-evaluaciones]] |
| Cierre | ⚪ No arrancado | E28, E29 | A + B | [[Tracks/track-cierre]] |
