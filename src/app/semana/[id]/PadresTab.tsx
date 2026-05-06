'use client'
import type { Week } from '@/lib/data/course'

interface Props {
  week: Week
  weekColors: { main: string; light: string }
}

export default function PadresTab({ week, weekColors }: Props) {
  const { isModule, microPractices } = week

  return (
    <div className="space-y-4">
      {/* IS Module */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: weekColors.light }}>
            🧠
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Módulo de integración sensorial</p>
            <h3 className="font-semibold text-gray-900 text-base leading-snug">{isModule.title}</h3>
            <p className="text-xs text-gray-500 mt-1">⏱️ {isModule.duration} · Sistema: {isModule.systemWorked}</p>
          </div>
        </div>

        <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: weekColors.light }}>
          <p className="text-sm font-medium mb-1" style={{ color: weekColors.main }}>Pregunta clave de esta semana:</p>
          <p className="text-sm italic text-gray-700">"{isModule.keyQuestion}"</p>
        </div>

        <div className="space-y-3">
          {isModule.content.map((paragraph, i) => (
            <div key={i} className="flex gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ backgroundColor: weekColors.main, color: 'white' }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{paragraph}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">Para llevar a casa esta semana</p>
          <p className="text-sm text-amber-900">{isModule.parentTakeaway}</p>
        </div>
      </div>

      {/* Micro-practices */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-1">Micro-prácticas diarias</h3>
        <p className="text-xs text-gray-500 mb-4">5 minutos o menos · Para los momentos clave del día</p>

        <div className="space-y-3">
          {microPractices.map((mp, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5" style={{ backgroundColor: weekColors.main }}>
                <p className="text-sm font-medium text-white">{mp.moment}</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                <div className="p-3">
                  <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">Para calmar</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{mp.toCalm}</p>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wide mb-1">Para activar</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{mp.toActivate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardian teaching */}
      <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: weekColors.light }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: weekColors.main }}>
          La enseñanza de {week.guardian} {week.guardianSpecies}
        </p>
        <p className="text-base font-medium" style={{ color: weekColors.main }}>
          "{week.teaching}"
        </p>
        <p className="text-sm text-gray-600 mt-3">
          Objeto táctil de la semana: <strong>{week.tactileObject}</strong>
        </p>
      </div>
    </div>
  )
}
