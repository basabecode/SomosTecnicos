/**
 * Página de Capacidades del Sistema
 * Explicación visual y sencilla de los beneficios y funcionamiento para todos los usuarios.
 */

import Link from 'next/link'
import { Metadata } from 'next'
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
  Wrench,
  Smartphone,
  ShieldCheck,
  Layout,
  ArrowRight,
  BrainCircuit,
  FileText,
  Bell,
  CheckCircle2,
  Clock,
  ClipboardList
} from 'lucide-react'

export const metadata: Metadata = {
  title: '¿Cómo Funciona? | SomosTécnicos - Plataforma de Servicios Técnicos',
  description: 'Descubre cómo funciona SomosTécnicos: plataforma digital para solicitar reparación de electrodomésticos con técnicos certificados. Proceso simple en 4 pasos, seguimiento en tiempo real y garantía de calidad.',
  keywords: [
    'cómo funciona somostecnicos',
    'plataforma servicio técnico',
    'solicitar reparación electrodomésticos',
    'técnicos certificados',
    'proceso reparación',
    'seguimiento tiempo real',
    'asistente digital',
    'beneficios clientes',
    'herramientas técnicos',
  ],
  openGraph: {
    title: '¿Cómo Funciona SomosTécnicos?',
    description: 'Conoce el proceso simple de 4 pasos para solicitar servicios técnicos profesionales a domicilio.',
    url: 'https://somostecnicos.com/admin-info',
    type: 'website',
  },
  alternates: {
    canonical: '/admin-info',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AdminInfoPage() {
  const workflowSteps = [
    {
      role: 'Usted como Cliente',
      icon: Users,
      action: 'Solicita el Servicio',
      description: 'Desde cualquier dispositivo, usted describe el problema de su equipo en pocos pasos.',
      color: 'bg-[#A50034]/10 text-[#A50034]',
    },
    {
      role: 'Asistente Digital',
      icon: BrainCircuit,
      action: 'Analiza su Caso',
      description: 'Nuestra tecnología identifica la falla y le da un pre-diagnóstico de inmediato.',
      color: 'bg-[#2C3E50]/10 text-[#2C3E50]',
    },
    {
      role: 'Coordinación',
      icon: Layout,
      action: 'Asigna al Experto',
      description: 'Buscamos al técnico especializado más cercano para atenderlo lo antes posible.',
      color: 'bg-[#A50034]/10 text-[#A50034]',
    },
    {
      role: 'El Técnico',
      icon: Wrench,
      action: 'Repara su Equipo',
      description: 'El experto llega a su domicilio, realiza el trabajo y deja todo funcionando.',
      color: 'bg-[#2C3E50]/10 text-[#2C3E50]',
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
              className="flex items-center text-[#2C3E50] hover:text-[#A50034] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[#2C3E50] border-[#2C3E50]/20 font-semibold">
                PLATAFORMA ACTIVA
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-[#A50034]/10 text-[#A50034] hover:bg-[#A50034]/20 border-none px-4 py-1.5 text-sm font-semibold mb-2">
            Nuestra Tecnología a su Servicio
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2C3E50] tracking-tight">
            ¿Qué puede hacer con <span className="text-[#A50034]">SomosTécnicos</span>?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hemos diseñado una plataforma fácil de usar que soluciona sus problemas técnicos de forma rápida, segura y profesional.
          </p>
        </div>

        {/* Paso a Paso */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-8 text-center flex items-center justify-center gap-2">
            <Clock className="w-6 h-6 text-[#A50034]" />
            Su servicio en 4 pasos simples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative group">
                  <Card className="h-full border border-gray-100 transition-all duration-300 bg-white hover:shadow-lg relative z-10">
                    <CardHeader className="text-center pb-2">
                      <div
                        className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-lg font-bold text-[#2C3E50]">
                        {step.role}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <h4 className="font-bold text-[#A50034] mb-2 uppercase tracking-widest text-[10px]">
                        {step.action}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>

                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <ArrowRight className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Beneficios por Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Para Clientes */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <div className="h-2 bg-[#A50034]" />
            <CardHeader>
              <div className="p-3 w-fit rounded-lg bg-[#A50034]/10 text-[#A50034] mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2C3E50]">Para Clientes</CardTitle>
              <CardDescription>Comodidad y seguridad total</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Solicite técnicos desde su celular en segundos',
                  'Chat con asistente inteligente 24/7',
                  'Siga el estado de su orden en tiempo real',
                  'Historial de todos sus servicios realizados',
                  'Califique el trabajo del técnico'
                ].map((item, id) => (
                  <li key={id} className="flex gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#A50034] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Para Técnicos */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <div className="h-2 bg-[#2C3E50]" />
            <CardHeader>
              <div className="p-3 w-fit rounded-lg bg-[#2C3E50]/10 text-[#2C3E50] mb-3">
                <Wrench className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2C3E50]">Para Técnicos</CardTitle>
              <CardDescription>Herramientas para su crecimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Agenda digital de trabajos asignados',
                  'Reporte de llegada y finalización fácil',
                  'Suba fotos y notas de sus reparaciones',
                  'Control de ingresos y pagos recibidos',
                  'Perfil profesional con calificaciones'
                ].map((item, id) => (
                  <li key={id} className="flex gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#2C3E50] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Para Administración */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <div className="h-2 bg-[#A50034]" />
            <CardHeader>
              <div className="p-3 w-fit rounded-lg bg-[#A50034]/10 text-[#A50034] mb-3">
                <ClipboardList className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2C3E50]">Administración</CardTitle>
              <CardDescription>Control y coordinación eficiente</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Vista general de todas las solicitudes',
                  'Asignación manual de técnicos expertos',
                  'Aprobación y verificación de nuevos técnicos',
                  'Estadísticas de servicios y calidad',
                  'Gestión segura de cuentas y pagos'
                ].map((item, id) => (
                  <li key={id} className="flex gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#A50034] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Compromiso de Calidad */}
        <div className="bg-[#2C3E50] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="w-64 h-64" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nuestro Compromiso con Usted</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-2 h-fit bg-white/10 rounded-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">Personal Calificado</h3>
                    <p className="text-sm text-gray-300">Cada técnico pasa por una validación estricta de sus documentos y antecedentes antes de ser aprobado.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-2 h-fit bg-white/10 rounded-lg">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">Avisos Inmediatos</h3>
                    <p className="text-sm text-gray-300">Usted recibirá avisos automáticos cada vez que su servicio cambie de estado o el técnico esté en camino.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-2 h-fit bg-white/10 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">Garantía Digital</h3>
                    <p className="text-sm text-gray-300">Todo queda registrado en el sistema, asegurando que su garantía sea respetada ante cualquier inconveniente.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-6 text-center">Resumen de Seguridad</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Técnicos Verificados</span>
                  <Badge className="bg-[#A50034] text-white border-none">SI</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Soporte Continuo</span>
                  <Badge className="bg-[#A50034] text-white border-none">SI</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Pagos Transparentes</span>
                  <Badge className="bg-[#A50034] text-white border-none">SI</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Garantía por Escrito</span>
                  <Badge className="bg-[#A50034] text-white border-none">SI</Badge>
                </div>
              </div>
              <p className="mt-8 text-[10px] text-center text-gray-400 uppercase tracking-widest font-mono">
                SomosTécnicos v2.2 • Su confianza es nuestra prioridad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
