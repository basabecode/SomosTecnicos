import { Metadata } from 'next'
import { BLOG_POSTS } from '@/lib/seo/blog-data'
import Header from '@/components/header'
import Footer from '@/components/footer'
import PageBreadcrumb from '@/components/page-breadcrumb'
import BlogClient from './blog-client'

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

export default function BlogPage() {
  const posts = Object.values(BLOG_POSTS).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F9FA] pt-16 md:pt-20">
        {/* Hero */}
        <section className="bg-white border-b border-[#E8EAED]">
          <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
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

        {/* Blog interactivo: filtros + grid + ver más */}
        <BlogClient posts={posts} />

        {/* CTA banner */}
        <section className="max-w-6xl mx-auto px-4 pb-14">
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
