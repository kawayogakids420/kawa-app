'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, PROFILES, WEEK_COLORS } from '@/lib/data/course'
import { getWeekProgress } from '@/lib/utils'

// ── Símbolos de los mundos ────────────────────────────────────────────────────
const WORLD_SYMBOLS: Record<number, string> = {
  1: '/images/simbolo-tierra.png',
  2: '/images/simbolo-agua.png',
  3: '/images/simbolo-aire.png',
  4: '/images/simbolo-fuego.png',
  5: '/images/simbolo-infinito.png',
}

// ── Coach screen ──────────────────────────────────────────────────────────────
function CoachScreen({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: '🗺️', title: 'El mapa es tu guía', desc: 'Toca cualquier mundo para ir a esa clase. Kawa avanza un mundo por semana.' },
    { icon: '🧘', title: 'Cada clase toma 45 min', desc: 'Sigue el orden: Historia → Posturas → Respiración → Relajación. Puedes hacerla en partes.' },
    { icon: '⭐', title: 'Gana estrellas por cada parte', desc: 'Al completar cada sección ganas una estrella. ¡5 estrellas = sesión completa!' },
  ]
  const [idx, setIdx] = useState(0)
  const isLast = idx === steps.length - 1

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: 430, margin: '0 auto', borderRadius: '24px 24px 0 0', padding: '24px 24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ height: 6, borderRadius: 3, transition: 'all 0.3s', width: i === idx ? 24 : 8, backgroundColor: i === idx ? '#2D6A4F' : '#E5E7EB' }} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>{steps[idx].icon}</div>
          <h3 style={{ fontSize: 20, fontWeight: 500, color: '#111', marginBottom: 8, fontFamily: "'Livvic','Georgia',serif" }}>{steps[idx].title}</h3>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>{steps[idx].desc}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {!isLast && (
            <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 16, border: '1px solid #E5E7EB', background: 'white', color: '#6B7280', fontSize: 14, cursor: 'pointer' }}>Saltar</button>
          )}
          <button onClick={() => isLast ? onClose() : setIdx(idx + 1)} style={{ flex: isLast ? 1 : 2, padding: '12px', borderRadius: 16, border: 'none', background: '#2D6A4F', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'Livvic',system-ui,sans-serif" }}>
            {isLast ? 'Comenzar el viaje 🌱' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Mensajes del coach ────────────────────────────────────────────────────────
const COACH_MESSAGES: Record<number, string> = {
  1: 'Kawa acaba de llegar a la Tierra. Esta semana aprenderás a sentir tu cuerpo y encontrar tu raíz.',
  2: 'El Mundo del Agua te espera. Esta semana aprenderás a fluir con el movimiento y las emociones.',
  3: 'El Mundo del Aire tiene nuevos desafíos. Esta semana trabajarás tu energía y tu fuerza interior.',
  4: 'El Guardián del Fuego te espera. Esta semana aprenderás a respirar y encontrar tu calma.',
  5: 'Llegaste al Mundo del Éter. Es el cierre del viaje — integra todo lo que Kawa aprendió.',
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const { children, activeChildId, currentWeek, completedWeeks, sessionLogs, setActiveChild } = useAppStore()

  const activeChild     = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const profile         = activeChild?.profile ? PROFILES[activeChild.profile] : null
  const progress        = getWeekProgress(completedWeeks)
  const currentWeekData = COURSE_WEEKS.find(w => w.id === currentWeek)
  const currentColors   = WEEK_COLORS[currentWeek as keyof typeof WEEK_COLORS]

  const [showCoach, setShowCoach] = useState(false)
  useEffect(() => {
    const seen = localStorage.getItem('kawa-coach-seen')
    if (!seen) setShowCoach(true)
  }, [])
  const closeCoach = () => { localStorage.setItem('kawa-coach-seen', '1'); setShowCoach(false) }

  const practicedToday = (() => {
    if (!sessionLogs.length) return false
    const last = new Date(sessionLogs[sessionLogs.length - 1].date)
    return last.toDateString() === new Date().toDateString()
  })()

  const lastSessionWeek = sessionLogs.length ? sessionLogs[sessionLogs.length - 1].weekId : null

  const streak = (() => {
    if (!sessionLogs.length) return 0
    let count = 0
    const now = new Date()
    for (let i = sessionLogs.length - 1; i >= 0; i--) {
      const d    = new Date(sessionLogs[i].date)
      const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      if (diff <= count + 1) count++
      else break
    }
    return count
  })()

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4', paddingBottom: 96 }}>

      {showCoach && <CoachScreen onClose={closeCoach} />}

      {/* ── HEADER ── */}
      <div style={{ padding: '48px 20px 24px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 55%, #1A237E 100%)' }}>
        {[[15,20],[30,60],[70,15],[85,40],[92,70],[8,80],[50,10],[60,75],[40,50],[75,85],[20,35],[95,25],[55,55],[10,90],[80,15]].map(([x,y],i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', background: 'white', width: i%3===0?2:1, height: i%3===0?2:1, left: `${x}%`, top: `${y}%`, opacity: 0.3+(i%4)*0.1, pointerEvents: 'none' }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <p style={{ color: 'rgba(187,247,208,0.8)', fontSize: 13, margin: 0 }}>Hola,</p>
              <h1 style={{ color: 'white', fontSize: 22, fontWeight: 500, margin: 0, fontFamily: "'Livvic','Georgia',serif" }}>
                {activeChild?.name || 'Guardián'}{' '}{activeChild?.gender === 'female' ? '👧' : '👦'}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {children.length > 1 && (
                <div style={{ display: 'flex', gap: 4 }}>
                  {children.map(child => (
                    <button key={child.id} onClick={() => setActiveChild(child.id)} style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${child.id === activeChildId ? 'white' : 'transparent'}`, background: child.id === activeChildId ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {child.gender === 'female' ? '👧' : '👦'}
                    </button>
                  ))}
                </div>
              )}
              {profile && (
                <button onClick={() => router.push('/perfil')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: 16 }}>{profile.icon}</span>
                  <span style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>{profile.name}</span>
                </button>
              )}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'rgba(187,247,208,0.8)' }}>Progreso del viaje</span>
              <span style={{ fontSize: 12, color: 'rgba(187,247,208,0.8)' }}>{completedWeeks.length}/5 mundos · {progress}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.15)' }}>
              <div style={{ height: '100%', borderRadius: 4, transition: 'width 0.7s', width: `${progress}%`, background: 'rgba(255,255,255,0.9)' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0' }}>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Mundos',   value: `${completedWeeks.length}/5` },
            { label: 'Sesiones', value: sessionLogs.length },
            { label: 'Racha',    value: streak + (streak === 1 ? ' día' : ' días') },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'white', borderRadius: 16, padding: '10px 8px', textAlign: 'center', border: '0.5px solid #E5E7EB' }}>
              <p style={{ fontSize: 17, fontWeight: 500, color: '#111', margin: 0 }}>{value}</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── MAPA COMPACTO ── */}
        <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 14, background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #1A237E 100%)', padding: '16px 16px 0' }}>
          <p style={{ color: 'rgba(187,247,208,0.8)', fontSize: 11, margin: '0 0 12px' }}>El mapa de los 5 mundos</p>

          {/* Dots con símbolos */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            {COURSE_WEEKS.map((week, i) => {
              const isCompleted = completedWeeks.includes(week.id)
              const isCurrent   = week.id === currentWeek
              const isLocked    = week.id > currentWeek && !isCompleted
              return (
                <div key={week.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {i > 0 && (
                    <div style={{ flex: 1, height: 2, background: completedWeeks.includes(week.id - 1) || isCompleted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }} />
                  )}
                  <button
                    onClick={() => !isLocked && router.push(`/semana/${week.id}`)}
                    disabled={isLocked}
                    style={{
                      width: isCurrent ? 54 : 44,
                      height: isCurrent ? 54 : 44,
                      borderRadius: '50%',
                      border: isCurrent ? '3px solid white' : '2px solid rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.92)',
                      cursor: isLocked ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isCurrent ? '0 0 0 5px rgba(255,255,255,0.2)' : 'none',
                      transition: 'all 0.2s',
                      padding: 0, overflow: 'hidden',
                      opacity: isLocked ? 0.35 : 1,
                    }}>
                    {isLocked ? (
                      <span style={{ fontSize: 16 }}>🔒</span>
                    ) : isCompleted ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={WORLD_SYMBOLS[week.id]} alt={week.element} style={{ width: '68%', height: '68%', objectFit: 'contain', opacity: 0.5 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color: '#2D6A4F' }}>✓</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={WORLD_SYMBOLS[week.id]}
                        alt={week.element}
                        style={{ width: isCurrent ? '74%' : '66%', height: isCurrent ? '74%' : '66%', objectFit: 'contain' }}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Nombres */}
          <div style={{ display: 'flex', marginBottom: 12 }}>
            {COURSE_WEEKS.map(week => {
              const isCurrent   = week.id === currentWeek
              const isCompleted = completedWeeks.includes(week.id)
              return (
                <div key={week.id} style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: 9, margin: 0, color: isCurrent ? 'white' : isCompleted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', fontWeight: isCurrent ? 600 : 400 }}>
                    {week.element}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Info semana actual */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', margin: '0 -16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={WORLD_SYMBOLS[currentWeek]}
                alt={currentWeekData?.element}
                style={{ width: 28, height: 28, objectFit: 'contain', opacity: 0.95 }}
              />
              <div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Esta semana</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: 0, fontFamily: "'Livvic','Georgia',serif" }}>
                  Mundo de la {currentWeekData?.element}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>⏱ 45 min</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>{currentWeekData?.posturas.length} posturas</span>
            </div>
          </div>
        </div>

        {/* ── COACH DE KAWA ── */}
        <div style={{ background: '#FFFDE7', borderRadius: 16, padding: '12px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start', border: '0.5px solid #FEF08A' }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>🌱</span>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#854D0E', margin: '0 0 2px' }}>Kawa dice:</p>
            <p style={{ fontSize: 12, color: '#713F12', margin: 0, lineHeight: 1.5 }}>
              {practicedToday
                ? `¡Increíble, ${activeChild?.name || ''}! Ya practicaste hoy. Vuelve mañana para continuar el viaje.`
                : COACH_MESSAGES[currentWeek] || ''}
            </p>
          </div>
        </div>

        {/* ── CTA PRINCIPAL ── */}
        {practicedToday ? (
          <div style={{ borderRadius: 20, padding: '14px 16px', marginBottom: 14, background: currentColors.light, border: `1.5px solid ${currentColors.main}30`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: currentColors.main, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white' }}>✓</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: currentColors.main, margin: 0 }}>¡Hoy ya practicaste! 🌟</p>
              <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>Vuelve mañana para continuar</p>
            </div>
            <button onClick={() => router.push(`/semana/${currentWeek}`)} style={{ background: currentColors.main, color: 'white', border: 'none', borderRadius: 12, padding: '8px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0 }}>
              Ver clase
            </button>
          </div>
        ) : (
          <button onClick={() => router.push(`/semana/${currentWeek}`)} style={{ width: '100%', borderRadius: 20, padding: '16px', background: `linear-gradient(135deg, ${currentColors.main} 0%, ${currentColors.main}CC 100%)`, border: 'none', cursor: 'pointer', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={WORLD_SYMBOLS[currentWeek]} alt="" style={{ width: 36, height: 36, objectFit: 'contain', opacity: 0.95, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '0 0 2px' }}>Tu práctica de hoy</p>
                <p style={{ fontSize: 17, fontWeight: 600, color: 'white', margin: 0, fontFamily: "'Livvic','Georgia',serif" }}>Mundo de la {currentWeekData?.element}</p>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 12, padding: '8px 14px', color: 'white', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
              Ir a la clase →
            </div>
          </button>
        )}

        {/* ── ÚLTIMA SESIÓN ── */}
        {lastSessionWeek && !practicedToday && (
          <div style={{ background: 'white', borderRadius: 16, padding: '12px 14px', marginBottom: 14, border: '0.5px solid #E5E7EB' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>Última sesión registrada</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{sessionLogs[sessionLogs.length-1].mood === 'great' ? '🌟' : sessionLogs[sessionLogs.length-1].mood === 'good' ? '😊' : sessionLogs[sessionLogs.length-1].mood === 'okay' ? '😐' : '😔'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>Semana {lastSessionWeek} — {COURSE_WEEKS.find(w => w.id === lastSessionWeek)?.element}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{new Date(sessionLogs[sessionLogs.length-1].date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
              </div>
              <button onClick={() => router.push('/progreso')} style={{ background: '#F3F4F6', border: 'none', borderRadius: 10, padding: '6px 10px', fontSize: 11, color: '#6B7280', cursor: 'pointer' }}>
                Ver historial
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '0.5px solid #E5E7EB', display: 'flex', maxWidth: 430, margin: '0 auto' }}>
        {[
          { href: '/home',                  icon: '🗺️', label: 'Inicio' },
          { href: `/semana/${currentWeek}`, icon: '🧘', label: 'Clase' },
          { href: '/progreso',              icon: '📈', label: 'Progreso' },
          { href: '/materiales',            icon: '📦', label: 'Kit' },
          { href: '/perfil',                icon: '👤', label: 'Perfil' },
        ].map(({ href, icon, label }) => (
          <button key={href} onClick={() => router.push(href)} style={{ flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
