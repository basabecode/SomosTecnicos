# Guía de SEO - SomosTécnicos

## Resumen del Problema
Google reportó que de 6 páginas solo indexó 1. Las páginas no indexadas fueron:
- https://somostecnicos.com/admin-info
- https://somostecnicos.com/login
- https://somostecnicos.com/register ⚠️ **PROBLEMA CRÍTICO ENCONTRADO**
- https://somostecnicos.com/terminos-y-condiciones

## ⚠️ PROBLEMA CRÍTICO: Redirección en /register

### Diagnóstico
La ruta `/register` **NO tenía un archivo `page.tsx`**, solo subdirectorios:
- `/register/customer/page.tsx`
- `/register/technician/page.tsx`

Cuando Google intentaba acceder a `https://somostecnicos.com/register`, Next.js devolvía un **404 o redirección automática**, lo que impedía la indexación según la política de Google:

> "Página con redirección: Es una URL no canónica que redirige a otra página. Por tanto, no se indexará."

### Solución Implementada
✅ **Creado**: `app/(public)/register/page.tsx`
- Página de selección entre registro de cliente y técnico
- Metadata SEO completa
- Contenido indexable y relevante
- Enlaces claros a las sub-rutas

✅ **Creado**: `app/(public)/register/metadata.ts`
- Metadata específica para la ruta `/register`

Ahora `/register` es una página real que Google puede indexar, no una redirección.

## Soluciones Implementadas

### 1. Metadata SEO Agregada
Se agregó metadata completa a todas las páginas públicas:

#### `/login`
- **Archivo**: `app/(public)/login/metadata.ts`
- Metadata con título, descripción, keywords, OpenGraph y robots

#### `/register`
- **Archivo**: `app/(public)/register/customer/metadata.ts`
- Metadata optimizada para conversión de clientes

#### `/terminos-y-condiciones`
- **Archivo**: `app/(public)/terminos-y-condiciones/metadata.ts`
- Metadata para página legal

#### `/admin-info`
- **Archivo**: `app/(public)/admin-info/page.tsx`
- Metadata mejorada con keywords y OpenGraph completo

#### `/` (Homepage)
- **Archivo**: `app/(public)/page.tsx`
- Metadata mejorada con información completa

### 2. Sitemap Optimizado
**Archivo**: `app/sitemap.ts`

Cambios realizados:
- Fechas realistas (no todas con `new Date()`)
- Prioridades ajustadas según importancia
- Orden lógico de páginas
- `/admin-info` con prioridad 0.8 (página informativa importante)

### 3. Robots.txt
**Archivo**: `app/robots.ts`

Configuración actual:
```typescript
{
  userAgent: '*',
  allow: '/',
  disallow: ['/private/', '/admin/', '/technician/', '/api/', '/customer/'],
  sitemap: 'https://somostecnicos.com/sitemap.xml',
}
```

## Verificación de Indexación

### URLs Públicas Indexables:
1. ✅ `https://somostecnicos.com/` (Prioridad: 1.0)
2. ✅ `https://somostecnicos.com/admin-info` (Prioridad: 0.8)
3. ✅ `https://somostecnicos.com/login` (Prioridad: 0.7)
4. ✅ `https://somostecnicos.com/register` (Prioridad: 0.7)
5. ✅ `https://somostecnicos.com/terminos-y-condiciones` (Prioridad: 0.5)

### Elementos SEO Implementados:
- ✅ Títulos únicos y descriptivos
- ✅ Meta descriptions optimizadas
- ✅ Keywords relevantes
- ✅ OpenGraph tags para redes sociales
- ✅ Canonical URLs
- ✅ Robots meta tags (index: true, follow: true)
- ✅ Sitemap XML dinámico
- ✅ Robots.txt dinámico
- ✅ Schema.org JSON-LD en homepage

## Próximos Pasos para Google Search Console

### 1. Solicitar Re-indexación
1. Ir a Google Search Console
2. Usar la herramienta "Inspección de URL"
3. Solicitar indexación para cada URL:
   - `https://somostecnicos.com/admin-info`
   - `https://somostecnicos.com/login`
   - `https://somostecnicos.com/register`
   - `https://somostecnicos.com/terminos-y-condiciones`

### 2. Verificar Sitemap
1. En Google Search Console > Sitemaps
2. Verificar que `https://somostecnicos.com/sitemap.xml` esté enviado
3. Si no está, agregarlo manualmente

### 3. Verificar Cobertura
1. En Google Search Console > Cobertura
2. Revisar errores de indexación
3. Verificar que no haya problemas de renderizado

### 4. Verificar Robots.txt
1. Acceder a `https://somostecnicos.com/robots.txt`
2. Verificar que las rutas públicas no estén bloqueadas
3. En Google Search Console > Configuración > robots.txt tester

## Monitoreo

### Métricas a Seguir:
- **Páginas indexadas**: Debe aumentar de 1 a 5
- **Impresiones**: Aumentarán con más páginas indexadas
- **CTR**: Mejorar con títulos y descripciones optimizadas
- **Posición promedio**: Monitorear para keywords objetivo

### Tiempo Estimado:
- **Re-indexación manual**: 1-3 días
- **Indexación orgánica**: 1-2 semanas
- **Mejora en rankings**: 2-4 semanas

## Notas Técnicas

### Next.js 14 App Router
- Las páginas client-side (`'use client'`) pueden tener metadata mediante archivos separados
- La metadata se genera en el servidor incluso para componentes client-side
- El sitemap y robots.txt son dinámicos pero se sirven como estáticos

### Verificación Local
Para verificar que la metadata se está generando correctamente:

```bash
# Build de producción
npm run build

# Verificar sitemap
curl https://somostecnicos.com/sitemap.xml

# Verificar robots.txt
curl https://somostecnicos.com/robots.txt

# Verificar metadata en cada página
curl -I https://somostecnicos.com/login
```

## Contacto para Soporte
Si Google continúa sin indexar las páginas después de 2 semanas:
1. Verificar en Google Search Console los errores específicos
2. Revisar el archivo de renderizado de Google
3. Verificar que no haya penalizaciones manuales
4. Contactar al soporte de Google Search Console

---
**Última actualización**: 2026-02-15
**Versión**: 1.0
