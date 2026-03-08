/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    // Formatos modernos: WebP primero, luego AVIF para máxima compatibilidad y compresión
    formats: ['image/webp', 'image/avif'],
    // Tamaños de dispositivo para responsive images (mobile → desktop → 4K)
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2048],
    // Tamaños para imágenes con layout fixed/fill
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Calidades de compresión: reducida para mejorar rendimiento
    qualities: [60, 75, 85],
    // Cache mínimo de 30 días para imágenes optimizadas
    minimumCacheTTL: 2592000,
  },

  async headers() {
    return [
      {
        // Headers de seguridad para todas las rutas
        source: '/(.*)',
        headers: [
          // Previene que el navegador infiera el tipo MIME (anti-sniffing)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Evita que el sitio sea embebido en iframes externos (clickjacking)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // No enviar el referrer completo a terceros
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Fuerza HTTPS durante 1 año, incluye subdominios
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Restringe acceso a APIs del navegador que la app no usa
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
          // Content Security Policy: define fuentes permitidas de contenido.
          // 'unsafe-inline' en script-src y style-src es requerido por Next.js
          // (scripts de hidratación y Tailwind inline styles).
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js requiere 'unsafe-inline' para scripts de hidratación del DOM
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Tailwind y estilos inline del framework requieren 'unsafe-inline'
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Imágenes locales y data URIs (íconos SVG inline)
              "img-src 'self' data: blob:",
              // API calls solo al propio dominio
              "connect-src 'self'",
              // Bloquea <object> y <embed> (vectores de ataque obsoletos)
              "object-src 'none'",
              // Bloquea iframes de dominio externo (refuerza X-Frame-Options)
              "frame-ancestors 'none'",
              // Evita inyección de base href
              "base-uri 'self'",
              // Formularios solo al propio dominio
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // Cache agresivo para assets estáticos (imágenes, fuentes, JS, CSS ya hasheados)
        source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache para archivos JS y CSS con hash de Next.js
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
