# 🚀 03. ROADMAP Y PENDIENTES - Planificación 2026

Este documento detalla la visión estratégica a largo plazo y las tareas técnicas inmediatas para la evolución de la plataforma.

---

## 🎯 1. Overview Estratégico
El objetivo para 2026 es convertir **SomosTécnicos** en un ecosistema omnicanal con automatización avanzada, integración financiera y analítica predictiva.

### **Fases de Implementación:**
1. **Fase 1: Seguridad y Comunicación (Inmediata)**
   - Autenticación 2FA/MFA.
   - Integración real con SendGrid/Amazon SES.
   - WhatsApp Business API para alertas críticas.
2. **Fase 2: Automatización e IA**
   - Workflows automáticos post-servicio.
   - Chatbot con GPT-4 para diagnóstico remoto.
3. **Fase 3: Finanzas y CRM**
   - Gateway de pagos (PayU/Wompi).
   - Integración con CRM (HubSpot).
   - Programa de fidelización por puntos.

---

## 🟡 2. Tareas Pendientes Prioritarias

### **Sistema de Facturación Electrónica**
- [ ] **Backend API:** Crear endpoint `/api/invoices/generate`.
- [ ] **Generación PDF:** Sincronizar plantilla con datos reales de la orden.
- [ ] **Email Sender:** Configurar servicio para envío automático de factura al cliente.
- [ ] **UI Admin:** Botón "Generar Factura" en detalle de orden.
- [ ] **UI Cliente:** Sección "Mis Facturas" para descarga histórica.

### **Mejoras Geográficas (Google Maps)**
- [ ] Tracking de técnicos en tiempo real ("Su técnico llega en 15 min").
- [ ] Optimización de rutas para técnicos de campo.
- [ ] Visualización de densidad de servicios por zona.

---

## 🛠️ 3. Deuda Técnica a Resolver
1. **Migración Prisma:** Ejecutar `db push` final para sincronizar tabla de `customers` y `invoices`.
2. **Logger:** Sustituir todos los `console.log` por el logger centralizado en `lib/logger.ts`.
3. **Validaciones:** Asegurar que el 100% de los endpoints usen esquemas Zod.
4. **Performance:** Implementar caching con Redis para estadísticas pesadas del dashboard.

---

## 📅 4. Cronograma Trimestral (Q1 2026)
| Mes | Hito Principal | Estado |
|-----|----------------|--------|
| Enero | Consolidación de Notificaciones In-App | ✅ |
| Febrero | Lanzamiento Facturación Electrónica | ⏳ |
| Marzo | Integración CRM y Gateway de Pagos | 📅 |

---
_Documentación consolidada a partir de `ROADMAP_MEJORAS_2025.md` y `TAREAS_PENDIENTES_FACTURACION.md`._
