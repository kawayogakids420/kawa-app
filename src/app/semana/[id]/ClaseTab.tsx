'use client'
import { useState } from 'react'
import type { Week, SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'

interface Props {
  week: Week
  weekColors: { main: string; light: string }
  activeProfile: SensoryProfile | null
}

type Section = 'historia' | 'sesion' | 'posturas' | 'respiracion' | 'relajacion' | 'cancion'

export default function ClaseTab({ week, weekColors, activeProfile }: Props) {
  const [openSection, setOpenSection] = useState<Section | null>('historia')
  const [openPosture, setOpenPosture] = useState<string | null>(null)
  const [showProfileTips, setShowProfileTips] = useState(false)
  const { logSession, activeChildId } = useAppStore()
  const [logOpen, setLogOpen] = useState(false)
  const [mood, setMood] = useState<'great'|'good'|'okay'|'hard'>('good')
  const [notes, setNotes] = useState('')

  const profile = activeProfile ? PROFILES[activeProfile] : null

  const SectionHeader = ({ id, title, icon }: { id: Section; title: string; icon: string }) => (
    <button
      onClick={() => setOpenSection(openSection === id ? null : id)}
      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm mb-2 text-left">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      <span className="text-gray-400 text-lg">{openSection === id ? '↑' : '↓'}</span>
    </button>
  )

  return (
    <div className="space-y-1">

      {/* Historia */}
      <SectionHeader id="historia" title="La historia de Kawa" icon="📖" />
      {openSection === 'historia' && (
        <div className="bg-[#FFFDE7] rounded-2xl p-5 mb-3 shadow-sm">
          {Object.entries(week.story).map(([key, act]) => (
            <div key={key} className="mb-5 last:mb-0">
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: weekColors.main }}>
                {key === 'inicio' ? 'Inicio' : key === 'desequilibrio' ? 'Desequilibrio' :
                 key === 'accion' ? 'Acción' : key === 'catarsis' ? 'Catarsis' : 'Enseñanza'}
                {' — '}{act.title}
              </p>
              <p className="text-gray-800 text-sm leading-relaxed italic">{act.text}</p>
            </div>
          ))}
          <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: weekColors.light }}>
            <p className="text-xs font-medium" style={{ color: weekColors.main }}>
              🎵 Canción: "{week.song.name}"
            </p>
          </div>
        </div>
      )}

      {/* Canción */}
      <SectionHeader id="cancion" title={`Canción: ${week.song.name}`} icon="🎵" />
      {openSection === 'cancion' && (
        <div className="bg-[#F3E5F5] rounded-2xl p-5 mb-3 shadow-sm">
          <div className="space-y-1 mb-4">
            {week.song.lyrics.map((line, i) => (
              <p key={i} className={`text-sm ${line === '' ? 'h-3' : 'text-purple-900 italic'}`}>{line}</p>
            ))}
          </div>
          <div className="border-t border-purple-200 pt-3 space-y-2">
            <p className="text-xs text-purple-700"><strong>Cómo usarla:</strong> {week.song.howToUse}</p>
            <p className="text-xs text-purple-700"><strong>Ritmo:</strong> {week.song.rhythm}</p>
          </div>
        </div>
      )}

      {/* Sesión */}
      <SectionHeader id="sesion" title="Estructura de la sesión" icon="⏱️" />
      {openSection === 'sesion' && (
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm space-y-3">
          <div className="flex gap-3 text-sm text-gray-600 pb-3 border-b border-gray-100">
            <span>⏰ {week.sessionStructure.duration}</span>
          </div>
          <p className="text-xs text-gray-500 italic">{week.sessionStructure.preparation}</p>
          {week.sessionStructure.moments.map((m, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-xs font-bold text-white px-2 py-1 rounded-lg flex-shrink-0"
                style={{ backgroundColor: weekColors.main }}>
                {m.duration}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posturas */}
      <SectionHeader id="posturas" title="Las posturas de Kawa" icon="🧘" />
      {openSection === 'posturas' && (
        <div className="space-y-2 mb-3">
          {profile && (
            <button
              onClick={() => setShowProfileTips(!showProfileTips)}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: profile.bg, color: profile.color }}>
              <span>{profile.icon}</span>
              <span>{showProfileTips ? 'Ver instrucciones generales' : `Ver adaptaciones para ${profile.name}`}</span>
            </button>
          )}

          {week.posturas.map((posture) => (
            <div key={posture.id}>
              <button
                onClick={() => setOpenPosture(openPosture === posture.id ? null : posture.id)}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm text-left">
                <span className="text-2xl">{posture.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{posture.name}</p>
                  <p className="text-xs text-gray-400">"{posture.magicName}"</p>
                </div>
                <span className="text-gray-400">{openPosture === posture.id ? '↑' : '↓'}</span>
              </button>

              {openPosture === posture.id && (
                <div className="bg-white rounded-2xl px-4 pb-4 -mt-2 pt-2 shadow-sm mb-1"
                  style={{ borderLeft: `4px solid ${weekColors.main}` }}>
                  <p className="text-xs italic text-gray-500 mb-3 leading-relaxed">{posture.storyNarration}</p>

                  {showProfileTips && activeProfile ? (
                    <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: profile!.bg }}>
                      <p className="font-medium mb-1" style={{ color: profile!.color }}>
                        {profile!.icon} Para {profile!.name}:
                      </p>
                      <p style={{ color: profile!.color }}>{posture.profiles[activeProfile]}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 leading-relaxed">{posture.howTo}</p>
                      <p className="text-xs font-medium" style={{ color: weekColors.main }}>⏱️ {posture.duration}</p>
                      <div className="space-y-1">
                        {posture.sensoryBenefits.map((b, i) => (
                          <p key={i} className="text-xs text-gray-500">• {b}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Respiración */}
      <SectionHeader id="respiracion" title={week.breathing.name} icon="🌬️" />
      {openSection === 'respiracion' && (
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm space-y-3">
          <p className="text-sm italic text-gray-500">{week.breathing.storyNarration}</p>
          <div className="p-3 rounded-xl" style={{ backgroundColor: weekColors.light }}>
            <p className="text-sm font-medium mb-1" style={{ color: weekColors.main }}>Cómo:</p>
            <p className="text-sm text-gray-700">{week.breathing.howTo}</p>
          </div>
          <p className="text-xs text-green-700"><strong>Beneficio:</strong> {week.breathing.benefit}</p>
          <p className="text-xs text-gray-500"><strong>Cuándo usarla:</strong> {week.breathing.whenToUse}</p>
        </div>
      )}

      {/* Relajación */}
      <SectionHeader id="relajacion" title="Relajación guiada de Kawa" icon="☁️" />
      {openSection === 'relajacion' && (
        <div className="bg-[#E8EAF6] rounded-2xl p-5 mb-3 shadow-sm">
          <p className="text-xs text-indigo-700 mb-3 font-medium">
            Leer en voz baja mientras el niño está acostado:
          </p>
          {week.relaxationScript.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-sm text-indigo-900 italic leading-relaxed mb-3">{paragraph}</p>
          ))}
        </div>
      )}

      {/* Adaptaciones por perfil */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
        <p className="font-semibold text-gray-900 mb-3">Adaptaciones por perfil</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(week.profileAdaptations).map((pa) => (
            <div key={pa.name} className="rounded-xl p-3" style={{ backgroundColor: pa.bgColor }}>
              <p className="text-xs font-semibold mb-2" style={{ color: pa.color }}>
                {pa.icon} {pa.name}
              </p>
              <ul className="space-y-1">
                {pa.tips.slice(0, 3).map((tip, i) => (
                  <li key={i} className="text-[10px]" style={{ color: pa.color }}>• {tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Registrar sesión */}
      <button
        onClick={() => setLogOpen(true)}
        className="w-full py-3 rounded-2xl text-sm font-medium border-2 mb-3"
        style={{ borderColor: weekColors.main, color: weekColors.main }}>
        📝 Registrar esta sesión
      </button>

      {/* Modal registro */}
      {logOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">¿Cómo fue la sesión?</h3>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {(['great','good','okay','hard'] as const).map(m => (
                <button key={m} onClick={() => setMood(m)}
                  className={`py-3 rounded-xl text-center border-2 transition-all ${
                    mood === m ? 'border-[#2D6A4F] bg-[#E8F5E9]' : 'border-gray-200'}`}>
                  <div className="text-2xl">
                    {m === 'great' ? '🌟' : m === 'good' ? '😊' : m === 'okay' ? '😐' : '😔'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {m === 'great' ? 'Increíble' : m === 'good' ? 'Bien' : m === 'okay' ? 'Regular' : 'Difícil'}
                  </div>
                </button>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notas opcionales sobre la sesión..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setLogOpen(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm">
                Cancelar
              </button>
              <button
                onClick={() => {
                  logSession({
                    weekId: week.id,
                    childId: activeChildId ?? '',
                    completed: true,
                    mood,
                    notes,
                    posturesCompleted: week.posturas.map(p => p.id)
                  })
                  setLogOpen(false)
                  setNotes('')
                }}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium"
                style={{ backgroundColor: weekColors.main }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
