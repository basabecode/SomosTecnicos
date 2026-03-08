/**
 * Página de Reportes - Panel Manager
 * Reportes específicos para managers
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  ClipboardList,
  TrendingUp,
  Star,
  Clock,
  Download,
  Calendar,
  Target,
  Award,
  AlertTriangle,
} from 'lucide-react'

export default function ManagerReportsPage() {
  const [timeRange, setTimeRange] = useState('30d')

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Reportes del Equipo
        </h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Órdenes Completadas
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              +15% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfacción Cliente
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">
              +0.2 vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              -0.3h vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eficiencia Equipo
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Rendimiento por Técnico</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-800">
                      JP
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Juan Pérez</p>
                    <p className="text-sm text-muted-foreground">
                      15 órdenes completadas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">4.8</span>
                  </div>
                  <p className="text-sm text-muted-foreground">2.2h promedio</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800">
                      AL
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Ana López</p>
                    <p className="text-sm text-muted-foreground">
                      12 órdenes completadas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">4.6</span>
                  </div>
                  <p className="text-sm text-muted-foreground">2.8h promedio</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-800">
                      CR
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Carlos Ruiz</p>
                    <p className="text-sm text-muted-foreground">
                      8 órdenes completadas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">4.2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">3.1h promedio</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Objetivos del Mes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Órdenes Completadas</span>
                  <span>67/80</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '84%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  84% del objetivo
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Satisfacción Cliente</span>
                  <span>4.6/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '92%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  92% del objetivo
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tiempo Promedio</span>
                  <span>2.4/2.0h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: '70%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">Necesita mejora</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Types Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Tipo de Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Electrodomésticos</h4>
                <span className="text-2xl font-bold">28</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Satisfacción:</span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>4.7</span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tiempo prom:</span>
                  <span>2.3h</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Aires Acondicionados</h4>
                <span className="text-2xl font-bold">19</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Satisfacción:</span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>4.5</span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tiempo prom:</span>
                  <span>2.8h</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Otros Servicios</h4>
                <span className="text-2xl font-bold">20</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Satisfacción:</span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>4.4</span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tiempo prom:</span>
                  <span>2.1h</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues and Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Alertas y Puntos de Atención</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">
                  Carlos Ruiz requiere seguimiento
                </p>
                <p className="text-sm text-yellow-700">
                  Tiempo promedio por encima del objetivo (3.1h vs 2.0h
                  objetivo)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">
                  Capacidad de equipo al límite
                </p>
                <p className="text-sm text-blue-700">
                  Considerar agregar más técnicos para el próximo mes
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border border-green-200 bg-green-50 rounded-lg">
              <Award className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">
                  Juan Pérez superó expectativas
                </p>
                <p className="text-sm text-green-700">
                  Excelente rendimiento este mes, considera reconocimiento
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
