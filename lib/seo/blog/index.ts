/**
 * Punto central del blog: combina todos los posts de cada área temática.
 * Agregar un nuevo área = crear el archivo .ts e importarlo aquí.
 */

export type { BlogFaq, BlogSection, BlogPost, BlogCluster } from './types'

export { BLOG_CLUSTERS, BLOG_CLUSTER_BY_SLUG, getBlogClusterKey } from './clusters'
import { getBlogClusterKey } from './clusters'

import { neverasPosts } from './neveras'
import { lavadorasPosts } from './lavadoras'
import { calentadoresPosts } from './calentadores'
import { televisoresPosts } from './televisores'
import { seguridadPosts } from './seguridad'
import { generalPosts } from './general'
import { secadorasPosts } from './secadoras'
import { estufasPosts } from './estufas'
import { redesPosts } from './redes'
import { electricidadPosts } from './electricidad'
import { BLOG_CLUSTERS } from './clusters'
import type { BlogPost } from './types'

export const BLOG_POSTS: Record<string, BlogPost> = {
  ...neverasPosts,
  ...lavadorasPosts,
  ...calentadoresPosts,
  ...televisoresPosts,
  ...seguridadPosts,
  ...generalPosts,
  ...secadorasPosts,
  ...estufasPosts,
  ...redesPosts,
  ...electricidadPosts,
}

export const BLOG_POSTS_LIST = Object.values(BLOG_POSTS).sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = BLOG_POSTS[currentSlug]
  if (!currentPost) return []

  const clusterKey = getBlogClusterKey(currentSlug)

  const relatedByCluster = clusterKey
    ? BLOG_CLUSTERS[clusterKey].postSlugs
      .filter((slug) => slug !== currentSlug && Boolean(BLOG_POSTS[slug]))
      .map((slug) => BLOG_POSTS[slug])
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    : []

  if (relatedByCluster.length >= limit) {
    return relatedByCluster.slice(0, limit)
  }

  const fallbackByCategory = BLOG_POSTS_LIST
    .filter((p) =>
      p.slug !== currentSlug &&
      p.category === currentPost.category &&
      !relatedByCluster.some((rp) => rp.slug === p.slug)
    )

  return [...relatedByCluster, ...fallbackByCategory].slice(0, limit)
}
