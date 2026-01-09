'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Mail, Home, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-4 bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center">
            <Clock className="h-12 w-12 text-amber-600 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Solicitud en Revisión
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Tu solicitud de técnico está siendo procesada
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Estado de tu Solicitud
            </h3>
            <p className="text-blue-800 text-sm">
              Hemos recibido tu solicitud y nuestro equipo la está revisando cuidadosamente.
              Te notificaremos por email cuando sea aprobada.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">⏰ Tiempo de Espera</h3>
            <p className="text-yellow-800 text-sm mb-3">
              Normalmente procesamos las solicitudes en <strong>24-48 horas hábiles</strong>.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-yellow-800">Verificación de datos personales</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-yellow-800">Validación de experiencia</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-yellow-800">Aprobación final del administrador</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">📧 ¿Qué Sigue?</h3>
            <ol className="text-green-800 text-sm space-y-2 list-decimal list-inside">
              <li>Recibirás un email de confirmación cuando tu solicitud sea aprobada</li>
              <li>El email incluirá tus credenciales de acceso</li>
              <li>Podrás iniciar sesión y acceder a tu panel de técnico</li>
              <li>Comenzarás a recibir asignaciones de servicio</li>
            </ol>
          </div>

          <div className="text-center pt-4 space-y-3">
            <p className="text-sm text-gray-600">
              ¿Necesitas ayuda? Contáctanos a{' '}
              <a href="mailto:soporte@tecnocity.com" className="text-blue-600 hover:text-blue-700 font-medium">
                soporte@tecnocity.com
              </a>
            </p>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
