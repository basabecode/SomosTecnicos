# 🔐 Cuentas de Prueba - Sistema de Servicio Técnico

Este documento contiene las credenciales de las cuentas de prueba creadas automáticamente al ejecutar `pnpm db:seed`.

## 👨‍💼 Cuenta de Administrador

### Super Administrador

- **Email:** `admin@servicio-tecnico.com`
- **Contraseña:** `Admin123!`
- **Usuario:** `admin`
- **Nombre:** Administrador Principal
- **Rol:** `super_admin`
- **Acceso:** Panel completo de administración

**Panel de acceso:** `/admin/dashboard`

---

## 👥 Cuentas de Clientes

### Cliente 1 - Camila Suárez

- **Email:** `cliente.demo@tecnocity.com`
- **Contraseña:** `Cliente123!`
- **Usuario:** `cliente.demo`
- **Nombre:** Camila Suárez
- **Teléfono:** 3005557788
- **Ciudad:** Bogotá
- **Dirección:** Carrera 45 #12-34

### Cliente 2 - Esteban Mejía (VIP)

- **Email:** `cliente.vip@tecnocity.com`
- **Contraseña:** `Cliente123!`
- **Usuario:** `cliente.vip`
- **Nombre:** Esteban Mejía
- **Teléfono:** 3106668899
- **Ciudad:** Medellín
- **Dirección:** Calle 98 #23-45

### Cliente 3 - Daniela Gómez

- **Email:** `cliente.norte@tecnocity.com`
- **Contraseña:** `Cliente123!`
- **Usuario:** `cliente.norte`
- **Nombre:** Daniela Gómez
- **Teléfono:** 3207779900
- **Ciudad:** Barranquilla
- **Dirección:** Transversal 25 #45-12

**Panel de acceso:** `/customer/dashboard`

---

## 🚀 Cómo Probar el Sistema

### 1. Asegurar que la Base de Datos esté Inicializada

```bash
# Si es la primera vez, ejecutar:
pnpm setup

# O si ya existe, solo regenerar datos:
pnpm db:seed
```

### 2. Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

### 3. Acceder a los Diferentes Portales

#### Portal de Administración

1. Ir a: `http://localhost:3000/admin/login`
2. Usar credenciales de administrador
3. Explorar: Dashboard, Órdenes, Técnicos, Reportes, etc.

#### Portal de Cliente

1. Ir a: `http://localhost:3000/customer/login`
2. Usar cualquiera de las credenciales de cliente
3. Explorar: Dashboard, Solicitar servicio, Historial, Mensajes, etc.

#### Página Principal

1. Ir a: `http://localhost:3000`
2. Ver la landing page y formulario de solicitud de servicio

---

## 🔍 Funcionalidades a Validar

### Como Administrador:

- ✅ Login/logout
- ✅ Dashboard con métricas
- ✅ Gestión de órdenes
- ✅ Gestión de técnicos
- ✅ Reportes y estadísticas
- ✅ Configuraciones del sistema

### Como Cliente:

- ✅ Login/logout
- ✅ Dashboard personalizado
- ✅ Solicitar nuevo servicio
- ✅ Ver historial de servicios
- ✅ Seguimiento de órdenes activas
- ✅ Configuraciones de perfil

### Funcionalidades Generales:

- ✅ Navegación entre secciones
- ✅ Diseño responsive
- ✅ Sistema de notificaciones
- ✅ Formularios de solicitud

---

## 🎯 Rutas de Navegación Principales

### Administración

- `/admin` - Página principal admin
- `/admin/login` - Login administrativo
- `/admin/dashboard` - Dashboard principal
- `/admin/orders` - Gestión de órdenes
- `/admin/technicians` - Gestión de técnicos
- `/admin/reports` - Reportes y análisis

### Cliente

- `/customer/login` - Login de cliente
- `/customer/dashboard` - Dashboard de cliente
- `/customer/request` - Solicitar servicio
- `/customer/history` - Historial de servicios
- `/customer/messages` - Centro de mensajes
- `/customer/settings` - Configuraciones

### Públicas

- `/` - Landing page
- `/login` - Redirección de login

---

## 📱 Dispositivos de Prueba

El sistema está optimizado para:

- **Desktop:** 1920x1080+
- **Tablet:** 768x1024
- **Mobile:** 375x667+

---

## 🔧 Comandos Útiles

```bash
# Reiniciar base de datos completa
pnpm reset

# Ver base de datos en navegador
pnpm db:studio

# Logs del servidor
pnpm dev

# Construir para producción
pnpm build
```

---

## ⚠️ Notas Importantes

1. **Estas son cuentas de PRUEBA solamente**
2. Las contraseñas son públicas y deben cambiarse en producción
3. Los datos se recrean cada vez que se ejecuta `pnpm db:seed`
4. En producción, usar variables de entorno para credenciales
5. El sistema incluye datos de ejemplo (órdenes, técnicos, etc.)

---

_Última actualización: Octubre 2025_
