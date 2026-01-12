"use client"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageCircle } from "lucide-react"
import AIChat from '@/components/ai-chat'

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
        "El costo del arreglo varía según el tipo de electrodoméstico, complejidad y repuesto requerido. Visita técnica para revisión del electrodoméstico y diagnóstico: 50 mil pesos.",
    },
    {
      question: "¿Cuánto tiempo tarda la reparación?",
      answer: "Depende del problema. Reparaciones simples: mismo día. Complejas: 2-3 días hábiles.",
    },
    {
      question: "¿Qué marcas atienden?",
      answer: "Atendemos todas las marcas: LG, Samsung, Whirlpool, Mabe, Electrolux, Haceb, Challenger, etc.",
    },
    {
      question: "¿Tienen garantía?",
      answer: "Sí, 30 días en reparaciones y 90 días en instalaciones.",
    },
    {
      question: "¿Cómo puedo pagar?",
      answer: "Efectivo y transferencias banacarias.",
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

                {/* Componente Chat IA Integrado - Posicionado sobre el botón */}
                <AIChat
                  hideTrigger={true}
                  className="absolute bottom-0 right-0 z-50 mr-4 mb-4"
                />
            </div>
        </div>
      </div>
    </section>
  )
}
