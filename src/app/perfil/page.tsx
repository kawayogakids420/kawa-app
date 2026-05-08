'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { PROFILES } from '@/lib/data/course'

export default function PerfilPage() {
  const router = useRouter()
  const { children, activeChildId, setActiveChild, reset } = useAppStore()
  const activeChild = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const profile = activeChild?.profile ? PROFILES[activeChild.profile] : null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-[#2D6A4F] px-5 pt-12 pb-6">
        <button onClick={() => router.back()} className="text-green-200 text-sm mb-4">← Volver</button>
        <h1 className="text-2xl font-bold text-white">Perfiles</h1>
        <p className="text-green-200 text-sm">Todos los niños registrados</p>
      </div>

      <div className="px-5 mt-5 space-y-4">

        {/* Lista de niños */}
        {children.map(child => {
          const p = child.profile ? PROFILES[child.profile] : null
          const isActive = child.id === activeChildId
          return (
            <button key={child.id}
              onClick={() => setActiveChild(child.id)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 text-left border-2 transition-all"
              style={{ borderColor: isActive ? (p?.color ?? '#2D6A4F') : 'transparent' }}>
              <div className="text-4xl">{child.gender === 'female' ? '👧' : '👦'}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 text-lg">{child.name}</p>
                  {isActive && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{child.age} años · {child.gender === 'female' ? 'Niña' : 'Niño'}</p>
                {p && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium"
                    style={{ background: p.bg, color: p.color }}>
                    {p.icon} {p.name}
                  </span>
                )}
              </div>
              {isActive && <span className="text-2xl">✓</span>}
            </button>
          )
        })}

        {/* Perfil sensorial del niño activo */}
        {activeChild?.profilePcts && profile && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-gray-900 mb-4">
              Mapa sensorial de {activeChild.name}
            </p>
            <div className="space-y-3">
              {(['sensible','buscador','bajo_registro','motor'] as const).map(pk => {
                const p = PROFILES[pk]
                const pct = activeChild.profilePcts![pk]
                return (
                  <div key={pk}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{p.icon}</span>
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Perfil IS */}
        {profile && (
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: profile.bg }}>
            <h3 className="font-semibold mb-2" style={{ color: profile.color }}>
              {profile.icon} Perfil predominante: {profile.name}
            </h3>
            <p className="text-sm" style={{ color: profile.color }}>{profile.description}</p>
          </div>
        )}

        {/* Los 4 perfiles explicados */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-900 mb-3">Los 4 perfiles sensoriales</p>
          <div className="space-y-3">
            {Object.values(PROFILES).map(p => (
              <div key={p.name} className="p-3 rounded-xl border-2"
                style={{
                  backgroundColor: p.bg,
                  borderColor: activeChild?.profile && PROFILES[activeChild.profile].name === p.name
                    ? p.color : 'transparent'
                }}>
                <p className="text-sm font-medium" style={{ color: p.color }}>{p.icon} {p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: p.color }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info del curso */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-900 mb-3">Sobre Kawa Yoga Kids</p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📚 Basado en Integración Sensorial de Jean Ayres</p>
            <p>🧸 Diseñado para niños con autismo, ADHD, Síndrome de Down y neurodiversidad</p>
            <p>👨‍👩‍👧 Para familias y profesionales (TOs, educadores, terapeutas)</p>
            <p>📱 Funciona sin conexión después de la primera carga</p>
          </div>
        </div>

        <button
          onClick={() => { if (confirm('¿Resetear todo el progreso?')) reset() }}
          className="w-full py-3 rounded-2xl text-red-500 border border-red-200 text-sm">
          Resetear progreso
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex max-w-[430px] mx-auto">
        {[
          { href: '/home', icon: '🗺️', label: 'Inicio' },
          { href: `/semana/1`, icon: '🧘', label: 'Clase' },
          { href: '/progreso', icon: '📈', label: 'Progreso' },
          { href: '/materiales', icon: '📦', label: 'Kit' },
          { href: '/perfil', icon: '👤', label: 'Perfil' },
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
