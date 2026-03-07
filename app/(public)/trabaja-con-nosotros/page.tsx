import { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckCircle,
  Smartphone,
  DollarSign,
  Calendar,
  Award,
  TrendingUp,
  Wrench,
  Zap,
  Tv,
  Thermometer,
  Waves,
  Wind,
  Camera,
  Laptop,
  ArrowRight,
  Star,
  MapPin,
  Shield,
  Users,
  Clock,
  BadgeCheck,
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import PageBreadcrumb from '@/components/page-breadcrumb'

export const metadata: Metadata = {
  title: 'Trabaja como Técnico en Cali | Únete a SomosTécnicos',
  description:
    '¿Eres técnico en reparación de electrodomésticos en Cali? Únete a SomosTécnicos: recibe más clientes, gestiona tu agenda desde el celular y cobra seguro. Registro gratis.',
  keywords: [
    'trabajo técnico electrodomésticos cali',
    'técnico independiente cali',
    'unirse somostecnicos',
    'ganar dinero como técnico cali',
    'trabajo técnico a domicilio cali',
    'freelance técnico colombia',
    'técnico reparación neveras lavadoras cali',
  ],
  alternates: { canonical: '/trabaja-con-nosotros' },
  openGraph: {
    title: 'Trabaja como Técnico en Cali | Únete a SomosTécnicos',
    description:
      '¿Eres técnico en reparación? Únete a la red más confiable de Cali. Más clientes, pagos seguros, gestión digital completa.',
    url: 'https://somostecnicos.com/trabaja-con-nosotros',
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://somostecnicos.com' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Trabaja con Nosotros',
      item: 'https://somostecnicos.com/trabaja-con-nosotros',
    },
  ],
}

const jobPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Técnico a domicilio en Cali',
  description:
    'Buscamos técnicos independientes en Cali expertos en reparación de electrodomésticos, electricidad, computadores y seguridad electrónica. Trabaja con flexibilidad, recibe clientes a través de nuestra plataforma y cobra de forma segura.',
  datePosted: '2026-01-01',
  validThrough: '2026-12-31',
  employmentType: 'CONTRACTOR',
  hiringOrganization: {
    '@type': 'Organization',
    name: 'SomosTécnicos',
    sameAs: 'https://somostecnicos.com',
    logo: 'https://somostecnicos.com/img-3d/logotipo-ST.png',
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cali',
      addressRegion: 'Valle del Cauca',
      addressCountry: 'CO',
    },
  },
  baseSalary: {
    '@type': 'MonetaryAmount',
    currency: 'COP',
    value: {
      '@type': 'QuantitativeValue',
      minValue: 1500000,
      maxValue: 5000000,
      unitText: 'MONTH',
    },
  },
  skills: 'reparación electrodomésticos, electricidad, computadores, redes, cámaras de seguridad',
  qualifications: 'Experiencia mínima 1 año en el área técnica, herramientas propias',
}

const stats = [
  { value: '30+', label: 'Técnicos activos' },
  { value: '2.000+', label: 'Servicios completados' },
  { value: '4.8 / 5', label: 'Calificación promedio' },
  { value: '$0', label: 'Costo de registro' },
]

const benefits = [
  {
    icon: Smartphone,
    title: 'Más clientes sin buscarlos',
    description:
      'Nosotros conseguimos los clientes por ti. Recibes órdenes de servicio directamente en tu celular dentro de tu zona de trabajo. Tú solo llega y resuelve.',
    color: 'bg-primary/7 text-primary',
    featured: true,
  },
  {
    icon: DollarSign,
    title: 'Pagos seguros y puntuales',
    description:
      'Olvídate de cobrar en efectivo o que el cliente "no tenga sencillo". La plataforma registra cada cobro y tú recibes tu pago de forma transparente.',
    color: 'bg-primary/7 text-primary',
    featured: false,
  },
  {
    icon: Calendar,
    title: 'Agenda 100% flexible',
    description:
      'Tú decides cuándo trabajas. Activa tu disponibilidad cuando quieras y pausa cuando necesites descansar. Sin jefes, sin horario fijo, sin multas.',
    color: 'bg-primary/7 text-primary',
    featured: false,
  },
  {
    icon: Zap,
    title: 'Gestión digital completa',
    description:
      'Panel propio para ver tus órdenes, historial de servicios, calificaciones y ganancias. Todo organizado, desde cualquier dispositivo, en tiempo real.',
    color: 'bg-primary/7 text-primary',
    featured: false,
  },
  {
    icon: Award,
    title: 'Construye tu reputación',
    description:
      'Cada trabajo bien hecho suma estrellas a tu perfil. Una buena reputación te consigue mejores órdenes, más recurrentes y con mejores tarifas.',
    color: 'bg-primary/7 text-primary',
    featured: false,
  },
  {
    icon: TrendingUp,
    title: 'Crece con el negocio',
    description:
      'A medida que completamos más servicios en Cali, tú recibes más órdenes. El crecimiento de la plataforma es directamente el tuyo.',
    color: 'bg-primary/7 text-primary',
    featured: false,
  },
]

const steps = [
  {
    number: '01',
    title: 'Regístrate gratis',
    description:
      'Llena el formulario de postulación con tu especialidad, zona de trabajo y experiencia. No pagas nada, nunca.',
    cta: 'Solo toma 5 minutos',
  },
  {
    number: '02',
    title: 'Verificamos tu perfil',
    description:
      'Nuestro equipo revisa tu documento de identidad, evalúa tu área técnica y activa tu cuenta. Proceso ágil, sin burocracia.',
    cta: 'Usualmente en 24-48 horas',
  },
  {
    number: '03',
    title: 'Empieza a ganar',
    description:
      'Desde que tu perfil está activo, empiezas a recibir órdenes de clientes reales en tu zona. Tú fijas tus tarifas.',
    cta: 'Primeras órdenes en días',
  },
]

const specialties = [
  { icon: Thermometer, label: 'Neveras y Refrigeración' },
  { icon: Waves, label: 'Lavadoras y Secadoras' },
  { icon: Thermometer, label: 'Calentadores de Agua' },
  { icon: Zap, label: 'Estufas y Hornos' },
  { icon: Tv, label: 'Televisores' },
  { icon: Zap, label: 'Electricista Domiciliario' },
  { icon: Laptop, label: 'Computadores y Redes' },
  { icon: Camera, label: 'Cámaras de Seguridad' },
  { icon: Wind, label: 'Aires Acondicionados' },
]

const requirements = [
  'Mínimo 1 año de experiencia comprobable en tu área técnica',
  'Herramientas propias básicas para diagnóstico y reparación',
  'Documento de identidad colombiano vigente',
  'Disponibilidad para atender en Cali y/o municipios del Valle',
  'Celular con acceso a internet para gestionar las órdenes',
  'Actitud de servicio al cliente y responsabilidad con los horarios',
]

const testimonials = [
  {
    name: 'Carlos M.',
    specialty: 'Técnico en refrigeración',
    zone: 'Sur de Cali',
    quote:
      'Antes pasaba la mitad del tiempo buscando clientes en redes. Desde que me uní a SomosTécnicos, trabajo de lunes a sábado sin parar. La plataforma me organiza todo y me paga sin líos.',
    stars: 5,
    time: '8 meses en la red',
  },
  {
    name: 'Jhon D.',
    specialty: 'Electricista certificado',
    zone: 'Norte de Cali',
    quote:
      'Lo que más me gusta es que puedo poner mis propias tarifas y el cliente ya sabe el precio antes de llamarme. Eso hace que la visita sea mucho más fácil y sin peleas por el cobro.',
    stars: 5,
    time: '14 meses en la red',
  },
  {
    name: 'Andrés V.',
    specialty: 'Técnico en lavadoras',
    zone: 'Ciudad Jardín',
    quote:
      'Empecé dudando porque pensé que me iban a quitar mucho del cobro. Pero la comisión es justa y las órdenes son constantes. Ya no dependo de una sola empresa para trabajar.',
    stars: 5,
    time: '5 meses en la red',
  },
]

const faqs = [
  {
    q: '¿Cuánto cobra SomosTécnicos por cada servicio?',
    a: 'Cobramos una comisión competitiva por cada orden completada. El porcentaje es transparente y lo conoces desde el inicio. Nunca hay cobros ocultos ni mensualidades.',
  },
  {
    q: '¿Puedo trabajar en más de una especialidad?',
    a: 'Sí. Puedes registrar varias especialidades en tu perfil. Recibirás órdenes de todas ellas en tu zona de cobertura según tu disponibilidad.',
  },
  {
    q: '¿Qué pasa si el cliente no queda satisfecho?',
    a: 'Tenemos un proceso claro de mediación. Revisamos el caso con ambas partes. Si el trabajo fue bien ejecutado y documentado, tu reputación queda protegida.',
  },
  {
    q: '¿Puedo trabajar en otros municipios además de Cali?',
    a: 'Sí. Cubrimos Cali, Yumbo, Jamundí, Palmira y Candelaria. Al registrarte puedes indicar en cuáles municipios estás disponible.',
  },
  {
    q: '¿Cuándo recibo el pago por mis servicios?',
    a: 'Los pagos se procesan semanalmente. Puedes ver el estado de tus cobros en tu panel de técnico en todo momento, con transparencia total.',
  },
]

export default function TrabajaConNosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, jobPostingSchema]),
        }}
      />

      <Header />

      <main className="pt-16 md:pt-20">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-[#1a0a0f]">
          {/* Grid background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="tcn-hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M48 0L0 0L0 48" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tcn-hero-grid)" />
          </svg>

          {/* Ambient glow */}
          <div
            className="absolute top-0 right-0 size-96 rounded-full bg-primary/12 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Content — single column, centered, compact for laptop viewports */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 lg:pt-12 pb-0">
            <div className="pb-10 lg:pb-12">

              {/* Breadcrumb */}
              <PageBreadcrumb
                variant="dark"
                showHomeIcon
                className="flex justify-center mb-5"
                items={[
                  { label: 'Inicio', href: '/' },
                  { label: 'Trabaja con Nosotros' },
                ]}
              />

              {/* Badge */}
              <div className="flex justify-center mb-5">
                <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 text-[#ff8fab] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Captando técnicos en Cali
                </div>
              </div>

              {/* H1 */}
              <h1 className="text-center text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] font-display text-white mb-4">
                Sé parte de la red técnica{' '}
                <span className="text-[#a50034]">más confiable</span>
                {' '}de Cali
              </h1>

              {/* Description */}
              <p className="text-center text-[0.9375rem] text-gray-400 leading-relaxed mb-7 max-w-[540px] mx-auto">
                ¿Eres técnico experto en reparación? Únete, recibe órdenes de clientes reales, gestiona tu agenda desde el celular y cobra de forma segura — sin depender de nadie.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <Link
                  href="/register/technician"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold px-8 py-3 rounded-lg transition-colors duration-200 text-[0.9375rem]"
                >
                  Postularme ahora — gratis
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 border border-white/14 hover:border-white/30 text-gray-300 hover:text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-[0.9375rem]"
                >
                  Cómo funciona
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Feature strip — 4 cards horizontal */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { icon: DollarSign, label: 'Desde $1.5M / mes', sub: 'Ingresos proyectados' },
                  { icon: Calendar,   label: 'Agenda flexible',    sub: 'Sin horarios fijos' },
                  { icon: Smartphone, label: 'Panel digital',       sub: 'Todo desde el celular' },
                  { icon: Shield,     label: 'Cobros seguros',      sub: 'Sin líos de efectivo' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center gap-2.5 bg-white/4 border border-white/7 hover:border-primary/30 hover:bg-white/6 rounded-xl p-4 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/14 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#ff8fab]" />
                    </div>
                    <div>
                      <p className="text-white text-[0.8125rem] font-semibold leading-snug">{label}</p>
                      <p className="text-gray-500 text-[0.6875rem] mt-0.5 leading-snug">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── Stats bar ── */}
          <div className="border-t border-white/6 bg-black/18 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {stats.map(({ value, label }, idx) => (
                  <div
                    key={label}
                    className={[
                      'py-4 text-center group',
                      idx % 2 === 1 ? 'border-l border-white/6' : '',
                      idx >= 2 ? 'border-t border-white/6 lg:border-t-0' : '',
                      idx > 0 ? 'lg:border-l' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <p className="text-xl sm:text-2xl font-bold text-white font-display group-hover:text-[#ff8fab] transition-colors duration-200">{value}</p>
                    <p className="text-gray-500 text-[0.6875rem] uppercase tracking-wider mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFICIOS ── */}
        <section className="py-24 bg-[#F5F3EF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mb-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">Por qué elegirnos</p>
              <h2 className="text-3xl sm:text-[2.25rem] font-bold text-[#2C3E50] mb-4 font-display leading-[1.15]">
                No somos una empresa que te contrata.{' '}
                <span className="text-primary">Somos la plataforma que te hace crecer.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed text-[0.9375rem]">
                Conectamos tu expertise con clientes que ya están buscando un técnico como tú — sin intermediarios, sin letra pequeña.
              </p>
            </div>

            {/* Asymmetric grid: first card spans 2 cols on lg */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map(({ icon: Icon, title, description, color, featured }) => (
                <div
                  key={title}
                  className={[
                    'bg-white rounded-2xl border border-gray-200/60 p-6 hover:border-primary/25 hover:shadow-md transition-all duration-200 group',
                    featured ? 'lg:col-span-2 sm:col-span-2' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className={`w-10 h-10 rounded-xl border border-primary/15 flex items-center justify-center mb-5 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#2C3E50] mb-2 text-[1.0625rem] group-hover:text-primary transition-colors duration-200 font-display">
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section id="como-funciona" className="py-24 bg-[#1a0a0f] relative overflow-hidden">
          {/* Dot pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="tcn-dots" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="14" cy="14" r="1.4" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tcn-dots)" />
          </svg>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-st-primary mb-3">El proceso</p>
              <h2 className="text-3xl sm:text-[2.25rem] font-bold text-white mb-4 font-display">
                Así de fácil es empezar
              </h2>
              <p className="text-gray-400 max-w-sm mx-auto text-[0.9375rem]">
                En menos de 48 horas puedes estar recibiendo órdenes de clientes reales en Cali.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 relative">
              {/*
                Connector line: positioned at vertical center of the step number box.
                Card has p-8 (2rem top padding). Number box is h-14 (3.5rem).
                Center = 2rem + 1.75rem = 3.75rem from top of card.
              */}
              <div
                className="hidden md:block absolute h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none"
                style={{ top: '3.75rem', left: 'calc(33.333% + 1.25rem)', right: 'calc(33.333% + 1.25rem)' }}
                aria-hidden="true"
              />

              {steps.map(({ number, title, description, cta }) => (
                <div
                  key={number}
                  className="relative overflow-hidden bg-white/4 border border-white/7 rounded-2xl p-8 hover:border-primary/35 hover:bg-white/6 transition-all duration-200 group"
                >
                  {/* Watermark number — clipped by overflow-hidden */}
                  <span
                    className="absolute -bottom-4 -right-2 text-[88px] font-bold text-white/4 font-display select-none pointer-events-none leading-none"
                    aria-hidden="true"
                  >
                    {number}
                  </span>

                  <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-bold font-display mb-6 relative z-10 transition-shadow duration-200 group-hover:shadow-[0_0_16px_rgba(165,0,52,0.4)]">
                    {number}
                  </div>
                  <h3 className="text-[1.0625rem] font-bold text-white mb-3 relative z-10">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 relative z-10">{description}</p>
                  <p className="text-xs font-semibold text-st-primary flex items-center gap-1.5 relative z-10">
                    <Clock className="w-3.5 h-3.5" />
                    {cta}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/register/technician"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold px-10 py-3.5 rounded-lg transition-colors duration-200 text-[1.0625rem]"
              >
                Comenzar ahora — es gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── ESPECIALIDADES ── */}
        <section className="py-24 bg-[#F5F3EF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">Áreas de trabajo</p>
              <h2 className="text-3xl sm:text-[2.25rem] font-bold text-[#2C3E50] mb-4 font-display">
                Buscamos expertos en estas áreas
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-[0.9375rem]">
                Si dominas alguna de estas especialidades, hay clientes esperándote en Cali ahora mismo.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {specialties.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-white border border-gray-200/70 rounded-xl p-4 hover:border-primary/30 hover:shadow-sm hover:-translate-y-px transition-all duration-200 group"
                >
                  <div className="w-9 h-9 bg-primary/7 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/13 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[0.8125rem] font-medium text-[#2C3E50] group-hover:text-primary transition-colors duration-200 leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REQUISITOS ── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-[1fr_352px] gap-12 lg:gap-16 items-start">
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">Requisitos</p>
                <h2 className="text-3xl sm:text-[2.25rem] font-bold text-[#2C3E50] mb-4 font-display leading-tight">
                  ¿Qué necesitas para unirte?
                </h2>
                <p className="text-gray-500 leading-relaxed mb-10 text-[0.9375rem]">
                  No pedimos títulos universitarios ni trámites interminables. Solo necesitamos que seas bueno en lo que haces y que trates bien a los clientes.
                </p>
                <div className="space-y-4">
                  {requirements.map((req) => (
                    <div key={req} className="flex items-start gap-3.5 group">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 group-hover:bg-primary transition-colors duration-200">
                        <CheckCircle className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors duration-200" />
                      </div>
                      <span className="text-gray-600 text-sm leading-relaxed">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA card */}
              <div className="bg-[#1a0a0f] rounded-2xl p-8 md:sticky md:top-24 border border-white/6">

                <h3 className="font-bold text-white text-xl mb-2 font-display">¿Listo para postularte?</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-7">
                  El proceso toma menos de 5 minutos. Completa el formulario y te contactamos en 24 horas.
                </p>
                <Link
                  href="/register/technician"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold px-6 py-3.5 rounded-lg transition-colors duration-200"
                >
                  Postularme gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-gray-200 text-center mt-4">Sin costos de registro · Sin letra pequeña</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <section className="py-24 bg-[#F5F3EF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">Testimonios</p>
              <h2 className="text-3xl sm:text-[2.25rem] font-bold text-[#2C3E50] mb-4 font-display">
                Lo que dicen los técnicos de la red
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto text-[0.9375rem]">
                Ellos tomaron la decisión. Hoy trabajan con más clientes, más orden y más ingresos.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map(({ name, specialty, zone, quote, stars, time }) => (
                <div
                  key={name}
                  className="relative bg-white rounded-2xl border border-gray-200/60 p-7 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Decorative quote — font-display for consistency */}
                  <span
                    className="absolute top-3 right-5 text-[72px] font-bold text-primary/6 font-display leading-none select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="font-bold text-[#2C3E50] text-sm">{name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{specialty} · {zone}</p>
                    <div className="inline-flex items-center gap-1.5 mt-2.5 bg-primary/7 px-2.5 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-[0.6875rem] text-primary font-semibold">{time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-[2.25rem] font-bold text-[#2C3E50] mb-4 font-display">
                Preguntas frecuentes
              </h2>
              <p className="text-gray-500 text-[0.9375rem]">
                Resolvemos las dudas más comunes antes de que te postules.
              </p>
            </div>
            <div className="space-y-2.5">
              {faqs.map(({ q, a }) => (
                <details
                  key={q}
                  className="group bg-[#F5F3EF] border border-gray-200/60 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none font-semibold text-[#2C3E50] text-sm hover:text-primary transition-colors duration-200 list-none">
                    <span>{q}</span>
                    {/* Plus icon — SVG inline, rotates to × when open */}
                    <span
                      className="shrink-0 w-6 h-6 rounded-full border border-primary flex items-center justify-center group-open:rotate-45 transition-transform duration-200"
                      aria-hidden="true"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 1V9M1 5H9" stroke="#A50034" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed bg-white border-t border-gray-100 pt-4">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-24 bg-primary relative overflow-hidden">
          {/* Diagonal stripe pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="tcn-stripes" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect x="0" y="0" width="1.5" height="56" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tcn-stripes)" />
          </svg>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-[3rem] font-bold mb-5 font-display text-white leading-[1.15]">
              Tu próximo cliente ya<br className="hidden sm:block" /> está en SomosTécnicos
            </h2>
            <p className="text-white/75 max-w-xl mx-auto mb-10 text-[1.0625rem] leading-relaxed">
              Únete gratis hoy y empieza a recibir órdenes de clientes reales en Cali. Sin mensualidades, sin compromisos, sin letra pequeña.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register/technician"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-gray-50 font-bold px-10 py-3.5 rounded-lg transition-colors duration-200 text-[1.0625rem]"
              >
                Registrarme como técnico
              </Link>
              <a
                href="tel:+573003094854"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold px-10 py-3.5 rounded-lg transition-colors duration-200 text-[0.9375rem]"
              >
                ¿Tienes preguntas? Llámanos
              </a>
            </div>
            <p className="text-white/40 text-sm mt-10">
              Más de 30 técnicos ya trabajan con nosotros en Cali · Registro 100% gratuito
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
