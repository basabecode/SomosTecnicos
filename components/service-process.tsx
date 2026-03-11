'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

/**
 * Proceso de Servicio — efectos dinámicos por tarjeta
 *
 * Efectos por paso (orquestados desde el hover del contenedor):
 *  1. Línea timeline vertical animada (scaleY al entrar en viewport)
 *  2. Círculo numerado: borde + número se iluminan en rojo
 *  3. Tarjeta: elevación + glow rojo con spring
 *  4. Barra de acento izquierda: scaleY desde arriba
 *  5. Shimmer: barrido de luz de izquierda a derecha
 *
 * Layout: idéntico al FAQ (7/5 grid, header, imagen card)
 */

const steps = [
  {
    number: '01',
    title: 'Solicita el Servicio',
    description: 'Completa el formulario con los detalles de la falla y tus datos de contacto.',
  },
  {
    number: '02',
    title: 'Asignación de Técnico',
    description: 'El sistema asigna al técnico más cercano y especializado para tu tipo de equipo.',
  },
  {
    number: '03',
    title: 'Confirmación de Visita',
    description: 'El técnico te contacta para acordar dirección, hora y fecha conveniente.',
  },
  {
    number: '04',
    title: 'Revisión y Diagnóstico',
    description: 'Inspección detallada del equipo. Esta visita tiene un costo de $50.000 abonables a la reparación.',
  },
  {
    number: '05',
    title: 'Cotización',
    description: 'Recibes una cotización clara antes de cualquier arreglo. Sin sorpresas.',
  },
  {
    number: '06',
    title: 'Reparación y Garantía',
    description: 'Con tu aprobación se realiza la reparación. Entregamos garantía escrita sobre el trabajo.',
  },
]

/* ── Variantes compartidas por paso ─────────────────────────── */
const circleVariants = {
  rest: {
    borderColor: 'rgba(226,232,240,1)',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  hover: {
    borderColor: 'rgba(165,0,52,1)',
    backgroundColor: 'rgba(254,242,242,1)',
  },
}

const numberVariants = {
  rest: { color: 'rgba(203,213,225,1)' },
  hover: { color: 'rgba(165,0,52,1)' },
}

const cardVariants = {
  rest: {
    y: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  hover: {
    y: -6,
    boxShadow:
      '0 20px 48px rgba(165,0,52,0.12), 0 6px 16px rgba(0,0,0,0.06)',
  },
}

const accentVariants = {
  rest: { scaleY: 0 },
  hover: { scaleY: 1 },
}

const shimmerVariants = {
  rest: { x: '-110%' },
  hover: { x: '210%' },
}

/* ─────────────────────────────────────────────────────────────── */

export default function ServiceProcess() {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* ── Header — idéntico al FAQ ── */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Proceso de servicio
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              ¿Cómo funciona nuestro servicio?
            </h2>
            <div className="mt-4 h-0.5 w-16 bg-primary rounded-full" />
          </motion.div>
        </div>

        {/* ── Grid 7/5 — idéntico al FAQ ── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">

          {/* ── Columna izquierda: timeline de pasos ── */}
          <div className="lg:col-span-7">
            <div className="relative">

              {/* Línea de timeline — se dibuja al entrar en viewport */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
                className="absolute left-5 top-5 bottom-12 w-px bg-linear-to-b from-primary via-primary/30 to-transparent origin-top pointer-events-none"
              />

              {steps.map((step, index) => (
                /* Wrapper de entrada — solo maneja la animación de aparición */
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.09 }}
                  className="pb-5 last:pb-0"
                >
                  {/* Wrapper de hover — orquesta TODOS los efectos del paso */}
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="flex items-start gap-4 cursor-default"
                  >
                    {/* ── Círculo numerado ── */}
                    <div className="relative shrink-0 z-10">
                      {/* Ring de pulso en hover */}
                      <motion.span
                        variants={{
                          rest: { scale: 1, opacity: 0 },
                          hover: { scale: 1.9, opacity: 0 },
                        }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border border-primary/40 pointer-events-none"
                      />
                      <motion.div
                        variants={circleVariants}
                        transition={{ duration: 0.22 }}
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
                      >
                        <motion.span
                          variants={numberVariants}
                          transition={{ duration: 0.22 }}
                          className="text-xs font-black tabular-nums leading-none"
                        >
                          {step.number}
                        </motion.span>
                      </motion.div>
                    </div>

                    {/* ── Tarjeta de contenido ── */}
                    <motion.div
                      variants={cardVariants}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      className="flex-1 relative overflow-hidden bg-white rounded-xl border border-slate-100 px-5 py-4"
                    >
                      {/* Barra de acento izquierda — se despliega desde arriba */}
                      <motion.div
                        variants={accentVariants}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary origin-top rounded-r-full"
                      />

                      {/* Shimmer — barre de izquierda a derecha */}
                      <motion.div
                        variants={shimmerVariants}
                        transition={{ duration: 0.65, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent pointer-events-none"
                      />

                      {/* Contenido */}
                      <h3 className="relative z-10 text-sm md:text-base font-semibold text-slate-800 mb-1 leading-snug">
                        {step.title}
                      </h3>
                      <p className="relative z-10 text-sm text-slate-500 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 pl-0 sm:pl-14"
            >
              <button
                onClick={() => {
                  document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200"
              >
                Solicitar Servicio Ahora
              </button>
            </motion.div>
          </div>

          {/* ── Columna derecha: imagen card — idéntica al FAQ ── */}
          <div className="hidden lg:block lg:col-span-5 self-stretch">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full min-h-120 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm"
            >
              <Image
                src="/img-3d/moto-roja.avif"
                alt="Técnico de SomosTécnicos en moto, listo para servicio a domicilio en Cali"
                fill
                className="object-contain object-center p-6"
                quality={95}
                sizes="(max-width: 1024px) 0vw, 30vw"
              />

              {/* Barra roja inferior — idéntica al FAQ */}
              <div
                className="absolute bottom-0 inset-x-0 h-1 bg-primary"
                aria-hidden="true"
              />

              {/* Badge flotante — idéntico al FAQ */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  Técnico a domicilio hoy
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
