# 🔧 SomosTécnicos - Sistema de Gestión de Servicios Técnicos (FSM)

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.0-2D3748)](https://www.prisma.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> 🏠 **Plataforma Integral de Field Service Management (FSM)** diseñada para optimizar la gestión, asignación y seguimiento de servicios técnicos a domicilio para electrodomésticos y tecnología inteligente.

---

## 🌟 Funcionalidad del Proyecto

**SomosTécnicos** centraliza todo el ciclo de vida de un servicio técnico, desde el diagnóstico inicial hasta la finalización del trabajo en campo.

### � Ecosistema de Roles (RBAC)
*   **Clientes:** Solicitud de servicios mediante formularios guiados o asistente IA, seguimiento en tiempo real y gestión de perfil.
*   **Técnicos:** Interfaz móvil optimizada para gestionar asignaciones, actualizar estados de órdenes y reportar finalización de servicios.
*   **Administradores:** Control total sobre el dashboard de operaciones, asignación manual de técnicos, aprobación de nuevas solicitudes de técnicos y análisis de métricas.

### 🚀 Características Destacadas
*   **Asistente IA Diagnóstico:** Chatbot integrado que ayuda al cliente a identificar fallas y pre-vende el servicio técnico adecuado. Enlazado directamente con el sistema de órdenes.
*   **Flujo de Estados (FSM):** Sistema robusto de estados (Pendiente, Asignado, En Proceso, Completado, Cancelado) que asegura la trazabilidad.
*   **Notificaciones Multi-canal:** Alertas internas (In-App) y notificaciones externas vía email para cambios de estado en tiempo real.
*   **Diseño Premium:** Interfaz moderna, rápida y responsiva con animaciones fluidas utilizando Framer Motion y componentes de alta calidad.

---

## 🛠️ Stack Tecnológico

### **Frontend & UX**
*   **Next.js 15.2.4** (App Router & Server Actions)
*   **React 19**
*   **Tailwind CSS 4.0** & **shadcn/ui** (Componentes de interfaz consistentes)
*   **Framer Motion** (Animaciones fluidas y micro-interacciones)
*   **Lucide React** (Paquete de iconos vectoriales)

### **Backend & Infraestructura**
*   **TypeScript** (Robustez y tipado estático en todo el proyecto)
*   **Prisma ORM** (Gestión de base de datos eficiente y segura)
*   **PostgreSQL** (Motor de base de datos relacional para alta disponibilidad)
*   **JWT & BCrypt** (Seguridad en autenticación y protección de datos)
*   **Zod** (Validación rigurosa de datos en servidor y cliente)

### **Herramientas de Desarrollo**
*   **Playwright** (Testing automatizado de flujos críticos de usuario)
*   **Docker** (Entorno de desarrollo controlado para servicios de base de datos)
*   **PNPM** (Gestor de dependencias de alto rendimiento)

---

## 📂 Estructura Principal del Proyecto

```text
├── app/                  # Núcleo de la aplicación (Next.js App Router)
│   ├── (auth)/           # Flujos de autenticación y acceso
│   ├── (client)/         # Área exclusiva para clientes
│   ├── (technician)/     # Portal móvil para personal técnico
│   ├── admin/            # Panel administrativo centralizado
│   └── api/              # Endpoints y lógica de servidor (API REST)
├── components/           # Librería de componentes UI (Atómicos y Moleculares)
├── docs/                 # Base de conocimientos y manuales técnicos
├── lib/                  # Servicios de backend, utilidades y lógica compartida
├── prisma/               # Definición del modelo de datos y migraciones
├── public/               # Recursos estáticos (Imágenes, Fuentes, etc.)
├── scripts/              # Scripts de automatización y mantenimiento
├── styles/               # Definiciones globales de diseño (CSS)
└── tests/                # Suite de pruebas automatizadas
```

---

## 🚀 Guía de Instalación

1.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```
2.  **Configuración:** Copiar `.env.example` a `.env` y configurar las credenciales de base de datos y secretos JWT.
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

> 🔒 **Importante:** Las contraseñas reales se encuentran protegidas en el entorno de desarrollo seguro. Para realizar pruebas locales sólidas, consulte `docs/02-TESTING-Y-ACCESO.md`.

---

## 📚 Documentación del Sistema

Existen guías detalladas para cada sección del proyecto en la carpeta `docs/`:

1.  🏗️ **[Arquitectura](docs/01-SISTEMA-Y-ARQUITECTURA.md)**: Visión técnica profunda.
2.  🧪 **[Pruebas](docs/02-TESTING-Y-ACCESO.md)**: Cómo ejecutar la suite de tests.
3.  🗺️ **[Roadmap](docs/03-ROADMAP-Y-PENDIENTES.md)**: Visión de futuro y próximos pasos.

---

## 📄 Licencia
Este proyecto es propiedad privada y está bajo la Licencia MIT.

**Desarrollado por [basabecode](https://github.com/basabecode)**
