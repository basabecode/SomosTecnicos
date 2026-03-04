'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export default function ServiceTypes() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    let hasPlayed = false

    // Usar 'canplay' en vez de 'loadedmetadata': garantiza que el video
    // tiene frames listos para renderizar, evitando el parpadeo blanco
    const handleCanPlay = () => {
      setIsVideoLoaded(true)
    }

    videoElement.addEventListener('canplay', handleCanPlay)

    // Si el video ya estaba en caché y canplay no se dispara
    if (videoElement.readyState >= 3) {
      setIsVideoLoaded(true)
    }

    // Intersection Observer para reproducir cuando sea visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            videoElement.play().catch(() => {
              // Silenciar errores de autoplay
            })
            hasPlayed = true
          }
        })
      },
      {
        threshold: 0.25,
        rootMargin: '50px'
      }
    )

    observer.observe(videoElement)

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay)
      observer.disconnect()
    }
  }, [])

  const scrollToForm = () => {
    const element = document.getElementById('formulario')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const services = [
    {
      title: 'Reparación Especializada',
      description: 'Diagnóstico y solución de fallas. Recuperamos su equipo.',
      badgeLabel: 'Inmediata',
      accentColor: 'border-l-[#A50034]',
      badgeColor: 'text-[#A50034] border-[#A50034]',
    },
    {
      title: 'Instalación Calificada',
      description: 'Montaje seguro de equipos nuevos o en caso de traslados y reconexión.',
      badgeLabel: 'Calificada',
      accentColor: 'border-l-[#2C3E50]',
      badgeColor: 'text-[#2C3E50] border-[#2C3E50]',
    },
    {
      title: 'Mantenimiento Preventivo',
      description: 'Limpieza y ajustes para extender la vida útil de tu equipo y mejorar su eficiencia.',
      badgeLabel: 'Calidad',
      accentColor: 'border-l-[#27AE60]',
      badgeColor: 'text-[#27AE60] border-[#27AE60]',
    },
  ]

  return (
    <section id="servicios" className="py-20 bg-gray-50 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Contenedor Principal Adaptable */}
        <div className="flex flex-col md:block md:relative md:min-h-[480px] items-center">

          {/* Video: Full width en mobile (250px alto), 85% width en desktop (full alto) */}
          <div className="relative w-full h-[250px] md:absolute md:left-0 md:top-0 md:bottom-0 md:h-full md:w-[85%] rounded-3xl overflow-hidden shadow-xl z-10 order-1 md:order-none">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out"
              style={{ opacity: isVideoLoaded ? 1 : 0 }}
            >
              <source src="/video/video_reparacion_ok.mp4" type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>

            {/* Poster: imagen visible mientras el video no esté listo, fade-out al cargar */}
            <div
              className="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none"
              style={{ opacity: isVideoLoaded ? 0 : 1 }}
            >
              <Image
                src="/video/postal-video.png"
                alt="Técnico reparando electrodoméstico en el hogar"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 85vw"
                className="object-cover object-center"
              />
            </div>

            {/* Gradiente */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Texto dentro del video, alineado abajo a la izquierda */}
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 max-w-sm z-20">
               <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
                 Expertos en su Hogar
               </h2>
               <p className="text-white/95 text-sm font-medium drop-shadow-md">
                 Soluciones técnicas integrales en lavadoras, neveras, calentadores, estufas y televisores.
               </p>
            </div>
          </div>

          {/* Columna de Tarjetas: Grid en mobile, Columna absoluta en desktop */}
          <div className="w-full px-0 mt-4 md:mt-0 md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[28%] z-20 flex flex-col gap-3 md:justify-between md:gap-0 md:py-6 md:pr-2 order-2 md:order-none">
            {services.map((service, index) => (
              <Card
                key={index}
                onClick={scrollToForm}
                className={`
                  cursor-pointer border-0 shadow-md md:shadow-lg bg-white/95 backdrop-blur-md
                  transition-all duration-300 hover:scale-[1.02] md:hover:scale-100 md:hover:-translate-x-2 md:hover:shadow-xl
                  border-l-[5px] ${service.accentColor}
                  rounded-xl md:rounded-r-xl md:rounded-l-sm overflow-hidden
                  md:h-full md:max-h-[140px]
                  flex flex-col justify-center
                `}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full gap-2 md:gap-0">
                  <div>
                    <h3 className="text-base font-bold text-[#2C3E50] mb-1 leading-tight group-hover:text-black transition-colors">
                       {service.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-snug line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-0 md:mt-2">
                     <Badge variant="outline" className={`${service.badgeColor} bg-white text-[10px] px-2 h-5`}>
                        {service.badgeLabel}
                     </Badge>
                     <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#2C3E50] flex items-center gap-1 transition-colors uppercase tracking-wider">
                        Ver <ArrowRight className="w-3 h-3" />
                     </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
