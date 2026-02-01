<!-- NOTA: Este archivo es obsoleto. El proyecto se llamaba anteriormente "TecnoCity", ahora es "SomosTécnicos". -->
# 🛣️ Rutas de Acceso y Credenciales - TecnoCitystro

## 📍 Rutas Públicas

### Registro de Clientes
```
http://localhost:3000/register/customer
```
**Descripción:** Formulario multietapa para registro de nuevos clientes
- Paso 1: Datos básicos
- Paso 2: Ubicación
- Paso 3: Preferencias de electrodomésticos

### Registro de Técnicos
```
http://localhost:3000/register/technician
```
**Descripción:** Formulario de solicitud para nuevos técnicos
- Requiere aprobación del administrador
- Estado inicial: PENDING

### Login Unificado
```
http://localhost:3000/login
```
**Descripción:** Login para todos los tipos de usuarios
- Detecta automáticamente el rol
- Bloquea técnicos pendientes de aprobación

---

## 🔐 Rutas Protegidas

### Panel de Administración - Solicitudes
```
http://localhost:3000/admin/applications
```
**Descripción:** Gestión de solicitudes de técnicos
- Listar solicitudes pendientes
- Aprobar/Rechazar solicitudes
- Ver detalles de cada solicitud

**Requiere:** Rol de Admin o Super Admin

### Dashboard de Cliente
```
http://localhost:3000/customer/dashboard
```
**Descripción:** Panel principal del cliente
**Requiere:** Login como cliente

### Dashboard de Técnico
```
http://localhost:3000/technician/dashboard
```
**Descripción:** Panel principal del técnico
**Requiere:** Login como técnico aprobado

### Pantalla de Espera (Técnico Pendiente)
```
http://localhost:3000/technician/pending-approval
```
**Descripción:** Información para técnicos en espera de aprobación

---

## 🔗 Enlaces Rápidos para Testing

### Flujo Completo de Cliente:
1. Registro: http://localhost:3000/register/customer
2. Login: http://localhost:3000/login
3. Dashboard: http://localhost:3000/customer/dashboard

### Flujo Completo de Técnico:
1. Registro: http://localhost:3000/register/technician
2. Espera de aprobación
3. Admin aprueba: http://localhost:3000/admin/applications
4. Login: http://localhost:3000/login
5. Dashboard: http://localhost:3000/technician/dashboard

---

## 📧 Emails Enviados Automáticamente

### Al Registrarse como Técnico:
- **Para:** Email del técnico
- **Asunto:** "Solicitud Recibida - TecnoCity"
- **Contenido:** Confirmación de recepción de solicitud

### Al Aprobar Técnico:
- **Para:** Email del técnico
- **Asunto:** "🎉 Solicitud Aprobada - Bienvenido a TecnoCity"
- **Contenido:**
  - Credenciales de acceso
  - Contraseña temporal
  - Instrucciones de primer login

### Al Rechazar Técnico:
- **Para:** Email del técnico
- **Asunto:** "Solicitud de Técnico - TecnoCity"
- **Contenido:**
  - Notificación de rechazo
  - Motivo del rechazo
  - Información de contacto

---

## 🎯 Accesos Directos para Desarrollo

```bash
# Abrir registro de cliente
start http://localhost:3000/register/customer

# Abrir registro de técnico
start http://localhost:3000/register/technician

# Abrir panel de admin
start http://localhost:3000/admin/applications

# Abrir Prisma Studio (ver base de datos)
pnpm db:studio
```

---

## 🔑 Credenciales de Prueba

### Admin (para aprobar técnicos):
```
Email: admin.demo@somostecnicos.com
Password: Demo2026!Secure
```

### Cliente de Prueba:
```
Email: cliente@test.com
Password: Test123!
```

### Técnico de Prueba (después de aprobación):
```
Email: [el que registres]
Password: [contraseña temporal del email]
```
