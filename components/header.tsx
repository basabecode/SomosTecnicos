'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Menu,
  X,
  User,
  LogOut,
  UserPlus,
  Users,
  Wrench,
  ChevronDown,
  ChevronRight,
  Thermometer,
  WashingMachine,
  Wind,
  Flame,
  Droplets,
  Tv,
  Zap,
  Monitor,
  Camera,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { OrderTrackingModal } from '@/components/order-tracking-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface HeaderUser {
  id: number | string
  nombre?: string
  role: string
}

interface ProfileResponse {
  success: boolean
  user: HeaderUser
}

interface ServicioNavItem {
  label: string
  slug: string
  icon: React.ElementType
}

interface ServicioNavGroup {
  category: string
  items: ServicioNavItem[]
}

const SERVICIOS_GROUPS: ServicioNavGroup[] = [
  {
    category: 'Línea Blanca',
    items: [
      { label: 'Neveras', slug: 'reparacion-neveras-cali', icon: Thermometer },
      { label: 'Lavadoras', slug: 'reparacion-lavadoras-cali', icon: WashingMachine },
      { label: 'Secadoras', slug: 'reparacion-secadoras-cali', icon: Wind },
      { label: 'Estufas y Hornos', slug: 'reparacion-estufas-hornos-cali', icon: Flame },
      { label: 'Calentadores', slug: 'reparacion-calentadores-cali', icon: Droplets },
    ],
  },
  {
    category: 'Electrónica',
    items: [
      { label: 'Televisores', slug: 'reparacion-televisores-cali', icon: Tv },
      { label: 'Computadores y Redes', slug: 'tecnico-computadores-redes-cali', icon: Monitor },
    ],
  },
  {
    category: 'Instalaciones',
    items: [
      { label: 'Electricista', slug: 'electricista-a-domicilio-cali', icon: Zap },
      { label: 'Cámaras y Alarmas', slug: 'camaras-seguridad-alarmas-cali', icon: Camera },
    ],
  },
]

// Flat list still used for mobile accordion
const SERVICIOS_NAV: ServicioNavItem[] = SERVICIOS_GROUPS.flatMap(g => g.items)

/**
 * Header sticky con navegación responsive
 * - Logo izquierda (Link a /)
 * - Nav derecha con smooth scroll
 * - Dropdown de servicios en desktop (hover + click)
 * - Acordeón de servicios en mobile
 * - Hamburger menu para mobile
 * - Sombra al hacer scroll
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [user, setUser] = useState<HeaderUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)

  const servicesDropdownRef = useRef<HTMLDivElement>(null)
  const servicesButtonRef = useRef<HTMLButtonElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node) &&
        servicesButtonRef.current &&
        !servicesButtonRef.current.contains(event.target as Node)
      ) {
        setIsServicesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Verificar si el usuario está logueado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          const response = await fetch('/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const userData: ProfileResponse = await response.json()
            setUser(userData.user)
          } else {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const handleNavClick = (id: string) => {
    if (id === 'seguimiento') {
      setIsTrackingModalOpen(true)
      setIsMobileMenuOpen(false)
    } else {
      scrollToSection(id)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    window.location.href = '/'
  }

  const getDashboardUrl = () => {
    if (!user) return '/login'

    switch (user.role) {
      case 'admin':
        return '/admin/dashboard'
      case 'manager':
        return '/manager/dashboard'
      case 'technician':
        return '/technician/dashboard'
      case 'customer':
        return '/customer/dashboard'
      default:
        return '/admin/dashboard'
    }
  }

  const handleServicesMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsServicesDropdownOpen(true)
  }

  const handleServicesMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false)
    }, 200)
  }

  const handleDropdownMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handleDropdownMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false)
    }, 200)
  }

  const renderAuthSection = () => {
    if (isLoading) {
      return <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
    }

    if (user) {
      return (
        <div className="flex items-center gap-3">
          <Link
            href={getDashboardUrl()}
            className="flex items-center gap-2 text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium"
          >
            <User size={18} />
            <span className="hidden sm:inline">{user.nombre}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3">
        {/* Menú Desplegable de Registro */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-[#A50034] text-[#A50034] hover:bg-[#A50034] hover:text-white transition-colors"
            >
              <UserPlus size={18} />
              <span className="hidden sm:inline">Registrarse</span>
              <ChevronDown size={16} className="hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">
              Crear una cuenta
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/register/customer"
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users size={18} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Solo Clientes</div>
                  <div className="text-xs text-gray-500">
                    Solicita servicios técnicos
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/register/technician"
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wrench size={18} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Solo Técnicos</div>
                  <div className="text-xs text-gray-500">
                    Únete a nuestro equipo
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botón de Login */}
        <Link
          href="/login"
          className="flex items-center gap-2 bg-[#A50034] hover:bg-[#c9003f] text-white px-4 py-2 rounded-md transition-colors font-medium"
        >
          <User size={18} />
          <span className="hidden sm:inline">Iniciar Sesión</span>
        </Link>
      </div>
    )
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo — siempre enlaza al inicio */}
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="SomosTécnicos — Ir al inicio"
            >
              <Image
                src="/img-3d/logotipo_somostecnicos_nuevo_sin_fondo.png"
                alt="SomosTécnicos"
                width={150}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Inicio */}
              <Link
                href="/"
                className="text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium"
              >
                Inicio
              </Link>

              {/* Servicios con dropdown */}
              <div
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <button
                  ref={servicesButtonRef}
                  onClick={() => setIsServicesDropdownOpen(prev => !prev)}
                  className="flex items-center gap-1 text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium"
                  aria-expanded={isServicesDropdownOpen}
                  aria-haspopup="true"
                >
                  Servicios
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isServicesDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Panel dropdown: pt-2 en vez de mt-2 — sin gap para el mouse */}
                {isServicesDropdownOpen && (
                  <div
                    ref={servicesDropdownRef}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[480px]"
                    style={{ zIndex: 60 }}
                  >
                    {/* Panel visual */}
                    <div
                      className="bg-white rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                      style={{
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                    {/* Franja de color superior */}
                    <div className="h-1 bg-[#A50034]" />

                    {/* Header del panel */}
                    <div className="px-5 pt-4 pb-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Servicios disponibles en Cali
                      </p>
                    </div>

                    {/* Layout: columna izquierda (Línea Blanca) + columna derecha (Electrónica + Instalaciones) */}
                    <div className="px-4 pb-2 grid grid-cols-2 gap-x-4">
                      {/* Columna izquierda — Línea Blanca */}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2 px-1">
                          {SERVICIOS_GROUPS[0].category}
                        </p>
                        <div className="flex flex-col gap-0.5">
                          {SERVICIOS_GROUPS[0].items.map((servicio) => {
                            const Icon = servicio.icon
                            return (
                              <Link
                                key={servicio.slug}
                                href={`/servicios/${servicio.slug}`}
                                onClick={() => setIsServicesDropdownOpen(false)}
                                className="group/item flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-50/70 transition-colors duration-100"
                              >
                                <Icon size={14} className="flex-shrink-0 text-slate-400 group-hover/item:text-[#A50034] transition-colors" />
                                <span className="text-[13px] font-medium text-slate-700 group-hover/item:text-[#A50034] transition-colors leading-tight">
                                  {servicio.label}
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>

                      {/* Columna derecha — Electrónica + Instalaciones */}
                      <div className="flex flex-col gap-4">
                        {SERVICIOS_GROUPS.slice(1).map((group) => (
                          <div key={group.category}>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2 px-1">
                              {group.category}
                            </p>
                            <div className="flex flex-col gap-0.5">
                              {group.items.map((servicio) => {
                                const Icon = servicio.icon
                                return (
                                  <Link
                                    key={servicio.slug}
                                    href={`/servicios/${servicio.slug}`}
                                    onClick={() => setIsServicesDropdownOpen(false)}
                                    className="group/item flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-50/70 transition-colors duration-100"
                                  >
                                    <Icon size={14} className="flex-shrink-0 text-slate-400 group-hover/item:text-[#A50034] transition-colors" />
                                    <span className="text-[13px] font-medium text-slate-700 group-hover/item:text-[#A50034] transition-colors leading-tight">
                                      {servicio.label}
                                    </span>
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA footer */}
                    <div className="mx-4 mb-4 mt-2 bg-[#A50034] rounded-xl px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-white text-[13px] font-semibold leading-none">
                          ¿No encuentras tu servicio?
                        </p>
                        <p className="text-red-200 text-[11px] mt-0.5">
                          Ver el catálogo completo
                        </p>
                      </div>
                      <Link
                        href="/servicios"
                        onClick={() => setIsServicesDropdownOpen(false)}
                        className="flex items-center gap-1.5 bg-white text-[#A50034] text-[12px] font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        Ver todos
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seguimiento */}
              <button
                onClick={() => handleNavClick('seguimiento')}
                className="text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium"
              >
                Seguimiento
              </button>

              {/* Contacto */}
              <Link
                href="/contacto"
                className="text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium"
              >
                Contacto
              </Link>

              <Button
                onClick={() => scrollToSection('formulario')}
                className="bg-[#27AE60] hover:bg-[#229954] text-white"
              >
                Solicitar Servicio
              </Button>
              {renderAuthSection()}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#2C3E50]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-[#E0E0E0] animate-fade-in">
              <div className="flex flex-col gap-1">
                {/* Inicio */}
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium text-left py-2 px-1"
                >
                  Inicio
                </Link>

                {/* Servicios — acordeón */}
                <div>
                  <button
                    onClick={() => setIsMobileServicesOpen(prev => !prev)}
                    className="w-full flex items-center justify-between text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium text-left py-2 px-1"
                    aria-expanded={isMobileServicesOpen}
                  >
                    <span>Servicios</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isMobileServicesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Lista de servicios en acordeón */}
                  {isMobileServicesOpen && (
                    <div className="ml-3 mt-1 mb-2 flex flex-col gap-0.5 border-l-2 border-blue-100 pl-3">
                      {SERVICIOS_NAV.map(servicio => {
                        const Icon = servicio.icon
                        return (
                          <Link
                            key={servicio.slug}
                            href={`/servicios/${servicio.slug}`}
                            onClick={() => {
                              setIsMobileServicesOpen(false)
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center gap-2.5 py-2 text-sm text-slate-600 hover:text-[#A50034] transition-colors"
                          >
                            <Icon size={15} className="flex-shrink-0 text-slate-400" />
                            <span>{servicio.label}</span>
                          </Link>
                        )
                      })}
                      {/* Ver todos */}
                      <Link
                        href="/servicios"
                        onClick={() => {
                          setIsMobileServicesOpen(false)
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-2 py-2 text-sm font-semibold text-[#A50034] hover:text-[#A50034] transition-colors mt-1"
                      >
                        <ArrowRight size={14} />
                        Ver todos los servicios
                      </Link>
                    </div>
                  )}
                </div>

                {/* Seguimiento */}
                <button
                  onClick={() => handleNavClick('seguimiento')}
                  className="text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium text-left py-2 px-1"
                >
                  Seguimiento
                </button>

                {/* Contacto */}
                <Link
                  href="/contacto"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium text-left py-2 px-1"
                >
                  Contacto
                </Link>

                <div className="pt-2">
                  <Button
                    onClick={() => scrollToSection('formulario')}
                    className="bg-[#27AE60] hover:bg-[#229954] text-white w-full"
                  >
                    Solicitar Servicio
                  </Button>
                </div>

                {/* Mobile Auth Section */}
                <div className="pt-4 border-t border-gray-200 mt-2">
                  {isLoading ? (
                    <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
                  ) : user ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        href={getDashboardUrl()}
                        className="flex items-center gap-3 text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User size={20} />
                        <div>
                          <div>{user.nombre}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {user.role}
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors py-2"
                      >
                        <LogOut size={20} />
                        Cerrar Sesión
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {/* Opciones de Registro */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Crear una cuenta
                        </p>

                        {/* Registro Cliente */}
                        <Link
                          href="/register/customer"
                          className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">Soy Cliente</div>
                            <div className="text-xs text-gray-600">
                              Solicita servicios técnicos
                            </div>
                          </div>
                        </Link>

                        {/* Registro Técnico */}
                        <Link
                          href="/register/technician"
                          className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Wrench size={20} className="text-amber-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">Soy Técnico</div>
                            <div className="text-xs text-gray-600">
                              Únete a nuestro equipo
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Separador */}
                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-500">o</span>
                        </div>
                      </div>

                      {/* Login */}
                      <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 bg-[#A50034] hover:bg-[#c9003f] text-white py-3 rounded-md transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User size={20} />
                        Iniciar Sesión
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </>
  )
}
