'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { PROFILES } from '@/lib/data/course'

export default function PerfilPage() {
  const router = useRouter()
  const { childName, childAge, activeProfile, reset } = useAppStore()
  const profile = activeProfile ? PROFILES[activeProfile] : null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-[#2D6A4F] px-5 pt-12 pb-6">
        <button onClick={() => router.back()} className="text-green-200 text-sm mb-4">← Volver</button>
        <h1 className="text-2xl font-bold text-white">Perfil</h1>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Child card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: profile?.bg ?? '#E8F5E9' }}>
              {profile?.icon ?? '🌱'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{childName}</h2>
              <p className="text-gray-500 text-sm">{childAge} años · Guardián del Equilibrio</p>
              {profile && (
                <span className="inline-block text-xs font-medium px-2 py-1 rounded-full mt-1" style={{ backgroundColor: profile.bg, color: profile.color }}>
                  {profile.icon} {profile.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile detail */}
        {profile && (
          <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: profile.bg }}>
            <h3 className="font-semibold mb-2" style={{ color: profile.color }}>{profile.icon} Perfil sensorial: {profile.name}</h3>
            <p className="text-sm" style={{ color: profile.color }}>{profile.description}</p>
          </div>
        )}

        {/* All profiles */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-900 mb-3">Los 4 perfiles sensoriales</p>
          <div className="space-y-2">
            {Object.values(PROFILES).map((p) => (
              <div key={p.name} className={`p-3 rounded-xl border-2 ${activeProfile && PROFILES[activeProfile].name === p.name ? 'border-current' : 'border-transparent'}`} style={{ backgroundColor: p.bg, borderColor: activeProfile && PROFILES[activeProfile].name === p.name ? p.color : 'transparent' }}>
                <p className="text-sm font-medium" style={{ color: p.color }}>{p.icon} {p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: p.color }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* App info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-900 mb-3">Sobre el curso</p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📚 Basado en Integración Sensorial de Jean Ayres</p>
            <p>🧸 Diseñado para niños con autismo, ADHD, Síndrome de Down y neurodiversidad</p>
            <p>👨‍👩‍👧 Para familias y profesionales (TOs, educadores, terapeutas)</p>
            <p>📱 Funciona sin conexión después de la primera carga</p>
          </div>
        </div>

        <button
          onClick={() => { if (confirm('¿Resetear todo el progreso?')) reset() }}
          className="w-full py-3 rounded-2xl text-red-500 border border-red-200 text-sm"
        >
          Resetear progreso
        </button>
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
