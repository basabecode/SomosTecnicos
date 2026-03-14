# PERF-MOBILE-01 — Optimización de Rendimiento Móvil

**Sitio:** https://somostecnicos.com
**Fecha del análisis:** 14 mar 2026, 6:17 a.m. GMT-5
**Herramienta:** PageSpeed Insights (Lighthouse 13.0.1)
**Dispositivo simulado:** Moto G Power · Red 4G lenta

---

## Puntajes actuales (Celulares)

| Métrica         | Puntaje | Estado      |
| --------------- | ------- | ----------- |
| Rendimiento     | 81      | 🟡 Mejorar  |
| Accesibilidad   | 89      | 🟡 Mejorar  |
| Recomendaciones | 100     | ✅ Perfecto |
| SEO             | 100     | ✅ Perfecto |

**Objetivo:** Rendimiento ≥ 90 en móvil.

---

## Métricas de laboratorio

| Métrica                  | Valor | Estado      |
| ------------------------ | ----- | ----------- |
| First Contentful Paint   | 2.2 s | 🟡 Mejorar  |
| Largest Contentful Paint | 4.1 s | 🔴 Crítico  |
| Total Blocking Time      | 90 ms | ✅ Bien     |
| Cumulative Layout Shift  | 0     | ✅ Perfecto |
| Speed Index              | 4.9 s | 🟡 Mejorar  |

El **LCP de 4.1 s** es el problema principal. Google considera bueno ≤ 2.5 s. Todo el trabajo de optimización debe apuntar primero a reducir el LCP.

---

## Tareas de optimización (ordenadas por impacto)

### 🔴 CRÍTICO — LCP (Largest Contentful Paint)

#### PERF-01 · Descubrimiento temprano del recurso LCP

**Problema:** Lighthouse detectó "Descubrimiento de solicitudes de LCP" como issue crítico. El navegador tarda demasiado en encontrar la imagen o elemento hero que dispara el LCP.

**Acciones:**

- Identificar cuál es el elemento LCP en mobile (probablemente la imagen hero o el banner principal).
- Agregar `<link rel="preload">` en el `<head>` del layout raíz para esa imagen:
  ```html
  <link
    rel="preload"
    as="image"
    href="/images/hero.webp"
    fetchpriority="high"
  />
  ```
- En Next.js App Router, añadir en `app/layout.tsx` dentro de `<head>` usando el componente nativo, o vía `next/head`.
- Si la imagen se renderiza con `<Image>` de Next.js, agregar `priority` prop:
  ```tsx
  <Image src="/hero.webp" priority alt="..." width={} height={} />
  ```

---

#### PERF-02 · Árbol de dependencias de red (Critical Path)

**Problema:** Lighthouse marcó "Árbol de dependencias de red" como crítico. Hay recursos que bloquean o retrasan la carga del LCP porque dependen de otros recursos que deben cargarse antes.

**Acciones:**

- Auditar la cadena de solicitudes en Chrome DevTools → Network → waterfall.
- Asegurarse de que el CSS crítico (above-the-fold) esté inlined o cargue sin bloquear.
- Mover scripts no críticos a `defer` o `async`.
- Revisar si hay fuentes Google Fonts cargando síncronamente; cambiar a `display=swap` y preconectar:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  ```

---

#### PERF-03 · Reprocesamiento forzado (Forced Reflow)

**Problema:** Lighthouse detectó "Reprocesamiento forzado" como issue crítico. Algún JavaScript está leyendo propiedades de layout (offsetHeight, getBoundingClientRect, etc.) justo después de mutar el DOM, forzando al browser a recalcular el layout antes de tiempo.

**Acciones:**

- Buscar en el código JS/TSX llamadas a `offsetHeight`, `offsetWidth`, `getBoundingClientRect`, `scrollTop`, `clientWidth` que ocurran dentro de loops o inmediatamente después de setear estilos dinámicamente.
- Batch de lecturas antes de escrituras para evitar layout thrashing.
- Si se usa alguna librería de animación (Framer Motion, GSAP), verificar que no esté causando reflows en el primer render.
- Revisar componentes con `useEffect` que manipulen el DOM al montar.

---

### 🟡 IMPORTANTE — FCP y Speed Index

#### PERF-04 · Reducir JavaScript sin usar — Ahorro estimado: 72 KiB

**Problema:** Se está enviando al cliente 72 KiB de JS que no se ejecuta en la carga inicial.

**Acciones:**

- Ejecutar `next build && next analyze` con `@next/bundle-analyzer` para identificar los módulos más pesados.
  ```bash
  npm install @next/bundle-analyzer
  # En next.config.js activar el analyzer
  ```
- Aplicar **dynamic imports** para componentes que no son críticos en el first paint:
  ```tsx
  const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
    ssr: false,
  })
  ```
- Revisar si hay librerías importadas completas cuando solo se usa una parte (ej: `import _ from 'lodash'` en lugar de `import debounce from 'lodash/debounce'`).
- Verificar imports de íconos: si se usa una librería como `react-icons` o `lucide-react`, importar solo el ícono específico.

---

#### PERF-05 · Mejorar entrega de imágenes — Ahorro estimado: 28 KiB

**Problema:** Imágenes no optimizadas o en formatos legacy (JPEG/PNG) donde se podría usar WebP/AVIF.

**Acciones:**

- Confirmar que **todas** las imágenes de contenido usen el componente `<Image>` de Next.js (optimización automática a WebP).
- Para imágenes en CSS (`background-image`), convertir manualmente a WebP y servir desde `/public`.
- Si hay imágenes en el `<img>` tag nativo, reemplazarlas con `<Image>`.
- Revisar imágenes subidas dinámicamente (ej: fotos de técnicos o productos); asegurarse de que pasen por el pipeline de optimización de Next.js o un servicio como Cloudinary/Vercel Image Optimization.
- Agregar `sizes` prop correcta en imágenes responsivas:
  ```tsx
  <Image src="..." sizes="(max-width: 768px) 100vw, 50vw" ... />
  ```

---

#### PERF-06 · JavaScript heredado — Ahorro estimado: 12 KiB

**Problema:** Se está transpilando JS a sintaxis antigua (ES5) para navegadores que ya no necesitan ese soporte, inflando el bundle innecesariamente.

**Acciones:**

- Revisar `browserslist` en `package.json` o `.browserslistrc`; si apunta a navegadores muy antiguos, actualizar a:
  ```
  > 0.5%, last 2 versions, not dead, not IE 11
  ```
- Verificar `next.config.js`: asegurarse de no tener transpilaciones forzadas innecesarias.
- Revisar si hay polyfills manuales cargados para features que los navegadores modernos ya tienen nativo.

---

#### PERF-07 · Solicitudes de bloqueo de renderización

**Problema:** Recursos (CSS o JS) en el `<head>` que bloquean el primer render.

**Acciones:**

- Auditar el HTML generado: buscar `<link rel="stylesheet">` o `<script>` sin `defer`/`async` de fuentes externas.
- Scripts de terceros (analytics, chat widgets, etc.) deben cargarse con `strategy="lazyOnload"` usando el componente `<Script>` de Next.js:
  ```tsx
  import Script from 'next/script'
  ;<Script src="https://..." strategy="lazyOnload" />
  ```
- Nunca cargar scripts de terceros con `strategy="beforeInteractive"` a menos que sea absolutamente necesario.

---

### ⚪ OPTIMIZACIONES ADICIONALES

#### PERF-08 · Optimizar tamaño del DOM

**Problema:** El árbol DOM tiene demasiados nodos, lo que ralentiza el layout y el paint.

**Acciones:**

- Lighthouse considera problemático un DOM > 1,500 nodos. Revisar la página en DevTools → Elements y buscar nodos innecesarios.
- Virtualizar listas largas (ej: listado de técnicos o servicios) con `react-window` o `react-virtual`.
- Evitar wrappers de `<div>` innecesarios; usar `<>` (Fragment) cuando sea posible.

---

#### PERF-09 · Cargas útiles de red de gran tamaño

**Problema:** El total de bytes transferidos en la carga inicial es alto.

**Acciones:**

- Activar compresión Brotli en Vercel (está activa por defecto, verificar que no esté desactivada).
- Auditar respuestas de API con DevTools → Network → Size. Si alguna respuesta JSON es muy grande, paginar o filtrar campos en el servidor.
- Revisar si se están cargando fuentes en múltiples pesos/estilos innecesarios.

---

## Resumen de prioridades

```
PRIORIDAD 1 (Esta semana):
  PERF-01 — Preload del recurso LCP
  PERF-02 — Limpiar árbol de dependencias de red
  PERF-03 — Eliminar reprocesamiento forzado (JS)

PRIORIDAD 2 (Siguiente sprint):
  PERF-04 — Bundle splitting / eliminar JS sin usar (72 KiB)
  PERF-05 — Optimizar imágenes (28 KiB)
  PERF-07 — Scripts de terceros con lazyOnload

PRIORIDAD 3 (Mantenimiento):
  PERF-06 — Actualizar browserslist (12 KiB)
  PERF-08 — Reducir tamaño del DOM
  PERF-09 — Auditar payload de red
```

---

## Cómo usar este documento en Claude Code

Pega este archivo en la raíz del proyecto como `PERF-MOBILE-01.md` y en la terminal ejecuta:

```bash
claude "Lee el archivo PERF-MOBILE-01.md y empieza resolviendo las tareas de PRIORIDAD 1 (PERF-01, PERF-02, PERF-03). Analiza los archivos relevantes del proyecto antes de hacer cambios."
```

Para ejecutar tarea por tarea:

```bash
claude "Resuelve PERF-04 del archivo PERF-MOBILE-01.md: elimina JavaScript sin usar. Primero instala @next/bundle-analyzer, analiza el bundle y aplica dynamic imports donde corresponda."
```

---

_Generado el 14 mar 2026 — Basado en PageSpeed Insights Lighthouse 13.0.1_
