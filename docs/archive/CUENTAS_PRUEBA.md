<!-- NOTA: Este archivo es obsoleto. El proyecto se llamaba anteriormente "TecnoCity", ahora es "SomosTécnicos". -->
# 🔐 Cuentas de Prueba y Credenciales - TecnoCity

**Última actualización:** 2 de enero de 2026
**Propósito:** Testing y demostración del sistema

---

## 📋 INFORMACIÓN IMPORTANTE

⚠️ **ESTAS SON CUENTAS DE PRUEBA ÚNICAMENTE**

- Las credenciales son públicas y **NO deben usarse en producción**
- Los datos se recrean cada vez que se ejecuta `pnpm db:seed`
- Todas las contraseñas deben cambiarse en un entorno de producción
- El sistema incluye datos de ejemplo (órdenes, técnicos, clientes)

---

## 👥 CUENTAS DISPONIBLES

### 🛡️ **1. ADMINISTRADOR**

**Acceso completo al sistema**

```
Email:     admin.demo@tecnocity.com
Password:  123456
Rol:       super_admin
Panel:     /admin/dashboard
```

**Permisos:**
- ✅ Gestión completa de órdenes
- ✅ Gestión de técnicos
- ✅ Reportes y estadísticas
- ✅ Configuraciones del sistema
- ✅ Asignación de servicios
- ✅ Visualización de métricas

---

### 🔧 **2. TÉCNICO**

**Portal para técnicos de campo**

```
Email:     tecnico.demo@tecnocity.com
Password:  123456
Rol:       technician
Panel:     /technician/dashboard
```

**Permisos:**
- ✅ Ver asignaciones propias
- ✅ Actualizar estado de órdenes
- ✅ Registrar servicios completados
- ✅ Ver historial de trabajos
- ✅ Gestionar disponibilidad
- ✅ Recibir notificaciones de nuevas asignaciones

---

### 👤 **3. CLIENTE**

**Portal para clientes finales**

```
Email:     cliente.demo@tecnocity.com
Password:  123456
Rol:       customer
Panel:     /customer/dashboard
```

**Información del Cliente:**
- **Nombre:** Camila Suárez
- **Teléfono:** +57 300 555 7788
- **Ciudad:** Bogotá
- **Dirección:** Carrera 45 #12-34

**Permisos:**
- ✅ Solicitar nuevos servicios
- ✅ Ver historial de servicios
- ✅ Seguimiento de órdenes activas
- ✅ Gestión de garantías
- ✅ Mensajería con soporte
- ✅ Configuración de perfil

---

### 👤 **4. CLIENTE VIP** (Opcional)

**Cliente con historial extenso**

```
Email:     cliente.vip@tecnocity.com
Password:  123456
Rol:       customer
Panel:     /customer/dashboard
```

**Información del Cliente:**
- **Nombre:** Esteban Mejía
- **Teléfono:** +57 310 666 8899
- **Ciudad:** Medellín
- **Dirección:** Calle 98 #23-45
- **Nivel:** VIP (cliente frecuente)

---

### 👤 **5. CLIENTE ADICIONAL** (Opcional)

**Cliente de otra ciudad**

```
Email:     cliente.norte@tecnocity.com
Password:  123456
Rol:       customer
Panel:     /customer/dashboard
```

**Información del Cliente:**
- **Nombre:** Daniela Gómez
- **Teléfono:** +57 320 777 9900
- **Ciudad:** Barranquilla
- **Dirección:** Transversal 25 #45-12

---

## 🚀 GUÍA DE INICIO RÁPIDO

### **Paso 1: Preparar la Base de Datos**

```bash
# Primera vez (incluye Docker, DB y seed)
pnpm setup

# O solo regenerar datos de prueba
pnpm db:seed
```

### **Paso 2: Iniciar el Servidor**

```bash
pnpm dev
```

El servidor estará disponible en: `http://localhost:3000`

### **Paso 3: Acceder al Sistema**

#### **Login Unificado (Recomendado)**
```
URL: http://localhost:3000/login
```
- Ingresa cualquiera de las credenciales de arriba
- El sistema detectará automáticamente tu rol
- Serás redirigido al panel correspondiente

#### **Acceso Directo por Rol**
- **Admin:** `http://localhost:3000/admin/dashboard`
- **Técnico:** `http://localhost:3000/technician/dashboard`
- **Cliente:** `http://localhost:3000/customer/dashboard`

---

## 🧪 ESCENARIOS DE PRUEBA

### **Como Administrador:**

1. **Gestión de Órdenes**
   - Ver todas las órdenes del sistema
   - Crear órdenes manualmente
   - Asignar técnicos a órdenes
   - Actualizar estados

2. **Gestión de Técnicos**
   - Ver lista de técnicos
   - Crear nuevos técnicos
   - Ver disponibilidad y carga de trabajo
   - Asignar zonas de trabajo

3. **Reportes**
   - Dashboard con métricas en tiempo real
   - Reportes de rendimiento
   - Análisis de servicios
   - Estadísticas de satisfacción

### **Como Técnico:**

1. **Mis Asignaciones**
   - Ver órdenes asignadas
   - Actualizar estado de servicio
   - Marcar como completado
   - Agregar notas técnicas

2. **Calendario**
   - Ver agenda del día/semana
   - Gestionar disponibilidad
   - Ver próximas citas

3. **Historial**
   - Servicios completados
   - Estadísticas personales
   - Evaluaciones recibidas

### **Como Cliente:**

1. **Solicitar Servicio**
   - Formulario de solicitud
   - Selección de tipo de servicio
   - Programación de cita
   - Subir fotos del problema

2. **Seguimiento**
   - Ver estado de servicios activos
   - Historial completo
   - Detalles de garantías
   - Facturas y pagos

3. **Comunicación**
   - Centro de mensajes
   - Notificaciones en tiempo real
   - Soporte técnico

---

## 🔍 VALIDACIÓN DE FUNCIONALIDADES

### **✅ Autenticación y Seguridad**
- [ ] Login con credenciales correctas
- [ ] Rechazo de credenciales incorrectas
- [ ] Redirección según rol
- [ ] Logout correcto
- [ ] Protección de rutas
- [ ] Tokens JWT funcionando

### **✅ Gestión de Órdenes**
- [ ] Crear nueva orden
- [ ] Ver lista de órdenes
- [ ] Filtrar órdenes por estado
- [ ] Actualizar estado de orden
- [ ] Asignar técnico
- [ ] Ver detalles completos

### **✅ Notificaciones**
- [ ] Notificaciones in-app
- [ ] Badge de contador
- [ ] Marcar como leída
- [ ] Enlaces dinámicos
- [ ] Polling automático

### **✅ UI/UX**
- [ ] Diseño responsive
- [ ] Navegación intuitiva
- [ ] Feedback visual
- [ ] Estados de carga
- [ ] Manejo de errores

---

## 🛠️ COMANDOS ÚTILES

```bash
# Ver base de datos en navegador
pnpm db:studio

# Reiniciar base de datos completa
pnpm reset

# Generar cliente Prisma
pnpm db:generate

# Push cambios de schema a DB
pnpm db:push

# Construir para producción
pnpm build

# Iniciar en modo producción
pnpm start
```

---

## 📱 DISPOSITIVOS DE PRUEBA RECOMENDADOS

| Dispositivo | Resolución | Navegador |
|-------------|------------|-----------|
| Desktop | 1920x1080+ | Chrome, Firefox, Edge |
| Laptop | 1366x768+ | Chrome, Safari |
| Tablet | 768x1024 | Safari, Chrome |
| Mobile | 375x667+ | Safari iOS, Chrome Android |

---

## 🎯 RUTAS PRINCIPALES DEL SISTEMA

### **Públicas**
- `/` - Landing page
- `/login` - Login unificado

### **Administración**
- `/admin/dashboard` - Dashboard principal
- `/admin/orders` - Gestión de órdenes
- `/admin/technicians` - Gestión de técnicos
- `/admin/reports` - Reportes y análisis
- `/admin/settings` - Configuraciones

### **Técnico**
- `/technician/dashboard` - Dashboard técnico
- `/technician/assignments` - Mis asignaciones
- `/technician/schedule` - Calendario
- `/technician/history` - Historial
- `/technician/notifications` - Notificaciones

### **Cliente**
- `/customer/dashboard` - Dashboard cliente
- `/customer/request` - Solicitar servicio
- `/customer/services` - Mis servicios
- `/customer/history` - Historial
- `/customer/warranty` - Garantías
- `/customer/messages` - Mensajes
- `/customer/notifications` - Notificaciones

---

## 🔒 SEGURIDAD EN PRODUCCIÓN

### **⚠️ ANTES DE DESPLEGAR:**

1. **Cambiar todas las contraseñas**
   - Usar contraseñas fuertes (mínimo 12 caracteres)
   - Incluir mayúsculas, minúsculas, números y símbolos
   - No reutilizar contraseñas

2. **Configurar variables de entorno**
   ```bash
   DATABASE_URL=postgresql://...
   JWT_SECRET=<secreto-aleatorio-fuerte>
   JWT_REFRESH_SECRET=<otro-secreto-diferente>
   ```

3. **Habilitar 2FA** (cuando esté implementado)
   - Para cuentas de administrador
   - Para cuentas de gerente

4. **Revisar permisos**
   - Validar RBAC
   - Verificar protección de rutas
   - Auditar logs de acceso

---

## 📞 SOPORTE

**¿Problemas con las cuentas de prueba?**

1. Verifica que Docker esté corriendo
2. Ejecuta `pnpm reset` para reiniciar todo
3. Revisa los logs en la consola
4. Consulta la documentación en `/docs`

---

**Generado por:** TecnoCity Development Team
**Versión:** 1.2.0
**Fecha:** 2 de enero de 2026
