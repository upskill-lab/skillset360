# Session Handoff — 2026-04-21

## Lo que se completó hoy

**E2 (Auth layer) + E3 (DB Schema + RLS)** — commit `feat(e2+e3): auth + DB schema + RLS` en branch `develop`.  
33 archivos, 3124 inserciones. Type-check limpio.

---

## Errores resueltos — el núcleo de la sesión

### 1. Supabase CLI sin privilegios de linking
`supabase link` falló con `ERR: Your account does not have the necessary privileges`.  
**Solución:** Se abandonó el CLI para el linking y se usó el **MCP Supabase plugin** autenticado via OAuth directamente desde el agente. Toda la ejecución de SQL (apply_migration, execute_sql) se hizo por MCP, no por CLI.

---

### 2. Zod v4 — `.errors` no existe
En Zod v4, `ZodError.errors` fue renombrado a `ZodError.issues`.  
```ts
// ❌ Zod v3
error.errors[0]?.message

// ✅ Zod v4
error.issues[0]?.message
```
**Afectado:** `apps/web/src/lib/actions/auth.ts` — todas las validaciones de formulario.

---

### 3. Server Actions no pueden retornar tipos customizados
El tipo `Promise<AuthActionResult>` no era asignable a `Promise<void>` que Next.js espera en `action={}` de un `<form>`.  
**Solución:** Todas las Server Actions devuelven `Promise<void>`. Los errores se comunican via redirect con query params (`?error=mensaje`), que el Server Component lee desde `searchParams`.

---

### 4. `Cannot find name 'Tables'` en `packages/types/src/index.ts`
Se usó `Tables<'profiles'>` sin importar `Tables` en scope.  
```ts
// ❌
export type Profile = Tables<'profiles'>

// ✅
import type { Tables as TablesHelper } from './db'
export type Profile = TablesHelper<'profiles'>
```

---

### 5. `cookiesToSet: any` — tipo implícito en server.ts y middleware.ts
`@supabase/ssr` no exporta el tipo del callback `setAll`, así que TypeScript infería `any`.  
**Solución:** Anotar explícitamente:
```ts
setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) { ... }
```

---

### 6. `parameter of type 'never'` en `.update()` — el bug más profundo
El error parecía un problema de tipos en las políticas RLS, pero la causa raíz era **incompatibilidad de versiones**:  
- `supabase-js@2.104.0` requiere `@supabase/ssr >= 0.10.x`  
- El proyecto tenía `@supabase/ssr@0.5.0`

Con la versión incorrecta, los tipos genéricos de `Database` se resolvían como `never` en operaciones de escritura.  
**Solución:** `@supabase/ssr` bumpeado de `^0.5.0` a `^0.10.2` en `apps/web/package.json`.

---

### 7. `exactOptionalPropertyTypes: true` rompe los tipos de Supabase
Los tipos `Update` de Supabase tienen propiedades opcionales que no satisfacen `Record<string, unknown>` (restricción interna de `GenericTable`).  
**Solución:** Se eliminó `"exactOptionalPropertyTypes": true` del `tsconfig.json` raíz. Es una decisión pragmática documentada — Supabase no es compatible con esta opción de TS.

---

### 8. `__InternalSupabase` con `PostgrestVersion: "14.5"` rompe inferencia
El bloque `__InternalSupabase` en el tipo `Database` generado causaba fallos de resolución de tipos en cadena.  
**Solución:** Se eliminó el bloque y se simplificó:
```ts
export type DatabaseWithoutInternals = Database
```

---

### 9. `metadata: Record<string, unknown>` no asignable a `Json`
Al actualizar el perfil con `{ metadata: { onboarding_completed: true } }`, TypeScript rechazaba el objeto porque el tipo de la columna es `Json`, no `Record<string, unknown>`.  
**Solución:** Cast explícito:
```ts
metadata: { onboarding_completed: true } as Json
```

---

## Dónde continuar — E4

**E4: RBAC middleware + JWT custom claims**

El RLS actual se basa en consultas a la tabla `profiles` por cada request. E4 agrega claims de rol directamente al JWT para:
1. No hacer queries extras en middleware
2. Poder hacer checks de rol en el cliente sin roundtrip

### Tareas de E4 (en orden)

1. **Custom claims hook** — Supabase Edge Function `custom_access_token_hook` que lee `profiles.primary_role` y lo inyecta en `app_metadata` del JWT
2. **Registrar el hook** en el Dashboard de Supabase (Auth → Hooks)
3. **Actualizar middleware.ts** — leer `user.app_metadata.role` del JWT en vez de hacer query a `profiles`
4. **Actualizar RoleGate** — usar claims del JWT en lugar de query separada
5. **Tests** — verificar que cambios de rol se reflejan tras refresh de token

### Archivo a editar
- `apps/web/src/middleware.ts` — actualmente hace `supabase.auth.getUser()` pero no usa el rol
- `apps/web/src/components/auth/role-gate.tsx` — actualmente llama a `getProfile()` por query
- Nueva Edge Function: `supabase/functions/custom-access-token-hook/index.ts`

---

## Estado del repo al cierre

```
Branch: develop
Último commit: feat(e2+e3): auth + DB schema + RLS
Type-check: ✅ 0 errores
Migrations aplicadas: 6 (en proyecto jwjeezdzqmmjqwgtqhpn)
```
