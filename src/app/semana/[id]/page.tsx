'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, PROFILES, WEEK_COLORS } from '@/lib/data/course'
import ClaseTab from './ClaseTab'
import PadresTab from './PadresTab'
import MaterialesTab from './MaterialesTab'

// ── Símbolos de los mundos ────────────────────────────────────────────────────
const WORLD_SYMBOLS: Record<number, string> = {
  1: '/images/simbolo-tierra.png',
  2: '/images/simbolo-agua.png',
  3: '/images/simbolo-aire.png',
  4: '/images/simbolo-fuego.png',
  5: '/images/simbolo-infinito.png',
}

type Tab = 'clase' | 'padres' | 'materiales'

export default function SemanaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const weekId = parseInt(id)
  const week = COURSE_WEEKS.find(w => w.id === weekId)
  const { completedWeeks, completeWeek, children, activeChildId } = useAppStore()
  const [tab, setTab] = useState<Tab>('clase')

  const activeChild   = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const activeProfile = activeChild?.profile ?? null

  if (!week) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Semana no encontrada</p>
    </div>
  )

  const colors      = WEEK_COLORS[weekId as keyof typeof WEEK_COLORS]
  const isCompleted = completedWeeks.includes(weekId)
  const profile     = activeProfile ? PROFILES[activeProfile] : null

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'clase',      label: 'La Clase',   icon: '🧘' },
    { id: 'padres',     label: 'Para ti',    icon: '📚' },
    { id: 'materiales', label: 'Materiales', icon: '🎨' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── HEADER ── */}
      <div className="px-5 pt-12 pb-6 relative overflow-hidden" style={{ backgroundColor: colors.main }}>

        {/* Símbolo del mundo de fondo — decorativo */}
        <div style={{
          position: 'absolute', right: -20, top: '50%',
          transform: 'translateY(-50%)',
          width: 140, height: 140,
          opacity: 0.12, pointerEvents: 'none'
        }}>
          <img
            src={WORLD_SYMBOLS[weekId]}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        </div>

        <button onClick={() => router.back()} className="text-white opacity-70 mb-4 flex items-center gap-1">
          <span>←</span> <span className="text-sm">Volver</span>
        </button>

        <div className="flex items-start justify-between">
          <div style={{ flex: 1, marginRight: 16 }}>
            <p className="text-sm opacity-70 text-white mb-1">
              Semana {week.id} · {week.element}
            </p>
            <h1 className="text-2xl font-bold text-white leading-tight">
              {week.guardian} {week.guardianSpecies}
            </h1>
            <p className="text-sm text-white opacity-70 mt-1 max-w-xs">{week.teaching}</p>
          </div>

          {/* Símbolo del mundo — visible */}
          <div style={{
            width: 64, height: 64, flexShrink: 0,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 10
          }}>
            <img
              src={WORLD_SYMBOLS[weekId]}
              alt={week.element}
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>

        {/* Badge de perfil */}
        {profile && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <span>{profile.icon}</span>
            <span className="text-white text-xs font-medium">
              Adaptado para {activeChild?.name} · {profile.name}
            </span>
          </div>
        )}
      </div>

      {/* ── IDENTIDAD DE LA SEMANA ── */}
      <div className="px-5 -mt-2 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Símbolo',       value: week.symbol },
            { label: 'Objeto táctil', value: week.tactileObject },
            { label: 'Color',         value: week.colorName },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-3 shadow-sm text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-xs font-medium text-gray-800 leading-tight">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5"
              style={tab === t.id
                ? { backgroundColor: colors.main, color: 'white' }
                : { color: '#6B7280' }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="px-5">
        {tab === 'clase'      && <ClaseTab week={week} weekColors={colors} activeProfile={activeProfile} />}
        {tab === 'padres'     && <PadresTab week={week} weekColors={colors} />}
        {tab === 'materiales' && <MaterialesTab week={week} weekColors={colors} />}
      </div>

      {/* ── BOTÓN COMPLETAR ── */}
      {!isCompleted && tab === 'clase' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[430px] mx-auto">
          <button
            onClick={() => { completeWeek(weekId); router.push('/home') }}
            className="w-full py-4 rounded-2xl font-semibold text-white text-base"
            style={{ backgroundColor: colors.main }}>
            Completar la semana ✓
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[430px] mx-auto">
          <div className="w-full py-3 rounded-2xl text-center text-sm font-medium"
            style={{ backgroundColor: colors.light, color: colors.main }}>
            ✓ Semana {weekId} completada ·{' '}
            {weekId < 5 ? 'La siguiente semana está desbloqueada' : '¡Completaste el viaje!'}
          </div>
        </div>
      )}
    </div>
  )
}
