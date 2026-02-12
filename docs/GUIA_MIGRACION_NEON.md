# 🚀 Guía de Migración a Neon (PostgreSQL en la Nube)

Esta guía detalla paso a paso cómo migrar tu base de datos local (Docker) a Neon.tech y configurar tu proyecto para usarla.

## 1. Preparación de la Base de Datos Local

Primero, debemos exportar los datos de tu contenedor Docker local en un formato compatible con Neon.

### Paso 1.1: Generar Backup
Hemos creado un script automático para esto. Ejecuta en tu terminal:

```powershell
.\scripts\backup_local_db.ps1
```

Esto generará un archivo `neon_migration.sql` en la raíz de tu proyecto.
Este archivo contiene la estructura y los datos, pero **sin** información de roles/dueños, lo cual es vital para Neon.

## 2. Configuración en Neon.tech

1. Ve a [Neon Console](https://console.neon.tech).
2. Crea un nuevo proyecto.
3. En el Dashboard de tu proyecto, busca la sección **Connection Details**.
4. Necesitarás dos cadenas de conexión (Connection Strings):
   - **Pooled Connection**: Usada para la aplicación (alto rendimiento). Tiene un host tipo `ep-xyz-pooler`.
   - **Direct Connection**: Usada para migraciones. Tiene un host tipo `ep-xyz`.

## 3. Importar Datos a Neon

Para importar el archivo SQL generado, necesitarás tener instalado `psql` (cliente de PostgreSQL) o usar una herramienta gráfica compatible.

### Opción A (¡Nueva y Fácil!): Usando nuestro script automático

Hemos creado un script que **no requiere instalar nada** en tu Windows. Usa Docker automáticamente.

1. Ejecuta el siguiente comando en tu terminal:
   ```powershell
   .\scripts\import_to_neon.ps1
   ```
2. Cuando te lo pida, pega tu **Connection String (Direct)** de Neon.
   (Es la que empieza con `postgres://...` y termina en `...sslmode=require`)

¡Y listo! El script se encargará de todo.

### Opción B: Usando herramientas gráficas (pgAdmin/DBeaver)
Si prefieres una interfaz visual:
1. Conéctate a tu base de datos Neon usando los credenciales.
2. Abre una herramienta de consulta (Query Tool).
3. Pega el contenido de `neon_migration.sql`.
4. Ejecuta todo el script.

> **Nota:** Si usas el Import Data Assistant de Neon, copia la cadena de conexión de tu Docker local (difícil si no está expuesta a internet), por lo que el método manual (Opción A/B) es mejor para desarrollo local.

## 4. Actualizar Configuración del Proyecto

Ahora debemos decirle a la aplicación que use Neon en lugar de Docker local.

### Paso 4.1: Actualizar Variables de Entorno (.env)

Abre o crea tu archivo `.env.local` (o `.env` para producción) y actualiza/agrega estas variables.
**Recuerda reemplazar con tus valores reales de Neon.**

```ini
# .env

# URL con Pooling (para la APP)
# Normalmente puerto 5432. Verifica si dice pgbouncer o pooler en el host.
DATABASE_URL="postgres://usuario:password@ep-pooler-xyz.neon.tech/neondb?sslmode=require"

# URL Directa (para MIGRACIONES y PRISMA STUDIO)
# Es la misma pero sin el pooler (o puerto 5432 directo a la instancia)
DIRECT_URL="postgres://usuario:password@ep-direct-xyz.neon.tech/neondb?sslmode=require"
```

### Paso 4.2: Actualizar Schema Prisma
(Este paso ya fue realizado automáticamente por el asistente)
Verifica que `prisma/schema.prisma` tenga esto:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 5. Verificación

1. Genera el cliente de Prisma con la nueva configuración:
   ```bash
   npx prisma generate
   ```

2. Ejecuta la aplicación:
   ```bash
   npm run dev
   ```

3. Verifica que puedas iniciar sesión o ver datos. Si todo carga, ¡estás conectado a la nube!

## Solución de Problemas Comunes

- **Error de conexión SSL**: Asegúrate de que `?sslmode=require` esté al final de tus URLs de conexión.
- **Error de "Too many clients"**: Asegúrate de usar la URL `DATABASE_URL` (con pooling) para la aplicación, pero la `DIRECT_URL` para comandos como `prisma migrate` o `prisma push`.
- **Timeouts en Vercel**: Neon "duerme" las bases de datos inactivas en el plan gratuito. La primera petición puede tardar unos segundos en despertar la BD.
