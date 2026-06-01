'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type { Week } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'

// ── Configuración por parte de la historia ────────────────────────────────────
const STEP_CONFIG = {
  inicio:        { label: 'Inicio',        short: 'Inicio',   color: '#2D6A4F', dark: '#1B4332', bg: 'linear-gradient(160deg, #1B4332, #2D6A4F)' },
  desequilibrio: { label: 'Desequilibrio', short: 'Deseq.',   color: '#E64A19', dark: '#BF360C', bg: 'linear-gradient(160deg, #BF360C, #E64A19)' },
  accion:        { label: 'Acción',        short: 'Acción',   color: '#1976D2', dark: '#0D47A1', bg: 'linear-gradient(160deg, #0D47A1, #1976D2)' },
  catarsis:      { label: 'Catarsis',      short: 'Catarsis', color: '#7B1FA2', dark: '#4A148C', bg: 'linear-gradient(160deg, #4A148C, #7B1FA2)' },
  ensenanza:     { label: 'Enseñanza',     short: 'Enseñ.',   color: '#F57F17', dark: '#E65100', bg: 'linear-gradient(160deg, #E65100, #F57F17)' },
}

const STEP_KEYS = ['inicio', 'desequilibrio', 'accion', 'catarsis', 'ensenanza'] as const
type StepKey = typeof STEP_KEYS[number]

// ── Postura por semana y parte ────────────────────────────────────────────────
const POSTURA_POR_PARTE: Record<number, Record<StepKey, { emoji: string; name: string; magic: string; id: string }>> = {
  1: {
    inicio:        { emoji: '🏔️', name: 'Montaña',          magic: 'El Cuerpo que No Tiembla',    id: 'montana' },
    desequilibrio: { emoji: '🐢', name: 'Tortuga',           magic: 'La Casa que Siempre Llevas',  id: 'tortuga' },
    accion:        { emoji: '🧘', name: 'Postura del Indio', magic: 'El Trono de Oma',              id: 'indio' },
    catarsis:      { emoji: '🐱', name: 'Gato I y II',       magic: 'La Espalda que Respira',       id: 'gato' },
    ensenanza:     { emoji: '🌲', name: 'Árbol',             magic: 'Las Raíces que Suben',         id: 'arbol' },
  },
  2: {
    inicio:        { emoji: '🧒', name: 'Postura del Niño',  magic: 'El Caracol del Fondo del Mar', id: 'postura_nino' },
    desequilibrio: { emoji: '🦋', name: 'Mariposa',          magic: 'La Raya que Baila en el Agua', id: 'mariposa' },
    accion:        { emoji: '🐍', name: 'Cobra',             magic: 'La Serpiente que Sale del Mar', id: 'cobra' },
    catarsis:      { emoji: '🌉', name: 'Puente',            magic: 'La Gran Ola de Kawa',          id: 'puente' },
    ensenanza:     { emoji: '🦋', name: 'Mariposa',          magic: 'La Raya que Baila en el Agua', id: 'mariposa' },
  },
  3: {
    inicio:        { emoji: '⚔️', name: 'Guerrero II',       magic: 'Kawa Abre las Alas',           id: 'guerrero2' },
    desequilibrio: { emoji: '🦅', name: 'Gaviota',           magic: 'El Vuelo de Inti',             id: 'gaviota' },
    accion:        { emoji: '🚢', name: 'Barco',             magic: 'La Nave del Viento',           id: 'barco' },
    catarsis:      { emoji: '🧸', name: 'Marioneta',         magic: 'Los Hilos que se Sueltan',     id: 'marioneta' },
    ensenanza:     { emoji: '⚔️', name: 'Guerrero II',       magic: 'Kawa Abre las Alas',           id: 'guerrero2' },
  },
  4: {
    inicio:        { emoji: '🐍', name: 'Cobra Profunda',    magic: 'La Llama que Sube',            id: 'cobra_profunda' },
    desequilibrio: { emoji: '⚔️', name: 'Guerrero I',        magic: 'La Llama Conquistadora',       id: 'guerrero1' },
    accion:        { emoji: '☀️', name: 'Saludo al Sol',     magic: 'La Danza del Volcán',          id: 'saludo_sol' },
    catarsis:      { emoji: '🌸', name: 'Flor de Loto',      magic: 'La Rosa que Nace del Fuego',   id: 'flor_loto' },
    ensenanza:     { emoji: '🌸', name: 'Flor de Loto',      magic: 'La Rosa que Nace del Fuego',   id: 'flor_loto' },
  },
  5: {
    inicio:        { emoji: '🌌', name: 'Secuencia Completa', magic: 'El Viaje Completo',           id: 'secuencia_completa' },
    desequilibrio: { emoji: '🫀', name: 'OM de la Ballena',  magic: 'La Vibración del Origen',      id: 'om_ballena' },
    accion:        { emoji: '🌌', name: 'Secuencia Completa', magic: 'El Viaje Completo',           id: 'secuencia_completa' },
    catarsis:      { emoji: '🫀', name: 'OM de la Ballena',  magic: 'La Vibración del Origen',      id: 'om_ballena' },
    ensenanza:     { emoji: '🌌', name: 'Secuencia Completa', magic: 'El Viaje Completo',           id: 'secuencia_completa' },
  },
}

// ── Audio map ─────────────────────────────────────────────────────────────────
const AUDIO_MAP: Record<string, string> = {
  montana: 'montana', indio: 'posturaindio', tortuga: 'posturatortuga',
  gato: 'gatolYII', arbol: 'posturaarbol',
  postura_nino: 'posturapostura_nino', mariposa: 'posturamariposa',
  cobra: 'posturacobra', puente: 'posturapuente',
  guerrero2: 'posturaguerrero2', gaviota: 'posturagaviota',
  barco: 'posturabarco', marioneta: 'posturamarioneta',
}

// ── Imagen de postura con fallback ────────────────────────────────────────────
function PosturaImage({ weekId, posturaId, gender, color }: {
  weekId: number; posturaId: string; gender: 'male' | 'female'; color: string
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const generoPath = gender === 'female' ? 'nina' : 'nino'

  useEffect(() => {
    // Semanas 4 y 5 aún no tienen imágenes — usar solo SVG
    if (weekId > 3) { setImgSrc(null); return }

    // Intentar jpg primero, luego png
    const tryJpg = `/posturas/semana-${weekId}/${generoPath}/${posturaId}.jpg`
    const tryPng = `/posturas/semana-${weekId}/${generoPath}/${posturaId}.png`

    const img = new Image()
    img.onload  = () => setImgSrc(tryJpg)
    img.onerror = () => {
      const img2 = new Image()
      img2.onload  = () => setImgSrc(tryPng)
      img2.onerror = () => setImgSrc(null)
      img2.src = tryPng
    }
    img.src = tryJpg
  }, [weekId, posturaId, generoPath])

  if (!imgSrc) {
    // Fallback: círculo con emoji centrado
    return (
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52
        }}>
          {POSTURA_POR_PARTE[weekId]?.[posturaId as StepKey]?.emoji || '🧘'}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', pointerEvents: 'none'
    }}>
      {/* Imagen centrada */}
      <img
        src={imgSrc}
        alt="postura de yoga"
        style={{
          height: '105%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'center bottom',
          opacity: 0.55,
          filter: 'brightness(1.1) contrast(0.9)',
        }}
      />
      {/* Degradado superior — difumina hacia el color del guardián */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />
      {/* Degradado inferior — integra con el texto */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />
      {/* Degradado lateral izquierdo — espacio para el texto */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%',
        background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  )
}

// ── Botón de audio compacto ───────────────────────────────────────────────────
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
    <button onClick={() => {
      const a = audioRef.current; if (!a) return
      if (playing) { a.pause(); setPlaying(false) }
      else { a.play().catch(() => {}); setPlaying(true) }
    }} style={{
      flex: 1, padding: '10px 10px', borderRadius: 14,
      background: forChild ? 'rgba(255,243,205,0.95)' : 'rgba(240,249,244,0.95)',
      border: `1.5px solid ${accent}40`,
      display: 'flex', alignItems: 'center', gap: 8,
      cursor: 'pointer', textAlign: 'left',
      backdropFilter: 'blur(8px)'
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: accent, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 3px 8px ${accent}50`
      }}>
        {playing
          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 9, color: accent, margin: '0 0 2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {forChild ? '👦 Para el niño/a' : '👩 Para el adulto'}
        </p>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </p>
        <div style={{ height: 3, background: 'rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>
      <span style={{ fontSize: 9, color: '#9CA3AF', flexShrink: 0 }}>{fmt(progress)}</span>
    </button>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
interface HistoriaKawaProps {
  week: Week
  weekColors: { main: string; light: string }
  onComplete: () => void
  isCompleted: boolean
  currentStep?: number
  onStepChange?: (step: number) => void
}

export default function HistoriaKawa({
  week, weekColors, onComplete, isCompleted,
  currentStep = 0, onStepChange
}: HistoriaKawaProps) {
  const { children, activeChildId } = useAppStore()
  const activeChild = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const gender = activeChild?.gender ?? 'male'

  const [current, setCurrent]     = useState(currentStep)
  const [animating, setAnimating] = useState(false)
  const [slideDir, setSlideDir]   = useState<'left'|'right'>('left')
  const touchStartX               = useRef<number>(0)

  const steps   = Object.entries(week.story)
  const total   = steps.length
  const stepKey = STEP_KEYS[current] as StepKey
  const config  = STEP_CONFIG[stepKey] || STEP_CONFIG.inicio
  const posturas = POSTURA_POR_PARTE[week.id] || POSTURA_POR_PARTE[1]
  const postura  = posturas[stepKey] || posturas.inicio
  const s        = week.id
  const audioKey = AUDIO_MAP[postura.id] || postura.id

  const [, stepData] = steps[current]

  const goTo = useCallback((idx: number) => {
    if (animating || idx === current || idx < 0 || idx >= total) return
    setSlideDir(idx > current ? 'left' : 'right')
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      onStepChange?.(idx)
      setAnimating(false)
    }, 300)
  }, [animating, current, total, onStepChange])

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) dx < 0 ? goTo(current + 1) : goTo(current - 1)
  }

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.14)' }}>

      {/* ── ÁREA PRINCIPAL DEL CARRUSEL ── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div style={{
          transform: animating
            ? slideDir === 'left' ? 'translateX(-8%)' : 'translateX(8%)'
            : 'translateX(0)',
          opacity: animating ? 0 : 1,
          transition: animating ? 'all 0.3s ease' : 'none',
        }}>
          {/* HEADER con imagen de fondo */}
          <div style={{
            background: config.bg,
            height: 240,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 18px 16px'
          }}>
            {/* Círculos decorativos */}
            <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

            {/* Imagen de postura según género */}
            <PosturaImage
              weekId={week.id}
              posturaId={postura.id}
              gender={gender}
              color={config.color}
            />

            {/* Barra de progreso tipo stories */}
            <div style={{
              position: 'absolute', top: 12, left: 0, right: 0,
              display: 'flex', gap: 4, padding: '0 14px', zIndex: 2
            }}>
              {steps.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  flex: 1, height: 3, borderRadius: 2, border: 'none', cursor: 'pointer', padding: 0,
                  background: i < current
                    ? 'rgba(255,255,255,0.9)'
                    : i === current
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.3)',
                  transition: 'background 0.3s'
                }} />
              ))}
            </div>

            {/* Badge y título */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 20, padding: '4px 12px', marginBottom: 8
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: config.dark
                }}>
                  {current + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {config.label}
                </span>
              </div>
              <h3 style={{
                fontSize: 19, fontWeight: 700, color: 'white', margin: 0,
                fontFamily: "'Georgia','Times New Roman',serif",
                textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                maxWidth: '65%'
              }}>
                {stepData.title}
              </h3>
            </div>
          </div>

          {/* TEXTO DE LA HISTORIA */}
          <div style={{
            background: 'white',
            padding: '14px 18px 12px',
            borderLeft: `4px solid ${config.color}`
          }}>
            <p style={{
              fontSize: 13, color: '#374151', lineHeight: 1.8,
              fontStyle: 'italic', margin: 0,
              fontFamily: "'Georgia','Times New Roman',serif"
            }}>
              "{stepData.text}"
            </p>
          </div>

          {/* AUDIOS INTEGRADOS */}
          <div style={{
            background: '#F8F7F4',
            padding: '10px 14px',
            borderTop: '1px solid #F0EDE8'
          }}>
            <p style={{
              fontSize: 9, fontWeight: 700, color: '#9CA3AF',
              margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              🎧 Audios de esta parte
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <AudioBtn
                src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                label="Narración mágica"
                forChild={true}
                color={config.color}
              />
              <AudioBtn
                src={`/audio/semana-${s}/s${s}howto${audioKey}.m4a`}
                label="Cómo hacer la postura"
                forChild={false}
                color={config.color}
              />
            </div>
          </div>

          {/* POSTURA ASOCIADA */}
          <div style={{
            background: 'white',
            padding: '10px 14px 14px',
            borderTop: '1px solid #F0EDE8'
          }}>
            <div style={{
              background: '#F8F7F4', borderRadius: 14,
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: config.color + '20',
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
              <button
                onClick={() => {
                  // Navegar a posturas — el padre maneja esto
                  const event = new CustomEvent('kawa-ver-postura', { detail: { posturaId: postura.id } })
                  window.dispatchEvent(event)
                }}
                style={{
                  background: config.color, color: 'white',
                  borderRadius: 10, padding: '7px 12px',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  border: 'none', cursor: 'pointer'
                }}
              >
                Ver →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── NAVEGACIÓN INFERIOR ── */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #F3F4F6',
        padding: '12px 14px',
        display: 'flex', gap: 8, alignItems: 'center'
      }}>
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          style={{
            width: 42, height: 42, borderRadius: '50%',
            border: '1.5px solid #E5E7EB', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, cursor: current === 0 ? 'default' : 'pointer',
            opacity: current === 0 ? 0.3 : 1, flexShrink: 0
          }}
        >←</button>

        {current < total - 1 ? (
          <button
            onClick={() => goTo(current + 1)}
            style={{
              flex: 1, padding: '13px', borderRadius: 14,
              background: config.color, border: 'none', cursor: 'pointer',
              color: 'white', fontSize: 14, fontWeight: 700,
              boxShadow: `0 4px 14px ${config.color}50`
            }}
          >
            Siguiente parte →
          </button>
        ) : (
          <button
            onClick={onComplete}
            style={{
              flex: 1, padding: '13px', borderRadius: 14,
              background: isCompleted ? '#E8F5E9' : config.color,
              border: isCompleted ? `2px solid ${weekColors.main}` : 'none',
              cursor: 'pointer',
              color: isCompleted ? weekColors.main : 'white',
              fontSize: 14, fontWeight: 700,
              boxShadow: isCompleted ? 'none' : `0 4px 14px ${config.color}50`
            }}
          >
            {isCompleted ? '⭐ Historia completada' : '⭐ Completar historia'}
          </button>
        )}

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          style={{
            width: 42, height: 42, borderRadius: '50%',
            border: '1.5px solid #E5E7EB', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, cursor: current === total - 1 ? 'default' : 'pointer',
            opacity: current === total - 1 ? 0.3 : 1, flexShrink: 0
          }}
        >→</button>
      </div>
    </div>
  )
}
