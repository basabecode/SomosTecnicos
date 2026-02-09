
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
        image: '/electrodomesticos/nevecon lg1.jpg',
        description: 'Reparación y mantenimiento de refrigeración'
      },
      {
        id: APPLIANCE_TYPES.LAVADORA,
        label: 'Lavadora',
        image: '/electrodomesticos/lavadora carga superior lg.jpg',
        description: 'Carga frontal y superior'
      },
      {
        id: APPLIANCE_TYPES.SECADORA,
        label: 'Secadora',
        image: '/electrodomesticos/lavadora blanca lg1.jpg',
        description: 'Secadoras a gas y eléctricas'
      },
      {
        id: APPLIANCE_TYPES.ESTUFA,
        label: 'Estufa / Horno',
        image: '/electrodomesticos/estufa empotrar 1.jpg',
        description: 'Estufas de empotrar y hornos'
      },
      {
        id: APPLIANCE_TYPES.CALENTADOR,
        label: 'Calentador',
        image: '/electrodomesticos/calentador challenger.jpg',
        description: 'Calentadores de paso y acumulación'
      },
      {
        id: 'televisor',
        label: 'Televisor',
        image: '/electrodomesticos/tv lg uhd.jpg',
        description: 'LED, LCD, Smart TV y 4K'
      },
      {
        id: APPLIANCE_TYPES.ELECTRICISTA,
        label: 'Electricista',
        image: '/especialistas/electricista2.jpg',
        description: 'Cableado, tableros e iluminación'
      },
      {
        id: APPLIANCE_TYPES.TECNICO_SISTEMAS,
        label: 'Computación y Redes',
        image: '/especialistas/computacion_redes2.jpg',
        description: 'PC, Portátiles, WiFi e Impresoras'
      },
      {
        id: APPLIANCE_TYPES.TECNICO_SEGURIDAD,
        label: 'Seguridad Electrónica',
        image: '/especialistas/seguridad_electronica3.png',
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
  { name: 'Schneider', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Schneider-Electric-Logo.png', alt: 'Schneider Electric' },
  { name: 'Legrand', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Legrand_logo.svg/2560px-Legrand_logo.svg.png', alt: 'Legrand' },
  { name: 'Siemens', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Siemens-Logo.png', alt: 'Siemens' },
  { name: 'Centelsa', logo: 'https://seeklogo.com/images/C/centelsa-logo-50D57077E3-seeklogo.com.png', alt: 'Centelsa' },
  { name: 'Philips', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Philips-Logo.png', alt: 'Philips' },
  { name: 'Veto', logo: 'https://brandfetch.com/veto-electric.com.ec/fallback-logo', alt: 'Veto' },

  // Computación
  { name: 'HP', logo: 'https://logos-world.net/wp-content/uploads/2020/11/HP-Logo.png', alt: 'HP' },
  { name: 'Dell', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Dell-Logo.png', alt: 'Dell' },
  { name: 'Lenovo', logo: 'https://logos-world.net/wp-content/uploads/2022/07/Lenovo-Logo.png', alt: 'Lenovo' },
  { name: 'Asus', logo: 'https://logos-world.net/wp-content/uploads/2020/07/Asus-Logo.png', alt: 'Asus' },
  { name: 'Apple', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png', alt: 'Apple' },
  { name: 'Cisco', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Cisco-Logo.png', alt: 'Cisco' },

  // Seguridad
  { name: 'Hikvision', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hikvision_logo.svg/2560px-Hikvision_logo.svg.png', alt: 'Hikvision' },
  { name: 'Dahua', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Dahua_Technology_logo.svg/2560px-Dahua_Technology_logo.svg.png', alt: 'Dahua' },
  { name: 'ZKTeco', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/ZKTeco_Logo.svg/1200px-ZKTeco_Logo.svg.png', alt: 'ZKTeco' },
  { name: 'DSC', logo: 'https://seeklogo.com/images/D/dsc-logo-8A18476F87-seeklogo.com.png', alt: 'DSC' },
  { name: 'Honeywell', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Honeywell-Logo.png', alt: 'Honeywell' },
  { name: 'Bosch', logo: 'https://logos-world.net/wp-content/uploads/2020/08/Bosch-Logo.png', alt: 'Bosch Security' }
];
