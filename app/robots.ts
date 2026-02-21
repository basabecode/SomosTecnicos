import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Motores de búsqueda tradicionales (Google, Bing, etc.)
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/technician/',
          '/api/',
          '/customer/',
          '/manager/',
          // Páginas transaccionales: no aportan valor SEO y tienen contenido dinámico
          '/forgot-password',
          '/reset-password',
          // Sub-rutas de registro (la canónica preferida es /register)
          '/register/customer',
          '/register/technician',
        ],
      },
      {
        // Rastreadores de IA (ChatGPT, Perplexity, Claude, Gemini, etc.)
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Googlebot-Extended', 'anthropic-ai', 'cohere-ai'],
        allow: ['/', '/llms.txt'],
        disallow: [
          '/admin/',
          '/technician/',
          '/api/',
          '/customer/',
          '/manager/',
          '/forgot-password',
          '/reset-password',
          '/register/customer',
          '/register/technician',
        ],
      },
    ],
    sitemap: 'https://somostecnicos.com/sitemap.xml',
  }
}
