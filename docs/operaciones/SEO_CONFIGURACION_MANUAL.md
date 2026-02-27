# SEO — Pasos de Configuración Manual

**Proyecto:** SomosTécnicos
**Fecha:** Febrero 2026
**Contexto:** Este documento cubre todas las acciones externas (fuera del código) que deben realizarse después del despliegue de las nuevas páginas de servicio y los schemas JSON-LD implementados en Febrero 2026.

---

## Resumen de lo Implementado (Código)

Para tener contexto, el código ya incluye:
- 9 páginas estáticas de servicio en `/servicios/[slug]-cali` con schemas `Service` + `BreadcrumbList` + `FAQPage`
- Hub `/servicios` con schema `ItemList`
- Páginas `/sobre-nosotros` y `/contacto` con schemas `Organization` y `LocalBusiness`
- `FAQPage` + `AggregateRating` + `WebSite` (SearchAction) en homepage
- Sitemap actualizado con 15 URLs
- Botón WhatsApp corregido con número real `+573003094854`

---

## 1. Google Search Console (PRIORITARIO)

### 1.1 Obtener Token de Verificación

1. Ir a [search.google.com/search-console](https://search.google.com/search-console)
2. Hacer clic en **"Agregar propiedad"**
3. Elegir tipo **"Prefijo de URL"** → ingresar `https://somostecnicos.com`
4. En los métodos de verificación, seleccionar **"Etiqueta HTML"**
5. Aparecerá un código como:
   ```html
   <meta name="google-site-verification" content="AbCdEfGhIjKlMnOpQrStUvWxYz1234567890" />
   ```
6. Copiar **únicamente el valor del atributo `content`** (sin comillas ni etiquetas)

### 1.2 Pegar el Token en el Código

Editar el archivo `app/layout.tsx` (línea ~96):

```typescript
// ANTES (placeholder):
verification: {
  google: 'verification_token', // Placeholder for user to fill
},

// DESPUÉS (token real):
verification: {
  google: 'AbCdEfGhIjKlMnOpQrStUvWxYz1234567890',
},
```

Hacer commit y deploy. Luego regresar a Search Console y hacer clic en **"Verificar"**.

### 1.3 Enviar el Sitemap

Después de que la verificación sea exitosa:

1. En Search Console, ir al menú lateral → **"Sitemaps"**
2. En el campo "Agregar nuevo sitemap", escribir: `sitemap.xml`
3. Hacer clic en **"Enviar"**
4. El estado debe cambiar a **"Correcto"** con 15 URLs detectadas

### 1.4 Solicitar Indexación de las Páginas Nuevas

Usar la herramienta **"Inspección de URL"** en este orden de prioridad:

| Orden | URL |
|-------|-----|
| 1 | `https://somostecnicos.com` (homepage) |
| 2 | `https://somostecnicos.com/servicios` |
| 3 | `https://somostecnicos.com/servicios/reparacion-neveras-cali` |
| 4 | `https://somostecnicos.com/servicios/reparacion-lavadoras-cali` |
| 5 | `https://somostecnicos.com/servicios/reparacion-calentadores-cali` |
| 6 | `https://somostecnicos.com/servicios/reparacion-estufas-hornos-cali` |
| 7 | `https://somostecnicos.com/servicios/reparacion-secadoras-cali` |
| 8 | `https://somostecnicos.com/servicios/electricista-a-domicilio-cali` |
| 9 | `https://somostecnicos.com/servicios/reparacion-televisores-cali` |
| 10 | `https://somostecnicos.com/servicios/tecnico-computadores-redes-cali` |
| 11 | `https://somostecnicos.com/servicios/camaras-seguridad-alarmas-cali` |
| 12 | `https://somostecnicos.com/contacto` |
| 13 | `https://somostecnicos.com/sobre-nosotros` |

Para cada URL:
1. Pegar la URL en la barra de "Inspección de URL"
2. Hacer clic en **"Solicitar indexación"**
3. Google procesa las solicitudes en horas/días — repetir para las 13 URLs

### 1.5 Configuración Regional

En Search Console → **"Configuración"** → **"Segmentación geográfica"**:
- Seleccionar país: **Colombia**

---

## 2. Google Business Profile (Mayor Impacto para Maps)

Google Business Profile es el factor #1 para aparecer en el paquete de 3 resultados locales de Google Maps ("Local Pack").

### 2.1 Reclamar o Crear el Perfil

1. Ir a [business.google.com](https://business.google.com)
2. Buscar "SomosTécnicos" — si ya existe un perfil sin reclamar, solicitarlo
3. Si no existe, hacer clic en **"Agregar tu negocio"**

### 2.2 Información del Perfil

Completar con exactamente estos datos para coincidir con el schema JSON-LD del sitio:

| Campo | Valor |
|-------|-------|
| **Nombre del negocio** | SomosTécnicos |
| **Categoría primaria** | Servicio de reparación de electrodomésticos |
| **Categorías secundarias** | Electricista, Reparación de computadoras, Proveedor de sistemas de seguridad |
| **Dirección** | Calle 3 # 72-45, Cali, Valle del Cauca |
| **Código postal** | 760006 |
| **Teléfono** | +57 300 3094854 |
| **Sitio web** | https://somostecnicos.com |
| **Horario** | Lunes a Sábado, 8:00 am – 6:00 pm |
| **Área de servicio** | Cali, Yumbo, Jamundí, Palmira, Candelaria |

### 2.3 Fotos (Mínimo 10)

Las fotos aumentan significativamente la visibilidad. Subir:
- Técnicos trabajando en reparaciones reales (3-4 fotos)
- Foto del logo/branding del negocio
- Imágenes de antes/después de reparaciones
- Foto del equipo de trabajo
- Imágenes de herramientas y equipos utilizados

Dimensiones recomendadas: 720×720 px mínimo, formato JPG o PNG.

### 2.4 Lista de Servicios

En el perfil → sección **"Servicios"**, agregar:

```
- Reparación de neveras y refrigeradores
- Reparación de lavadoras
- Reparación de secadoras
- Reparación de estufas y hornos
- Reparación de calentadores
- Reparación de televisores
- Electricista a domicilio
- Técnico en computadores y redes
- Instalación de cámaras de seguridad
```

### 2.5 Solicitar Reseñas

Las reseñas son el factor de ranking más importante en Maps. Estrategia:
1. Obtener el enlace directo de reseñas desde el perfil de GBP → **"Pedir opiniones"**
2. Enviar ese enlace por WhatsApp a cada cliente **al terminar un servicio satisfactorio**
3. Meta a corto plazo: **20+ reseñas con promedio ≥ 4.5 estrellas**

Mensaje sugerido para WhatsApp:
> "Hola [nombre], gracias por confiar en SomosTécnicos. Si quedaste satisfecho con el servicio, nos ayudaría mucho si dejas una reseña aquí: [enlace]. ¡Solo toma 1 minuto!"

---

## 3. Validación de Schemas JSON-LD (Post-Deploy)

Verificar que los schemas estén correctamente estructurados antes/después del deploy.

### 3.1 Rich Results Test

Herramienta: [search.google.com/test/rich-results](https://search.google.com/test/rich-results)

Páginas a probar:

| Página | Schema a validar |
|--------|-----------------|
| `https://somostecnicos.com` | FAQPage, LocalBusiness con AggregateRating |
| `https://somostecnicos.com/servicios/reparacion-neveras-cali` | FAQPage, Service, BreadcrumbList |
| `https://somostecnicos.com/servicios` | ItemList, BreadcrumbList |
| `https://somostecnicos.com/sobre-nosotros` | Organization |
| `https://somostecnicos.com/contacto` | LocalBusiness, ContactPoint |

**Resultados esperados:** Sin errores críticos. Advertencias menores son aceptables.

### 3.2 Schema Markup Validator

Herramienta: [validator.schema.org](https://validator.schema.org)

Pegar la URL de cada página. Verificar que no aparezcan errores en rojo.

### 3.3 PageSpeed Insights

Herramienta: [pagespeed.web.dev](https://pagespeed.web.dev)

Probar `https://somostecnicos.com` en modo **Mobile**.
Meta: **Score ≥ 85** en Performance.
Si el score es inferior, revisar principalmente:
- Imágenes sin optimizar en `/public/electrodomesticos/`
- Fonts bloqueantes
- JavaScript no utilizado

---

## 4. Monitoreo Continuo

### 4.1 Revisiones Semanales en Search Console

- **Cobertura:** Confirmar que las 15 URLs figuren como "Válidas"
- **Mejoras:** Revisar si los Rich Results (FAQ, Breadcrumbs) están siendo detectados
- **Rendimiento:** Monitorear impresiones y clics para las palabras clave objetivo

### 4.2 Palabras Clave Objetivo a Monitorear (SEranking)

| Palabra clave | Objetivo |
|---------------|----------|
| reparacion neveras cali | Top 10 |
| técnico lavadoras cali | Top 10 |
| reparación calentadores cali | Top 10 |
| electricista a domicilio cali | Top 15 |
| servicio técnico electrodomésticos cali | Top 10 |
| técnico computadores cali | Top 20 |

### 4.3 Acciones Mensuales

- Actualizar `lastModified` en `app/sitemap.ts` cuando se modifique contenido
- Agregar nuevas reseñas a `reviewCount` en el schema `AggregateRating` (en `app/(public)/page.tsx`)
- Revisar el informe de "Preguntas y respuestas" en GBP y responder las preguntas de usuarios

---

## 5. Consistencia NAP (Name, Address, Phone)

El nombre, dirección y teléfono deben ser **idénticos** en todas las plataformas. Verificar:

| Plataforma | Estado |
|------------|--------|
| Sitio web (schemas JSON-LD) | ✅ Configurado |
| Google Business Profile | ⏳ Pendiente configuración manual |
| Facebook | ⏳ Verificar coherencia |
| Instagram | ⏳ Verificar coherencia |
| Directorios locales (páginas amarillas, etc.) | ⏳ Opcional pero recomendado |

**Datos canónicos:**
- **Nombre:** SomosTécnicos
- **Dirección:** Calle 3 # 72-45, Cali, Valle del Cauca, CO 760006
- **Teléfono:** +57 300 3094854
- **Email:** soporte@somostecnicos.com

---

## Referencias

- [Google Search Console](https://search.google.com/search-console)
- [Google Business Profile](https://business.google.com)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [SEranking](https://seranking.com) — para monitoreo de posiciones
