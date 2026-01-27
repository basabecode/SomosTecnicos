<!-- NOTA: Este archivo es obsoleto. El proyecto se llamaba anteriormente "TecnoCity", ahora es "SomosTécnicos". -->
Eres un experto desarrollador frontend senior especializado en UX/UI y diseño responsive. Vas a mejorar un sitio web de servicios técnicos de electrodomésticos llamado "SomosTécnicos" (anteriormente "TecnoCity") que actualmente está en construcción.

## CARACTERÍSTICAS ACTUALES DEL PROYECTO

- Landing page de servicios técnicos para electrodomésticos
- Sistema de formularios para solicitud de servicios
- Chatbot con IA integrado
- Sistema de autenticación (login para cliente, técnico y admin)
- Secciones existentes: Hero, Marcas, Servicios, Grid de electrodomésticos, Formulario wizard, Consulta de estado, FAQ

## OBJETIVO PRINCIPAL

Implementar mejoras significativas de UX/UI siguiendo las mejores prácticas de diseño web 2025, manteniendo toda la funcionalidad existente y asegurando compatibilidad responsive perfecta para móviles, tablets y desktop.

ANÁLISIS CRÍTICO Y MEJORAS PRIORITARIAS
✅ LO QUE ESTÁ BIEN

Estructura clara y lógica de secciones
Buena selección de marcas reconocibles
Sistema de pasos visualizado (wizard)
Footer informativo.

PROBLEMAS CRÍTICOS A RESOLVER

1. HERO SECTION - Falta de Urgencia y Confianza
   Problemas:

No hay indicadores de confianza inmediatos (años de experiencia, técnicos certificados)
Falta call-to-action secundario (ej: llamada directa)
El texto es genérico sin diferenciadores.

recomendacion:
ANTES: "Reparamos tus Electrodomésticos a Domicilio"
DESPUÉS:

- Headline: "Solicitud Inteligente de Reparaciones de Electrodomesticos "
- Subheadline: "Tecnología que conecta clientes con técnicos en tiempo real, en toda Colombia"
- Trust indicators: "⭐ 4.8/5 en 100+ reparaciones | ✓ Garantía de 90 días"

Añadir:

Botón primario: "Solicitar Servicio Ahora" (redirije al formulario)
Botón secundario: "Chatbot IA" (más visible)
Badge de "Respuesta en menos de 15 minutos"

FORMULARIO - UX Problemático
Problemas detectados:

El wizard de 4 pasos intimida al usuario
Pedir todos los datos antes de saber el electrodoméstico es contraproducente
No hay indicador de progreso claro
Campos obligatorios no están bien marcados

Mejora propuesta basada en mejores prácticas:

NUEVO FLUJO OPTIMIZADO:

PASO 1 (Lo más importante):
┌─────────────────────────────────────┐
│ ¿Qué electrodoméstico necesitas │
│ reparar? │
│ │
│ [Iconos grandes clicables] │
│ Nevera | Lavadora | Estufa | calentador │ otros |
└─────────────────────────────────────┘

PASO 2 (Descripción rápida):
┌─────────────────────────────────────┐
│ Cuéntanos qué está fallando │
│ [Textarea con sugerencias AI] │
│ │
│ Ejemplo: "No enfría" "Hace ruido" │
└─────────────────────────────────────┘

PASO 3 (Contacto - solo 2 campos):
┌─────────────────────────────────────┐
│ Nombre y apellido: [_______________]
WhatsApp: [_______________] │
│ Dirección: [______________] │

│ ✓ Acepto términos │
│ │
│ [Solicitar Servicio →] │
└─────────────────────────────────────┘
Reducir fricción:

De 5 campos a 3 campos esenciales
Email opcional (la gente prefiere WhatsApp)
Autocompletar dirección con Google Places API

NUESTROS SERVICIOS" - Optimización Visual
Problema: Las 3 tarjetas son difíciles de escanear
Mejora:
Añadir diferenciación visual por color:

🔧 Solicita una Reparación
[Fondo azul]
"Agenda en 2 minutos"

📦 Solicita una Instalación
[Fondo verde]
"Instalación profesional garantizada"

🛠️ Solicita Mantenimiento
[Fondo naranja]
"Previene futuras averías"

todas al hacer click me debe llevar al formulario o crear un modal con los 3 pasos de solicitud de servicio.

MEJORAS DE DISEÑO VISUAL
Problemas de diseño actual:
❌ Mucho espacio en blanco desperdiciado
❌ Botones sin jerarquía clara
❌ No hay uso estratégico del color
❌ Tipografía sin contraste suficiente

Mejoras mobile críticas:

Botón de llamada sticky (siempre visible)
button del chatbot, para preguntas o solicitud de servicio.
Formulario: 1 columna, campos grandes (min 48px height)
Teclado numérico automático para teléfono
Autocompletar dirección con geolocalización
Menú hamburguesa limpio y accesible

estas son unas de las mejoras propuestas por mi, las que veas convenientes adicionales puedes proponerlas para su evaluacion y mejora del proyecto a nivel frontend , la idea del proyecto es que funcione como si el tecnico fuese un uber que es solicitado para ir a un domicilio a reparar un electrodomestico, y por ellos recibe un pago, una puntuacion y debe ofrecer una garantia de 3 meses
