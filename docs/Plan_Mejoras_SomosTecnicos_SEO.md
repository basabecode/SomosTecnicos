# 📋 Plan de Mejoras — SomosTécnicos.com
### Roadmap de tareas para posicionamiento SEO en Cali y optimización del proyecto
**Fecha:** Febrero 2026 | **Versión:** 1.0

---

## 🔴 FASE 1 — SEO Técnico y Fundamentos (Semana 1-2)
> Prioridad CRÍTICA. Sin esto, Google no puede indexar ni posicionar correctamente tu sitio.

---

### Tarea 1.1 — Configurar Google Search Console y Google Business Profile

**¿Qué hacer?**
Registrar y verificar el dominio `somostecnicos.com` en Google Search Console. Crear o reclamar el perfil de Google Business Profile (antes Google My Business) con la información completa del negocio.

**Detalles de ejecución:**
- Ir a [search.google.com/search-console](https://search.google.com/search-console) y verificar la propiedad del dominio (método DNS recomendado con Vercel).
- Enviar el sitemap (normalmente en `somostecnicos.com/sitemap.xml`). Si Next.js no lo genera automáticamente, instalarlo con `next-sitemap`.
- Crear perfil en Google Business Profile con: nombre "SomosTécnicos", categoría "Servicio de reparación de electrodomésticos", dirección en Cali, teléfono +57 3003094854, horario Lun-Sáb 8am-6pm, fotos del equipo/trabajo, enlace al sitio web.
- Solicitar reseñas a clientes actuales para acumular al menos 10-15 reseñas iniciales con ⭐5.

**Resultado esperado:** Google comienza a indexar el sitio correctamente y apareces en Google Maps cuando buscan "servicio técnico Cali".

---

### Tarea 1.2 — Implementar Meta Tags SEO en todas las páginas

**¿Qué hacer?**
Cada página del sitio debe tener un `<title>` y `<meta description>` únicos, optimizados con keywords relevantes para Cali.

**Detalles de ejecución:**
En tu proyecto Next.js, utilizar el componente `<Head>` o la metadata API (App Router) para configurar:

| Página | Title | Meta Description |
|--------|-------|-----------------|
| Home | `Servicio Técnico a Domicilio en Cali | Reparación de Electrodomésticos | SomosTécnicos` | `Reparación, instalación y mantenimiento de neveras, lavadoras, calentadores y más en Cali. Técnicos certificados a domicilio. Solicita tu servicio en línea.` |
| Servicios | `Servicios de Reparación de Electrodomésticos en Cali | SomosTécnicos` | `Reparación especializada, instalación calificada y mantenimiento preventivo de electrodomésticos en Cali y alrededores. Todas las marcas.` |
| Contacto | `Contacto | Servicio Técnico en Cali | SomosTécnicos` | `Contáctanos para agendar tu servicio técnico a domicilio en Cali. WhatsApp, teléfono y formulario en línea.` |

- Asegurar que cada `<title>` tenga entre 50-60 caracteres.
- Cada `<meta description>` entre 140-160 caracteres.
- Incluir siempre las palabras "Cali", "domicilio" y el tipo de servicio.

**Resultado esperado:** Google muestra títulos y descripciones optimizadas en los resultados de búsqueda.

---

### Tarea 1.3 — Implementar Schema Markup (Datos Estructurados)

**¿Qué hacer?**
Agregar JSON-LD de datos estructurados para que Google entienda que eres un negocio local de servicios técnicos.

**Detalles de ejecución:**
Agregar en el `<head>` de la página principal un script JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "SomosTécnicos",
  "description": "Servicio técnico especializado en reparación, instalación y mantenimiento de electrodomésticos a domicilio en Cali.",
  "url": "https://somostecnicos.com",
  "telephone": "+573003094854",
  "email": "soporte@somostecnicos.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cali",
    "addressRegion": "Valle del Cauca",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 3.4516,
    "longitude": -76.5320
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "08:00",
    "closes": "18:00"
  },
  "areaServed": ["Cali", "Yumbo", "Jamundí", "Palmira", "Candelaria"],
  "serviceType": ["Reparación de electrodomésticos", "Instalación de electrodomésticos", "Mantenimiento preventivo"],
  "priceRange": "$$"
}
```

Adicionalmente agregar schema `Service` para cada servicio individual (neveras, lavadoras, etc.) en sus páginas respectivas.

**Resultado esperado:** Google muestra rich snippets con horario, ubicación, teléfono y servicios directamente en los resultados.

---

### Tarea 1.4 — Generar Sitemap.xml y Robots.txt optimizados

**¿Qué hacer?**
Asegurar que Next.js genera automáticamente un sitemap.xml con todas las páginas y que el robots.txt permite la indexación correcta.

**Detalles de ejecución:**
- Instalar `next-sitemap` en el proyecto: `npm install next-sitemap`
- Crear archivo `next-sitemap.config.js` en la raíz:
```js
module.exports = {
  siteUrl: 'https://somostecnicos.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
}
```
- Verificar que el sitemap se genera en `/sitemap.xml` después del build.
- Enviar el sitemap a Google Search Console.

**Resultado esperado:** Google descubre e indexa todas las páginas del sitio automáticamente.

---

### Tarea 1.5 — Optimizar velocidad de carga y Core Web Vitals

**¿Qué hacer?**
Auditar el rendimiento del sitio y corregir problemas de velocidad que afectan el ranking.

**Detalles de ejecución:**
- Ejecutar auditoría en [PageSpeed Insights](https://pagespeed.web.dev/) con la URL de tu sitio.
- Optimizar imágenes: verificar que todas usan el componente `<Image>` de Next.js con `loading="lazy"` y formatos WebP.
- El video `/video/video_reparacion_ok.mp4` puede ser pesado — considerar convertirlo a formato más liviano o usar un poster image con carga lazy.
- Verificar que las fuentes se cargan con `font-display: swap`.
- Asegurar que el LCP (Largest Contentful Paint) sea menor a 2.5 segundos.
- Revisar que no haya JavaScript bloqueante innecesario.

**Resultado esperado:** Score de PageSpeed superior a 85 en móvil, lo que mejora el ranking en Google.

---

## 🟠 FASE 2 — Creación de Páginas de Servicio (Semana 2-4)
> Prioridad ALTA. Esto es lo que más te falta frente a la competencia.

---

### Tarea 2.1 — Crear páginas individuales por tipo de electrodoméstico

**¿Qué hacer?**
Crear una página dedicada para cada servicio que ofreces. Cada página debe tener contenido único, optimizado para SEO local.

**Páginas a crear:**

| Ruta URL | Título H1 | Keywords objetivo |
|----------|-----------|-------------------|
| `/servicios/reparacion-neveras-cali` | Reparación de Neveras a Domicilio en Cali | reparación neveras cali, arreglo nevera cali, técnico neveras cali |
| `/servicios/reparacion-lavadoras-cali` | Reparación de Lavadoras a Domicilio en Cali | reparación lavadoras cali, técnico lavadoras cali |
| `/servicios/reparacion-secadoras-cali` | Reparación de Secadoras a Domicilio en Cali | reparación secadoras cali, servicio técnico secadoras |
| `/servicios/reparacion-estufas-cali` | Reparación de Estufas y Hornos a Domicilio en Cali | reparación estufas cali, arreglo estufa gas cali |
| `/servicios/reparacion-calentadores-cali` | Reparación de Calentadores a Domicilio en Cali | reparación calentadores cali, técnico calentadores gas |
| `/servicios/reparacion-televisores-cali` | Reparación de Televisores a Domicilio en Cali | reparación tv cali, arreglo televisor cali |
| `/servicios/electricista-cali` | Electricista a Domicilio en Cali | electricista cali, instalaciones eléctricas cali |
| `/servicios/computacion-redes-cali` | Soporte Técnico en Computación y Redes en Cali | técnico computadores cali, reparación pc cali |
| `/servicios/seguridad-electronica-cali` | Instalación de Seguridad Electrónica en Cali | cámaras seguridad cali, instalación CCTV cali |

**Estructura de cada página (mínimo 600-800 palabras):**
1. **H1** con el keyword principal + "Cali"
2. Párrafo introductorio describiendo el servicio (150 palabras)
3. **H2: "¿Qué problemas solucionamos?"** — Lista de fallas comunes del electrodoméstico
4. **H2: "Marcas que atendemos"** — Logos de marcas relevantes para ese electrodoméstico
5. **H2: "¿Cómo funciona nuestro servicio?"** — Mini resumen del proceso de 6 pasos
6. **H2: "Precios y costos de reparación"** — Rango general de precios (esto es lo que la gente busca mucho)
7. **H2: "Zonas de cobertura en Cali"** — Mencionar comunas y barrios
8. **CTA final** — Botón "Solicitar Servicio" enlazado al formulario principal
9. **FAQ específicas** del electrodoméstico (schema FAQPage)

**Resultado esperado:** Cada página posiciona para búsquedas específicas como "reparación neveras cali", que es exactamente lo que busca la gente.

---

### Tarea 2.2 — Crear página "Quiénes Somos" / "Nosotros"

**¿Qué hacer?**
Crear una página que humanice el negocio, genere confianza y contenga contenido indexable.

**Detalles de ejecución:**
- Ruta: `/nosotros`
- Contenido mínimo (500 palabras):
  - Historia del negocio y cómo nació la plataforma
  - Misión y visión
  - Foto del fundador o equipo (con nombre y cargo)
  - Estadísticas: años de experiencia, servicios realizados, técnicos en la plataforma
  - Mencionar que es una plataforma digital innovadora (diferencial vs competencia)
  - Valores: garantía, puntualidad, transparencia
- Incluir schema `Organization` en datos estructurados

**Resultado esperado:** Genera confianza en usuarios nuevos y aporta contenido indexable adicional.

---

### Tarea 2.3 — Crear páginas por marca (opcional pero poderoso)

**¿Qué hacer?**
Crear al menos 5 páginas dedicadas a las marcas más buscadas.

**Páginas prioritarias:**

| Ruta | Título |
|------|--------|
| `/marcas/servicio-tecnico-samsung-cali` | Servicio Técnico Samsung en Cali a Domicilio |
| `/marcas/servicio-tecnico-lg-cali` | Servicio Técnico LG en Cali a Domicilio |
| `/marcas/servicio-tecnico-whirlpool-cali` | Servicio Técnico Whirlpool en Cali a Domicilio |
| `/marcas/servicio-tecnico-haceb-cali` | Servicio Técnico Haceb en Cali a Domicilio |
| `/marcas/servicio-tecnico-mabe-cali` | Servicio Técnico Mabe en Cali a Domicilio |

Cada página con contenido sobre los modelos y fallas más comunes de esa marca, marcas que la competencia ya está atacando fuertemente con páginas dedicadas (centrosdeservicio.com tiene decenas de estas).

**Resultado esperado:** Capturas tráfico de búsquedas tipo "servicio técnico Samsung Cali" que son muy frecuentes.

---

## 🟡 FASE 3 — Blog y Marketing de Contenido (Semana 4-8)
> Prioridad MEDIA-ALTA. El blog genera tráfico orgánico sostenido a largo plazo.

---

### Tarea 3.1 — Implementar sección de Blog en el sitio

**¿Qué hacer?**
Crear una sección `/blog` dentro del proyecto Next.js para publicar artículos informativos.

**Detalles de ejecución:**
- Crear la ruta `/blog` con listado de artículos
- Crear la ruta `/blog/[slug]` para artículos individuales
- Usar archivos MDX o un CMS headless simple (como Notion API o Contentlayer) para gestionar artículos
- Cada artículo debe tener: title, meta description, fecha, imagen destacada, autor, categoría
- Implementar schema `Article` en cada post
- Agregar enlace "Blog" o "Artículos" al menú de navegación principal

**Resultado esperado:** Base técnica lista para publicar contenido que atraiga tráfico orgánico.

---

### Tarea 3.2 — Publicar primeros 10 artículos SEO

**¿Qué hacer?**
Escribir y publicar artículos orientados a resolver dudas frecuentes de usuarios en Cali. Cada artículo debe tener mínimo 800-1200 palabras.

**Artículos recomendados (priorizados por volumen de búsqueda):**

1. **"¿Por qué mi nevera no enfría? Causas y soluciones"** — (keyword: nevera no enfría)
2. **"¿Cada cuánto se debe hacer mantenimiento a la lavadora?"** — (keyword: mantenimiento lavadora)
3. **"Mi lavadora no centrifuga: qué hacer antes de llamar al técnico"** — (keyword: lavadora no centrifuga)
4. **"¿Cuánto cuesta reparar una nevera en Cali en 2026?"** — (keyword: costo reparación nevera cali)
5. **"Cómo saber si mi calentador de agua necesita reparación"** — (keyword: reparar calentador agua)
6. **"Señales de que tu estufa a gas necesita revisión técnica"** — (keyword: revisar estufa gas)
7. **"¿Televisor con pantalla negra? Diagnóstico paso a paso"** — (keyword: televisor pantalla negra)
8. **"Tips para alargar la vida útil de tus electrodomésticos"** — (keyword: cuidar electrodomésticos)
9. **"¿Servicio técnico autorizado vs independiente? Diferencias"** — (keyword: servicio técnico autorizado)
10. **"Guía de instalación segura de calentadores de paso en Cali"** — (keyword: instalar calentador cali)

**Estructura de cada artículo:**
- H1 con keyword principal
- Introducción (100 palabras)
- 3-5 subtítulos H2 desarrollando el tema
- Imágenes relevantes con alt text descriptivo
- CTA al final: "¿Necesitas un técnico? Solicita tu servicio aquí"
- Links internos a las páginas de servicio correspondientes

**Resultado esperado:** Tráfico orgánico de usuarios buscando soluciones, que luego convierten en solicitudes de servicio.

---

### Tarea 3.3 — Establecer calendario de publicación

**¿Qué hacer?**
Planificar publicación sostenida de al menos 2 artículos por mes.

**Detalles:**
- Semana 1 de cada mes: artículo sobre problemas/fallas de electrodomésticos
- Semana 3 de cada mes: artículo sobre consejos de mantenimiento o guías prácticas
- Usar herramientas como Google Trends y AnswerThePublic para identificar nuevos temas
- Cada artículo debe linkear a al menos 2 páginas de servicio internas

**Resultado esperado:** Crecimiento sostenido del tráfico orgánico mes a mes.

---

## 🟢 FASE 4 — Confianza y Conversión (Semana 4-6)
> Prioridad MEDIA. Aumenta la tasa de conversión de visitante a cliente.

---

### Tarea 4.1 — Agregar sección de Testimonios reales

**¿Qué hacer?**
Crear un componente de testimonios en la página principal con reseñas reales de clientes.

**Detalles de ejecución:**
- Diseñar un carrusel o grid de testimonios con: nombre del cliente, barrio/zona de Cali, servicio realizado, calificación en estrellas, texto del testimonio
- Mínimo 6 testimonios iniciales
- Idealmente vincular con Google Reviews (mostrar widget de Google o al menos enlazar al perfil)
- Agregar schema `Review` y `AggregateRating` para que Google muestre estrellas en resultados
- Ubicar la sección después de "¿Cómo Funciona?" y antes de "Preguntas Frecuentes"

**Ejemplo de schema:**
```json
{
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "47",
  "bestRating": "5"
}
```

**Resultado esperado:** Mayor confianza del visitante y estrellas visibles en Google.

---

### Tarea 4.2 — Optimizar sección de Preguntas Frecuentes (FAQ)

**¿Qué hacer?**
Las FAQ actuales son correctas pero están cerradas (no se ve el contenido). Expandirlas con respuestas más completas y agregar schema FAQPage.

**Detalles de ejecución:**
- Expandir cada respuesta a mínimo 2-3 oraciones con información útil y keywords
- Agregar 3-4 preguntas adicionales relevantes:
  - "¿En qué zonas de Cali tienen cobertura?"
  - "¿Trabajan los domingos y festivos?"
  - "¿Cómo puedo hacer seguimiento de mi servicio?"
  - "¿Los técnicos están certificados?"
- Implementar schema FAQPage en JSON-LD para que Google muestre las preguntas directamente en los resultados:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuál es el costo del servicio técnico a domicilio?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La visita de diagnóstico tiene un costo base que varía según la zona..."
      }
    }
  ]
}
```

**Resultado esperado:** Las FAQ aparecen como rich snippets en Google, ocupando más espacio visual en los resultados.

---

### Tarea 4.3 — Agregar indicadores de confianza (trust signals)

**¿Qué hacer?**
Incorporar elementos visuales que transmitan profesionalismo y seguridad.

**Detalles de ejecución:**
- Agregar contador de servicios realizados: "Más de X servicios completados" (con animación de conteo)
- Mostrar años de experiencia de forma prominente
- Agregar badges: "Técnicos Verificados", "Garantía por escrito", "Pago seguro"
- Si tienen certificaciones o alianzas, mostrarlas
- Considerar agregar una sección "Nuestro equipo" con fotos reales de técnicos (con consentimiento)

**Resultado esperado:** El visitante percibe mayor profesionalismo y seguridad para solicitar el servicio.

---

## 🔵 FASE 5 — SEO Local Avanzado y Link Building (Semana 6-12)
> Prioridad MEDIA. Estrategia de mediano plazo para consolidar posicionamiento.

---

### Tarea 5.1 — Crear páginas por zonas de cobertura en Cali

**¿Qué hacer?**
Crear páginas específicas para las principales comunas y municipios donde prestan servicio.

**Páginas sugeridas:**

| Ruta | Título |
|------|--------|
| `/cobertura/servicio-tecnico-sur-cali` | Servicio Técnico a Domicilio en el Sur de Cali |
| `/cobertura/servicio-tecnico-norte-cali` | Servicio Técnico a Domicilio en el Norte de Cali |
| `/cobertura/servicio-tecnico-oeste-cali` | Servicio Técnico a Domicilio en el Oeste de Cali |
| `/cobertura/servicio-tecnico-palmira` | Servicio Técnico a Domicilio en Palmira |
| `/cobertura/servicio-tecnico-jamundi` | Servicio Técnico a Domicilio en Jamundí |
| `/cobertura/servicio-tecnico-yumbo` | Servicio Técnico a Domicilio en Yumbo |

Cada página debe mencionar barrios específicos de la zona, lo que ayuda a rankear para búsquedas hiperlocales.

**Resultado esperado:** Capturar búsquedas localizadas como "técnico electrodomésticos sur de cali".

---

### Tarea 5.2 — Registrarse en directorios locales y plataformas

**¿Qué hacer?**
Crear perfiles del negocio en directorios online colombianos para obtener backlinks y presencia.

**Directorios recomendados:**
- Google Business Profile (ya mencionado, es el más importante)
- Páginas Amarillas Colombia (paginasamarillas.com.co)
- Cylex Colombia
- Hotfrog Colombia
- Yelp (si tiene presencia en Colombia)
- Directorio de Cámara de Comercio de Cali
- Facebook Business Page
- Instagram Business Profile
- Waze (si aplica para la ubicación física)

**En cada directorio asegurar:**
- Nombre exacto: "SomosTécnicos"
- Dirección, teléfono y URL consistentes (NAP consistency)
- Misma categoría de negocio en todos
- Descripción con keywords de Cali y servicios

**Resultado esperado:** Backlinks de calidad y consistencia de NAP que mejora el SEO local.

---

### Tarea 5.3 — Implementar estrategia de reseñas

**¿Qué hacer?**
Crear un sistema para solicitar reseñas después de cada servicio completado.

**Detalles de ejecución:**
- Después de cada servicio exitoso, enviar por WhatsApp un mensaje con enlace directo para dejar reseña en Google
- Crear una página `/resena` que redirija al perfil de Google Reviews
- Meta: obtener al menos 5 reseñas nuevas por mes
- Responder TODAS las reseñas (positivas y negativas) profesionalmente
- Considerar incentivos éticos: "Déjanos tu opinión y recibe 10% de descuento en tu próximo servicio"

**Resultado esperado:** Acumular reseñas que mejoran el ranking en Google Maps y generan confianza.

---

## 🟣 FASE 6 — Mejoras UX y Funcionalidades (Semana 8-12)
> Prioridad BAJA-MEDIA. Mejoras incrementales que refinan la experiencia.

---

### Tarea 6.1 — Mejorar el enlace interno (internal linking)

**¿Qué hacer?**
Crear una red de enlaces internos entre todas las páginas del sitio.

**Estructura recomendada:**
- Home → enlaza a todas las páginas de servicio
- Cada página de servicio → enlaza a marcas relacionadas y artículos del blog
- Cada artículo del blog → enlaza a 2-3 páginas de servicio y a otros artículos
- Footer → enlaces a las páginas principales de servicio
- Agregar breadcrumbs (migas de pan) en todas las páginas internas: `Inicio > Servicios > Reparación de Neveras en Cali`

**Resultado esperado:** Google entiende la estructura del sitio y distribuye la autoridad entre páginas.

---

### Tarea 6.2 — Optimizar el botón "Hablar con IA"

**¿Qué hacer?**
Mantener el diferencial de IA pero sin que compita con el contacto directo.

**Detalles:**
- Renombrarlo a algo más claro: "Asistente Virtual" o "Diagnóstico Rápido con IA"
- Hacerlo secundario visualmente (el CTA principal debe ser "Solicitar Servicio" o "WhatsApp")
- Agregar un tooltip o microtexto que explique: "Nuestro asistente de IA te ayuda a identificar el problema antes de agendar"
- Considerar que funcione como un pre-diagnóstico que al final conecte con el formulario de solicitud

**Resultado esperado:** Los usuarios entienden la funcionalidad sin confusión y el flujo de conversión no se rompe.

---

### Tarea 6.3 — Implementar seguimiento con Google Analytics 4 y eventos

**¿Qué hacer?**
Instalar GA4 y configurar eventos de conversión para medir el rendimiento del sitio.

**Eventos a rastrear:**
- `formulario_iniciado` — cuando el usuario selecciona un electrodoméstico en el stepper
- `formulario_completado` — cuando envía la solicitud completa
- `click_whatsapp` — cuando hace clic en el enlace de WhatsApp
- `click_telefono` — cuando hace clic en el número de teléfono
- `click_hablar_ia` — cuando usa el asistente de IA
- `pagina_servicio_vista` — pageviews de páginas de servicio específicas
- `articulo_blog_leido` — pageviews de artículos del blog

**Resultado esperado:** Datos reales para tomar decisiones sobre qué funciona y qué mejorar.

---

### Tarea 6.4 — Hacer el sitio 100% responsive y PWA-ready

**¿Qué hacer?**
Verificar que toda la experiencia funcione perfectamente en móvil (80%+ del tráfico en Colombia es móvil).

**Detalles:**
- Probar cada nueva página en dispositivos de 360px, 390px y 414px de ancho
- Verificar que el formulario stepper funcione sin problemas en móvil
- Considerar agregar manifest.json para PWA (Progressive Web App) que permita "instalar" la app desde el navegador
- Asegurar que los botones de contacto (WhatsApp, teléfono) sean tipo `tel:` y `https://wa.me/` para apertura directa

**Resultado esperado:** Experiencia impecable en móvil, que es donde la mayoría de usuarios en Cali accederán.

---

## 📊 Resumen del Roadmap

| Fase | Plazo | Impacto SEO | Esfuerzo |
|------|-------|-------------|----------|
| 🔴 Fase 1 — SEO Técnico | Semana 1-2 | ⭐⭐⭐⭐⭐ | Medio |
| 🟠 Fase 2 — Páginas de Servicio | Semana 2-4 | ⭐⭐⭐⭐⭐ | Alto |
| 🟡 Fase 3 — Blog y Contenido | Semana 4-8 | ⭐⭐⭐⭐ | Alto |
| 🟢 Fase 4 — Confianza y Conversión | Semana 4-6 | ⭐⭐⭐ | Medio |
| 🔵 Fase 5 — SEO Local Avanzado | Semana 6-12 | ⭐⭐⭐⭐ | Medio |
| 🟣 Fase 6 — Mejoras UX | Semana 8-12 | ⭐⭐⭐ | Medio |

---

## ⚡ Las 5 acciones que más impacto tendrán (hacer primero)

1. **Google Business Profile completo con reseñas** — Gratis y con impacto inmediato en Google Maps
2. **Crear las 9 páginas de servicio individuales** — Multiplica x9 las keywords por las que puedes aparecer
3. **Schema markup LocalBusiness + FAQPage** — Rich snippets que te hacen destacar en resultados
4. **Publicar 5 artículos de blog** — Comienza a capturar tráfico informacional
5. **Meta tags optimizados en todas las páginas** — Mejora inmediata del CTR en resultados de búsqueda

---

> **Nota final:** Tu base técnica con Next.js es excelente y ya te da ventaja. La competencia en Cali está posicionada por antigüedad y volumen de contenido, no por calidad de sitio. Si ejecutas las Fases 1 y 2 en las próximas 4 semanas, verás resultados en Google en 2-3 meses. El SEO es una carrera de resistencia, no de velocidad.

*Documento generado para SomosTécnicos — Febrero 2026*
