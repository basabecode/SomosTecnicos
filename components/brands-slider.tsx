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
  {
    name: 'Samsung',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png',
    alt: 'Samsung logo',
  },
  {
    name: 'LG',
    logo: 'https://logos-world.net/wp-content/uploads/2020/07/LG-Logo.png',
    alt: 'LG logo',
  },
  {
    name: 'Whirlpool',
    logo: 'https://logos-world.net/wp-content/uploads/2021/02/Whirlpool-Logo.png',
    alt: 'Whirlpool logo',
  },
  {
    name: 'Electrolux',
    logo: 'https://logos-world.net/wp-content/uploads/2021/02/Electrolux-Logo.png',
    alt: 'Electrolux logo',
  },
  {
    name: 'GE',
    logo: 'https://logos-world.net/wp-content/uploads/2020/12/General-Electric-Logo.png',
    alt: 'GE logo',
  },
  {
    name: 'Bosch',
    logo: 'https://logos-world.net/wp-content/uploads/2020/08/Bosch-Logo.png',
    alt: 'Bosch logo',
  },
  {
    name: 'Frigidaire',
    logo: 'https://logos-world.net/wp-content/uploads/2021/02/Frigidaire-Logo.png',
    alt: 'Frigidaire logo',
  },
  {
    name: 'Maytag',
    logo: 'https://logos-world.net/wp-content/uploads/2021/02/Maytag-Logo.png',
    alt: 'Maytag logo',
  },
  {
    name: 'KitchenAid',
    logo: 'https://logos-world.net/wp-content/uploads/2021/02/KitchenAid-Logo.png',
    alt: 'KitchenAid logo',
  },
  {
    name: 'Siemens',
    logo: 'https://logos-world.net/wp-content/uploads/2020/06/Siemens-Logo.png',
    alt: 'Siemens logo',
  },
  {
    name: 'Panasonic',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Panasonic-Logo.png',
    alt: 'Panasonic logo',
  },
  {
    name: 'Sony',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png',
    alt: 'Sony logo',
  },
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
                      unoptimized // Para evitar problemas con URLs externas
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS personalizado para la animación */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite; /* Un poco más lento para mejor lectura de texto */
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-scroll {
            animation-duration: 25s;
          }
        }
      `}</style>
    </section>
  )
}
