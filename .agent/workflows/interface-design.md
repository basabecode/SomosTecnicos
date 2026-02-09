---
description: Proceso integral de diseño de interfaz (Workshop System) y optimización responsive para SomosTécnicos.
---

# 🎨 Interface Design Workflow: Sistema Workshop

Este flujo de trabajo consolida el análisis, la implementación y los estándares de diseño para los paneles de SomosTécnicos (Admin, Cliente, Técnico).

## 🎯 1. Visión y Direccionamiento (Intent)

El diseño se basa en el concepto **"Workshop" (Taller Profesional Moderno)**. Cada panel tiene una intención específica:

*   **Panel Administrativo (Comando y Control):** Sentirse como un centro de despacho de emergencias. Eficiencia operativa y detección de urgencias.
*   **Panel de Cliente (Confianza y Tranquilidad):** Rastrear el servicio como un paquete importante. Claridad en el progreso y contacto fácil.
*   **Panel de Técnico (Eficiencia en Campo):** Herramienta de trabajo móvil. Acciones rápidas ("Navegar", "Llamar", "Iniciar") con targets táctiles grandes.

## 🛠️ 2. Sistema de Diseño (Tokens Workshop)

### Colores del Dominio
```css
--tool-orange: 25 95% 53%;      /* Acento principal, CTAs */
--stamp-red: 0 84% 60%;         /* Urgencias, alertas */
--checkmark-green: 142 76% 36%;  /* Completados, éxito */
--assigned-blue: 217 91% 60%;   /* Información, asignados */
--workshop-floor: 210 20% 98%;  /* Fondo principal */
--label-ink: 222 47% 11%;       /* Texto principal */
```

### Tipografía
*   **Principal:** Inter (Profesional y legible).
*   **Datos/Números:** JetBrains Mono (Para códigos de orden, ETAs y métricas).

## 📱 3. Estándares Responsive (Guidelines)

1.  **Mobile-First:** Diseñar primero para `< 640px`. Usar `sm:` para escalar a desktop.
2.  **Touch Targets:** Botones de acción principal deben tener un alto de `h-12` (48px) o `h-14` (56px) para facilitar el uso táctil.
3.  **Tipografía Fluida:** Usar escalas como `text-xs sm:text-small` y `text-lg sm:text-h2`.
4.  **Prevención de Overflow:** Usar `truncate` para nombres y `break-words` para direcciones.
5.  **Carruseles Táctiles:** Para grids de estadísticas en móvil, preferir `flex overflow-x-auto snap-x` para permitir "swipe" lateral.

## 🧱 4. Componentes Implementados (Workshop Library)

| Componente | Panel | Ubicación | Descripción |
| :--- | :--- | :--- | :--- |
| **UrgentOrderBanner** | Admin | `components/admin/recent-orders.tsx` | Destaca órdenes críticas con animación de pulso. |
| **TechnicianCard** | Admin | `components/admin/technician-status.tsx` | Estado visual de técnicos con indicadores de disponibilidad. |
| **ServiceTimeline** | Cliente | `components/domain/service-timeline.tsx` | Progreso visual del servicio en 5 pasos. |
| **NextJobCard** | Técnico | `components/domain/next-job-card.tsx` | Hero card con ETA prominente y acciones rápidas. |
| **EmptyStates** | Todos | `components/domain/empty-state.tsx` | Ilustraciones contextuales para estados vacíos. |

## 🚀 5. Proceso de Implementación

1.  **Definición de Intent:** Antes de crear una interfaz, definir quién es el usuario, qué debe lograr y cómo debe sentirse.
2.  **Tokens First:** Utilizar siempre las variables de `styles/tokens.css` y las clases de utilidad de Tailwind configuradas.
3.  **Signature Element:** Incluir al menos un elemento visual único (e.g. el timeline visual o el dispatch board).
4.  **Validación Responsive:** Probar en resoluciones críticas: 360px (Móvil), 768px (Tablet), 1280px (Desktop).

---
*Este documento consolida la información de análisis, progreso y responsive workshop.*
