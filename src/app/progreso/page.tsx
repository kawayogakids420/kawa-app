'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, WEEK_COLORS } from '@/lib/data/course'
import { getMoodEmoji, getMoodLabel } from '@/lib/utils'

export default function ProgresoPage() {
  const router = useRouter()
  const { sessionLogs, completedWeeks, childName } = useAppStore()

  const totalSessions = sessionLogs.length
  const avgMood = (() => {
    if (!sessionLogs.length) return null
    const map = { great: 4, good: 3, okay: 2, hard: 1 }
    const avg = sessionLogs.reduce((acc, l) => acc + map[l.mood], 0) / sessionLogs.length
    if (avg >= 3.5) return 'great'
    if (avg >= 2.5) return 'good'
    if (avg >= 1.5) return 'okay'
    return 'hard'
  })()

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-[#2D6A4F] px-5 pt-12 pb-6">
        <button onClick={() => router.back()} className="text-green-200 text-sm mb-4">← Volver</button>
        <h1 className="text-2xl font-bold text-white">Progreso de {childName}</h1>
        <p className="text-green-200 text-sm">El viaje de Kawa registrado semana a semana</p>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Mundos', value: `${completedWeeks.length}/5` },
            { label: 'Sesiones', value: totalSessions },
            { label: 'Estado general', value: avgMood ? getMoodEmoji(avgMood) : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Week progress */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-900 mb-4">Mundos completados</p>
          {COURSE_WEEKS.map(week => {
            const colors = WEEK_COLORS[week.id as keyof typeof WEEK_COLORS]
            const done = completedWeeks.includes(week.id)
            const weekSessions = sessionLogs.filter(l => l.weekId === week.id)
            return (
              <div key={week.id} className="flex items-center gap-3 mb-3 last:mb-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: done ? colors.main : colors.light }}
                >
                  {done ? <span className="text-white text-sm font-bold">✓</span> : week.elementEmoji}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Semana {week.id} · {week.element}
                  </p>
                  <p className="text-xs text-gray-500">{weekSessions.length} sesiones registradas</p>
                </div>
                {!done && <span className="text-xs text-gray-300">Pendiente</span>}
              </div>
            )
          })}
        </div>

        {/* Session log */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-900 mb-4">Historial de sesiones</p>
          {sessionLogs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aún no hay sesiones registradas.<br/>¡Completa tu primera clase!</p>
          ) : (
            <div className="space-y-3">
              {[...sessionLogs].reverse().map((log, i) => {
                const week = COURSE_WEEKS.find(w => w.id === log.weekId)
                const colors = WEEK_COLORS[log.weekId as keyof typeof WEEK_COLORS]
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: colors.light }}>
                    <div className="text-2xl">{getMoodEmoji(log.mood)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: colors.main }}>
                        Semana {log.weekId} · {week?.element}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} · {getMoodLabel(log.mood)}
                      </p>
                      {log.notes && <p className="text-xs text-gray-600 mt-1">{log.notes}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {[
          { href: '/home', icon: '🗺️', label: 'Inicio' },
          { href: `/semana/1`, icon: '🧘', label: 'Clase' },
          { href: '/progreso', icon: '📈', label: 'Progreso' },
          { href: '/materiales', icon: '📦', label: 'Kit' },
          { href: '/perfil', icon: '👤', label: 'Perfil' },
        ].map(({ href, icon, label }) => (
          <button key={href} onClick={() => router.push(href)} className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] text-gray-500">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
