# 📝 Changelog - Enero 2026

## [2.2.0] - 2026-01-27

### ✨ Mejoras de Documentación y Rebranding

#### **Consolidación y Limpieza**
- ✅ **Documentación Maestra:** Reorganización completa de la base de conocimientos en documentos numerados (`01-04`) para facilitar la navegación.
- ✅ **Archivo Inteligente:** Reducción de más de 20 archivos dispersos a 3 listas consolidadas en `docs/archive/` (`lista_de_reportes.md`, `lista_de_tareas.md`, `lista_de_mejoras.md`).
- ✅ **README Unificado:** Fusión de información de múltiples READMEs en uno solo en la raíz del proyecto, eliminando redundancias.
- ✅ **Rebranding Final:** Completada la transición de marca de "TecnoCity" a "SomosTécnicos" en toda la documentación técnica y operativa.

#### **Operatividad y QA**
- ✅ **Guía de Acceso:** Actualizadas las credenciales de prueba y los flujos críticos de validación en `02-TESTING-Y-ACCESO.md`.
- ✅ ** Roadmap 2026:** Sincronización de tareas pendientes y visión futura en `03-ROADMAP-Y-PENDIENTES.md`.

---

## [2.1.0] - 2026-01-10

### ✨ Nuevas Características

#### **Sección de Proceso de Servicio**
- ✅ Nuevo componente `ServiceProcess` que explica el flujo completo del servicio
- ✅ 6 pasos detallados: Solicitud → Asignación → Confirmación → Diagnóstico → Cotización → Reparación
- ✅ Diseño premium con animaciones Framer Motion
- ✅ Integración de imágenes de técnicos (moto y van)
- ✅ Grid responsivo adaptable a todos los dispositivos
- ✅ Call-to-action con scroll suave al formulario
- ✅ Sección destacada explicando servicio a domicilio

#### **Mejoras en Registro de Usuarios**
- ✅ Diseño consistente con colores corporativos en ambas páginas de registro
- ✅ Botón "Volver al Inicio" agregado en páginas de registro
- ✅ Alineación corregida de indicadores de progreso
- ✅ Tipografía actualizada para coincidir con la página principal
- ✅ Colores actualizados: `#A50034` (primario), `#2C3E50` (secundario)

#### **Sistema de Carga de Documentos para Técnicos**
- ✅ Campo obligatorio de carga de archivo PDF en registro de técnicos
- ✅ Validación de tipo de archivo (solo PDF)
- ✅ Validación de tamaño máximo (1MB)
- ✅ Almacenamiento en `/public/uploads/technician-docs/`
- ✅ Indicador visual del archivo cargado
- ✅ Campo `documentosUrl` agregado al schema de Prisma
- ✅ API actualizada para manejar FormData multipart

#### **Asistente IA v2.1**
- ✅ Detección de "Instalación" y "Mantenimiento" como servicios
- ✅ Comunicación mejorada mediante eventos personalizados
- ✅ Pre-llenado automático del ServiceForm
- ✅ Cierre automático del chat después de transferir datos
- ✅ Salto automático al paso 3 del formulario (datos de contacto)

### 🔧 Mejoras Técnicas

#### **Base de Datos**
- ✅ Agregado campo `documentosUrl` al modelo `TechnicianApplication`
- ✅ Cliente de Prisma regenerado con nuevos tipos
- ✅ Migración pendiente: `npx prisma db push`

#### **API Endpoints**
- ✅ `/api/technician/apply` actualizado para manejar archivos
- ✅ Validaciones del lado del servidor para archivos PDF
- ✅ Almacenamiento seguro con nombres únicos (`{cedula}_{timestamp}.pdf`)

#### **Componentes**
- ✅ `service-process.tsx` - Nuevo componente del proceso de servicio
- ✅ `ai-chat.tsx` - Actualizado a v2.1 con mejoras de comunicación
- ✅ `service-form.tsx` - Listener de eventos para pre-llenado
- ✅ `register/customer/page.tsx` - Diseño actualizado
- ✅ `register/technician/page.tsx` - Diseño actualizado + carga de archivos

### 🎨 Mejoras de Diseño

#### **Sistema de Colores Corporativos**
- Primario: `#A50034` (rojo corporativo)
- Secundario: `#2C3E50` (gris oscuro)
- Texto: `#64748B` (gris medio)
- Éxito: `#27AE60` (verde)
- Fondo: Gradientes `from-[#F8F9FA] via-white to-[#E3F2FD]`

#### **Tipografía Consistente**
- Títulos: `text-4xl sm:text-5xl font-extrabold tracking-tight`
- Subtítulos: `text-lg text-[#64748B]`
- Botones: `rounded-xl shadow-lg hover:shadow-xl`

### 🐛 Correcciones

- ✅ Alineación de indicadores de progreso en formularios de registro
- ✅ Error de TypeScript en `documentosUrl` resuelto con spread operator
- ✅ Eliminadas referencias a "tracking en tiempo real" y "modelo tipo Uber"
- ✅ Eliminadas opciones de ubicación y tracking del panel de técnicos

### 📚 Documentación

- ✅ README.md actualizado con nuevas características
- ✅ Changelog creado con historial de cambios
- ✅ Comentarios mejorados en componentes clave

---

## [2.0.0] - Versiones Anteriores

Ver historial de commits para cambios anteriores a enero 2026.

---

## 🚀 Próximas Características Planificadas

- [ ] Migración de base de datos para campo `documentosUrl`
- [ ] Panel de administración para revisar documentos de técnicos
- [ ] Sistema de aprobación/rechazo de solicitudes con visualización de PDFs
- [ ] Notificaciones en tiempo real para nuevas solicitudes
- [ ] Dashboard mejorado con métricas de solicitudes

---

**Última actualización**: 10 de enero de 2026
