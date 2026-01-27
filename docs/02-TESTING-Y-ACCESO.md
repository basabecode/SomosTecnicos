# 🧪 02. TESTING Y ACCESO - Guía de Pruebas

Este documento contiene las credenciales de prueba, flujos de validación y guías para testing manual del sistema SomosTécnicos.

---

## 🔐 1. Cuentas de Prueba (Demo)

⚠️ **IMPORTANTE:** Estas cuentas son solo para el entorno de desarrollo/testing. Las contraseñas se reinician con `pnpm db:seed`.

| Rol | Email | Password | Panel Principal |
|-----|-------|----------|-----------------|
| **Admin** | `admin.demo@tecnocity.com` | `123456` | `/admin/dashboard` |
| **Técnico** | `tecnico.demo@tecnocity.com` | `123456` | `/technician/dashboard` |
| **Cliente** | `cliente.demo@tecnocity.com` | `123456` | `/customer/dashboard` |
| **Cliente VIP**| `cliente.vip@tecnocity.com` | `123456` | `/customer/dashboard` |

### **Script de Restauración:**
Si las cuentas no funcionan o necesitas limpiar datos:
```bash
pnpm db:seed
# O para solo usuarios demo:
npx tsx scripts/seed-demo-users.ts
```

---

## 🚀 2. Guía de Flujos Críticos

### **A. Registro de Cliente (Onboarding)**
1. Ir a `/register/customer`.
2. Completar **Paso 1** (Datos), **Paso 2** (Ubicación) y **Paso 3** (Preferencias).
3. Verificar redirección automática al dashboard.

### **B. Registro y Aprobación de Técnico**
1. Ir a `/register/technician`.
2. Llenar formulario y cargar **PDF de Cédula** (Requerido).
3. Intentar login → Debe mostrar "Esperando aprobación".
4. Login como **Admin** → Ir a `/admin/applications`.
5. Aprobar solicitud → Verificar llegada de email (simulado en logs).
6. Iniciar sesión con la nueva cuenta de técnico.

### **C. Flujo FSM (Orden de Servicio)**
1. **Cliente:** Crea solicitud desde `/customer/request`.
2. **Admin:** Verifica en `/admin/orders`, asigna al técnico demo.
3. **Técnico:** Ve la orden en `/technician/dashboard`, cambia estado a "En Proceso" y luego "Completado".
4. **Notificaciones:** Verificar que la campana (🔔) muestra los cambios para cada usuario.

---

## 🧪 3. Checklist de Validación (QA)

### **Autenticación**
- [ ] Redirección correcta por rol.
- [ ] Protección de rutas (intentar entrar a `/admin` siendo cliente).
- [ ] Persistencia de sesión (al recargar página).

### **Funcionalidad**
- [ ] Creación de órdenes sin errores.
- [ ] Cambio de estados de orden.
- [ ] Buscador global en panel admin.
- [ ] Chat AI asistiendo en la creación de solicitudes.

### **UI/UX**
- [ ] Diseño responsive en móviles (vista de 375px).
- [ ] Animaciones suaves entre transiciones.
- [ ] Toasts de éxito/error en cada acción importante.

---

## 🛠️ 4. Comandos de Utilidad para Testing
```bash
pnpm db:studio    # Ver base de datos en tiempo real
pnpm dev          # Iniciar servidor de desarrollo
# Limpiar cache de Next.js si hay comportamientos extraños
rm -rf .next
```

---
_Documentación consolidada a partir de `CUENTAS_PRUEBA.md`, `VALIDACION_CUENTAS_PRUEBA.md` y `GUIA_PRUEBAS_REGISTRO.md`._
