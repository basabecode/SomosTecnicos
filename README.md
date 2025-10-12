# 🔧 TecnoCity - Sistema de Reparación de Electrodomésticos

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> 🏠 **Plataforma web moderna para servicios técnicos de electrodomésticos tipo "Uber for Repairs"**

## 🚀 Características Principales

### 🎨 **Frontend Optimizado (UX/UI 2025)**
- ✅ Landing page responsive con diseño mobile-first
- ✅ Formulario optimizado de 3 pasos para máxima conversión
- ✅ Chat IA integrado para diagnóstico automático
- ✅ Componentes UI modernos con shadcn/ui y Tailwind CSS
- ✅ Animaciones fluidas y microinteracciones

### 🤖 **Asistente IA TecnoCity**
- ✅ Diagnóstico inteligente de problemas de electrodomésticos
- ✅ Cotización automática basada en IA
- ✅ Auto-llenado de formularios
- ✅ Respuestas contextuales y sugerencias técnicas

### 👥 **Sistema Multi-Usuario**
- 🏠 **Clientes**: Solicitar servicios, seguimiento de órdenes
- 🔧 **Técnicos**: Dashboard, asignaciones, historial
- 👨‍💼 **Administradores**: Gestión completa, reportes, analytics

### 📊 **Panel de Administración**
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de órdenes y asignaciones
- ✅ Reportes visuales y analytics
- ✅ Sistema de notificaciones

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 15.2.4** - Framework de React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utility-first
- **shadcn/ui** - Componentes UI modernos
- **Lucide React** - Iconos SVG optimizados
- **Framer Motion** - Animaciones fluidas

### **Backend & Base de Datos**
- **Prisma ORM** - Object-Relational Mapping moderno
- **PostgreSQL** - Base de datos relacional
- **Next.js API Routes** - Endpoints RESTful
- **JWT** - Autenticación con tokens seguros
- **bcryptjs** - Hashing de contraseñas

### **Herramientas de Desarrollo**
- **pnpm** - Gestor de paquetes rápido
- **ESLint** - Linter para código JavaScript/TypeScript
- **Docker** - Contenedores para desarrollo
- **VS Code** - Editor recomendado con extensiones

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- pnpm (recomendado) o npm
- Docker y Docker Compose
- PostgreSQL (o usar Docker)

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/basabecode/TecnoCity.git
cd TecnoCity
```

### **2. Instalar Dependencias**
```bash
pnpm install
```

### **3. Configurar Variables de Entorno**
Crea un archivo `.env.local`:
```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/tecnocity"

# JWT
JWT_SECRET="tu-secreto-jwt-super-seguro"

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-password"
```

### **4. Configurar Base de Datos**
```bash
# Iniciar PostgreSQL con Docker
pnpm docker:up

# Ejecutar migraciones de Prisma
pnpm db:push

# Poblar base de datos con datos de ejemplo
pnpm db:seed
```

### **5. Ejecutar en Desarrollo**
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Rutas Principales

### **🏠 Usuario General**
- `/` - Landing page con formulario optimizado
- `/login` - Página de autenticación

### **👤 Cliente**
- `/customer/dashboard` - Dashboard del cliente
- `/customer/request` - Solicitar nuevo servicio
- `/customer/history` - Historial de servicios

### **🔧 Técnico**
- `/technician/dashboard` - Dashboard del técnico
- `/technician/assignments` - Asignaciones activas
- `/technician/history` - Historial de trabajos

### **👨‍💼 Administrador**
- `/admin/dashboard` - Panel de control principal
- `/admin/orders` - Gestión de órdenes
- `/admin/technicians` - Gestión de técnicos
- `/admin/reports` - Reportes y analytics

## 🤖 API Endpoints

### **Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### **Órdenes de Servicio**
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear nueva orden
- `GET /api/orders/[id]` - Obtener orden específica
- `PUT /api/orders/[id]/status` - Actualizar estado

### **Chat IA**
- `POST /api/ai-chat` - Procesar mensaje del chat IA

### **Técnicos**
- `GET /api/technicians` - Listar técnicos
- `POST /api/technicians` - Crear técnico
- `GET /api/technicians/available` - Técnicos disponibles

## 🎯 Características del Asistente IA

### **Diagnóstico Inteligente**
- Reconocimiento de electrodomésticos (nevera, lavadora, aire acondicionado, etc.)
- Identificación de problemas comunes
- Estimación automática de costos y tiempos

### **Servicios Detectados**
- **Reparaciones**: Diagnóstico de fallas y reparación
- **Mantenimiento**: Servicios preventivos 
- **Instalación**: Instalación profesional de equipos

### **Electrodomésticos Compatibles**
- 🧊 Neveras y refrigeradores
- 🧺 Lavadoras y secadoras  
- ❄️ Aires acondicionados
- 🔥 Estufas y hornos
- 📡 Microondas
- 🔧 Otros electrodomésticos

## 📊 Dashboard y Reportes

### **Métricas Principales**
- Total de órdenes activas
- Técnicos disponibles
- Ingresos del mes
- Calificación promedio

### **Reportes Visuales**
- Gráficos de órdenes por período
- Distribución por tipo de servicio
- Rendimiento de técnicos
- Análisis de tendencias

## 🔒 Cuentas de Prueba

### **Administrador**
- **Usuario**: `admin@tecnocity.com`
- **Contraseña**: `admin123`

### **Técnico**
- **Usuario**: `tecnico@tecnocity.com`  
- **Contraseña**: `tecnico123`

### **Cliente**
- Registro libre desde la landing page

## 🚢 Despliegue

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### **Docker**
```bash
# Construir imagen
docker build -t tecnocity .

# Ejecutar contenedor
docker run -p 3000:3000 tecnocity
```

## 📚 Documentación Adicional

- 📖 [Arquitectura del Software](docs/ARQUITECTURA_SOFTWARE.md)
- 🔍 [Auditoría Completa](docs/AUDITORIA_COMPLETA_SOFTWARE.md)  
- 🎯 [Mejoras UX/UI](docs/REPORTE_MEJORAS_FRONTEND_COMPLETO.md)
- 🛣️ [Roadmap 2025](docs/ROADMAP_MEJORAS_2025.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Desarrollado por

**basabecode** - [GitHub](https://github.com/basabecode)

---

⭐ **¡Si te gusta el proyecto, dale una estrella!** ⭐

🔗 **Demo en vivo**: [TecnoCity](https://tu-dominio.vercel.app)