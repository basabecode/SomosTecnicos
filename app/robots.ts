import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Motores de búsqueda tradicionales (Google, Bing, etc.)
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/', '/technician/', '/api/', '/customer/'],
      },
      {
        // Rastreadores de IA (ChatGPT, Perplexity, Claude, Gemini, etc.)
        // Pueden indexar el contenido público y el llms.txt
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Googlebot-Extended', 'anthropic-ai', 'cohere-ai'],
        allow: ['/', '/llms.txt'],
        disallow: ['/admin/', '/technician/', '/api/', '/customer/'],
      },
    ],
    sitemap: 'https://somostecnicos.com/sitemap.xml',
  }
}
