'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Wrench,
  ShieldCheck,
  BrainCircuit,
  Search,
  MapPin,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FileCheck,
  Zap,
  Star
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function InfoView() {
  const [activeTab, setActiveTab] = useState('clients')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/20 text-primary bg-primary/5 uppercase tracking-widest font-semibold text-xs rounded-full">
              Centro de Ayuda & Validación
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            ¿Cómo usar <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff4d6d] animate-gradient-x">SomosTécnicos</span>?
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            La plataforma inteligente que conecta necesidades técnicas con expertos certificados en toda Colombia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
           <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg shadow-red-900/20 active-tap group h-12 text-base">
             <Link href="/" className="flex items-center gap-2">
               Comenzar Ahora <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
             </Link>
           </Button>
           <Button variant="outline" size="lg" className="rounded-full px-8 border-gray-200 hover:bg-gray-50 h-12 text-base">
             <Link href="#guias" className="flex items-center gap-2">
               Ver Guías <HelpCircle className="w-4 h-4" />
             </Link>
           </Button>
          </motion.div>
        </div>
      </section>

      {/* Interactive Tabs Guide */}
      <section id="guias" className="container mx-auto px-4 py-16 -mt-20 relative z-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">Seleccione su Perfil</h2>
              <p className="text-gray-500">Descubra las herramientas diseñadas específicamente para usted</p>
            </div>

            <Tabs defaultValue="clients" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-12 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl h-auto">
                <TabsTrigger
                  value="clients"
                  className="rounded-xl py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <Users className={`w-6 h-6 ${activeTab === 'clients' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className="font-semibold">Clientes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="technicians"
                  className="rounded-xl py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <Wrench className={`w-6 h-6 ${activeTab === 'technicians' ? 'text-[#2C3E50]' : 'text-gray-400'}`} />
                  <span className="font-semibold">Técnicos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="rounded-xl py-4 data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <ShieldCheck className={`w-6 h-6 ${activeTab === 'admin' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Staff Admin</span>
                </TabsTrigger>
              </TabsList>

              {/* Clients Content */}
              <TabsContent value="clients" className="mt-0 focus-visible:outline-none">
                <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-100 text-primary flex items-center justify-center font-bold text-xl">1</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Solicitud Inteligente</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Ingrese su problema en la barra de búsqueda. Nuestra IA clasificará su solicitud y le mostrará el costo estimado inmediatamente.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-50 text-primary flex items-center justify-center font-bold text-xl">2</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Asignación Automática</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          El sistema localiza al técnico certificado más cercano con disponibilidad inmediata y le asigna su caso.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-50 text-primary flex items-center justify-center font-bold text-xl">3</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Garantía y Pago Seguro</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Reciba su servicio, verifique el trabajo y realice el pago de forma segura a través de la plataforma.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                      <BrainCircuit className="w-8 h-8 text-primary" />
                      <h4 className="font-bold text-lg">Validación de Usuario</h4>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Registro con verificación de email
                      </li>
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Historial de servicios en la nube
                      </li>
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Soporte técnico dedicado
                      </li>
                    </ul>
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-center text-gray-400 uppercase tracking-widest">Estado del Servicio en Colombia: <span className="text-green-500 font-bold">ACTIVO</span></p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Technicians Content */}
              <TabsContent value="technicians" className="mt-0 focus-visible:outline-none">
                 <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#2C3E50]/10 text-[#2C3E50] flex items-center justify-center font-bold text-xl">1</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Registro Profesional</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Complete su perfil, suba sus certificaciones y antecedentes. Nuestro equipo administrativo validará su información en 24h.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#2C3E50]/10 text-[#2C3E50] flex items-center justify-center font-bold text-xl">2</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Recepción de Leads</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Active su estado "Disponible" para recibir notificaciones de trabajos cercanos a su ubicación GPS.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#2C3E50]/10 text-[#2C3E50] flex items-center justify-center font-bold text-xl">3</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Gestión de Ganancias</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Visualice sus ingresos diarios, semanales y mensuales desde su panel de control personal.
                        </p>
                      </div>
                    </div>
                  </div>
                   <div className="bg-[#2C3E50] text-white rounded-3xl p-8 border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Wrench className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">

                        <h4 className="font-bold text-lg">Beneficios Exclusivos</h4>
                      </div>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm font-medium">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          Pagos semanales garantizados
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          Bonificaciones por calificación
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          Capacitaciones gratuitas
                        </li>
                      </ul>
                       <Button className="w-full mt-8 bg-white text-[#2C3E50] hover:bg-gray-100 font-bold">
                        Aplicar como Técnico
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Admin Content */}
               <TabsContent value="admin" className="mt-0 focus-visible:outline-none">
                 <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">1</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Monitoreo Global</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Supervise todas las operaciones en tiempo real, desde la creación de la orden hasta el cierre del servicio.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">2</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Validación de Documentos</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Herramientas seguras para revisar y aprobar la documentación legal de nuevos técnicos.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">3</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Analítica de Negocio</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Reportes detallados de KPIs, satisfacción del cliente y rendimiento financiero por región.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-blue-200 dark:border-blue-900 shadow-lg shadow-blue-900/5">
                    <div className="flex items-center gap-3 mb-6">
                      <FileCheck className="w-8 h-8 text-blue-600" />
                      <h4 className="font-bold text-lg">Panel de Control</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-gray-900">24/7</div>
                        <div className="text-xs text-gray-500 uppercase">Soporte</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <div className="text-xs text-gray-500 uppercase">Uptime</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl text-center col-span-2">
                         <div className="text-sm font-medium text-gray-600">Acceso Restringido</div>
                         <div className="text-xs text-gray-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </section>

      {/* SEO Keywords Registration Section (Visible to Crawlers & Users) */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <MapPin className="w-3 h-3" />
              Cobertura Nacional
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Encuéntrenos en Colombia</h2>
            <p className="text-gray-500">
              SomosTécnicos está optimizado para conectar con usuarios en las principales ciudades y municipios.
              Nuestra red de palabras clave asegura que su necesidad encuentre solución.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b pb-2">Índice de Servicios & Ubicaciones (SEO)</h3>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Reparación de Neveras Cali", "Técnico Lavadoras Cali", "Mantenimiento Estufas Cali",
                "Servicio Técnico Cali", "Arreglo Electrodomésticos Cali", "Instalación Aires Acondicionados",
                "Soporte Técnico Samsung Colombia", "Reparación LG Cali", "Servicio Whirlpool Cali",
                "Reparación Hornos Industriales", "Mantenimiento Preventivo Cali", "Técnicos Certificados SENA",
                "Reparación a Domicilio 24/7", "Urgencias Técnicas Cali Norte", "Servicio Técnico Cali",
                "Mantenimiento Lavadoras Cali", "Arreglo Neveras Cali", "Instalación Gasodomésticos",
                "Certificación RETIE", "Plataforma de Técnicos Cali", "App para Técnicos",
                "Trabajo para Técnicos en Colombia", "Soporte Mabe", "Soporte Haceb", "Soporte Challenger"
              ].map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-primary hover:text-white transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-start gap-4">
              <Search className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Validación de Visibilidad</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Este espacio registra activamente los términos de búsqueda más relevantes para garantizar la indexación en motores de búsqueda como Google Colombia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
