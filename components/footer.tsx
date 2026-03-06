import { Phone, Mail, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { TermsLink } from './terms-link'

/**
 * Footer - 3 columnas responsive
 * - Logo y descripción
 * - Enlaces de navegación
 * - Información de contacto
 * - Copyright
 */
export default function Footer() {
  return (
    <footer id="footer" className="bg-[#2C3E50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Columna 1: Logo y descripción */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/img-3d/logotipo-ST.png"
                alt="SomosTécnicos"
                width={56}
                height={56}
                className="object-contain w-14 h-14"
              />
              <h3 className="text-2xl font-bold text-white">somostecnicos</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              Servicio Técnico Especializado en reparación, instalación y mantenimiento de equipos domésticos y tecnológicos. Con más de 5 años de experiencia en los hogares colombianos.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Navegación</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/servicios', label: 'Servicios' },
                { href: '/blog', label: 'Blog técnico' },
                { href: '/barrios', label: 'Barrios que cubrimos' },
                { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
                { href: '/contacto', label: 'Contacto' },
                { href: '/admin-info', label: 'Seguimiento de Órdenes' },
                { href: '/trabaja-con-nosotros', label: 'Trabaja con Nosotros' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Servicios</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/servicios/reparacion-neveras-cali', label: 'Neveras' },
                { href: '/servicios/reparacion-lavadoras-cali', label: 'Lavadoras' },
                { href: '/servicios/reparacion-calentadores-cali', label: 'Calentadores' },
                { href: '/servicios/reparacion-estufas-hornos-cali', label: 'Estufas y Hornos' },
                { href: '/servicios/reparacion-televisores-cali', label: 'Televisores' },
                { href: '/servicios/electricista-a-domicilio-cali', label: 'Electricista' },
                { href: '/servicios/tecnico-computadores-redes-cali', label: 'Computadores' },
                { href: '/servicios/camaras-seguridad-alarmas-cali', label: 'Cámaras y Alarmas' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Contacto</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+573003094854"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone size={20} />
                <span>+57 3003094854</span>
              </a>
              <a
                href="mailto:soporte@somostecnicos.com"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <Mail size={20} />
                <span>soporte@somostecnicos.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock size={20} />
                <span>Lun-Sáb 8am-6pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="flex flex-col gap-6 text-gray-400">
            {/* Copyright y créditos */}
            <div className="flex items-center justify-center text-sm text-center">
              <p className="text-gray-400">© 2026 SomosTécnicos — Cali, Colombia. Todos los derechos reservados.</p>
            </div>

            {/* Enlaces legales */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
              <TermsLink className="text-gray-400 hover:text-gray-200 whitespace-nowrap" showIcon={false}>
                Términos y Condiciones
              </TermsLink>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <TermsLink className="text-gray-400 hover:text-gray-200 whitespace-nowrap" showIcon={false}>
                Política de Privacidad
              </TermsLink>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <a
                href="/admin-info"
                className="text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap"
                title="Información del Panel Administrativo"
              >
                Información y Funcionamiento
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
