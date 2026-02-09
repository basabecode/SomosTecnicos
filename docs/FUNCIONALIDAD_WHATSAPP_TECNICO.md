# Funcionalidad de WhatsApp - Portal Técnico
**Fecha de implementación:** 2026-02-08
**Ubicación:** Portal Técnico > Mis Asignaciones

---

## 🎯 Objetivo

Permitir a los técnicos enviar mensajes de WhatsApp rápidamente a los clientes desde la página de asignaciones, facilitando la comunicación y coordinación de servicios.

---

## ✅ Implementación

### Ubicación del Botón
**Archivo:** `app/(technician)/technician/assignments/page.tsx`

El botón de WhatsApp se encuentra entre los botones de **"Llamar"** y **"Navegar"** en cada tarjeta de asignación.

### Código Implementado

```tsx
<Button
  variant="outline"
  size="sm"
  className="flex-1 min-w-[120px] active-tap border-green-500 text-green-600 hover:bg-green-50"
  asChild
>
  <a
    href={`https://wa.me/${assignment.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${assignment.clientName}, soy su técnico de SomosTécnicos. Me comunico con usted para coordinar el servicio de ${assignment.serviceType} programado para hoy.`)}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <MessageCircle className="w-4 h-4 mr-1.5" />
    WhatsApp
  </a>
</Button>
```

---

## 📱 Funcionalidad

### 1. **Formato del Número de Teléfono**
```tsx
assignment.clientPhone.replace(/\D/g, '')
```
- Elimina todos los caracteres no numéricos (espacios, guiones, paréntesis)
- Ejemplo: `"(321) 456-7890"` → `"3214567890"`
- Compatible con formato internacional

### 2. **Mensaje Pre-llenado**
El mensaje se genera dinámicamente con:
- ✅ **Nombre del cliente:** Personalización
- ✅ **Nombre de la empresa:** "SomosTécnicos"
- ✅ **Tipo de servicio:** Contexto específico
- ✅ **Referencia temporal:** "programado para hoy"

**Ejemplo de mensaje:**
```
Hola Juan Pérez, soy su técnico de SomosTécnicos. Me comunico con usted para coordinar el servicio de Reparación de Lavadora programado para hoy.
```

### 3. **URL de WhatsApp**
```
https://wa.me/{NUMERO}?text={MENSAJE_CODIFICADO}
```

**Componentes:**
- `wa.me/` - Servicio de WhatsApp Web/API
- `{NUMERO}` - Número sin caracteres especiales
- `?text=` - Parámetro para mensaje pre-llenado
- `encodeURIComponent()` - Codifica el mensaje para URL

---

## 🎨 Diseño Visual

### Estilo del Botón
```tsx
className="flex-1 min-w-[120px] active-tap border-green-500 text-green-600 hover:bg-green-50"
```

**Características:**
- ✅ **Color verde:** Asociado con WhatsApp (brand color)
- ✅ **Borde verde:** `border-green-500`
- ✅ **Texto verde:** `text-green-600`
- ✅ **Hover verde claro:** `hover:bg-green-50`
- ✅ **Responsive:** `flex-1 min-w-[120px]`
- ✅ **Feedback táctil:** `active-tap`

### Icono
```tsx
<MessageCircle className="w-4 h-4 mr-1.5" />
```
- Icono de Lucide React
- Tamaño: 16x16px
- Margen derecho: 6px

---

## 📊 Orden de Botones

En cada tarjeta de asignación, los botones aparecen en este orden:

1. **Detalles** (gris/secundario)
2. **Llamar** (verde claro) - `tel:`
3. **WhatsApp** (verde) - `wa.me/` ← **NUEVO**
4. **Navegar** (outline) - Google Maps
5. **Iniciar Servicio** (verde oscuro) - Solo si status = 'assigned'
6. **Completar Servicio** (rojo) - Solo si status = 'in_progress'

---

## 🔧 Comportamiento Técnico

### Desktop
1. Click en el botón
2. Abre WhatsApp Web en nueva pestaña
3. Muestra el chat con el cliente
4. Mensaje pre-llenado en el campo de texto
5. Técnico puede editar o enviar directamente

### Mobile (Android/iOS)
1. Click en el botón
2. Intenta abrir la **app de WhatsApp** (si está instalada)
3. Si no está instalada, abre WhatsApp Web
4. Muestra el chat con el cliente
5. Mensaje pre-llenado listo para enviar

---

## 🌍 Compatibilidad Internacional

### Formato de Número
El código elimina caracteres no numéricos, por lo que soporta:

✅ **Colombia:** `+57 321 456 7890` → `573214567890`
✅ **México:** `+52 55 1234 5678` → `525512345678`
✅ **USA:** `+1 (321) 456-7890` → `13214567890`
✅ **España:** `+34 612 345 678` → `34612345678`

**Importante:** El número debe estar guardado en la base de datos con el código de país (+57 para Colombia).

---

## ✅ Ventajas para el Técnico

1. **Comunicación rápida:** Un solo click para contactar al cliente
2. **Mensaje profesional:** Plantilla pre-escrita y personalizada
3. **Contexto claro:** Incluye tipo de servicio y referencia temporal
4. **Historial:** Conversación guardada en WhatsApp
5. **Multimedia:** Puede enviar fotos, ubicación, documentos
6. **Confirmación:** Cliente puede responder y confirmar

---

## 📋 Casos de Uso

### 1. **Confirmación de Llegada**
```
Técnico: [Click en WhatsApp]
Mensaje: "Hola María García, soy su técnico de SomosTécnicos.
         Me comunico con usted para coordinar el servicio de
         Instalación de Aire Acondicionado programado para hoy."

Cliente: "Perfecto, lo espero a las 2pm"
```

### 2. **Retraso o Cambio de Hora**
```
Técnico: [Edita mensaje]
Mensaje: "Hola Juan, soy su técnico de SomosTécnicos.
         Voy con 15 minutos de retraso por el tráfico.
         Llegaré aproximadamente a las 10:15am."
```

### 3. **Solicitud de Información**
```
Técnico: [Edita mensaje]
Mensaje: "Hola Ana, necesito confirmar el modelo exacto
         de su refrigerador para traer el repuesto correcto."
```

### 4. **Envío de Ubicación**
```
Técnico: [Abre chat]
Cliente: "No encuentro su dirección"
Técnico: [Envía ubicación en tiempo real desde WhatsApp]
```

---

## 🔒 Seguridad y Privacidad

### Buenas Prácticas Implementadas

1. ✅ **`target="_blank"`** - Abre en nueva pestaña
2. ✅ **`rel="noopener noreferrer"`** - Previene ataques de phishing
3. ✅ **`encodeURIComponent()`** - Previene inyección de código
4. ✅ **Validación de número** - Elimina caracteres no válidos

### Datos Utilizados
- ✅ Nombre del cliente (público)
- ✅ Número de teléfono (ya registrado)
- ✅ Tipo de servicio (contexto del trabajo)
- ❌ NO se comparte información sensible

---

## 🎯 Métricas de Éxito

### KPIs a Monitorear
1. **Tasa de uso:** % de técnicos que usan WhatsApp vs llamada
2. **Tiempo de respuesta:** Tiempo promedio de respuesta del cliente
3. **Confirmaciones:** % de servicios confirmados vía WhatsApp
4. **Satisfacción:** Feedback de técnicos sobre la funcionalidad

---

## 🚀 Mejoras Futuras Sugeridas

### 1. **Plantillas Personalizables**
Permitir al técnico elegir entre diferentes mensajes:
- "Estoy en camino"
- "He llegado"
- "Servicio completado"
- "Necesito información adicional"

### 2. **Detección de Hora**
Ajustar el mensaje según la hora del día:
- Mañana: "Buenos días..."
- Tarde: "Buenas tardes..."
- Noche: "Buenas noches..."

### 3. **Integración con Estado**
Cambiar el mensaje según el estado del servicio:
- `assigned`: "para coordinar el servicio"
- `in_progress`: "estoy realizando el servicio"
- `completed`: "he completado el servicio"

### 4. **Historial de Mensajes**
Guardar en la base de datos cuándo se envió un mensaje de WhatsApp.

### 5. **Análisis de Respuestas**
Integrar webhook de WhatsApp Business API para recibir respuestas.

---

## 📱 Ejemplo de Flujo Completo

```
1. Técnico abre "Mis Asignaciones"
2. Ve la tarjeta del servicio programado
3. Click en botón "WhatsApp" (verde)
4. Se abre WhatsApp con mensaje pre-llenado:
   "Hola Carlos Rodríguez, soy su técnico de SomosTécnicos.
    Me comunico con usted para coordinar el servicio de
    Reparación de Nevera programado para hoy."
5. Técnico puede:
   - Enviar el mensaje tal cual
   - Editarlo antes de enviar
   - Agregar información adicional
6. Cliente recibe el mensaje
7. Cliente responde confirmando o solicitando cambios
8. Técnico coordina directamente por WhatsApp
```

---

## 🔗 Referencias Técnicas

### WhatsApp URL Scheme
- **Documentación oficial:** https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat
- **Formato:** `https://wa.me/<number>?text=<message>`
- **Límite de caracteres:** 2048 caracteres en el mensaje

### Códigos de País (Colombia)
- **Código:** +57
- **Formato local:** 10 dígitos (ej: 321 456 7890)
- **Formato internacional:** +57 321 456 7890

---

## ✅ Checklist de Implementación

- [x] Importar icono `MessageCircle` de lucide-react
- [x] Crear botón con estilos de WhatsApp (verde)
- [x] Implementar URL `wa.me/` con número limpio
- [x] Agregar mensaje pre-llenado personalizado
- [x] Incluir nombre del cliente
- [x] Incluir tipo de servicio
- [x] Codificar mensaje con `encodeURIComponent()`
- [x] Agregar `target="_blank"` y `rel="noopener noreferrer"`
- [x] Posicionar entre "Llamar" y "Navegar"
- [x] Aplicar clases responsive (`flex-1 min-w-[120px]`)
- [x] Agregar feedback táctil (`active-tap`)

---

## 📄 Conclusión

La funcionalidad de WhatsApp ha sido implementada exitosamente en la página de **Mis Asignaciones** del portal técnico. Los técnicos ahora pueden:

✅ Contactar rápidamente a los clientes
✅ Enviar mensajes profesionales y personalizados
✅ Coordinar servicios de manera eficiente
✅ Mantener historial de comunicaciones
✅ Compartir multimedia (fotos, ubicación, etc.)

Esta mejora optimiza la comunicación técnico-cliente y mejora la experiencia general del servicio.
