1. Contexto y oportunidad 3
2. Propósito del producto 3
   2.1. Metodología Skillset360°: Identificar, Medir y Desarrollar 4
   2.1.1. Taxonomía de habilidades como base del modelo 4
   2.1.1.1. Identificar 4
   2.1.1.2. Medir 5
   2.1.1.3. Desarrollar (Cerrar la brecha) 5
   2.1.2. Lógica del ciclo 5
   2.1.3. Diferenciador clave 5
3. Principios de diseño (producto / UX) 5
4. Alcance por fases 6
   Fase 1 — MVP con evaluaciones solo a nivel mockup / UX 6
   Fase 2 — Evaluaciones (motor real) 6
5. Roles, usuarios y permisos 7
   5.1. Roles críticos 7
   5.1.1. Profesional (desarrollo) 7
   5.1.2. Profesional (selección) 7
   5.1.3. Skill Coach (Cliente principal) 7
   5.1.4. Seleccionador 7
   5.1.5. Administrador (SkillSet360) 7
   5.2. Restricciones clave de visibilidad 7
   5.3. Restricciones operativas de evaluación 8
6. Modelo conceptual (entidades) 8
   Skill Framework 8
7. Requerimientos funcionales 8
   7.1. Autenticación y onboarding (Fase 1) 8
   7.2. Skill Library + Skill Cards (Fase 1) 9
   7.3. Home / Dashboards (Fase 1) 9
   7.4. Skill Board 360° (módulo estructural adaptable) 10
   7.4.1. Definición 10
   7.4.2. Entry Point 10
   7.4.3. Board 10
   7.4.3.1. Componentes posibles del Board (según template) 10
   7.4.3.1.1. Funcionalidad de selección / arrastre (Drag & Drop) 10
   7.4.3.1.2. Funcionalidad de priorización / ranking 11
   7.4.3.1.3. Funcionalidad de agrupación 11
   7.4.3.1.4. Funcionalidad de definición de nivel objetivo 11
   7.4.3.1.5. funcionalidad de formularios estructurados 11
   7.4.3.1.6. funcionalidad asistida por IA 12
   7.4.3.1.7. Funcionalidad individual vs equipo 12
   7.4.3.1.8. Funcionalidad Solicitud de data Adicional 12
   7.4.3.2. Categorizaciones estructurales de Skill Boards 12
   7.4.3.2.1. Tipo de Proceso 12
   7.4.3.2.2. Modalidad de Participación 13
   7.4.3.2.3. Momento del Proceso 13
   7.4.3.2.4. Alcance 13
   7.4.3.2.5. Tiempo estimado de ejecución 13
   7.4.3.2.6. Nivel de profundidad del output 13
   7.4.3.3. Panel de instrucciones (es el panel que acompaña el board, siempre accesible o visible) 13
   7.4.4. Tipologías de Output 14
   7.4.4.1. Skillset priorizado 14
   7.4.4.2. Nivel objetivo 14
   7.4.4.3. Skillset requerido para rol (Selección) 14
   7.4.4.4. Insights y planning 14
   7.4.4.5. Acciones y Próximos pasos 14
   7.5. Admin SkillSet360 (Fase 1) 15
8. Evaluaciones 16
   En Fase 1: 16
   En Fase 2: 16
9. Modelo de negocio 16
   9.1. Estructura del modelo 16
   9.1.1. Componente A - Licencia base mensual 16
   9.1.2. Componente B - Variable: Profesional en Desarrollo (Skill Coach) 17
   9.1.3. Componente B - Variable: Candidato (Seleccionador) 17
   9.2. Quién paga 17
   9.3. Ejemplos de facturación mensual 17
   9.4. Implicancias funcionales para el desarrollo 18
   9.5. Lo que se mantiene y lo que cambia del PRD original 18
   9.6. Decisiones pendientes 19
10. Requerimientos no funcionales 19
    UX 19
    Performance 19
    Seguridad y control de acceso 20
    Auditoría y trazabilidad 20
    Escalabilidad y mantenibilidad 20
11. Decisiones clave ya fijadas 20
    11.1. Filosofía del producto 21
    11.2. Framework de habilidades 21
    11.3. Skill Boards como componente central 21
    11.4. Visibilidad de comportamientos observables 21
    11.5. Participación en Skill Boards 22
    11.6. Evaluaciones y fases del producto 22
    11.7. Determinación del nivel de habilidades 22
    11.8. Roles y control de acceso 22
    11.9. Evolución de la plataforma 23

PRD — Skillset360° (Versión Clarificada por Fases)

Contexto y oportunidad
El mercado de roleplay con IA y skill assessment está fragmentado por propósito, con propuestas verticales (ventas, screening técnico) o superficiales (tests genéricos). Existe una brecha clara para una solución que combine:
Roleplay profundo como evidencia conductual
Evaluación transversal de habilidades humanas
Un framework robusto y coherente de skills
Conexión clara entre mapeo de skills→ assessment → conversaciones (si aplica) → desarrollo / decisión en proceso de selección
Skillset360° se posiciona como una plataforma skills-based, centrada en:
comportamientos observables,
evaluaciones cortas,
recomendaciones prácticas,
y lectura humana (coach / seleccionador como intérpretes del output).
No busca reemplazar el criterio humano ni construir psicometría pesada.

Propósito del producto
Skillset360° busca:
Mapear habilidades requeridas para distintos objetivos y procesos
(coaching, mentoring, desarrollo, selección).
Medir habilidades humanas de forma clara, rápida y accionable.
Mostrar estado actual (sin predicciones complejas).
Conectar evaluación → conversación → desarrollo
Ofrecer una solución de selección basada en habilidades que predice mejor el comportamiento futuro comparado con modelos obsoletos de psicometría
No es:
un psicotécnico tradicional,
un ATS,
un LMS,
ni un sistema psicométrico pesado.

Metodología Skillset360°: Identificar, Medir y Desarrollar
Taxonomía de habilidades como base del modelo
La metodología Skillset360° se apoya en una taxonomía propia de habilidades que estructura y organiza las competencias relevantes para el desempeño profesional.
Esta taxonomía constituye un diferenciador clave del enfoque, ya que permite:
estandarizar la forma en que se definen y evalúan las habilidades

trabajar con un lenguaje común entre distintos usuarios (coaches, seleccionadores, organizaciones)

asegurar consistencia en la medición y comparación de perfiles

vincular habilidades con objetivos concretos de desarrollo o selección

La taxonomía está organizada en dimensiones que agrupan habilidades relacionadas, facilitando su comprensión y aplicación en distintos contextos.
Sobre esta base estructurada es que se construyen los Skill Boards y se ejecuta la metodología de la plataforma.

La plataforma se basa en una metodología estructurada en tres etapas que permiten gestionar habilidades de forma estratégica y accionable:
Identificar
Definir las habilidades necesarias en función de un objetivo específico.
Esto puede aplicarse a:
desarrollo profesional (Skill Coach)
procesos de selección (Seleccionador)
necesidades organizacionales

En esta etapa se construye el Skill Board, que representa:
skills clave
niveles esperados
prioridades

El objetivo es transformar un objetivo abstracto (ej: “mejorar liderazgo” o “cubrir una vacante”) en un perfil de habilidades concreto.

Medir
Evaluar el estado actual del usuario en relación al perfil definido.
La medición se realiza a través de:
evaluaciones estructuradas
dinámicas guiadas
(futuro) evaluaciones con AI
Esto permite:
obtener un score por skill
identificar brechas
generar una línea base objetivo

Desarrollar (Cerrar la brecha)
A partir de la medición, se diseñan acciones para cerrar las brechas detectadas.
Esto incluye:
planes de desarrollo
nuevas evaluaciones
iteración sobre Skill Boards

El sistema permite hacer seguimiento de la evolución en el tiempo y ajustar el proceso según resultados.
Lógica del ciclo
Este proceso no es lineal, sino iterativo:
Identificar → Medir → Desarrollar → volver a medir
Diferenciador clave
La metodología conecta:
Framework propio de habilidades y 5 dimensiones
definición estratégica (skills necesarias)
medición objetiva (Diferenciadores: IA y Roleplays)
acción concreta

Evitando que las evaluaciones queden aisladas sin impacto real

Principios de diseño (producto / UX)
UI minimalista, clara y tranquila.
Experiencia no abrumadora, especialmente para el Profesional.
El centro del producto son las habilidades, no los scores.
Estética HR-tech premium.
Tipografía Sora, colores Upskill Labs.
En Skill Board: drag & drop lúdico, tarjetas digitales iguales a las físicas, con flip.
Chatbots con AI integrado en diferentes secciones
Dashboards livianos, de fácil lectura y muy visuales

Alcance por fases
Fase 1 — MVP con evaluaciones solo a nivel mockup / UX
Objetivo:
Habilitar “mapeo”, y “planes de acción”.
“Evaluación” se desarrolla como experiencia y diseño, pero sin motor ni lógica real.
Nota clave:
En Fase 1, las evaluaciones deben existir a nivel de pantallas, flujos, copy y navegación, integradas al producto, pero sin scoring, persistencia ni cálculo de nivel real.
El motor de evaluación se construye en Fase 2.
Incluye:
Autenticación + onboarding por rol.
Skill Framework (≈80 skills / 5 dimensiones) + Skill Library + Skill Cards.
Dashboards sin nivel actual real (estado “pendiente”).
Skill Board 360° (templates, canvas con reglas, outputs y PDF).
Todo proceso de identificación, mapeo o definición de habilidades comienza con un Skill Board.
Admin SkillSet360 para gestionar skills, niveles, comportamientos y plantillas
(sin constructor ni motor de evaluaciones).
Landing comercial con foco en el paying customer
(Skill Coaches, Seleccionadores, Organizaciones).

Fase 2 — Evaluaciones (motor real)
Construcción del motor de evaluaciones por habilidad.
Persistencia, scoring, niveles y recomendaciones reales.
Integración total con dashboards y Skill Boards.

Roles, usuarios y permisos
Roles críticos
Profesional (desarrollo)
Se evalúa y se desarrolla.
Ve habilidades asignadas, objetivos y planes.
No ve comportamientos observables en Skill Board.
Profesional (selección)
Se evalúa
Skill Coach (Cliente principal)
Crea Profesionales en desarrollo a través de invitaciones por link o código
Accede a skill boards y los utiliza y asigna habilidades y skillsets (conjunto de habilidades que definen a un perfil/cargo/jerarquía, etc) a sus profesionales en desarrollo.
Ve dashboards y brechas.
Interpreta resultados.
Setea objetivos de desarrollo
Puede ser coach, mentor, jefe o líder.
Acceso a dashboards con la data de profesionales en desarrollo
Seleccionador
Crea Profesionales candidatos a través de invitaciones por link o código
Accede a skillboards y los utiliza para definir skills requeridas por rol, seniority, industria.
Asigna evaluaciones a candidatos.
Compara candidatos por skills.
Acceso a dashboards con la data de sus candidatos
Envía links con formularios a terceros sin acceso a plataforma (ejemplo: solicita a un manager, datos de una posición para completar un skill board)
Administrador (SkillSet360)
Acceso total.
Crea y mantiene habilidades, niveles, comportamientos, skillboards.
Diseña evaluaciones (Fase 2).
Administra e-commerce (venta de licencias, usuarios asociados, etc)
Crea Skill Coaches y Seleccionadores
Dashboards data general

Restricciones clave de visibilidad
En Skill Board, el Profesional no ve comportamientos observables.
Coach y Seleccionador sí los ven.
El Candidato NO interactúa con Skill Boards.
El candidato solo accede a evaluaciones asignadas.

Restricciones operativas de evaluación
Un usuario no puede tener más de una evaluación activa en simultáneo.
Para una misma habilidad:
Se permite un máximo de 2 evaluaciones en un período de 6 meses.
Si se alcanza el límite, el sistema bloquea nuevas evaluaciones hasta cumplido el plazo.
Estas restricciones aplican tanto para evaluaciones autoasignadas como asignadas por Skill Coach o Seleccionador.
En caso de evaluación incompleta, el usuario debe finalizarla antes de iniciar una nueva.

Modelo conceptual (entidades)
Skill Framework
5 Dimensiones:
Inner Compass
Collaborative Synergy
Impactful Leadership
Next Frontier Thinking
Customer Centricity
≈80 Skills.
Cada skill:
descripción corta,
5 niveles,
cada nivel definido por comportamientos observables.
Relaciones
Coach ↔ Profesionales (1:N).
Seleccionador ↔ Candidatos (por proceso 1:N).

Requerimientos funcionales
Autenticación y onboarding (Fase 1)
Must
Registro / login. (Sign in con google)
Onboarding por rol.
Invitaciones por link o código.
Gestión básica de cuenta.
Criterios de aceptación
Un Coach puede invitar a un Profesional y verlo en su listado.
Un Seleccionador puede invitar a un Candidato a un proceso
(aunque en Fase 1 no haya evaluación real).

Skill Library + Skill Cards (Fase 1)
Must
Sección independiente accesible por skill coaches y seleccionadores , donde visualizan todas las skill cards, niveles y comportamientos.
En algunos Skill Boards se muestra como un panel lateral con skills filtrables. En la vista skill coach/seleccionades se puede acceder a niveles y comportamientos mientras que el profesional(en desarrollo) sólo visualiza el nombre y la descripción
Buscar, filtrar por dimensión, favoritos.
Card digital:
frente: nombre + dimensión,
dorso: descripción breve.

Home / Dashboards (Fase 1)

Profesional (desarrollo)
Skills asignadas.
Objetivos y acciones provenientes del Skill Board.
Radar por dimensión sin nivel real (estado “pendiente”).
Profesional (candidato)
Evaluaciones por realizar.
Coach / Seleccionador
Listado de Profesionales (desarrollo) y Profesionales (candidato)
Skills asignadas.
Resultado de evaluaciones
Acceso a informes y acciones sugeridas (AI)
Asistente AI (chatbot con contexto de sus profesionales en desarrollo o procesos de selección)
Brechas:
objetivo – actual,
si no hay evaluación → estado “pendiente”.

Skill Board 360° (módulo estructural adaptable)
El Skill Board no es una única dinámica con un flujo estándar.
Es un sistema de dinámicas estructuradas, cuyo comportamiento varía según:
Tipo de proceso (desarrollo, selección, mentoring, cultura, etc.)
Momento del proceso (diagnóstico inicial, priorización, alineación, planificación)
Tipo de intervención (individual vs equipo)
Rol del usuario (Coach vs Seleccionador)
Cada Skill Board se ejecuta a partir de un Template que define su lógica.

Definición
Canvas estructurado (no Miro libre):
reglas,
roles,
outputs,
data accionable.

Entry Point
Galería de templates.
Filtros deseables: proceso, objetivo, roles, tiempo.

Board
Componentes posibles del Board (según template)
Un Skill Board puede incluir una o varias de las siguientes funcionalidades:
Funcionalidad de selección / arrastre (Drag & Drop)
Frames estructurados (no editables libremente).
Drag & drop controlado desde Skill Library.
Límites máximos y mínimos de tarjetas por frame.
Visualización de:
coincidencias, (cuando aplique).
superposiciones, (cuando aplique).
brechas entre estado actual y objetivo (cuando aplique).

Funcionalidad de priorización / ranking
Ordenamiento jerárquico de habilidades.
Ranking obligatorio (ej: Top 5).
Asignación de peso relativo.
Selección simple o múltiple.

Funcionalidad de agrupación
Agrupar skills por categorías.
Clasificación por:
críticas,
deseables,
diferenciadoras,
culturales.
Comparación visual entre grupos.

Funcionalidad de definición de nivel objetivo
Selección de nivel deseado (1–5).
Visualización de comportamientos observables para el Coach / Seleccionador.
Registro del nivel objetivo como output.
El nivel actual queda “pendiente” en Fase 1.

funcionalidad de formularios estructurados
Según template puede incluir:
Preguntas de opción múltiple.
Preguntas abiertas.
Campos de texto.
Definición de acciones.
Definición de timeframes.
Plan de trabajo asociado a habilidades priorizadas.

funcionalidad asistida por IA
Algunos templates pueden permitir:
Input textual (ej: descripción de rol).
Sugerencia de skills recomendadas.
Propuesta de skillset inicial.
Siempre bajo revisión humana del Coach o Seleccionador.

Funcionalidad individual vs equipo
El template puede definir:
Board individual.
Board colaborativo (equipo).
Board 1 a 1 (Profesional (desarrollo) y Coach
Comparación de resultados entre participantes.
Visualización agregada de selección grupal.

Funcionalidad Solicitud de data Adicional
El seleccionador o skill coach puede solicitar información a un tercero (que no es ningún rol de los definidos en la plataforma, por ej. un manager) a través de un magic link que no requiera autenticación para que complete información, este proceso se organiza en forms que permiten, respuestas abiertas, cerradas simples y multiple choice.

Categorizaciones estructurales de Skill Boards
Cada BoardTemplate debe incluir las siguientes dimensiones de clasificación, esto estará visible en el selector de skill boards al inicio de cada proceso
Tipo de Proceso
Selección
Desarrollo
Coaching
Mentoring
Cultura / CORE
Transformación / Proyecto

Modalidad de Participación
Individual
1 a 1
Equipo
Multinivel (Organización)

Momento del Proceso
Diagnóstico inicial
Priorización
Definición de objetivos
Seguimiento / revisión

Alcance
Rol específico
Área / equipo
Organización completa
Proyecto específico

Tiempo estimado de ejecución
Rápido (5–10 min)
Breve (10–20 min)
Intermedio (20–90 min)
Profundo (días)

Nivel de profundidad del output
Exploratorio
Guiado
Profundo

Panel de instrucciones (es el panel que acompaña el board, siempre accesible o visible)
Puede contener:
Guía contextual.
Texto, preguntas, tiempos, videos.
Chat AI como deseable futuro.

Tipologías de Output
Un Skill Board puede generar uno o varios de los siguientes outputs:
Skillset priorizado
Lista de habilidades seleccionadas.
Orden de prioridad (si aplica).
Agrupación por categoría (si aplica).

Nivel objetivo
Nivel deseado por habilidad (1–5). (Registrado como referencia futura)
Nivel actual (En algunos skill boards, especialmente los que permanecen abiertos en el tiempo, existirá la posibilidad de que el profesional tome la evaluación de una habilidad y se use como insumo en el output)

Skillset requerido para rol (Selección)
Habilidades críticas.
Habilidades deseables.
Nivel objetivo por habilidad.
Base para asignar evaluaciones.

Insights y planning
Durante el desarrollo de un skill board hay dos secciones para inputs manuales a ser llenados por el líder del proceso (skill coach, seleccionador, organización) que deben estar visibles como un output del skill board.
Reflexiones registradas. (introducidas manualmente por el skill coach)
Insights cualitativos. (introducidas manualmente por el skill coach)
Acciones planificadas con responsables. (introducidas manualmente por el skill coach)
Inputs abiertos del formulario.

Acciones y Próximos pasos
Evaluaciones. (El skill coach/seleccionador puede elegir las habilidades que envía a “cola de evaluaciones del profesional en desarrollo y selección)
Timeframes definidos para tomar estas evaluaciones.
El plan de acción se genera como parte del output del Skill Board y contiene un conjunto de acciones concretas orientadas al desarrollo de habilidades priorizadas.
Cada acción incluye:
descripción de la acción
responsable
timeframe (cuando aplique)
contexto o notas adicionales
estado de la acción
Estados posibles:
En proceso
Hecho
Delegado
Desestimado
Reglas de funcionamiento:
Toda acción se crea con estado inicial “En proceso”.
El estado de la acción puede ser actualizado a lo largo del proceso de desarrollo.
El estado “Delegado” implica que la ejecución de la acción ha sido asignada a un tercero.
El estado “Desestimado” indica que la acción deja de ser prioritaria dentro del plan.
El plan de acción no es estático: funciona como un sistema de seguimiento que permite visualizar el progreso del desarrollo a lo largo del tiempo.

Admin SkillSet360 (Fase 1)
Must
CRUD de skills.
CRUD de niveles y comportamientos.
CRUD de skill boards (iniciales, en el transcurso del tiempo se irán agregando nuevos skill boards).
Gestión básica de usuarios y licencias.

Evaluaciones
Motor en Fase 2 — Experiencia y mockups obligatorios en Fase 1
En Fase 1:
Se diseñan todas las pantallas y flujos de evaluación.
Se integran a la experiencia general.
No existe lógica real ni scoring.
En Fase 2:
1 habilidad por evaluación.
≤15 minutos.
Ítems combinables:
Likert,
juicio situacional,
autoevaluación,
reflexión,
roleplay.
Diseñadas por Upskill Labs.
Feedback final:
nivel 1–5,
comportamientos observables,
recomendaciones accionables.

Modelo de negocio
Estructura del modelo
El modelo de negocio de Skillset360° se basa en una combinación de:
un plan de acceso a la plataforma definido por tipo de uso
licencias variables que determinan la capacidad operativa
9.1.1. Plan de acceso (definido en la compra)
Al momento de la compra, el cliente elige el tipo de uso principal con el que desea comenzar:
Plan Desarrollo
Orientado a procesos de desarrollo de habilidades
Incluye un número base de Profesionales en desarrollo
Plan Selección
Orientado a procesos de selección de talento
Incluye un número base de Candidatos
Plan Híbrido
Orientado a clientes que combinan ambos procesos
Incluye un número base de Profesionales y Candidatos
Precio de referencia: $29 USD/mes [TBD]
Igual para todos los usuarios, independientemente del tipo de uso inicial (desarrollo, selección o híbrido).
Incluye:
acceso al framework de 80 habilidades
acceso a todos los Skill Board templates
dashboards
reportes PDF
asistente AI
sugerencias AI
Evaluaciones y reportes ilimitados.
Opción anual: $299 USD/año (~$25/mes, 14% descuento) [TBD]

9.1.2. Licencias variables (capacidad de uso)
El uso de la plataforma se expande mediante la adquisición de licencias adicionales:
Licencias de Profesionales → habilitan capacidad adicional para procesos de desarrollo
Licencias de Candidatos → habilitan capacidad adicional para procesos de selección
Estas licencias pueden adquirirse en cualquier momento, sin necesidad de cambiar de plan.
Desarrollo (Profesionales en desarrollo)
Cobro: mensual recurrente por cada Profesional en Desarrollo activo
Precio de referencia: $5 USD/mes por profesional activo [PENDIENTE]
Reglas:
Profesional dado de baja → deja de costar el mes siguiente
Sin límite de profesionales activos
Data del profesional se retiene aunque esté inactivo
Implicación funcional:
Estado activo/inactivo por profesional vinculado al ciclo de facturación mensual
El usuario gestiona activación/desactivación desde su dashboard
El conteo al cierre del período define el cobro variable

Selección (Candidatos)
Cobro: pago único por candidato ingresado a un proceso de selección
Precio de referencia individual: $12–15 USD por candidato [PENDIENTE]
Reglas:
Ventana de uso: 3 meses desde el alta del candidato
Paquetes por volumen: descuentos para 10+, 20+, 50+ candidatos [PENDIENTE]
Data del candidato se retiene 6 meses post-proceso
Implicación funcional:
Estado por candidato con fecha de alta + vencimiento (alta + 3 meses)
Luego de la ventana pasa a estado archivado
Flujo de compra individual o en paquete

9.1.3. Principio de funcionamiento
El tipo de plan adquirido define:
el journey inicial del usuario
el onboarding
la configuración inicial del dashboard
Sin embargo, el uso de la plataforma no queda restringido al plan elegido inicialmente.
Un usuario puede ejecutar procesos de desarrollo o selección en cualquier momento mediante la creación de Skill Boards del tipo correspondiente, siempre que cuente con las licencias necesarias.

Componente A - Licencia base mensual
Precio de referencia: $29 USD/mes TBD
Igual para Skill Coach y Seleccionador
Incluye: framework 80 habilidades, todos los Skill Board templates, dashboards, reportes PDF, asistente AI, sugerencias AI
Evaluaciones y reportes ilimitados
Opción anual: $299 USD/año (~$25/mes, 14% descuento) [TBD]

Quién paga
Rol
Paga
Lógica de cobro
Accede gratis
Skill Coach
Si
Base + mensual/profesional

---

Seleccionador
Si
Base + one-time/candidato

---

Prof. (desarrollo)
No

---

Invitado por Coach
Prof. (selección)
No

---

Invitado por Seleccionador
Admin (Skillset360)
N/A
Interno
Acceso total

Ejemplos de facturación mensual
Todos los precios son de referencia, pendientes de validación.

Escenario
Cálculo
Total
Coach, 3 profesionales
$29 + 3x$5
$44/mes
Coach, 8 profesionales
$29 + 8x$5
$69/mes
Coach, 15 profesionales
$29 + 15x$5
$104/mes
Seleccionador, 5 candidatos
$29 + 5x$12
$89 (mes 1)
Seleccionador, 20 candidatos
$29 + 20x$12
$269 (mes 1)
Seleccionador, mes sin procesos
$29 + $0
$29/mes
Dual: 5 prof + 10 cands
$29 + $25 + $120
$174 (mes 1)

Se elimina tier 'Organización' de Fase 1 -> se construye con demanda enterprise real

Decisiones pendientes
Tema
Resolver antes de
Validar precios con 10 coaches reales
Landing
Precios paquetes candidatos (10+, 20+, 50+)
Billing
Procesador de pagos por país (Stripe vs local)
Billing
Incluir N personas gratis en base o empezar en 0
Billing
IVA/fiscalidad: entidad de facturación
Lanzamiento
Politica transicion mensual -> anual
Billing
Pricing enterprise/organizacional
1ra venta enterprise

Requerimientos no funcionales
UX
La experiencia debe ser simple, clara y no abrumadora, especialmente para el Profesional.
La navegación debe priorizar la comprensión rápida, foco en habilidades y baja fricción.
Los dashboards deben ser livianos, visuales y de lectura inmediata.
Performance
El Skill Board debe responder de forma fluida en interacciones de drag & drop, selección, ranking y formularios.
Los tiempos de carga de templates, dashboards y skill cards deben ser consistentes y no interrumpir la dinámica de uso.
La plataforma debe soportar boards individuales y colaborativos sin degradación perceptible de la experiencia.
Seguridad y control de acceso
La plataforma debe implementar control de acceso basado en roles (RBAC).
Cada rol debe acceder únicamente a la información y funcionalidades que le corresponden.
El Profesional no debe visualizar comportamientos observables dentro del Skill Board.
El Candidato no debe tener acceso a Skill Boards ni a información de otros usuarios o procesos.
Los magic links para terceros deben ser seguros, temporales y limitados al formulario específico compartido.
Auditoría y trazabilidad
Debe registrarse quién creó un template, quién ejecutó un board, quién cerró la dinámica y qué outputs fueron generados.
Debe mantenerse trazabilidad básica sobre invitaciones, accesos y cambios relevantes en skills, templates y licencias.
Debe haber registrarse toda la actividad de evaluación (fecha asignada, fecha de evaluación, inicio y finalización del proceso, resultados, evolución de resultados sobre la misma habilidad) FASE 2
Debe almacenar la data de profesionales y skill coaches aunque ya no estén activos en la plataforma
Escalabilidad y mantenibilidad
La arquitectura debe permitir agregar nuevos Skill Boards, templates, skills y evaluaciones sin rediseñar la lógica central del producto.
Las categorizaciones y funcionalidades de los Skill Boards deben ser configurables y extensibles en el tiempo.

Decisiones clave ya fijadas
Las siguientes decisiones estructurales forman parte del diseño conceptual del producto y no deben modificarse sin una redefinición del modelo de plataforma.

Filosofía del producto
La plataforma acompaña decisiones humanas y no busca reemplazar el criterio del Coach, Mentor o Seleccionador.
El sistema se centra en habilidades observables y su desarrollo, evitando modelos de scoring abstractos o psicometría pesada.
Las evaluaciones deben generar resultados claros, comprensibles y accionables.

Framework de habilidades
· El producto se basa en un framework propietario de aproximadamente 80 habilidades.
Las habilidades se organizan en 5 dimensiones:
Inner Compass
Collaborative Synergy
Impactful Leadership
Next Frontier Thinking
Customer Centricity
Cada habilidad posee 5 niveles conductuales, definidos por comportamientos observables.

Skill Boards como componente central
Todo proceso de identificación, mapeo o definición de habilidades comienza con un Skill Board.
El Skill Board es un canvas estructurado basado en templates, no un lienzo libre tipo Miro.
Los Skill Boards pueden variar según:
tipo de proceso,
modalidad de participación,
momento del proceso,
alcance organizacional,
tiempo estimado de ejecución,
nivel de profundidad del output.
Cada Skill Board genera outputs estructurados que alimentan dashboards, planes de desarrollo o procesos de selección.

Visibilidad de comportamientos observables
Los comportamientos observables no son visibles para el Profesional dentro del Skill Board.
Los comportamientos observables sólo son visibles para:
Skill Coaches
Seleccionadores
El Profesional sólo accede a comportamientos observables cuando estos forman parte del resultado de una evaluación de habilidad.

Participación en Skill Boards
Los Candidatos no participan en Skill Boards.
Los Skill Boards son herramientas utilizadas por Coaches, Seleccionadores o equipos internos para definir o analizar habilidades.

Evaluaciones y fases del producto
En Fase 1, las evaluaciones existen únicamente a nivel de experiencia y diseño (mockups).
En esta fase no existe:
scoring real,
cálculo de nivel,
persistencia de resultados de evaluación.
En Fase 2 se implementa el motor completo de evaluaciones, incluyendo:
scoring,
determinación de nivel,
generación de recomendaciones.

Determinación del nivel de habilidades
El nivel de una habilidad nunca se carga manualmente en el sistema.
El nivel de una habilidad siempre debe ser el resultado de una evaluación.
Ningún rol del sistema puede asignar o modificar manualmente el nivel actual de una habilidad.

Roles y control de acceso
La plataforma implementa control de acceso basado en roles (RBAC).
Cada rol accede únicamente a la información y funcionalidades correspondientes a su función.
Roles principales:
Profesional (desarrollo)
Profesional candidato (selección)
Skill Coach
Seleccionador
Administrador SkillSet360

Evolución de la plataforma
La arquitectura del sistema debe permitir incorporar nuevos:
Skill Boards,
templates,
evaluaciones,
configuraciones del framework, sin requerir rediseños estructurales de la plataforma.
