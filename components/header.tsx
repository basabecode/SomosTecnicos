'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  Menu,
  X,
  User,
  LogOut,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Lazy: sólo se carga cuando el usuario pulsa "Seguimiento"
const OrderTrackingModal = dynamic(
  () => import('@/components/order-tracking-modal').then(m => ({ default: m.OrderTrackingModal })),
  { ssr: false }
)

interface HeaderUser {
  id: number | string
  nombre?: string
  role: string
}

interface ProfileResponse {
  success: boolean
  user: HeaderUser
}

interface NavItem {
  label: string
  slug: string
  icon: React.ElementType
}

interface NavGroup {
  category: string
  items: NavItem[]
}

// ─── Datos de Servicios ────────────────────────────────────────────────────
const SERVICIOS_GROUPS: NavGroup[] = [
  {
    category: 'Línea Blanca',
    items: [
      { label: 'Neveras',          slug: 'reparacion-neveras-cali',          icon: Thermometer  },
      { label: 'Lavadoras',        slug: 'reparacion-lavadoras-cali',        icon: WashingMachine },
      { label: 'Secadoras',        slug: 'reparacion-secadoras-cali',        icon: Wind         },
      { label: 'Estufas y Hornos', slug: 'reparacion-estufas-hornos-cali',   icon: Flame        },
      { label: 'Calentadores',     slug: 'reparacion-calentadores-cali',     icon: Droplets     },
    ],
  },
  {
    category: 'Electrónica',
    items: [
      { label: 'Televisores',         slug: 'reparacion-televisores-cali',    icon: Tv      },
      { label: 'Computadores y Redes',slug: 'tecnico-computadores-redes-cali',icon: Monitor },
    ],
  },
  {
    category: 'Instalaciones',
    items: [
      { label: 'Electricista',     slug: 'electricista-a-domicilio-cali',   icon: Zap    },
      { label: 'Cámaras y Alarmas',slug: 'camaras-seguridad-alarmas-cali',  icon: Camera },
    ],
  },
]

const SERVICIOS_NAV: NavItem[] = SERVICIOS_GROUPS.flatMap(g => g.items)

// ─── Datos de Blog ─────────────────────────────────────────────────────────
const BLOG_GROUPS: NavGroup[] = [
  {
    category: 'Electrodomésticos',
    items: [
      { label: 'Neveras',          slug: 'neveras',       icon: Thermometer   },
      { label: 'Lavadoras',        slug: 'lavadoras',     icon: WashingMachine },
      { label: 'Secadoras',        slug: 'secadoras',     icon: Wind          },
      { label: 'Estufas y Hornos', slug: 'estufas-hornos',icon: Flame         },
      { label: 'Calentadores',     slug: 'calentadores',  icon: Droplets      },
    ],
  },
  {
    category: 'Tecnología',
    items: [
      { label: 'Televisores',  slug: 'televisores',  icon: Tv      },
      { label: 'Computadores', slug: 'computadores', icon: Monitor },
    ],
  },
  {
    category: 'Hogar',
    items: [
      { label: 'Electricidad', slug: 'electricidad', icon: Zap    },
      { label: 'Seguridad',    slug: 'seguridad',    icon: Camera },
    ],
  },
]

const BLOG_NAV: NavItem[] = BLOG_GROUPS.flatMap(g => g.items)

// ─── Componentes auxiliares ────────────────────────────────────────────────

/** Un ítem dentro de cualquiera de los dos paneles dropdown */
function DropdownNavItem({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: React.ElementType
  label: string
  href: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group/item flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-red-50 transition-colors duration-150"
    >
      <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover/item:bg-red-100 flex items-center justify-center shrink-0 transition-colors duration-150">
        <Icon size={13} className="text-slate-400 group-hover/item:text-primary transition-colors" />
      </div>
      <span className="text-[13px] font-medium text-slate-700 group-hover/item:text-primary transition-colors leading-tight">
        {label}
      </span>
    </Link>
  )
}

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
      className="group relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary transition-colors duration-200 rounded-md"
    >
      {children}
      <span className="absolute bottom-1 left-3 right-3 h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </Link>
  )
}

// ──────────────────────────────────────────────────────────────────────────
export default function Header() {
  const [isScrolled, setIsScrolled]               = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)
  const [isMobileBlogOpen, setIsMobileBlogOpen]   = useState(false)
  /** Cuál de los dos paneles desktop está abierto (null = ninguno) */
  const [openDropdown, setOpenDropdown]           = useState<'services' | 'blog' | null>(null)
  const [user, setUser]                           = useState<HeaderUser | null>(null)
  const [isLoading, setIsLoading]                 = useState(true)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Helpers de hover unificados ──────────────────────────────────────────
  const openMenu = (menu: 'services' | 'blog') => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setOpenDropdown(menu)
  }

  const scheduleClose = () => {
    hoverTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 200)
  }

  const cancelClose = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
  }

  const closeDropdown = () => setOpenDropdown(null)

  // ── Efectos ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    // passive:true evita que el listener bloquee el scroll del compositor (mejora TBT/FID)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          const response = await fetch('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
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
        if ((error as Error).name !== 'AbortError') {
          console.error('Error verificando autenticación:', error)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }
    checkAuth()
    return () => controller.abort()
  }, [])

  // ── Auth ─────────────────────────────────────────────────────────────────
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
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
      case 'admin':      return '/admin/dashboard'
      case 'manager':    return '/manager/dashboard'
      case 'technician': return '/technician/dashboard'
      case 'customer':   return '/customer/dashboard'
      default:           return '/admin/dashboard'
    }
  }

  const renderAuthSection = () => {
    if (isLoading) return <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-lg" />

    if (user) {
      return (
        <div className="flex items-center gap-1">
          <Link
            href={getDashboardUrl()}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={14} className="text-primary" />
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
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-200 px-3 py-2 rounded-lg hover:border-primary hover:text-primary transition-all duration-200">
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
                <span className="font-semibold text-[13px] text-slate-900 leading-none">Soy Cliente</span>
                <span className="text-xs text-slate-500 mt-0.5">Solicita servicios técnicos</span>
              </Link>
            </DropdownMenuItem>
            <div className="my-1 mx-2 border-t border-slate-200" />
            <DropdownMenuItem asChild>
              <Link
                href="/register/technician"
                className="flex flex-col items-start text-left px-2.5 py-2 rounded-lg cursor-pointer border border-transparent hover:border-emerald-100 hover:bg-emerald-50 transition-all duration-150 focus:bg-emerald-50"
              >
                <span className="font-semibold text-[13px] text-slate-900 leading-none">Soy Técnico</span>
                <span className="text-xs text-slate-500 mt-0.5">Únete y ofrece tus servicios</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/login"
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
        >
          <span className="hidden sm:inline">Iniciar Sesión</span>
        </Link>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
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
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center hover:opacity-75 transition-opacity duration-200"
              aria-label="SomosTécnicos — Ir al inicio"
            >
              <Image
                src="/img-3d/diseño-Logos-sinFondo.avif"
                alt="SomosTécnicos"
                width={160}
                height={48}
                className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto object-contain"
                quality={100}
                sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 140px, 160px"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <NavLink href="/">Inicio</NavLink>
              <span className="w-px h-4 bg-slate-200 mx-0.5 shrink-0" />

              {/* ── Dropdown: Servicios ─────────────────────────────────── */}
              <div
                className="relative"
                onMouseEnter={() => openMenu('services')}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => setOpenDropdown(prev => prev === 'services' ? null : 'services')}
                  className="group relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary transition-colors duration-200 rounded-md"
                  aria-expanded={openDropdown === 'services'}
                  aria-haspopup="true"
                >
                  Servicios
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 group-hover:text-primary transition-all duration-200 ${
                      openDropdown === 'services' ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                  <span className="absolute bottom-1 left-3 right-3 h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </button>

                {openDropdown === 'services' && (
                  <div
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="absolute top-full left-0 pt-2 w-60"
                    style={{ zIndex: 60 }}
                  >
                    <div
                      className="bg-white rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.07)' }}
                    >
                      <div className="h-0.5 bg-gradient-to-r from-primary to-[#c9003f]" />

                      {SERVICIOS_GROUPS.map((group, i) => (
                        <div key={group.category} className={i > 0 ? 'border-t border-slate-100' : ''}>
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 px-3 pt-2.5 pb-1">
                            {group.category}
                          </p>
                          <div className="px-2 pb-2">
                            {group.items.map(item => {
                              const Icon = item.icon
                              return (
                                <Link
                                  key={item.slug}
                                  href={`/servicios/${item.slug}`}
                                  onClick={closeDropdown}
                                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] font-medium text-slate-700 hover:text-primary hover:bg-red-50 transition-colors duration-150 group/item"
                                >
                                  <Icon size={13} className="text-slate-400 group-hover/item:text-primary shrink-0 transition-colors" />
                                  {item.label}
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="border-t border-slate-100 px-3 py-2">
                        <Link
                          href="/servicios"
                          onClick={closeDropdown}
                          className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
                        >
                          Ver todos los servicios <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <span className="w-px h-4 bg-slate-200 mx-0.5 shrink-0" />

              {/* Seguimiento */}
              <button
                onClick={() => handleNavClick('seguimiento')}
                className="group relative px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary transition-colors duration-200 rounded-md"
              >
                Seguimiento
                <span className="absolute bottom-1 left-3 right-3 h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </button>
              <span className="w-px h-4 bg-slate-200 mx-0.5 shrink-0" />

              {/* ── Dropdown: Blog ──────────────────────────────────────── */}
              <div
                className="relative"
                onMouseEnter={() => openMenu('blog')}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => setOpenDropdown(prev => prev === 'blog' ? null : 'blog')}
                  className="group relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary transition-colors duration-200 rounded-md"
                  aria-expanded={openDropdown === 'blog'}
                  aria-haspopup="true"
                >
                  Blog
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 group-hover:text-primary transition-all duration-200 ${
                      openDropdown === 'blog' ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                  <span className="absolute bottom-1 left-3 right-3 h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </button>

                {openDropdown === 'blog' && (
                  <div
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64"
                    style={{ zIndex: 60 }}
                  >
                    <div
                      className="bg-white rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.07)' }}
                    >
                      <div className="h-0.5 bg-gradient-to-r from-primary to-[#c9003f]" />

                      {BLOG_GROUPS.map((group, i) => (
                        <div key={group.category} className={i > 0 ? 'border-t border-slate-100' : ''}>
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 px-3 pt-2.5 pb-1">
                            {group.category}
                          </p>
                          <div className="px-2 pb-2">
                            {group.items.map(item => {
                              const Icon = item.icon
                              return (
                                <Link
                                  key={item.slug}
                                  href={`/blog?tema=${item.slug}`}
                                  onClick={closeDropdown}
                                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] font-medium text-slate-700 hover:text-primary hover:bg-red-50 transition-colors duration-150 group/item"
                                >
                                  <Icon size={13} className="text-slate-400 group-hover/item:text-primary shrink-0 transition-colors" />
                                  {item.label}
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="border-t border-slate-100 px-3 py-2">
                        <Link
                          href="/blog"
                          onClick={closeDropdown}
                          className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
                        >
                          Ver todos los artículos <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <span className="w-px h-4 bg-slate-200 mx-0.5 shrink-0" />
              <NavLink href="/contacto">Contacto</NavLink>

              <div className="w-px h-5 bg-slate-200 mx-2" />

              <button
                onClick={() => scrollToSection('formulario')}
                className="flex items-center gap-1.5 bg-[#27AE60] hover:bg-[#1e9e52] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200 mr-1"
              >
                Solicitar Servicio

              </button>

              {renderAuthSection()}
            </nav>

            {/* Hamburguesa mobile */}
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

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-250">
            {/* Cabecera */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Image
                src="/img-3d/diseño-Logos-sinFondo.avif"
                alt="SomosTécnicos"
                width={140}
                height={40}
                className="h-6 sm:h-7 w-auto object-contain"
                quality={100}
                sizes="(max-width: 640px) 90px, 110px"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary hover:bg-red-50 rounded-xl transition-colors"
              >
                Inicio
              </Link>

              {/* Servicios acordeón */}
              <div>
                <button
                  onClick={() => setIsMobileServicesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary hover:bg-red-50 rounded-xl transition-colors"
                  aria-expanded={isMobileServicesOpen}
                >
                  <span>Servicios</span>
                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isMobileServicesOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l-2 border-red-100 flex flex-col gap-0.5">
                    {SERVICIOS_NAV.map(item => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.slug}
                          href={`/servicios/${item.slug}`}
                          onClick={() => { setIsMobileServicesOpen(false); setIsMobileMenuOpen(false) }}
                          className="flex items-center gap-2.5 px-2 py-2 text-sm text-slate-600 hover:text-primary hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icon size={14} className="shrink-0 text-slate-400" />
                          {item.label}
                        </Link>
                      )
                    })}
                    <Link
                      href="/servicios"
                      onClick={() => { setIsMobileServicesOpen(false); setIsMobileMenuOpen(false) }}
                      className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-primary hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <ArrowRight size={13} /> Ver todos los servicios
                    </Link>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick('seguimiento')}
                className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary hover:bg-red-50 rounded-xl transition-colors text-left"
              >
                Seguimiento de Orden
              </button>

              {/* Blog acordeón */}
              <div>
                <button
                  onClick={() => setIsMobileBlogOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary hover:bg-red-50 rounded-xl transition-colors"
                  aria-expanded={isMobileBlogOpen}
                >
                  <span>Blog</span>
                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform duration-200 ${isMobileBlogOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isMobileBlogOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l-2 border-red-100 flex flex-col gap-0.5">
                    {BLOG_NAV.map(item => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.slug}
                          href={`/blog?tema=${item.slug}`}
                          onClick={() => { setIsMobileBlogOpen(false); setIsMobileMenuOpen(false) }}
                          className="flex items-center gap-2.5 px-2 py-2 text-sm text-slate-600 hover:text-primary hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icon size={14} className="shrink-0 text-slate-400" />
                          {item.label}
                        </Link>
                      )
                    })}
                    <Link
                      href="/blog"
                      onClick={() => { setIsMobileBlogOpen(false); setIsMobileMenuOpen(false) }}
                      className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-primary hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <ArrowRight size={13} /> Ver todos los artículos
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary hover:bg-red-50 rounded-xl transition-colors"
              >
                Contacto
              </Link>

              <div className="pt-2">
                <button
                  onClick={() => { scrollToSection('formulario'); setIsMobileMenuOpen(false) }}
                  className="w-full flex items-center justify-center gap-2 bg-[#27AE60] hover:bg-[#1e9e52] text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm"
                >
                  Solicitar Servicio <ArrowRight size={15} />
                </button>
              </div>
            </nav>

            {/* Auth section mobile */}
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
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{user.nombre}</div>
                      <div className="text-xs text-slate-500 capitalize">{user.role}</div>
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
                    className="flex items-center gap-3 p-3 border border-slate-200 hover:border-primary hover:bg-red-50 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <Users size={15} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Soy Cliente</div>
                      <div className="text-xs text-slate-500">Solicita servicios técnicos</div>
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
                      <div className="text-sm font-medium text-slate-900">Soy Técnico</div>
                      <div className="text-xs text-slate-500">Únete al equipo</div>
                    </div>
                  </Link>
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-slate-400">o</span>
                    </div>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
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
