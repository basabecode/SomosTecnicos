# 🔧 somostecnicos - Sistema de Gestión de Servicios Técnicos (FSM)

> ℹ️ **Nota de Rebranding:** Este proyecto, anteriormente conocido como **TecnoCity**, ha sido oficialmente renombrado a **somostecnicos**.

 [![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
 [![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
 [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
 [![Prisma](https://img.shields.io/badge/Prisma-6.17.0-2D3748)](https://www.prisma.io/)
 [![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
 [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> 🏠 **Plataforma Integral de Field Service Management (FSM)** diseñada para optimizar la gestión, asignación y seguimiento de servicios técnicos a domicilio para electrodomésticos y tecnología inteligente.

**Actualmente en Producción (Versión 2.1 - Fase 2 Escalabilidad)**

---

## 🌟 Funcionalidad del Proyecto

**somostecnicos** centraliza todo el ciclo de vida de un servicio técnico, desde el diagnóstico inicial hasta la finalización del trabajo en campo.

###  Ecosistema de Roles (RBAC)
*   **Clientes:** Solicitud de servicios, seguimiento en tiempo real y gestión de perfil.
*   **Técnicos:** Interfaz móvil optimizada para gestionar asignaciones.
*   **Administradores:** Control total sobre el dashboard, asignación manual y análisis de métricas.

### 🚀 Características Destacadas
*   **ALTA CONCURRENCIA (Fase 2):**  Soporte optimizado para 500+ usuarios simultáneos mediante Rate Limiting.
*   **Asistente IA Diagnóstico:** Chatbot integrado que ayuda al cliente a identificar fallas.
*   **Flujo de Estados (FSM):** Sistema robusto de estados con trazabilidad completa.
*   **Transacciones Seguras:** Asignaciones atómicas libres de conflictos (Race Conditions).
*   **Notificaciones Asíncronas:** Sistema de colas para emails y alertas sin bloqueo de UI.
*   **Diseño Premium:** Interfaz moderna y responsiva.

---

## 🛠️ Stack Tecnológico

### **Frontend & UX**
*   **Next.js 15.2.4** (App Router & Server Actions)
*   **React 19**
*   **Tailwind CSS 4.0** & **shadcn/ui**
*   **Framer Motion** (Animaciones fluidas)

### **Backend & Infraestructura**
*   **TypeScript** (Tipado estricto)
*   **Prisma ORM** (Connection Pooling configurado)
*   **PostgreSQL** (Neon Tech)
*   **Redis** (Caché de alto rendimiento)
*   **Rate Limiting Middleware**
*   **Colas de Mensajes** (Background Jobs)

### **Herramientas de Desarrollo**
*   **Playwright** (Testing E2E)
*   **Docker** (Entorno local)
*   **PNPM** (Gestor de dependencias)

---

## 📂 Estructura Principal

```text
├── app/                  # Núcleo de la aplicación (Next.js App Router)
├── components/           # Librería de componentes UI
├── docs/                 # Base de conocimientos (Ver Índice)
├── lib/                  # Servicios de backend (Cache, Queue, Email)
├── prisma/               # Esquema de base de datos
├── public/               # Recursos estáticos
└── scripts/              # Scripts de mantenimiento
```

---

## 🚀 Guía de Instalación

1.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```
2.  **Configuración:** Copiar `.env.example` a `.env`.
3.  **Base de Datos (Docker):**
    ```bash
    pnpm docker:up
    ```
4.  **Desplegar esquema y semillas:**
    ```bash
    pnpm db:push
    pnpm db:seed
    ```
5.  **Iniciar Desarrollo:**
    ```bash
    pnpm dev
    ```

---

## 🔐 Acceso de Demostración

| Perfil | Credencial de Usuario | Acceso |
|-----|-------|----------|
| **Administrador** | `admin.demo@somostecnicos.com` | `********` |
| **Técnico** | `tecnico.demo@somostecnicos.com` | `********` |
| **Cliente** | `cliente.demo@somostecnicos.com` | `********` |

> 🔒 **Importante:** Consulte `docs/pruebas/GUIA_ACCESO_TESTING.md` para más detalles.

---

## 📚 Documentación del Sistema

Toda la documentación está organizada en `docs/`. Consulte el **[Índice de Documentación](docs/INDICE.md)** para navegar por:

1.  🏗️ **[Arquitectura](docs/01_ARQUITECTURA_SISTEMA.md)**
2.  🎨 **[Diseño y UI](docs/diseno/UI_GUIDE.md)**
3.  🚀 **[Operaciones](docs/operaciones/DEPLOYMENT_VERCEL.md)**
4.  📝 **[Changelog](docs/registro_cambios/CHANGELOG.md)**

---

## 📄 Licencia
Este proyecto es propiedad privada y está bajo la Licencia MIT.

**Desarrollado por [basabecode](https://github.com/basabecode)**
