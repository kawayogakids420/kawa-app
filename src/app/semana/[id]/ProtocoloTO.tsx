'use client'
import { useState } from 'react'
import type { Week } from '@/lib/data/course'

interface Props {
  week: Week
  weekColors: { main: string; light: string }
}

type Phase = 'llegada' | 'propiocepcion' | 'discriminacion' | 'cierre'

const PHASES: {
  id: Phase
  title: string
  time: string
  steps: { label: string; desc: string }[]
}[] = [
  {
    id: 'llegada',
    title: 'Llegada y consentimiento activo',
    time: '5 min',
    steps: [
      {
        label: 'Ritual de bienvenida corporal',
        desc: 'El niño/a elige una postura de inicio: sentado, de pie, o en colchoneta. Le devuelve agencia sobre su cuerpo desde el minuto 0.',
      },
      {
        label: 'Consentimiento táctil explícito',
        desc: '¿Puedo tocarte los hombros? Espera respuesta verbal o gestual clara. Activa el sistema de compromiso social antes de trabajar el tacto.',
      },
      {
        label: 'Registro de activación inicial',
        desc: 'Pregunta: "Si tu cuerpo tuviera un semáforo ahora, ¿de qué color estaría?" Anota en escala 1–5. Es la línea de base para el delta de sesión.',
      },
    ],
  },
  {
    id: 'propiocepcion',
    title: 'Propiocepción profunda',
    time: '10 min',
    steps: [
      {
        label: 'Comprensiones articulares bilaterales',
        desc: '3 seg de presión, 2 de liberación. Hombros → codos → muñecas → rodillas → tobillos. 3 repeticiones por articulación. Observa si el tono muscular disminuye.',
      },
      {
        label: 'Carga de peso — el muro invisible',
        desc: 'El niño/a empuja una pared con ambas manos durante 10 segundos. Luego empuja el suelo desde cuadrúpeda. Activa los receptores propioceptivos musculares.',
      },
      {
        label: 'Rollo de presión en colchoneta',
        desc: 'Enrollar en colchoneta delgada con presión moderada en tronco. Mantener 20–30 segundos. Uno de los inputs más efectivos para bajar activación.',
      },
    ],
  },
  {
    id: 'discriminacion',
    title: 'Discriminación táctil consciente',
    time: '20 min',
    steps: [
      {
        label: 'Caja de texturas graduada',
        desc: '5 texturas de menor a mayor intensidad: liso → suave → rugoso → granulado → espinoso. Primero con ojos abiertos, luego cerrados. No corrijas las respuestas.',
      },
      {
        label: 'Escritura en la espalda',
        desc: 'Con consentimiento previo: dibujar formas en la espalda. Objetivo: entrenar la vía táctil discriminativa. Comenzar con formas grandes y presión firme.',
      },
      {
        label: 'Posturas de tierra de Kawa',
        desc: 'Montaña → Postura del Indio → Gato I y II → Árbol. Narrar con la historia: "Kawa pone sus pies en la tierra y siente cómo el suelo lo sostiene."',
      },
      {
        label: 'Integración bilateral con masa',
        desc: 'Amasar, pellizcar, enrollar con ambas manos durante 5 minutos. Input propioceptivo distal mientras integra ambos hemisferios.',
      },
    ],
  },
  {
    id: 'cierre',
    title: 'Cierre y transferencia',
    time: '10 min',
    steps: [
      {
        label: 'Registro de activación final',
        desc: 'Repite la pregunta del semáforo. Delta de 1+ punto en la dirección esperada = efectividad de sesión documentable.',
      },
      {
        label: 'Pregunta de cierre somático',
        desc: '"¿Qué parte de tu cuerpo se siente diferente que cuando llegaste?" Entrena interoceptión y memoria somática.',
      },
      {
        label: 'Tarea para casa',
        desc: 'Elige UNA actividad que el niño/a disfrutó y dásela a la familia como práctica diaria de 5 minutos. Anota cuál y para qué momento del día.',
      },
    ],
  },
]

const INDICADORES = [
  'Tolera contacto táctil directo sin retiro ni bloqueo conductual',
  'Responde de forma organizada ante presión profunda',
  'Identifica partes del cuerpo tocadas con ojos cerrados',
  'Nivel de activación al cierre menor o igual que al inicio',
  'Inicia o solicita contacto físico espontáneamente en sesión',
  'Participa en al menos 3 de 4 actividades sin resistencia activa',
  'Mantiene presencia durante las actividades táctiles',
]

const MATERIALES = [
  {
    title: 'Esenciales',
    colorKey: 'main' as const,
    bgKey: 'light' as const,
    items: [
      'Colchoneta de yoga o goma eva',
      'Bandeja con 5 texturas distintas',
      'Masa, arcilla o kinetic sand',
      'Manta o colchoneta delgada (burrito)',
    ],
  },
  {
    title: 'Opcionales de alto impacto',
    color: '#185FA5',
    bg: '#E4F1FB',
    items: [
      'Chaleco o manta con peso',
      'Cepillo táctil Wilbarger',
      'Bolsa de frijoles o arroz',
      'Música instrumental 60–70 bpm',
    ],
  },
  {
    title: 'Señales de alerta — detén la actividad',
    color: '#C07010',
    bg: '#FEF3DC',
    items: [
      'Retiro físico o verbal del contacto',
      'Rigidez corporal súbita',
      'Llanto o conducta de evitación',
      'Escalada de activación tras el contacto',
    ],
  },
]

export default function ProtocoloTO({ week, weekColors }: Props) {
  const [tab, setTab] = useState<'protocolo' | 'registro' | 'materiales'>('protocolo')
  const [openPhase, setOpenPhase] = useState<Phase | null>('llegada')
  const [checks, setChecks] = useState<Record<number, boolean>>({})
  const [inicio, setInicio] = useState(3)
  const [final, setFinal] = useState(2)
  const [notas, setNotas] = useState('')
  const [tarea, setTarea] = useState('')

  const delta = final - inicio
  const deltaColor =
    delta < 0 ? '#1D9E75' : delta === 0 ? '#888888' : '#C07010'
  const deltaText =
    delta < 0
      ? `${delta} punto${Math.abs(delta) > 1 ? 's' : ''} → sesión efectiva`
      : delta === 0
      ? '0 puntos → sin cambio observable'
      : `+${delta} punto${delta > 1 ? 's' : ''} → revisar enfoque`

  const toggleCheck = (i: number) =>
    setChecks(prev => ({ ...prev, [i]: !prev[i] }))

  const checked = Object.values(checks).filter(Boolean).length

  const TABS = [
    { id: 'protocolo', label: 'Protocolo' },
    { id: 'registro', label: 'Registro clínico' },
    { id: 'materiales', label: 'Materiales' },
  ] as const

  return (
    <div
      className="rounded-2xl border-2 overflow-hidden mb-3"
      style={{ borderColor: weekColors.main + '40' }}
    >
      {/* Header */}
      <div className="px-4 py-3" style={{ backgroundColor: weekColors.main }}>
        <p className="text-white font-semibold text-sm">
          Protocolo clínico — Terapia Ocupacional
        </p>
        <p className="text-xs mt-0.5" style={{ color: weekColors.light + 'CC' }}>
          Guardián {week.id}: {week.element} · Consulta 1:1 · 45 min · 3–8 años
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 text-xs font-medium transition-colors"
            style={{
              color: tab === t.id ? weekColors.main : '#888888',
              borderBottom:
                tab === t.id
                  ? `2px solid ${weekColors.main}`
                  : '2px solid transparent',
              backgroundColor: 'white',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white">

        {/* ── PROTOCOLO ── */}
        {tab === 'protocolo' && (
          <div className="space-y-2">

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Duración total', val: '45 min' },
                { label: 'Sistema principal', val: 'Táctil · Prop.' },
                { label: 'Marco teórico', val: 'SI · Polivagal' },
              ].map(m => (
                <div
                  key={m.label}
                  className="rounded-xl p-2.5"
                  style={{ backgroundColor: weekColors.light }}
                >
                  <p className="text-[10px] text-gray-500 mb-0.5">{m.label}</p>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: weekColors.main }}
                  >
                    {m.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Alerta */}
            <div
              className="rounded-xl p-3 text-xs mb-3"
              style={{ backgroundColor: '#FEF3DC', color: '#633806' }}
            >
              <span className="font-semibold">⚠️ Evalúa la activación al inicio.</span>{' '}
              Si el niño/a llega en estado 4–5, empieza por propiocepción pesada
              antes de cualquier otra fase.
            </div>

            {/* Fases */}
            {PHASES.map((phase, idx) => (
              <div key={phase.id}>
                <button
                  onClick={() =>
                    setOpenPhase(openPhase === phase.id ? null : phase.id)
                  }
                  className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0"
                      style={{ backgroundColor: weekColors.main }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {phase.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: weekColors.light,
                        color: weekColors.main,
                      }}
                    >
                      {phase.time}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {openPhase === phase.id ? '↑' : '↓'}
                    </span>
                  </div>
                </button>

                {openPhase === phase.id && (
                  <div className="rounded-b-xl px-3 pb-3 -mt-1 bg-white border border-t-0 border-gray-100 space-y-2.5">
                    {phase.steps.map((step, i) => (
                      <div
                        key={i}
                        className="flex gap-2.5 pt-2.5 border-t border-gray-50 first:border-0 first:pt-0"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ backgroundColor: weekColors.main }}
                        />
                        <div>
                          <p className="text-xs font-semibold text-gray-900 mb-0.5">
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── REGISTRO ── */}
        {tab === 'registro' && (
          <div className="space-y-4">

            {/* Indicadores */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Indicadores observados
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: weekColors.light,
                    color: weekColors.main,
                  }}
                >
                  {checked}/{INDICADORES.length}
                </span>
              </div>
              <div className="space-y-2">
                {INDICADORES.map((ind, i) => (
                  <button
                    key={i}
                    onClick={() => toggleCheck(i)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all"
                    style={{
                      borderColor: checks[i] ? weekColors.main : '#E5E7EB',
                      backgroundColor: checks[i] ? weekColors.light : 'white',
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
                      style={{
                        backgroundColor: checks[i] ? weekColors.main : 'white',
                        borderColor: checks[i] ? weekColors.main : '#D1D5DB',
                      }}
                    >
                      {checks[i] && (
                        <span className="text-white text-[10px]">✓</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-700">{ind}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delta de activación */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Delta de activación
              </p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[
                  { label: 'Inicio (semáforo)', val: inicio, setter: setInicio },
                  { label: 'Cierre (semáforo)', val: final, setter: setFinal },
                ].map(sl => (
                  <div
                    key={sl.label}
                    className="rounded-xl p-3"
                    style={{ backgroundColor: weekColors.light }}
                  >
                    <p className="text-[10px] text-gray-500 mb-1">{sl.label}</p>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={sl.val}
                      onChange={e => sl.setter(Number(e.target.value))}
                      className="w-full mb-1"
                    />
                    <p
                      className="text-lg font-bold"
                      style={{ color: weekColors.main }}
                    >
                      {sl.val}
                      <span className="text-xs font-normal text-gray-400">/5</span>
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="rounded-xl p-3 text-sm font-medium"
                style={{
                  backgroundColor:
                    delta < 0 ? '#E1F5EE' : delta === 0 ? '#F5F5F5' : '#FEF3DC',
                  color: deltaColor,
                }}
              >
                {deltaText}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Observaciones clínicas
              </p>
              <textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
                placeholder="Respuestas atípicas, señales de defensividad, actividades de mayor impacto, ajustes para próxima sesión..."
                className="w-full border border-gray-200 rounded-xl p-3 text-xs h-20 resize-none focus:outline-none focus:ring-1"
                style={{ '--tw-ring-color': weekColors.main } as React.CSSProperties}
              />
            </div>

            {/* Tarea */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Tarea enviada a casa
              </p>
              <textarea
                value={tarea}
                onChange={e => setTarea(e.target.value)}
                placeholder="Actividad, momento del día (mañana / post-colegio / antes de dormir), instrucción para la familia..."
                className="w-full border border-gray-200 rounded-xl p-3 text-xs h-16 resize-none focus:outline-none focus:ring-1"
                style={{ '--tw-ring-color': weekColors.main } as React.CSSProperties}
              />
            </div>
          </div>
        )}

        {/* ── MATERIALES ── */}
        {tab === 'materiales' && (
          <div className="space-y-3">
            {MATERIALES.map(group => {
              const color =
                'colorKey' in group ? weekColors.main : group.color
              const bg =
                'bgKey' in group ? weekColors.light : group.bg
              return (
                <div
                  key={group.title}
                  className="rounded-xl p-3"
                  style={{ backgroundColor: bg }}
                >
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{ color }}
                  >
                    {group.title}
                  </p>
                  <div className="space-y-1.5">
                    {group.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span
                          className="text-xs mt-0.5 flex-shrink-0"
                          style={{ color }}
                        >
                          •
                        </span>
                        <span className="text-xs text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
