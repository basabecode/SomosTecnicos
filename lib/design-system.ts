/**
 * Sistema de Diseño Unificado - SomosTécnicos
 * Especificaciones de diseño compartidas entre todos los portales
 */

export const designSystem = {
  // Dimensiones de la Barra Lateral
  sidebar: {
    width: '240px',
    height: '100vh',
    padding: {
      logo: '24px 20px',
      profile: '16px 20px',
      items: '12px 20px',
      logout: '16px 20px',
    },
    spacing: {
      itemGap: '4px',
      iconMargin: '12px',
    },
    borderRadius: {
      activeItem: '8px',
    },
  },

  // Dimensiones de la Barra Superior
  header: {
    height: '64px',
    padding: '0 32px',
    borderBottom: '1px solid #E5E7EB',
    spacing: {
      elements: '16px',
    },
  },

  // Área de Contenido
  content: {
    padding: '32px',
    maxWidth: '1400px',
    gridGap: '24px',
    cardPadding: '24px',
    cardBorderRadius: '12px',
    cardShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  // Colores Corporativos
  colors: {
    // Primarios
    primary: {
      main: '#991B1B',
      hover: '#7F1D1D',
      light: '#FEE2E2',
    },
    // Neutrales
    neutral: {
      900: '#1F2937',
      600: '#6B7280',
      300: '#D1D5DB',
      100: '#F3F4F6',
      50: '#F9FAFB',
    },
    // Estados
    states: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    // Fondos
    background: {
      main: '#FFFFFF',
      secondary: '#F9FAFB',
      card: '#FFFFFF',
    },
    // Sidebar
    sidebar: {
      background: '#FFFFFF',
      textPrimary: '#1F2937',
      textSecondary: '#6B7280',
      activeBackground: '#F3F4F6',
      activeText: '#991B1B',
      hover: '#F9FAFB',
    },
  },

  // Tipografía
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif",
    fontSizes: {
      h1: '32px',
      h2: '24px',
      h3: '20px',
      body: '14px',
      small: '12px',
      tiny: '10px',
    },
    fontWeights: {
      h1: 700,
      h2: 600,
      h3: 600,
      body: 400,
      small: 400,
      tiny: 500,
      logo: 600,
      menuItem: 500,
    },
    lineHeights: {
      title: 1.2,
      text: 1.5,
    },
  },

  // Componentes Específicos
  components: {
    avatar: {
      size: '40px',
      borderRadius: '50%',
    },
    logo: {
      height: '48px',
      width: 'auto',
    },
    icon: {
      size: '20px',
    },
    badge: {
      size: '32px',
      borderRadius: '50%',
      background: '#DC2626',
      color: '#FFFFFF',
    },
    button: {
      primary: {
        background: '#991B1B',
        color: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 600,
        hover: '#7F1D1D',
      },
      secondary: {
        background: '#FFFFFF',
        border: '1px solid #D1D5DB',
        color: '#374151',
        hover: '#F9FAFB',
      },
    },
  },
}

// Clases CSS compartidas
export const sharedClasses = {
  sidebar: {
    container: 'flex flex-col h-screen bg-white border-r border-gray-200',
    logo: 'flex items-center justify-center px-5 py-6',
    profile: 'flex items-center px-5 py-4 gap-3 bg-gray-50 mx-5 rounded-lg',
    nav: 'flex-1 px-5 py-2 space-y-1 overflow-y-auto',
    navItem: 'flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200',
    navItemActive: 'bg-gray-100 text-[#991B1B] font-semibold',
    navItemInactive: 'text-gray-700 hover:bg-gray-50',
    logout: 'flex items-center gap-3 px-5 py-4 mx-5 mb-4 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200',
  },
  header: {
    container: 'flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200',
    title: 'text-2xl font-semibold text-gray-900',
    subtitle: 'text-sm text-gray-600',
    actions: 'flex items-center gap-4',
  },
  content: {
    main: 'flex-1 overflow-y-auto bg-gray-50',
    container: 'max-w-7xl mx-auto p-8',
    card: 'bg-white rounded-xl shadow-sm p-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  },
}
