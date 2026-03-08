'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Send,
  Loader2,
  Plus,
  Trash2,
  Wrench,
  Search,
  Package,
  XCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { VISIT_RESULTS } from '@/lib/constants'

const repuestoSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  cantidad: z.coerce.number().min(1, 'Mínimo 1'),
  costoEstimado: z.coerce.number().min(0, 'Costo inválido'),
  descripcion: z.string().optional(),
})

const visitReportSchema = z.object({
  diagnostico: z.string().min(20, 'El diagnóstico debe tener al menos 20 caracteres'),
  resultado: z.enum(['revisado', 'reparado', 'pendiente_repuesto', 'no_reparable'], {
    required_error: 'Debe seleccionar un resultado',
  }),
  costoVisita: z.coerce.number().min(0, 'El costo no puede ser negativo'),
  costoReparacion: z.coerce.number().min(0).optional(),
  repuestos: z.array(repuestoSchema).optional(),
  notasAdicionales: z.string().optional(),
  recomendaciones: z.string().optional(),
})

type VisitReportFormValues = z.infer<typeof visitReportSchema>

interface VisitReportFormProps {
  orderId: string
  assignmentId: number
  orderNumber: string
  clientName: string
  appliance: string
  serviceType: string
  initialProblem: string
  visitCost: number
}

export function VisitReportForm({
  orderId,
  assignmentId,
  orderNumber,
  clientName,
  appliance,
  serviceType,
  initialProblem,
  visitCost,
}: VisitReportFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<VisitReportFormValues>({
    resolver: zodResolver(visitReportSchema),
    defaultValues: {
      diagnostico: '',
      resultado: undefined,
      costoVisita: visitCost,
      costoReparacion: 0,
      repuestos: [],
      notasAdicionales: '',
      recomendaciones: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'repuestos',
  })

  const resultado = form.watch('resultado')
  const costoVisita = form.watch('costoVisita') || 0
  const costoReparacion = form.watch('costoReparacion') || 0
  const repuestos = form.watch('repuestos') || []

  const costoRepuestos = repuestos.reduce(
    (sum, r) => sum + (r.costoEstimado || 0) * (r.cantidad || 1),
    0
  )
  const costoTotal = costoVisita + costoReparacion + costoRepuestos

  const handleResultadoChange = (value: string) => {
    form.setValue('resultado', value as any)
    if (value === 'no_reparable') {
      form.setValue('costoReparacion', 0)
    }
  }

  async function onSubmit(values: VisitReportFormValues) {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('accessToken')
      const payload = {
        assignmentId,
        diagnostico: values.diagnostico,
        resultado: values.resultado,
        costoVisita: values.costoVisita,
        costoReparacion: values.costoReparacion || 0,
        costoRepuestos,
        repuestos: values.repuestos && values.repuestos.length > 0 ? values.repuestos : null,
        notasAdicionales: values.notasAdicionales || null,
        recomendaciones: values.recomendaciones || null,
      }

      const response = await fetch(`/api/orders/${orderId}/visit-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al enviar informe')
      }

      toast.success('Informe de visita enviado exitosamente')
      router.push('/technician/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar el informe de visita')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resultadoConfig = {
    revisado: { icon: Search, label: 'Revisado - Pendiente cotización', color: 'text-teal-700 bg-teal-50 border-teal-200' },
    reparado: { icon: Wrench, label: 'Reparado en sitio', color: 'text-green-700 bg-green-50 border-green-200' },
    pendiente_repuesto: { icon: Package, label: 'Necesita repuestos', color: 'text-orange-700 bg-orange-50 border-orange-200' },
    no_reparable: { icon: XCircle, label: 'No reparable', color: 'text-red-700 bg-red-50 border-red-200' },
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-4 sm:space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Header - Info de Orden */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Informe de Visita</CardTitle>
            <Badge variant="outline" className="text-xs font-mono">{orderNumber}</Badge>
          </div>
          <CardDescription>{clientName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Equipo:</span>
              <p className="font-medium capitalize">{appliance.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tipo servicio:</span>
              <p className="font-medium capitalize">{serviceType}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Problema reportado:</span>
              <p className="font-medium">{initialProblem || 'No especificado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Diagnóstico y Resultado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Resultado */}
              <FormField
                control={form.control}
                name="resultado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultado de la Visita *</FormLabel>
                    <Select
                      onValueChange={handleResultadoChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="¿Cuál fue el resultado?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="revisado">
                          🔍 Revisado - Requiere cotización
                        </SelectItem>
                        <SelectItem value="reparado">
                          ✅ Reparado en sitio
                        </SelectItem>
                        <SelectItem value="pendiente_repuesto">
                          📦 Necesita repuestos
                        </SelectItem>
                        <SelectItem value="no_reparable">
                          ❌ No reparable
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccione el resultado de su visita técnica.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alerta contextual */}
              {resultado && (
                <div className={`flex items-center gap-2 p-3 text-sm rounded-md border ${resultadoConfig[resultado]?.color || ''}`}>
                  {resultado === 'no_reparable' && <AlertTriangle className="h-4 w-4 shrink-0" />}
                  {resultado === 'pendiente_repuesto' && <Package className="h-4 w-4 shrink-0" />}
                  {resultado === 'reparado' && <Wrench className="h-4 w-4 shrink-0" />}
                  {resultado === 'revisado' && <Search className="h-4 w-4 shrink-0" />}
                  <span>
                    {resultado === 'revisado' && 'El cliente recibirá el diagnóstico y la cotización para aprobar.'}
                    {resultado === 'reparado' && 'Excelente. Documente lo que se reparó y el costo final.'}
                    {resultado === 'pendiente_repuesto' && 'Agregue los repuestos necesarios con sus costos estimados.'}
                    {resultado === 'no_reparable' && 'Se cobrará únicamente la visita técnica al cliente.'}
                  </span>
                </div>
              )}

              {/* Diagnostico */}
              <FormField
                control={form.control}
                name="diagnostico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnóstico Detallado *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describa qué encontró, qué revisó, estado del equipo, causa del problema..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo 20 caracteres. Sea específico para que el cliente entienda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Seccion de Costos */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                <h4 className="font-semibold text-primary">Costos</h4>

                {/* Costo Visita - siempre visible */}
                <FormField
                  control={form.control}
                  name="costoVisita"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo de Visita / Revisión (COP)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Costo base de la visita técnica.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Costo Reparacion - solo si es revisado o reparado */}
                {(resultado === 'revisado' || resultado === 'reparado') && (
                  <FormField
                    control={form.control}
                    name="costoReparacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {resultado === 'reparado' ? 'Costo de Mano de Obra (COP)' : 'Costo Estimado de Reparación (COP)'}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Lista de Repuestos - solo si pendiente_repuesto */}
                {resultado === 'pendiente_repuesto' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Repuestos Necesarios</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ nombre: '', cantidad: 1, costoEstimado: 0, descripcion: '' })}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Agregar
                      </Button>
                    </div>

                    {fields.length === 0 && (
                      <p className="text-sm text-muted-foreground py-2">
                        No se han agregado repuestos. Use el botón "Agregar" para incluirlos.
                      </p>
                    )}

                    {fields.map((field, index) => (
                      <div key={field.id} className="p-3 border rounded-md bg-background space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            Repuesto #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name={`repuestos.${index}.nombre`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Nombre del repuesto" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`repuestos.${index}.cantidad`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" placeholder="Cantidad" min={1} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`repuestos.${index}.costoEstimado`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" placeholder="Costo estimado" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`repuestos.${index}.descripcion`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Descripción (opcional)" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(costoTotal)}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground">
                    <span>Visita: {formatCurrency(costoVisita)}</span>
                    {costoReparacion > 0 && <span>Reparación: {formatCurrency(costoReparacion)}</span>}
                    {costoRepuestos > 0 && <span>Repuestos: {formatCurrency(costoRepuestos)}</span>}
                  </div>
                </div>
              </div>

              {/* Notas y Recomendaciones */}
              <FormField
                control={form.control}
                name="notasAdicionales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionales (internas)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas internas para el equipo técnico..."
                        className="min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Solo visible para el equipo técnico y administración.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recomendaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recomendaciones al Cliente</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Recomendaciones de uso, mantenimiento preventivo..."
                        className="min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Estas recomendaciones serán visibles para el cliente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando informe...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Informe de Visita
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

