'use client'
import { useState, useRef, useEffect } from 'react'
import type { Week, SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'
import ProtocoloTO from './ProtocoloTO'
import HistoriaKawa from './HistoriaKawa'
import CelebracionScreen from './CelebracionScreen'

interface Props {
  week: Week
  weekColors: { main: string; light: string }
  activeProfile: SensoryProfile | null
}

// Solo 3 secciones reales — posturas viven dentro de la historia
type Section = 'historia' | 'respiracion' | 'relajacion'
const SECTIONS: Section[] = ['historia', 'respiracion', 'relajacion']

// Vista actual: mapa = pantalla de selección, sección activa = dentro de esa sección
type View = 'mapa' | Section

// Degradados por sección
const SEC_CONFIG: Record<Section, { icon: string; label: string; sublabel: string; duration: string; color: string; dark: string; bg: string }> = {
  historia:    { icon:'📖', label:'Historia + Posturas', sublabel:'El hilo conductor de la clase',    duration:'~25 min', color:'#A87840', dark:'#6A4A10', bg:'linear-gradient(145deg,#D4E8A0,#C8D890,#E8D4A0)' },
  respiracion: { icon:'🌬️', label:'Respiración',        sublabel:'Técnica de regulación sensorial',  duration:'~5 min',  color:'#4070B0', dark:'#1A4080', bg:'linear-gradient(145deg,#A8C8F8,#98B8F0,#B8A8F8)' },
  relajacion:  { icon:'☁️', label:'Relajación',         sublabel:'Cierre guiado de la sesión',       duration:'~8 min',  color:'#8858A8', dark:'#5A2878', bg:'linear-gradient(145deg,#E0B8F8,#D0A0F0,#B8B0F8)' },
}

// Reproductor de audio
function AudioBtn({ src, label, sublabel, color, bg, size = 'normal' }: {
  src: string; label: string; sublabel?: string; color: string; bg: string; size?: 'large' | 'normal'
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
    a.addEventListener('timeupdate', t); a.addEventListener('loadedmetadata', d)
    a.addEventListener('ended', e);      a.addEventListener('error', er)
    return () => {
      a.removeEventListener('timeupdate', t); a.removeEventListener('loadedmetadata', d)
      a.removeEventListener('ended', e);      a.removeEventListener('error', er)
    }
  }, [])

  if (error) return null
  const pct = duration ? (progress / duration) * 100 : 0
  const fmt = (s: number) => isNaN(s) || !s ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const btnSize = size === 'large' ? 52 : 36

  return (
    <div style={{ background: bg, border: `1px solid ${color}25`, borderRadius: 14, padding: size === 'large' ? '12px 14px' : '9px 12px', marginBottom: 8 }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => {
          const a = audioRef.current; if (!a) return
          if (playing) { a.pause(); setPlaying(false) } else { a.play().catch(() => {}); setPlaying(true) }
        }} style={{ width: btnSize, height: btnSize, borderRadius: '50%', background: color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', boxShadow: `0 3px 10px ${color}40` }}>
          {playing
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>}
        </button>
        <div style={{ flex: 1 }}>
          {sublabel && <p style={{ fontSize: 9, color: color, fontWeight: 700, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sublabel}</p>}
          <p style={{ fontSize: size === 'large' ? 13 : 11, fontWeight: 500, color: '#1F2937', margin: '0 0 5px' }}>{label}</p>
          <div style={{ height: 3, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
        <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{fmt(progress)}</span>
      </div>
    </div>
  )
}

// Componente principal
export default function ClaseTab({ week, weekColors, activeProfile }: Props) {
  const [view, setView]                     = useState<View>('mapa')
  const [completedSections, setCompleted]   = useState<Set<Section>>(new Set())
  const [historiaStep, setHistoriaStep]     = useState(0)
  const [showCelebracion, setShowCelebracion] = useState(false)
  const [logOpen, setLogOpen]               = useState(false)
  const [mood, setMood]                     = useState<'great'|'good'|'okay'|'hard'>('good')
  const [notes, setNotes]                   = useState('')

  const { logSession, activeChildId, userType, children } = useAppStore()
  const activeChild = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const childName   = activeChild?.name || 'Guardián'
  const profile     = activeProfile ? PROFILES[activeProfile] : null
  const s           = week.id
  const doneCount   = completedSections.size
  const totalSecs   = SECTIONS.length

  const markDone = (sec: Section) => {
    const newSet = new Set([...completedSections, sec])
    setCompleted(newSet)
    if (newSet.size === totalSecs) {
      setShowCelebracion(true)
    } else {
      // Volver al mapa al completar una sección
      setView('mapa')
    }
  }

  // Celebración
  if (showCelebracion) {
    return (
      <CelebracionScreen
        week={week}
        childName={childName}
        starsEarned={doneCount}
        totalSections={totalSecs}
        onContinue={() => { setShowCelebracion(false); setLogOpen(true) }}
      />
    )
  }

  // ── VISTA MAPA ─────────────────────────────────────────────────────────────
  if (view === 'mapa') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>

        {/* Progreso de la sesión */}
        <div style={{ background: 'white', borderRadius: 16, padding: '11px 14px', border: '0.5px solid #F0E8E0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: '#2D1808', fontWeight: 500, margin: 0 }}>Progreso de hoy</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {SECTIONS.map(sec => (
              <span key={sec} style={{ fontSize: 20, opacity: completedSections.has(sec) ? 1 : 0.2, transition: 'opacity 0.3s' }}>⭐</span>
            ))}
            <p style={{ fontSize: 11, color: '#C4A090', margin: 0 }}>{doneCount}/{totalSecs}</p>
          </div>
        </div>

        {/* ── TARJETA HISTORIA + POSTURAS — protagonista ── */}
        <div style={{ background: 'white', borderRadius: 18, overflow: 'hidden', border: completedSections.has('historia') ? '2px solid #C8D890' : '0.5px solid #F0E8E0', boxShadow: '0 4px 16px rgba(180,160,100,0.1)' }}>
          {/* Header degradado */}
          <div style={{ background: SEC_CONFIG.historia.bg, padding: '14px 16px 12px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
            {/* Mini stories bar */}
            <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: i <= historiaStep && completedSections.has('historia') ? 'rgba(255,255,255,0.9)' : i < historiaStep ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)' }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 9, color: 'rgba(60,40,8,0.65)', margin: '0 0 3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Historia + Posturas</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#3A2808', margin: 0, fontFamily: "'Georgia',serif" }}>{week.guardian} {week.guardianSpecies}</p>
                <p style={{ fontSize: 11, color: 'rgba(60,40,8,0.55)', margin: '3px 0 0', fontStyle: 'italic' }}>"{week.teaching}"</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ background: 'rgba(255,255,255,0.35)', borderRadius: 8, padding: '3px 9px', border: '1px solid rgba(255,255,255,0.5)', marginBottom: 4 }}>
                  <p style={{ fontSize: 10, color: '#3A2808', fontWeight: 600, margin: 0 }}>~25 min</p>
                </div>
                {completedSections.has('historia') && (
                  <span style={{ fontSize: 18 }}>⭐</span>
                )}
              </div>
            </div>
          </div>

          {/* Posturas en fila */}
          <div style={{ padding: '10px 16px', borderBottom: '0.5px solid #F5F0E8' }}>
            <p style={{ fontSize: 9, color: '#C4A090', margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>5 posturas integradas</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {week.posturas.slice(0, 5).map((p: any, i: number) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F5F0E8,#EDE8E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {p.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: '10px 16px 14px' }}>
            <button
              onClick={() => setView('historia')}
              style={{ width: '100%', padding: '12px', borderRadius: 13, background: completedSections.has('historia') ? '#F5F0E8' : 'linear-gradient(135deg,#D4E8A0,#B8D080)', border: completedSections.has('historia') ? '1.5px solid #C8D890' : 'none', cursor: 'pointer', color: completedSections.has('historia') ? '#6A5A20' : '#3A4810', fontSize: 13, fontWeight: 600, boxSizing: 'border-box' }}>
              {completedSections.has('historia') ? '⭐ Historia completada · Ver de nuevo' : 'Comenzar historia →'}
            </button>
          </div>
        </div>

        {/* ── TARJETA RESPIRACIÓN ── */}
        <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: completedSections.has('respiracion') ? '2px solid #98B8F0' : '0.5px solid #F0E8E0' }}>
          <button
            onClick={() => setView('respiracion')}
            style={{ width: '100%', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 13, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box' }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg,#A8C8F8,#88A8E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              🌬️
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, color: '#4070B0', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Respiración</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#2D1808', margin: '0 0 2px' }}>{week.breathing.name}</p>
              <p style={{ fontSize: 11, color: '#C4A090', margin: 0 }}>~5 min · calma el sistema nervioso</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              {completedSections.has('respiracion') ? (
                <span style={{ fontSize: 20 }}>⭐</span>
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#A8C8F8,#88A8E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>→</div>
              )}
            </div>
          </button>
        </div>

        {/* ── TARJETA RELAJACIÓN ── */}
        <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: completedSections.has('relajacion') ? '2px solid #D0A0F0' : '0.5px solid #F0E8E0' }}>
          <button
            onClick={() => setView('relajacion')}
            style={{ width: '100%', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 13, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box' }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg,#E0B8F8,#C090E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              ☁️
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, color: '#8858A8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Relajación</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#2D1808', margin: '0 0 2px' }}>Relajación guiada de Kawa</p>
              <p style={{ fontSize: 11, color: '#C4A090', margin: 0 }}>~8 min · cierre de sesión</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              {completedSections.has('relajacion') ? (
                <span style={{ fontSize: 20 }}>⭐</span>
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#E0B8F8,#C090E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>→</div>
              )}
            </div>
          </button>
        </div>

        {/* Protocolo TO */}
        {userType === 'profesional' && (
          <ProtocoloTO week={week} weekColors={weekColors} />
        )}

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
                  logSession({ weekId: week.id, childId: activeChildId ?? '', completed: doneCount === totalSecs, mood, notes, posturesCompleted: week.posturas.map((p: any) => p.id) })
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

  // ── VISTA HISTORIA ─────────────────────────────────────────────────────────
  if (view === 'historia') {
    return (
      <div>
        {/* Botón volver al mapa */}
        <button
          onClick={() => setView('mapa')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#C4A090', fontSize: 13, padding: '0 0 12px', fontWeight: 500 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver a la clase
        </button>
        <HistoriaKawa
          week={week}
          weekColors={weekColors}
          onComplete={() => markDone('historia')}
          isCompleted={completedSections.has('historia')}
          currentStep={historiaStep}
          onStepChange={setHistoriaStep}
        />
      </div>
    )
  }

  // ── VISTA RESPIRACIÓN ──────────────────────────────────────────────────────
  if (view === 'respiracion') {
    return (
      <div style={{ paddingBottom: 16 }}>
        <button
          onClick={() => setView('mapa')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#C4A090', fontSize: 13, padding: '0 0 12px', fontWeight: 500 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver a la clase
        </button>

        {/* Header */}
        <div style={{ background: 'linear-gradient(145deg,#A8C8F8,#98B8F0,#B8A8F8)', borderRadius: 18, padding: '16px 18px', marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 11, color: 'rgba(10,32,80,0.65)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Respiración</p>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#0A2050', margin: '0 0 4px', fontFamily: "'Georgia',serif" }}>{week.breathing.name}</p>
          <p style={{ fontSize: 11, color: 'rgba(10,32,80,0.6)', margin: 0, fontStyle: 'italic' }}>"{week.breathing.storyNarration}"</p>
        </div>

        {/* Audios */}
        <div style={{ background: 'white', borderRadius: 16, padding: '12px 14px', marginBottom: 10, border: '0.5px solid #F0E8E0' }}>
          <AudioBtn
            src={`/audio/semana-${s}/s${s}respiracionraiz.m4a`}
            label="Guía de respiración completa"
            sublabel="🌬️ Seguir junto al niño/a"
            color="#4070B0"
            bg="linear-gradient(135deg,#EEF4FF,#E4EEFF)"
            size="large"
          />
          <AudioBtn
            src={`/audio/semana-${s}/s${s}howtorespiacionraiz.m4a`}
            label="Cómo enseñarla"
            sublabel="🧘 Guía para el adulto"
            color="#6858C0"
            bg="linear-gradient(135deg,#F2EEFF,#EAE4FF)"
          />
        </div>

        {/* Info colapsable */}
        <div style={{ background: 'white', borderRadius: 16, padding: '12px 14px', marginBottom: 10, border: '0.5px solid #F0E8E0' }}>
          <div style={{ background: 'linear-gradient(135deg,#EEF4FF,#E4EEFF)', borderRadius: 12, padding: '10px 13px', marginBottom: 8, borderLeft: '3px solid #4070B0' }}>
            <p style={{ fontSize: 10, color: '#4070B0', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cómo hacerla</p>
            <p style={{ fontSize: 12, color: '#1A1A1A', lineHeight: 1.65, margin: 0 }}>{week.breathing.howTo}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: '#F8F5FF', borderRadius: 10, padding: '9px 12px' }}>
              <p style={{ fontSize: 10, color: '#8858A8', fontWeight: 700, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Beneficio</p>
              <p style={{ fontSize: 11, color: '#1A1A1A', margin: 0, lineHeight: 1.55 }}>{week.breathing.benefit}</p>
            </div>
            <div style={{ flex: 1, background: '#F0F4FF', borderRadius: 10, padding: '9px 12px' }}>
              <p style={{ fontSize: 10, color: '#4070B0', fontWeight: 700, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cuándo usarla</p>
              <p style={{ fontSize: 11, color: '#1A1A1A', margin: 0, lineHeight: 1.55 }}>{week.breathing.whenToUse}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => markDone('respiracion')}
          style={{ width: '100%', padding: '14px', borderRadius: 14, background: completedSections.has('respiracion') ? '#EEF4FF' : 'linear-gradient(135deg,#6878D0,#4058B0)', border: completedSections.has('respiracion') ? '2px solid #98B8F0' : 'none', cursor: 'pointer', color: completedSections.has('respiracion') ? '#4070B0' : 'white', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}>
          {completedSections.has('respiracion') ? '⭐ Respiración completada' : '⭐ Marcar como completada'}
        </button>
      </div>
    )
  }

  // ── VISTA RELAJACIÓN ───────────────────────────────────────────────────────
  if (view === 'relajacion') {
    return (
      <div style={{ paddingBottom: 16 }}>
        <button
          onClick={() => setView('mapa')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#C4A090', fontSize: 13, padding: '0 0 12px', fontWeight: 500 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver a la clase
        </button>

        {/* Header */}
        <div style={{ background: 'linear-gradient(145deg,#E0B8F8,#D0A0F0,#B8B0F8)', borderRadius: 18, padding: '16px 18px', marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 11, color: 'rgba(56,8,80,0.6)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Relajación</p>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#380850', margin: '0 0 4px', fontFamily: "'Georgia',serif" }}>Relajación guiada de Kawa</p>
          <p style={{ fontSize: 11, color: 'rgba(56,8,80,0.55)', margin: 0 }}>Pon play y acompaña al niño/a acostado</p>
        </div>

        {/* Audio principal */}
        <div style={{ background: 'white', borderRadius: 16, padding: '12px 14px', marginBottom: 10, border: '0.5px solid #F0E8E0' }}>
          <AudioBtn
            src={`/audio/semana-${s}/s${s}relajacion.m4a`}
            label="Relajación guiada completa"
            sublabel="☁️ Reproducir mientras el niño/a está acostado"
            color="#8858A8"
            bg="linear-gradient(135deg,#F8EEFF,#F0E4FF)"
            size="large"
          />
        </div>

        {/* Script de relajación */}
        <div style={{ background: 'linear-gradient(135deg,#F5F0FF,#EDE8FF)', borderRadius: 16, padding: '14px 16px', marginBottom: 10, borderLeft: '3px solid #C090E8', border: '0.5px solid #E0D0F8' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#8858A8', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Leer en voz baja mientras el niño/a está acostado
          </p>
          {week.relaxationScript.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} style={{ fontSize: 13, color: '#380850', fontStyle: 'italic', lineHeight: 1.75, margin: '0 0 10px', fontFamily: "'Georgia',serif" }}>{paragraph}</p>
          ))}
        </div>

        <button
          onClick={() => markDone('relajacion')}
          style={{ width: '100%', padding: '14px', borderRadius: 14, background: completedSections.has('relajacion') ? '#F8EEFF' : 'linear-gradient(135deg,#B878D8,#8848B8)', border: completedSections.has('relajacion') ? '2px solid #D0A0F0' : 'none', cursor: 'pointer', color: completedSections.has('relajacion') ? '#8858A8' : 'white', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}>
          {completedSections.has('relajacion') ? '⭐ Relajación completada' : '⭐ Marcar como completada'}
        </button>
      </div>
    )
  }

  return null
}
