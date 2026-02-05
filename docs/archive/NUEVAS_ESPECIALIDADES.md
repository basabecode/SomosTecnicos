#Expansión de Servicios Técnicos Especializados

---

## 🎭 ROL DEL AGENTE

Eres un **Desarrollador Full-Stack Senior especializado en React/TypeScript** con experiencia en arquitectura de componentes escalables y sistemas de servicios. Tu responsabilidad es expandir la plataforma SomosTécnicos para incluir nuevas categorías de servicios técnicos especializados, manteniendo la coherencia del código, el diseño existente y todas las funcionalidades actuales.

---

## 🎯 OBJETIVO PRINCIPAL

Implementar una nueva sección de servicios llamada **"Agenda tu Técnico Especialista"** que permita a los usuarios agendar técnicos especializados en tres nuevas áreas (Electricidad, Computación y Redes, Seguridad Electrónica), replicando completamente la funcionalidad, diseño y experiencia de usuario del sistema actual de "Electrodomésticos", pero adaptado a estas nuevas especialidades.

---

## 📋 CONTEXTO DEL PROYECTO

### Estado Actual
- **Componente Base**: `service-form.tsx` - Formulario de agendamiento para técnicos de electrodomésticos
- **Funcionalidades Existentes**:
  - Formulario de solicitud de servicio
  - Selección de tipo de servicio
  - Selección de fecha y hora
  - Asignación de técnicos disponibles
  - Validación de campos
  - Integración con backend/API
  - Notificaciones y confirmaciones
  - Diseño responsivo y accesible

### Nuevas Especialidades a Implementar

1. **Electricidad**
   - Servicios: Instalaciones eléctricas, reparación de tableros, cableado, iluminación, etc.
   - Imagen: `public/especialidad/electricidad.png` (o .jpg)

2. **Computación y Redes**
   - Servicios: Soporte técnico PC/Mac, instalación de redes, configuración servidores, cableado estructurado, etc.
   - Imagen: `public/especialidad/computacion-redes.png` (o .jpg)

3. **Seguridad Electrónica**
   - Servicios: Instalación de cámaras, alarmas, control de acceso, CCTV, domótica, etc.
   - Imagen: `public/especialidad/seguridad-electronica.png` (o .jpg)

---

## 📝 TAREAS A REALIZAR (EJECUCIÓN SECUENCIAL)

### FASE 1: ANÁLISIS Y PREPARACIÓN

#### Tarea 1.1: Análisis del Componente Base
```
ACCIÓN: Revisar completamente el archivo service-form.tsx
UBICACIÓN: [RUTA_DEL_PROYECTO]/components/service-form.tsx

ANALIZAR:
- ✅ Estructura del componente (hooks, states, props)
- ✅ Lógica de negocio implementada
- ✅ Validaciones de formulario
- ✅ Integración con API/backend
- ✅ Manejo de estados (loading, error, success)
- ✅ Dependencias y librerías utilizadas
- ✅ Estilos aplicados (CSS modules, Tailwind, styled-components, etc.)
- ✅ Props drilling y context usage
- ✅ Funciones de utilidad asociadas
- ✅ Tipos TypeScript definidos

ENTREGABLE: Documento de análisis con estructura completa del componente
```

#### Tarea 1.2: Mapeo de Dependencias
```
ACCIÓN: Identificar todos los archivos relacionados con service-form.tsx

BUSCAR EN:
- /components/ (componentes hijos o relacionados)
- /types/ o /interfaces/ (tipos TypeScript)
- /services/ o /api/ (llamadas al backend)
- /utils/ (funciones auxiliares)
- /hooks/ (custom hooks)
- /constants/ (constantes y enums)
- /context/ (context providers)
- /store/ o /redux/ (estado global)
- /styles/ (archivos de estilos)
- /lib/ (librerías y configuraciones)

CREAR LISTA:
- Archivos que deben ser modificados
- Archivos que deben ser duplicados
- Nuevos archivos que deben crearse

ENTREGABLE: Diagrama de dependencias completo
```

#### Tarea 1.3: Preparar Assets
```
ACCIÓN: Verificar y preparar imágenes de especialidades

VERIFICAR EN: public/especialidad/

ARCHIVOS ESPERADOS:
- electricidad.png (o .jpg, .svg, .webp)
- computacion-redes.png
- seguridad-electronica.png

ESPECIFICACIONES:
- Tamaño recomendado: [DEFINIR según diseño actual]
- Formato: PNG o WebP para transparencias
- Optimización: Comprimir para web (< 200KB por imagen)
- Dimensiones consistentes entre todas las imágenes

SI NO EXISTEN:
- Solicitar las imágenes al equipo de diseño
- O crear placeholders temporales
- Documentar dimensiones exactas requeridas

ENTREGABLE: Imágenes optimizadas en la carpeta correcta
```

---

### FASE 2: ARQUITECTURA Y DISEÑO DE CÓDIGO

#### Tarea 2.1: Diseñar Estructura de Tipos
```
ACCIÓN: Crear/actualizar tipos TypeScript para las nuevas especialidades

ARCHIVO: types/services.ts (o similar)

TIPOS A DEFINIR/ACTUALIZAR:

// Enum de especialidades
export enum ServiceCategory {
  ELECTRODOMESTICOS = 'electrodomesticos',
  ELECTRICIDAD = 'electricidad',
  COMPUTACION_REDES = 'computacion_redes',
  SEGURIDAD_ELECTRONICA = 'seguridad_electronica'
}

// Tipos de servicios por especialidad
export type ElectricidadService =
  | 'instalacion_electrica'
  | 'reparacion_tableros'
  | 'cableado'
  | 'iluminacion'
  | 'otros_electricidad';

export type ComputacionRedesService =
  | 'soporte_tecnico'
  | 'instalacion_redes'
  | 'configuracion_servidores'
  | 'cableado_estructurado'
  | 'otros_computacion';

export type SeguridadElectronicaService =
  | 'instalacion_camaras'
  | 'sistemas_alarma'
  | 'control_acceso'
  | 'cctv'
  | 'domotica'
  | 'otros_seguridad';

// Interface principal de servicio
export interface ServiceRequest {
  id?: string;
  category: ServiceCategory;
  serviceType: string;
  scheduledDate: Date;
  scheduledTime: string;
  customerInfo: CustomerInfo;
  address: Address;
  description: string;
  technicianId?: string;
  status: ServiceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Configuración de especialidades
export interface SpecialtyConfig {
  id: ServiceCategory;
  name: string;
  title: string;
  description: string;
  imagePath: string;
  services: {
    value: string;
    label: string;
    description?: string;
  }[];
  color: string; // Color temático de la especialidad
  icon?: string; // Icono opcional
}

ENTREGABLE: Archivo de tipos completo y documentado
```

#### Tarea 2.2: Crear Constantes de Configuración
```
ACCIÓN: Definir configuración de especialidades

ARCHIVO: constants/specialties.ts

CONTENIDO:

import { SpecialtyConfig, ServiceCategory } from '@/types/services';

export const SPECIALTIES_CONFIG: Record<ServiceCategory, SpecialtyConfig> = {
  [ServiceCategory.ELECTRODOMESTICOS]: {
    id: ServiceCategory.ELECTRODOMESTICOS,
    name: 'Electrodomésticos',
    title: 'Agenda tu Técnico de Electrodomésticos',
    description: 'Reparación y mantenimiento de electrodomésticos',
    imagePath: '/especialidad/electrodomesticos.png',
    services: [
      { value: 'lavadora', label: 'Lavadora', description: 'Reparación de lavadoras' },
      { value: 'nevera', label: 'Nevera', description: 'Reparación de neveras' },
      // ... más servicios
    ],
    color: '#991B1B' // Rojo corporativo
  },

  [ServiceCategory.ELECTRICIDAD]: {
    id: ServiceCategory.ELECTRICIDAD,
    name: 'Electricidad',
    title: 'Agenda tu Técnico Especialista en Electricidad',
    description: 'Instalaciones y reparaciones eléctricas profesionales',
    imagePath: '/especialidad/electricidad.png',
    services: [
      { value: 'instalacion_electrica', label: 'Instalación Eléctrica', description: 'Instalaciones residenciales y comerciales' },
      { value: 'reparacion_tableros', label: 'Reparación de Tableros', description: 'Mantenimiento y reparación de tableros eléctricos' },
      { value: 'cableado', label: 'Cableado', description: 'Instalación y reparación de cableado' },
      { value: 'iluminacion', label: 'Iluminación', description: 'Instalación de sistemas de iluminación' },
      { value: 'otros_electricidad', label: 'Otros Servicios Eléctricos' }
    ],
    color: '#F59E0B', // Amarillo/naranja (electricidad)
    icon: 'zap'
  },

  [ServiceCategory.COMPUTACION_REDES]: {
    id: ServiceCategory.COMPUTACION_REDES,
    name: 'Computación y Redes',
    title: 'Agenda tu Técnico Especialista en Computación y Redes',
    description: 'Soporte técnico, redes e infraestructura IT',
    imagePath: '/especialidad/computacion-redes.png',
    services: [
      { value: 'soporte_tecnico', label: 'Soporte Técnico PC/Mac', description: 'Reparación y mantenimiento de computadoras' },
      { value: 'instalacion_redes', label: 'Instalación de Redes', description: 'Configuración de redes LAN/WiFi' },
      { value: 'configuracion_servidores', label: 'Configuración de Servidores', description: 'Setup y mantenimiento de servidores' },
      { value: 'cableado_estructurado', label: 'Cableado Estructurado', description: 'Instalación de cableado de red' },
      { value: 'otros_computacion', label: 'Otros Servicios IT' }
    ],
    color: '#3B82F6', // Azul (tecnología)
    icon: 'cpu'
  },

  [ServiceCategory.SEGURIDAD_ELECTRONICA]: {
    id: ServiceCategory.SEGURIDAD_ELECTRONICA,
    name: 'Seguridad Electrónica',
    title: 'Agenda tu Técnico Especialista en Seguridad Electrónica',
    description: 'Sistemas de seguridad, cámaras y control de acceso',
    imagePath: '/especialidad/seguridad-electronica.png',
    services: [
      { value: 'instalacion_camaras', label: 'Instalación de Cámaras', description: 'Sistemas de videovigilancia' },
      { value: 'sistemas_alarma', label: 'Sistemas de Alarma', description: 'Alarmas residenciales y comerciales' },
      { value: 'control_acceso', label: 'Control de Acceso', description: 'Sistemas biométricos y de acceso' },
      { value: 'cctv', label: 'CCTV', description: 'Circuito cerrado de televisión' },
      { value: 'domotica', label: 'Domótica', description: 'Automatización del hogar' },
      { value: 'otros_seguridad', label: 'Otros Servicios de Seguridad' }
    ],
    color: '#10B981', // Verde (seguridad)
    icon: 'shield'
  }
};

// Función helper para obtener configuración
export const getSpecialtyConfig = (category: ServiceCategory): SpecialtyConfig => {
  return SPECIALTIES_CONFIG[category];
};

// Lista de todas las especialidades para navegación
export const ALL_SPECIALTIES = Object.values(SPECIALTIES_CONFIG);

ENTREGABLE: Archivo de constantes completo
```

#### Tarea 2.3: Diseñar Arquitectura de Componentes
```
ACCIÓN: Definir estructura de componentes reutilizables

ESTRUCTURA PROPUESTA:

components/
├── services/
│   ├── ServiceForm.tsx (componente genérico refactorizado)
│   ├── SpecialtySelector.tsx (selector de especialidades)
│   ├── ServiceTypeSelector.tsx (selector de tipo de servicio)
│   ├── TechnicianScheduler.tsx (agendamiento)
│   ├── ServiceFormFields.tsx (campos del formulario)
│   └── ServiceSummary.tsx (resumen de solicitud)
│
├── specialty-sections/
│   ├── ElectrodomesticosSection.tsx
│   ├── ElectricidadSection.tsx
│   ├── ComputacionRedesSection.tsx
│   └── SeguridadElectronicaSection.tsx
│
└── shared/
    ├── SpecialtyCard.tsx (tarjeta de especialidad)
    └── ServiceCard.tsx (tarjeta de servicio)

PRINCIPIO DE DISEÑO:
- Componente ServiceForm.tsx debe ser GENÉRICO y recibir la configuración por props
- Cada sección de especialidad es un wrapper que pasa la configuración específica
- Máxima reutilización de código
- Componentes atómicos y componibles

ENTREGABLE: Diagrama de arquitectura de componentes
```

---

### FASE 3: REFACTORIZACIÓN DEL COMPONENTE BASE

#### Tarea 3.1: Refactorizar service-form.tsx a Componente Genérico
```
ACCIÓN: Convertir service-form.tsx en un componente reutilizable

ARCHIVO: components/services/ServiceForm.tsx

CAMBIOS REQUERIDOS:

1. CONVERTIR DE ESPECÍFICO A GENÉRICO:

// ANTES (específico para electrodomésticos)
const ServiceForm = () => {
  const [serviceType, setServiceType] = useState('lavadora');
  const services = ['lavadora', 'nevera', 'estufa'];
  // ... lógica hardcodeada
}

// DESPUÉS (genérico para cualquier especialidad)
interface ServiceFormProps {
  specialty: ServiceCategory;
  config: SpecialtyConfig;
  onSubmit?: (data: ServiceRequest) => Promise<void>;
  className?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  specialty,
  config,
  onSubmit,
  className
}) => {
  const [serviceType, setServiceType] = useState(config.services[0]?.value);
  const services = config.services;
  // ... lógica genérica basada en config
}

2. EXTRAER VALORES HARDCODEADOS:
- Reemplazar textos fijos con config.title, config.description
- Reemplazar lista de servicios con config.services
- Reemplazar rutas de imágenes con config.imagePath
- Reemplazar colores con config.color

3. MANTENER TODA LA FUNCIONALIDAD:
- ✅ Validaciones de formulario
- ✅ Llamadas a API
- ✅ Manejo de estados (loading, error, success)
- ✅ Formato de fechas y horas
- ✅ Selección de técnicos disponibles
- ✅ Notificaciones y confirmaciones
- ✅ Navegación post-submit
- ✅ Diseño responsivo

4. MEJORAR TIPADO TYPESCRIPT:
- Props bien tipadas
- Estados tipados correctamente
- Handlers con tipos específicos
- Return types explícitos

ENTREGABLE: ServiceForm.tsx refactorizado y genérico
```

#### Tarea 3.2: Crear Wrapper Components para Cada Especialidad
```
ACCIÓN: Crear componentes wrapper específicos

ARCHIVOS A CREAR:

1. components/specialty-sections/ElectrodomesticosSection.tsx
--------------------------------------------------------------
import ServiceForm from '@/components/services/ServiceForm';
import { ServiceCategory } from '@/types/services';
import { getSpecialtyConfig } from '@/constants/specialties';

export default function ElectrodomesticosSection() {
  const config = getSpecialtyConfig(ServiceCategory.ELECTRODOMESTICOS);

  const handleSubmit = async (data: ServiceRequest) => {
    // Lógica específica si es necesaria
    console.log('Electrodomésticos service request:', data);
    // Llamada a API específica o genérica
  };

  return (
    <section id="electrodomesticos" className="py-16">
      <ServiceForm
        specialty={ServiceCategory.ELECTRODOMESTICOS}
        config={config}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

2. components/specialty-sections/ElectricidadSection.tsx
---------------------------------------------------------
import ServiceForm from '@/components/services/ServiceForm';
import { ServiceCategory } from '@/types/services';
import { getSpecialtyConfig } from '@/constants/specialties';

export default function ElectricidadSection() {
  const config = getSpecialtyConfig(ServiceCategory.ELECTRICIDAD);

  const handleSubmit = async (data: ServiceRequest) => {
    console.log('Electricidad service request:', data);
  };

  return (
    <section id="electricidad" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {config.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        <ServiceForm
          specialty={ServiceCategory.ELECTRICIDAD}
          config={config}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}

3. components/specialty-sections/ComputacionRedesSection.tsx
-------------------------------------------------------------
[SIMILAR ESTRUCTURA, cambiar specialty y config]

4. components/specialty-sections/SeguridadElectronicaSection.tsx
-----------------------------------------------------------------
[SIMILAR ESTRUCTURA, cambiar specialty y config]

NOTA: Cada sección puede tener diseño ligeramente diferente (bg-gray-50, bg-white alternados)
      pero el componente ServiceForm debe ser idéntico

ENTREGABLE: 4 archivos de secciones de especialidad
```

---

### FASE 4: ACTUALIZACIÓN DE SERVICIOS Y API

#### Tarea 4.1: Actualizar Llamadas al Backend
```
ACCIÓN: Modificar servicios de API para soportar múltiples especialidades

ARCHIVO: services/api/serviceRequests.ts (o similar)

ACTUALIZAR:

// ANTES
export const createServiceRequest = async (data: any) => {
  return await api.post('/api/services', {
    ...data,
    category: 'electrodomesticos' // Hardcodeado
  });
};

// DESPUÉS
export const createServiceRequest = async (data: ServiceRequest) => {
  return await api.post('/api/services', {
    ...data,
    category: data.category // Dinámico
  });
};

// Agregar función para obtener técnicos por especialidad
export const getAvailableTechnicians = async (
  category: ServiceCategory,
  date: string,
  time: string
) => {
  return await api.get('/api/technicians/available', {
    params: { category, date, time }
  });
};

// Función genérica para crear solicitud de servicio
export const submitServiceRequest = async (
  request: ServiceRequest
): Promise<ApiResponse<ServiceRequest>> => {
  try {
    const response = await api.post('/api/services/request', request);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

ENTREGABLE: Archivo de API actualizado
```

#### Tarea 4.2: Crear Custom Hooks
```
ACCIÓN: Crear hooks reutilizables para manejo de servicios

ARCHIVO: hooks/useServiceForm.ts

CONTENIDO:

import { useState } from 'react';
import { ServiceRequest, ServiceCategory } from '@/types/services';
import { submitServiceRequest } from '@/services/api/serviceRequests';

interface UseServiceFormProps {
  specialty: ServiceCategory;
  onSuccess?: (data: ServiceRequest) => void;
  onError?: (error: Error) => void;
}

export const useServiceForm = ({
  specialty,
  onSuccess,
  onError
}: UseServiceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (formData: Partial<ServiceRequest>) => {
    setLoading(true);
    setError(null);

    try {
      const request: ServiceRequest = {
        ...formData,
        category: specialty,
        status: 'PENDING',
        createdAt: new Date()
      } as ServiceRequest;

      const response = await submitServiceRequest(request);

      if (response.success) {
        setSuccess(true);
        onSuccess?.(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    submitForm,
    resetForm
  };
};

ARCHIVO: hooks/useAvailableTechnicians.ts

import { useState, useEffect } from 'react';
import { ServiceCategory } from '@/types/services';
import { getAvailableTechnicians } from '@/services/api/serviceRequests';

export const useAvailableTechnicians = (
  category: ServiceCategory,
  date: string,
  time: string
) => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date || !time) return;

    const fetchTechnicians = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAvailableTechnicians(category, date, time);
        setTechnicians(response.data);
      } catch (err) {
        setError('Error al cargar técnicos disponibles');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [category, date, time]);

  return { technicians, loading, error };
};

ENTREGABLE: Hooks personalizados creados
```

---

### FASE 5: ACTUALIZACIÓN DE PÁGINAS Y RUTAS

#### Tarea 5.1: Actualizar Página Principal
```
ACCIÓN: Integrar nuevas secciones en la página principal

ARCHIVO: pages/index.tsx (o app/page.tsx si es Next.js 13+)

ACTUALIZAR:

import ElectrodomesticosSection from '@/components/specialty-sections/ElectrodomesticosSection';
import ElectricidadSection from '@/components/specialty-sections/ElectricidadSection';
import ComputacionRedesSection from '@/components/specialty-sections/ComputacionRedesSection';
import SeguridadElectronicaSection from '@/components/specialty-sections/SeguridadElectronicaSection';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Sección de Electrodomésticos (existente) */}
      <ElectrodomesticosSection />

      {/* NUEVAS SECCIONES - Debajo de electrodomésticos */}
      <ElectricidadSection />
      <ComputacionRedesSection />
      <SeguridadElectronicaSection />

      {/* Otras secciones */}
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}

ENTREGABLE: Página principal actualizada
```

#### Tarea 5.2: Actualizar Navegación
```
ACCIÓN: Agregar enlaces a nuevas especialidades en menús

ARCHIVO: components/layout/Navigation.tsx (o Header.tsx)

ACTUALIZAR:

const navigationItems = [
  { href: '#inicio', label: 'Inicio' },
  {
    href: '#servicios',
    label: 'Servicios',
    submenu: [
      { href: '#electrodomesticos', label: 'Electrodomésticos' },
      { href: '#electricidad', label: 'Electricidad' },
      { href: '#computacion-redes', label: 'Computación y Redes' },
      { href: '#seguridad-electronica', label: 'Seguridad Electrónica' }
    ]
  },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' }
];

IMPLEMENTAR:
- Dropdown menu para "Servicios" con todas las especialidades
- Smooth scroll a cada sección
- Active state en el menú según scroll position
- Mobile hamburger menu con submenu colapsable

ENTREGABLE: Navegación actualizada con nuevas opciones
```

---

### FASE 6: ACTUALIZACIÓN DE BASE DE DATOS

#### Tarea 6.1: Migración de Base de Datos
```
ACCIÓN: Actualizar esquema de base de datos para soportar nuevas especialidades

ARCHIVO: migrations/XXXX_add_new_specialties.sql (o .ts si usa ORM)

SCRIPT SQL:

-- 1. Actualizar enum de categorías (si usa ENUM)
ALTER TYPE service_category ADD VALUE IF NOT EXISTS 'electricidad';
ALTER TYPE service_category ADD VALUE IF NOT EXISTS 'computacion_redes';
ALTER TYPE service_category ADD VALUE IF NOT EXISTS 'seguridad_electronica';

-- 2. Actualizar tabla de técnicos para incluir múltiples especialidades
ALTER TABLE tecnicos ADD COLUMN IF NOT EXISTS especialidades TEXT[];

-- 3. Crear índice para búsqueda eficiente por especialidad
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios(categoria);
CREATE INDEX IF NOT EXISTS idx_tecnicos_especialidades ON tecnicos USING GIN(especialidades);

-- 4. Insertar datos de configuración de nuevas especialidades
INSERT INTO especialidades_config (id, nombre, titulo, descripcion, imagen_path, color, activo)
VALUES
  ('electricidad', 'Electricidad', 'Agenda tu Técnico Especialista en Electricidad', 'Instalaciones y reparaciones eléctricas profesionales', '/especialidad/electricidad.png', '#F59E0B', true),
  ('computacion_redes', 'Computación y Redes', 'Agenda tu Técnico Especialista en Computación y Redes', 'Soporte técnico, redes e infraestructura IT', '/especialidad/computacion-redes.png', '#3B82F6', true),
  ('seguridad_electronica', 'Seguridad Electrónica', 'Agenda tu Técnico Especialista en Seguridad Electrónica', 'Sistemas de seguridad, cámaras y control de acceso', '/especialidad/seguridad-electronica.png', '#10B981', true)
ON CONFLICT (id) DO UPDATE
SET
  nombre = EXCLUDED.nombre,
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  imagen_path = EXCLUDED.imagen_path,
  color = EXCLUDED.color,
  activo = EXCLUDED.activo;

-- 5. Actualizar técnicos existentes (si aplica)
-- Asignar especialidad 'electrodomesticos' a técnicos actuales
UPDATE tecnicos
SET especialidades = ARRAY['electrodomesticos']
WHERE especialidades IS NULL OR array_length(especialidades, 1) IS NULL;

ENTREGABLE: Script de migración creado y documentado
```

#### Tarea 6.2: Actualizar Modelos/ORMs
```
ACCIÓN: Actualizar modelos de datos (Prisma, TypeORM, Sequelize, etc.)

ARCHIVO: models/Service.ts (o schema.prisma)

EJEMPLO CON PRISMA:

model Service {
  id              String          @id @default(uuid())
  category        ServiceCategory // Enum actualizado
  serviceType     String
  scheduledDate   DateTime
  scheduledTime   String
  description     String
  status          ServiceStatus   @default(PENDING)

  // Relaciones
  customer        User            @relation("CustomerServices", fields: [customerId], references: [id])
  customerId      String

  technician      User?           @relation("TechnicianServices", fields: [technicianId], references: [id])
  technicianId    String?

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([category])
  @@index([status])
  @@index([scheduledDate])
}

enum ServiceCategory {
  ELECTRODOMESTICOS
  ELECTRICIDAD
  COMPUTACION_REDES
  SEGURIDAD_ELECTRONICA
}

model Technician {
  id              String          @id @default(uuid())
  specialties     ServiceCategory[] // Array de especialidades
  available       Boolean         @default(true)
  rating          Float           @default(0)

  // Relaciones
  user            User            @relation(fields: [userId], references: [id])
  userId          String          @unique

  services        Service[]       @relation("TechnicianServices")

  @@index([specialties])
}

EJECUTAR:
npx prisma migrate dev --name add_new_specialties
npx prisma generate

ENTREGABLE: Modelos actualizados y migración ejecutada
```

---

### FASE 7: ACTUALIZACIÓN DE BACKEND/API

#### Tarea 7.1: Actualizar Endpoints de API
```
ACCIÓN: Modificar controladores y rutas del backend

ARCHIVO: controllers/serviceController.ts

ACTUALIZAR:

// Endpoint para crear servicio (ya debe ser genérico)
export const createService = async (req: Request, res: Response) => {
  try {
    const { category, serviceType, scheduledDate, ... } = req.body;

    // Validar categoría
    if (!Object.values(ServiceCategory).includes(category)) {
      return res.status(400).json({
        error: 'Categoría de servicio inválida'
      });
    }

    // Validar que existan técnicos disponibles para esa especialidad
    const availableTechs = await Technician.findMany({
      where: {
        specialties: { has: category },
        available: true
      }
    });

    if (availableTechs.length === 0) {
      return res.status(400).json({
        error: `No hay técnicos disponibles para ${category}`
      });
    }

    // Crear servicio
    const service = await Service.create({
      data: {
        category,
        serviceType,
        scheduledDate,
        ...
      }
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint para obtener técnicos disponibles por especialidad
export const getAvailableTechnicians = async (req: Request, res: Response) => {
  try {
    const { category, date, time } = req.query;

    const technicians = await Technician.findMany({
      where: {
        specialties: { has: category as ServiceCategory },
        available: true,
        // Lógica adicional para verificar disponibilidad en fecha/hora
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.json(technicians);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

ARCHIVO: routes/services.ts

import { createService, getAvailableTechnicians } from '@/controllers/serviceController';

router.post('/services/request', createService);
router.get('/technicians/available', getAvailableTechnicians);

ENTREGABLE: Backend actualizado y funcionando
```

#### Tarea 7.2: Actualizar Validaciones
```
ACCIÓN: Crear validadores para nuevas especialidades

ARCHIVO: validators/serviceValidator.ts

import { z } from 'zod'; // o Joi, Yup, etc.

// Enum de categorías
const ServiceCategorySchema = z.enum([
  'electrodomesticos',
  'electricidad',
  'computacion_redes',
  'seguridad_electronica'
]);

// Validador de servicios de electricidad
const electricidadServicesSchema = z.enum([
  'instalacion_electrica',
  'reparacion_tableros',
  'cableado',
  'iluminacion',
  'otros_electricidad'
]);

// Validador de servicios de computación
const computacionServicesSchema = z.enum([
  'soporte_tecnico',
  'instalacion_redes',
  'configuracion_servidores',
  'cableado_estructurado',
  'otros_computacion'
]);

// Validador de servicios de seguridad
const seguridadServicesSchema = z.enum([
  'instalacion_camaras',
  'sistemas_alarma',
  'control_acceso',
  'cctv',
  'domotica',
  'otros_seguridad'
]);

// Validador principal de solicitud de servicio
export const serviceRequestSchema = z.object({
  category: ServiceCategorySchema,
  serviceType: z.string(),
  scheduledDate: z.string().datetime(),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  description: z.string().min(10).max(500),
  customerInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string()
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string()
  })
}).refine((data) => {
  // Validación condicional del tipo de servicio según categoría
  switch(data.category) {
    case 'electricidad':
      return electricidadServicesSchema.safeParse(data.serviceType).success;
    case 'computacion_redes':
      return computacionServicesSchema.safeParse(data.serviceType).success;
    case 'seguridad_electronica':
      return seguridadServicesSchema.safeParse(data.serviceType).success;
    default:
      return true;
  }
}, {
  message: 'Tipo de servicio inválido para la categoría seleccionada'
});

ENTREGABLE: Validadores completos y testeados
```

---

### FASE 8: PRUEBAS Y QA

#### Tarea 8.1: Crear Tests Unitarios
```
ACCIÓN: Escribir tests para componentes y funciones nuevas

ARCHIVO: __tests__/components/ServiceForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ServiceForm from '@/components/services/ServiceForm';
import { ServiceCategory } from '@/types/services';
import { getSpecialtyConfig } from '@/constants/specialties';

describe('ServiceForm', () => {
  describe('Electricidad Specialty', () => {
    const config = getSpecialtyConfig(ServiceCategory.ELECTRICIDAD);

    it('renders with electricidad configuration', () => {
      render(<ServiceForm specialty={ServiceCategory.ELECTRICIDAD} config={config} />);

      expect(screen.getByText(/Electricidad/i)).toBeInTheDocument();
      expect(screen.getByText(/Instalación Eléctrica/i)).toBeInTheDocument();
    });

    it('submits form with correct data', async () => {
      const mockSubmit = jest.fn();
      render(
        <ServiceForm
          specialty={ServiceCategory.ELECTRICIDAD}
          config={config}
          onSubmit={mockSubmit}
        />
      );

      // Rellenar formulario
      fireEvent.change(screen.getByLabelText(/Tipo de Servicio/i), {
        target: { value: 'instalacion_electrica' }
      });

      // Submit
      fireEvent.click(screen.getByRole('button', { name: /Agendar/i }));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            category: ServiceCategory.ELECTRICIDAD,
            serviceType: 'instalacion_electrica'
          })
        );
      });
    });
  });

  // Tests similares para otras especialidades...
});

ARCHIVO: __tests__/constants/specialties.test.ts

import { getSpecialtyConfig, ALL_SPECIALTIES, ServiceCategory } from '@/constants/specialties';

describe('Specialties Configuration', () => {
  it('should have all 4 specialties configured', () => {
    expect(ALL_SPECIALTIES).toHaveLength(4);
  });

  it('should return correct config for electricidad', () => {
    const config = getSpecialtyConfig(ServiceCategory.ELECTRICIDAD);
    expect(config.name).toBe('Electricidad');
    expect(config.services.length).toBeGreaterThan(0);
  });

  it('all specialty images should have correct paths', () => {
    ALL_SPECIALTIES.forEach(specialty => {
      expect(specialty.imagePath).toMatch(/^\/especialidad\//);
    });
  });
});

EJECUTAR:
npm run test

ENTREGABLE: Suite de tests completa
```

#### Tarea 8.2: Testing Manual
```
ACCIÓN: Realizar pruebas manuales exhaustivas

CHECKLIST DE PRUEBAS:

✅ FUNCIONALIDAD DE FORMULARIOS
- [ ] Formulario de Electrodomésticos funciona correctamente
- [ ] Formulario de Electricidad funciona correctamente
- [ ] Formulario de Computación y Redes funciona correctamente
- [ ] Formulario de Seguridad Electrónica funciona correctamente
- [ ] Validaciones funcionan en todos los formularios
- [ ] Mensajes de error se muestran apropiadamente
- [ ] Mensajes de éxito se muestran apropiadamente

✅ INTEGRACIÓN CON BACKEND
- [ ] Crear servicio de electricidad → API → BD (verificar registro)
- [ ] Crear servicio de computación → API → BD (verificar registro)
- [ ] Crear servicio de seguridad → API → BD (verificar registro)
- [ ] Técnicos disponibles se cargan por especialidad
- [ ] Asignación de técnico funciona correctamente

✅ NAVEGACIÓN
- [ ] Links en menú navegan a secciones correctas
- [ ] Smooth scroll funciona
- [ ] Active states en menú se actualizan
- [ ] Mobile menu funciona con todas las opciones

✅ UI/UX
- [ ] Todas las imágenes de especialidades cargan
- [ ] Colores temáticos se aplican correctamente
- [ ] Diseño es consistente entre secciones
- [ ] Responsividad funciona en mobile/tablet/desktop
- [ ] Accesibilidad (navegación con teclado, screen readers)

✅ DATOS
- [ ] Datos se guardan con la categoría correcta
- [ ] Queries por especialidad funcionan
- [ ] Reportes/dashboards muestran datos correctos por especialidad

ENTREGABLE: Reporte de pruebas con screenshots
```

---

### FASE 9: DOCUMENTACIÓN

#### Tarea 9.1: Actualizar Documentación Técnica
```
ACCIÓN: Documentar cambios realizados

ARCHIVO: docs/SERVICES_EXPANSION.md

# Expansión de Servicios - Especialidades Técnicas

## Resumen
Se han agregado 3 nuevas especialidades al sistema SomosTécnicos:
- Electricidad
- Computación y Redes
- Seguridad Electrónica

## Arquitectura

### Componentes Principales
- `ServiceForm.tsx`: Componente genérico reutilizable
- Secciones wrapper por especialidad
- Configuración centralizada en `constants/specialties.ts`

### Flujo de Datos
1. Usuario selecciona especialidad
2. Componente carga configuración correspondiente
3. Usuario completa formulario
4. Datos se envían a API con categoría específica
5. Backend valida y asigna técnico según especialidad
6. Confirmación y notificación al usuario

### Diagrama de Arquitectura
[Incluir diagrama]

## Configuración

### Agregar Nueva Especialidad
Para agregar una nueva especialidad en el futuro:

1. Actualizar enum en `types/services.ts`
2. Agregar configuración en `constants/specialties.ts`
3. Crear imagen en `public/especialidad/`
4. Crear sección wrapper component
5. Agregar a página principal
6. Actualizar navegación
7. Migración de BD
8. Tests

### Modificar Servicios de una Especialidad
Editar array `services` en `SPECIALTIES_CONFIG` para la especialidad correspondiente.

## API Endpoints

### POST /api/services/request
Crear nueva solicitud de servicio.

Body:
```json
{
  "category": "electricidad",
  "serviceType": "instalacion_electrica",
  "scheduledDate": "2026-02-15T10:00:00Z",
  "scheduledTime": "10:00",
  "description": "...",
  "customerInfo": { ... },
  "address": { ... }
}
```

### GET /api/technicians/available
Obtener técnicos disponibles.

Params:
- category: ServiceCategory
- date: string (ISO 8601)
- time: string (HH:MM)

## Base de Datos

### Tabla: services
- category: enum (electrodomesticos, electricidad, computacion_redes, seguridad_electronica)

### Tabla: technicians
- specialties: array (puede tener múltiples especialidades)

## Testing
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Coverage: `npm run test:coverage`

ENTREGABLE: Documentación completa
```

#### Tarea 9.2: Actualizar README
```
ACCIÓN: Actualizar README.md del proyecto

Agregar sección:

## Servicios Disponibles

SomosTécnicos ofrece servicios técnicos especializados en las siguientes áreas:

### 🔧 Electrodomésticos
Reparación y mantenimiento de electrodomésticos del hogar.

### ⚡ Electricidad
Instalaciones y reparaciones eléctricas residenciales y comerciales.

### 💻 Computación y Redes
Soporte técnico, instalación de redes y servicios IT.

### 🔒 Seguridad Electrónica
Sistemas de videovigilancia, alarmas y control de acceso.

## Agregar Nueva Especialidad

Ver documentación en `docs/SERVICES_EXPANSION.md`

ENTREGABLE: README actualizado
```

---

### FASE 10: DEPLOYMENT Y MONITOREO

#### Tarea 10.1: Preparar para Deployment
```
ACCIÓN: Preparar código para producción

CHECKLIST:

- [ ] Ejecutar build de producción: `npm run build`
- [ ] Verificar que no hay errores de TypeScript
- [ ] Verificar que no hay warnings críticos
- [ ] Optimizar imágenes de especialidades (comprimir)
- [ ] Generar sourcemaps
- [ ] Actualizar variables de entorno de producción
- [ ] Migración de BD en producción (si aplica)
- [ ] Crear backup de BD antes de deploy
- [ ] Smoke tests en staging

COMANDO BUILD:
npm run build
npm run lint
npm run type-check

ENTREGABLE: Build exitoso sin errores
```

#### Tarea 10.2: Configurar Monitoreo
```
ACCIÓN: Configurar analytics y monitoreo

MÉTRICAS A TRACKEAR:

// Google Analytics / Mixpanel
trackEvent('service_form_submitted', {
  specialty: 'electricidad',
  serviceType: 'instalacion_electrica'
});

trackEvent('specialty_section_viewed', {
  specialty: 'electricidad'
});

ERRORES A MONITOREAR:
- Errores al crear servicio por especialidad
- Técnicos no disponibles por especialidad
- Errores de validación de formulario

LOGS:
- Servicios creados por especialidad (diario)
- Técnicos más solicitados por especialidad
- Conversión por especialidad

ENTREGABLE: Dashboard de monitoreo configurado
```

---

## 📊 CRITERIOS DE ACEPTACIÓN

La implementación se considera COMPLETA cuando:

### ✅ Funcionalidad
- [ ] Las 3 nuevas especialidades tienen formularios funcionando al 100%
- [ ] Servicios se crean correctamente en BD con categoría apropiada
- [ ] Técnicos se filtran correctamente por especialidad
- [ ] Todas las validaciones funcionan
- [ ] Notificaciones y confirmaciones funcionan

### ✅ Diseño
- [ ] Diseño es idéntico entre todas las especialidades
- [ ] Imágenes se muestran correctamente
- [ ] Colores temáticos se aplican
- [ ] Responsividad funciona en todos los breakpoints
- [ ] Accesibilidad cumple con WCAG 2.1 AA

### ✅ Código
- [ ] Código sigue principios DRY (no hay duplicación)
- [ ] TypeScript sin errores ni warnings
- [ ] Tests tienen >80% coverage
- [ ] Documentación completa
- [ ] Código revisado y aprobado (code review)

### ✅ Performance
- [ ] Lighthouse score > 90
- [ ] Imágenes optimizadas
- [ ] Lazy loading implementado donde corresponde
- [ ] No hay memory leaks

### ✅ Backend
- [ ] Endpoints funcionan correctamente
- [ ] Validaciones en backend funcionan
- [ ] BD actualizada con migraciones
- [ ] Índices creados para optimización

---

## 🚨 RIESGOS Y MITIGACIONES

### Riesgo 1: Romper funcionalidad existente de Electrodomésticos
**Mitigación**:
- Tests exhaustivos antes de deployment
- Deploy gradual (staging → canary → production)
- Mantener rollback plan

### Riesgo 2: Inconsistencias en diseño entre especialidades
**Mitigación**:
- Componente genérico bien testeado
- Design review antes de finalizar
- Screenshots comparativos

### Riesgo 3: Performance degradado con más secciones
**Mitigación**:
- Lazy loading de secciones
- Code splitting
- Optimización de imágenes
- Monitoring de performance

---

## 📅 ESTIMACIÓN DE TIEMPO

| Fase | Tiempo Estimado |
|------|----------------|
| Fase 1: Análisis y Preparación | 2-3 horas |
| Fase 2: Arquitectura | 3-4 horas |
| Fase 3: Refactorización | 4-6 horas |
| Fase 4: API y Servicios | 3-4 horas |
| Fase 5: Páginas y Rutas | 2-3 horas |
| Fase 6: Base de Datos | 2-3 horas |
| Fase 7: Backend | 3-4 horas |
| Fase 8: Testing | 4-5 horas |
| Fase 9: Documentación | 2-3 horas |
| Fase 10: Deployment | 2-3 horas |
| **TOTAL** | **27-38 horas** |

---

## 🎯 SIGUIENTE PASO INMEDIATO

**INICIAR CON**: Tarea 1.1 - Análisis del Componente Base `service-form.tsx`

**COMANDO**:
```bash
# Localizar el archivo
find . -name "service-form.tsx" -o -name "ServiceForm.tsx"

# Abrir y analizar
code [RUTA_ENCONTRADA]
```

---

## 📞 PUNTO DE CONTACTO

Si tienes dudas durante la implementación:
- Revisa la documentación en cada fase
- Consulta los ejemplos de código proporcionados
- Pregunta específicamente sobre cualquier tarea

**¡Éxito en la implementación! 🚀**
