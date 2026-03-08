import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Wrench } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { BLOG_POSTS } from '@/lib/seo/blog-data'
import PageBreadcrumb from '@/components/page-breadcrumb'

const BASE_URL = 'https://somostecnicos.com'

export const metadata: Metadata = {
  title: 'Blog de Consejos Técnicos | SomosTécnicos Cali',
  description:
    'Guías prácticas, consejos de mantenimiento y soluciones a los problemas más comunes de neveras, lavadoras, calentadores y más. Escrito por técnicos certificados en Cali.',
  keywords: [
    'blog técnico electrodomésticos',
    'consejos mantenimiento nevera Colombia',
    'reparación lavadora cali guía',
    'mantenimiento calentador Colombia',
    'blog servicio técnico cali',
  ],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog de Consejos Técnicos | SomosTécnicos Cali',
    description:
      'Guías prácticas y consejos de mantenimiento escritos por técnicos certificados en Cali.',
    url: `${BASE_URL}/blog`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}

const CATEGORY_COLORS: Record<string, string> = {
  mantenimiento: 'bg-blue-50 text-blue-700',
  reparacion: 'bg-red-50 text-red-700',
  consejos: 'bg-green-50 text-green-700',
  guias: 'bg-purple-50 text-purple-700',
}

export default function BlogPage() {
  const posts = Object.values(BLOG_POSTS).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F9FA]">
        {/* Hero */}
        <section className="bg-white border-b border-[#E8EAED]">
          <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <PageBreadcrumb
              variant="light"
              showHomeIcon
              className="mb-4"
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Blog' },
              ]}
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Consejos de nuestros técnicos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Guías prácticas, diagnósticos comunes y consejos de mantenimiento escritos
              por el equipo técnico de SomosTécnicos en Cali.
            </p>
          </div>
        </section>

        {/* Articles grid */}
        <section className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl border border-[#E8EAED] overflow-hidden
                           hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-white overflow-hidden border-b border-[#E8EAED]">
                  <Image
                    src={post.cardImage ?? post.heroImage}
                    alt={post.cardImageAlt ?? post.heroImageAlt}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-600'
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

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {post.relatedServiceLabel && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
                      <Wrench className="w-3 h-3 shrink-0" />
                      <span className="truncate">{post.relatedServiceLabel}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state — shown when no posts */}
          {posts.length === 0 && (
            <p className="text-center text-slate-500 py-20">
              Pronto publicaremos nuestros primeros artículos.
            </p>
          )}
        </section>

        {/* CTA banner */}
        <section className="max-w-5xl mx-auto px-4 pb-14">
          <div className="bg-primary rounded-2xl p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">
              ¿Tu electrodoméstico tiene un problema ahora?
            </h2>
            <p className="text-red-200 mb-6 text-sm">
              Técnicos a domicilio en Cali. Diagnóstico el mismo día.
            </p>
            <a
              href="https://wa.me/573003094854?text=Hola,%20necesito%20un%20técnico%20a%20domicilio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold
                         px-6 py-3 rounded-full text-sm hover:bg-red-50 transition-colors"
            >
              Solicitar técnico por WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
