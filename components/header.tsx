'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  X,
  User,
  LogOut,
  UserPlus,
  Users,
  Wrench,
  ChevronDown,
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
      {
        label: 'Lavadoras',
        slug: 'reparacion-lavadoras-cali',
        icon: WashingMachine,
      },
      { label: 'Secadoras', slug: 'reparacion-secadoras-cali', icon: Wind },
      {
        label: 'Estufas y Hornos',
        slug: 'reparacion-estufas-hornos-cali',
        icon: Flame,
      },
      {
        label: 'Calentadores',
        slug: 'reparacion-calentadores-cali',
        icon: Droplets,
      },
    ],
  },
  {
    category: 'Electrónica',
    items: [
      { label: 'Televisores', slug: 'reparacion-televisores-cali', icon: Tv },
      {
        label: 'Computadores y Redes',
        slug: 'tecnico-computadores-redes-cali',
        icon: Monitor,
      },
    ],
  },
  {
    category: 'Instalaciones',
    items: [
      {
        label: 'Electricista',
        slug: 'electricista-a-domicilio-cali',
        icon: Zap,
      },
      {
        label: 'Cámaras y Alarmas',
        slug: 'camaras-seguridad-alarmas-cali',
        icon: Camera,
      },
    ],
  },
]

const SERVICIOS_NAV: ServicioNavItem[] = SERVICIOS_GROUPS.flatMap(g => g.items)

/** Nav link con subrayado animado desde la izquierda */
function NavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#A50034] transition-colors duration-200 rounded-md"
    >
      {children}
      <span className="absolute bottom-1 left-3 right-3 h-px bg-[#A50034] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </Link>
  )
}

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
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          const response = await fetch('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
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
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setIsServicesDropdownOpen(true)
  }

  const handleServicesMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(
      () => setIsServicesDropdownOpen(false),
      200
    )
  }

  const handleDropdownMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
  }

  const handleDropdownMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(
      () => setIsServicesDropdownOpen(false),
      200
    )
  }

  const renderAuthSection = () => {
    if (isLoading) {
      return <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-lg" />
    }

    if (user) {
      return (
        <div className="flex items-center gap-1">
          <Link
            href={getDashboardUrl()}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#A50034] transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <div className="w-7 h-7 bg-[#A50034]/10 rounded-full flex items-center justify-center">
              <User size={14} className="text-[#A50034]" />
            </div>
            <span className="hidden sm:inline">{user.nombre}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-200 px-3 py-2 rounded-lg hover:border-[#A50034] hover:text-[#A50034] transition-all duration-200">
              <UserPlus size={15} />
              <span className="hidden sm:inline">Registrarse</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 px-2 pt-1 pb-1.5">
              Crear cuenta
            </p>
            <DropdownMenuItem asChild>
              <Link
                href="/register/customer"
                className="flex flex-col items-start text-left px-2.5 py-2 rounded-lg cursor-pointer mb-1 border border-transparent hover:border-red-100 hover:bg-red-50 transition-all duration-150 focus:bg-red-50"
              >
                <span className="font-semibold text-[13px] text-slate-900 leading-none">
                  Soy Cliente
                </span>
                <span className="text-xs text-slate-500 mt-0.5">
                  Solicita servicios técnicos
                </span>
              </Link>
            </DropdownMenuItem>
            <div className="my-1 mx-2 border-t border-slate-200" />
            <DropdownMenuItem asChild>
              <Link
                href="/register/technician"
                className="flex flex-col items-start text-left px-2.5 py-2 rounded-lg cursor-pointer border border-transparent hover:border-emerald-100 hover:bg-emerald-50 transition-all duration-150 focus:bg-emerald-50"
              >
                <span className="font-semibold text-[13px] text-slate-900 leading-none">
                  Soy Técnico
                </span>
                <span className="text-xs text-slate-500 mt-0.5">
                  Únete y ofrece tus servicios
                </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/login"
          className="flex items-center gap-1.5 bg-[#A50034] hover:bg-[#8a002b] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
        >
          <User size={15} />
          <span className="hidden sm:inline">Iniciar Sesión</span>
        </Link>
      </div>
    )
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm'
            : 'bg-white border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center hover:opacity-75 transition-opacity duration-200"
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
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink href="/">Inicio</NavLink>

              {/* Servicios con dropdown */}
              <div
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <button
                  ref={servicesButtonRef}
                  onClick={() => setIsServicesDropdownOpen(prev => !prev)}
                  className="group relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#A50034] transition-colors duration-200 rounded-md"
                  aria-expanded={isServicesDropdownOpen}
                  aria-haspopup="true"
                >
                  Servicios
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 group-hover:text-[#A50034] transition-all duration-200 ${
                      isServicesDropdownOpen ? 'rotate-180 text-[#A50034]' : ''
                    }`}
                  />
                  <span className="absolute bottom-1 left-3 right-3 h-px bg-[#A50034] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </button>

                {isServicesDropdownOpen && (
                  <div
                    ref={servicesDropdownRef}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[500px]"
                    style={{ zIndex: 60 }}
                  >
                    <div
                      className="bg-white rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{
                        boxShadow:
                          '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(0,0,0,0.07)',
                      }}
                    >
                      {/* Accent line */}
                      <div className="h-0.5 bg-gradient-to-r from-[#A50034] via-[#c9003f] to-[#A50034]" />

                      {/* Panel header */}
                      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-50">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          Servicios en Cali
                        </p>
                        <Link
                          href="/servicios"
                          onClick={() => setIsServicesDropdownOpen(false)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#A50034] hover:underline"
                        >
                          Ver todos <ArrowRight size={10} />
                        </Link>
                      </div>

                      {/* Grid de servicios */}
                      <div className="px-4 py-3 grid grid-cols-2 gap-x-3">
                        {/* Columna izquierda — Línea Blanca */}
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2 px-2">
                            {SERVICIOS_GROUPS[0].category}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            {SERVICIOS_GROUPS[0].items.map(servicio => {
                              const Icon = servicio.icon
                              return (
                                <Link
                                  key={servicio.slug}
                                  href={`/servicios/${servicio.slug}`}
                                  onClick={() =>
                                    setIsServicesDropdownOpen(false)
                                  }
                                  className="group/item flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-red-50 transition-colors duration-150"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover/item:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                                    <Icon
                                      size={13}
                                      className="text-slate-400 group-hover/item:text-[#A50034] transition-colors"
                                    />
                                  </div>
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
                          {SERVICIOS_GROUPS.slice(1).map(group => (
                            <div key={group.category}>
                              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2 px-2">
                                {group.category}
                              </p>
                              <div className="flex flex-col gap-0.5">
                                {group.items.map(servicio => {
                                  const Icon = servicio.icon
                                  return (
                                    <Link
                                      key={servicio.slug}
                                      href={`/servicios/${servicio.slug}`}
                                      onClick={() =>
                                        setIsServicesDropdownOpen(false)
                                      }
                                      className="group/item flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-red-50 transition-colors duration-150"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover/item:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                                        <Icon
                                          size={13}
                                          className="text-slate-400 group-hover/item:text-[#A50034] transition-colors"
                                        />
                                      </div>
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
                      <div className="mx-4 mb-4 bg-gradient-to-r from-[#A50034] to-[#c9003f] rounded-xl px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-white text-[13px] font-semibold leading-tight">
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
                          Ver todos <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seguimiento */}
              <button
                onClick={() => handleNavClick('seguimiento')}
                className="group relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#A50034] transition-colors duration-200 rounded-md"
              >
                Seguimiento
                <span className="absolute bottom-1 left-3 right-3 h-px bg-[#A50034] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </button>

              <NavLink href="/contacto">Contacto</NavLink>

              {/* Divisor */}
              <div className="w-px h-5 bg-slate-200 mx-2" />

              {/* CTA principal */}
              <button
                onClick={() => scrollToSection('formulario')}
                className="flex items-center gap-1.5 bg-[#27AE60] hover:bg-[#1e9e52] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200 mr-1"
              >
                Solicitar Servicio
                <ArrowRight size={14} />
              </button>

              {renderAuthSection()}
            </nav>

            {/* Botón hamburguesa mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — panel deslizante desde la derecha */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-250">
            {/* Cabecera del panel */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Image
                src="/img-3d/logotipo_somostecnicos_nuevo_sin_fondo.png"
                alt="SomosTécnicos"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#A50034] hover:bg-red-50 rounded-xl transition-colors"
              >
                Inicio
              </Link>

              {/* Servicios — acordeón */}
              <div>
                <button
                  onClick={() => setIsMobileServicesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#A50034] hover:bg-red-50 rounded-xl transition-colors"
                  aria-expanded={isMobileServicesOpen}
                >
                  <span>Servicios</span>
                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isMobileServicesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isMobileServicesOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l-2 border-red-100 flex flex-col gap-0.5">
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
                          className="flex items-center gap-2.5 px-2 py-2 text-sm text-slate-600 hover:text-[#A50034] hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icon
                            size={14}
                            className="flex-shrink-0 text-slate-400"
                          />
                          {servicio.label}
                        </Link>
                      )
                    })}
                    <Link
                      href="/servicios"
                      onClick={() => {
                        setIsMobileServicesOpen(false)
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-[#A50034] hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <ArrowRight size={13} /> Ver todos los servicios
                    </Link>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick('seguimiento')}
                className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#A50034] hover:bg-red-50 rounded-xl transition-colors text-left"
              >
                Seguimiento de Orden
              </button>

              <Link
                href="/contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#A50034] hover:bg-red-50 rounded-xl transition-colors"
              >
                Contacto
              </Link>

              {/* CTA */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    scrollToSection('formulario')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#27AE60] hover:bg-[#1e9e52] text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm"
                >
                  Solicitar Servicio <ArrowRight size={15} />
                </button>
              </div>
            </nav>

            {/* Auth section */}
            <div className="px-4 pb-6 pt-4 border-t border-slate-100">
              {isLoading ? (
                <div className="h-10 bg-slate-100 animate-pulse rounded-xl" />
              ) : user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={getDashboardUrl()}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <div className="w-9 h-9 bg-[#A50034]/10 rounded-full flex items-center justify-center">
                      <User size={16} className="text-[#A50034]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {user.nombre}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-1">
                    Acceso
                  </p>
                  <Link
                    href="/register/customer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 border border-slate-200 hover:border-[#A50034] hover:bg-red-50 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <Users size={15} className="text-[#A50034]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        Soy Cliente
                      </div>
                      <div className="text-xs text-slate-500">
                        Solicita servicios técnicos
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/register/technician"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 border border-slate-200 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Wrench size={15} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        Soy Técnico
                      </div>
                      <div className="text-xs text-slate-500">
                        Únete al equipo
                      </div>
                    </div>
                  </Link>
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-slate-400">
                        o
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#A50034] hover:bg-[#8a002b] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                  >
                    <User size={15} /> Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </>
  )
}
