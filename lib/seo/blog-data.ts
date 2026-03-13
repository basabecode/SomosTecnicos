/**
 * Re-exportación para compatibilidad con imports existentes.
 * El contenido real está en lib/seo/blog/ dividido por área temática.
 *
 * Para añadir posts nuevos: crea o edita el archivo correspondiente en lib/seo/blog/
 * y asegúrate de que el slug aparezca en BLOG_CLUSTERS (lib/seo/blog/clusters.ts).
 */
export * from './blog/index'
