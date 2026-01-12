/**
 * Página de Información del Panel Administrativo
 * Información sobre las funcionalidades del sistema para administradores
 */

import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestión Administrativa y Reportes',
  description: 'Conoce las herramientas de gestión de SomosTécnicos: Dashboard, control de técnicos, reportes avanzados y seguimiento operativo.',
}
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Users,
  ClipboardList,
  Settings,
  Shield,
  Activity,
  ArrowLeft,
  LogIn,
  Eye,
  Edit,
  FileText,
  PieChart,
  TrendingUp,
  UserCheck,
  Wrench,
} from 'lucide-react'

export default function AdminInfoPage() {
  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Principal',
      description:
        'Métricas en tiempo real, estadísticas de órdenes, ingresos y rendimiento del equipo.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: ClipboardList,
      title: 'Gestión de Órdenes',
      description:
        'Lista completa, filtros avanzados, seguimiento de estados y asignación de técnicos.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Users,
      title: 'Administración de Técnicos',
      description:
        'Gestión del equipo, disponibilidad, especialidades y rendimiento individual.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: PieChart,
      title: 'Reportes y Análisis',
      description:
        'Informes detallados, análisis geográfico, tendencias y métricas de negocio.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Shield,
      title: 'Control de Acceso',
      description:
        'Sistema de roles y permisos para diferentes niveles de administración.',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Activity,
      title: 'Monitoreo en Tiempo Real',
      description:
        'Seguimiento en vivo de órdenes activas, técnicos disponibles y alertas.',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ]

  const roles = [
    {
      name: 'Super Administrador',
      description: 'Acceso completo a todas las funcionalidades del sistema',
      permissions: [
        'Gestión completa de órdenes',
        'Administración de técnicos',
        'Reportes avanzados',
        'Configuración del sistema',
      ],
      badge: 'bg-red-100 text-red-800',
    },
    {
      name: 'Administrador',
      description: 'Gestión operativa del día a día',
      permissions: [
        'Gestión de órdenes',
        'Asignación de técnicos',
        'Reportes operativos',
        'Seguimiento de rendimiento',
      ],
      badge: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Manager de Técnicos',
      description: 'Coordinación y supervisión del equipo técnico',
      permissions: [
        'Gestión de técnicos',
        'Asignaciones',
        'Reportes de equipo',
        'Seguimiento de órdenes',
      ],
      badge: 'bg-green-100 text-green-800',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al inicio
              </Link>
            </div>
            <Link href="/admin/login">
              <Button className="bg-[#A50034] hover:bg-[#E74C3C]">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Panel Administrativo TecnoCity
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema completo de gestión para servicios técnicos. Controla
            órdenes, gestiona tu equipo y obtén insights detallados del
            rendimiento de tu negocio.
          </p>
        </div>

        {/* Funcionalidades Principales */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Funcionalidades Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tipos de Usuario */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Roles y Permisos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <Badge className={role.badge}>
                      {role.name.split(' ')[0]}
                    </Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Permisos:
                  </h4>
                  <ul className="space-y-2">
                    {role.permissions.map((permission, permIndex) => (
                      <li key={permIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">
                          {permission}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Capturas de Pantalla / Preview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Vista Previa del Sistema
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                  Dashboard Principal
                </CardTitle>
                <CardDescription>
                  Vista general con métricas clave y acceso rápido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-48 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-800 font-medium">
                      Dashboard Interactivo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5 text-green-600" />
                  Gestión de Órdenes
                </CardTitle>
                <CardDescription>
                  Lista completa con filtros y gestión avanzada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 h-48 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">
                      Control Total de Órdenes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Credenciales de Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🔑 Acceso de Demostración
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-6 text-center">
              Puedes probar el sistema usando cualquiera de estas credenciales
              de demostración:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-red-800 mb-2">Super Admin</h3>
                <p className="text-sm text-red-600 font-mono">
                  admin@servicio.com
                </p>
                <p className="text-sm text-red-600 font-mono">admin123</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-blue-800 mb-2">Manager</h3>
                <p className="text-sm text-blue-600 font-mono">
                  manager@servicio.com
                </p>
                <p className="text-sm text-blue-600 font-mono">manager123</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-green-800 mb-2">Técnico</h3>
                <p className="text-sm text-green-600 font-mono">
                  tecnico@servicio.com
                </p>
                <p className="text-sm text-green-600 font-mono">tecnico123</p>
              </div>
            </div>
            <div className="text-center">
              <Link href="/admin/login">
                <Button size="lg" className="bg-[#A50034] hover:bg-[#E74C3C]">
                  <LogIn className="mr-2 h-5 w-5" />
                  Acceder al Panel Administrativo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500">
          <p className="mb-2">
            TecnoCity - Sistema de Gestión de Servicios Técnicos
          </p>
          <p className="text-sm">
            Sistema completo con frontend cliente, panel administrativo y
            backend funcional
          </p>
        </div>
      </div>
    </div>
  )
}
