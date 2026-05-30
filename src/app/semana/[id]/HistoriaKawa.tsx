'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type { Week } from '@/lib/data/course'

// ── Reproductor de audio ──────────────────────────────────────────────────────
function AudioBtn({ src, label, forChild = false, color = '#2D6A4F' }: {
  src: string; label: string; forChild?: boolean; color?: string
}) {
  const audioRef               = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying]  = useState(false)
  const [progress, setProgress]= useState(0)
  const [duration, setDuration]= useState(0)
  const [error, setError]      = useState(false)

  useEffect(() => {
    const a = audioRef.current; if (!a) return
    const t  = () => setProgress(a.currentTime)
    const d  = () => setDuration(a.duration)
    const e  = () => { setPlaying(false); setProgress(0) }
    const er = () => setError(true)
    a.addEventListener('timeupdate', t)
    a.addEventListener('loadedmetadata', d)
    a.addEventListener('ended', e)
    a.addEventListener('error', er)
    return () => {
      a.removeEventListener('timeupdate', t)
      a.removeEventListener('loadedmetadata', d)
      a.removeEventListener('ended', e)
      a.removeEventListener('error', er)
    }
  }, [])

  if (error) return null

  const pct    = duration ? (progress / duration) * 100 : 0
  const fmt    = (s: number) => isNaN(s)||!s ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  const accent = forChild ? '#E65100' : color

  return (
    <button
      onClick={() => {
        const a = audioRef.current; if (!a) return
        if (playing) { a.pause(); setPlaying(false) }
        else { a.play().catch(() => {}); setPlaying(true) }
      }}
      style={{
        flex: 1, padding: '10px 10px', borderRadius: 14,
        background: forChild ? '#FFF3E0' : '#F0F9F4',
        border: `1.5px solid ${accent}30`,
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', textAlign: 'left'
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: accent, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 3px 8px ${accent}50`
      }}>
        {playing ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 9, color: accent, margin: '0 0 3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {forChild ? 'Para el niño/a' : 'Para el adulto'}
        </p>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </p>
        <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>
      <span style={{ fontSize: 9, color: '#9CA3AF', flexShrink: 0 }}>{fmt(progress)}</span>
    </button>
  )
}

// ── Ilustraciones SVG por parte ───────────────────────────────────────────────
const ILLUSTRATIONS: Record<string, string> = {
  inicio: `<svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="70" cy="165" rx="50" ry="12" fill="rgba(255,255,255,0.12)"/>
    <path d="M70 155 C70 155 38 122 42 90 C47 60 70 52 70 52 C70 52 93 60 98 90 C102 122 70 155 70 155Z" fill="#4CAF50"/>
    <path d="M70 118 C70 118 50 103 53 82" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M70 126 C70 126 90 111 87 90" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <ellipse cx="70" cy="158" rx="11" ry="7" fill="#5D4037"/>
    <circle cx="62" cy="50" r="4" fill="#A5D6A7" opacity="0.8"/>
    <circle cx="78" cy="45" r="3" fill="#C8E6C9" opacity="0.7"/>
    <circle cx="55" cy="58" r="2" fill="#81C784" opacity="0.6"/>
  </svg>`,

  desequilibrio: `<svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="75" r="32" fill="#FF8F00"/>
    <circle cx="60" cy="67" r="6" fill="#BF360C"/>
    <circle cx="80" cy="67" r="6" fill="#BF360C"/>
    <path d="M58 82 Q70 77 82 82" stroke="#BF360C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="55" y="107" width="30" height="35" rx="8" fill="#FF6D00"/>
    <rect x="28" y="110" width="24" height="12" rx="6" fill="#FF6D00"/>
    <rect x="88" y="110" width="24" height="12" rx="6" fill="#FF6D00"/>
    <rect x="55" y="142" width="12" height="22" rx="6" fill="#E64A19"/>
    <rect x="73" y="142" width="12" height="22" rx="6" fill="#E64A19"/>
    <path d="M18 55 Q38 38 68 50 Q98 62 118 38" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M15 110 Q40 92 70 104 Q100 116 118 96" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" fill="none" stroke-dasharray="6 5"/>
    <ellipse cx="70" cy="170" rx="45" ry="10" fill="rgba(255,255,255,0.08)"/>
  </svg>`,

  accion: `<svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="70" r="26" fill="#FFCC02"/>
    <circle cx="62" cy="63" r="5" fill="#333"/>
    <circle cx="78" cy="63" r="5" fill="#333"/>
    <path d="M62 76 Q70 82 78 76" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="52" y="96" width="36" height="38" rx="8" fill="#1976D2"/>
    <rect x="26" y="99" width="24" height="13" rx="6.5" fill="#1976D2"/>
    <rect x="90" y="99" width="24" height="13" rx="6.5" fill="#1976D2"/>
    <rect x="52" y="134" width="14" height="22" rx="7" fill="#1565C0"/>
    <rect x="74" y="134" width="14" height="22" rx="7" fill="#1565C0"/>
    <path d="M86 46 L90 59 L103 54 L92 66 L97 79" stroke="#FFD600" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="32" cy="100" r="18" fill="rgba(255,255,255,0.15)"/>
    <ellipse cx="32" cy="103" rx="10" ry="7" fill="#795548" opacity="0.8"/>
    <path d="M24 100 Q28 90 36 92 Q44 94 40 102 Q36 110 28 106Z" fill="#4CAF50" opacity="0.9"/>
  </svg>`,

  catarsis: `<svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="68" r="26" fill="#FFCC02"/>
    <circle cx="62" cy="61" r="5" fill="#333"/>
    <circle cx="78" cy="61" r="5" fill="#333"/>
    <path d="M62 74 Q70 80 78 74" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="52" y="94" width="36" height="34" rx="8" fill="#9C27B0"/>
    <rect x="26" y="97" width="24" height="12" rx="6" fill="#9C27B0"/>
    <rect x="90" y="97" width="24" height="12" rx="6" fill="#9C27B0"/>
    <rect x="52" y="128" width="14" height="22" rx="7" fill="#7B1FA2"/>
    <rect x="74" y="128" width="14" height="22" rx="7" fill="#7B1FA2"/>
    <ellipse cx="60" cy="88" rx="4" ry="8" fill="#64B5F6" opacity="0.85"/>
    <ellipse cx="80" cy="90" rx="4" ry="8" fill="#64B5F6" opacity="0.75"/>
    <circle cx="40" cy="56" r="5" fill="#64B5F6" opacity="0.6"/>
    <circle cx="100" cy="50" r="4" fill="#64B5F6" opacity="0.5"/>
    <circle cx="110" cy="66" r="3" fill="#64B5F6" opacity="0.4"/>
    <circle cx="30" cy="70" r="3" fill="#64B5F6" opacity="0.4"/>
    <ellipse cx="70" cy="168" rx="45" ry="10" fill="rgba(255,255,255,0.08)"/>
  </svg>`,

  ensenanza: `<svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="70" r="26" fill="#FFCC02"/>
    <circle cx="62" cy="63" r="5" fill="#333"/>
    <circle cx="78" cy="63" r="5" fill="#333"/>
    <path d="M62 76 Q70 82 78 76" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="52" y="96" width="36" height="34" rx="8" fill="#FF8F00"/>
    <rect x="26" y="99" width="24" height="12" rx="6" fill="#FF8F00"/>
    <rect x="90" y="99" width="24" height="12" rx="6" fill="#FF8F00"/>
    <rect x="52" y="130" width="14" height="22" rx="7" fill="#E65100"/>
    <rect x="74" y="130" width="14" height="22" rx="7" fill="#E65100"/>
    <path d="M70 36 L73 46 L84 46 L75 53 L78 63 L70 57 L62 63 L65 53 L56 46 L67 46Z" fill="#FFD600" stroke="#F57F17" stroke-width="1"/>
    <path d="M100 40 L102 48 L110 48 L104 53 L106 61 L100 57 L94 61 L96 53 L90 48 L98 48Z" fill="#FFD600" stroke="#F57F17" stroke-width="0.8"/>
    <path d="M40 40 L42 48 L50 48 L44 53 L46 61 L40 57 L34 61 L36 53 L30 48 L38 48Z" fill="#FFD600" stroke="#F57F17" stroke-width="0.8"/>
    <ellipse cx="70" cy="168" rx="45" ry="10" fill="rgba(255,255,255,0.08)"/>
  </svg>`,
}

// ── Configuración de cada parte ───────────────────────────────────────────────
const STEP_CONFIG = {
  inicio:        { label: 'Inicio',        color: '#2D6A4F', darkColor: '#1B4332', bg: 'linear-gradient(160deg, #1B4332, #2D6A4F)' },
  desequilibrio: { label: 'Desequilibrio', color: '#E64A19', darkColor: '#BF360C', bg: 'linear-gradient(160deg, #BF360C, #E64A19)' },
  accion:        { label: 'Acción',        color: '#1976D2', darkColor: '#0D47A1', bg: 'linear-gradient(160deg, #0D47A1, #1976D2)' },
  catarsis:      { label: 'Catarsis',      color: '#7B1FA2', darkColor: '#4A148C', bg: 'linear-gradient(160deg, #4A148C, #7B1FA2)' },
  ensenanza:     { label: 'Enseñanza',     color: '#F57F17', darkColor: '#E65100', bg: 'linear-gradient(160deg, #E65100, #F57F17)' },
}

const STEP_KEYS = ['inicio', 'desequilibrio', 'accion', 'catarsis', 'ensenanza'] as const
type StepKey = typeof STEP_KEYS[number]

// Postura asociada a cada parte de la historia (semana 1)
const POSTURA_POR_PARTE: Record<number, Record<StepKey, { emoji: string; name: string; magic: string; id: string }>> = {
  1: {
    inicio:        { emoji: '🏔️', name: 'Montaña',          magic: 'El Cuerpo que No Tiembla', id: 'montana' },
    desequilibrio: { emoji: '🐢', name: 'Tortuga',           magic: 'La Casa que Siempre Llevas', id: 'tortuga' },
    accion:        { emoji: '🧘', name: 'Postura del Indio', magic: 'El Trono de Oma', id: 'indio' },
    catarsis:      { emoji: '🐱', name: 'Gato I y II',       magic: 'La Espalda que Respira', id: 'gato' },
    ensenanza:     { emoji: '🌲', name: 'Árbol',             magic: 'Las Raíces que Suben', id: 'arbol' },
  },
  2: {
    inicio:        { emoji: '🧒', name: 'Postura del Niño',  magic: 'El Caracol del Fondo del Mar', id: 'postura_nino' },
    desequilibrio: { emoji: '🦋', name: 'Mariposa',          magic: 'La Raya que Baila en el Agua', id: 'mariposa' },
    accion:        { emoji: '🐍', name: 'Cobra',             magic: 'La Serpiente que Sale del Mar', id: 'cobra' },
    catarsis:      { emoji: '🌉', name: 'Puente',            magic: 'La Gran Ola de Kawa', id: 'puente' },
    ensenanza:     { emoji: '🦋', name: 'Mariposa',          magic: 'La Raya que Baila en el Agua', id: 'mariposa' },
  },
  3: {
    inicio:        { emoji: '⚔️', name: 'Guerrero II',       magic: 'Kawa Abre las Alas', id: 'guerrero2' },
    desequilibrio: { emoji: '🔺', name: 'Triángulo',         magic: 'El Rayo del Cóndor', id: 'triangulo' },
    accion:        { emoji: '🦅', name: 'Gaviota',           magic: 'El Vuelo de Inti', id: 'gaviota' },
    catarsis:      { emoji: '🚢', name: 'Barco',             magic: 'La Nave del Viento', id: 'barco' },
    ensenanza:     { emoji: '🧸', name: 'Marioneta',         magic: 'Los Hilos que se Sueltan', id: 'marioneta' },
  },
  4: {
    inicio:        { emoji: '🐍', name: 'Cobra Profunda',    magic: 'La Llama que Sube', id: 'cobra_profunda' },
    desequilibrio: { emoji: '⚔️', name: 'Guerrero I',        magic: 'La Llama Conquistadora', id: 'guerrero1' },
    accion:        { emoji: '☀️', name: 'Saludo al Sol',     magic: 'La Danza del Volcán', id: 'saludo_sol' },
    catarsis:      { emoji: '🌸', name: 'Flor de Loto',      magic: 'La Rosa que Nace del Fuego', id: 'flor_loto' },
    ensenanza:     { emoji: '🌸', name: 'Flor de Loto',      magic: 'La Rosa que Nace del Fuego', id: 'flor_loto' },
  },
  5: {
    inicio:        { emoji: '🌌', name: 'Secuencia Completa', magic: 'El Viaje Completo', id: 'secuencia_completa' },
    desequilibrio: { emoji: '🫀', name: 'OM de la Ballena',  magic: 'La Vibración del Origen', id: 'om_ballena' },
    accion:        { emoji: '🌌', name: 'Secuencia Completa', magic: 'El Viaje Completo', id: 'secuencia_completa' },
    catarsis:      { emoji: '🫀', name: 'OM de la Ballena',  magic: 'La Vibración del Origen', id: 'om_ballena' },
    ensenanza:     { emoji: '🌌', name: 'Secuencia Completa', magic: 'El Viaje Completo', id: 'secuencia_completa' },
  },
}

// ── Componente principal ──────────────────────────────────────────────────────
interface HistoriaKawaProps {
  week: Week
  weekColors: { main: string; light: string }
  onComplete: () => void
  isCompleted: boolean
}

export default function HistoriaKawa({ week, weekColors, onComplete, isCompleted }: HistoriaKawaProps) {
  const [current, setCurrent]     = useState(0)
  const [direction, setDirection] = useState<'next'|'prev'|null>(null)
  const [animating, setAnimating] = useState(false)
  const touchStartX               = useRef<number>(0)

  const steps      = Object.entries(week.story)
  const total      = steps.length
  const stepKey    = STEP_KEYS[current] as StepKey
  const stepConfig = STEP_CONFIG[stepKey] || STEP_CONFIG.inicio
  const posturas   = POSTURA_POR_PARTE[week.id] || POSTURA_POR_PARTE[1]
  const postura    = posturas[stepKey] || posturas.inicio
  const s          = week.id

  const audioMapNarracion: Record<string, string> = {
    montana: 'montana', indio: 'posturaindio', tortuga: 'posturatortuga',
    gato: 'gatolYII', arbol: 'posturaarbol',
  }
  const audioKey = audioMapNarracion[postura.id] || postura.id

  const goTo = useCallback((idx: number) => {
    if (animating || idx === current) return
    setDirection(idx > current ? 'next' : 'prev')
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
      setDirection(null)
    }, 320)
  }, [animating, current])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (dx < 0 && current < total - 1) goTo(current + 1)
      if (dx > 0 && current > 0) goTo(current - 1)
    }
  }

  const [stepKey_, stepData] = steps[current]

  // Animación de la tarjeta
  const cardTransform = animating
    ? direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)'
    : 'translateX(0)'

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.14)' }}>

      {/* ── ÁREA DE TARJETA (carrusel) ── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Tarjeta actual */}
        <div style={{
          transform: cardTransform,
          transition: animating ? 'transform 0.32s cubic-bezier(.4,0,.2,1)' : 'none',
          willChange: 'transform'
        }}>
          {/* Header con ilustración */}
          <div style={{
            background: stepConfig.bg,
            height: 220,
            position: 'relative',
            display: 'flex', alignItems: 'flex-end',
            padding: '0 20px 18px'
          }}>
            {/* Círculos decorativos */}
            <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 10, right: -10, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

            {/* Ilustración SVG */}
            <div style={{
              position: 'absolute', right: 16, top: '50%',
              transform: 'translateY(-50%)',
              width: 130, height: 170,
              opacity: 0.95
            }}
              dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[stepKey_] || ILLUSTRATIONS.inicio }}
            />

            {/* Badge y número */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 20, padding: '4px 12px', marginBottom: 8
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: stepConfig.darkColor
                }}>
                  {current + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {stepConfig.label}
                </span>
              </div>
              <h3 style={{
                fontSize: 18, fontWeight: 700, color: 'white', margin: 0,
                fontFamily: "'Georgia','Times New Roman',serif",
                textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                maxWidth: 180
              }}>
                {stepData.title}
              </h3>
            </div>

            {/* Dots de progreso (estilo Instagram) */}
            <div style={{
              position: 'absolute', top: 14, left: 0, right: 0,
              display: 'flex', gap: 4, padding: '0 16px'
            }}>
              {steps.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i <= current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                  transition: 'background 0.3s'
                }} />
              ))}
            </div>
          </div>

          {/* Texto de la historia */}
          <div style={{
            background: 'white', padding: '16px 18px 14px',
            borderLeft: `4px solid ${stepConfig.color}`
          }}>
            <p style={{
              fontSize: 13, color: '#374151', lineHeight: 1.8,
              fontStyle: 'italic', margin: 0,
              fontFamily: "'Georgia','Times New Roman',serif"
            }}>
              "{stepData.text}"
            </p>
          </div>
        </div>
      </div>

      {/* ── BARRA INFERIOR FIJA ── */}
      <div style={{ background: 'white', borderTop: '1px solid #F3F4F6' }}>

        {/* Audios */}
        <div style={{ padding: '12px 14px 8px', display: 'flex', gap: 8 }}>
          <AudioBtn
            src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
            label="Narración mágica"
            forChild={true}
            color={stepConfig.color}
          />
          <AudioBtn
            src={`/audio/semana-${s}/s${s}howto${audioKey}.m4a`}
            label="Cómo hacer la postura"
            forChild={false}
            color={stepConfig.color}
          />
        </div>

        {/* Postura asociada */}
        <div style={{
          margin: '0 14px 12px',
          background: '#F8F7F4', borderRadius: 14,
          padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: stepConfig.color + '20',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0
          }}>
            {postura.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Postura de esta parte
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0 }}>{postura.name}</p>
            <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, fontStyle: 'italic' }}>"{postura.magic}"</p>
          </div>
          <div style={{
            background: stepConfig.color, color: 'white',
            borderRadius: 10, padding: '5px 10px', fontSize: 10, fontWeight: 700, flexShrink: 0
          }}>
            Ver →
          </div>
        </div>

        {/* Navegación */}
        <div style={{ display: 'flex', gap: 8, padding: '0 14px 14px', alignItems: 'center' }}>
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '1.5px solid #E5E7EB', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, cursor: current === 0 ? 'default' : 'pointer',
              opacity: current === 0 ? 0.3 : 1, flexShrink: 0
            }}
          >
            ←
          </button>

          {current < total - 1 ? (
            <button
              onClick={() => goTo(current + 1)}
              style={{
                flex: 1, padding: '12px', borderRadius: 14,
                background: stepConfig.color,
                border: 'none', cursor: 'pointer',
                color: 'white', fontSize: 14, fontWeight: 700,
                boxShadow: `0 4px 14px ${stepConfig.color}50`
              }}
            >
              Siguiente parte →
            </button>
          ) : (
            <button
              onClick={onComplete}
              style={{
                flex: 1, padding: '12px', borderRadius: 14,
                background: isCompleted ? '#E8F5E9' : stepConfig.color,
                border: isCompleted ? `2px solid ${weekColors.main}` : 'none',
                cursor: 'pointer',
                color: isCompleted ? weekColors.main : 'white',
                fontSize: 14, fontWeight: 700,
                boxShadow: isCompleted ? 'none' : `0 4px 14px ${stepConfig.color}50`
              }}
            >
              {isCompleted ? '⭐ Historia completada' : '⭐ Completar historia'}
            </button>
          )}

          <button
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '1.5px solid #E5E7EB', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, cursor: current === total - 1 ? 'default' : 'pointer',
              opacity: current === total - 1 ? 0.3 : 1, flexShrink: 0
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
