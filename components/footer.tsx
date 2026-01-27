'use client'

import { Phone, Mail, Clock } from 'lucide-react'
import Image from 'next/image'
import { TermsLink } from './terms-link'

/**
 * Footer - 3 columnas responsive
 * - Logo y descripción
 * - Enlaces de navegación
 * - Información de contacto
 * - Copyright
 */
export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer id="footer" className="bg-[#2C3E50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/img_3d/logo modificado.jpeg"
                alt="SomosTécnicos"
                width={56}
                height={56}
                className="object-contain w-14 h-14"
              />
              <h3 className="text-2xl font-bold text-white">SomosTécnicos</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Servicio técnico profesional desde 2020. Reparación, instalación y
              mantenimiento de electrodomésticos a domicilio.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection('servicios')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Servicios
              </button>
              <button
                onClick={() => scrollToSection('seguimiento')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Seguimiento
              </button>
              <button
                onClick={() => scrollToSection('footer')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Contacto
              </button>
            </nav>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+573003094854"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone size={20} />
                <span>+57 300 309 48 54</span>
              </a>
              <a
                href="mailto:info@somostecnicos.co"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <Mail size={20} />
                <span>info@somostecnicos.co</span>
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>© 2025 SomosTécnicos. Todos los derechos reservados.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <TermsLink className="text-gray-400 hover:text-gray-200" showIcon={false}>
                Términos y Condiciones
              </TermsLink>
              <span className="text-gray-600">•</span>
              <TermsLink className="text-gray-400 hover:text-gray-200" showIcon={false}>
                Política de Privacidad
              </TermsLink>
              <span className="text-gray-600">•</span>
              <a
                href="/admin-info"
                className="text-gray-500 hover:text-gray-300 transition-colors"
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
