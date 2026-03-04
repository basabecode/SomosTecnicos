/**
 * SitelinksNav — Componente de navegación estructurada estilo Google Sitelinks.
 *
 * Propósito dual:
 * 1. Visual: muestra las páginas principales del sitio en formato lista legible.
 * 2. SEO: usa HTML5 semántico (<nav>, <ul>, <li>, <a>) que refuerza la señal
 *    de navegación que Google necesita para generar Sitelinks automáticamente.
 *
 * Nota: Google genera Sitelinks de forma algorítmica. Este componente mejora
 * las señales (estructura clara + schema JSON-LD en page.tsx), pero no garantiza
 * que aparezcan en los resultados.
 */

import Link from 'next/link'

interface SitelinkItem {
  href: string
  title: string
  description: string
}

const SITELINKS: SitelinkItem[] = [
  {
    href: '/',
    title: 'Inicio',
    description: 'Servicio técnico a domicilio en Cali y alrededores. Técnicos certificados, garantía incluida.',
  },
  {
    href: '/servicios',
    title: 'Nuestros Servicios',
    description: 'Reparación de neveras, lavadoras, calentadores, estufas, televisores, electricidad y cámaras de seguridad.',
  },
  {
    href: '/sobre-nosotros',
    title: 'Sobre Nosotros',
    description: 'Conoce al equipo de técnicos certificados con experiencia en Cali y el Valle del Cauca.',
  },
  {
    href: '/contacto',
    title: 'Contacto',
    description: 'Solicita tu servicio técnico, resuelve dudas o agenda una visita de diagnóstico.',
  },
  {
    href: '/admin-info',
    title: 'Seguimiento de Órdenes',
    description: 'Consulta el estado de tu orden de reparación en tiempo real desde tu dispositivo.',
  },
]

export default function SitelinksNav() {
  return (
    <section
      aria-labelledby="sitelinks-heading"
      className="bg-white py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          id="sitelinks-heading"
          className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-6"
        >
          Explora SomosTécnicos
        </h2>

        {/* Navegación semántica — señal clave para Google Sitelinks */}
        <nav aria-label="Páginas principales del sitio">
          <ul className="divide-y divide-[#E8EAED]">
            {SITELINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-4 py-4 px-2 rounded-lg transition-colors hover:bg-slate-50/70"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span
                      className="text-[#A50034] text-[18px] font-medium leading-snug
                                 no-underline group-hover:underline group-hover:underline-offset-2
                                 truncate"
                    >
                      {link.title}
                    </span>
                    <span className="text-[#4D5156] text-[14px] leading-relaxed line-clamp-2">
                      {link.description}
                    </span>
                  </div>

                  {/* Ícono de navegabilidad */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-[#A50034] transition-colors"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
