'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, PROFILES, WEEK_COLORS } from '@/lib/data/course'
import { getWeekProgress } from '@/lib/utils'

export default function HomePage() {
  const router = useRouter()
  const { childName, activeProfile, currentWeek, completedWeeks, sessionLogs } = useAppStore()
  const profile = activeProfile ? PROFILES[activeProfile] : null
  const progress = getWeekProgress(completedWeeks)
  const lastLog = sessionLogs[sessionLogs.length - 1]

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
      {/* Header */}
      <div className="bg-[#2D6A4F] px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-green-200 text-sm">Hola,</p>
            <h1 className="text-white text-2xl font-bold">{childName || 'Guardián'} 🌱</h1>
          </div>
          {profile && (
            <button
              onClick={() => router.push('/perfil')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ backgroundColor: profile.color + '33' }}
            >
              <span className="text-xl">{profile.icon}</span>
              <span className="text-xs text-white font-medium">{profile.name}</span>
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-green-200 mb-1.5">
            <span>Progreso del viaje</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-green-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 px-5 -mt-4 mb-6">
        {[
          { label: 'Mundos', value: completedWeeks.length + '/5' },
          { label: 'Sesiones', value: sessionLogs.length },
          { label: 'Racha', value: streak + (streak === 1 ? ' día' : ' días') },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* World Map */}
      <div className="px-5 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-3">El mapa de los 5 mundos</h2>
        <div className="space-y-3">
          {COURSE_WEEKS.map((week) => {
            const colors = WEEK_COLORS[week.id as keyof typeof WEEK_COLORS]
            const isCompleted = completedWeeks.includes(week.id)
            const isCurrent = week.id === currentWeek
            const isLocked = week.id > currentWeek && !isCompleted

            return (
              <button
                key={week.id}
                onClick={() => !isLocked && router.push(`/semana/${week.id}`)}
                disabled={isLocked}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                  isCurrent
                    ? 'shadow-md scale-[1.01]'
                    : isLocked
                    ? 'opacity-40'
                    : 'shadow-sm'
                }`}
                style={{
                  backgroundColor: isCompleted ? colors.main : isCurrent ? colors.main : 'white',
                  border: isCurrent ? `2px solid ${colors.main}` : '2px solid transparent',
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: isCompleted || isCurrent ? 'rgba(255,255,255,0.2)' : colors.light }}
                >
                  {isCompleted ? '✓' : week.elementEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-medium mb-0.5"
                    style={{ color: isCompleted || isCurrent ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}
                  >
                    Semana {week.id}
                  </p>
                  <p
                    className="font-semibold text-base truncate"
                    style={{ color: isCompleted || isCurrent ? 'white' : '#111827' }}
                  >
                    Mundo de la {week.element}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: isCompleted || isCurrent ? 'rgba(255,255,255,0.7)' : '#6B7280' }}
                  >
                    {week.guardian} {week.guardianSpecies} · {week.teaching}
                  </p>
                </div>
                {isCurrent && !isCompleted && (
                  <div className="text-white text-lg">→</div>
                )}
                {isLocked && (
                  <div className="text-gray-400 text-lg">🔒</div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Last session */}
      {lastLog && (
        <div className="px-5 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Última sesión</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Semana {lastLog.weekId} — {COURSE_WEEKS.find(w => w.id === lastLog.weekId)?.element}</p>
                <p className="text-sm text-gray-500">{new Date(lastLog.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
              </div>
              <div className="text-3xl">
                {lastLog.mood === 'great' ? '🌟' : lastLog.mood === 'good' ? '😊' : lastLog.mood === 'okay' ? '😐' : '😔'}
              </div>
            </div>
            {lastLog.notes && (
              <p className="text-sm text-gray-600 mt-3 border-t border-gray-100 pt-3">{lastLog.notes}</p>
            )}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {[
          { href: '/home', icon: '🗺️', label: 'Inicio' },
          { href: `/semana/${currentWeek}`, icon: '🧘', label: 'Clase' },
          { href: '/progreso', icon: '📈', label: 'Progreso' },
          { href: '/materiales', icon: '📦', label: 'Kit' },
          { href: '/perfil', icon: '👤', label: 'Perfil' },
        ].map(({ href, icon, label }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex-1 py-3 flex flex-col items-center gap-0.5"
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] text-gray-500">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
