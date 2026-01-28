# 🔧 SomosTécnicos - Sistema de Gestión de Servicios Técnicos (FSM)

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> 🏠 **Plataforma web premium para la gestión y asignación de servicios técnicos de electrodomésticos a domicilio.**

---

## � Estado del Proyecto (Enero 2026)
- **Progreso General:** 90% ✅
- **Hito Reciente:** Sistema de Notificaciones In-App (Persistentes) completamente funcional.
- **En Enfoque:** Implementación de Facturación Electrónica y Gateway de Pagos.

---

## �🚀 Características Principales

### 🎨 **Frontend Optimizado (UX/UI 2025)**
- ✅ **Diseño Premium:** Estética moderna con colores corporativos (#A50034, #2C3E50).
- ✅ **Conversión:** Formulario wizard de 3 pasos diseñado para reducir fricción.
- ✅ **Mobile-First:** Optimización total para técnicos en campo y clientes móviles.
- ✅ **Interactividad:** Animaciones fluidas con Framer Motion y componentes shadcn/ui.

### 🤖 **Asistente IA v2.1**
- ✅ **Diagnóstico Inteligente:** Identificación automática de fallas en electrodomésticos.
- ✅ **Auto-llenado:** El chat IA transfiere datos directamente al formulario de solicitud.
- ✅ **Contextual:** Sugiere servicios de mantenimiento, instalación o reparación según el caso.

### 👥 **Roles y Gestión (RBAC)**
- 🏠 **Clientes:** Portal para solicitar servicios, rastrear órdenes y recibir notificaciones.
- 🔧 **Técnicos:** Vista optimizada para móviles, gestión de asignaciones y reporte de trabajos.
- 👨‍💼 **Administradores:** Panel de control para asignación manual, gestión de técnicos y analytics.

---

## 🛠️ Stack Tecnológico

### **Frontend & UX**
- **Next.js 15.2.4** (App Router)
- **React 19**
- **Tailwind CSS** & **shadcn/ui**
- **Framer Motion** (Animaciones)

### **Backend & Core**
- **Prisma ORM** (PostgreSQL)
- **TypeScript**
- **Zod** (Validaciones de esquemas globales)
- **JWT** (Autenticación segura con Roles)
- **BCrypt** (Hashing de seguridad)

---

## 🚀 Instalación Rápida

### **1. Configurar Entorno**
```bash
pnpm install
# Clonar .env.example a .env.local y configurar DATABASE_URL
```

### **2. Preparar Base de Datos**
```bash
pnpm db:push    # Sincronizar esquema
pnpm db:seed    # Poblar con datos de prueba
```

### **3. Iniciar**
```bash
pnpm dev
```

---

## � Cuentas de Prueba (Demo)

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | `admin.demo@tecnocity.com` | `123456` |
| **Técnico** | `tecnico.demo@tecnocity.com` | `123456` |
| **Cliente** | `cliente.demo@tecnocity.com` | `123456` |

*Para más detalles y casos de prueba, consulta [02-TESTING-Y-ACCESO.md](docs/02-TESTING-Y-ACCESO.md).*

---

## 📚 Documentación del Sistema

Para una comprensión profunda del sistema, consulta nuestra base de conocimientos en el directorio `docs/`:

1.  � **[01-SISTEMA-Y-ARQUITECTURA.md](docs/01-SISTEMA-Y-ARQUITECTURA.md)**: Estructura, roles y stack técnico.
2.  🧪 **[02-TESTING-Y-ACCESO.md](docs/02-TESTING-Y-ACCESO.md)**: Guía detallada de pruebas y credenciales.
3.  � **[03-ROADMAP-Y-PENDIENTES.md](docs/03-ROADMAP-Y-PENDIENTES.md)**: Próximas funcionalidades y visión 2026.
4.  � **[04-AUDITORIA-E-HISTORIAL.md](docs/04-AUDITORIA-E-HISTORIAL.md)**: Hitos alcanzados y reportes consolidados.
5.  🗺️ **[INDICE_DOCUMENTACION.md](docs/INDICE_DOCUMENTACION.md)**: Mapa completo de archivos.

---

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Desarrollado por
**basabecode** - [GitHub](https://github.com/basabecode)
