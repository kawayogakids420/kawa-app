'use client'
import type { Week } from '@/lib/data/course'

interface Props {
  week: Week
  weekColors: { main: string; light: string }
}

export default function MaterialesTab({ week, weekColors }: Props) {
  const { artActivity, physicalObject } = week

  return (
    <div className="space-y-4">
      {/* Art activity */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎨</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Arte plástica post-yoga</p>
            <h3 className="font-semibold text-gray-900">{artActivity.name}</h3>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Materiales:</p>
          <ul className="space-y-1">
            {artActivity.materials.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-300 flex-shrink-0 mt-0.5">○</span>
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Paso a paso:</p>
          <ol className="space-y-2">
            {artActivity.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white"
                  style={{ backgroundColor: weekColors.main }}
                >
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-3 rounded-xl bg-green-50 border border-green-200">
          <p className="text-xs font-semibold text-green-800 mb-1">Conexión terapéutica:</p>
          <p className="text-xs text-green-700">{artActivity.therapeuticNote}</p>
        </div>
      </div>

      {/* Physical object */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🛠️</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Objeto físico de la semana</p>
            <h3 className="font-semibold text-gray-900">{physicalObject.name}</h3>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{physicalObject.description}</p>

        <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: weekColors.light }}>
          <p className="text-xs font-semibold mb-1" style={{ color: weekColors.main }}>Cómo construirlo:</p>
          <p className="text-sm text-gray-700 leading-relaxed">{physicalObject.howToBuild}</p>
        </div>

        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
          <p className="text-xs font-semibold text-purple-800 mb-1">Uso terapéutico:</p>
          <p className="text-xs text-purple-700">{physicalObject.therapeuticUse}</p>
        </div>
      </div>

      {/* Printables placeholder */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📄</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Imprimibles de la semana</p>
            <h3 className="font-semibold text-gray-900">Kit de materiales</h3>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { name: 'Guía de clase completa', desc: 'Posturas ilustradas + historia + canción', icon: '📋' },
            { name: 'Tarjetas de posturas', desc: '5 tarjetas con nombre mágico y símbolo', icon: '🃏' },
            { name: 'Micro-prácticas del día', desc: 'Tarjeta imán para la nevera', icon: '🧲' },
            { name: 'Página del diario', desc: 'Para que el niño dibuje después de la sesión', icon: '📓' },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                className="text-xs font-medium px-3 py-1.5 rounded-lg text-white flex-shrink-0"
                style={{ backgroundColor: weekColors.main }}
              >
                PDF
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Los PDFs se descargan en alta resolución para imprimir en casa
        </p>
      </div>
    </div>
  )
}
