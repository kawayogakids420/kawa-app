'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'

type Step = 'welcome' | 'child' | 'profile' | 'ready'

const PROFILE_QUESTIONS = [
  {
    q: 'Cuando hay mucho ruido o mucha gente, tu hijo/a generalmente...',
    a: [
      { text: 'Se bloquea, llora o se tapa los oídos', profile: 'sensible' },
      { text: 'Se emociona más y busca más estímulos', profile: 'buscador' },
      { text: 'Parece no notarlo o no reacciona mucho', profile: 'bajo_registro' },
      { text: 'Se confunde y le cuesta manejar la situación', profile: 'motor' },
    ]
  },
  {
    q: 'Con el movimiento físico, tu hijo/a...',
    a: [
      { text: 'Prefiere actividades tranquilas, le incomoda moverse mucho', profile: 'sensible' },
      { text: 'Nunca para quieto/a, busca trepar, saltar, correr siempre', profile: 'buscador' },
      { text: 'Necesita movimientos muy intensos para "sentir" que se mueve', profile: 'bajo_registro' },
      { text: 'Se cae seguido, le cuesta coordinar movimientos nuevos', profile: 'motor' },
    ]
  },
  {
    q: 'En situaciones nuevas o desafiantes, generalmente...',
    a: [
      { text: 'Se pone muy ansioso/a y necesita mucha preparación', profile: 'sensible' },
      { text: 'Se lanza sin pensar, le encanta el desafío', profile: 'buscador' },
      { text: 'Parece no importarle o no registrar la dificultad', profile: 'bajo_registro' },
      { text: 'Se frustra porque su cuerpo no responde como quiere', profile: 'motor' },
    ]
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)

  const [step, setStep] = useState<Step>('welcome')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState<number | null>(null)
  const [answers, setAnswers] = useState<SensoryProfile[]>([])
  const [qIndex, setQIndex] = useState(0)

  const handleAnswer = (profile: SensoryProfile) => {
    const newAnswers = [...answers, profile]
    setAnswers(newAnswers)
    if (qIndex < PROFILE_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1)
    } else {
      setStep('ready')
    }
  }

  const getTopProfile = (): SensoryProfile => {
    const counts: Record<string, number> = {}
    answers.forEach(a => { counts[a] = (counts[a] ?? 0) + 1 })
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as SensoryProfile) ?? 'sensible'
  }

  const finish = () => {
    const profile = getTopProfile()
    completeOnboarding(childName, childAge ?? 5, profile)
    router.replace('/home')
  }

  if (step === 'welcome') return (
    <div className="min-h-screen bg-[#2D6A4F] flex flex-col items-center justify-center p-6 text-white">
      <div className="text-8xl mb-6">🌱</div>
      <h1 className="text-3xl font-bold text-center mb-3">Kawa y los 5 Guardianes</h1>
      <p className="text-center text-green-100 text-lg mb-2">Yoga sensorial para niños de 3 a 8 años</p>
      <p className="text-center text-green-200 text-sm mb-10 max-w-xs">Un viaje de 5 semanas por los mundos de la Tierra, el Agua, el Aire, el Fuego y el Espacio</p>
      <button
        onClick={() => setStep('child')}
        className="bg-white text-[#2D6A4F] font-semibold px-8 py-4 rounded-2xl text-lg w-full max-w-xs"
      >
        Comenzar el viaje
      </button>
      <p className="text-green-300 text-xs mt-6 text-center">Para familias y profesionales · Basado en integración sensorial</p>
    </div>
  )

  if (step === 'child') return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="mt-8 mb-6">
        <div className="text-4xl mb-3">👶</div>
        <h2 className="text-2xl font-bold text-gray-900">Cuéntanos sobre el niño o niña</h2>
        <p className="text-gray-500 mt-1">Esto personaliza la experiencia de Kawa</p>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo se llama?</label>
          <input
            type="text"
            value={childName}
            onChange={e => setChildName(e.target.value)}
            placeholder="Nombre del niño o niña"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuántos años tiene?</label>
          <div className="grid grid-cols-6 gap-2">
            {[3,4,5,6,7,8].map(age => (
              <button
                key={age}
                onClick={() => setChildAge(age)}
                className={`py-3 rounded-xl text-lg font-semibold border-2 transition-all ${
                  childAge === age
                    ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => { if (childName && childAge) setStep('profile') }}
        disabled={!childName || !childAge}
        className="mt-6 bg-[#2D6A4F] text-white font-semibold px-6 py-4 rounded-2xl w-full disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  )

  if (step === 'profile') {
    const q = PROFILE_QUESTIONS[qIndex]
    return (
      <div className="min-h-screen bg-white flex flex-col p-6">
        <div className="mt-6 mb-2">
          <div className="flex gap-1 mb-6">
            {PROFILE_QUESTIONS.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= qIndex ? 'bg-[#2D6A4F]' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Test de perfil sensorial · {qIndex + 1} de {PROFILE_QUESTIONS.length}</p>
          <h2 className="text-xl font-bold text-gray-900 leading-snug">{q.q}</h2>
        </div>
        <div className="flex-1 mt-6 space-y-3">
          {q.a.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.profile as SensoryProfile)}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-[#2D6A4F] hover:bg-[#E8F5E9] transition-all"
            >
              <span className="text-gray-800">{opt.text}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">No hay respuestas correctas · Solo descriptivas</p>
      </div>
    )
  }

  if (step === 'ready') {
    const profile = getTopProfile()
    const p = PROFILES[profile]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: p.bg }}>
        <div className="text-6xl mb-4">{p.icon}</div>
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: p.color }}>
          {childName} es {p.name}
        </h2>
        <p className="text-center text-gray-600 mb-6 max-w-xs">{p.description}</p>
        <div className="bg-white rounded-2xl p-5 w-full max-w-sm mb-8 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-3">Tu perfil del curso incluye:</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Adaptaciones específicas en cada postura</li>
            <li>✓ Tips personalizados para {childName} cada semana</li>
            <li>✓ Micro-prácticas diseñadas para su perfil</li>
            <li>✓ Módulos de IS explicados desde su sistema</li>
          </ul>
        </div>
        <button
          onClick={finish}
          className="text-white font-semibold px-8 py-4 rounded-2xl w-full max-w-sm text-lg"
          style={{ backgroundColor: p.color }}
        >
          Comenzar con {childName} 🌱
        </button>
        <button
          onClick={() => { setStep('profile'); setQIndex(0); setAnswers([]) }}
          className="mt-3 text-gray-400 text-sm underline"
        >
          Repetir el test
        </button>
      </div>
    )
  }

  return null
}
