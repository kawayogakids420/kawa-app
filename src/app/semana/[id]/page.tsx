'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, PROFILES, WEEK_COLORS } from '@/lib/data/course'
import ClaseTab from './ClaseTab'
import PadresTab from './PadresTab'
import MaterialesTab from './MaterialesTab'

type Tab = 'clase' | 'padres' | 'materiales'

export default function SemanaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const weekId = parseInt(id)
  const week = COURSE_WEEKS.find(w => w.id === weekId)
  const { activeProfile, completedWeeks, completeWeek } = useAppStore()
  const [tab, setTab] = useState<Tab>('clase')

  if (!week) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Semana no encontrada</p>
    </div>
  )

  const colors = WEEK_COLORS[weekId as keyof typeof WEEK_COLORS]
  const isCompleted = completedWeeks.includes(weekId)
  const profile = activeProfile ? PROFILES[activeProfile] : null

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'clase', label: 'La Clase', icon: '🧘' },
    { id: 'padres', label: 'Para ti', icon: '📚' },
    { id: 'materiales', label: 'Materiales', icon: '🎨' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6" style={{ backgroundColor: colors.main }}>
        <button onClick={() => router.back()} className="text-white opacity-70 mb-4 flex items-center gap-1">
          <span>←</span> <span className="text-sm">Volver</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-70 text-white mb-1">Semana {week.id} · {week.element} {week.elementEmoji}</p>
            <h1 className="text-2xl font-bold text-white leading-tight">
              {week.guardian} {week.guardianSpecies}
            </h1>
            <p className="text-sm text-white opacity-70 mt-1 max-w-xs">{week.teaching}</p>
          </div>
          <div className="text-4xl">{week.elementEmoji}</div>
        </div>

        {/* Profile badge */}
        {profile && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <span>{profile.icon}</span>
            <span className="text-white text-xs font-medium">Adaptado para {profile.name}</span>
          </div>
        )}
      </div>

      {/* Identity row */}
      <div className="px-5 -mt-2 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Símbolo', value: week.symbol },
            { label: 'Objeto táctil', value: week.tactileObject },
            { label: 'Color', value: week.colorName },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-3 shadow-sm text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-xs font-medium text-gray-800 leading-tight">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                tab === t.id ? 'text-white shadow-sm' : 'text-gray-500'
              }`}
              style={tab === t.id ? { backgroundColor: colors.main } : {}}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5">
        {tab === 'clase' && <ClaseTab week={week} weekColors={colors} activeProfile={activeProfile} />}
        {tab === 'padres' && <PadresTab week={week} weekColors={colors} />}
        {tab === 'materiales' && <MaterialesTab week={week} weekColors={colors} />}
      </div>

      {/* Complete button */}
      {!isCompleted && tab === 'clase' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <button
            onClick={() => { completeWeek(weekId); router.push('/home') }}
            className="w-full py-4 rounded-2xl font-semibold text-white text-base"
            style={{ backgroundColor: colors.main }}
          >
            Completar la semana ✓
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="w-full py-3 rounded-2xl text-center text-sm font-medium" style={{ backgroundColor: colors.light, color: colors.main }}>
            ✓ Semana {weekId} completada · {weekId < 5 ? 'La siguiente semana está desbloqueada' : '¡Completaste el viaje!'}
          </div>
        </div>
      )}
    </div>
  )
}
