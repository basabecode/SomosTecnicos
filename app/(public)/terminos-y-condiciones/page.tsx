import { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { TERMS_CONTENT, TERMS_VERSION, TERMS_LAST_UPDATED } from '@/lib/terms-and-conditions'
import TermsModalTrigger from './_components/TermsModalTrigger'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | SomosTécnicos',
  description:
    'Términos y condiciones de uso de la plataforma SomosTécnicos. Conoce tus derechos y obligaciones al solicitar servicios técnicos a domicilio en Cali.',
  alternates: { canonical: '/terminos-y-condiciones' },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  const lastUpdated = new Date(TERMS_LAST_UPDATED).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {TERMS_CONTENT.introduction.title}
          </h1>
          <p className="text-gray-500 text-sm">
            Versión {TERMS_VERSION} · Última actualización: {lastUpdated}
          </p>
        </div>

        {/* Introducción */}
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-8">
          {TERMS_CONTENT.introduction.content}
        </p>

        {/* Secciones de los T&C — visibles para Google */}
        <div className="space-y-6">
          {TERMS_CONTENT.sections.map((section) => (
            <div key={section.id} className="border-l-4 border-primary/20 pl-4">
              <h2 className="font-bold text-base text-gray-900 mb-2">{section.title}</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Botón para abrir el modal interactivo */}
        <TermsModalTrigger />
      </div>
    </div>
  )
}
