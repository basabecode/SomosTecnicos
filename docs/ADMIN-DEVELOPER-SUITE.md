# Admin & Developer Suite - Documentación Completa

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Panel de Administración](#panel-de-administración)
4. [APIs y Endpoints](#apis-y-endpoints)
5. [Componentes Reutilizables](#componentes-reutilizables)
6. [Seguridad y Control de Acceso](#seguridad-y-control-de-acceso)
7. [Métricas y Analíticas](#métricas-y-analíticas)
8. [Guía de Desarrollo](#guía-de-desarrollo)

---

## Visión General

El **Admin & Developer Suite** es un conjunto de herramientas internas para la gestión, monitoreo y operación del sistema de servicio técnico SomosTécnicos. Proporciona interfaces administrativas, portales de desarrollo y consolas de operaciones.

### Estructura de Rutas

```
/admin              - Panel de Administración Principal
  /dashboard        - Vista general con estadísticas
  /orders           - Gestión de órdenes de servicio
  /technicians      - Gestión de técnicos
  /customers        - Gestión de clientes
  /reports          - Reportes y analíticas
  /messages         - Sistema de mensajería
  /assignments      - Asignaciones de técnicos
  /applications     - Solicitudes de técnicos
  /settings         - Configuración del sistema

/dev                - Portal de Desarrollo [PLANIFICADO]
  /docs             - Documentación técnica
  /api-explorer     - Explorador de APIs
  /code-browser     - Navegador de código

/ops                - Consola de Operaciones [PLANIFICADO]
  /health           - Estado del sistema
  /logs             - Visualizador de logs
  /incidents        - Gestión de incidentes
```

---

## Arquitectura del Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Dashboard                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Dashboard   │  │   Orders     │  │  Technicians │  │
│  │    Stats     │  │  Management  │  │  Management  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ /api/        │  │ /api/        │  │ /api/        │  │
│  │ dashboard/   │  │ orders/      │  │ technicians/ │  │
│  │ stats        │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer (Prisma)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Orders     │  │  Technicians │  │  Customers   │  │
│  │   Table      │  │    Table     │  │    Table     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Neon)
- **Autenticación**: JWT con contexto de autenticación
- **Estado**: React Hooks, Context API
- **Gráficos**: Recharts (para visualizaciones)

---

## Panel de Administración

### Dashboard Principal (`/admin/dashboard`)

El dashboard principal proporciona una vista general del sistema con métricas en tiempo real.

#### Componentes Principales

1. **DashboardStats** - Tarjetas de estadísticas principales
2. **RecentOrders** - Lista de órdenes recientes
3. **TechnicianStatus** - Estado de técnicos
4. **TechnicianAvailability** - Disponibilidad y asignación
5. **QuickActions** - Acciones rápidas
6. **SystemAlerts** - Alertas del sistema

#### Métricas Mostradas

| Métrica | Descripción | Actualización |
|---------|-------------|---------------|
| Total Órdenes | Histórico total de órdenes | En carga inicial |
| Pendientes | Órdenes sin asignar | Tiempo real |
| En Proceso | Órdenes en ejecución | Tiempo real |
| Completadas | Órdenes completadas este mes | Tiempo real |
| Técnicos Activos | Técnicos disponibles/total | Tiempo real |
| Órdenes Hoy | Completadas hoy | Tiempo real |
| Ingresos | Ingresos del mes actual | Diario |
| Tiempo Promedio | Tiempo promedio de resolución | Diario |

### Gestión de Órdenes (`/admin/orders`)

Sistema completo de gestión de órdenes de servicio.

#### Características

- **Vista de Lista**: Tabla con todas las órdenes
- **Vista de Calendario**: Visualización temporal
- **Filtros Avanzados**: Por estado, urgencia, ciudad, técnico
- **Búsqueda**: Por número de orden, cliente, dirección
- **Acciones en Masa**: Asignar, cancelar, exportar
- **Detalles de Orden**: Vista completa con historial

#### Estados de Orden

```typescript
enum OrderState {
  PENDIENTE = 'pendiente',
  ASIGNADO = 'asignado',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado'
}
```

### Gestión de Técnicos (`/admin/technicians`)

Administración completa del equipo de técnicos.

#### Características

- **Registro de Técnicos**: Formulario completo con validación
- **Gestión de Especialidades**: Asignación de habilidades
- **Control de Disponibilidad**: Horarios y zonas de cobertura
- **Historial de Rendimiento**: Órdenes completadas, calificaciones
- **Certificaciones**: Gestión de documentos y certificados
- **Asignación Inteligente**: Sugerencias basadas en ubicación y especialidad

### Reportes y Analíticas (`/admin/reports`)

Sistema de reportes con visualizaciones avanzadas.

#### Tipos de Reportes

1. **Reporte de Órdenes**
   - Órdenes por estado
   - Órdenes por ciudad
   - Órdenes por tipo de electrodoméstico
   - Tendencias temporales

2. **Reporte de Técnicos**
   - Rendimiento individual
   - Comparativa de equipo
   - Disponibilidad y utilización
   - Calificaciones promedio

3. **Reporte Financiero**
   - Ingresos por período
   - Ingresos por ciudad
   - Ingresos por tipo de servicio
   - Proyecciones

4. **Reporte de Satisfacción**
   - Calificaciones de clientes
   - Comentarios y feedback
   - NPS (Net Promoter Score)

---

## APIs y Endpoints

### Endpoint de Estadísticas del Dashboard

**GET** `/api/dashboard/stats`

Retorna todas las métricas principales del dashboard.

#### Autenticación

Requiere token JWT válido con rol de administrador.

```typescript
headers: {
  'Authorization': 'Bearer <token>'
}
```

#### Respuesta

```typescript
{
  success: true,
  data: {
    ordenes: {
      total: number
      pendientes: number
      asignadas: number
      enProceso: number
      completadasHoy: number
      completadasMes: number
      completadasSemana: number
      canceladas: number
      activas: number
      vencidas: number
      urgentes: number
    },
    tecnicos: {
      total: number
      activos: number
      disponibles: number
      ocupados: number
      enServicio: number
    },
    negocio: {
      ingresosMes: number
      tasaCompletacion: number
      tiempoPromedioResolucion: number
      satisfaccionPromedio: number
    },
    alertas: {
      ordenesVencidas: number
      ordenesUrgentes: number
      tecnicosSobrecargados: number
    },
    datosGraficos: {
      ordenesRecientes: Array<Order>
      mejoresTecnicos: Array<Technician>
    },
    ultimaActualizacion: Date
    periodo: {
      inicio: Date
      fin: Date
    }
  }
}
```

#### Optimización

- Todas las consultas se ejecutan en paralelo usando `Promise.all()`
- Índices en la base de datos para consultas frecuentes
- Caché de 30 segundos para reducir carga

### Endpoints de Órdenes

**GET** `/api/orders`
- Lista todas las órdenes con paginación
- Soporta filtros y búsqueda

**GET** `/api/orders/:id`
- Obtiene detalles de una orden específica

**POST** `/api/orders`
- Crea una nueva orden de servicio

**PATCH** `/api/orders/:id`
- Actualiza una orden existente

**DELETE** `/api/orders/:id`
- Cancela una orden (soft delete)

### Endpoints de Técnicos

**GET** `/api/technicians`
- Lista todos los técnicos

**GET** `/api/technicians/:id`
- Obtiene detalles de un técnico

**POST** `/api/technicians`
- Registra un nuevo técnico

**PATCH** `/api/technicians/:id`
- Actualiza información del técnico

**PATCH** `/api/technicians/:id/availability`
- Actualiza disponibilidad del técnico

---

## Componentes Reutilizables

### StatCard

Tarjeta de estadística con icono, valor y tendencia.

```typescript
interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  status?: 'good' | 'warning' | 'error'
  description?: string
}

<StatCard
  label="Órdenes Pendientes"
  value={42}
  icon={Clock}
  status="warning"
  description="Requieren asignación"
/>
```

### DataTable

Tabla de datos con paginación, ordenamiento y filtros.

```typescript
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  searchKey?: string
  filters?: FilterConfig[]
  pagination?: boolean
  pageSize?: number
}

<DataTable
  data={orders}
  columns={orderColumns}
  searchKey="orderNumber"
  filters={[
    { key: 'estado', label: 'Estado', options: orderStates },
    { key: 'urgencia', label: 'Urgencia', options: urgencyLevels }
  ]}
  pagination={true}
  pageSize={10}
/>
```

### LoadingState

Estados de carga consistentes.

```typescript
// Skeleton para tarjetas
<StatsLoading />

// Skeleton para tablas
<CardLoading />

// Spinner genérico
<LoadingSpinner size="lg" />
```

---

## Seguridad y Control de Acceso

### Roles de Usuario

```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',      // Acceso total
  ADMIN = 'admin',                   // Gestión general
  TECHNICIAN_MANAGER = 'technician_manager', // Gestión de técnicos
  CUSTOMER_SERVICE = 'customer_service',     // Atención al cliente
  TECHNICIAN = 'technician'          // Técnico de campo
}
```

### Protección de Rutas

Todas las rutas administrativas están protegidas con el componente `ProtectedRoute`:

```typescript
<ProtectedRoute requiredRoles={['super_admin', 'admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

### Middleware de Autenticación

```typescript
// lib/auth.ts
export const withAuth = (handler: Function, requiredRoles?: UserRole[]) => {
  return async (req: Request) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await verifyToken(token)

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    return handler(req, user)
  }
}
```

---

## Métricas y Analíticas

### Métricas de Rendimiento

El sistema recopila y muestra las siguientes métricas:

1. **Métricas de Órdenes**
   - Volumen total y por período
   - Distribución por estado
   - Tiempo promedio de resolución
   - Tasa de completación
   - Órdenes vencidas

2. **Métricas de Técnicos**
   - Utilización de capacidad
   - Órdenes completadas por técnico
   - Calificación promedio
   - Tiempo promedio de servicio
   - Disponibilidad

3. **Métricas de Negocio**
   - Ingresos totales y por período
   - Ticket promedio
   - Tasa de conversión
   - Satisfacción del cliente (NPS)
   - ROI por técnico

### Alertas del Sistema

El sistema genera alertas automáticas para:

- **Órdenes Pendientes**: Más de 3 días sin asignar
- **Órdenes Urgentes**: Prioridad alta sin atender
- **Órdenes Vencidas**: Exceden SLA
- **Técnicos Sobrecargados**: Más de 5 asignaciones activas
- **Baja Disponibilidad**: Menos del 30% de técnicos disponibles

---

## Guía de Desarrollo

### Agregar una Nueva Pestaña al Dashboard

1. **Crear el componente de la pestaña**

```typescript
// components/admin/new-tab.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NewTab() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/admin/new-endpoint')
      const result = await response.json()
      setData(result.data)
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Funcionalidad</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Contenido */}
      </CardContent>
    </Card>
  )
}
```

2. **Crear el endpoint de API**

```typescript
// app/api/admin/new-endpoint/route.ts
import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const GET = withAuth(async () => {
  const data = await prisma.yourModel.findMany()
  return NextResponse.json({ success: true, data })
}, ['admin', 'super_admin'])
```

3. **Agregar al dashboard**

```typescript
// app/(admin)/admin/dashboard/page.tsx
import { NewTab } from '@/components/admin/new-tab'

// Agregar al grid
<div className="grid gap-6">
  <NewTab />
</div>
```

### Mejores Prácticas

1. **Manejo de Errores**
   - Siempre usar try-catch en llamadas a API
   - Mostrar mensajes de error amigables
   - Registrar errores en el servidor

2. **Optimización de Rendimiento**
   - Usar `Suspense` para carga lazy
   - Implementar paginación en listas grandes
   - Cachear datos cuando sea apropiado
   - Usar `Promise.all()` para consultas paralelas

3. **Accesibilidad**
   - Usar etiquetas semánticas HTML
   - Proporcionar textos alternativos
   - Asegurar contraste de colores
   - Soportar navegación por teclado

4. **Responsive Design**
   - Mobile-first approach
   - Usar breakpoints de Tailwind
   - Probar en múltiples dispositivos
   - Optimizar touch targets

### Testing

```typescript
// __tests__/admin/dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { DashboardStats } from '@/components/admin/dashboard-stats'

describe('DashboardStats', () => {
  it('muestra las estadísticas correctamente', async () => {
    render(<DashboardStats />)

    await waitFor(() => {
      expect(screen.getByText('Total Órdenes')).toBeInTheDocument()
    })
  })
})
```

---

## Roadmap Futuro

### Fase 1: Mejoras Inmediatas ✅
- [x] Dashboard principal con métricas
- [x] Gestión de órdenes
- [x] Gestión de técnicos
- [x] Sistema de reportes básico
- [x] Autenticación y autorización

### Fase 2: Analíticas Avanzadas 🚧
- [ ] Gráficos interactivos con Recharts
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Dashboards personalizables
- [ ] Alertas configurables
- [ ] Notificaciones push

### Fase 3: Portal de Desarrollo 📋
- [ ] Documentación interactiva de APIs
- [ ] Explorador de endpoints
- [ ] Generador de código
- [ ] Sandbox de pruebas

### Fase 4: Consola de Operaciones 📋
- [ ] Monitoreo de salud del sistema
- [ ] Visualizador de logs en tiempo real
- [ ] Gestión de incidentes
- [ ] Métricas de infraestructura
- [ ] Alertas de sistema

---

## Soporte y Contribución

Para reportar problemas o sugerir mejoras:

1. Revisar la documentación existente
2. Verificar issues abiertos
3. Crear un nuevo issue con descripción detallada
4. Seguir las guías de contribución del proyecto

---

**Última actualización**: 2026-02-14
**Versión**: 1.0.0
**Mantenedor**: Equipo de Desarrollo SomosTécnicos
