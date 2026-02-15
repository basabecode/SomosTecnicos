# Historial de Incidentes y Mejoras SEO

Este documento consolida los reportes e incidentes relacionados con la indexación y optimización SEO del proyecto.

---

## Resumen de Correcciones SEO (RESUMEN_CORRECCIONES_SEO.md)
**Fecha:** 15 de Febrero 2026

### 📊 Problema Reportado
Google reportó que de 6 páginas públicas enviadas, solo 1 fue indexada.
**URLs afectadas:** `/admin-info`, `/login`, `/register`, `/terminos-y-condiciones`.

### 🔍 Diagnóstico
1.  **Falta de Metadata:** Páginas client-side sin exportar metadata.
2.  **Redirección Crítica en `/register`:** La ruta no tenía `page.tsx`, causando un 404/redirección que Google no indexa.

### ✅ Soluciones Implementadas
1.  **Metadata Completa:** Se crearon archivos `metadata.ts` para todas las rutas públicas.
    - `/login/metadata.ts`
    - `/register/metadata.ts`
    - `/register/customer/metadata.ts`
    - `/terminos-y-condiciones/metadata.ts`
2.  **Página Real en `/register`:** Se creó `app/(public)/register/page.tsx` para eliminar la redirección y ofrecer contenido indexable (selector de tipo de usuario).
3.  **Sitemap Optimizado:** Prioridades ajustadas (`/` 1.0, `/admin-info` 0.8) y fechas dinámicas.
4.  **Robots.txt:** Verificado para permitir acceso a todas las rutas públicas.

### 📈 Resultados
- Todas las páginas públicas devuelven status 200 OK.
- Sitemap lista correctamente 5 URLs.
- Metadata presente en todas las vistas.

---

## Guía de Indexación y Diagnóstico (GUIA_SEO_INDEXACION.md)

### ⚠️ Problema Crítico: Redirección en /register
La ruta `/register` funcionaba como una redirección automática a sub-rutas, lo cual es interpretado por Google como una página no canónica y no indexable.
**Solución:** Reemplazo por una "Landing de Registro" que actúa como hub de navegación.

### Verificación de Indexación
URLs que ahora deben ser indexadas:
1.  `https://somostecnicos.com/`
2.  `https://somostecnicos.com/admin-info`
3.  `https://somostecnicos.com/login`
4.  `https://somostecnicos.com/register`
5.  `https://somostecnicos.com/terminos-y-condiciones`

### Procedimiento de Re-indexación (Google Search Console)
1.  Usar herramienta "Inspección de URL".
2.  Solicitar indexación manual para las 4 URLs faltantes.
3.  Verificar en "Cobertura" que las páginas pasen de "Excluidas" a "Válidas".

### Monitoreo
- **Tiempo estimado de re-indexación:** 1-3 días (manual) o 1-2 semanas (orgánico).
- **Métrica clave:** Aumento de páginas indexadas de 1 a 5.
