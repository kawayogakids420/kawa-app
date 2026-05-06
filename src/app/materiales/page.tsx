'use client'
import { useRouter } from 'next/navigation'
import { COURSE_WEEKS, WEEK_COLORS } from '@/lib/data/course'

export default function MaterialesPage() {
  const router = useRouter()

  const globalKit = [
    { icon: '🌱', name: 'Kawa de fieltro o lana', desc: 'La semilla protagonista. Se construye en semana 1 y viaja por todo el mapa.' },
    { icon: '🗺️', name: 'Mapa de tela de los 5 mundos', desc: 'A3 imprimible o bordado en tela. Kawa avanza cada semana.' },
    { icon: '🎲', name: 'Dado sensorial', desc: '5 caras con los elementos + 1 cara con Kawa. Para micro-prácticas espontáneas.' },
    { icon: '📓', name: 'Diario del viaje', desc: '5 páginas, una por semana. Se encuaderna al final del curso.' },
    { icon: '🃏', name: 'Baraja de posturas', desc: '20 cartas ilustradas con nombre mágico y símbolo del elemento.' },
    { icon: '🏅', name: 'Diploma de Guardián/a', desc: 'Imprimible de cierre con los 5 símbolos y el nombre del niño.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-[#2D6A4F] px-5 pt-12 pb-6">
        <button onClick={() => router.back()} className="text-green-200 text-sm mb-4">← Volver</button>
        <h1 className="text-2xl font-bold text-white">Kit físico de Kawa</h1>
        <p className="text-green-200 text-sm">Materiales imprimibles y objetos para construir</p>
      </div>

      <div className="px-5 mt-5 space-y-5">
        {/* Global kit */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-900 mb-1">Kit completo del curso</p>
          <p className="text-xs text-gray-400 mb-4">Objetos que acompañan las 5 semanas</p>
          <div className="space-y-3">
            {globalKit.map((item) => (
              <div key={item.name} className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-week objects */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-900 mb-1">Objetos por semana</p>
          <p className="text-xs text-gray-400 mb-4">Un objeto táctil nuevo cada semana</p>
          <div className="space-y-3">
            {COURSE_WEEKS.map((week) => {
              const colors = WEEK_COLORS[week.id as keyof typeof WEEK_COLORS]
              return (
                <button
                  key={week.id}
                  onClick={() => router.push(`/semana/${week.id}`)}
                  className="w-full flex gap-3 items-start text-left"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: colors.light }}
                  >
                    {week.elementEmoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      S{week.id} · {week.physicalObject.name}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">{week.physicalObject.description}</p>
                  </div>
                  <span className="text-gray-300 text-sm mt-1">→</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* How to use offline */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <p className="font-semibold text-amber-900 mb-2">📱 Modo sin pantalla</p>
          <p className="text-sm text-amber-800 leading-relaxed">
            Descarga los PDFs cuando tengas conexión. Luego puedes hacer las clases completamente sin abrir la app: solo necesitas el mapa impreso, las tarjetas de posturas y el muñeco de Kawa.
          </p>
          <div className="mt-3 space-y-1">
            {['Guía completa de cada semana (A4)', 'Tarjetas de postura recortables', 'Mapa de los 5 mundos (A3)', 'Página del diario por semana'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-amber-600 text-xs">✓</span>
                <span className="text-xs text-amber-800">{item}</span>
              </div>
            ))}
          </div>
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
