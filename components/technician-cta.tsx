'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Calendar } from 'lucide-react'

const PARTICLES = [
  { size: 8,  left: 12, top: 22, dur: 4.2, delay: 0 },
  { size: 14, left: 28, top: 65, dur: 5.8, delay: 1.1 },
  { size: 6,  left: 52, top: 18, dur: 3.9, delay: 2.3 },
  { size: 18, left: 68, top: 72, dur: 6.4, delay: 0.7 },
  { size: 10, left: 82, top: 30, dur: 4.7, delay: 1.9 },
  { size: 7,  left: 91, top: 58, dur: 5.1, delay: 3.0 },
  { size: 12, left: 40, top: 85, dur: 4.4, delay: 0.4 },
  { size: 5,  left: 74, top: 10, dur: 6.1, delay: 2.8 },
]

const STATS = [
  { value: '30+',  label: 'Técnicos activos' },
  { value: '4.8★', label: 'Calificación' },
  { value: '$0',   label: 'Registro' },
]

const BENEFITS = [
  { icon: Zap,      text: 'Órdenes en tu zona de trabajo' },
  { icon: Shield,   text: 'Pagos seguros, sin efectivo' },
  { icon: Calendar, text: 'Agenda 100% flexible' },
]

export default function TechnicianCTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const tiltRef = useRef({ x: 0, y: 0 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scanPos, setScanPos] = useState(-100)

  useEffect(() => {
    setMounted(true)
  }, [])

  /* Scan line animation */
  useEffect(() => {
    if (!isHovered) {
      setScanPos(-100)
      return
    }
    let pos = -10
    const step = () => {
      pos += 1.4
      setScanPos(pos)
      if (pos < 110) rafRef.current = requestAnimationFrame(step)
      else setScanPos(-100)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isHovered])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width   // 0..1
    const ny = (e.clientY - rect.top)  / rect.height  // 0..1
    const tx = (ny - 0.5) * -14  // rotateX
    const ty = (nx - 0.5) *  14  // rotateY
    tiltRef.current = { x: tx, y: ty }
    setTilt({ x: tx, y: ty })
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    tiltRef.current = { x: 0, y: 0 }
  }, [])

  const shadowX = tilt.y *  0.8
  const shadowY = tilt.x * -0.8 + 14

  return (
    <section className="bg-white px-4 py-10 overflow-hidden">
      <div
        className="max-w-6xl mx-auto"
        style={{ perspective: '1400px', perspectiveOrigin: 'center center' }}
      >
        {/* Tilt wrapper */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative cursor-pointer"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: isHovered
              ? 'transform 0.08s linear'
              : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ── Depth shadow layers ── */}
          <div
            className="absolute inset-0 rounded-2xl bg-[#5a0018] pointer-events-none"
            style={{
              transform: `translateZ(-24px) translateY(${shadowY + 6}px) translateX(${shadowX + 6}px)`,
              transition: isHovered ? 'transform 0.08s linear' : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-2xl bg-[#7a0024] pointer-events-none"
            style={{
              transform: `translateZ(-12px) translateY(${shadowY * 0.6 + 3}px) translateX(${shadowX * 0.6 + 3}px)`,
              transition: isHovered ? 'transform 0.08s linear' : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
            }}
            aria-hidden="true"
          />

          {/* ── Main card ── */}
          <Link
            href="/trabaja-con-nosotros"
            className="group relative flex flex-col md:flex-row items-stretch rounded-2xl overflow-hidden select-none"
            style={{
              boxShadow: isHovered
                ? `0 40px 90px rgba(0,0,0,0.65), 0 16px 40px rgba(165,0,52,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`
                : `0 24px 60px rgba(0,0,0,0.45), 0 8px 24px rgba(165,0,52,0.25)`,
              transition: 'box-shadow 0.3s ease',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Scan line */}
            {mounted && (
              <div
                className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl"
                aria-hidden="true"
              >
                <div
                  className="absolute left-0 right-0 h-px"
                  style={{
                    top: `${scanPos}%`,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.18) 70%, transparent 100%)',
                    opacity: scanPos < 0 || scanPos > 100 ? 0 : 1,
                  }}
                />
              </div>
            )}

            {/* Floating particles */}
            {mounted && PARTICLES.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none z-10"
                style={{
                  width:  p.size,
                  height: p.size,
                  left:   `${p.left}%`,
                  top:    `${p.top}%`,
                  background: i % 3 === 0
                    ? 'rgba(165,0,52,0.3)'
                    : i % 3 === 1
                    ? 'rgba(255,100,140,0.15)'
                    : 'rgba(255,255,255,0.08)',
                  animation: `cta-float-${i % 3} ${p.dur}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                  filter: 'blur(1px)',
                }}
                aria-hidden="true"
              />
            ))}

            {/* ── LEFT dark panel ── */}
            <div className="relative flex-1 bg-[#120608] px-8 py-8 flex flex-col justify-between overflow-hidden">
              {/* Pulsing ambient glow */}
              <div
                className="absolute -top-20 -left-20 size-80 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(165,0,52,0.5) 0%, transparent 70%)',
                  animation: 'cta-glow-pulse 3.5s ease-in-out infinite',
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.5s ease',
                }}
                aria-hidden="true"
              />
              {/* Surface highlight */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at ${50 + tilt.y * 2}% ${50 + tilt.x * 2}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
                }}
                aria-hidden="true"
              />
              {/* Edge bleed to red panel */}
              <div
                className="absolute inset-y-0 right-0 w-28 pointer-events-none"
                style={{ background: 'linear-gradient(to left, rgba(165,0,52,0.2), transparent)' }}
                aria-hidden="true"
              />

              {/* Content */}
              <div
                className="relative"
                style={{
                  transform: isHovered ? 'translateZ(12px)' : 'translateZ(0)',
                  transition: 'transform 0.4s ease',
                }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[#ff7a9e] mb-3">
                  Para técnicos en Cali
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-3">
                  ¿Eres técnico?{' '}
                  <span
                    className="inline-block"
                    style={{
                      background: 'linear-gradient(90deg, #ff8fab, #A50034)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Recibe clientes
                  </span>{' '}
                  sin buscarlos.
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                  Únete gratis, gestiona tu agenda desde el celular y cobra seguro — sin mensualidades.
                </p>
              </div>

              {/* Stats floating cards */}
              <div className="relative flex flex-wrap gap-3 mt-6">
                {STATS.map(({ value, label }, i) => (
                  <div
                    key={label}
                    className="rounded-xl px-4 py-2.5 border border-white/10"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 2px 8px rgba(165,0,52,0.25)',
                      transform: isHovered
                        ? `translateZ(${16 + i * 4}px) translateY(-2px)`
                        : 'translateZ(0)',
                      transition: `transform ${0.35 + i * 0.06}s cubic-bezier(0.23,1,0.32,1)`,
                    }}
                  >
                    <p className="text-white font-bold text-lg leading-none">{value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT red panel ── */}
            <div
              className="relative px-8 py-8 flex flex-col justify-between gap-5 md:w-72 shrink-0 overflow-hidden"
              style={{
                background: isHovered
                  ? 'linear-gradient(150deg, #d4003f 0%, #A50034 50%, #850028 100%)'
                  : 'linear-gradient(150deg, #A50034 0%, #870028 100%)',
                transition: 'background 0.4s ease',
              }}
            >
              {/* Top light edge */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)' }}
                aria-hidden="true"
              />
              {/* Surface gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(175deg, rgba(255,255,255,0.09) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)' }}
                aria-hidden="true"
              />
              {/* Corner accent */}
              <div
                className="absolute bottom-0 right-0 size-40 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.06), transparent 70%)',
                }}
                aria-hidden="true"
              />

              <div
                className="relative space-y-4"
                style={{
                  transform: isHovered ? 'translateZ(8px)' : 'translateZ(0)',
                  transition: 'transform 0.4s ease',
                }}
              >
                {BENEFITS.map(({ icon: Icon, text }, i) => (
                  <div
                    key={text}
                    className="flex items-center gap-3"
                    style={{
                      transform: isHovered ? `translateZ(${(i + 1) * 5}px)` : 'translateZ(0)',
                      transition: `transform ${0.3 + i * 0.07}s cubic-bezier(0.23,1,0.32,1)`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      }}
                    >
                      <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-sm text-white/90 font-medium leading-snug">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="relative flex flex-col gap-2"
                style={{
                  transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
                  transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                <span
                  className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-sm transition-all duration-200"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)'
                      : '#ffffff',
                    color: '#A50034',
                    boxShadow: isHovered
                      ? '0 10px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(165,0,52,0.2)'
                      : '0 6px 20px rgba(0,0,0,0.35)',
                    transition: 'box-shadow 0.3s ease, background 0.3s ease',
                  }}
                >
                  Unirme gratis
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300"
                    style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}
                  />
                </span>
                <p className="text-center text-xs text-white/40">Sin costo de registro</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
