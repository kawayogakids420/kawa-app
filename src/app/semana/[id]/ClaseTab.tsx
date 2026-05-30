'use client'
import { useState, useRef, useEffect } from 'react'
import type { Week, SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'
import ProtocoloTO from './ProtocoloTO'

interface Props {
  week: Week
  weekColors: { main: string; light: string }
  activeProfile: SensoryProfile | null
}

// Canción eliminada de esta versión
type Section = 'historia' | 'sesion' | 'posturas' | 'respiracion' | 'relajacion'

const SECTIONS_ORDER: Section[] = ['historia', 'sesion', 'posturas', 'respiracion', 'relajacion']

const SECTION_LABELS: Record<Section, { title: string; icon: string; star: string }> = {
  historia:    { title: 'La historia de Kawa',      icon: '📖', star: 'Historia' },
  sesion:      { title: 'Estructura de la sesión',  icon: '⏱️', star: 'Sesión' },
  posturas:    { title: 'Las posturas de Kawa',     icon: '🧘', star: 'Posturas' },
  respiracion: { title: '',                          icon: '🌬️', star: 'Respiración' },
  relajacion:  { title: 'Relajación guiada de Kawa',icon: '☁️', star: 'Relajación' },
}

// ── Reproductor de audio ──────────────────────────────────────────────────────
interface AudioPlayerProps {
  src: string
  label: string
  forChild?: boolean
  color?: string
}

function AudioPlayer({ src, label, forChild = false, color = '#2D6A4F' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError]       = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime     = () => setProgress(audio.currentTime)
    const onDuration = () => setDuration(audio.duration)
    const onEnd      = () => { setPlaying(false); setProgress(0) }
    const onError    = () => setError(true)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Number(e.target.value)
    setProgress(Number(e.target.value))
  }

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (error) return null

  const bg       = forChild ? '#FFF8E1' : '#F0F7F4'
  const border   = forChild ? '#FFD54F' : color
  const tagLabel = forChild ? 'Para el niño/a' : 'Para el adulto'
  const tagBg    = forChild ? '#FFF3CD' : '#E8F5E9'
  const tagColor = forChild ? '#E65100' : '#2D6A4F'
  const btnColor = forChild ? '#F57F17' : color

  return (
    <div className="rounded-2xl p-3 mb-2"
      style={{ background: bg, border: `1.5px solid ${border}30` }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: tagBg, color: tagColor }}>
          {forChild ? '👦' : '👩'} {tagLabel}
        </span>
        <span className="text-xs text-gray-400">{fmt(duration)}</span>
      </div>
      <p className="text-sm font-medium text-gray-800 mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <button onClick={togglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
          style={{ background: btnColor }}>
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        <div className="flex-1 flex items-center gap-2">
          <input type="range" min={0} max={duration || 100} value={progress}
            onChange={seek}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${btnColor} ${(progress/(duration||1))*100}%, #E0E0E0 0%)`
            }}
          />
          <span className="text-xs text-gray-400 flex-shrink-0 w-8">{fmt(progress)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ClaseTab({ week, weekColors, activeProfile }: Props) {
  const [openSection, setOpenSection]     = useState<Section | null>('historia')
  const [openPosture, setOpenPosture]     = useState<string | null>(null)
  const [showProfileTips, setShowProfileTips] = useState(false)
  const [completedSections, setCompleted] = useState<Set<Section>>(new Set())
  const { logSession, activeChildId, userType } = useAppStore()
  const [logOpen, setLogOpen] = useState(false)
  const [mood, setMood]       = useState<'great'|'good'|'okay'|'hard'>('good')
  const [notes, setNotes]     = useState('')

  const profile = activeProfile ? PROFILES[activeProfile] : null
  const s = week.id

  // Marcar sección como completada al cerrarla
  const toggleSection = (id: Section) => {
    if (openSection === id) {
      // Al cerrar, marcar como completada
      setCompleted(prev => new Set([...prev, id]))
      setOpenSection(null)
    } else {
      setOpenSection(id)
    }
  }

  const totalSections  = SECTIONS_ORDER.length
  const doneCount      = completedSections.size
  const progressPct    = Math.round((doneCount / totalSections) * 100)

  const SectionHeader = ({ id }: { id: Section }) => {
    const { title: baseTitle, icon } = SECTION_LABELS[id]
    const title = id === 'respiracion' ? week.breathing.name : baseTitle
    const isDone = completedSections.has(id)
    const isOpen = openSection === id

    return (
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm mb-2 text-left">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {isDone && !isOpen && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: weekColors.main + '20', color: weekColors.main }}>
              ⭐ Hecho
            </span>
          )}
          <span className="text-gray-400 text-lg">{isOpen ? '↑' : '↓'}</span>
        </div>
      </button>
    )
  }

  const postureAudioMap: Record<string, string> = {
    montana: 'montana',
    indio: 'posturaindio',
    tortuga: 'posturatortuga',
    gato: 'gatolYII',
    arbol: 'posturaarbol',
  }

  return (
    <div className="space-y-1">

      {/* ── BARRA DE PROGRESO DE SESIÓN ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">Progreso de esta sesión</p>
          <p className="text-sm font-bold" style={{ color: weekColors.main }}>
            {doneCount}/{totalSections}
          </p>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: weekColors.main }} />
        </div>
        <div className="flex gap-1.5">
          {SECTIONS_ORDER.map(sec => (
            <div key={sec} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{
                  backgroundColor: completedSections.has(sec)
                    ? weekColors.main
                    : openSection === sec
                    ? weekColors.main + '40'
                    : '#F3F4F6',
                  color: completedSections.has(sec) ? 'white' : '#9CA3AF'
                }}>
                {completedSections.has(sec) ? '⭐' : SECTION_LABELS[sec].icon}
              </div>
              <span className="text-[9px] text-gray-400 text-center leading-tight">
                {SECTION_LABELS[sec].star}
              </span>
            </div>
          ))}
        </div>
        {doneCount === totalSections && (
          <div className="mt-3 text-center py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: weekColors.main + '15', color: weekColors.main }}>
            🌟 ¡Sesión completa! Ya puedes registrarla
          </div>
        )}
      </div>

      {/* ── HISTORIA ── */}
      <SectionHeader id="historia" />
      {openSection === 'historia' && (
        <div className="mb-3 space-y-2">
          <AudioPlayer
            src={`/audio/semana-${s}/s${s}historiadekawa.m4a`}
            label="Historia completa de Kawa — narrar mientras el niño escucha"
            forChild={false}
            color={weekColors.main}
          />
          <div className="bg-[#FFFDE7] rounded-2xl p-5 shadow-sm">
            {Object.entries(week.story).map(([key, act]) => (
              <div key={key} className="mb-5 last:mb-0">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: weekColors.main }}>
                  {key === 'inicio' ? 'Inicio' : key === 'desequilibrio' ? 'Desequilibrio' :
                   key === 'accion' ? 'Acción' : key === 'catarsis' ? 'Catarsis' : 'Enseñanza'}
                  {' — '}{act.title}
                </p>
                <p className="text-gray-800 text-sm leading-relaxed italic">{act.text}</p>
              </div>
            ))}
          </div>
          <button onClick={() => toggleSection('historia')}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ backgroundColor: weekColors.main }}>
            ⭐ Marcar historia como completada
          </button>
        </div>
      )}

      {/* ── SESIÓN ── */}
      <SectionHeader id="sesion" />
      {openSection === 'sesion' && (
        <div className="mb-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex gap-3 text-sm text-gray-600 pb-3 border-b border-gray-100">
              <span>⏰ {week.sessionStructure.duration}</span>
            </div>
            <p className="text-xs text-gray-500 italic">{week.sessionStructure.preparation}</p>
            {week.sessionStructure.moments
              .filter(m => !m.name.toLowerCase().includes('canción') && !m.name.toLowerCase().includes('cancion'))
              .map((m, i) => (
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
          <button onClick={() => toggleSection('sesion')}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white mt-2"
            style={{ backgroundColor: weekColors.main }}>
            ⭐ Marcar estructura como revisada
          </button>
        </div>
      )}

      {/* ── POSTURAS ── */}
      <SectionHeader id="posturas" />
      {openSection === 'posturas' && (
        <div className="mb-3">
          <div className="space-y-2">
            {profile && (
              <button
                onClick={() => setShowProfileTips(!showProfileTips)}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: profile.bg, color: profile.color }}>
                <span>{profile.icon}</span>
                <span>{showProfileTips ? 'Ver instrucciones generales' : `Ver adaptaciones para ${profile.name}`}</span>
              </button>
            )}

            {week.posturas.map((posture) => {
              const audioKey = postureAudioMap[posture.id] || posture.id
              return (
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
                    <div className="bg-white rounded-2xl px-4 pb-4 -mt-2 pt-3 shadow-sm mb-1"
                      style={{ borderLeft: `4px solid ${weekColors.main}` }}>
                      <AudioPlayer
                        src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                        label="Narración mágica — leer mientras el niño hace la postura"
                        forChild={true}
                        color={weekColors.main}
                      />
                      <AudioPlayer
                        src={`/audio/semana-${s}/s${s}howto${audioKey}.m4a`}
                        label="Instrucciones paso a paso — cómo hacer la postura"
                        forChild={false}
                        color={weekColors.main}
                      />
                      <p className="text-xs italic text-gray-500 mb-3 leading-relaxed mt-2">
                        {posture.storyNarration}
                      </p>
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
                          <p className="text-xs font-medium" style={{ color: weekColors.main }}>
                            ⏱️ {posture.duration}
                          </p>
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
              )
            })}
          </div>
          <button onClick={() => toggleSection('posturas')}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white mt-2"
            style={{ backgroundColor: weekColors.main }}>
            ⭐ Marcar posturas como completadas
          </button>
        </div>
      )}

      {/* ── RESPIRACIÓN ── */}
      <SectionHeader id="respiracion" />
      {openSection === 'respiracion' && (
        <div className="mb-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <AudioPlayer
              src={`/audio/semana-${s}/s${s}respiracionraiz.m4a`}
              label="Guía de respiración — seguir junto al niño/a"
              forChild={false}
              color={weekColors.main}
            />
            <AudioPlayer
              src={`/audio/semana-${s}/s${s}howtorespiacionraiz.m4a`}
              label="Cómo enseñar la respiración — instrucciones para el adulto"
              forChild={false}
              color={weekColors.main}
            />
            <p className="text-sm italic text-gray-500">{week.breathing.storyNarration}</p>
            <div className="p-3 rounded-xl" style={{ backgroundColor: weekColors.light }}>
              <p className="text-sm font-medium mb-1" style={{ color: weekColors.main }}>Cómo:</p>
              <p className="text-sm text-gray-700">{week.breathing.howTo}</p>
            </div>
            <p className="text-xs text-green-700"><strong>Beneficio:</strong> {week.breathing.benefit}</p>
            <p className="text-xs text-gray-500"><strong>Cuándo usarla:</strong> {week.breathing.whenToUse}</p>
          </div>
          <button onClick={() => toggleSection('respiracion')}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white mt-2"
            style={{ backgroundColor: weekColors.main }}>
            ⭐ Marcar respiración como completada
          </button>
        </div>
      )}

      {/* ── RELAJACIÓN ── */}
      <SectionHeader id="relajacion" />
      {openSection === 'relajacion' && (
        <div className="mb-3">
          <div className="space-y-2">
            <AudioPlayer
              src={`/audio/semana-${s}/s${s}relajacion.m4a`}
              label="Relajación guiada — reproducir mientras el niño está acostado"
              forChild={true}
              color={weekColors.main}
            />
            <div className="bg-[#E8EAF6] rounded-2xl p-5 shadow-sm">
              <p className="text-xs text-indigo-700 mb-3 font-medium">
                Leer en voz baja mientras el niño está acostado:
              </p>
              {week.relaxationScript.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-sm text-indigo-900 italic leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <button onClick={() => toggleSection('relajacion')}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white mt-2"
            style={{ backgroundColor: weekColors.main }}>
            ⭐ Marcar relajación como completada
          </button>
        </div>
      )}

      {/* ── ADAPTACIONES ── */}
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

      {/* ── PROTOCOLO TO — solo profesionales ── */}
      {userType === 'profesional' && (
        <ProtocoloTO week={week} weekColors={weekColors} />
      )}

      {/* ── REGISTRAR SESIÓN ── */}
      <button
        onClick={() => setLogOpen(true)}
        className="w-full py-3 rounded-2xl text-sm font-medium border-2 mb-3"
        style={{ borderColor: weekColors.main, color: weekColors.main }}>
        📝 Registrar esta sesión {doneCount === totalSections ? '🌟' : `(${doneCount}/${totalSections} completadas)`}
      </button>

      {logOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">¿Cómo fue la sesión?</h3>

            {/* Estrellas ganadas */}
            {doneCount > 0 && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl"
                style={{ backgroundColor: weekColors.light }}>
                <span className="text-2xl">{'⭐'.repeat(doneCount)}</span>
                <p className="text-sm font-medium" style={{ color: weekColors.main }}>
                  {doneCount} estrella{doneCount > 1 ? 's' : ''} ganada{doneCount > 1 ? 's' : ''} hoy
                </p>
              </div>
            )}

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
              className="w-full border border-gray-200 rounded-xl p-3 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] mb-4"
            />
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
                    completed: doneCount === totalSections,
                    mood,
                    notes,
                    posturesCompleted: week.posturas.map(p => p.id)
                  })
                  setLogOpen(false)
                  setNotes('')
                }}
                className="flex-1 py-3 rounded-xl text-white text-sm font-medium"
                style={{ backgroundColor: weekColors.main }}>
                Guardar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
