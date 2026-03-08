import { Phone, Mail, Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { TermsLink } from './terms-link'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/blog', label: 'Blog técnico' },
  { href: '/barrios', label: 'Barrios' },
  { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/trabaja-con-nosotros', label: 'Trabaja con Nosotros' },
]

const SERVICIOS_LINKS = [
  { href: '/servicios/reparacion-neveras-cali', label: 'Neveras' },
  { href: '/servicios/reparacion-lavadoras-cali', label: 'Lavadoras' },
  { href: '/servicios/reparacion-calentadores-cali', label: 'Calentadores' },
  {
    href: '/servicios/reparacion-estufas-hornos-cali',
    label: 'Estufas y Hornos',
  },
  { href: '/servicios/reparacion-televisores-cali', label: 'Televisores' },
  { href: '/servicios/electricista-a-domicilio-cali', label: 'Electricista' },
  { href: '/servicios/tecnico-computadores-redes-cali', label: 'Computadores' },
  {
    href: '/servicios/camaras-seguridad-alarmas-cali',
    label: 'Cámaras y Alarmas',
  },
]

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3">
      {children}
    </h4>
  )
}

/**
 * Footer compacto — 4 columnas, tipografía unificada, logo blanco
 */
export default function Footer() {
  return (
    <footer id="footer" className="bg-[#2C3E50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Col 1: Logo + descripción */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3">
              <Image
                src="/img-3d/diseño-Logos-sinFondo.png"
                alt="SomosTécnicos"
                width={150}
                height={50}
                className="h-8 w-auto object-contain brightness-0 invert"
                quality={100}
                sizes="150px"
              />
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed mb-3">
              Técnicos certificados a domicilio en Cali. Reparación, instalación
              y mantenimiento de electrodomésticos y tecnología.
            </p>
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
              <MapPin size={12} className="shrink-0" />
              <span>Cali, Colombia · Lun–Sáb 8am–6pm</span>
            </div>
          </div>

          {/* Col 2: Navegación */}
          <div>
            <FooterHeading>Navegación</FooterHeading>
            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] text-slate-400 hover:text-white transition-colors duration-150"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Servicios */}
          <div>
            <FooterHeading>Servicios</FooterHeading>
            <nav className="flex flex-col gap-1.5">
              {SERVICIOS_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] text-slate-400 hover:text-white transition-colors duration-150"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Contacto */}
          <div className="col-span-2 md:col-span-1">
            <FooterHeading>Contacto</FooterHeading>
            <div className="flex flex-col gap-2.5">
              <a
                href="tel:+573003094854"
                className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-white transition-colors duration-150"
              >
                <Phone size={14} className="shrink-0 text-slate-500" />
                +57 300 309 4854
              </a>
              <a
                href="mailto:soporte@somostecnicos.com"
                className="flex items-center gap-2.5 text-[13px] text-slate-400 hover:text-white transition-colors duration-150"
              >
                <Mail size={14} className="shrink-0 text-slate-500" />
                <span className="break-all">soporte@somostecnicos.com</span>
              </a>
              <div className="flex items-center gap-2.5 text-[13px] text-slate-400">
                <Clock size={14} className="shrink-0 text-slate-500" />
                Lun–Sáb · 8am – 6pm
              </div>
            </div>
          </div>
        </div>

        {/* Barra de copyright */}
        <div className="border-t border-white/10 mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            © 2026 SomosTécnicos · Cali, Colombia. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <TermsLink
              className="text-slate-500 hover:text-slate-300 transition-colors"
              showIcon={false}
            >
              Términos y Condiciones
            </TermsLink>
            <span className="text-slate-600">·</span>
            <TermsLink
              className="text-slate-500 hover:text-slate-300 transition-colors"
              showIcon={false}
            >
              Privacidad
            </TermsLink>
            <span className="text-slate-600">·</span>
            <a
              href="/admin-info"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Funcionamiento
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}



