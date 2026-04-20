# Skillset360° — Security Requirements Document (SRD)

## 1. Objetivo

Definir los requerimientos de seguridad, privacidad y gobierno de datos para Skillset360°, asegurando:

- Protección de datos de usuarios
- Control de accesos por rol
- Trazabilidad de acciones
- Prevención de abusos y accesos indebidos
- Base escalable para evolución futura del producto

Este documento aplica al MVP LATAM con proyección a expansión internacional.

---

## 2. Principios de Seguridad

- Privacy by Design: seguridad integrada desde el diseño
- Least Privilege: cada rol accede solo a lo necesario
- Secure by Default: configuraciones seguras por defecto
- Auditability: toda acción relevante es trazable
- Data Minimization (externa): exposición mínima fuera de la plataforma
- Anonymization-first reuse: reutilización de datos solo anonimizada

---

## 3. Gobierno de Datos

### 3.1 Data Ownership

- Data Controller: Upskill Labs
- Toda la data es propiedad de Upskill Labs

### 3.2 Uso de Datos

Upskill Labs puede usar datos para:

- mejora del producto
- analítica interna
- benchmarks
- optimización de modelos

👉 Siempre bajo anonimización completa

### 3.3 Datos excluidos

- Accesos
- Pagos

👉 gestionados por proveedor externo (ej: Stripe)

---

## 4. Clasificación de Datos

|                            |                         |
| -------------------------- | ----------------------- |
| Tipo de dato               | Clasificación           |
| Identidad (nombre, email)  | Personal                |
| Resultados de evaluaciones | Potencialmente sensible |
| Skillboards / desempeño    | Potencialmente sensible |
| Texto libre                | Potencialmente sensible |
| Outputs AI                 | Derivado                |
| Logs                       | Técnico                 |

---

## 5. Modelo de Acceso (RBAC)

### Roles

- Admin Upskill Labs
- Skill Coach
- Seleccionador
- Profesional en desarrollo
- Candidato
- Invitado (formularios)

### Reglas clave

- Skill Coach → solo sus profesionales
- Seleccionador → solo sus procesos
- Upskill → acceso total
- No multi-coach sobre un mismo usuario (MVP)

### Visibilidad

|             |                                              |
| ----------- | -------------------------------------------- |
| Actor       | Puede ver                                    |
| Coach       | todo de sus profesionales                    |
| Profesional | boards compartidos + su info                 |
| Profesional | ❌ NO ve evaluaciones ni planes individuales |
| Candidato   | ❌ no ve resultados                          |
| Invitado    | solo su formulario                           |

---

## 6. Autenticación

### Métodos

- Google Sign-In
- Email + contraseña

### Seguridad

- 2FA para Admin (email OTP)
- Reset de contraseña estándar

### Sesiones (recomendado MVP)

- Expiración: 7 días
- Inactividad: 24 horas
- Revocación: manual (logout global futuro)

---

## 7. Magic Links

### Configuración

- Expiración: 30 días
- Uso único
- Revocables
- No vinculados al email

### Seguridad

- Registro de:

- IP
- timestamp

### Comportamiento

- Reuso → bloqueado
- Reenvío:

- válido si no usado
- responsabilidad del emisor

---

## 8. Formularios sin autenticación

- Acceso por link
- Guardado parcial permitido
- Envío único
- Post-envío:

- estado: “Formulario enviado”

---

## 9. Retención de Datos

### Se conserva

- cuentas activas/inactivas
- candidatos no contratados
- profesionales dados de baja
- skillboards
- evaluaciones
- logs

### Eliminación

- No se elimina data
- Se aplica:

- anonimización para análisis
- desactivación lógica

### Control

- Admin Upskill puede borrar selectivamente

---

## 10. Exportación de Datos

### PDFs

- Generación: on-demand
- Incluye:

- planes de acción
- resultados

### Restricciones

- Todos los roles pueden descargar excepto candidato
- Incluyen watermark
- Contienen datos identificables

---

## 11. IA y Datos

### Uso

- Inputs y outputs se almacenan

### Restricciones

- No se envían datos personales a proveedores AI
- Uso de IDs anonimizados

### Tipos de output

|                               |              |
| ----------------------------- | ------------ |
| Tipo                          | Persistencia |
| Asistentes (dashboard/boards) | sugerencias  |
| Evaluaciones                  | persistente  |

---

## 12. Seguridad de Infraestructura (MVP)

### Base recomendada (balance seguridad/costo)

#### Infra

- Supabase (Postgres + Auth)
- AWS managed

#### Controles mínimos

- HTTPS obligatorio (TLS 1.2+)
- Cifrado en reposo (managed por proveedor)
- Secrets en environment variables
- Ambientes separados:

- dev
- staging
- prod

#### Acceso

- Roles DB restringidos
- No acceso directo a DB desde frontend

#### Backups

- Automáticos (diarios)
- Retención: 7–30 días

---

## 13. Protección contra ataques (MVP)

### Implementar

- Rate limiting:

- login
- magic links
- formularios

- Protección contra:

- brute force
- enumeración de usuarios
- replay de links
- scraping básico

👉 herramientas sugeridas:

- middleware backend
- Cloudflare / WAF básico

---

## 14. Auditoría

### Eventos a registrar

- login
- creación de usuarios
- invitaciones
- ejecución de boards
- cierre de boards
- generación de PDFs
- cambios de permisos
- eliminación / desactivación
- uso de magic links

### Datos registrados

- user_id
- rol
- acción
- timestamp
- IP
- recurso afectado

### Retención

- 1 mes (MVP)

---

## 15. Privacidad y Consentimiento

Usuarios aceptan:

- términos de uso
- política de privacidad
- uso de IA
- tratamiento de datos
- reutilización anonimizada

### Candidatos

- aceptan reutilización de resultados por 6 meses

---

## 16. Multi-tenancy

### MVP

- No hay organizaciones
- Modelo: single tenant lógico por usuario

---

## 17. Arquitectura de Seguridad (High-Level)

[ Frontend (Web App) ]

       |

       | HTTPS

       v

[ Backend / API Layer ]

       |

       | Auth (Supabase)

       | RBAC enforcement

       |

       v

[ Database (Postgres - Supabase) ]

       |

       | Encryption at rest

       |

       v

[ Storage / Logs / Audit ]

External:

- Stripe (pagos)

- AI provider (con anonimización)

---

## 18. Gestión de Incidentes (MVP)

### Flujo básico

1. Detección (logs / alertas)
2. Clasificación:

- baja
- media
- crítica

4. Contención:

- revocar accesos
- bloquear endpoints

6. Análisis
7. Comunicación interna
8. Resolución
9. Mejora post-mortem

---

## 19. Roadmap de Seguridad (post-MVP)

### Fase 2

- MFA para todos los usuarios
- RBAC más granular
- Auditoría extendida
- alertas automáticas

### Fase 3

- SSO enterprise
- Data residency
- cifrado a nivel campo
- SOC2 / ISO readiness

---

## 20. Decisiones explícitas del MVP

- No anonimización interna (solo para reuse)
- No eliminación de datos (solo anonimización)
- No multi-coach
- No multi-tenant complejo
- Seguridad gestionada parcialmente por proveedores (Supabase, AWS)

---

## 21. Riesgos aceptados (MVP)

- Magic links no vinculados a identidad
- Formularios públicos accesibles por link
- Exportación con datos identificables
- 2FA limitado a admins
- Logs con retención corta (1 mes) 

# 📄 SET LEGAL COMPLETO — SKILLSET360°

Para tu caso (SaaS B2B2C con datos potencialmente sensibles + AI), necesitas 4 documentos base:

## 1. Términos y Condiciones de la Plataforma (ToS)

👉 Lo aceptan:

- Skill Coaches
- Seleccionadores
- Profesionales
- Usuarios en general

## 2. Política de Privacidad

👉 Lo aceptan:

- Todos los usuarios

## 3. Data Processing & Cliente (B2B)

👉 Lo acepta:

- Cliente (empresa / coach que paga)

## 4. Consentimiento específico (Candidatos / Evaluaciones)

👉 Lo aceptan:

- Candidatos invitados
- Participantes de evaluaciones

---

Ahora te los dejo listos para usar (versión MVP, sin overkill legal, pero sólidos).

---

# 1. 📘 TÉRMINOS Y CONDICIONES (ToS)

# TÉRMINOS Y CONDICIONES DE USO — SKILLSET360°

## 1. ACEPTACIÓN

Al acceder o utilizar Skillset360°, el usuario acepta estos términos y condiciones.

Si no está de acuerdo, no debe utilizar la plataforma.

---

## 2. DESCRIPCIÓN DEL SERVICIO

Skillset360° es una plataforma SaaS desarrollada por Upskill Labs que permite:

- Evaluación de habilidades

- Desarrollo profesional

- Procesos de selección

- Generación de planes de acción

- Uso de herramientas basadas en inteligencia artificial

---

## 3. TIPOS DE USUARIO

La plataforma contempla los siguientes roles:

- Skill Coach

- Seleccionador

- Profesional en desarrollo

- Candidato

- Invitado a formularios

Cada rol tiene accesos y permisos específicos.

---

## 4. USO PERMITIDO

El usuario se compromete a:

- Utilizar la plataforma de manera lícita

- No compartir accesos

- No intentar vulnerar la seguridad

- No extraer datos masivamente

---

## 5. CUENTAS Y ACCESO

- El usuario es responsable de su cuenta

- Puede acceder mediante:

 - Google Sign-In

 - Email y contraseña

- Upskill Labs puede suspender accesos ante uso indebido

---

## 6. DATOS Y CONTENIDO

- Upskill Labs es el titular de la plataforma y de la infraestructura

- Los datos pueden ser utilizados en forma anonimizada para:

 - mejora del producto

 - análisis

 - benchmarking

---

## 7. INTELIGENCIA ARTIFICIAL

- La plataforma utiliza IA como herramienta de apoyo

- Los resultados pueden incluir sugerencias automatizadas

- El usuario acepta este uso como parte del servicio

---

## 8. DISPONIBILIDAD

No se garantiza disponibilidad continua del servicio.

---

## 9. LIMITACIÓN DE RESPONSABILIDAD

Upskill Labs no se responsabiliza por:

- decisiones tomadas en base a resultados

- uso incorrecto de la plataforma

- interrupciones del servicio

---

## 10. MODIFICACIONES

Upskill Labs puede modificar estos términos en cualquier momento.

---

## 11. LEGISLACIÓN

Estos términos se rigen por las leyes aplicables en LATAM según jurisdicción del usuario.

---

# 2. 🔐 POLÍTICA DE PRIVACIDAD

# POLÍTICA DE PRIVACIDAD — SKILLSET360°

## 1. RESPONSABLE

Upskill Labs es responsable del tratamiento de datos.

---

## 2. DATOS QUE RECOPILAMOS

- Datos de identidad (nombre, email)

- Datos de uso

- Resultados de evaluaciones

- Interacciones con la plataforma

- Inputs y outputs de inteligencia artificial

---

## 3. FINALIDAD

Los datos se utilizan para:

- operar la plataforma

- generar resultados y reportes

- mejorar el producto

- análisis internos

---

## 4. DATOS SENSIBLES

Algunos datos pueden considerarse sensibles (evaluaciones, desempeño).

Estos se tratan con medidas de seguridad adecuadas.

---

## 5. REUTILIZACIÓN DE DATOS

Upskill Labs puede utilizar datos en forma anonimizada para:

- analítica

- benchmarking

- mejora de modelos

---

## 6. CONSERVACIÓN

Los datos se conservan de forma indefinida, salvo anonimización para análisis.

---

## 7. COMPARTICIÓN

No compartimos datos personales con terceros, excepto:

- proveedores tecnológicos (ej: hosting, pagos)

- cumplimiento legal

---

## 8. INTELIGENCIA ARTIFICIAL

- Los datos enviados a IA se procesan de forma anonimizada

- No se comparten datos personales con proveedores

---

## 9. SEGURIDAD

Aplicamos medidas de seguridad estándar de la industria SaaS.

---

## 10. DERECHOS DEL USUARIO

El usuario puede solicitar:

- acceso a sus datos

- corrección

---

## 11. CAMBIOS

Podemos actualizar esta política en cualquier momento.

---

# 3. 🧾 ACUERDO CON CLIENTE (B2B)

👉 Este es CLAVE para tu modelo

# ACUERDO DE USO DE PLATAFORMA — CLIENTES

## 1. OBJETO

Upskill Labs otorga acceso a Skillset360° como servicio SaaS.

---

## 2. RESPONSABILIDADES DEL CLIENTE

El cliente:

- es responsable de los usuarios que invita

- garantiza que cuenta con consentimiento para incorporar datos

- no utilizará la plataforma para fines ilegales

---

## 3. DATOS

- Upskill Labs actúa como responsable del tratamiento

- los datos pueden ser utilizados de forma anonimizada

---

## 4. CONFIDENCIALIDAD

Upskill Labs se compromete a:

- no divulgar información del cliente

- proteger los datos alojados

---

## 5. INTELIGENCIA ARTIFICIAL

El cliente acepta el uso de IA como parte del servicio.

---

## 6. DISPONIBILIDAD

El servicio se brinda "as is"

---

## 7. TERMINACIÓN

Upskill Labs puede suspender el servicio ante incumplimientos.

---

## 8. LIMITACIÓN DE RESPONSABILIDAD

Upskill Labs no es responsable por decisiones basadas en resultados de la plataforma.

---

# 4. 🧠 CONSENTIMIENTO DE CANDIDATOS / EVALUADOS

# CONSENTIMIENTO INFORMADO — EVALUACIONES

Al participar en esta evaluación usted acepta que:

- Sus respuestas serán procesadas por Skillset360°

- Se generarán resultados sobre sus habilidades

- Estos resultados podrán ser utilizados por Upskill Labs y el cliente que lo invitó

---

## REUTILIZACIÓN

Sus datos podrán ser reutilizados por hasta 6 meses para futuros procesos, de forma anonimizada.

---

## PRIVACIDAD

- Sus datos serán tratados con confidencialidad

- No se compartirán con terceros no autorizados

---

## IA

La evaluación puede incluir herramientas de inteligencia artificial.

---

Al continuar, usted acepta estas condiciones.

\*\*
