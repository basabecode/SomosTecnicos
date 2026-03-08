import withPWA from '@ducanh2912/next-pwa'

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
        // Headers de seguridad y rendimiento para todas las rutas
        source: '/(.*)',
        headers: [
          // Compresión: indicar al navegador que acepte Gzip y Brotli
          {
            key: 'Accept-Encoding',
            value: 'br, gzip, deflate',
          },
          // Seguridad XSS
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
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

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Deshabilitado en desarrollo para no interferir con hot reload
  disable: process.env.NODE_ENV === 'development',
  // Estrategias de caché offline
  runtimeCaching: [
    {
      // API routes — network first, fallback a caché si no hay conexión
      urlPattern: /^\/api\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24h
        },
      },
    },
    {
      // Imágenes locales del proyecto — cache first (no cambian frecuentemente)
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|avif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        },
      },
    },
    {
      // Google Fonts — stale while revalidate
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
        },
      },
    },
    {
      // Assets estáticos de Next.js (JS/CSS con hash) — cache first
      urlPattern: /^\/_next\/static\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static',
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        },
      },
    },
  ],
})(nextConfig)
