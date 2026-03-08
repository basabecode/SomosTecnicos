import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, AlertTriangle, Lightbulb, Info, Wrench, Phone } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { BLOG_POSTS } from '@/lib/seo/blog-data'
import { buildBlogPostJsonLd } from '@/lib/seo/schema-builders'
import PageBreadcrumb from '@/components/page-breadcrumb'

const BASE_URL = 'https://somostecnicos.com'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS[slug]
  if (!post) return {}

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: post.canonicalPath },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${BASE_URL}${post.canonicalPath}`,
      type: 'article',
      publishedTime: post.publishedAt,
      locale: 'es_CO',
      siteName: 'SomosTécnicos',
      images: [
        {
          url: (post.cardImage ?? post.heroImage).startsWith('http')
            ? (post.cardImage ?? post.heroImage)
            : `${BASE_URL}${post.cardImage ?? post.heroImage}`,
          alt: post.cardImageAlt ?? post.heroImageAlt,
        },
      ],
    },
    robots: { index: true, follow: true },
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  mantenimiento: 'bg-blue-50 text-blue-700',
  reparacion: 'bg-red-50 text-red-700',
  consejos: 'bg-green-50 text-green-700',
  guias: 'bg-purple-50 text-purple-700',
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS[slug]
  if (!post) notFound()

  const schemas = buildBlogPostJsonLd(post)

  // Related posts (same category, excluding current)
  const related = Object.values(BLOG_POSTS)
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3) // Mostramos 3 para un grid balanceado

  return (
    <>
      <Header />

      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen bg-[#F8F9FA] pt-16 md:pt-20">
        {/* Encabezado Editorial */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumb en la parte superior, alineado con el texto */}
              <PageBreadcrumb
                variant="light"
                showHomeIcon
                className="mb-6 sm:mb-8"
                items={[
                  { label: 'Inicio', href: '/' },
                  { label: 'Blog', href: '/blog' },
                  { label: post.title },
                ]}
              />

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {post.categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min de lectura
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <time dateTime={post.publishedAt} className="text-sm text-slate-500 w-full sm:w-auto mt-2 sm:mt-0">
                  {new Date(post.publishedAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* Título y extracto */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-justify font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
                {post.title}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed text-justify">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* Contenedor de la Imagen Principal Controlada */}
        <div className="bg-white pb-10 border-b border-[#E8EAED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {/* Aspect ratio restringido y el contenedor más pequeño (max-w-2xl) para que no sea inmensa */}
              <div className="relative w-full aspect-square sm:aspect-video rounded-2xl overflow-hidden bg-white border border-[#E8EAED]">
                <Image
                  src={post.cardImage ?? post.heroImage}
                  alt={post.cardImageAlt ?? post.heroImageAlt}
                  fill
                  className="object-contain p-4 sm:p-8"
                  priority
                  sizes="(max-width: 1024px) 100vw, 768px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Article body */}
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Contenido principal centrado mediante el wrapper mx-auto */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-6 sm:p-10">

            {post.sections.map((section, i) => (
              <section key={i} className="mb-8 last:mb-0">
                <h2 className="text-xl font-bold text-slate-900 mb-4 leading-snug">
                  {section.heading}
                </h2>

                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="text-slate-700 leading-relaxed mb-4 last:mb-0"
                    dangerouslySetInnerHTML={{
                      __html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                    }}
                  />
                ))}

                {/* Tips box */}
                {section.tips && section.tips.length > 0 && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="text-sm font-semibold text-green-800">
                        Consejos prácticos
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {section.tips.map((tip, k) => (
                        <li key={k} className="flex items-start gap-2 text-sm text-green-900">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warning box */}
                {section.warning && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900">{section.warning}</p>
                    </div>
                  </div>
                )}

                {/* Highlight / dato clave */}
                {section.highlight && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900 font-medium">{section.highlight}</p>
                    </div>
                  </div>
                )}
              </section>
            ))}

            {/* FAQ section */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="mt-10 pt-8 border-t border-[#E8EAED]">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Preguntas frecuentes
                </h2>
                <div className="space-y-5">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className="border border-[#E8EAED] rounded-lg p-5">
                      <h3 className="text-[15px] font-semibold text-slate-900 mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA in-article */}
            {post.relatedServiceSlug && (
              <div className="mt-10 bg-primary rounded-xl p-6 text-white text-center">
                <div className="flex justify-center mb-3">
                  <Wrench className="w-6 h-6 text-red-200" />
                </div>
                <p className="font-semibold mb-1">{post.relatedServiceLabel}</p>
                <p className="text-red-200 text-sm mb-4">
                  Técnicos certificados a domicilio en Cali. El mismo día.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/573003094854?text=Hola,%20necesito%20un%20técnico%20a%20domicilio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary
                               font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-red-50 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <Link
                    href={`/servicios/${post.relatedServiceSlug}`}
                    className="inline-flex items-center justify-center gap-2 border border-white/40
                               text-white font-semibold px-5 py-2.5 rounded-full text-sm
                               hover:bg-white/10 transition-colors"
                  >
                    Ver servicio
                  </Link>
                </div>
              </div>
            )}
            </div>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Artículos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group bg-white rounded-xl border border-[#E8EAED] overflow-hidden hover:shadow-md hover:border-slate-300 transition-all flex flex-col max-w-80 justify-self-center sm:justify-self-start w-full"
                >
                  {/* Imagen — formato vertical, máximo ancho bloqueado para no ser gigante */}
                  <div className="relative w-full aspect-[3/4] bg-white overflow-hidden border-b border-[#E8EAED]">
                    <Image
                      src={rp.cardImage ?? rp.heroImage}
                      alt={rp.cardImageAlt ?? rp.heroImageAlt}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400">{rp.readTime} min</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 leading-snug
                                  group-hover:text-primary transition-colors line-clamp-3">
                      {rp.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Phone CTA strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4
                          bg-white border border-[#E8EAED] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-slate-700">
                <strong>¿Necesitas un técnico en Cali?</strong>{' '}
                Llamamos en menos de 10 minutos.
              </p>
            </div>
            <a
              href="tel:+573003094854"
              className="shrink-0 bg-primary text-white text-sm font-semibold
                         px-5 py-2.5 rounded-full hover:bg-primary/80 transition-colors"
            >
              Llamar ahora
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
