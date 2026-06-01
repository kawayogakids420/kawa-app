'use client'
import { useState, useRef, useEffect } from 'react'
import type { Week, SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'
import ProtocoloTO from './ProtocoloTO'
import HistoriaKawa from './HistoriaKawa'
import { useRouter } from 'next/navigation'

interface Props {
  week: Week
  weekColors: { main: string; light: string }
  activeProfile: SensoryProfile | null
}

type Section = 'historia' | 'posturas' | 'respiracion' | 'relajacion'
const SECTIONS: Section[] = ['historia', 'posturas', 'respiracion', 'relajacion']

const STEP_LABELS = ['Inicio', 'Deseq.', 'Acción', 'Catarsis', 'Enseñ.']
const STEP_ICONS  = ['🌱', '🌀', '⚡', '💧', '✨']
const STEP_COLORS = ['#2D6A4F', '#E64A19', '#1976D2', '#7B1FA2', '#F57F17']

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
  const accent = forChild ? '#F57F17' : color

  return (
    <div style={{ background: forChild ? '#FFF8E1' : '#F0F9F4', border: `1.5px solid ${accent}30`, borderRadius: 14, padding: '10px 12px', marginBottom: 8 }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => {
          const a = audioRef.current; if (!a) return
          if (playing) { a.pause(); setPlaying(false) } else { a.play(); setPlaying(true) }
        }} style={{ width: 36, height: 36, borderRadius: '50%', background: accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontSize: 14 }}>
          {playing
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#374151', margin: '0 0 4px' }}>{label}</p>
          <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
        <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{fmt(progress)}</span>
      </div>
    </div>
  )
}

// ── Tarjeta de postura ────────────────────────────────────────────────────────
function PostureCard({ posture, weekColors, weekId, activeProfile, profile, showProfileTips, highlighted }: {
  posture: any; weekColors: { main: string; light: string }; weekId: number
  activeProfile: SensoryProfile | null; profile: any; showProfileTips: boolean
  highlighted?: boolean
}) {
  const [open, setOpen] = useState(highlighted ?? false)
  const audioMap: Record<string, string> = {
    montana: 'montana', indio: 'posturaindio', tortuga: 'posturatortuga',
    gato: 'gatolYII', arbol: 'posturaarbol',
  }
  const audioKey = audioMap[posture.id] || posture.id
  const s = weekId

  return (
    <div id={`postura-${posture.id}`} style={{
      background: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 10,
      border: highlighted ? `2px solid ${weekColors.main}` : '1.5px solid #F0EDE8',
      boxShadow: highlighted ? `0 4px 16px ${weekColors.main}30` : '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
        background: open ? weekColors.light : 'white', border: 'none', cursor: 'pointer', textAlign: 'left',
        borderBottom: open ? `1.5px solid ${weekColors.main}30` : 'none'
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: open ? weekColors.main : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, transition: 'all 0.2s' }}>
          {posture.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{posture.name}</p>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, fontStyle: 'italic' }}>"{posture.magicName}"</p>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: weekColors.main + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: weekColors.main, flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>↓</div>
      </button>

      {open && (
        <div style={{ padding: '14px' }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🎧 Audio de la postura</p>
          <AudioBtn src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`} label="Narración mágica — para el niño/a" forChild={true} color={weekColors.main} />
          <AudioBtn src={`/audio/semana-${s}/s${s}howto${audioKey}.m4a`} label="Cómo hacer la postura — para el adulto" forChild={false} color={weekColors.main} />
          <div style={{ height: 1, background: '#F3F4F6', margin: '10px 0' }} />
          <div style={{ background: '#FFFDE7', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
            <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Narración</p>
            <p style={{ fontSize: 12, color: '#374151', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{posture.storyNarration}"</p>
          </div>
          {showProfileTips && activeProfile && profile ? (
            <div style={{ background: profile.bg, borderRadius: 10, padding: '10px 12px' }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: profile.color, margin: '0 0 4px' }}>{profile.icon} Para {profile.name}:</p>
              <p style={{ fontSize: 12, color: profile.color, margin: 0 }}>{posture.profiles[activeProfile]}</p>
            </div>
          ) : (
            <div>
              <div style={{ background: weekColors.light, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cómo hacerla</p>
                <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>{posture.howTo}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: weekColors.main, margin: '6px 0 0' }}>⏱️ {posture.duration}</p>
              </div>
              <div style={{ background: '#F8F7F4', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Beneficios sensoriales</p>
                {posture.sensoryBenefits.map((b: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: weekColors.main, fontSize: 11, flexShrink: 0 }}>•</span>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ClaseTab({ week, weekColors, activeProfile }: Props) {
  const router = useRouter()
  const [activeSection, setActiveSection]     = useState<Section>('historia')
  const [completedSections, setCompleted]     = useState<Set<Section>>(new Set())
  const [historiaStep, setHistoriaStep]       = useState(0)
  const [showProfileTips, setShowProfileTips] = useState(false)
  const [highlightedPostura, setHighlightedPostura] = useState<string | null>(null)
  const { logSession, activeChildId, userType } = useAppStore()
  const [logOpen, setLogOpen] = useState(false)
  const [mood, setMood]       = useState<'great'|'good'|'okay'|'hard'>('good')
  const [notes, setNotes]     = useState('')

  const profile     = activeProfile ? PROFILES[activeProfile] : null
  const s           = week.id
  const doneCount   = completedSections.size
  const totalSecs   = SECTIONS.length

  const markDone = (sec: Section) => {
    setCompleted(prev => new Set([...prev, sec]))
    const idx = SECTIONS.indexOf(sec)
    if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1])
  }

  // Escuchar evento "Ver postura" desde HistoriaKawa
  useEffect(() => {
    const handler = (e: Event) => {
      const { posturaId } = (e as CustomEvent).detail
      setHighlightedPostura(posturaId)
      setActiveSection('posturas')
      setTimeout(() => {
        const el = document.getElementById(`postura-${posturaId}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
    window.addEventListener('kawa-ver-postura', handler)
    return () => window.removeEventListener('kawa-ver-postura', handler)
  }, [])

  // La barra de progreso muestra las 5 partes cuando estamos en Historia
  // y las 4 secciones cuando estamos en otras secciones
  const isInHistoria = activeSection === 'historia'

  return (
    <div>
      {/* ── BARRA DE PROGRESO ── */}
      <div style={{ background: 'white', borderRadius: 16, padding: '14px 16px', marginBottom: 12, border: '0.5px solid #E5E7EB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0 }}>
            {isInHistoria ? 'Historia de Kawa' : 'Progreso de esta sesión'}
          </p>
          <p style={{ fontSize: 13, fontWeight: 700, color: weekColors.main, margin: 0 }}>
            {isInHistoria ? `${historiaStep + 1}/5` : `${doneCount}/${totalSecs}`}
          </p>
        </div>

        {/* Barra de progreso */}
        <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{
            height: '100%', borderRadius: 3, transition: 'width 0.4s',
            width: isInHistoria
              ? `${((historiaStep + 1) / 5) * 100}%`
              : `${(doneCount / totalSecs) * 100}%`,
            background: isInHistoria ? STEP_COLORS[historiaStep] : weekColors.main
          }} />
        </div>

        {/* Tabs */}
        {isInHistoria ? (
          // Tabs de las 5 partes de la historia
          <div style={{ display: 'flex', gap: 4 }}>
            {STEP_LABELS.map((label, i) => {
              const done   = i < historiaStep
              const active = i === historiaStep
              return (
                <button key={i} onClick={() => setHistoriaStep(i)} style={{
                  flex: 1, padding: '6px 2px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 3, transition: 'all 0.2s',
                  background: done
                    ? STEP_COLORS[i]
                    : active
                    ? STEP_COLORS[i] + '20'
                    : '#F8F7F4'
                }}>
                  <span style={{ fontSize: 14 }}>{done ? '⭐' : STEP_ICONS[i]}</span>
                  <span style={{
                    fontSize: 8, fontWeight: 700,
                    color: done ? 'white' : active ? STEP_COLORS[i] : '#9CA3AF',
                    letterSpacing: '0.01em'
                  }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          // Tabs de las 4 secciones
          <div style={{ display: 'flex', gap: 6 }}>
            {SECTIONS.map(sec => {
              const done   = completedSections.has(sec)
              const active = activeSection === sec
              const icons: Record<Section, string> = { historia: '📖', posturas: '🧘', respiracion: '🌬️', relajacion: '☁️' }
              const labels: Record<Section, string> = { historia: 'Historia', posturas: 'Posturas', respiracion: 'Respir.', relajacion: 'Relaj.' }
              return (
                <button key={sec} onClick={() => setActiveSection(sec)} style={{
                  flex: 1, padding: '6px 4px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 3, transition: 'all 0.2s',
                  background: done ? weekColors.main : active ? weekColors.light : '#F8F7F4'
                }}>
                  <span style={{ fontSize: 16 }}>{done ? '⭐' : icons[sec]}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: done ? 'white' : active ? weekColors.main : '#9CA3AF' }}>
                    {labels[sec]}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {doneCount === totalSecs && !isInHistoria && (
          <div style={{ marginTop: 10, background: weekColors.light, borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: weekColors.main, margin: 0 }}>🌟 ¡Sesión completa! Ya puedes registrarla</p>
          </div>
        )}
      </div>

      {/* ── BOTÓN MATERIALES ── */}
      <button onClick={() => router.push('/materiales')} style={{
        width: '100%', padding: '12px 16px', borderRadius: 14, marginBottom: 12,
        background: '#FFF8E1', border: '1.5px solid #FDE68A',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', boxSizing: 'border-box'
      }}>
        <span style={{ fontSize: 22 }}>🎒</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', margin: 0 }}>Prepara los materiales</p>
          <p style={{ fontSize: 11, color: '#B45309', margin: 0 }}>{week.physicalObject.name} · Colchoneta · {week.tactileObject}</p>
        </div>
        <div style={{ background: '#F59E0B', color: 'white', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          Ver →
        </div>
      </button>

      {/* ══ HISTORIA — carrusel ══ */}
      {activeSection === 'historia' && (
        <HistoriaKawa
          week={week}
          weekColors={weekColors}
          onComplete={() => markDone('historia')}
          isCompleted={completedSections.has('historia')}
          currentStep={historiaStep}
          onStepChange={setHistoriaStep}
        />
      )}

      {/* ══ POSTURAS ══ */}
      {activeSection === 'posturas' && (
        <div>
          <div style={{ background: weekColors.main, borderRadius: '16px 16px 0 0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧘</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{week.posturas.length} posturas de Kawa</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0 }}>Las posturas de Kawa</p>
            </div>
            {profile && (
              <button onClick={() => setShowProfileTips(!showProfileTips)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10, padding: '6px 10px', color: 'white', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                {showProfileTips ? 'General' : `${profile.icon} ${profile.name}`}
              </button>
            )}
          </div>

          {week.posturas.map(posture => (
            <PostureCard
              key={posture.id}
              posture={posture}
              weekColors={weekColors}
              weekId={week.id}
              activeProfile={activeProfile}
              profile={profile}
              showProfileTips={showProfileTips}
              highlighted={highlightedPostura === posture.id}
            />
          ))}

          <div style={{ background: 'white', borderRadius: 14, padding: '14px', marginBottom: 10, border: '1.5px solid #F0EDE8' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>Adaptaciones por perfil</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.values(week.profileAdaptations).map((pa: any) => (
                <div key={pa.name} style={{ borderRadius: 10, padding: '10px', background: pa.bgColor }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: pa.color, margin: '0 0 5px' }}>{pa.icon} {pa.name}</p>
                  {pa.tips.slice(0, 2).map((tip: string, i: number) => (
                    <p key={i} style={{ fontSize: 10, color: pa.color, margin: '0 0 2px' }}>• {tip}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => markDone('posturas')} style={{ width: '100%', padding: '14px', borderRadius: 14, background: completedSections.has('posturas') ? '#E8F5E9' : weekColors.main, border: 'none', cursor: 'pointer', color: completedSections.has('posturas') ? weekColors.main : 'white', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}>
            {completedSections.has('posturas') ? '⭐ Posturas completadas' : '⭐ Marcar posturas como completadas'}
          </button>
        </div>
      )}

      {/* ══ RESPIRACIÓN ══ */}
      {activeSection === 'respiracion' && (
        <div>
          <div style={{ background: weekColors.main, borderRadius: '16px 16px 0 0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌬️</div>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Técnica de respiración</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0 }}>{week.breathing.name}</p>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 14, padding: '12px 14px', marginBottom: 10, border: '1.5px solid #F0EDE8' }}>
            <AudioBtn src={`/audio/semana-${s}/s${s}respiracionraiz.m4a`} label="Guía de respiración — seguir junto al niño/a" forChild={false} color={weekColors.main} />
            <AudioBtn src={`/audio/semana-${s}/s${s}howtorespiacionraiz.m4a`} label="Cómo enseñar la respiración — para el adulto" forChild={false} color={weekColors.main} />
          </div>
          <div style={{ background: '#FFFDE7', borderRadius: 14, padding: '12px 14px', marginBottom: 10, border: '1.5px solid #FDE68A' }}>
            <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Narración</p>
            <p style={{ fontSize: 13, color: '#374151', fontStyle: 'italic', lineHeight: 1.7, margin: 0, fontFamily: "'Georgia',serif" }}>"{week.breathing.storyNarration}"</p>
          </div>
          <div style={{ background: weekColors.light, borderRadius: 14, padding: '12px 14px', marginBottom: 10, border: `1.5px solid ${weekColors.main}30` }}>
            <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cómo hacerla</p>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>{week.breathing.howTo}</p>
          </div>
          <div style={{ background: 'white', borderRadius: 14, padding: '12px 14px', marginBottom: 10, border: '1.5px solid #F0EDE8' }}>
            <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Beneficio</p>
            <p style={{ fontSize: 12, color: '#374151', margin: '0 0 8px' }}>{week.breathing.benefit}</p>
            <p style={{ fontSize: 9, color: '#9CA3AF', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cuándo usarla</p>
            <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>{week.breathing.whenToUse}</p>
          </div>
          <button onClick={() => markDone('respiracion')} style={{ width: '100%', padding: '14px', borderRadius: 14, background: completedSections.has('respiracion') ? '#E8F5E9' : weekColors.main, border: 'none', cursor: 'pointer', color: completedSections.has('respiracion') ? weekColors.main : 'white', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}>
            {completedSections.has('respiracion') ? '⭐ Respiración completada' : '⭐ Marcar respiración como completada'}
          </button>
        </div>
      )}

      {/* ══ RELAJACIÓN ══ */}
      {activeSection === 'relajacion' && (
        <div>
          <div style={{ background: weekColors.main, borderRadius: '16px 16px 0 0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>☁️</div>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cierre de sesión</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0 }}>Relajación guiada de Kawa</p>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 14, padding: '12px 14px', marginBottom: 10, border: '1.5px solid #F0EDE8' }}>
            <AudioBtn src={`/audio/semana-${s}/s${s}relajacion.m4a`} label="Relajación guiada — reproducir mientras el niño está acostado" forChild={true} color={weekColors.main} />
          </div>
          <div style={{ background: '#E8EAF6', borderRadius: 14, padding: '14px', marginBottom: 10, border: '1.5px solid #C5CAE9' }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#5C6BC0', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Leer en voz baja mientras el niño está acostado</p>
            {week.relaxationScript.split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ fontSize: 13, color: '#283593', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 10px', fontFamily: "'Georgia',serif" }}>{paragraph}</p>
            ))}
          </div>
          <button onClick={() => markDone('relajacion')} style={{ width: '100%', padding: '14px', borderRadius: 14, background: completedSections.has('relajacion') ? '#E8F5E9' : weekColors.main, border: 'none', cursor: 'pointer', color: completedSections.has('relajacion') ? weekColors.main : 'white', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}>
            {completedSections.has('relajacion') ? '⭐ Relajación completada' : '⭐ Marcar relajación como completada'}
          </button>
        </div>
      )}

      {/* ── PROTOCOLO TO ── */}
      {userType === 'profesional' && (
        <div style={{ marginTop: 12 }}>
          <ProtocoloTO week={week} weekColors={weekColors} />
        </div>
      )}

      {/* ── REGISTRAR SESIÓN ── */}
      <button onClick={() => setLogOpen(true)} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'white', marginTop: 12, border: `2px solid ${weekColors.main}`, color: weekColors.main, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxSizing: 'border-box' }}>
        📝 Registrar esta sesión {doneCount === totalSecs ? '🌟' : `(${doneCount}/${totalSecs} completadas)`}
      </button>

      {/* Modal registro */}
      {logOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: 430, margin: '0 auto', borderRadius: '24px 24px 0 0', padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>¿Cómo fue la sesión?</h3>
            {doneCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 12px', borderRadius: 12, background: weekColors.light }}>
                <span style={{ fontSize: 22 }}>{'⭐'.repeat(doneCount)}</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: weekColors.main, margin: 0 }}>
                  {doneCount} estrella{doneCount > 1 ? 's' : ''} ganada{doneCount > 1 ? 's' : ''} hoy
                </p>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
              {(['great','good','okay','hard'] as const).map(m => (
                <button key={m} onClick={() => setMood(m)} style={{ padding: '12px 4px', borderRadius: 12, cursor: 'pointer', border: `2px solid ${mood === m ? weekColors.main : '#E5E7EB'}`, background: mood === m ? weekColors.light : 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 24 }}>{m === 'great' ? '🌟' : m === 'good' ? '😊' : m === 'okay' ? '😐' : '😔'}</span>
                  <span style={{ fontSize: 10, color: '#6B7280' }}>{m === 'great' ? 'Increíble' : m === 'good' ? 'Bien' : m === 'okay' ? 'Regular' : 'Difícil'}</span>
                </button>
              ))}
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas opcionales..." style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 12, padding: 12, fontSize: 13, height: 72, resize: 'none', marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setLogOpen(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid #E5E7EB', background: 'white', color: '#6B7280', fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={() => {
                logSession({ weekId: week.id, childId: activeChildId ?? '', completed: doneCount === totalSecs, mood, notes, posturesCompleted: week.posturas.map(p => p.id) })
                setLogOpen(false); setNotes('')
              }} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: weekColors.main, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Guardar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
