"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/**
 * FAQ - Acordeón de preguntas frecuentes
 * - 5 preguntas con respuestas
 * - Animación suave al expandir
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
      answer: "Efectivo, transferencia o tarjeta de crédito/débito.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg text-[#7F8C8D]">Encuentra respuestas a las dudas más comunes</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-[#E0E0E0] rounded-lg px-6 data-[state=open]:border-[#A50034]"
            >
              <AccordionTrigger className="text-left font-semibold text-[#2C3E50] hover:text-[#A50034] hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#7F8C8D] leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
