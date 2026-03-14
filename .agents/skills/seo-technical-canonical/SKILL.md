---
name: seo-technical-canonical
description: Canonical URL and redirect audit for SomosTécnicos (somostecnicos.com). Use this skill whenever working on SEO indexing issues, Google Search Console errors, canonical tags, redirect chains, sitemap URLs, or any page metadata. Triggers on "canónico", "canonical", "GSC error", "Search Console", "redirección canónica", "error de redirección", "páginas con redirección", "indexación", "páginas no indexadas", "agregar nueva página", or any task that creates or modifies page metadata. Always invoke before adding metadata to a new page to avoid indexing problems from the start.
---

# SEO Técnico — Canonicals y Redirects (SomosTécnicos)

## Contexto del proyecto

| Parámetro | Valor |
|-----------|-------|
| Dominio canónico | `https://somostecnicos.com` (sin `www.`, sin trailing slash) |
| www redirect | Cloudflare Page Rule: `www.somostecnicos.com/*` → `https://somostecnicos.com/$1` (301) |
| Framework | Next.js 15 App Router |
| `metadataBase` | `new URL(cleanBaseUrl)` en `app/layout.tsx` — donde `cleanBaseUrl` elimina `www.` |
| Canonicals | **Relativos** en `alternates.canonical` — el `metadataBase` completa la URL |

---

## Los dos errores de GSC que hay que eliminar

### 1. "Error de redirección"
**Causa:** El canonical apunta a una URL que tiene un redirect (ej. `https://www.somostecnicos.com/blog` en lugar de `https://somostecnicos.com/blog`). GSC detecta que la URL declarada como canónica en realidad redirige a otra y la marca como error.

**Cómo se genera en Next.js:** Si `metadataBase` o un canonical absoluto usa `www.`, la URL resultante pasa por el redirect de Cloudflare → GSC ve redirección en la URL canónica.

### 2. "Páginas con redirección y etiquetas canónicas"
**Causa:** La página tiene canonical declarado pero la URL de la página misma (la que Google rastreó) es la versión con `www.` o con trailing slash, que redirige. Google llega a la URL redirigida, ve el canonical, y reporta el conflicto.

**Raíz común de ambos:** Mezclar `www.` en cualquier parte de la cadena: env vars, OG url, sitemap, canonical.

---

## Reglas absolutas — nunca romper

1. **`www.` prohibido en todo**: canonical, OG `url`, sitemap, `robots.ts`, env var `NEXT_PUBLIC_APP_URL`
2. **Canonicals siempre relativos** en `alternates.canonical` — dejar que `metadataBase` construya la URL final
3. **Sin trailing slash** en ningún canonical ni URL del sitemap
4. **OG `url` debe coincidir** con el canonical de la página (mismo path)
5. **`NEXT_PUBLIC_APP_URL` en Vercel** debe ser `https://somostecnicos.com` (no `www.`, no http)
6. **Páginas bloqueadas en robots.txt** (`/login`, `/register`, etc.) deben tener `robots: { index: false, follow: false }` — esto evita que GSC las reporte como "descubiertas pero no indexadas"
7. **Nunca declarar canonical hacia una URL que tenga redirect** — si `/foo` redirige a `/bar`, el canonical va en `/bar`, no en `/foo`

---

## Patrón obligatorio para cada tipo de página

### Página estática pública (layout SEO completo)
```typescript
// app/(public)/mi-pagina/page.tsx
export const metadata: Metadata = {
  title: 'Título de la página | SomosTécnicos',
  description: 'Descripción única entre 150-160 caracteres...',
  alternates: { canonical: '/mi-pagina' },          // ← RELATIVO, sin www, sin trailing slash
  openGraph: {
    title: 'Título de la página | SomosTécnicos',
    description: 'Descripción OG...',
    url: 'https://somostecnicos.com/mi-pagina',     // ← ABSOLUTO, sin www
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}
```

### Página dinámica con generateMetadata
```typescript
// app/(public)/servicios/[slug]/[marca]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, marca } = await params
  const data = getData(slug, marca)
  if (!data) return {}

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `/servicios/${slug}/${marca}` },   // ← RELATIVO
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://somostecnicos.com/servicios/${slug}/${marca}`,  // ← ABSOLUTO sin www
      type: 'website',
      locale: 'es_CO',
      siteName: 'SomosTécnicos',
    },
    robots: { index: true, follow: true },
  }
}
```

### Página de auth / no indexable
```typescript
// app/(public)/login/page.tsx — o register, forgot-password, reset-password
export const metadata: Metadata = {
  title: 'Iniciar sesión | SomosTécnicos',
  robots: { index: false, follow: false },    // ← noindex obligatorio
  // NO declarar canonical en páginas noindex — evita confusión en GSC
}
```

### Página de servicios estáticos por ciudad (patrón actual)
```typescript
// app/(public)/servicios/reparacion-neveras-cali/page.tsx
const data = SERVICIOS_DATA['reparacion-neveras-cali']

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: data.canonicalPath },   // canonicalPath viene de servicios-data.ts — verificar que no tenga www ni trailing slash
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: `https://somostecnicos.com${data.canonicalPath}`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}
```

---

## Checklist de auditoría — ejecutar al detectar errores en GSC

### Paso 1: Verificar `metadataBase` en root layout
Abrir `app/layout.tsx` y confirmar:
```typescript
const cleanBaseUrl = envUrl.replace(/^https?:\/\/(www\.)?/, 'https://')
export const metadata: Metadata = {
  metadataBase: new URL(cleanBaseUrl),  // ✅ sin www
  // ...
}
```

### Paso 2: Verificar env var en Vercel
En Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_APP_URL` = `https://somostecnicos.com`  ← sin www, sin trailing slash
- Si está vacía o mal escrita → el fallback en `layout.tsx` y `sitemap.ts` usa el valor hardcoded correcto, pero conviene tenerla explícita

### Paso 3: Auditar todas las páginas públicas
Buscar páginas sin `alternates.canonical`:
```bash
grep -r "export const metadata" app/\(public\) --include="*.tsx" -l
grep -r "generateMetadata" app/\(public\) --include="*.tsx" -l
```
Cada página encontrada debe tener `alternates: { canonical: '/su-path' }`.

### Paso 4: Verificar que ningún canonical use `www.`
```bash
grep -r "www\." app/ --include="*.tsx" --include="*.ts" -n
```
Cualquier ocurrencia de `www.` en canonical, OG url, o sitemap es un error.

### Paso 5: Verificar consistencia en `lib/seo/servicios-data.ts` y `lib/seo/blog/`
Los campos `canonicalPath` en los datos SEO deben empezar con `/` y no tener `www.` ni trailing slash:
```typescript
// ✅ correcto
canonicalPath: '/servicios/reparacion-neveras-cali'

// ❌ incorrecto
canonicalPath: 'https://www.somostecnicos.com/servicios/reparacion-neveras-cali'
canonicalPath: '/servicios/reparacion-neveras-cali/'
```

### Paso 6: Verificar sitemap
En `app/sitemap.ts`:
- `baseUrl` debe usar `cleanBaseUrl` (ya hace strip de www)
- Todas las `url:` deben comenzar con `https://somostecnicos.com/...`
- Sin trailing slashes excepto en la raíz (`baseUrl` mismo)

### Paso 7: Verificar robots.ts
En `app/robots.ts`:
- `sitemap:` debe ser `'https://somostecnicos.com/sitemap.xml'` (sin www)

---

## Mapa completo de páginas del proyecto

### Páginas públicas indexables (deben tener canonical + `robots: { index: true }`)
| Ruta | Canonical esperado |
|------|--------------------|
| `/` | `'/'` |
| `/servicios` | `'/servicios'` |
| `/servicios/reparacion-neveras-cali` | `'/servicios/reparacion-neveras-cali'` |
| `/servicios/reparacion-lavadoras-cali` | `'/servicios/reparacion-lavadoras-cali'` |
| `/servicios/reparacion-secadoras-cali` | `'/servicios/reparacion-secadoras-cali'` |
| `/servicios/reparacion-calentadores-cali` | `'/servicios/reparacion-calentadores-cali'` |
| `/servicios/reparacion-estufas-hornos-cali` | `'/servicios/reparacion-estufas-hornos-cali'` |
| `/servicios/reparacion-televisores-cali` | `'/servicios/reparacion-televisores-cali'` |
| `/servicios/tecnico-computadores-redes-cali` | `'/servicios/tecnico-computadores-redes-cali'` |
| `/servicios/camaras-seguridad-alarmas-cali` | `'/servicios/camaras-seguridad-alarmas-cali'` |
| `/servicios/electricista-a-domicilio-cali` | `'/servicios/electricista-a-domicilio-cali'` |
| `/servicios/[slug]/[marca]` | `` `/servicios/${slug}/${marca}` `` (relativo) |
| `/blog` | `'/blog'` |
| `/blog/[slug]` | `post.canonicalPath` (relativo desde blog data) |
| `/barrios` | `'/barrios'` |
| `/barrios/[barrio]` | `` `/barrios/${barrio}` `` |
| `/sobre-nosotros` | `'/sobre-nosotros'` |
| `/contacto` | `'/contacto'` |
| `/admin-info` | `'/admin-info'` |
| `/trabaja-con-nosotros` | `'/trabaja-con-nosotros'` |
| `/terminos-y-condiciones` | `'/terminos-y-condiciones'` |

### Páginas NO indexables (deben tener `robots: { index: false, follow: false }`, sin canonical)
| Ruta | Motivo |
|------|--------|
| `/login` | Auth — sin valor SEO |
| `/register` | Auth — sin valor SEO |
| `/register/customer` | Auth — sin valor SEO |
| `/register/technician` | Auth — sin valor SEO |
| `/forgot-password` | Auth — sin valor SEO |
| `/reset-password` | Auth — sin valor SEO |

---

## Flujo de corrección cuando GSC reporta un error

### "Error de redirección" en GSC
1. Copiar la URL exacta que GSC reporta
2. Verificar si la URL tiene `www.` → sí → buscar dónde se genera ese canonical y corregirlo a relativo
3. Verificar si la URL tiene trailing slash → sí → eliminar el slash del canonical/OG url
4. Verificar si la URL existe como ruta en Next.js (puede ser una ruta eliminada o renombrada)
5. Si el canonical apunta a una URL inexistente, actualizar al path correcto actual

### "Páginas con redirección y etiquetas canónicas" en GSC
1. La URL que Google rastreó (no el canonical) tiene redirect
2. Verificar que el link o source que lleva a esa URL no usa www. ni http:// (debería ser https:// sin www)
3. Si es un link interno → corregirlo para que apunte directamente a `https://somostecnicos.com/path`
4. Si es un link externo → no controlable, pero asegurarse de que el canonical de esa página sea correcto (relativo, sin www) para que Google seleccione la URL correcta

### Página "Descubierta, actualmente no indexada"
1. Verificar que la página no está en `disallow` de `robots.ts`
2. Verificar que tiene `robots: { index: true, follow: true }`
3. Verificar que tiene canonical declarado
4. Verificar que la página está en `sitemap.ts`
5. Si cumple todo → solicitar inspección de URL en GSC y pedir indexación manual

---

## Agregar una nueva página pública — lista de verificación

Al crear cualquier nueva `page.tsx` pública:
- [ ] `alternates: { canonical: '/nueva-ruta' }` — relativo, sin www, sin trailing slash
- [ ] `openGraph.url` absoluto: `'https://somostecnicos.com/nueva-ruta'` — sin www
- [ ] `robots: { index: true, follow: true }` — o `index: false` si es auth/privada
- [ ] Agregar la URL al `sitemap.ts` si es indexable
- [ ] Verificar que la ruta no tiene redirect en Cloudflare ni en Next.js
- [ ] `metaTitle` entre 50-60 caracteres, único en el sitio
- [ ] `metaDescription` entre 150-160 caracteres, única en el sitio

---

## Variables de entorno críticas

| Variable | Valor correcto en Vercel | Consecuencia si es incorrecto |
|----------|--------------------------|-------------------------------|
| `NEXT_PUBLIC_APP_URL` | `https://somostecnicos.com` | `metadataBase` puede quedar con www o con http |

Si `NEXT_PUBLIC_APP_URL` no está seteada, el código usa el fallback `'https://somostecnicos.com'` — que es correcto. Pero siempre es mejor tenerla explícita para evitar sorpresas en preview deployments.

**En Vercel**, los preview deployments usan la URL del preview automáticamente vía `VERCEL_URL`. Esto puede generar canonicals incorrectos en builds de preview. Para evitarlo, `metadataBase` solo debe usar `NEXT_PUBLIC_APP_URL` en producción. En el layout actual esto ya está resuelto porque el canonical es relativo y `metadataBase` se construye desde `NEXT_PUBLIC_APP_URL`.
