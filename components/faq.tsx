"use client"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageCircle } from "lucide-react"

/**
 * FAQ - Acordeón de preguntas frecuentes
 * - Grid 7/5 columnas para mejor balance visual
 * - Imagen compacta y adaptada
 * - Icono de chat integrado que abre el Asistente IA
 */
export default function FAQ() {
  const faqs = [
    {
      question: "¿Cuál es el costo del servicio?",
      answer:
        "El costo varía según el tipo de servicio y complejidad. Visita técnica para diagnóstico: 50 mil pesos dentro de la ciudad (abonable al total de la reparación). Servicios de electrodomésticos, electricidad, computación y seguridad tienen tarifas específicas según el trabajo requerido.",
    },
    {
      question: "¿Cuánto tiempo tarda la reparación?",
      answer: "Depende del problema. Reparaciones simples: mismo día. Complejas: 2-3 días hábiles. Instalaciones de seguridad o redes pueden tomar 1-2 días según la complejidad.",
    },
    {
      question: "¿Qué servicios ofrecen?",
      answer: "Reparación de electrodomésticos (neveras, lavadoras, aires, etc.), servicios de electricidad (cableado, tableros, iluminación), soporte de computadores y redes, e instalación de sistemas de seguridad (cámaras, alarmas, control de acceso).",
    },
    {
      question: "¿Qué marcas atienden?",
      answer: "Atendemos todas las marcas de electrodomésticos: LG, Samsung, Whirlpool, Mabe, Electrolux, Haceb, Challenger. En especialidades: Schneider, Legrand, Siemens (electricidad), HP, Dell, Lenovo, Cisco (computación), Hikvision, Dahua (seguridad).",
    },
    {
      question: "¿Tienen garantía?",
      answer: "Sí, 30 días en reparaciones de electrodomésticos, 90 días en instalaciones eléctricas y de seguridad, y 60 días en servicios de computación y redes.",
    },
    {
      question: "¿Cómo puedo pagar?",
      answer: "Aceptamos efectivo y transferencias bancarias.",
    },
  ]

  const triggerChat = () => {
    const event = new CustomEvent('openAIChat', { detail: { fromHero: true } })
    window.dispatchEvent(event)
  }

  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg text-[#7F8C8D]">Encuentra respuestas a las dudas más comunes</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: FAQ Accordion - Takes up more space now (7/12) */}
            <div className="lg:col-span-7">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-[#E0E0E0] rounded-lg px-6 data-[state=open]:border-[#A50034] bg-white overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-semibold text-[#2C3E50] hover:text-[#A50034] hover:no-underline py-4 text-sm md:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#7F8C8D] leading-relaxed pb-4 text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right Column: Support Image & Chat Icon - Compact size (5/12) */}
            <div className="lg:col-span-5 relative flex flex-col items-end">
                <div className="relative h-[380px] w-full hidden lg:block rounded-xl overflow-hidden bg-gray-50/50 self-center border border-gray-100 shadow-inner">
                     <Image
                        src="/img_3d/tecnico_whatsapp.png"
                        alt="Soporte Técnico en línea"
                        fill
                        className="object-contain object-bottom p-4"
                        quality={95}
                        sizes="(max-width: 1024px) 100vw, 30vw"
                     />

                     {/* Floating Chat Button */}
                     <div
                        onClick={triggerChat}
                        className="absolute bottom-6 right-6 z-20 group cursor-pointer transition-transform duration-300 hover:scale-105"
                     >
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                            <div className="relative h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg border-2 border-white">
                                 <MessageCircle className="h-7 w-7 text-white" />
                            </div>
                          </div>
                          <div className="absolute -top-10 right-0 bg-[#2C3E50] px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap arrow-bottom">
                              <p className="text-[10px] font-bold text-white tracking-wide">¡Contáctanos!</p>
                          </div>
                     </div>
                </div>

                </div>
            </div>
        </div>
    </section>
  )
}
