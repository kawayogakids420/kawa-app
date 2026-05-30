'use client'
import { useRouter } from 'next/navigation'
import { COURSE_WEEKS, WEEK_COLORS } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'

const FICHAS = [
  { num: 1, nombre: 'Tierra',  sistema: 'Procesamiento táctil y propioceptivo', color: '#1D9E75', light: '#E1F5EE', file: '/fichas/kawa_g1_tierra.pdf' },
  { num: 2, nombre: 'Agua',    sistema: 'Procesamiento vestibular y movimiento', color: '#1A6DB5', light: '#E4F1FB', file: '/fichas/kawa_g2_agua.pdf' },
  { num: 3, nombre: 'Fuego',   sistema: 'Regulación de la activación y sistema nervioso', color: '#C07010', light: '#FEF3DC', file: '/fichas/kawa_g3_fuego.pdf' },
  { num: 4, nombre: 'Aire',    sistema: 'Respiración, interoceptión y calma', color: '#5448B8', light: '#EDEAFB', file: '/fichas/kawa_g4_aire.pdf' },
  { num: 5, nombre: 'Éter',    sistema: 'Integración sensorial global y cierre', color: '#A02E1A', light: '#FCE9E5', file: '/fichas/kawa_g5_éter.pdf' },
]

export default function MaterialesPage() {
  const router = useRouter()
  const { userType } = useAppStore()

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

        {/* ── FICHAS CIENTÍFICAS — solo profesionales ── */}
        {userType === 'profesional' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-900">Fichas metodológicas</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#E1F5EE', color: '#085041' }}>
                Profesionales
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Base científica, indicadores clínicos y guía de aplicación por guardián. PDF descargable.
            </p>
            <div className="space-y-2">
              {FICHAS.map(f => (
                <a
                  key={f.num}
                  href={f.file}
                  download
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 transition-all active:scale-[0.98]"
                  style={{ backgroundColor: f.light }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: f.color }}>
                    {f.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      Guardián {f.num} — {f.nombre}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{f.sistema}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs font-medium" style={{ color: f.color }}>PDF</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── KIT COMPLETO ── */}
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

        {/* ── OBJETOS POR SEMANA ── */}
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
                  className="w-full flex gap-3 items-start text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: colors.light }}>
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

        {/* ── MODO SIN PANTALLA ── */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <p className="font-semibold text-amber-900 mb-2">📱 Modo sin pantalla</p>
          <p className="text-sm text-amber-800 leading-relaxed">
            Descarga los PDFs cuando tengas conexión. Luego puedes hacer las clases
            completamente sin abrir la app: solo necesitas el mapa impreso, las tarjetas
            de posturas y el muñeco de Kawa.
          </p>
          <div className="mt-3 space-y-1">
            {[
              'Guía completa de cada semana (A4)',
              'Tarjetas de postura recortables',
              'Mapa de los 5 mundos (A3)',
              'Página del diario por semana',
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-amber-600 text-xs">✓</span>
                <span className="text-xs text-amber-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex max-w-[430px] mx-auto">
        {[
          { href: '/home',      icon: '🗺️', label: 'Inicio' },
          { href: '/semana/1',  icon: '🧘', label: 'Clase' },
          { href: '/progreso',  icon: '📈', label: 'Progreso' },
          { href: '/materiales',icon: '📦', label: 'Kit' },
          { href: '/perfil',    icon: '👤', label: 'Perfil' },
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
