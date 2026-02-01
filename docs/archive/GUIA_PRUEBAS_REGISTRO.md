<!-- NOTA: Este archivo es obsoleto. El proyecto se llamaba anteriormente "TecnoCity", ahora es "SomosTécnicos". -->
# 🧪 Guía de Pruebas - Flujos de Registro Avanzados

## 📋 Checklist de Pruebas

### ✅ Prueba 1: Registro de Cliente (Onboarding Multietapa)

#### Paso a Paso:
1. **Acceder a la página de registro:**
   ```
   http://localhost:3000/register/customer
   ```

2. **Paso 1 - Datos Básicos:**
   - ✅ Ingresar nombre: "Juan"
   - ✅ Ingresar apellido: "Pérez"
   - ✅ Ingresar email: "juan.perez@test.com"
   - ✅ Ingresar teléfono: "3001234567"
   - ✅ Ingresar contraseña: "Test123!"
   - ✅ Confirmar contraseña: "Test123!"
   - ✅ Hacer clic en "Siguiente"
   - ✅ Verificar que la validación funcione (probar con datos inválidos)

3. **Paso 2 - Ubicación:**
   - ✅ Ingresar dirección: "Calle 123 #45-67"
   - ✅ Seleccionar ciudad: "Bogotá"
   - ✅ Ingresar barrio (opcional): "Chapinero"
   - ✅ Hacer clic en "Siguiente"
   - ✅ Verificar que el botón "Anterior" funcione

4. **Paso 3 - Preferencias:**
   - ✅ Seleccionar electrodomésticos:
     - Nevera ✓
     - Lavadora ✓
     - Microondas ✓
   - ✅ Hacer clic en "Completar Registro"
   - ✅ Verificar loading state
   - ✅ Verificar auto-login
   - ✅ Verificar redirección a `/customer/dashboard`

5. **Verificación en Base de Datos:**
   ```sql
   SELECT * FROM customers WHERE email = 'juan.perez@test.com';
   -- Verificar que isOnboarded = true
   -- Verificar que preferencias contenga los electrodomésticos
   ```

#### Resultados Esperados:
- ✅ Animaciones suaves entre pasos
- ✅ Validación en tiempo real
- ✅ Indicadores de progreso actualizados
- ✅ Auto-login exitoso
- ✅ Redirección correcta
- ✅ Datos guardados correctamente en DB

---

### ✅ Prueba 2: Registro de Técnico (Con Aprobación)

#### Paso a Paso:
1. **Acceder a la página de registro:**
   ```
   http://localhost:3000/register/technician
   ```

2. **Completar Formulario:**
   - ✅ Nombre: "Carlos"
   - ✅ Apellido: "Rodríguez"
   - ✅ Cédula: "1234567890"
   - ✅ Email: "carlos.rodriguez@test.com"
   - ✅ Teléfono: "3009876543"
   - ✅ Dirección: "Carrera 45 #67-89"
   - ✅ Ciudad: "Medellín"
   - ✅ Especialidades: Nevera, Lavadora, Aire Acondicionado
   - ✅ Zona preferida: "Norte"
   - ✅ Años de experiencia: "5"
   - ✅ Enviar solicitud

3. **Verificar Email de Confirmación:**
   - ✅ Revisar que se envió email a carlos.rodriguez@test.com
   - ✅ Verificar contenido del email

4. **Intentar Login (Debe Fallar):**
   ```
   http://localhost:3000/login
   ```
   - ✅ Email: "carlos.rodriguez@test.com"
   - ✅ Password: cualquiera
   - ✅ Verificar mensaje: "Tu solicitud está siendo revisada"
   - ✅ Verificar que NO se permite el acceso

5. **Verificación en Base de Datos:**
   ```sql
   SELECT * FROM technician_applications
   WHERE email = 'carlos.rodriguez@test.com';
   -- Verificar que estado = 'pendiente'
   ```

#### Resultados Esperados:
- ✅ Solicitud creada con estado PENDING
- ✅ Email de confirmación enviado
- ✅ Login bloqueado con mensaje claro
- ✅ No se crea usuario en admin_users ni technicians

---

### ✅ Prueba 3: Aprobación de Técnico (Panel Admin)

#### Paso a Paso:
1. **Login como Admin:**
   ```
   http://localhost:3000/login
   Email: admin.demo@somostecnicos.com
   Password: Demo2026!Secure
   ```

2. **Acceder a Solicitudes:**
   ```
   http://localhost:3000/admin/applications
   ```

3. **Revisar Solicitud:**
   - ✅ Verificar que aparece "Carlos Rodríguez"
   - ✅ Verificar estado "PENDIENTE"
   - ✅ Ver detalles de la solicitud

4. **Aprobar Solicitud:**
   - ✅ Hacer clic en "Aprobar"
   - ✅ Verificar confirmación
   - ✅ Verificar que el estado cambia a "APROBADO"

5. **Verificar Email de Aprobación:**
   - ✅ Revisar que se envió email con credenciales
   - ✅ Verificar que incluye:
     - Username
     - Contraseña temporal
     - Link de acceso
     - Instrucciones

6. **Verificación en Base de Datos:**
   ```sql
   -- Verificar que se creó usuario
   SELECT * FROM admin_users WHERE email = 'carlos.rodriguez@test.com';
   -- role debe ser 'technician'

   -- Verificar que se creó técnico
   SELECT * FROM technicians WHERE email = 'carlos.rodriguez@test.com';

   -- Verificar que la solicitud fue actualizada
   SELECT * FROM technician_applications
   WHERE email = 'carlos.rodriguez@test.com';
   -- estado debe ser 'aprobado'
   ```

#### Resultados Esperados:
- ✅ Usuario creado en admin_users con rol technician
- ✅ Técnico creado en technicians
- ✅ Solicitud actualizada a estado aprobado
- ✅ Email enviado con credenciales
- ✅ Contraseña temporal generada

---

### ✅ Prueba 4: Login de Técnico Aprobado

#### Paso a Paso:
1. **Obtener Credenciales:**
   - ✅ Revisar el email de aprobación
   - ✅ Copiar username y contraseña temporal

2. **Login:**
   ```
   http://localhost:3000/login
   ```
   - ✅ Email: "carlos.rodriguez@test.com"
   - ✅ Password: [contraseña temporal del email]
   - ✅ Hacer clic en "Iniciar Sesión"

3. **Verificar Acceso:**
   - ✅ Verificar que el login es exitoso
   - ✅ Verificar redirección a `/technician/dashboard`
   - ✅ Verificar que puede acceder a sus funciones

#### Resultados Esperados:
- ✅ Login exitoso
- ✅ Acceso al dashboard de técnico
- ✅ Todas las funcionalidades disponibles

---

### ✅ Prueba 5: Rechazo de Técnico

#### Paso a Paso:
1. **Crear Nueva Solicitud:**
   - ✅ Registrar otro técnico: "maria.garcia@test.com"

2. **Login como Admin y Rechazar:**
   ```
   http://localhost:3000/admin/applications
   ```
   - ✅ Seleccionar solicitud de María García
   - ✅ Hacer clic en "Rechazar"
   - ✅ Ingresar motivo: "No cumple con los requisitos de experiencia"
   - ✅ Confirmar rechazo

3. **Intentar Login (Debe Fallar):**
   ```
   http://localhost:3000/login
   ```
   - ✅ Email: "maria.garcia@test.com"
   - ✅ Password: cualquiera
   - ✅ Verificar mensaje: "Tu solicitud fue rechazada"

4. **Verificar Email:**
   - ✅ Revisar que se envió email de rechazo
   - ✅ Verificar que incluye el motivo

#### Resultados Esperados:
- ✅ Solicitud actualizada a estado rechazado
- ✅ Email de rechazo enviado
- ✅ Login bloqueado con mensaje específico
- ✅ NO se crean registros en admin_users ni technicians

---

## 🎨 Pruebas de UI/UX

### Animaciones:
- ✅ Transiciones suaves entre pasos (Framer Motion)
- ✅ Loading states con spinners
- ✅ Indicadores de progreso animados
- ✅ Hover effects en botones y cards

### Responsividad:
- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

### Accesibilidad:
- ✅ Labels asociados a inputs
- ✅ Mensajes de error claros
- ✅ Contraste de colores adecuado
- ✅ Navegación con teclado

---

## 🐛 Casos de Error a Probar

### Registro de Cliente:
- ✅ Email ya registrado
- ✅ Teléfono inválido
- ✅ Contraseñas no coinciden
- ✅ Campos vacíos
- ✅ Email con formato inválido

### Registro de Técnico:
- ✅ Cédula duplicada
- ✅ Email duplicado
- ✅ Teléfono inválido
- ✅ Sin especialidades seleccionadas

### Login:
- ✅ Credenciales incorrectas
- ✅ Usuario inactivo
- ✅ Técnico pendiente
- ✅ Técnico rechazado

---

## 📊 Métricas de Éxito

### Performance:
- ✅ Tiempo de carga < 2 segundos
- ✅ Animaciones a 60fps
- ✅ Sin errores en consola

### Funcionalidad:
- ✅ 100% de los flujos funcionan correctamente
- ✅ Validaciones funcionan en todos los casos
- ✅ Emails se envían correctamente
- ✅ Estados de DB se actualizan correctamente

### UX:
- ✅ Mensajes de error claros y útiles
- ✅ Feedback visual en todas las acciones
- ✅ Navegación intuitiva
- ✅ Diseño profesional y atractivo

---

## 🔧 Comandos Útiles para Testing

### Verificar Base de Datos:
```bash
# Abrir Prisma Studio
pnpm db:studio

# Ver logs de la aplicación
# (en la terminal donde corre pnpm run dev)
```

### Limpiar Datos de Prueba:
```sql
-- Eliminar cliente de prueba
DELETE FROM customers WHERE email = 'juan.perez@test.com';

-- Eliminar solicitud de técnico
DELETE FROM technician_applications WHERE email = 'carlos.rodriguez@test.com';

-- Eliminar técnico aprobado
DELETE FROM technicians WHERE email = 'carlos.rodriguez@test.com';
DELETE FROM admin_users WHERE email = 'carlos.rodriguez@test.com';
```

---

## ✅ Checklist Final

- [ ] Todos los flujos de registro funcionan
- [ ] Validaciones funcionan correctamente
- [ ] Emails se envían correctamente
- [ ] Bloqueo de técnicos pendientes funciona
- [ ] Panel de admin funciona correctamente
- [ ] Animaciones son suaves
- [ ] Diseño es responsive
- [ ] No hay errores en consola
- [ ] Base de datos se actualiza correctamente
- [ ] Documentación está completa

---

## 📝 Notas de Testing

### Fecha: _________
### Tester: _________

#### Bugs Encontrados:
1.
2.
3.

#### Mejoras Sugeridas:
1.
2.
3.

#### Estado General:
- [ ] ✅ Aprobado
- [ ] ⚠️ Aprobado con observaciones
- [ ] ❌ Requiere correcciones
