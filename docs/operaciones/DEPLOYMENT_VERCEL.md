# 🚀 Guía de Despliegue en Vercel

Este proyecto está preparado para ser desplegado en [Vercel](https://vercel.com) de manera rápida y segura.

## 1. Requisitos Previos

### Base de Datos en la Nube
Vercel es una plataforma "Serverless", por lo que **NO** puedes usar tu base de datos local (`localhost`). Necesitas una base de datos PostgreSQL alojada en la nube.
Recomendamos:
*   [Neon Database](https://neon.tech) ← **recomendado** (ya configurado en este proyecto)
*   [Supabase](https://supabase.com)
*   [Railway](https://railway.app)

Obtén la **URL de conexión** (Connection String) de tu proveedor. Tiene la forma:
`postgres://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<PORT>/<DB_NAME>`

---

## 2. Variables de Entorno en Vercel

En la sección **"Environment Variables"** de tu proyecto en Vercel, agrega estas variables:

### 🔴 Críticas (sin estas la app no arranca)

| Variable | Descripción | Dónde obtenerla |
| :--- | :--- | :--- |
| `DATABASE_URL` | Conexión pooled a Neon (para queries normales) | Neon Dashboard → Connection string → Pooled |
| `DIRECT_URL` | Conexión directa a Neon (para migraciones) | Neon Dashboard → Connection string → Direct |
| `JWT_SECRET` | Clave para firmar tokens JWT | `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Clave para sesiones | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL pública del deploy | `https://tu-proyecto.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | URL pública (igual a NEXTAUTH_URL) | `https://tu-proyecto.vercel.app` |

### 📧 Email (para envío de notificaciones)

| Variable | Descripción | Dónde obtenerla |
| :--- | :--- | :--- |
| `BREVO_API_KEY` | API Key de Brevo para envío de emails | [app.brevo.com](https://app.brevo.com) → Settings → API Keys |
| `BREVO_SENDER_EMAIL` | Email remitente verificado en Brevo | El email que verificaste en Brevo |
| `BREVO_SENDER_NAME` | Nombre del remitente | Ej: `SomosTécnicos` |

### 📬 Upstash QStash — Cola de trabajos durable ⚠️ PENDIENTE DE ACTIVAR

> **¿Por qué es necesario?**
> En Vercel (serverless), la cola en memoria (`lib/queue.ts`) se pierde cuando la función termina.
> QStash garantiza que los emails de asignación, cotización y cierre lleguen siempre,
> aunque la función serverless termine antes de procesarlos.
>
> **Sin estas variables:** el sistema usa la cola en memoria (funciona en desarrollo,
> puede perder jobs en producción bajo carga).

**Pasos para obtener las claves:**

1. Ir a [console.upstash.com](https://console.upstash.com)
2. Crear cuenta o iniciar sesión
3. Ir a **QStash** → **Dashboard**
4. Copiar las claves de la sección **"Credentials"**

| Variable | Descripción | Dónde está en Upstash |
| :--- | :--- | :--- |
| `QSTASH_TOKEN` | Token de autenticación para publicar jobs | QStash → Credentials → `QSTASH_TOKEN` |
| `QSTASH_CURRENT_SIGNING_KEY` | Verifica que los webhooks vienen de Upstash | QStash → Credentials → `QSTASH_CURRENT_SIGNING_KEY` |
| `QSTASH_NEXT_SIGNING_KEY` | Clave de rotación para webhooks | QStash → Credentials → `QSTASH_NEXT_SIGNING_KEY` |

**URL del webhook a configurar en QStash** (si se usa modo "scheduled"):
```
https://tu-proyecto.vercel.app/api/queue/process
```

> El endpoint `POST /api/queue/process` verifica la firma de Upstash antes de procesar.
> En desarrollo (sin `QSTASH_TOKEN`), el sistema funciona con la cola en memoria.

---

## 3. Consideraciones Importantes

- **Prisma Client**: El comando de build (`package.json`) ya ejecuta `prisma generate` automáticamente.
- **Compatibilidad Linux**: `schema.prisma` incluye los binarios de Linux necesarios para Vercel (`rhel-openssl-3.0.x`).
- **SSE (Notificaciones en tiempo real)**:
  - Runtime: `nodejs` con `maxDuration = 300`
  - Plan Hobby (gratis): la conexión SSE dura 60s, luego el cliente reconecta automáticamente
  - Plan Pro ($20/mes): la conexión dura 5 minutos — menos reconexiones
  - En ambos casos las notificaciones nunca se pierden (se persisten en BD)

---

## 4. Primer Despliegue

1. Sube el proyecto a GitHub/GitLab
2. En Vercel: **Add New Project** → importar repositorio
3. Agregar todas las variables de entorno (sección 2)
4. Click **Deploy**

Vercel ejecutará automáticamente:
```
prisma generate → next build → deploy
```

### Cambios en el esquema de BD

Después de modificar `prisma/schema.prisma`, ejecutar desde tu PC local apuntando a producción:

```bash
pnpm db:migrate:deploy
```

---

## 5. Checklist pre-deploy

- [ ] `DATABASE_URL` y `DIRECT_URL` configuradas (Neon pooled + direct)
- [ ] `JWT_SECRET` y `NEXTAUTH_SECRET` generadas con `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL` apuntan al dominio de Vercel
- [ ] `BREVO_API_KEY` configurada y email verificado
- [ ] `QSTASH_TOKEN` + signing keys configuradas ← **pendiente** (ver sección 2)
- [ ] Build local limpio: `pnpm build` sin errores
- [ ] Migraciones aplicadas en BD de producción: `pnpm db:migrate:deploy`
