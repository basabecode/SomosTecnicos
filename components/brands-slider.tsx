/**
 * Slider de Marcas - Componente Independiente
 * Animación horizontal infinita con marcas de electrodomésticos
 */

'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export interface Brand {
  name: string
  logo: string
  alt: string
}

export const APPLIANCE_BRANDS: Brand[] = [
  { name: 'Samsung',    logo: '/logos/samsung.svg',    alt: 'Logo Samsung' },
  { name: 'LG',         logo: '/logos/lg.svg',         alt: 'Logo LG' },
  { name: 'Whirlpool',  logo: '/logos/whirlpool.svg',  alt: 'Logo Whirlpool' },
  { name: 'Electrolux', logo: '/logos/electrolux.svg', alt: 'Logo Electrolux' },
  { name: 'Bosch',      logo: '/logos/bosch.svg',      alt: 'Logo Bosch' },
  { name: 'Mabe',       logo: '/logos/mabe.svg',       alt: 'Logo Mabe' },
  { name: 'Haceb',      logo: '/logos/haceb.svg',      alt: 'Logo Haceb' },
  { name: 'Challenger', logo: '/logos/challenger.svg', alt: 'Logo Challenger' },
  { name: 'Kalley',     logo: '/logos/kalley.svg',     alt: 'Logo Kalley' },
  { name: 'Frigidaire', logo: '/logos/frigidaire.svg', alt: 'Logo Frigidaire' },
  { name: 'Panasonic',  logo: '/logos/panasonic.svg',  alt: 'Logo Panasonic' },
  { name: 'Sony',       logo: '/logos/sony.svg',       alt: 'Logo Sony' },
]

interface BrandsSliderProps {
  title?: string
  description?: string
  brands?: Brand[]
  className?: string
}

/**
 * BrandsSlider - Slider infinito de marcas
 * - Animación CSS pura para mejor rendimiento
 * - Responsive design
 * - Hover effects
 * - Fallback a texto si imagen no carga
 */
export default function BrandsSlider({
  title = "Marcas que Reparamos",
  description = "Trabajamos con todas las marcas líderes del mercado",
  brands = APPLIANCE_BRANDS,
  className = ""
}: BrandsSliderProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (brandName: string) => {
    setImageErrors(prev => ({ ...prev, [brandName]: true }))
  }

  // Duplicar marcas para animación infinita suave
  const duplicatedBrands = [...brands, ...brands]

  return (
    <section className={`py-4 bg-gradient-to-r from-blue-50/30 via-gray-50/50 to-blue-50/30 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header compacto */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Gradient overlays for smooth edges con el nuevo fondo */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-blue-50/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-blue-50/30 to-transparent z-10 pointer-events-none" />

          {/* Scrolling container más compacto */}
          <div className="flex space-x-8 animate-scroll">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 w-28 h-16 flex items-center justify-center group"
              >
                {imageErrors[brand.name] || !brand.logo ? (
                  // Fallback to text logo más compacto
                  <div className="text-lg font-bold text-gray-400 group-hover:text-gray-600 transition-colors duration-300 text-center px-2">
                    {brand.name}
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={brand.logo}
                      alt={brand.alt}
                      width={100}
                      height={50}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                      onError={() => handleImageError(brand.name)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
