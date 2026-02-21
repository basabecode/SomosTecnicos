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

export default nextConfig
