'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Clock,
  Wrench,
  ChevronDown,
  ChevronUp,
  Thermometer,
  WashingMachine,
  Wind,
  Flame,
  Droplets,
  Tv,
  Monitor,
  Zap,
  Camera,
  LayoutGrid,
  Search,
} from 'lucide-react'
import {
  BLOG_CLUSTERS,
  BLOG_CLUSTER_BY_SLUG,
  BlogPost,
} from '@/lib/seo/blog-data'

type TopicKind = 'all' | 'cluster' | 'service'
interface TopicOption {
  id: string
  label: string
  icon: React.ElementType
  kind: TopicKind
  value?: string
}

// ── Navegación única por tema (sin duplicar UI) ────────────────────────────
const TOPIC_OPTIONS: TopicOption[] = [
  { id: 'all', label: 'Todos', icon: LayoutGrid, kind: 'all' },
  {
    id: 'neveras',
    label: 'Neveras',
    icon: Thermometer,
    kind: 'cluster',
    value: 'neveras',
  },
  {
    id: 'televisores',
    label: 'Televisores',
    icon: Tv,
    kind: 'cluster',
    value: 'televisores',
  },
  {
    id: 'lavadoras',
    label: 'Lavadoras',
    icon: WashingMachine,
    kind: 'service',
    value: 'reparacion-lavadoras-cali',
  },
  {
    id: 'secadoras',
    label: 'Secadoras',
    icon: Wind,
    kind: 'service',
    value: 'reparacion-secadoras-cali',
  },
  {
    id: 'estufas-hornos',
    label: 'Estufas y Hornos',
    icon: Flame,
    kind: 'service',
    value: 'reparacion-estufas-hornos-cali',
  },
  {
    id: 'calentadores',
    label: 'Calentadores',
    icon: Droplets,
    kind: 'service',
    value: 'reparacion-calentadores-cali',
  },
  {
    id: 'computadores',
    label: 'Computadores',
    icon: Monitor,
    kind: 'service',
    value: 'tecnico-computadores-redes-cali',
  },
  {
    id: 'electricidad',
    label: 'Electricidad',
    icon: Zap,
    kind: 'service',
    value: 'electricista-a-domicilio-cali',
  },
  {
    id: 'seguridad',
    label: 'Seguridad',
    icon: Camera,
    kind: 'service',
    value: 'camaras-seguridad-alarmas-cali',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  mantenimiento: 'bg-blue-50 text-blue-700',
  reparacion: 'bg-red-50 text-red-700',
  consejos: 'bg-green-50 text-green-700',
  guias: 'bg-purple-50 text-purple-700',
}

const PAGE_SIZE = 6

interface Props {
  posts: BlogPost[]
}

export default function BlogClient({ posts }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeTopic, setActiveTopic] = useState('all')
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    const queryTopic = searchParams.get('tema')
    if (!queryTopic) {
      setActiveTopic('all')
      return
    }
    const isValidTopic = TOPIC_OPTIONS.some(t => t.id === queryTopic)
    setActiveTopic(isValidTopic ? queryTopic : 'all')
  }, [searchParams])

  // Filtrado + búsqueda
  const filtered = useMemo(() => {
    let result = posts

    if (activeTopic !== 'all') {
      const currentTopic = TOPIC_OPTIONS.find(t => t.id === activeTopic)
      if (currentTopic?.kind === 'cluster' && currentTopic.value) {
        result = result.filter(
          p => BLOG_CLUSTER_BY_SLUG[p.slug] === currentTopic.value
        )
      } else if (currentTopic?.kind === 'service' && currentTopic.value) {
        result = result.filter(p => p.relatedServiceSlug === currentTopic.value)
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      )
    }

    return result
  }, [posts, activeTopic, search])

  // Posts visibles según paginación progresiva
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleTopicChange = (id: string) => {
    setActiveTopic(id)
    setVisibleCount(PAGE_SIZE) // Resetear al cambiar filtro

    const params = new URLSearchParams(searchParams.toString())
    if (id === 'all') {
      params.delete('tema')
    } else {
      params.set('tema', id)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* ── Barra de búsqueda — full width en móvil ─────────────── */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar artículos…"
          value={search}
          onChange={handleSearch}
          className="w-full sm:w-96 pl-10 pr-4 py-3 text-sm bg-white border border-[#E8EAED]
                     rounded-xl text-slate-700 placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                     transition-all duration-200"
        />
      </div>

      {/* ── Chips de filtro — scroll horizontal en móvil ─────────── */}
      <div className="relative mb-8">
        {/* Gradiente difuminado al final para indicar scroll disponible */}
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-linear-to-l from-[#F8F9FA] to-transparent pointer-events-none z-10 sm:hidden" />
        <div
          className="flex gap-2 sm:gap-2.5 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-1 sm:mx-0 px-1 sm:px-0 sm:flex-wrap"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TOPIC_OPTIONS.map(({ id, label, icon: Icon, kind, value }) => {
            const isActive = activeTopic === id
            let count: number | null = null

            if (kind === 'cluster' && value) {
              count =
                BLOG_CLUSTERS[value]?.postSlugs.filter(slug =>
                  Boolean(posts.find(p => p.slug === slug))
                ).length ?? 0
            } else if (kind === 'service' && value) {
              count = posts.filter(p => p.relatedServiceSlug === value).length
            }

            return (
              <button
                key={id}
                onClick={() => handleTopicChange(id)}
                className={`inline-flex items-center gap-1.5 px-3.5 rounded-full whitespace-nowrap shrink-0
                            text-xs font-semibold border transition-all duration-200
                            min-h-10 touch-manipulation
                            focus:outline-none focus:ring-2 focus:ring-primary/30
                            ${
                              isActive
                                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                                : 'bg-white text-slate-600 border-[#E8EAED] hover:border-primary/50 hover:text-primary active:bg-slate-50'
                            }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
                {count !== null && (
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-px rounded-full font-bold
                      ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Resultado / Estado vacío ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">
            No encontramos artículos
          </p>
          <p className="text-slate-400 text-sm px-6">
            Prueba con otro filtro o revisa la ortografía de tu búsqueda.
          </p>
          <button
            onClick={() => {
              handleTopicChange('all')
              setSearch('')
            }}
            className="mt-5 min-h-11 px-5 text-sm font-semibold text-primary
                       border border-primary/30 rounded-xl hover:bg-red-50 transition-colors"
          >
            Ver todos los artículos
          </button>
        </div>
      ) : (
        <>
          {/* Ancla + Contador de resultados */}
          <p
            id="blog-grid-top"
            className="text-xs text-slate-400 mb-5 scroll-mt-24"
          >
            Mostrando{' '}
            <span className="font-semibold text-slate-600">
              {visible.length}
            </span>{' '}
            de{' '}
            <span className="font-semibold text-slate-600">
              {filtered.length}
            </span>{' '}
            artículos
          </p>

          {/* ── Grid — 1 col móvil · 2 col tablet · 3 col desktop ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visible.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl border border-[#E8EAED] overflow-hidden
                           hover:shadow-md hover:border-slate-300 transition-all duration-200
                           active:scale-[0.99] flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-44 sm:h-48 bg-white overflow-hidden border-b border-[#E8EAED] shrink-0">
                  <Image
                    src={post.cardImage ?? post.heroImage}
                    alt={post.cardImageAlt ?? post.heroImageAlt}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        CATEGORY_COLORS[post.category] ??
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {post.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                  </div>

                  <h2
                    className="text-[15px] font-semibold text-slate-900 leading-snug mb-2
                               group-hover:text-primary transition-colors line-clamp-2"
                  >
                    {post.title}
                  </h2>

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {post.relatedServiceLabel && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                      <Wrench className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {post.relatedServiceLabel}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* ── Botones Ver más / Ver menos ──────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 sm:mt-10">
            {hasMore && (
              <button
                onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                           bg-white border border-[#E8EAED]
                           hover:border-primary hover:text-primary text-slate-700
                           text-sm font-semibold px-6 py-3.5 rounded-xl
                           min-h-12 touch-manipulation
                           transition-all duration-200 hover:shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Ver más artículos
                <ChevronDown className="w-4 h-4" />
                <span className="text-xs text-slate-400 font-normal">
                  ({filtered.length - visibleCount} restantes)
                </span>
              </button>
            )}
            {visibleCount > PAGE_SIZE && (
              <button
                onClick={() => {
                  setVisibleCount(PAGE_SIZE)
                  // Scroll suave de vuelta al inicio de la sección
                  document
                    .getElementById('blog-grid-top')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                           bg-white border border-[#E8EAED]
                           hover:border-slate-400 hover:text-slate-700 text-slate-500
                           text-sm font-semibold px-6 py-3.5 rounded-xl
                           min-h-12 touch-manipulation
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <ChevronUp className="w-4 h-4" />
                Ver menos
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
