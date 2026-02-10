'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

const formSchema = z.object({
  descripcion: z.string().min(10, 'La descripción es muy corta'),
  costoFinal: z.coerce.number().min(0, 'El costo no puede ser negativo'),
  estadoCierre: z.enum(['reparado', 'no_reparable', 'seguimiento'], {
    required_error: 'Debe seleccionar un estado final',
  }),
})

interface CloseServiceFormProps {
  orderId: string
  orderNumber: string
  clientName: string
  appliance: string
  initialCost?: number | null
  visitCost: number
}

export function CloseServiceForm({
  orderId,
  orderNumber,
  clientName,
  appliance,
  initialCost,
  visitCost
}: CloseServiceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: '',
      costoFinal: initialCost || 0,
      estadoCierre: 'reparado',
    },
  })

  // Watch para cambios dinámicos
  const estadoCierre = form.watch('estadoCierre')

  const handleEstadoChange = (value: string) => {
    form.setValue('estadoCierre', value as any)
    if (value === 'no_reparable') {
      // Si no es reparable, costo es visita
      form.setValue('costoFinal', visitCost)
    } else if (value === 'reparado') {
      // Restaurar costo inicial si existe, o dejar el actual
      if (initialCost) form.setValue('costoFinal', initialCost)
    }
    // Seguimiento no cambia costo automáticamente
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/close`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Error al cerrar el servicio')
      }

      toast.success('Servicio cerrado exitosamente')
      router.push('/technician/assignments')
      router.refresh()
    } catch (error) {
      toast.error('Ocurrió un error al cerrar el servicio')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Cerrar Servicio — {orderNumber}</CardTitle>
          <CardDescription>
            {clientName} • {appliance}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="estadoCierre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Final *</FormLabel>
                    <Select
                      onValueChange={handleEstadoChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el resultado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="reparado">✅ Reparado (Éxito)</SelectItem>
                        <SelectItem value="no_reparable">❌ No Reparable (Cobrar Visita)</SelectItem>
                        <SelectItem value="seguimiento">🔄 Requiere Seguimiento</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Determine el resultado final de la visita.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Trabajo / Informe *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={estadoCierre === 'reparado'
                          ? "Describa qué reparó, piezas cambiadas, pruebas realizadas..."
                          : "Explique por qué no fue posible reparar o qué queda pendiente..."
                        }
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <FormField
                  control={form.control}
                  name="costoFinal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-[#A50034]">
                        Total a Cobrar (COP) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="text-xl font-bold h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {estadoCierre === 'reparado'
                          ? "Incluya visita, mano de obra y repuestos. El cliente pagará este monto total."
                          : `Para servicios no reparados, se sugiere cobrar la visita ($${formatCurrency(visitCost)}).`
                        }
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {estadoCierre === 'no_reparable' && (
                <div className="flex items-center gap-2 p-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Se registrará como cancelado y se cobrará solo la visita.</span>
                </div>
              )}

              <Button type="submit" className="w-full bg-[#A50034] hover:bg-[#8B002B] h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cerrando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Confirmar y Cerrar Servicio
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
