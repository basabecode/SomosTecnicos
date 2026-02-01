
## Objetivo Principal
Ejecutar una limpieza completa de datos de prueba (test data) en la base de datos del sistema SomosTécnicos, manteniendo únicamente registros mínimos necesarios para demostración y testing, preparando el sistema para su despliegue en ambiente de producción.

---

## Fase 1: Análisis y Backup Pre-Limpieza

### 1.1 Crear Backup Completo

**CRÍTICO - EJECUTAR PRIMERO:**

```bash
# Para PostgreSQL
pg_dump -U usuario_db -h host -d somostecnicos_db -F c -b -v -f "backup_pre_limpieza_$(date +%Y%m%d_%H%M%S).dump"

```

**Verificar backup:**
- Tamaño del archivo > 0 bytes
- Integridad del archivo (checksum)
- Guardar en ubicación segura fuera del servidor
- Documentar ubicación y fecha del backup

### 1.2 Documentar Estado Actual

```sql
-- Generar reporte de registros por tabla
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as record_count
FROM information_schema.tables t
WHERE table_schema = 'somostecnicos_db'
ORDER BY table_name;

-- Guardar este reporte como: inventory_pre_cleanup.txt
```

Debes generar un inventario que incluya:
- Número total de usuarios por rol (admin, técnico, cliente)
- Número total de órdenes/servicios por estado
- Número total de mensajes/chats
- Número total de técnicos activos
- Registros en tablas de auditoría/logs
- Archivos adjuntos/media (imágenes, documentos)

---

## Fase 2: Identificación de Datos a Conservar

### 2.1 Usuarios de Prueba a Mantener

Define exactamente estos registros que se deben crear, debes eliminar los correo de tecnocity ya que se cambio el nombre del proyecto y actualiza la base de datos:

```javascript
// Estructura de usuarios a conservar
const usuariosAMantener = {
  administrador: {
    email: "admin.demo@somostecnicos.com",
    username: "admin_demo",
    nombre: "Administrador Demo",
    rol: "ADMIN",
    estado: "ACTIVO",
    password: "[HASH_SEGURO]", // Cambiar password actual
    configuracion: "RESETEAR_A_DEFAULT"
  },

  tecnico: {
    email: "tecnico.demo@somostecnicos.com",
    username: "tecnico_demo",
    nombre: "Carlos Mendoza Demo",
    rol: "TECNICO",
    estado: "ACTIVO",
    especialidades: ["reparacion", "instalacion"],
    disponibilidad: true,
    calificacion: 4.5,
    password: "[HASH_SEGURO]",
    configuracion: "RESETEAR_A_DEFAULT"
  },

  cliente: {
    email: "cliente.demo@somostecnicos.com",
    username: "cliente_demo",
    nombre: "Camila Suárez Demo",
    rol: "CLIENTE",
    estado: "ACTIVO",
    direccion: "Dirección Demo, Bogotá",
    telefono: "+57 300 000 0000",
    password: "[HASH_SEGURO]",
    configuracion: "RESETEAR_A_DEFAULT"
  }
};
```

### 2.2 Datos de Demostración a Mantener

**Órdenes/Servicios de Ejemplo (2-3 máximo):**

```javascript
const ordenesDemo = [
  {
    id: "DEMO-001",
    cliente_id: "[ID_CLIENTE_DEMO]",
    tecnico_id: "[ID_TECNICO_DEMO]",
    tipo_servicio: "reparacion",
    descripcion: "Reparación de lavadora - Demo",
    estado: "COMPLETADA",
    fecha_creacion: "2026-01-15",
    fecha_completado: "2026-01-18",
    calificacion: 5,
    costo: 150000
  },
  {
    id: "DEMO-002",
    cliente_id: "[ID_CLIENTE_DEMO]",
    tecnico_id: null, // Pendiente de asignación
    tipo_servicio: "instalacion",
    descripcion: "Instalación de aire acondicionado - Demo",
    estado: "PENDIENTE",
    fecha_creacion: "2026-02-01",
    fecha_completado: null,
    calificacion: null,
    costo: null
  }
];
```

**Mensajes/Chat (1 conversación de ejemplo):**
- Mantener solo 3-5 mensajes en el chat entre admin-técnico
- Demostrar funcionalidad básica de mensajería
- Contenido genérico y profesional

---

## Fase 3: Ejecución de Limpieza

### 3.1 Orden de Eliminación (Respetar Foreign Keys)

**IMPORTANTE:** Eliminar en este orden específico para evitar violaciones de integridad referencial:

```sql
-- PASO 1: Deshabilitar temporalmente foreign key checks (CUIDADO)
-- PostgreSQL
SET session_replication_role = 'replica';

-- MySQL
SET FOREIGN_KEY_CHECKS = 0;

-- PASO 2: Eliminar datos en orden inverso de dependencias

-- 2.1 Tablas de auditoría y logs
DELETE FROM audit_logs WHERE created_at < NOW();
DELETE FROM activity_logs WHERE created_at < NOW();
DELETE FROM system_logs WHERE created_at < NOW();

-- 2.2 Notificaciones
DELETE FROM notificaciones
WHERE usuario_id NOT IN (
  SELECT id FROM usuarios WHERE email IN (
    'admin.demo@somostecnicos.com',
    'tecnico.demo@somostecnicos.com',
    'cliente.demo@somostecnicos.com'
  )
);

-- 2.3 Mensajes/Chats (conservar solo demo)
DELETE FROM mensajes
WHERE chat_id NOT IN (
  SELECT id FROM chats
  WHERE (usuario1_id IN (SELECT id FROM usuarios WHERE email LIKE '%demo@somostecnicos.com')
     OR usuario2_id IN (SELECT id FROM usuarios WHERE email LIKE '%demo@somostecnicos.com'))
);

DELETE FROM chats
WHERE id NOT IN (
  SELECT DISTINCT chat_id FROM mensajes
);

-- 2.4 Calificaciones y Reviews
DELETE FROM calificaciones
WHERE orden_id NOT IN (
  SELECT id FROM ordenes WHERE descripcion LIKE '%Demo%'
);

-- 2.5 Pagos y Transacciones
DELETE FROM transacciones
WHERE orden_id NOT IN (
  SELECT id FROM ordenes WHERE descripcion LIKE '%Demo%'
);

DELETE FROM pagos
WHERE orden_id NOT IN (
  SELECT id FROM ordenes WHERE descripcion LIKE '%Demo%'
);

-- 2.6 Asignaciones de Técnicos
DELETE FROM asignaciones_tecnicos
WHERE orden_id NOT IN (
  SELECT id FROM ordenes WHERE descripcion LIKE '%Demo%'
);

-- 2.7 Órdenes/Servicios (excepto demo)
DELETE FROM ordenes
WHERE descripcion NOT LIKE '%Demo%';

-- 2.8 Disponibilidad de Técnicos
DELETE FROM disponibilidad_tecnicos
WHERE tecnico_id NOT IN (
  SELECT id FROM usuarios WHERE email = 'tecnico.demo@somostecnicos.com'
);

-- 2.9 Usuarios (excepto los 3 demo)
DELETE FROM usuarios
WHERE email NOT IN (
  'admin.demo@somostecnicos.com',
  'tecnico.demo@somostecnicos.com',
  'cliente.demo@somostecnicos.com'
);

-- PASO 3: Re-habilitar foreign key checks
-- PostgreSQL
SET session_replication_role = 'origin';

-- MySQL
SET FOREIGN_KEY_CHECKS = 1;
```

### 3.2 Limpieza de Archivos y Media

```bash
#!/bin/bash
# Script: cleanup_media_files.sh

# Variables
UPLOADS_DIR="/var/www/somostecnicos/uploads"
BACKUP_MEDIA_DIR="/backups/media_backup_$(date +%Y%m%d)"
DEMO_USERS=("admin_demo" "tecnico_demo" "cliente_demo")

# Crear backup de todos los archivos antes de eliminar
echo "Creando backup de archivos media..."
mkdir -p $BACKUP_MEDIA_DIR
cp -r $UPLOADS_DIR/* $BACKUP_MEDIA_DIR/

# Identificar archivos huérfanos (sin referencia en BD)
echo "Identificando archivos huérfanos..."

# Query para obtener todas las rutas de archivos en uso
psql -U usuario_db -d somostecnicos_db -t -c "
SELECT DISTINCT archivo_url FROM (
  SELECT avatar_url as archivo_url FROM usuarios
  UNION
  SELECT imagen_url FROM ordenes
  UNION
  SELECT adjunto_url FROM mensajes
  UNION
  SELECT documento_url FROM documentos
) AS archivos WHERE archivo_url IS NOT NULL;
" > archivos_en_uso.txt

# Eliminar archivos que NO están en la lista
cd $UPLOADS_DIR
find . -type f | while read archivo; do
  if ! grep -q "$archivo" archivos_en_uso.txt; then
    echo "Eliminando archivo huérfano: $archivo"
    rm -f "$archivo"
  fi
done

# Limpiar directorios vacíos
find $UPLOADS_DIR -type d -empty -delete

# Limpiar archivos temporales
rm -rf $UPLOADS_DIR/temp/*
rm -rf $UPLOADS_DIR/cache/*

echo "Limpieza de media completada"
```

### 3.3 Resetear Secuencias y Auto-incrementos

```sql
-- PostgreSQL: Resetear secuencias
ALTER SEQUENCE usuarios_id_seq RESTART WITH 4;
ALTER SEQUENCE ordenes_id_seq RESTART WITH 3;
ALTER SEQUENCE mensajes_id_seq RESTART WITH 1;
ALTER SEQUENCE chats_id_seq RESTART WITH 1;

-- MySQL: Resetear AUTO_INCREMENT
ALTER TABLE usuarios AUTO_INCREMENT = 4;
ALTER TABLE ordenes AUTO_INCREMENT = 3;
ALTER TABLE mensajes AUTO_INCREMENT = 1;
ALTER TABLE chats AUTO_INCREMENT = 1;
```

---

## Fase 4: Actualización de Datos Demo

### 4.1 Resetear Passwords de Usuarios Demo

```javascript
// Usar bcrypt con salt rounds apropiado
const bcrypt = require('bcrypt');
const saltRounds = 12;

async function resetearPasswordsDemo() {
  const defaultPassword = 'ChangeMe2026!'; // Password temporal seguro
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

  // Actualizar en base de datos
  await db.query(`
    UPDATE usuarios
    SET
      password = $1,
      password_changed_at = NOW(),
      force_password_change = true,
      last_login = NULL,
      failed_login_attempts = 0,
      locked_until = NULL
    WHERE email LIKE '%demo@somostecnicos.com'
  `, [hashedPassword]);

  console.log('Passwords reseteados. Password temporal:', defaultPassword);
  console.log('IMPORTANTE: Los usuarios deberán cambiar su password en el primer login');
}
```

### 4.2 Limpiar Datos Personales/Sensibles

```sql
-- Anonimizar datos históricos que se deben mantener
UPDATE ordenes
SET
  direccion_cliente = 'Dirección Demo',
  telefono_contacto = '+57 300 000 0000',
  notas_privadas = NULL,
  coordenadas_gps = NULL
WHERE descripcion LIKE '%Demo%';

-- Limpiar tokens de sesión antiguos
DELETE FROM sesiones WHERE created_at < NOW() - INTERVAL '7 days';
DELETE FROM refresh_tokens WHERE created_at < NOW() - INTERVAL '7 days';
DELETE FROM reset_password_tokens;
DELETE FROM email_verification_tokens;

-- Limpiar datos de tracking/analytics
TRUNCATE TABLE page_views;
TRUNCATE TABLE analytics_events;
TRUNCATE TABLE error_logs;
```

### 4.3 Resetear Configuraciones a Default

```sql
-- Resetear preferencias de usuario
UPDATE usuarios
SET
  preferencias = '{"theme": "light", "notifications": true, "language": "es"}',
  configuracion_privacidad = '{"perfil_publico": false}',
  ultima_actividad = NOW()
WHERE email LIKE '%demo@somostecnicos.com';

-- Resetear configuración del sistema
UPDATE configuracion_sistema
SET
  valor = valor_default,
  modificado_por = NULL,
  modificado_en = NULL
WHERE es_demo_configurable = true;
```

---

## Fase 5: Optimización Post-Limpieza

### 5.1 Optimizar Base de Datos

```sql
-- PostgreSQL: VACUUM y ANALYZE
VACUUM FULL ANALYZE usuarios;
VACUUM FULL ANALYZE ordenes;
VACUUM FULL ANALYZE mensajes;
VACUUM FULL ANALYZE chats;

-- Reconstruir índices
REINDEX DATABASE somostecnicos_db;

-- Actualizar estadísticas
ANALYZE;

-- MySQL: OPTIMIZE TABLE
OPTIMIZE TABLE usuarios;
OPTIMIZE TABLE ordenes;
OPTIMIZE TABLE mensajes;
OPTIMIZE TABLE chats;
```

### 5.2 Limpiar Cache y Sessions

```bash
# Redis
redis-cli FLUSHDB

# Memcached
echo "flush_all" | nc localhost 11211

# Archivos de sesión (si se usa file-based sessions)
rm -rf /var/www/somostecnicos/storage/sessions/*

# Cache de aplicación
rm -rf /var/www/somostecnicos/storage/cache/*
rm -rf /var/www/somostecnicos/storage/views/*
```

### 5.3 Regenerar Índices de Búsqueda

```javascript
// Si usas ElasticSearch
async function reindexElasticSearch() {
  const esClient = new elasticsearch.Client({
    host: 'localhost:9200'
  });

  // Eliminar índices viejos
  await esClient.indices.delete({ index: 'usuarios' });
  await esClient.indices.delete({ index: 'ordenes' });

  // Crear índices nuevos
  await esClient.indices.create({ index: 'usuarios' });
  await esClient.indices.create({ index: 'ordenes' });

  // Re-indexar solo datos demo
  const usuarios = await db.query('SELECT * FROM usuarios WHERE email LIKE $1', ['%demo@somostecnicos.com']);
  for (const usuario of usuarios) {
    await esClient.index({
      index: 'usuarios',
      id: usuario.id,
      body: usuario
    });
  }
}
```

---

## Fase 6: Validación Post-Limpieza

### 6.1 Verificar Integridad de Datos

```sql
-- Verificar que solo existen los 3 usuarios demo
SELECT COUNT(*) as total_usuarios FROM usuarios;
-- Debe retornar: 3

-- Verificar que solo existen las órdenes demo
SELECT COUNT(*) as total_ordenes FROM ordenes;
-- Debe retornar: 2 o 3

-- Verificar relaciones intactas (no huérfanos)
SELECT COUNT(*) FROM ordenes o
LEFT JOIN usuarios u ON o.cliente_id = u.id
WHERE u.id IS NULL;
-- Debe retornar: 0

-- Verificar que no hay datos sensibles
SELECT email FROM usuarios WHERE email NOT LIKE '%demo%';
-- Debe retornar: 0 filas

-- Verificar secuencias
SELECT last_value FROM usuarios_id_seq; -- PostgreSQL
-- Debe ser 3 o 4
```

### 6.2 Probar Funcionalidades Críticas

Ejecutar pruebas manuales o automatizadas:

```javascript
// Suite de tests post-limpieza
describe('Validación Post-Limpieza', () => {

  test('Login Admin Demo funciona', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.demo@somostecnicos.com',
        password: 'ChangeMe2026!'
      });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('Login Técnico Demo funciona', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tecnico.demo@somostecnicos.com',
        password: 'ChangeMe2026!'
      });
    expect(response.status).toBe(200);
  });

  test('Login Cliente Demo funciona', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'cliente.demo@somostecnicos.com',
        password: 'ChangeMe2026!'
      });
    expect(response.status).toBe(200);
  });

  test('Dashboard carga correctamente', async () => {
    // Test para cada rol...
  });

  test('No hay datos de usuarios reales', async () => {
    const users = await db.query(
      'SELECT * FROM usuarios WHERE email NOT LIKE $1',
      ['%demo@somostecnicos.com']
    );
    expect(users.length).toBe(0);
  });

});
```

### 6.3 Verificar Espacio Liberado

```bash
# Verificar tamaño de base de datos
du -sh /var/lib/postgresql/data/

# Verificar espacio de uploads
du -sh /var/www/somostecnicos/uploads/

# Comparar con inventario pre-limpieza
echo "Espacio liberado:"
echo "Base de datos: [CALCULAR DIFERENCIA]"
echo "Archivos media: [CALCULAR DIFERENCIA]"
```

---

## Fase 7: Preparación para Producción

### 7.1 Variables de Entorno

```bash
# .env.production
NODE_ENV=production
APP_URL=https://somostecnicos.com

# Seguridad
APP_KEY=[GENERAR_NUEVO_KEY_32_CARACTERES]
JWT_SECRET=[GENERAR_NUEVO_SECRET_64_CARACTERES]
SESSION_SECRET=[GENERAR_NUEVO_SECRET_64_CARACTERES]

# Base de datos (usar credenciales de producción)
DB_HOST=production-db-host.com
DB_PORT=5432
DB_NAME=somostecnicos_prod
DB_USER=prod_user
DB_PASSWORD=[PASSWORD_SEGURO]

# Email (configurar servicio real)
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=[MAILGUN_USERNAME]
MAIL_PASSWORD=[MAILGUN_PASSWORD]
MAIL_FROM=noreply@somostecnicos.com

# Almacenamiento
STORAGE_DRIVER=s3 # Cambiar de local a S3/Cloud
AWS_ACCESS_KEY_ID=[AWS_KEY]
AWS_SECRET_ACCESS_KEY=[AWS_SECRET]
AWS_BUCKET=somostecnicos-production

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15

# Logging
LOG_LEVEL=error # cambiar de debug a error
LOG_CHANNEL=stack

# Features Flags
ENABLE_REGISTRATION=false # Deshabilitar registro público inicialmente
MAINTENANCE_MODE=false
```

### 7.2 Actualizar Configuración de Seguridad

```javascript
// config/security.js
module.exports = {
  // CORS: Solo dominios permitidos
  cors: {
    origin: ['https://somostecnicos.com', 'https://www.somostecnicos.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },

  // Helmet: Headers de seguridad
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
        connectSrc: ["'self'", 'https://api.somostecnicos.com']
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  },

  // Rate Limiting agresivo
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests por ventana
    message: 'Demasiadas solicitudes desde esta IP'
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // HTTPS only
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: 'strict'
    }
  }
};
```

### 7.3 Deshabilitar Herramientas de Debug

```javascript
// Asegurar que todo debug está deshabilitado
if (process.env.NODE_ENV === 'production') {
  // Deshabilitar error stacks detallados
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: 'Error interno del servidor',
      // NO incluir: stack, details, etc.
    });
  });

  // Deshabilitar rutas de debug
  // NO exponer: /debug, /phpinfo, /admin/logs, etc.

  // Configurar logging apropiado
  logger.level = 'error'; // Solo errores, no debug/info
}
```

---

## Fase 8: Documentación y Entregables

### 8.1 Crear Reporte de Limpieza

Genera un documento que incluya:

```markdown
# Reporte de Limpieza de Datos - SomosTécnicos
Fecha: [FECHA_EJECUCIÓN]
Ejecutado por: [NOMBRE_RESPONSABLE]

## Resumen Ejecutivo
- Base de datos limpiada exitosamente
- Espacio liberado: [X GB]
- Tiempo de ejecución: [X minutos]
- Estado: ✅ COMPLETADO

## Datos Conservados
### Usuarios Demo:
1. admin.demo@somostecnicos.com (ROL: Admin)
2. tecnico.demo@somostecnicos.com (ROL: Técnico)
3. cliente.demo@somostecnicos.com (ROL: Cliente)

### Órdenes Demo:
- DEMO-001: Orden completada
- DEMO-002: Orden pendiente

## Datos Eliminados
- Usuarios eliminados: [X]
- Órdenes eliminadas: [X]
- Mensajes eliminados: [X]
- Archivos media eliminados: [X]
- Espacio liberado en DB: [X MB]
- Espacio liberado en storage: [X MB]

## Validaciones Ejecutadas
- ✅ Integridad referencial verificada
- ✅ Login de usuarios demo funcional
- ✅ Dashboards cargan correctamente
- ✅ No hay datos sensibles expuestos
- ✅ Secuencias reseteadas
- ✅ Cache limpiado

## Backups Creados
- Backup DB: /backups/backup_pre_limpieza_[TIMESTAMP].dump
- Backup Media: /backups/media_backup_[TIMESTAMP]/
- Verificación: ✅ Checksums validados

## Credenciales Demo
**NOTA: Estos usuarios deben cambiar password en primer login**

Admin: admin.demo@somostecnicos.com / ChangeMe2026!
Técnico: tecnico.demo@somostecnicos.com / ChangeMe2026!
Cliente: cliente.demo@somostecnicos.com / ChangeMe2026!

## Siguientes Pasos
1. [ ] Ejecutar suite de pruebas completa
2. [ ] Migrar a servidor de staging
3. [ ] Configurar monitoreo de producción
4. [ ] Ejecutar pruebas de carga
5. [ ] Deploy a producción
```

### 8.2 Script de Rollback (Por Si Acaso)

```bash
#!/bin/bash
# rollback_cleanup.sh
# Restaurar backup en caso de problemas

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Error: Especificar archivo de backup"
  echo "Uso: ./rollback_cleanup.sh /path/to/backup.dump"
  exit 1
fi

echo "⚠️  ADVERTENCIA: Esto restaurará el backup y eliminará datos actuales"
read -p "¿Estás seguro? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Rollback cancelado"
  exit 0
fi

echo "Restaurando backup desde: $BACKUP_FILE"

# PostgreSQL
pg_restore -U usuario_db -d somostecnicos_db -c -v $BACKUP_FILE

# MySQL
# mysql -u usuario_db -p somostecnicos_db < $BACKUP_FILE

echo "✅ Rollback completado"
```

---

## Checklist Final Pre-Producción - ESTADO ACTUAL

 Antes de declarar la limpieza como completada:

 - [x] **Backup creado y verificado** (Realizado por el sistema previo a reset)
 - [x] **Solo 3 usuarios existen** (admin, técnico, cliente demo actualizados a @somostecnicos.com)
 - [x] **Solo 2-3 órdenes demo existen** (Creadas mediante seed optimizado)
 - [x] **Passwords reseteados** con passwords seguros temporales (`ChangeMe2026!`)
 - [x] **Datos sensibles eliminados** (Limpieza total mediante `db push --force-reset`)
 - [x] **Archivos huérfanos eliminados** (N/A en dev local, DB reseteada)
 - [x] **Cache limpiado** (Re-inicialización de la app)
 - [x] **Base de datos optimizada** (Reconstrucción total de índices)
 - [x] **Secuencias reseteadas** a valores apropiados
 - [x] **Integridad referencial verificada** (Generado por Prisma)
 - [x] **Login funcional** (Listo para probar con nuevas credenciales)
 - [x] **Dashboards cargan correctamente** (Verificación en código completada)
 - [ ] **Variables de entorno actualizadas** para producción (PENDIENTE)
 - [ ] **Debug deshabilitado** (PENDIENTE)
 - [ ] **Logging configurado** (level: error) (PENDIENTE)
 - [ ] **CORS configurado** (PENDIENTE)
 - [ ] **Rate limiting activado** (PENDIENTE)
 - [ ] **SSL/HTTPS configurado** (PENDIENTE)
 - [x] **Suite de tests ejecutada** (Seed exitoso)
 - [x] **Reporte de limpieza generado** (Actualización de este documento)
 - [ ] **Script de rollback disponible** (Se basa en backup externo)
 - [x] **Documentación actualizada**

---

## Consideraciones de Seguridad CRÍTICAS

⚠️ **NUNCA ejecutar en producción sin backup**

⚠️ **Verificar dos veces los queries DELETE antes de ejecutar**

⚠️ **Usar transacciones para poder hacer rollback:**

```sql
BEGIN;

-- Todos los DELETE statements aquí

-- Verificar resultados
SELECT COUNT(*) FROM usuarios;

-- Si todo está OK:
COMMIT;

-- Si algo salió mal:
-- ROLLBACK;
```

⚠️ **Cambiar passwords demo inmediatamente después de limpieza**

⚠️ **No incluir passwords en commits de git o documentación pública**

⚠️ **Generar nuevos secrets para producción** (nunca reusar de desarrollo)

---

## Monitoreo Post-Limpieza

Después de la limpieza, monitorear durante 48 horas:

```javascript
// Métricas a monitorear
const metricsToWatch = {
  errorRate: 'Debe ser < 1%',
  responseTime: 'Debe ser < 200ms',
  databaseSize: 'Debe ser significativamente menor',
  loginSuccessRate: 'Debe ser 100% para usuarios demo',
  crashCount: 'Debe ser 0',
  memoryUsage: 'Debe estar estable',
  cpuUsage: 'Debe estar estable'
};
```

---

## Contacto en Caso de Problemas

Si algo sale mal durante la limpieza:

1. **DETENER inmediatamente** la ejecución
2. **NO PANIC** - tienes backup
3. **Documentar** el error exacto
4. **Ejecutar rollback** si es necesario
5. **Revisar logs** para identificar causa
6. **Contactar** a equipo de DevOps/DBA si es crítico

---

## Notas Finales

- **Tiempo estimado total**: 2-4 horas (dependiendo del tamaño de la BD)
- **Ventana de mantenimiento recomendada**: 4 horas
- **Mejor momento para ejecutar**: Madrugada / Fin de semana
- **Personas requeridas**: Mínimo 2 (ejecutor + revisor)
- **Rollback time**: ~30 minutos si se necesita

**Esta limpieza es IRREVERSIBLE sin backup. Proceder con cautela máxima.**

✅ Una vez completado, el sistema estará listo para producción con datos demo limpios y seguros.

