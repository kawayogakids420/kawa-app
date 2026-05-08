'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'

type Step = 'welcome' | 'child' | 'test_intro' | 'test' | 'result'

// ─── TEST COMPLETO 6 SECCIONES ───────────────────────────────────────────────

interface Question {
  text: string
  section: string
}

const SECTIONS = [
  { id: 'A', label: 'Sensibilidad Táctil', icon: '🧤', color: '#2D6A4F' },
  { id: 'B', label: 'Movimiento y Equilibrio', icon: '🌀', color: '#0277BD' },
  { id: 'C', label: 'Fuerza y Postura', icon: '💪', color: '#6A1B9A' },
  { id: 'D', label: 'Sonidos y Audición', icon: '👂', color: '#BF360C' },
  { id: 'E', label: 'Visión y Entorno', icon: '👁️', color: '#1A237E' },
  { id: 'F', label: 'Coordinación', icon: '🧩', color: '#4E342E' },
]

const QUESTIONS: Question[] = [
  // A - Táctil (11)
  { section: 'A', text: 'Se queja de etiquetas de ropa o costuras de calcetines' },
  { section: 'A', text: 'Le molestan ciertas telas (áspera, lana, sintéticas)' },
  { section: 'A', text: 'Reacciona exageradamente cuando alguien lo toca por sorpresa' },
  { section: 'A', text: 'Evita actividades con texturas (barro, plastilina, arena)' },
  { section: 'A', text: 'Se incomoda con el baño, lavado de cabello o corte de uñas' },
  { section: 'A', text: 'Prefiere tocar a otros pero no le gusta que lo toquen a él/ella' },
  { section: 'A', text: 'Parece no sentir cuando se golpea o raspa' },
  { section: 'A', text: 'No nota cuando tiene las manos o cara sucias' },
  { section: 'A', text: 'Busca tocar todo lo que ve, mete cosas a la boca' },
  { section: 'A', text: 'Necesita que lo abrazen o aprieten fuerte para calmarse' },
  { section: 'A', text: 'Parece tener un umbral de dolor muy alto' },
  // B - Vestibular (10)
  { section: 'B', text: 'Le da mucho miedo subir a columpios o lugares altos' },
  { section: 'B', text: 'Se marea fácilmente en el carro o con movimientos circulares' },
  { section: 'B', text: 'Tiene miedo cuando le levantan los pies del piso' },
  { section: 'B', text: 'Se cae frecuentemente, tropieza o choca con personas' },
  { section: 'B', text: 'Tiene dificultad para sentarse quieto, se resbala de la silla' },
  { section: 'B', text: 'No le gusta intentar nuevas actividades físicas o deportes' },
  { section: 'B', text: 'Busca girarse, rodar o columpiarse todo el tiempo sin marearse' },
  { section: 'B', text: 'Le encanta correr, saltar, trepar sin parar' },
  { section: 'B', text: 'Siempre está moviéndose, parece que no puede quedarse quieto' },
  { section: 'B', text: 'Busca sensaciones de movimiento intensas que parecen riesgosas' },
  // C - Propioceptivo (6)
  { section: 'C', text: 'Usa demasiada fuerza: rompe cosas, aprieta muy fuerte al abrazar' },
  { section: 'C', text: 'Camina de puntillas frecuentemente' },
  { section: 'C', text: 'Choca con muebles, marcos de puertas o personas sin querer' },
  { section: 'C', text: 'Necesita apoyarse en paredes o personas, se "derrite" en la silla' },
  { section: 'C', text: 'Le cuesta tareas que requieren fuerza controlada (escribir, dibujar)' },
  { section: 'C', text: 'Parece no saber qué tan fuerte está haciendo fuerza' },
  // D - Auditivo (6)
  { section: 'D', text: 'Se tapa los oídos ante ruidos cotidianos (secadora, aplausos)' },
  { section: 'D', text: 'Se pone muy nervioso en lugares ruidosos (fiestas, centros comerciales)' },
  { section: 'D', text: 'Le cuesta concentrarse cuando hay mucho ruido de fondo' },
  { section: 'D', text: 'Reacciona exageradamente a sonidos agudos o inesperados' },
  { section: 'D', text: 'Parece no escuchar cuando se le llama, sin problemas de audición' },
  { section: 'D', text: 'Siempre busca hacer ruido o escuchar música muy fuerte' },
  // E - Visual (6)
  { section: 'E', text: 'Se distrae mucho con cualquier movimiento o estímulo visual' },
  { section: 'E', text: 'Le molestan los ambientes muy iluminados o la luz del sol' },
  { section: 'E', text: 'Evita el contacto visual o se siente incómodo mirando de frente' },
  { section: 'E', text: 'Se choca con objetos que están claramente visibles' },
  { section: 'E', text: 'Le cuesta encontrar cosas en entornos desordenados' },
  { section: 'E', text: 'Le encanta mirar luces, girar objetos o buscar patrones visuales' },
  // F - Coordinación (6)
  { section: 'F', text: 'Le cuesta aprender actividades nuevas que involucren su cuerpo' },
  { section: 'F', text: 'Parece torpe para su edad: se tropieza, dificultad al vestirse' },
  { section: 'F', text: 'Le cuesta seguir secuencias de movimientos (danzas, deportes)' },
  { section: 'F', text: 'Tarda mucho más que otros en aprender a usar cubiertos, atar agujetas' },
  { section: 'F', text: 'Evita juegos que requieren coordinación (pelotas, bicicleta, trepar)' },
  { section: 'F', text: 'Le cuesta imitar movimientos o gestos que hace otra persona' },
]

const FREQ_LABELS = ['Casi nunca', 'A veces', 'Seguido', 'Casi siempre']
const FREQ_COLORS = ['#E8F5E9', '#FFF9C4', '#FFE0B2', '#FFCDD2']
const FREQ_TEXT = ['#2D6A4F', '#F57F17', '#E65100', '#B71C1C']

// Calcular perfil desde respuestas
function calcProfile(answers: number[]): SensoryProfile {
  // Sensible: alto en A primeras 6 + D primeras 4 + E primeras 3
  // Buscador: alto en A últimas 5 + B últimas 4 + C primeras 2
  // Bajo Registro: alto en A 7-8 + C últimas 4 + B 7-8
  // Motor: alto en F todas + C 3-5

  const secciones: Record<string, number[]> = { A: [], B: [], C: [], D: [], E: [], F: [] }
  QUESTIONS.forEach((q, i) => {
    secciones[q.section].push(answers[i] ?? 0)
  })

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
  const avg = (arr: number[]) => arr.length ? sum(arr) / arr.length : 0

  const sensible = avg([
    ...secciones.A.slice(0, 6),
    ...secciones.D.slice(0, 4),
    ...secciones.E.slice(0, 3),
  ])
  const buscador = avg([
    ...secciones.A.slice(6),
    ...secciones.B.slice(6),
    ...secciones.C.slice(0, 2),
  ])
  const bajo = avg([
    secciones.A[7] ?? 0, secciones.A[8] ?? 0,
    ...secciones.B.slice(6, 8),
    ...secciones.C.slice(3),
  ])
  const motor = avg([
    ...secciones.F,
    ...secciones.C.slice(2, 5),
  ])

  const scores: Record<SensoryProfile, number> = {
    sensible, buscador, bajo_registro: bajo, motor
  }
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as SensoryProfile
}

export default function OnboardingPage() {
  const router = useRouter()
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)

  const [step, setStep] = useState<Step>('welcome')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1))
  const [currentSection, setCurrentSection] = useState(0)
  const [profile, setProfile] = useState<SensoryProfile | null>(null)

  const currentSectionId = SECTIONS[currentSection]?.id
  const sectionQs = QUESTIONS.map((q, i) => ({ ...q, index: i })).filter(q => q.section === currentSectionId)
  const sectionAnswered = sectionQs.every(q => answers[q.index] >= 0)
  const totalAnswered = answers.filter(a => a >= 0).length

  const handleAnswer = (qIndex: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[qIndex] = value
    setAnswers(newAnswers)
  }

  const nextSection = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      const p = calcProfile(answers)
      setProfile(p)
      setStep('result')
    }
  }

  const finish = () => {
    if (!profile) return
    completeOnboarding(childName, childAge ?? 5, profile)
    router.replace('/home')
  }

  // ── WELCOME ──────────────────────────────────────────────────────────────
  if (step === 'welcome') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
      style={{ background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 50%, #1A237E 100%)' }}>

      {/* Estrellitas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: Math.random() * 0.6 + 0.2
            }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-7xl mb-6">🌱</div>

        <h1 className="text-center font-bold mb-3 leading-tight"
          style={{ fontFamily: "'Livvic', 'Georgia', serif", fontSize: 32, letterSpacing: '-0.5px' }}>
          Kawa y los Guardianes<br />del Equilibrio
        </h1>

        <p className="text-center mb-2 text-green-100 leading-relaxed max-w-xs"
          style={{ fontFamily: "'Nunito', system-ui, sans-serif", fontSize: 16 }}>
          Un viaje para crecer y descubrir 5 mundos,
        </p>
        <p className="text-center mb-10 italic text-green-200 max-w-xs"
          style={{ fontFamily: "'Nunito', system-ui, sans-serif", fontSize: 16 }}>
          que te llevarán de vuelta a ti.
        </p>

        <button
          onClick={() => setStep('child')}
          className="bg-white font-bold px-8 py-4 rounded-2xl text-lg w-full max-w-xs mb-4"
          style={{ color: '#2D6A4F', fontFamily: "'Livvic', system-ui, sans-serif" }}>
          Comenzar el viaje
        </button>
        <p className="text-green-300 text-xs text-center max-w-xs">
          Para familias y profesionales · Basado en Integración Sensorial
        </p>
      </div>
    </div>
  )

  // ── CHILD INFO ────────────────────────────────────────────────────────────
  if (step === 'child') return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="mt-8 mb-6">
        <div className="text-4xl mb-3">👶</div>
        <h2 className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Livvic', system-ui, sans-serif" }}>
          Cuéntanos sobre el niño o niña
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Esto personaliza la experiencia de Kawa para su perfil único</p>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo se llama?</label>
          <input type="text" value={childName} onChange={e => setChildName(e.target.value)}
            placeholder="Nombre del niño o niña"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuántos años tiene?</label>
          <div className="grid grid-cols-6 gap-2">
            {[3,4,5,6,7,8].map(age => (
              <button key={age} onClick={() => setChildAge(age)}
                className={`py-3 rounded-xl text-lg font-semibold border-2 transition-all ${
                  childAge === age ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => { if (childName && childAge) setStep('test_intro') }}
        disabled={!childName || !childAge}
        className="mt-6 bg-[#2D6A4F] text-white font-semibold px-6 py-4 rounded-2xl w-full disabled:opacity-40"
        style={{ fontFamily: "'Livvic', system-ui, sans-serif" }}>
        Continuar
      </button>
    </div>
  )

  // ── TEST INTRO ────────────────────────────────────────────────────────────
  if (step === 'test_intro') return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="mt-8 mb-6">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Livvic', system-ui, sans-serif" }}>
          Test sensorial de {childName}
        </h2>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          Este test no es un diagnóstico clínico. Es una herramienta de observación para conocer mejor el perfil sensorial de tu hijo/a.
        </p>
      </div>

      <div className="bg-[#E8F5E9] rounded-2xl p-4 mb-6">
        <p className="text-sm font-semibold text-[#2D6A4F] mb-2">¿Cómo usarlo?</p>
        <ul className="space-y-1.5 text-sm text-[#1B5E20]">
          <li>• Piensa en el comportamiento habitual durante los últimos 3 meses</li>
          <li>• Responde con la frecuencia que mejor lo describe</li>
          <li>• No hay respuestas correctas ni incorrectas</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {SECTIONS.map(sec => (
          <div key={sec.id} className="flex items-center gap-2 p-3 rounded-xl border border-gray-100">
            <span className="text-xl">{sec.icon}</span>
            <span className="text-xs text-gray-600 leading-tight">{sec.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <button onClick={() => setStep('test')}
          className="bg-[#2D6A4F] text-white font-semibold px-6 py-4 rounded-2xl w-full"
          style={{ fontFamily: "'Livvic', system-ui, sans-serif" }}>
          Comenzar el test — 45 preguntas
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">Aproximadamente 5-8 minutos</p>
      </div>
    </div>
  )

  // ── TEST ──────────────────────────────────────────────────────────────────
  if (step === 'test') {
    const sec = SECTIONS[currentSection]
    const progress = ((currentSection * 100) / SECTIONS.length)

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
        {/* Header fijo */}
        <div className="bg-white px-5 pt-10 pb-4 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              Sección {currentSection + 1} de {SECTIONS.length}
            </span>
            <span className="text-sm text-gray-400">{totalAnswered}/45 respondidas</span>
          </div>
          {/* Barra de progreso secciones */}
          <div className="flex gap-1">
            {SECTIONS.map((s, i) => (
              <div key={s.id} className="flex-1 h-1.5 rounded-full transition-all"
                style={{ background: i < currentSection ? sec.color : i === currentSection ? sec.color + 'AA' : '#E5E7EB' }} />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl">{sec.icon}</span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{sec.id}</p>
              <p className="font-semibold text-gray-900" style={{ fontFamily: "'Livvic', system-ui, sans-serif" }}>
                {sec.label}
              </p>
            </div>
          </div>
        </div>

        {/* Preguntas */}
        <div className="flex-1 px-5 py-4 space-y-4">
          {sectionQs.map((q) => (
            <div key={q.index} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-800 leading-relaxed mb-3 font-medium">{q.text}</p>
              <div className="grid grid-cols-2 gap-2">
                {FREQ_LABELS.map((label, val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.index, val)}
                    className="py-2.5 px-3 rounded-xl text-xs font-medium transition-all border-2 text-left"
                    style={{
                      background: answers[q.index] === val ? FREQ_COLORS[val] : 'white',
                      borderColor: answers[q.index] === val ? FREQ_TEXT[val] : '#E5E7EB',
                      color: answers[q.index] === val ? FREQ_TEXT[val] : '#6B7280',
                    }}>
                    {val === 0 && '😌 '}{val === 1 && '🙂 '}{val === 2 && '😕 '}{val === 3 && '😓 '}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Botón siguiente */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[430px] mx-auto">
          <button
            onClick={nextSection}
            disabled={!sectionAnswered}
            className="w-full py-4 rounded-2xl font-semibold text-white disabled:opacity-40 transition-all"
            style={{ background: sectionAnswered ? sec.color : '#9CA3AF', fontFamily: "'Livvic', system-ui, sans-serif" }}>
            {currentSection < SECTIONS.length - 1 ? `Siguiente sección →` : 'Ver mi perfil sensorial'}
          </button>
        </div>
      </div>
    )
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (step === 'result' && profile) {
    const p = PROFILES[profile]
    const sectionScores = SECTIONS.map(sec => {
      const qs = QUESTIONS.map((q, i) => ({ ...q, index: i })).filter(q => q.section === sec.id)
      const total = qs.reduce((sum, q) => sum + (answers[q.index] ?? 0), 0)
      const max = qs.length * 3
      const pct = Math.round((total / max) * 100)
      return { ...sec, pct, total, max }
    })

    return (
      <div className="min-h-screen flex flex-col pb-24" style={{ background: p.bg }}>
        <div className="px-5 pt-12 pb-6">
          <div className="text-5xl text-center mb-3">{p.icon}</div>
          <h2 className="text-2xl font-bold text-center mb-2"
            style={{ color: p.color, fontFamily: "'Livvic', system-ui, sans-serif" }}>
            {childName} tiene un perfil<br />{p.name}
          </h2>
          <p className="text-center text-sm leading-relaxed max-w-xs mx-auto"
            style={{ color: p.color }}>
            {p.description}
          </p>
        </div>

        {/* Resultados por sección */}
        <div className="bg-white mx-4 rounded-3xl p-5 shadow-sm mb-4">
          <p className="font-semibold text-gray-900 mb-4"
            style={{ fontFamily: "'Livvic', system-ui, sans-serif" }}>
            Perfil sensorial detallado
          </p>
          <div className="space-y-3">
            {sectionScores.map(sec => (
              <div key={sec.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{sec.icon}</span>
                    <span className="text-xs font-medium text-gray-700">{sec.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{sec.total}/{sec.max}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${sec.pct}%`, backgroundColor: sec.color }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {sec.pct < 25 ? 'Sin dificultades notables' :
                   sec.pct < 60 ? 'Algunas diferencias que merecen atención' :
                   'Diferencias significativas en esta área'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white mx-4 rounded-3xl p-5 shadow-sm mb-4">
          <p className="text-sm font-medium text-gray-500 mb-3">Tu curso incluye:</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Posturas adaptadas al perfil de {childName}</li>
            <li>✓ Tips específicos cada semana</li>
            <li>✓ Micro-prácticas para su sistema sensorial</li>
            <li>✓ Módulos IS explicados para ti</li>
          </ul>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Este test no es un diagnóstico clínico. Si tienes preocupaciones importantes, consulta con un terapeuta ocupacional.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[430px] mx-auto">
          <button onClick={finish}
            className="w-full py-4 rounded-2xl font-semibold text-white text-lg"
            style={{ backgroundColor: p.color, fontFamily: "'Livvic', system-ui, sans-serif" }}>
            Comenzar con {childName} 🌱
          </button>
          <button onClick={() => { setStep('test'); setCurrentSection(0); setAnswers(Array(QUESTIONS.length).fill(-1)) }}
            className="w-full mt-2 text-gray-400 text-sm underline py-1">
            Repetir el test
          </button>
        </div>
      </div>
    )
  }

  return null
}
