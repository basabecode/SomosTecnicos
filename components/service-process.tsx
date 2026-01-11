'use client'

import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Componente: Proceso de Servicio
 * Explica paso a paso cómo funciona la solicitud de servicio técnico
 */

const steps = [
  {
    number: '01',
    title: 'Solicita el Servicio',
    description: 'Completa el formulario con los detalles de la falla de tu electrodoméstico y datos personales.',
  },
  {
    number: '02',
    title: 'Asignación de Técnico',
    description: 'Nuestro sistema asigna el técnico más cercano y especializado para tu caso.',
  },
  {
    number: '03',
    title: 'Confirmación de Visita',
    description: 'El técnico se comunica para validar la dirección, hora y fecha más conveniente para ti.',
  },
  {
    number: '04',
    title: 'Revisión y Diagnóstico',
    description: 'El técnico realiza una inspección detallada y determina el problema exacto. Esta visita tiene costo.',
  },
  {
    number: '05',
    title: 'Cotización',
    description: 'Recibes una cotización detallada antes de cualquier arreglo, y el costo de la visita se añade a la reparación.',
  },
  {
    number: '06',
    title: 'Reparación',
    description: 'Una vez aprobada la cotización, el técnico procede con la reparación, en algunos casos se requiere abono del arreglo.',
  },
]

export default function ServiceProcess() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#F8F9FA] via-white to-[#E3F2FD] relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-50 to-transparent opacity-30 -z-0" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-pink-50 to-transparent opacity-30 -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#2C3E50] leading-[1.15] tracking-tight mb-4">
              ¿Cómo Funciona Nuestro Servicio?
            </h2>
            <p className="text-lg text-[#64748B] max-w-3xl mx-auto">
              Un proceso simple y transparente de 6 pasos. Nuestros técnicos se dirigen directamente a tu domicilio.
            </p>
          </motion.div>
        </div>

        {/* Grid de pasos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                {/* Número del paso */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#A50034] to-[#c9003f] flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>

                {/* Contenido */}
                <h3 className="text-xl font-bold text-[#2C3E50] mb-3 mt-2">
                  {step.title}
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sección de imágenes - Técnicos a domicilio */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
            {/* Columna de texto */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#A50034]/10 border border-[#A50034]/20">
                <span className="text-[#A50034] font-semibold text-sm">Servicio a Domicilio</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-extrabold text-[#2C3E50] leading-tight">
                Nuestros técnicos van hasta tu hogar
              </h3>

              <p className="text-lg text-[#64748B] leading-relaxed">
                No necesitas llevar tu electrodoméstico a ningún lado (solo en casos excepcionales). Nuestros técnicos certificados se desplazan a tu domicilio con todas las herramientas y repuestos necesarios, es lo que normalmente sucede en la mayoría de servicios.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#27AE60]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2C3E50] mb-1">Equipados Profesionalmente</h4>
                    <p className="text-sm text-[#64748B]">Herramientas especializadas y repuestos originales</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#27AE60]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2C3E50] mb-1">Movilidad Garantizada</h4>
                    <p className="text-sm text-[#64748B]">Motos o vehiculos equipadas para llegar a cualquier zona</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#27AE60]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2C3E50] mb-1">Puntualidad Asegurada</h4>
                    <p className="text-sm text-[#64748B]">Respetamos tu tiempo con horarios confirmados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna de imágenes */}
            <div className="grid grid-cols-1 gap-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative h-96 md:h-[600px] rounded-3xl overflow-hidden shadow-lg"
              >
                <Image
                  src="/img_3d/moto_roja_tecnico.jpg"
                  alt="Técnico en moto"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-semibold text-lg drop-shadow-lg">Servicio Rápido</p>
                  <p className="text-white/90 text-sm drop-shadow-md">Técnico en moto</p>
                </div>
              </motion.div>

              {/*<motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src="/img_3d/tecnico_en_vans.png"
                  alt="Técnico en van"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-sm">Equipamiento Completo</p>
                  <p className="text-white/80 text-xs">Van con herramientas</p>
                </div>
              </motion.div> */}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-[#64748B] mb-4">
            ¿Listo para solicitar tu servicio?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('formulario')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="px-8 py-4 bg-[#A50034] hover:bg-[#c9003f] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Solicitar Servicio Ahora
          </button>
        </motion.div>
      </div>
    </section>
  )
}
