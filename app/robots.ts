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
          // Autenticación: no aportan valor SEO
          '/login',
          '/register',
          // Páginas transaccionales: no aportan valor SEO y tienen contenido dinámico
          '/forgot-password',
          '/reset-password',
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
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: 'https://somostecnicos.com/sitemap.xml',
  }
}
