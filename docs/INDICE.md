# 📚 Documentación — SomosTécnicos FSM

> **Versión de Documentación:** 3.0
> **Última actualización:** 2026-03-12

Índice de toda la documentación del proyecto organizada por área funcional.

---

## 🏗️ Arquitectura y Core

Documentos base del sistema — leer primero.

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Fuente de verdad técnica: stack, directorios, FSM de estados, API endpoints, SEO, design tokens, changelog. _Actualizado 2026-03-12._
- **[01_ARQUITECTURA_SISTEMA.md](./01_ARQUITECTURA_SISTEMA.md)** — Visión general ejecutiva del sistema, roles y flujo de datos. _(referencia complementaria)_

---

## 🎨 Diseño y UI/UX (`diseno/`)

- **[UI_GUIDE.md](./diseno/UI_GUIDE.md)** — Design system completo: tipografía, animaciones, componentes.
- **[RESPONSIVE_GUIDE.md](./diseno/RESPONSIVE_GUIDE.md)** — Auditoría y correcciones responsive en todos los portales.

---

## 🛠️ Funcionalidades y Módulos (`funcionalidades/`)

- **[SUITE_ADMINISTRADOR.md](./funcionalidades/SUITE_ADMINISTRADOR.md)** — Panel admin: dashboard, órdenes, APIs.
- **[CHATBOT.md](./funcionalidades/CHATBOT.md)** — Asistente IA: flujo de clasificación de servicios.
- **[ESPECIALIDADES.md](./funcionalidades/ESPECIALIDADES.md)** — Gestión de especialidades técnicas.
- **[GOOGLE_MAPS.md](./funcionalidades/GOOGLE_MAPS.md)** — Integración de mapas y geolocalización.
- **[PASSWORD_RESET.md](./funcionalidades/PASSWORD_RESET.md)** — Sistema de recuperación de contraseñas.
- **[WHATSAPP_INTEGRATION.md](./funcionalidades/WHATSAPP_INTEGRATION.md)** — Integración WhatsApp para técnicos.

---

## 🚀 Operaciones y DevOps (`operaciones/`)

- **[DEPLOYMENT_VERCEL.md](./operaciones/DEPLOYMENT_VERCEL.md)** — Guía completa de despliegue en Vercel + Neon + Upstash.
- **[DATABASE_MIGRATION.md](./operaciones/DATABASE_MIGRATION.md)** — Migraciones a Neon DB.
- **[DATABASE_OPTIMIZATION.md](./operaciones/DATABASE_OPTIMIZATION.md)** — Estrategias de optimización PostgreSQL.
- **[MCP_SETUP.md](./operaciones/MCP_SETUP.md)** — Configuración del Model Context Protocol.
- **[SEO_STRATEGY.md](./operaciones/SEO_STRATEGY.md)** — Estrategia global de SEO.
- **[SEO_CONFIGURACION_MANUAL.md](./operaciones/SEO_CONFIGURACION_MANUAL.md)** — Pasos post-deploy: GSC, Google Business Profile, schemas.
- **[SMTP_SETUP.md](./operaciones/SMTP_SETUP.md)** — Configuración de emails corporativos (Brevo).

---

## 📝 SEO, Blog y Contenido

Documentación del sistema de contenido editorial y assets visuales.

- **[seo/BLOG_STRATEGY.md](./seo/BLOG_STRATEGY.md)** — Estrategia de clústeres, intención de búsqueda y arquitectura hub-and-spoke.
- **[Plan_Mejoras_SomosTecnicos_SEO.md](./Plan_Mejoras_SomosTecnicos_SEO.md)** — Roadmap de mejoras SEO (Fase 1 y 2).
- **[PROMPTS-IMAGENES-BLOG.md](./PROMPTS-IMAGENES-BLOG.md)** — Prompts fotorrealistas para generar imágenes de blog (AVIF 1200×675) con IA. _Actualizado 2026-03-12._
- **[PROMPTS-VIDEOS-BLOG.md](./PROMPTS-VIDEOS-BLOG.md)** — Prompts de video para hero section, Reels, drone fly-through y más. _Creado 2026-03-12._

### Contenido editorial de blog (`contenido-blogs-md/`)

Archivos Markdown fuente por área temática — 8 categorías, ~51 posts implementados:

| Archivo | Categoría | Posts |
|---|---|---|
| `BLOG-CONTENIDO-NEVERA.md` | Neveras | 6 |
| `BLOG-CONTENIDO-LAVADORAS.md` | Lavadoras | 10 |
| `BLOG-CONTENIDO-TELEVISORES.md` | Televisores | 5 |
| `BLOG-CONTENIDO-SECADORAS.md` | Secadoras | 5 |
| `BLOG-CONTENIDO-ESTUFAS.md` | Estufas | 5 |
| `BLOG-CONTENIDO-CALENTADORES-ADICIONALES.md` | Calentadores | 6 |
| `BLOG-CONTENIDO-REDES.md` | Redes | 5 |
| `BLOG-CONTENIDO-ELECTRICIDAD.md` | Electricidad | 5 |

---

## 🧪 Pruebas y Calidad (`pruebas/`)

- **[GUIA_ACCESO_TESTING.md](./pruebas/GUIA_ACCESO_TESTING.md)** — Credenciales de prueba y flujos de acceso por rol.
- **[TESTING_LIFECYCLE.md](./pruebas/TESTING_LIFECYCLE.md)** — Ciclo de vida de pruebas manuales.

---

## 📅 Planes y Roadmap (`planes/`)

- **[ROADMAP_PENDIENTES.md](./planes/ROADMAP_PENDIENTES.md)** — Tareas pendientes y características futuras.
- **[2026-02-09-ciclo-vida-servicios-design.md](./planes/2026-02-09-ciclo-vida-servicios-design.md)** — Diseño del ciclo de vida de servicios.

---

## 📊 Reportes y Auditorías (`reportes/`)

- **[AUDITORIA_HISTORIAL.md](./reportes/AUDITORIA_HISTORIAL.md)** — Historial de auditorías y cambios importantes.
- **[AUDITORIA_DISENO.md](./reportes/AUDITORIA_DISENO.md)** — Auditoría de diseño visual.
- **[AUDITORIA_PORTALES.md](./reportes/AUDITORIA_PORTALES.md)** — Auditoría de los 3 portales (admin, cliente, técnico).
- **[FUNCTIONAL_AUDIT.md](./reportes/FUNCTIONAL_AUDIT.md)** — QA funcional: detección de dead UI.
- **[security-audit-2026-02-13.md](./reportes/security-audit-2026-02-13.md)** — Auditoría de seguridad.

---

## 📝 Registro de Cambios (`registro_cambios/`)

- **[CHANGELOG.md](./registro_cambios/CHANGELOG.md)** — Registro global de versiones y releases.
- **[IMPROVEMENTS_ADMIN_PANEL.md](./registro_cambios/IMPROVEMENTS_ADMIN_PANEL.md)** — Mejoras en el panel de administración.
- **[IMPROVEMENTS_TECH_PANEL.md](./registro_cambios/IMPROVEMENTS_TECH_PANEL.md)** — Mejoras en el panel de técnicos.
- **[FASE2_IMPLEMENTACION.md](./registro_cambios/FASE2_IMPLEMENTACION.md)** — Implementación de Fase 2.

---

## 📱 PWA (`APP-PWA/`)

- **[CONTEXTO-PWA.md](./APP-PWA/CONTEXTO-PWA.md)** — Contexto y estrategia de conversión a PWA instalable.

---

## 🔧 Guías de Desarrollo (raíz de docs/)

- **[GUIA-PASOS-APP.md](./GUIA-PASOS-APP.md)** — Guía para Claude Code: conversión a PWA Mobile, stack, flujos.
- **[GUIA_CREACION_SKILL.md](./GUIA_CREACION_SKILL.md)** — Reglas y validación para crear nuevos skills de Claude.

---

## 📁 Archivo — Histórico (`archivo/`)

Documentación obsoleta mantenida solo por referencia histórica.

- `HISTORIAL_MEJORAS_OPTIMIZACIONES.md`
- `HISTORIAL_LOGS_Y_CAMBIOS.md`
- `HISTORIAL_AUDITORIAS.md`
- `HISTORIAL_PLANES_Y_TAREAS.md`
- `HISTORIAL_INCIDENTES_SEO.md`
- `ARQUITECTURA_SOFTWARE.md` _(reemplazado por ARCHITECTURE.md)_

---

> **Nota:** `ARCHITECTURE.md` es la fuente de verdad técnica principal. Actualizar este índice al agregar o mover documentación.
