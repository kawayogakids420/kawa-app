'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, PROFILES, WEEK_COLORS } from '@/lib/data/course'
import { getWeekProgress } from '@/lib/utils'
import Image from 'next/image'

// ── Coach screen — aparece solo la primera vez ────────────────────────────────
function CoachScreen({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: '🗺️', title: 'El mapa es tu guía', desc: 'Toca el mapa para ir directo a tu clase de esta semana. Kawa avanza un mundo cada semana.' },
    { icon: '🧘', title: 'Cada clase toma 45 min', desc: 'Sigue el orden: Historia → Posturas → Respiración → Relajación. Puedes hacerla en partes.' },
    { icon: '📝', title: 'Registra cada sesión', desc: 'Al terminar, toca "Registrar sesión". Así construyes el historial de progreso de tu hijo/a.' },
  ]
  const [idx, setIdx] = useState(0)
  const isLast = idx === steps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full rounded-t-3xl p-6 pb-10 max-w-[430px] mx-auto">

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div key={i} className="h-1.5 rounded-full transition-all"
              style={{
                width: i === idx ? 24 : 8,
                backgroundColor: i === idx ? '#2D6A4F' : '#E5E7EB'
              }} />
          ))}
        </div>

        {/* Contenido */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{steps[idx].icon}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Livvic', 'Georgia', serif" }}>
            {steps[idx].title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            {steps[idx].desc}
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          {!isLast && (
            <button onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm">
              Saltar
            </button>
          )}
          <button
            onClick={() => isLast ? onClose() : setIdx(idx + 1)}
            className="py-3 rounded-2xl text-white text-sm font-semibold"
            style={{
              backgroundColor: '#2D6A4F',
              flex: isLast ? 1 : 2,
              fontFamily: "'Livvic', system-ui, sans-serif"
            }}>
            {isLast ? 'Comenzar el viaje 🌱' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const { children, activeChildId, currentWeek, completedWeeks, sessionLogs, setActiveChild } = useAppStore()

  const activeChild = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const profile = activeChild?.profile ? PROFILES[activeChild.profile] : null
  const progress = getWeekProgress(completedWeeks)
  const lastLog = sessionLogs[sessionLogs.length - 1]
  const currentWeekData = COURSE_WEEKS.find(w => w.id === currentWeek)
  const currentColors = WEEK_COLORS[currentWeek as keyof typeof WEEK_COLORS]

  // Coach screen — solo primera vez
  const [showCoach, setShowCoach] = useState(false)
  useEffect(() => {
    const seen = localStorage.getItem('kawa-coach-seen')
    if (!seen) setShowCoach(true)
  }, [])
  const closeCoach = () => {
    localStorage.setItem('kawa-coach-seen', '1')
    setShowCoach(false)
  }

  // ¿Ya practicó hoy?
  const practicedToday = (() => {
    if (!sessionLogs.length) return false
    const last = new Date(sessionLogs[sessionLogs.length - 1].date)
    const today = new Date()
    return last.toDateString() === today.toDateString()
  })()

  // Racha
  const streak = (() => {
    if (sessionLogs.length === 0) return 0
    let count = 0
    const now = new Date()
    for (let i = sessionLogs.length - 1; i >= 0; i--) {
      const d = new Date(sessionLogs[i].date)
      const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      if (diff <= count + 1) count++
      else break
    }
    return count
  })()

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Coach screen */}
      {showCoach && <CoachScreen onClose={closeCoach} />}

      {/* ── HEADER ── */}
      <div className="px-5 pt-12 pb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 55%, #1A237E 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[[15,20],[30,60],[70,15],[85,40],[92,70],[8,80],[50,10],[60,75],[40,50],
            [75,85],[20,35],[95,25],[55,55],[10,90],[80,15]].map(([x,y],i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: i%3===0?2:1, height: i%3===0?2:1,
                left:`${x}%`, top:`${y}%`, opacity: 0.3+(i%4)*0.1 }} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-green-200 text-sm">Hola,</p>
              <h1 className="text-white text-2xl font-bold"
                style={{ fontFamily: "'Livvic', 'Georgia', serif" }}>
                {activeChild?.name || 'Guardián'}{' '}
                {activeChild?.gender === 'female' ? '👧' : '👦'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {children.length > 1 && (
                <div className="flex gap-1">
                  {children.map(child => (
                    <button key={child.id} onClick={() => setActiveChild(child.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all"
                      style={{
                        borderColor: child.id === activeChildId ? 'white' : 'transparent',
                        background: child.id === activeChildId
                          ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'
                      }}>
                      {child.gender === 'female' ? '👧' : '👦'}
                    </button>
                  ))}
                </div>
              )}
              {profile && (
                <button onClick={() => router.push('/perfil')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <span className="text-lg">{profile.icon}</span>
                  <span className="text-xs text-white font-medium">{profile.name}</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-green-200 mb-1.5">
              <span>Progreso del viaje</span>
              <span>{completedWeeks.length}/5 mundos · {progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: 'rgba(255,255,255,0.9)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-3 px-5 mt-4 mb-5">
        {[
          { label: 'Mundos', value: `${completedWeeks.length}/5` },
          { label: 'Sesiones', value: sessionLogs.length },
          { label: 'Racha', value: streak + (streak === 1 ? ' día' : ' días') },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── TARJETA: TU PRÁCTICA DE HOY ── */}
      <div className="px-5 mb-5">
        {practicedToday ? (
          // Ya practicó hoy
          <div className="rounded-2xl p-4 flex items-center gap-4"
            style={{ backgroundColor: currentColors.light, border: `1.5px solid ${currentColors.main}30` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: currentColors.main }}>
              <span className="text-white text-xl font-bold">✓</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: currentColors.main }}>
                ¡Hoy ya practicaste! 🌟
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {currentWeekData?.element && `Mundo de la ${currentWeekData.element} · `}
                Vuelve mañana para continuar
              </p>
            </div>
            <button onClick={() => router.push(`/semana/${currentWeek}`)}
              className="text-xs px-3 py-1.5 rounded-xl font-medium flex-shrink-0"
              style={{ backgroundColor: currentColors.main, color: 'white' }}>
              Ver clase
            </button>
          </div>
        ) : (
          // No ha practicado hoy
          <button
            onClick={() => router.push(`/semana/${currentWeek}`)}
            className="w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98] shadow-md"
            style={{ background: `linear-gradient(135deg, ${currentColors.main} 0%, ${currentColors.main}DD 100%)` }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Tu práctica de hoy
                </p>
                <p className="text-white font-bold text-lg"
                  style={{ fontFamily: "'Livvic', 'Georgia', serif" }}>
                  {currentWeekData?.element
                    ? `Mundo de la ${currentWeekData.element}`
                    : 'Comenzar el viaje'}
                </p>
              </div>
              <div className="text-4xl">{currentWeekData?.elementEmoji || '🌱'}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  ⏱ 45 min
                </span>
                <span className="text-xs px-2 py-1 rounded-lg font-medium"
                  style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  {currentWeekData?.posturas.length || 5} posturas
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm"
                style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
                Ir a la clase →
              </div>
            </div>
          </button>
        )}
      </div>

      {/* ── MAPA ── */}
      <div className="px-5 mb-5">
        <h2 className="text-base font-semibold text-gray-700 mb-3">El mapa de los 5 mundos</h2>
        <div className="relative w-full rounded-3xl overflow-hidden shadow-lg cursor-pointer"
          style={{ aspectRatio: '1086/1448' }}
          onClick={() => router.push(`/semana/${currentWeek}`)}>
          <Image
            src="/images/mapa.png"
            alt="Mapa de los 5 mundos de Kawa"
            fill
            style={{ objectFit: 'cover', objectPosition: 'top' }}
            priority />
          <div className="absolute bottom-0 left-0 right-0 p-4"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
            <p className="text-white text-xs opacity-80 mb-0.5">Esta semana</p>
            <p className="text-white font-bold text-xl"
              style={{ fontFamily: "'Livvic', 'Georgia', serif" }}>
              {currentWeekData?.element
                ? `Mundo de la ${currentWeekData.element}`
                : 'Comenzar el viaje'}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <p className="text-white text-sm font-medium">Ir a la clase →</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RECORRIDO ── */}
      <div className="px-5 mb-5">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Tu recorrido</h2>
        <div className="space-y-2">
          {COURSE_WEEKS.map((week) => {
            const colors = WEEK_COLORS[week.id as keyof typeof WEEK_COLORS]
            const isCompleted = completedWeeks.includes(week.id)
            const isCurrent = week.id === currentWeek
            const isLocked = week.id > currentWeek && !isCompleted
            return (
              <button key={week.id}
                onClick={() => !isLocked && router.push(`/semana/${week.id}`)}
                disabled={isLocked}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                  isCurrent ? 'shadow-md scale-[1.01]' : isLocked ? 'opacity-40' : 'shadow-sm'}`}
                style={{
                  backgroundColor: isCompleted ? colors.main : isCurrent ? colors.main : 'white',
                  border: isCurrent ? `2px solid ${colors.main}` : '2px solid transparent',
                }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: isCompleted || isCurrent ? 'rgba(255,255,255,0.2)' : colors.light }}>
                  {isCompleted ? '✓' : week.elementEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-0.5"
                    style={{ color: isCompleted || isCurrent ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}>
                    Semana {week.id} · {week.sessionStructure.duration}
                  </p>
                  <p className="font-semibold text-sm truncate"
                    style={{ color: isCompleted || isCurrent ? 'white' : '#111827' }}>
                    Mundo de la {week.element}
                  </p>
                  <p className="text-xs truncate"
                    style={{ color: isCompleted || isCurrent ? 'rgba(255,255,255,0.7)' : '#6B7280' }}>
                    {week.guardian} {week.guardianSpecies} · {week.posturas.length} posturas
                  </p>
                </div>
                {isCurrent && !isCompleted && <div className="text-white text-lg">→</div>}
                {isLocked && <div className="text-gray-400 text-lg">🔒</div>}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── ÚLTIMA SESIÓN ── */}
      {lastLog && (
        <div className="px-5 mb-5">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Última sesión</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Semana {lastLog.weekId} — {COURSE_WEEKS.find(w => w.id === lastLog.weekId)?.element}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(lastLog.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </p>
              </div>
              <div className="text-3xl">
                {lastLog.mood === 'great' ? '🌟' : lastLog.mood === 'good' ? '😊' :
                 lastLog.mood === 'okay' ? '😐' : '😔'}
              </div>
            </div>
            {lastLog.notes && (
              <p className="text-sm text-gray-600 mt-3 border-t border-gray-100 pt-3">{lastLog.notes}</p>
            )}
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex max-w-[430px] mx-auto">
        {[
          { href: '/home',                  icon: '🗺️', label: 'Inicio' },
          { href: `/semana/${currentWeek}`, icon: '🧘', label: 'Clase' },
          { href: '/progreso',              icon: '📈', label: 'Progreso' },
          { href: '/materiales',            icon: '📦', label: 'Kit' },
          { href: '/perfil',                icon: '👤', label: 'Perfil' },
        ].map(({ href, icon, label }) => (
          <button key={href} onClick={() => router.push(href)}
            className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] text-gray-500">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
