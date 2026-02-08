'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, User, LogOut, UserPlus, Users, Wrench, ChevronDown } from 'lucide-react'
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

/**
 * Header sticky con navegación responsive
 * - Logo izquierda
 * - Nav derecha con smooth scroll
 * - Hamburger menu para mobile
 * - Sombra al hacer scroll
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<HeaderUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
          className="flex items-center gap-2 bg-[#A50034] hover:bg-[#E74C3C] text-white px-4 py-2 rounded-md transition-colors font-medium"
        >
          <User size={18} />
          <span className="hidden sm:inline">Iniciar Sesión</span>
        </Link>
      </div>
    )
  }

  const navLinks = [
    { label: 'Inicio', id: 'hero' },
    { label: 'Servicios', id: 'servicios' },
    { label: 'Seguimiento', id: 'seguimiento' },
    { label: 'Contacto', id: 'footer' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/img_3d/somos_tecnicos.png"
                alt="SomosTécnicos"
                width={100}
                height={25}
                className="h-6 w-auto object-contain"
                priority
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium"
                >
                  {link.label}
                </button>
              ))}
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
              <div className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="text-[#2C3E50] hover:text-[#A50034] transition-colors font-medium text-left py-2"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  onClick={() => scrollToSection('formulario')}
                  className="bg-[#27AE60] hover:bg-[#229954] text-white w-full"
                >
                  Solicitar Servicio
                </Button>

                {/* Mobile Auth Section */}
                <div className="pt-4 border-t border-gray-200">
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
                        className="flex items-center justify-center gap-2 bg-[#A50034] hover:bg-[#E74C3C] text-white py-3 rounded-md transition-colors font-medium"
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
