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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const formSchema = z.object({
  diagnostico: z.string().min(20, 'El diagnóstico debe tener al menos 20 caracteres'),
  costoEstimado: z.coerce.number().min(50000, 'El costo mínimo debe ser $50.000'),
})

interface QuoteFormProps {
  orderId: string
  orderNumber: string
  clientName: string
  appliance: string
  serviceType: string
  initialProblem: string
}

export function QuoteForm({
  orderId,
  orderNumber,
  clientName,
  appliance,
  serviceType,
  initialProblem
}: QuoteFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnostico: '',
      costoEstimado: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar la cotización')
      }

      toast.success('Cotización enviada exitosamente')
      router.push('/technician/assignments')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error al enviar la cotización')
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
          <CardTitle>Nueva Cotización — {orderNumber}</CardTitle>
          <CardDescription>
            Cliente: {clientName} • {appliance} • {serviceType}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-1">Problema reportado:</h4>
            <p className="text-sm text-muted-foreground">{initialProblem || 'Sin descripción inicial'}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="diagnostico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnóstico Técnico *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describa el problema encontrado y la solución propuesta en detalle..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Esta información será visible para el cliente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costoEstimado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo Total Estimado (COP) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 150000"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Incluya mano de obra y repuestos. Si el cliente aprueba, este será el valor a cobrar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Cotización al Cliente
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
