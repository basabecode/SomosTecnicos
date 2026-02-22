# Testing y Acceso — Guía de Pruebas

Esta guía describe los flujos de validación y procedimientos para testing manual del sistema SomosTécnicos.

---

## 1. Cuentas de prueba

Las credenciales de las cuentas demo **no se documentan aquí**. Se generan automáticamente ejecutando el script de semillas:

```bash
pnpm db:seed
```

Las contraseñas y correos de las cuentas demo se definen en variables de entorno (ver `.env.example`):
- `DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD`
- `DEMO_TECHNICIAN_EMAIL` / `DEMO_TECHNICIAN_PASSWORD`
- `DEMO_CUSTOMER_EMAIL` / `DEMO_CUSTOMER_PASSWORD`

> Las cuentas demo se crean **solo en entornos locales o de staging**, nunca en producción.

---

## 2. Paneles por rol

| Rol | Panel principal |
|-----|----------------|
| Admin / Super Admin | `/admin/dashboard` |
| Técnico | `/technician/dashboard` |
| Cliente | `/customer/dashboard` |

---

## 3. Flujos críticos a validar

### A. Registro de cliente (onboarding)
1. Ir a `/register/customer`.
2. Completar los pasos: datos personales → ubicación → preferencias.
3. Verificar redirección automática al dashboard tras completar.

### B. Registro y aprobación de técnico
1. Ir a `/register/technician`.
2. Llenar formulario y cargar PDF de cédula (requerido).
3. Intentar login → debe mostrar "Esperando aprobación".
4. Login como Admin → ir a `/admin/applications`.
5. Aprobar solicitud → verificar logs de email.
6. Iniciar sesión con la cuenta del técnico aprobado.

### C. Flujo de orden de servicio (FSM)
1. **Cliente:** Crear solicitud desde `/customer/request`.
2. **Admin:** Verificar en `/admin/orders`, asignar técnico.
3. **Técnico:** Ver la orden en su dashboard, cambiar estado a "En Proceso" y luego "Completado".
4. **Notificaciones:** Verificar que la campanita muestra los cambios para cada rol.

### D. Sistema de mensajería interna
1. Admin envía mensaje a cliente desde `/admin/messages`.
2. Cliente ve el mensaje en `/customer/messages` y responde.
3. Verificar que borrar una conversación en un panel **no afecta** la vista del otro usuario.
4. Verificar que el contador de la campanita se limpia al abrir el dropdown.

---

## 4. Checklist de validación (QA)

### Autenticación
- [ ] Redirección correcta según rol al iniciar sesión.
- [ ] Protección de rutas (intentar acceder a `/admin` siendo cliente debe rechazar).
- [ ] Persistencia de sesión al recargar la página.

### Funcionalidad
- [ ] Creación de órdenes sin errores.
- [ ] Cambio de estados de orden con historial registrado.
- [ ] Buscador global en panel admin.
- [ ] Chat AI asistiendo en la creación de solicitudes.
- [ ] Mensajería interna: envío, recepción, borrado independiente por usuario.
- [ ] Notificaciones en tiempo real via SSE.

### UI/UX
- [ ] Diseño responsive en móviles (375px).
- [ ] Animaciones suaves entre transiciones.
- [ ] Toasts de éxito/error en cada acción importante.

---

## 5. Comandos útiles

```bash
pnpm db:seed      # Recrear datos de prueba
pnpm db:studio    # Explorador visual de base de datos
pnpm dev          # Servidor de desarrollo
rm -rf .next      # Limpiar caché de Next.js
```
