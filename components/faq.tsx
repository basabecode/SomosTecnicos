'use client'
import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: '¿Cuál es el costo del servicio?',
    answer:
      'La visita de diagnóstico tiene un valor de $50.000 dentro de la ciudad — abonables al total de la reparación si la apruebas en el mes. El costo de la reparación varía según el equipo, la complejidad y los repuestos necesarios; no existe tarifa fija.',
  },
  {
    question: '¿Cuánto tiempo tarda la reparación?',
    answer:
      'Reparaciones simples se resuelven el mismo día. Fallas complejas o con repuestos especiales toman 2 a 3 días hábiles. Instalaciones de seguridad o redes pueden requerir 1 a 2 días según el alcance.',
  },
  {
    question: '¿Qué servicios ofrecen?',
    answer:
      'Reparación de electrodomésticos (neveras, lavadoras, secadoras, calentadores, aires acondicionados, estufas, microondas), servicios eléctricos residenciales y comerciales, soporte en computadores y redes, e instalación de sistemas de seguridad electrónica (cámaras CCTV, alarmas, control de acceso).',
  },
  {
    question: '¿Qué marcas de electrodomésticos atienden?',
    answer:
      'Atendemos todas las marcas: LG, Samsung, Whirlpool, Mabe, Electrolux, Haceb, Challenger, Frigidaire y más. En especialidades trabajamos con Schneider y Legrand (electricidad), HP, Dell, Lenovo y Apple (computación), e Hikvision y Dahua (seguridad).',
  },
  {
    question: '¿Tienen garantía en sus servicios?',
    answer:
      'Sí. Reparaciones de electrodomésticos: 30 días. Instalaciones eléctricas y de seguridad: 90 días. Servicios de computación y redes: 60 días. Si el problema vuelve dentro del período de garantía, lo resolvemos sin costo adicional.',
  },
  {
    question: '¿Cómo puedo pagar?',
    answer:
      'Aceptamos efectivo y transferencias bancarias. El pago se realiza al finalizar el servicio, una vez usted esté satisfecho con el trabajo realizado.',
  },
]

export default function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] relative overflow-hidden">
      {/* Decorative background word */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Todo lo que necesitas saber
          </h2>
          <div className="mt-4 h-0.5 w-16 bg-primary rounded-full" />
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* ── Accordion ──────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <Accordion
              type="single"
              collapsible
              className="space-y-0 divide-y divide-slate-100"
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="
                    group border-0 bg-transparent
                    data-[state=open]:bg-white
                    data-[state=open]:rounded-xl
                    data-[state=open]:shadow-sm
                    data-[state=open]:border
                    data-[state=open]:border-primary/15
                    transition-all duration-200
                    px-0
                  "
                >
                  <AccordionTrigger
                    className="
                      flex items-start gap-4 text-left w-full
                      hover:no-underline py-5 px-4
                      group-data-[state=open]:px-5 group-data-[state=open]:pt-5 group-data-[state=open]:pb-3
                      transition-all duration-200
                      [&>svg]:hidden
                    "
                  >
                    {/* Viñeta — rombo geométrico */}
                    <span className="shrink-0 mt-2" aria-hidden="true">
                      <span
                        className="
                          block w-2.5 h-2.5 rotate-45
                          border border-slate-200 bg-white
                          group-hover:border-primary/50 group-hover:bg-primary/10
                          group-data-[state=open]:bg-primary group-data-[state=open]:border-primary
                          transition-all duration-200
                        "
                      />
                    </span>

                    {/* Question + custom chevron */}
                    <div className="flex items-start justify-between gap-3 flex-1 min-w-0">
                      <span
                        className="
                        text-sm md:text-base font-semibold text-slate-700
                        group-hover:text-slate-900
                        group-data-[state=open]:text-slate-900
                        transition-colors duration-150 leading-snug
                      "
                      >
                        {faq.question}
                      </span>
                      {/* Custom +/− toggle */}
                      <span
                        className="
                        shrink-0 w-6 h-6 rounded-full border border-slate-200
                        group-data-[state=open]:border-primary group-data-[state=open]:bg-primary
                        flex items-center justify-center
                        transition-all duration-200 mt-0.5
                      "
                      >
                        <svg
                          className="w-3 h-3 text-slate-400 group-data-[state=open]:text-white transition-colors"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <line
                            x1="2"
                            y1="6"
                            x2="10"
                            y2="6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1="6"
                            y1="2"
                            x2="6"
                            y2="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className="origin-center transition-transform duration-200 group-data-[state=open]:scale-y-0"
                          />
                        </svg>
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 pb-5 pt-0">
                    {/* Red top rule */}
                    <div className="ml-10 pl-3 border-l-2 border-primary/20">
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* ── Right column ───────────────────────────────────────── */}
          <div className="hidden lg:block lg:col-span-5 self-stretch">
            <div className="relative w-full h-full min-h-[30rem] rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
              <Image
                src="/img-3d/tecnico_whatsapp.png"
                alt="Técnico SomosTécnicos"
                fill
                className="object-contain object-bottom p-6"
                quality={95}
                sizes="(max-width: 1024px) 0vw, 30vw"
              />

              {/* Bottom red accent bar */}
              <div
                className="absolute bottom-0 inset-x-0 h-1 bg-primary"
                aria-hidden="true"
              />

              {/* Floating label top-left */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  Técnicos disponibles hoy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
