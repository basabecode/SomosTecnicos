
import { APPLIANCE_TYPES } from '@/lib/constants';

export interface SpecialtyItem {
  id: string;
  label: string;
  image: string; // Path to image in public folder
  description: string;
}

export interface SpecialtyConfig {
  id: string;
  title: string;
  description: string;
  color: string;
  items: SpecialtyItem[];
  problems: { [key: string]: string[] }; // Map of item ID to list of common problems
}

export const SPECIALTIES_CONFIG: Record<string, SpecialtyConfig> = {
  ELECTRODOMESTICOS: {
    id: 'electrodomesticos',
    title: 'Agenda tu Técnico Especialista',
    description: 'Reparación y mantenimiento de electrodomésticos y servicios técnicos especializados',
    color: '#A50034', // Red
    items: [
      {
        id: APPLIANCE_TYPES.NEVERA,
        label: 'Nevera / Nevecon',
        image: '/electrodomesticos/nevecon lg1.avif',
        description: 'Reparación y mantenimiento de refrigeración'
      },
      {
        id: APPLIANCE_TYPES.LAVADORA,
        label: 'Lavadora',
        image: '/electrodomesticos/lavadora carga superior lg.avif',
        description: 'Carga frontal y superior'
      },
      {
        id: APPLIANCE_TYPES.SECADORA,
        label: 'Secadora',
        image: '/electrodomesticos/lavadora blanca lg1.avif',
        description: 'Secadoras a gas y eléctricas'
      },
      {
        id: APPLIANCE_TYPES.ESTUFA,
        label: 'Estufa / Horno',
        image: '/electrodomesticos/estufa empotrar 1.avif',
        description: 'Estufas de empotrar y hornos'
      },
      {
        id: APPLIANCE_TYPES.CALENTADOR,
        label: 'Calentador',
        image: '/electrodomesticos/calentador challenger.avif',
        description: 'Calentadores de paso y acumulación'
      },
      {
        id: 'televisor',
        label: 'Televisor',
        image: '/electrodomesticos/tv lg uhd.avif',
        description: 'LED, LCD, Smart TV y 4K'
      },
      {
        id: APPLIANCE_TYPES.ELECTRICISTA,
        label: 'Electricista',
        image: '/especialistas/electricista2.avif',
        description: 'Cableado, tableros e iluminación'
      },
      {
        id: APPLIANCE_TYPES.TECNICO_SISTEMAS,
        label: 'Computación y Redes',
        image: '/especialistas/computacion_redes2.avif',
        description: 'PC, Portátiles, WiFi e Impresoras'
      },
      {
        id: APPLIANCE_TYPES.TECNICO_SEGURIDAD,
        label: 'Seguridad Electrónica',
        image: '/especialistas/seguridad_electronica3.avif',
        description: 'Cámaras, Alarmas y Control de Acceso'
      }
    ],
    problems: {
      [APPLIANCE_TYPES.NEVERA]: [
        'No enfría', 'Hace ruido extraño', 'Gotea agua', 'No prende',
        'Congela los alimentos', 'Mantenimiento preventivo', 'Instalación'
      ],
      [APPLIANCE_TYPES.LAVADORA]: [
        'No enciende', 'No gira el tambor', 'No drena el agua', 'Vibra demasiado',
        'Mancha la ropa', 'Mantenimiento preventivo', 'Instalación'
      ],
      [APPLIANCE_TYPES.SECADORA]: [
        'No calienta', 'No gira', 'Hace mucho ruido', 'Se apaga sola',
        'No enciende', 'Mantenimiento preventivo', 'Instalación'
      ],
      [APPLIANCE_TYPES.ESTUFA]: [
        'Llama muy baja', 'No prende el quemador', 'Olor a gas', 'Horno no calienta',
        'Chispa no funciona', 'Mantenimiento general', 'Instalación'
      ],
      [APPLIANCE_TYPES.CALENTADOR]: [
        'No calienta el agua', 'Se apaga repentinamente', 'Fuga de agua',
        'Explosiones al encender', 'Poca presión', 'Mantenimiento anual', 'Instalación'
      ],
      'televisor': [
        'Pantalla negra con sonido', 'No enciende', 'Imagen distorsionada',
        'Sin conexión Wifi', 'Puertos HDMI no funcionan', 'Pantalla rota', 'Instalación'
      ],
      [APPLIANCE_TYPES.ELECTRICISTA]: [
        'Cortocircuito / Sin energía',
        'Instalación nueva',
        'Breakers se saltan',
        'Olor a quemado / cable derretido',
        'Mantenimiento de tablero',
        'Reparación de toma o interruptor',
        'Instalación de lámpara / LED',
        'Revisión eléctrica general'
      ],
      [APPLIANCE_TYPES.TECNICO_SISTEMAS]: [
        'Computador lento / Virus',
        'No enciende / Pantalla azul',
        'Mantenimiento preventivo',
        'Formateo e instalación de programas',
        'Pantalla rota / Teclado dañado (Portátil)',
        'Problemas de Internet / WiFi',
        'Configuración de red / Router',
        'Impresora no funciona / Configuración'
      ],
      [APPLIANCE_TYPES.TECNICO_SEGURIDAD]: [
        'Cámaras no graban / Sin imagen',
        'Instalación cámaras CCTV',
        'Configuración monitoreo celular',
        'Mantenimiento sistema seguridad',
        'Alarma se dispara sola',
        'Instalación sistema de alarma',
        'Control de acceso / Huella no lee',
        'Citófono no funciona'
      ]
    }
  }
};

export const SPECIALIST_BRANDS = [
  // Electricidad
  { name: 'Schneider', logo: '/logos/schneider.svg', alt: 'Logo Schneider Electric' },
  { name: 'Legrand',   logo: '/logos/legrand.svg',   alt: 'Logo Legrand' },
  { name: 'Siemens',   logo: '/logos/siemens.svg',   alt: 'Logo Siemens' },
  { name: 'Centelsa',  logo: '/logos/centelsa.svg',  alt: 'Logo Centelsa' },
  { name: 'Philips',   logo: '/logos/philips.svg',   alt: 'Logo Philips' },

  // Computación
  { name: 'HP',     logo: '/logos/hp.svg',     alt: 'Logo HP' },
  { name: 'Dell',   logo: '/logos/dell.svg',   alt: 'Logo Dell' },
  { name: 'Lenovo', logo: '/logos/lenovo.svg', alt: 'Logo Lenovo' },
  { name: 'Asus',   logo: '/logos/asus.svg',   alt: 'Logo Asus' },
  { name: 'Apple',  logo: '/logos/apple.svg',  alt: 'Logo Apple' },
  { name: 'Cisco',  logo: '/logos/cisco.svg',  alt: 'Logo Cisco' },

  // Seguridad
  { name: 'Hikvision', logo: '/logos/hikvision.svg', alt: 'Logo Hikvision' },
  { name: 'Dahua',     logo: '/logos/dahua.svg',     alt: 'Logo Dahua' },
  { name: 'ZKTeco',    logo: '/logos/zkteco.svg',    alt: 'Logo ZKTeco' },
  { name: 'DSC',       logo: '/logos/dsc.svg',       alt: 'Logo DSC' },
  { name: 'Honeywell', logo: '/logos/honeywell.svg', alt: 'Logo Honeywell' },
  { name: 'Bosch',     logo: '/logos/bosch.svg',     alt: 'Logo Bosch Security' },
];
