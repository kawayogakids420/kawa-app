'use client'
import { useState } from 'react'
import type { Week } from '@/lib/data/course'

interface AudioBtnProps {
  src: string
  label: string
  forChild?: boolean
  color?: string
}

function AudioBtn({ src, label, forChild = false, color = '#2D6A4F' }: AudioBtnProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)
  const audioRef = { current: null as HTMLAudioElement | null }

  const mount = (el: HTMLAudioElement | null) => {
    if (!el || audioRef.current === el) return
    audioRef.current = el
    el.addEventListener('timeupdate', () => setProgress(el.currentTime))
    el.addEventListener('loadedmetadata', () => setDuration(el.duration))
    el.addEventListener('ended', () => { setPlaying(false); setProgress(0) })
    el.addEventListener('error', () => setError(true))
  }

  if (error) return null
  const pct = duration ? (progress / duration) * 100 : 0
  const fmt = (s: number) => isNaN(s) || !s ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const accent = forChild ? '#E65100' : color

  return (
    <div style={{
      background: forChild ? 'rgba(255,243,205,0.8)' : 'rgba(255,255,255,0.7)',
      borderRadius: 12, padding: '10px 12px', marginBottom: 6,
      border: `1.5px solid ${accent}40`,
      backdropFilter: 'blur(4px)'
    }}>
      <audio ref={mount} src={src} preload="metadata" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => {
          const a = audioRef.current
          if (!a) return
          if (playing) { a.pause(); setPlaying(false) } else { a.play(); setPlaying(true) }
        }} style={{
          width: 38, height: 38, borderRadius: '50%',
          background: accent, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 14, flexShrink: 0,
          boxShadow: `0 3px 8px ${accent}50`
        }}>
          {playing
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: accent, margin: '0 0 5px', letterSpacing: '0.01em' }}>{label}</p>
          <div style={{ height: 5, background: 'rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
        </div>
        <span style={{ fontSize: 10, color: '#888', flexShrink: 0 }}>{fmt(progress)}</span>
      </div>
    </div>
  )
}

// ── Tarjeta de parte de la historia ──────────────────────────────────────────
const STEP_CONFIG = {
  inicio: {
    label: 'INICIO',
    emoji: '🌱',
    bg: '#E8F5E9',
    accent: '#2D6A4F',
    dark: '#1B4332',
    illustration: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="#C8E6C9"/>
        <ellipse cx="40" cy="58" rx="18" ry="6" fill="#A5D6A7"/>
        <path d="M40 52 C40 52 28 42 30 30 C32 20 40 18 40 18 C40 18 48 20 50 30 C52 42 40 52 40 52Z" fill="#4CAF50"/>
        <path d="M40 40 C40 40 32 34 34 26" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M40 44 C40 44 48 38 46 30" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="40" cy="56" r="5" fill="#795548"/>
        <path d="M35 56 Q40 52 45 56" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
      </svg>`,
  },
  desequilibrio: {
    label: 'DESEQUILIBRIO',
    emoji: '🌀',
    bg: '#FFF3E0',
    accent: '#E65100',
    dark: '#BF360C',
    illustration: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="#FFE0B2"/>
        <path d="M20 50 Q30 30 40 35 Q50 40 55 25" stroke="#FF6D00" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M25 55 Q35 35 45 40 Q52 43 58 28" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
        <circle cx="40" cy="38" r="8" fill="#FF8F00"/>
        <circle cx="38" cy="36" r="2" fill="#BF360C"/>
        <circle cx="43" cy="36" r="2" fill="#BF360C"/>
        <path d="M37 41 Q40 39 43 41" stroke="#BF360C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>`,
  },
  accion: {
    label: 'ACCIÓN',
    emoji: '⚡',
    bg: '#E3F2FD',
    accent: '#1565C0',
    dark: '#0D47A1',
    illustration: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="#BBDEFB"/>
        <circle cx="40" cy="32" r="10" fill="#FFCC02"/>
        <circle cx="38" cy="30" r="2" fill="#333"/>
        <circle cx="43" cy="30" r="2" fill="#333"/>
        <path d="M37 35 Q40 38 43 35" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <rect x="33" y="42" width="14" height="18" rx="4" fill="#1976D2"/>
        <rect x="22" y="43" width="10" height="5" rx="2.5" fill="#1976D2"/>
        <rect x="48" y="43" width="10" height="5" rx="2.5" fill="#1976D2"/>
        <rect x="33" y="60" width="5" height="10" rx="2.5" fill="#1565C0"/>
        <rect x="42" y="60" width="5" height="10" rx="2.5" fill="#1565C0"/>
        <path d="M44 20 L46 26 L52 24 L46 30 L48 36" stroke="#FFD600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`,
  },
  catarsis: {
    label: 'CATARSIS',
    emoji: '💧',
    bg: '#F3E5F5',
    accent: '#6A1B9A',
    dark: '#4A148C',
    illustration: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="#E1BEE7"/>
        <circle cx="40" cy="32" r="10" fill="#FFCC02"/>
        <circle cx="38" cy="30" r="2" fill="#333"/>
        <circle cx="43" cy="30" r="2" fill="#333"/>
        <path d="M37 35 Q40 33 43 35" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <rect x="33" y="42" width="14" height="16" rx="4" fill="#9C27B0"/>
        <rect x="22" y="43" width="10" height="5" rx="2.5" fill="#9C27B0"/>
        <rect x="48" y="43" width="10" height="5" rx="2.5" fill="#9C27B0"/>
        <ellipse cx="37" cy="38" rx="1.5" ry="3" fill="#64B5F6"/>
        <ellipse cx="43" cy="39" rx="1.5" ry="3" fill="#64B5F6"/>
        <ellipse cx="40" cy="55" rx="8" ry="4" fill="#CE93D8" opacity="0.5"/>
      </svg>`,
  },
  ensenanza: {
    label: 'ENSEÑANZA',
    emoji: '✨',
    bg: '#FFFDE7',
    accent: '#F57F17',
    dark: '#E65100',
    illustration: `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="#FFF9C4"/>
        <circle cx="40" cy="30" r="10" fill="#FFCC02"/>
        <circle cx="38" cy="28" r="2" fill="#333"/>
        <circle cx="43" cy="28" r="2" fill="#333"/>
        <path d="M37 33 Q40 37 43 33" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <rect x="33" y="40" width="14" height="16" rx="4" fill="#FF8F00"/>
        <rect x="22" y="41" width="10" height="5" rx="2.5" fill="#FF8F00"/>
        <rect x="48" y="41" width="10" height="5" rx="2.5" fill="#FF8F00"/>
        <path d="M40 12 L41.5 16 L46 16 L42.5 18.5 L44 23 L40 20.5 L36 23 L37.5 18.5 L34 16 L38.5 16 Z" fill="#FFD600" stroke="#F57F17" strokeWidth="0.5"/>
        <path d="M54 22 L55 25 L58 25 L55.5 26.8 L56.5 30 L54 28.2 L51.5 30 L52.5 26.8 L50 25 L53 25 Z" fill="#FFD600" stroke="#F57F17" strokeWidth="0.5"/>
        <path d="M26 22 L27 25 L30 25 L27.5 26.8 L28.5 30 L26 28.2 L23.5 30 L24.5 26.8 L22 25 L25 25 Z" fill="#FFD600" stroke="#F57F17" strokeWidth="0.5"/>
      </svg>`,
  },
}

interface StoryStepProps {
  stepKey: string
  step: { title: string; text: string }
  weekColors: { main: string; light: string }
  weekId: number
  index: number
}

function StoryStep({ stepKey, step, weekColors, weekId, index }: StoryStepProps) {
  const config = STEP_CONFIG[stepKey as keyof typeof STEP_CONFIG] || {
    label: stepKey.toUpperCase(), emoji: '📖',
    bg: '#F5F5F5', accent: weekColors.main, dark: weekColors.main,
    illustration: '<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" fill="#E0E0E0"/></svg>'
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 16,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: `1px solid ${config.bg}`
    }}>
      {/* Header tipo Brain Activation */}
      <div style={{
        background: config.bg,
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Número */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: config.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'white',
            flexShrink: 0, boxShadow: `0 3px 8px ${config.accent}60`
          }}>
            {index + 1}
          </div>
          <div>
            <p style={{
              fontSize: 9, fontWeight: 700, color: config.accent, margin: 0,
              letterSpacing: '0.1em', textTransform: 'uppercase'
            }}>
              {config.label}
            </p>
            <p style={{
              fontSize: 14, fontWeight: 700, color: config.dark, margin: 0,
              fontFamily: "'Georgia', 'Times New Roman', serif"
            }}>
              {step.title}
            </p>
          </div>
        </div>
        {/* Ilustración SVG */}
        <div style={{ width: 56, height: 56, flexShrink: 0 }}
          dangerouslySetInnerHTML={{ __html: config.illustration }} />
      </div>

      {/* Contenido */}
      <div style={{ padding: '16px 18px' }}>
        {/* Texto de la historia */}
        <div style={{
          background: config.bg + '60',
          borderRadius: 12, padding: '12px 14px',
          borderLeft: `3px solid ${config.accent}`,
          marginBottom: 12
        }}>
          <p style={{
            fontSize: 13, color: '#374151', lineHeight: 1.8,
            fontStyle: 'italic', margin: 0,
            fontFamily: "'Georgia', 'Times New Roman', serif"
          }}>
            "{step.text}"
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal de Historia ─────────────────────────────────────────
interface HistoriaKawaProps {
  week: Week
  weekColors: { main: string; light: string }
  onComplete: () => void
  isCompleted: boolean
}

export default function HistoriaKawa({ week, weekColors, onComplete, isCompleted }: HistoriaKawaProps) {
  const s = week.id

  return (
    <div>
      {/* ── HEADER TIPO BRAIN ACTIVATION ── */}
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
      }}>
        {/* Franja superior con textura */}
        <div style={{
          background: `linear-gradient(135deg, ${weekColors.main} 0%, ${weekColors.main}DD 100%)`,
          padding: '18px 18px 14px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Círculos decorativos de fondo */}
          {[['-20px','-20px',80],['80%','-10px',60],['70%','60%',40]].map(([l,t,sz],i) => (
            <div key={i} style={{
              position: 'absolute', left: l as string, top: t as string,
              width: sz as number, height: sz as number,
              borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
              pointerEvents: 'none'
            }} />
          ))}

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Badge del guardián */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '4px 12px', marginBottom: 10
            }}>
              <span style={{ fontSize: 14 }}>{week.elementEmoji}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Guardián {week.id} · {week.element}
              </span>
            </div>

            <h2 style={{
              fontSize: 20, fontWeight: 700, color: 'white', margin: '0 0 6px',
              fontFamily: "'Georgia', 'Times New Roman', serif"
            }}>
              📖 La historia de Kawa
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
              {week.guardian} {week.guardianSpecies} · {week.teaching}
            </p>
          </div>
        </div>

        {/* Franja de audio */}
        <div style={{
          background: weekColors.light,
          padding: '12px 18px',
          borderTop: `2px solid ${weekColors.main}20`
        }}>
          <p style={{
            fontSize: 9, fontWeight: 700, color: weekColors.main, margin: '0 0 8px',
            letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            🎧 Audio de la historia
          </p>
          <AudioBtn
            src={`/audio/semana-${s}/s${s}historiadekawa.m4a`}
            label="Narración completa — leer mientras el niño escucha"
            forChild={false}
            color={weekColors.main}
          />
        </div>
      </div>

      {/* ── SECCIÓN: PREPARA EL AMBIENTE ── */}
      <div style={{
        background: '#FFF8E1',
        borderRadius: 16, padding: '14px 16px', marginBottom: 16,
        border: '1.5px solid #FDE68A',
        display: 'flex', alignItems: 'flex-start', gap: 12
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: '#F59E0B', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
        }}>🎒</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#92400E', margin: '0 0 4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ANTES DE COMENZAR
          </p>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#78350F', margin: '0 0 4px' }}>
            {week.physicalObject.name}
          </p>
          <p style={{ fontSize: 11, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
            {week.physicalObject.description}
          </p>
        </div>
      </div>

      {/* ── PARTES DE LA HISTORIA ── */}
      <div style={{
        background: 'rgba(255,255,255,0.5)',
        borderRadius: 16, padding: '14px 16px', marginBottom: 12,
        border: '1px solid rgba(0,0,0,0.06)'
      }}>
        <p style={{
          fontSize: 9, fontWeight: 700, color: '#9CA3AF', margin: '0 0 12px',
          letterSpacing: '0.1em', textTransform: 'uppercase'
        }}>
          EL VIAJE DE KAWA — {Object.keys(week.story).length} PARTES
        </p>

        {Object.entries(week.story).map(([key, act], index) => (
          <StoryStep
            key={key}
            stepKey={key}
            step={act}
            weekColors={weekColors}
            weekId={week.id}
            index={index}
          />
        ))}
      </div>

      {/* ── OBJETO TÁCTIL / ENSEÑANZA ── */}
      <div style={{
        background: `linear-gradient(135deg, ${weekColors.main}15, ${weekColors.main}05)`,
        borderRadius: 16, padding: '14px 16px', marginBottom: 16,
        border: `1.5px solid ${weekColors.main}30`
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: weekColors.main,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0
          }}>🎁</div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: weekColors.main, margin: '0 0 4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              EL REGALO DEL GUARDIÁN
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '0 0 4px' }}>
              {week.tactileObject}
            </p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
              "{week.teaching}"
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTÓN COMPLETAR ── */}
      <button onClick={onComplete} style={{
        width: '100%', padding: '15px', borderRadius: 16,
        background: isCompleted
          ? `linear-gradient(135deg, #E8F5E9, #C8E6C9)`
          : `linear-gradient(135deg, ${weekColors.main}, ${weekColors.main}CC)`,
        border: isCompleted ? `2px solid ${weekColors.main}` : 'none',
        cursor: 'pointer', fontSize: 15, fontWeight: 700,
        color: isCompleted ? weekColors.main : 'white',
        letterSpacing: '0.02em',
        boxSizing: 'border-box',
        boxShadow: isCompleted ? 'none' : `0 4px 16px ${weekColors.main}50`,
        transition: 'all 0.3s'
      }}>
        {isCompleted ? '⭐ Historia completada — ¡Bien hecho!' : '⭐ Marcar historia como completada'}
      </button>
    </div>
  )
}
