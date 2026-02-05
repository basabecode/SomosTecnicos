'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Construction, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PlaceholderReportProps {
  title: string
  description: string
}

export function PlaceholderReport({ title, description }: PlaceholderReportProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/reports">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Reportes
            </Link>
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto mt-10">
        <CardHeader className="text-center">
            <div className="mx-auto bg-yellow-100 p-4 rounded-full w-fit mb-4">
                <Construction className="h-10 w-10 text-yellow-600" />
            </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-lg mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Este módulo de reporte está actualmente en desarrollo. Pronto podrás visualizar estadísticas detalladas aquí.
          </p>
          <Button asChild>
            <Link href="/admin/reports">Regresar al Panel de Reportes</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
