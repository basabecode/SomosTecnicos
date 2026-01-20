/**
 * Página de Información del Sistema
 * Explicación pública de la arquitectura y flujo operativo
 */

import Link from 'next/link'
import { Metadata } from 'next'
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
  ArrowLeft,
  Users,
  Settings,
  Wrench,
  Smartphone,
  ShieldCheck,
  Zap,
  Layout,
  ArrowRight,
  Database
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cómo Funciona | SomosTécnicos',
  description: 'Descubre cómo funciona nuestra plataforma de gestión de servicios técnicos.',
}

export default function AdminInfoPage() {
  const workflowSteps = [
    {
      role: 'Cliente',
      icon: Users,
      action: 'Solicita Servicio',
      description: 'El cliente registra su solicitud vía web o móvil, indicando el tipo de electrodoméstico y la falla.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      role: 'Plataforma',
      icon: Database,
      action: 'Procesamiento',
      description: 'El sistema recibe la orden, valida la cobertura y notifica al panel administrativo.',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      role: 'Administrador',
      icon: Layout,
      action: 'Asignación',
      description: 'El admin verifica disponibilidad y asigna al técnico más cercano y capacitado.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      role: 'Técnico',
      icon: Wrench,
      action: 'Ejecución',
      description: 'El técnico recibe la orden en su app, visita al cliente y realiza el servicio.',
      color: 'bg-green-100 text-green-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-gray-500">
                v1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-[#A50034]/10 text-[#A50034] hover:bg-[#A50034]/20 border-none px-4 py-1.5 text-sm font-medium mb-4">
            Arquitectura del Sistema
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Así Funciona <span className="text-[#A50034]">SomosTécnicos</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Una plataforma integral que conecta necesidades técnicas con soluciones profesionales, orquestada por tecnología moderna y eficiente.
          </p>
        </div>

        {/* Flujograma Operativo (Organigrama) */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Flujo Operativo del Servicio
          </h2>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="relative group">
                    <Card className="h-full border-2 border-transparent hover:border-gray-200 transition-all duration-300 bg-white hover:shadow-xl relative z-10">
                      <CardHeader className="text-center pb-2">
                        <div
                          className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="h-8 w-8" />
                        </div>
                        <Badge variant="secondary" className="mb-2 w-fit mx-auto">
                          Paso {index + 1}
                        </Badge>
                        <CardTitle className="text-lg font-bold text-gray-900">
                          {step.role}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          {step.action}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Arrow for mobile/tablet flow */}
                    {index < workflowSteps.length - 1 && (
                      <div className="lg:hidden flex justify-center py-4 text-gray-300">
                        <ArrowRight className="h-8 w-8 transform rotate-90 md:rotate-0" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Componentes del Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Componentes de la Plataforma
            </h2>
            <p className="text-lg text-gray-600">
              Nuestro ecosistema digital se compone de tres pilares fundamentales que garantizan una operación fluida y transparente.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Aplicación de Cliente</h3>
                  <p className="text-sm text-gray-600">Interfaz web progresiva (PWA) para solicitar servicios, rastrear técnicos y realizar pagos seguros.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-purple-100 transition-colors">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Panel Administrativo</h3>
                  <p className="text-sm text-gray-600">Centro de control para gestionar órdenes, monitorear métricas y administrar la fuerza laboral técnica.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-green-100 transition-colors">
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Portal Técnico</h3>
                  <p className="text-sm text-gray-600">Herramienta especializada para que los técnicos gestionen su agenda, reporten avances y finalicen servicios.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Visual Abstracta del Sistema (Estilo Nanobana/Organigrama Moderno) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#A50034]/5 to-blue-500/5 rounded-3xl transform rotate-3 scale-105" />
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Settings className="w-32 h-32" />
               </div>

               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-green-500" />
                 Estándares de Calidad
               </h3>

               <ul className="space-y-4 relative z-10">
                 <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500" />
                   <span className="text-gray-700">Verificación rigurosa de técnicos</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500" />
                   <span className="text-gray-700">Seguimiento GPS en tiempo real</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-purple-500" />
                   <span className="text-gray-700">Garantía de servicio digital</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-orange-500" />
                   <span className="text-gray-700">Pagos seguros y transparentes</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-500" />
                   <span className="text-gray-700">Soporte y mediación 24/7</span>
                 </li>
               </ul>

               <div className="mt-8 pt-6 border-t border-gray-100">
                 <p className="text-xs text-center text-gray-400 font-mono">
                   Arquitectura Segura v1.0 • Encriptación SSL • Cloud Native
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center border-t border-gray-200 pt-12">
          <p className="text-gray-500 mb-4">
            ¿Eres parte del equipo administrativo?
          </p>
          <Link href="/admin/login">
            <Button variant="outline" className="gap-2">
              <Layout className="w-4 h-4" />
              Acceso Restringido al Panel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
