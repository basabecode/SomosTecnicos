# 📱 SomosTécnicos — Guía Claude Code para conversión a PWA Mobile

> **Uso:** resume este archivo en `CLAUDE.md` en la raíz del repositorio.
> Claude Code lo cargará automáticamente en cada sesión y mantendrá el contexto del proyecto.

---

## 🎯 Objetivo del proyecto

Convertir la aplicación web **SomosTécnicos** (Next.js 15 + React 19 + TypeScript) en una **Progressive Web App (PWA)** instalable en iOS y Android, con los siguientes portales de acceso:

- **Portal Cliente** — Solicitar y hacer seguimiento de servicios técnicos
- **Portal Técnico** — Gestionar asignaciones y reportar visitas en campo
- **Portal Admin** — Control total del sistema (solo acceso web/desktop)

La app NO debe mostrar la landing page pública al abrirse, sino una nueva estructura de seleccion de servicio. Debe iniciar directamente en la pantalla de inicio con un diseño creativo de solicitud de servicio y login .

---

## 🧠 Contexto del stack tecnológico

```
Framework:     Next.js 15 (App Router)
UI:            React 19 + TypeScript 5
Estilos:       Tailwind CSS 4 + shadcn/ui
Base de datos: PostgreSQL (Neon serverless) + Prisma ORM
Auth:          Auth.js v5 (NextAuth) + Google OAuth 2.0 + JWT fallback
Cache:         Redis (Upstash en producción)
Realtime:      Server-Sent Events (SSE)
Deploy:        Vercel
Gestor paquetes: pnpm
```

---

## 📁 Estructura de archivos clave

```
SomosTecnicos/
├── CLAUDE.md                    ← este archivo
├── .claude/
│   ├── settings.json            ← hooks y permisos
│   ├── commands/                ← slash commands personalizados
│   │   ├── pwa-setup.md
│   │   ├── mobile-component.md
│   │   └── check-tokens.md
│   └── agents/
│       ├── pwa-architect.md
│       ├── mobile-ui.md
│       └── token-guardian.md
├── app/
│   ├── (public)/                ← landing web (NO debe cargar en PWA)
│   ├── (client)/customer/       ← portal cliente
│   ├── (technician)/technician/ ← portal técnico
│   ├── (admin)/admin/           ← portal admin
│   └── login/                   ← punto de entrada PWA
├── public/
│   ├── manifest.json            ← ⚠️ CREAR
│   └── icons/                   ← ⚠️ CREAR (ver tarea 3)
└── next.config.mjs              ← ⚠️ MODIFICAR para PWA
```

---

## 🗺️ Mapa de tareas — Ejecución en orden

Claude Code debe ejecutar estas tareas **en el orden indicado**. Antes de comenzar cualquier tarea, leer los archivos afectados. No saltar pasos.

---

### ✅ TAREA 1 — Instalar dependencia PWA

```bash
pnpm add next-pwa
pnpm add -D @types/next-pwa
```

**Verificar** que no haya conflictos con Next.js 15 antes de continuar.

---

### ✅ TAREA 2 — Modificar `next.config.mjs`

Envolver la configuración existente con `withPWA`. Preservar toda la configuración actual sin eliminar nada.

```js
// Agregar al inicio:
import withPWA from 'next-pwa'

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [], // ver Tarea 6
})

// Envolver el export existente:
export default pwaConfig({
  /* config existente */
})
```

---

### ✅ TAREA 3 — Crear `public/manifest.json`

```json
{
  "name": "SomosTécnicos",
  "short_name": "SomosTécnicos",
  "description": "Solicita y gestiona servicios técnicos a domicilio",
  "start_url": "/login",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0a0f1e",
  "theme_color": "#0ea5e9",
  "lang": "es",
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Portal Cliente",
      "url": "/login?portal=customer",
      "icons": [{ "src": "/icons/shortcut-client.png", "sizes": "96x96" }]
    },
    {
      "name": "Portal Técnico",
      "url": "/login?portal=technician",
      "icons": [{ "src": "/icons/shortcut-tech.png", "sizes": "96x96" }]
    }
  ]
}
```

---

### ✅ TAREA 4 — Crear pantalla de Login/Registro mobile-first

Crear `app/login/page.tsx` con los siguientes requisitos:

- Diseño oscuro (fondo `#0a0f1e`, acento `#0ea5e9`)
- Selector de portal visible: **Cliente** / **Técnico**
- Formulario de login con email + contraseña
- Botón "¿Eres nuevo? Crear cuenta gratis"
- Formulario de registro: nombre, email, contraseña, confirmación
- Validación en tiempo real con mensajes de error claros
- Al hacer login exitoso → redirigir según rol JWT:
  - `customer` → `/customer/dashboard`
  - `technician` → `/technician/dashboard`
  - `admin` o `super_admin` → `/admin/dashboard`

Usar **componentes shadcn/ui** existentes. No crear nuevas dependencias de UI.

---

### ✅ TAREA 5 — Adaptar navegación móvil (Bottom Navigation Bar)

Crear `components/navigation/MobileBottomNav.tsx`:

**Portal Cliente** — 4 ítems:

```
🏠 Inicio | 📋 Mis Órdenes | 💬 Mensajes | 👤 Perfil
```

**Portal Técnico** — 4 ítems:

```
📍 Asignaciones | 🔧 En Proceso | 💬 Mensajes | 👤 Perfil
```

Reglas:

- Solo visible en mobile (`md:hidden`)
- Usar `usePathname()` para marcar ítem activo
- Implementar con `position: fixed; bottom: 0`
- Agregar `pb-20` a los layouts de cliente y técnico para compensar altura del nav

---

### ✅ TAREA 6 — Configurar caché offline (Service Worker)

Agregar `runtimeCaching` en `next.config.mjs` para:

```js
;[
  {
    // API routes — network first, fallback cache
    urlPattern: /^\/api\//,
    handler: 'NetworkFirst',
    options: { cacheName: 'api-cache', networkTimeoutSeconds: 10 },
  },
  {
    // Imágenes — cache first
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'image-cache',
      expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  {
    // Google Fonts
    urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
    handler: 'StaleWhileRevalidate',
    options: { cacheName: 'google-fonts' },
  },
]
```

---

### ✅ TAREA 7 — Agregar meta tags PWA en el layout raíz

En `app/layout.tsx`, agregar dentro de `<head>`:

```html
<meta name="application-name" content="SomosTécnicos" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
<meta name="apple-mobile-web-app-title" content="SomosTécnicos" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#0ea5e9" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
```

---

### ✅ TAREA 8 — Middleware de protección de rutas

Verificar que `middleware.ts` existente:

1. Bloquea acceso a `/customer/*` si el rol JWT no es `customer`
2. Bloquea acceso a `/technician/*` si el rol JWT no es `technician`
3. Bloquea acceso a `/admin/*` si el rol no es `admin`, `super_admin` o `technician_manager`
4. Redirige a `/login` si no hay token válido
5. Redirige a `/login` si el token está expirado (no intenta refresh automático en middleware)

Si falta alguna regla, agregarla sin romper las existentes.

---

### ✅ TAREA 9 — Verificación final

```bash
pnpm build
pnpm start
```

Verificar en Chrome DevTools → Application → Service Workers que:

- El Service Worker esté registrado
- El manifest aparezca correctamente
- No haya errores en consola relacionados con PWA

Verificar en DevTools → Network:

- Las rutas de API responden correctamente
- El caché offline funciona al activar "Offline"

---

---

### ✅ TAREA 0 — Migrar autenticación a Auth.js v5 + Google OAuth en caso de que JWT no cumpla para la app.

> ⚠️ Esta tarea debe ejecutarse **antes que todas las demás**. Reemplaza el sistema JWT manual existente.

#### Prerequisito externo (el desarrollador debe hacer esto manualmente):

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear proyecto `somostecnicos` → APIs y servicios → Credenciales → OAuth 2.0
3. Tipo: **Aplicación web**
4. Agregar URIs autorizados:
   - Origen: `http://localhost:3000` y `https://somostecnicos.com`
   - Redirect: `http://localhost:3000/api/auth/callback/google`
   - Redirect: `https://somostecnicos.com/api/auth/callback/google`
5. Copiar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` al `.env`

#### Instalación:

```bash
pnpm add next-auth@beta @auth/prisma-adapter
```

#### Variables de entorno requeridas en `.env`:

```env
AUTH_SECRET=<generar con: openssl rand -base64 32>
AUTH_GOOGLE_ID=<tu GOOGLE_CLIENT_ID>
AUTH_GOOGLE_SECRET=<tu GOOGLE_CLIENT_SECRET>
AUTH_URL=https://somostecnicos.com
```

#### Crear `auth.config.ts` en la raíz:

```ts
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected =
        nextUrl.pathname.startsWith('/customer') ||
        nextUrl.pathname.startsWith('/technician') ||
        nextUrl.pathname.startsWith('/admin')
      if (isProtected && !isLoggedIn) return false
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role ?? 'customer'
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirigir según rol después del login con Google
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig
```

#### Crear `auth.ts` en la raíz:

```ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      // Usar redirect en lugar de popup (requerido para PWA en iOS Safari)
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'online',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Verificar que el email de Google esté verificado
        return !!(profile as any)?.email_verified
      }
      return true
    },
    async session({ session, token }) {
      // Buscar rol del usuario en la base de datos
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        })
        session.user.role = dbUser?.role ?? 'customer'
        session.user.id = token.sub
      }
      return session
    },
  },
})
```

#### Crear `app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

#### Actualizar `middleware.ts`:

```ts
import { auth } from './auth.config'
export default auth

export const config = {
  matcher: ['/customer/:path*', '/technician/:path*', '/admin/:path*'],
}
```

#### Lógica de redirección post-login por rol:

Crear `lib/auth-redirect.ts`:

```ts
export function getRedirectByRole(role: string): string {
  switch (role) {
    case 'customer':
      return '/customer/dashboard'
    case 'technician':
      return '/technician/dashboard'
    case 'admin':
    case 'super_admin':
    case 'technician_manager':
      return '/admin/dashboard'
    default:
      return '/login?error=role_not_assigned'
  }
}
```

#### Botón Google en `app/login/page.tsx`:

```tsx
'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [selectedPortal, setSelectedPortal] = useState<'customer' | 'technician' | null>(null)

  const handleGoogleLogin = async () => {
    if (!selectedPortal) {
      alert('Por favor selecciona tu tipo de acceso primero')
      return
    }
    // El portal seleccionado se guarda en sessionStorage
    // para usarlo después del callback de Google
    sessionStorage.setItem('selectedPortal', selectedPortal)
    await signIn('google', {
      callbackUrl: '/api/auth/role-redirect',
      redirect: true  // IMPORTANTE: usar redirect, no popup (compatibilidad iOS)
    })
  }

  return (
    // ... UI del login con selector de portal + botón Google
  )
}
```

#### Crear `app/api/auth/role-redirect/route.ts`:

```ts
import { auth } from '@/auth'
import { getRedirectByRole } from '@/lib/auth-redirect'
import { redirect } from 'next/navigation'

export async function GET() {
  const session = await auth()
  if (!session?.user?.role) redirect('/login?error=no_role')
  redirect(getRedirectByRole(session.user.role))
}
```

#### Actualizar schema Prisma para Auth.js:

Auth.js v5 con Prisma Adapter requiere estos modelos. Verificar que existan en `prisma/schema.prisma` y agregar si faltan:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

Después de actualizar el schema:

```bash
pnpm prisma db push
pnpm prisma generate
```

---

## 🔌 MCP Servers recomendados

> ⚠️ Agregar **solo los MCPs que vayas a usar activamente**. Cada MCP consume tokens de contexto. Desactiva los que no uses con `/mcp disable <nombre>`.

Crear `.mcp.json` en la raíz del proyecto:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" },
      "description": "Crear PRs, gestionar issues y ramas",
      "useWhen": "git operations, PR creation, branch management"
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "description": "Lectura y escritura de archivos del proyecto",
      "useWhen": "always - core file operations"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "description": "Testing visual de la PWA en viewport móvil",
      "useWhen": "visual testing, E2E mobile simulation"
    }
  }
}
```

**NO instalar** MCPs de Slack, Jira, bases de datos externas ni servicios no usados en este proyecto. Cada MCP innecesario agrega ~500-2000 tokens de overhead por sesión.

---

## 🎣 Hooks de automatización

Crear `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm tsc --noEmit 2>&1 | head -20",
            "description": "Verificar TypeScript después de cada edición"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm lint --quiet 2>&1 | head -10",
            "description": "Lint rápido post-escritura"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[Hook] Ejecutando: $(echo $CLAUDE_TOOL_INPUT | jq -r '.command // empty' 2>/dev/null)\" >&2"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "type": "command",
        "command": "echo '=== SomosTécnicos PWA Session ===' && git status --short && echo '=== Contexto cargado ==='",
        "description": "Mostrar estado del repo al iniciar sesión"
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(pnpm *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git push *)"
    ],
    "deny": ["Bash(rm -rf *)", "Bash(DROP *)", "Bash(prisma migrate reset)"]
  }
}
```

---

## ⚡ Slash Commands personalizados

### `/pwa-setup`

Crear `.claude/commands/pwa-setup.md`:

```markdown
Ejecuta las tareas PWA en orden:

1. Lee next.config.mjs actual
2. Lee package.json para verificar dependencias
3. Ejecuta TAREA 1 → TAREA 2 → TAREA 3 del CLAUDE.md
4. Confirma cada tarea antes de continuar a la siguiente
5. Al finalizar, ejecuta `pnpm build` y reporta el resultado
```

### `/mobile-component [nombre] [portal]`

Crear `.claude/commands/mobile-component.md`:

```markdown
Crea un componente React mobile-first para el portal indicado.

- Usa Tailwind responsive: mobile primero, md: para desktop
- Importa solo de shadcn/ui o componentes existentes en /components
- Incluye touch targets mínimos de 44x44px
- Sin dependencias nuevas salvo autorización explícita
- Nombra el archivo: components/[portal]/[nombre].tsx
```

### `/check-context`

Crear `.claude/commands/check-context.md`:

```markdown
Audita el uso de contexto actual:

1. Lista los archivos abiertos en esta sesión
2. Estima tokens usados vs disponibles
3. Sugiere qué archivos cerrar para liberar contexto
4. Reporta si hay información redundante en el contexto
5. Si el contexto supera el 70%, ejecuta /compact automáticamente
```

---

## 🤖 Subagentes especializados

### Agente: `pwa-architect`

Crear `.claude/agents/pwa-architect.md`:

```markdown
---
name: pwa-architect
description: Arquitecto PWA especializado. Usar para decisiones de configuración del Service Worker, estrategias de caché, manifest y compatibilidad iOS/Android. NO usar para escribir componentes UI.
tools: Read, Bash, Write
---

Eres un arquitecto PWA especializado en Next.js.
Tu trabajo es SOLO configuración técnica de la PWA:

- next.config.mjs y configuración next-pwa
- Service Worker y estrategias de caché
- manifest.json y meta tags
- Compatibilidad iOS Safari y Android Chrome

Antes de cualquier cambio, leer el archivo afectado completo.
Hacer cambios mínimos y precisos. No tocar lógica de negocio.
```

### Agente: `mobile-ui`

Crear `.claude/agents/mobile-ui.md`:

```markdown
---
name: mobile-ui
description: Especialista en UI móvil. Usar para crear o adaptar componentes para pantallas de 375px-430px. Prioriza accesibilidad táctil y rendimiento.
tools: Read, Write, Edit
---

Eres un especialista en UI móvil para React/Next.js.
Principios que sigues siempre:

- Touch targets mínimo 44x44px
- Sin hover-only interactions (mobile no tiene hover)
- Usa componentes shadcn/ui existentes, no inventes nuevos
- Tailwind mobile-first: base mobile, md: para desktop
- Accesibilidad: aria-labels en todos los íconos interactivos
- Colores: fondo #0a0f1e, acento #0ea5e9, texto blanco

NO instalar dependencias nuevas sin preguntar.
```

### Agente: `token-guardian`

Crear `.claude/agents/token-guardian.md`:

```markdown
---
name: token-guardian
description: Monitor de tokens. Invocar cuando el contexto se siente pesado o hay respuestas lentas. Analiza y optimiza el uso de contexto.
tools: Read, Bash
---

Analiza el estado actual del contexto y recomienda:

1. Qué archivos grandes se pueden cerrar sin perder contexto relevante
2. Si conviene usar /compact para resumir el historial
3. Si una tarea específica debería delegarse a un subagente aislado
4. Qué información ya fue procesada y puede descartarse

Reporta en formato:

- Tokens estimados en uso: X
- Archivos que se pueden cerrar: [lista]
- Acción recomendada: compact / subagente / continuar
```

---

## 🛡️ Buenas prácticas — Control de tokens y contexto

### Reglas de oro para esta sesión

```
1. LEER ANTES DE ESCRIBIR
   → Siempre leer el archivo completo antes de editarlo.
   → Nunca asumir el contenido de un archivo desde el nombre.

2. CAMBIOS MÍNIMOS Y PRECISOS
   → Hacer solo lo necesario para completar la tarea actual.
   → No refactorizar código que no esté en scope de la tarea.

3. UN ARCHIVO A LA VEZ EN CONTEXTO
   → Cerrar archivos cuando ya no sean necesarios.
   → No cargar directorios enteros, solo archivos específicos.

4. SUBAGENTES PARA TAREAS PESADAS
   → Si una tarea requiere leer 5+ archivos, usar subagente.
   → Ejemplo: "Usa un subagente para revisar todos los componentes
     de navegación y dame un resumen de su estructura".

5. /compact PROACTIVO
   → Ejecutar /compact cuando el historial supere 50 turnos.
   → Ejecutar /compact antes de empezar una nueva tarea mayor.

6. MCPS MÍNIMOS NECESARIOS
   → Solo activar MCPs que se usen en la tarea actual.
   → Desactivar con /mcp disable <nombre> al terminar.

7. COMMITS FRECUENTES
   → Hacer git commit después de cada tarea completada.
   → Mensaje: "feat(pwa): [descripción corta de la tarea]"
   → Esto permite retroceder si algo sale mal.

8. BRANCH DEDICADO
   → Crear rama: git checkout -b feature/pwa-mobile
   → NO trabajar directo en master.
```

### Señales de contexto saturado

Si Claude Code muestra alguna de estas señales, ejecutar `/compact`:

- Respuestas más lentas de lo normal
- Claude "olvida" instrucciones dadas al inicio
- Errores en archivos que ya fueron corregidos
- Respuestas genéricas que no consideran el stack del proyecto

---

## 📋 Checklist de verificación PWA

Antes de hacer el PR final, verificar:

```
□ Credenciales Google OAuth creadas en Google Cloud Console
□ AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET en .env y en Vercel
□ auth.ts y auth.config.ts creados en la raíz
□ app/api/auth/[...nextauth]/route.ts creado
□ Schema Prisma actualizado con Account, Session, VerificationToken
□ pnpm prisma db push ejecutado sin errores
□ Botón Google en login usa redirect:true (no popup — compatibilidad iOS)
□ Redirección por rol funcionando (customer/technician/admin)
□ pnpm build sin errores TypeScript
□ pnpm lint sin warnings
□ manifest.json válido (verificar en https://manifest-validator.appspot.com)
□ Service Worker registrado en Chrome DevTools → Application
□ App funciona offline (páginas visitadas)
□ Pantalla login es start_url en manifest
□ Bottom nav visible en mobile, oculta en desktop
□ Touch targets ≥ 44px en todos los botones del login
□ Meta tags Apple en app/layout.tsx
□ Redirección por rol funcionando (customer/technician/admin)
□ No hay acceso a portales sin autenticación
□ git push a branch feature/pwa-mobile
□ PR creado con descripción de cambios
```

---

## 🚀 Comando de inicio rápido

Para iniciar una sesión de trabajo con contexto optimizado:

```bash
# En la raíz del proyecto
claude --resume               # Retomar sesión anterior si existe
# o
claude                        # Nueva sesión (carga CLAUDE.md automáticamente)
```

Primera instrucción recomendada al iniciar Claude Code:

```
Lee el CLAUDE.md del proyecto y confirma que entiendes el objetivo.
Luego muéstrame el estado actual del repositorio con git status
y dime cuál es la próxima tarea pendiente según el mapa de tareas.
```

---

## 📚 Referencias

- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code/overview)
- [next-pwa en GitHub](https://github.com/shadowwalker/next-pwa)
- [Web App Manifest — MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA checklist — web.dev](https://web.dev/pwa-checklist/)
- [shadcn/ui componentes](https://ui.shadcn.com/docs/components)
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code)

---

_Generado para: basabecode/SomosTecnicos | Fecha: Marzo 2026_
_Stack: Next.js 15 + PWA | Objetivo: App móvil iOS + Android_
