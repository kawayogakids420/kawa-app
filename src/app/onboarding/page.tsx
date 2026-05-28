'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'

type Step = 'welcome' | 'rol' | 'children_list' | 'add_child' | 'test_intro' | 'test' | 'result' | 'done'

// ─── TIPOS ────────────────────────────────────────────────────────────────────
interface Child {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  profile: SensoryProfile | null
  profilePcts: Record<SensoryProfile, number> | null
  answers: number[]
}

// ─── TEST: 6 SECCIONES, 45 PREGUNTAS ─────────────────────────────────────────
const SECTIONS = [
  { id: 'A', label: 'Sensibilidad Táctil', icon: '🧤', color: '#2D6A4F' },
  { id: 'B', label: 'Movimiento y Equilibrio', icon: '🌀', color: '#0277BD' },
  { id: 'C', label: 'Fuerza y Postura', icon: '💪', color: '#6A1B9A' },
  { id: 'D', label: 'Sonidos y Audición', icon: '👂', color: '#BF360C' },
  { id: 'E', label: 'Visión y Entorno', icon: '👁️', color: '#1A237E' },
  { id: 'F', label: 'Coordinación', icon: '🧩', color: '#4E342E' },
]

const QUESTIONS = [
  { section: 'A', text: 'Se queja de etiquetas de ropa o costuras de calcetines' },
  { section: 'A', text: 'Le molestan ciertas telas (áspera, lana, sintéticas)' },
  { section: 'A', text: 'Reacciona exageradamente cuando alguien lo toca por sorpresa' },
  { section: 'A', text: 'Evita actividades con texturas (barro, plastilina, arena)' },
  { section: 'A', text: 'Se incomoda con el baño, lavado de cabello o corte de uñas' },
  { section: 'A', text: 'Prefiere tocar a otros pero no le gusta que lo toquen' },
  { section: 'A', text: 'Parece no sentir cuando se golpea o raspa' },
  { section: 'A', text: 'No nota cuando tiene las manos o cara sucias' },
  { section: 'A', text: 'Busca tocar todo lo que ve, mete cosas a la boca' },
  { section: 'A', text: 'Necesita que lo abrazen o aprieten fuerte para calmarse' },
  { section: 'A', text: 'Parece tener un umbral de dolor muy alto' },
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
  { section: 'C', text: 'Usa demasiada fuerza: rompe cosas, aprieta muy fuerte al abrazar' },
  { section: 'C', text: 'Camina de puntillas frecuentemente' },
  { section: 'C', text: 'Choca con muebles, marcos de puertas o personas sin querer' },
  { section: 'C', text: 'Necesita apoyarse en paredes o personas, se "derrite" en la silla' },
  { section: 'C', text: 'Le cuesta tareas que requieren fuerza controlada (escribir, dibujar)' },
  { section: 'C', text: 'Parece no saber qué tan fuerte está haciendo fuerza' },
  { section: 'D', text: 'Se tapa los oídos ante ruidos cotidianos (secadora, aplausos)' },
  { section: 'D', text: 'Se pone muy nervioso en lugares ruidosos (fiestas, centros comerciales)' },
  { section: 'D', text: 'Le cuesta concentrarse cuando hay mucho ruido de fondo' },
  { section: 'D', text: 'Reacciona exageradamente a sonidos agudos o inesperados' },
  { section: 'D', text: 'Parece no escuchar cuando se le llama, sin problemas de audición' },
  { section: 'D', text: 'Siempre busca hacer ruido o escuchar música muy fuerte' },
  { section: 'E', text: 'Se distrae mucho con cualquier movimiento o estímulo visual' },
  { section: 'E', text: 'Le molestan los ambientes muy iluminados o la luz del sol' },
  { section: 'E', text: 'Evita el contacto visual o se siente incómodo mirando de frente' },
  { section: 'E', text: 'Se choca con objetos que están claramente visibles' },
  { section: 'E', text: 'Le cuesta encontrar cosas en entornos desordenados' },
  { section: 'E', text: 'Le encanta mirar luces, girar objetos o buscar patrones visuales' },
  { section: 'F', text: 'Le cuesta aprender actividades nuevas que involucren su cuerpo' },
  { section: 'F', text: 'Parece torpe para su edad: se tropieza, dificultad al vestirse' },
  { section: 'F', text: 'Le cuesta seguir secuencias de movimientos (danzas, deportes)' },
  { section: 'F', text: 'Tarda mucho más que otros en aprender a usar cubiertos, atar agujetas' },
  { section: 'F', text: 'Evita juegos que requieren coordinación (pelotas, bicicleta, trepar)' },
  { section: 'F', text: 'Le cuesta imitar movimientos o gestos que hace otra persona' },
]

const QUESTION_PROFILE_MAP: Record<number, Partial<Record<SensoryProfile, number>>> = {
  0:{sensible:3}, 1:{sensible:3}, 2:{sensible:3}, 3:{sensible:2},
  4:{sensible:2}, 5:{sensible:2}, 6:{bajo_registro:3}, 7:{bajo_registro:3},
  8:{buscador:3,bajo_registro:1}, 9:{buscador:2,bajo_registro:2}, 10:{bajo_registro:3},
  11:{sensible:3}, 12:{sensible:2}, 13:{sensible:3}, 14:{motor:2,bajo_registro:1},
  15:{motor:2,bajo_registro:1}, 16:{sensible:2}, 17:{buscador:3,bajo_registro:1},
  18:{buscador:3}, 19:{buscador:3}, 20:{buscador:3,bajo_registro:1},
  21:{buscador:2,bajo_registro:2}, 22:{buscador:1,bajo_registro:2},
  23:{bajo_registro:2,motor:1}, 24:{bajo_registro:3}, 25:{motor:3}, 26:{bajo_registro:2,motor:1},
  27:{sensible:3}, 28:{sensible:3}, 29:{sensible:2}, 30:{sensible:3},
  31:{bajo_registro:3}, 32:{buscador:2},
  33:{sensible:2}, 34:{sensible:3}, 35:{sensible:2},
  36:{motor:2,bajo_registro:1}, 37:{motor:2}, 38:{buscador:2,bajo_registro:1},
  39:{motor:3}, 40:{motor:3}, 41:{motor:3}, 42:{motor:3}, 43:{motor:2}, 44:{motor:3},
}

const FREQ_LABELS = ['Casi nunca', 'A veces', 'Seguido', 'Casi siempre']
const FREQ_COLORS = ['#E8F5E9', '#FFF9C4', '#FFE0B2', '#FFCDD2']
const FREQ_TEXT   = ['#2D6A4F', '#F57F17', '#E65100', '#B71C1C']

function calcProfilePcts(answers: number[]): Record<SensoryProfile, number> {
  const scores: Record<SensoryProfile, number> = { sensible:0, buscador:0, bajo_registro:0, motor:0 }
  const maxes:  Record<SensoryProfile, number> = { sensible:0, buscador:0, bajo_registro:0, motor:0 }
  answers.forEach((ans, i) => {
    const map = QUESTION_PROFILE_MAP[i]
    if (!map || ans < 0) return
    Object.entries(map).forEach(([p, w]) => {
      scores[p as SensoryProfile] += (ans / 3) * (w as number)
      maxes[p as SensoryProfile]  += (w as number)
    })
  })
  return {
    sensible:     maxes.sensible     > 0 ? Math.round((scores.sensible     / maxes.sensible)     * 100) : 0,
    buscador:     maxes.buscador     > 0 ? Math.round((scores.buscador     / maxes.buscador)     * 100) : 0,
    bajo_registro:maxes.bajo_registro> 0 ? Math.round((scores.bajo_registro/ maxes.bajo_registro)* 100) : 0,
    motor:        maxes.motor        > 0 ? Math.round((scores.motor        / maxes.motor)        * 100) : 0,
  }
}

function dominantProfile(pcts: Record<SensoryProfile, number>): SensoryProfile {
  return (Object.entries(pcts) as [SensoryProfile, number][])
    .sort((a,b) => b[1]-a[1])[0][0]
}

const levelText  = (p: number) => p>=70?'Muy presente':p>=45?'Presente':p>=20?'Algo presente':'Poco presente'
const levelColor = (p: number) => p>=70?'#B71C1C':p>=45?'#E65100':p>=20?'#F57F17':'#2D6A4F'

const PROFILE_ORDER: SensoryProfile[] = ['sensible','buscador','bajo_registro','motor']

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const completeOnboarding = useAppStore(s => s.completeOnboarding)
  const setUserType = useAppStore(s => s.setUserType)

  const [step, setStep]           = useState<Step>('welcome')
  const [children, setChildren]   = useState<Child[]>([])
  const [activeChild, setActive]  = useState<Child | null>(null)
  const [name, setName]           = useState('')
  const [age, setAge]             = useState<number|null>(null)
  const [gender, setGender]       = useState<'male'|'female'|null>(null)
  const [answers, setAnswers]     = useState<number[]>(Array(QUESTIONS.length).fill(-1))
  const [secIdx, setSecIdx]       = useState(0)

  const resetForm = () => { setName(''); setAge(null); setGender(null) }
  const resetTest = () => { setAnswers(Array(QUESTIONS.length).fill(-1)); setSecIdx(0) }

  const currentSec    = SECTIONS[secIdx]
  const sectionQs     = QUESTIONS.map((q,i)=>({...q,index:i})).filter(q=>q.section===currentSec?.id)
  const sectionDone   = sectionQs.every(q=>answers[q.index]>=0)
  const totalAnswered  = answers.filter(a=>a>=0).length

  const handleAnswer = (idx: number, val: number) => {
    const a = [...answers]; a[idx]=val; setAnswers(a)
  }

  const nextSec = () => {
    if (secIdx < SECTIONS.length-1) { setSecIdx(secIdx+1) }
    else {
      const pcts = calcProfilePcts(answers)
      const dom  = dominantProfile(pcts)
      const updated: Child = { ...activeChild!, profile:dom, profilePcts:pcts, answers:[...answers] }
      setChildren(prev => {
        const exists = prev.find(c=>c.id===updated.id)
        return exists ? prev.map(c=>c.id===updated.id?updated:c) : [...prev, updated]
      })
      setActive(updated)
      setStep('result')
    }
  }

  const finishAll = () => {
    const first = children[0]
    if (!first || !first.profile) return
    completeOnboarding(first.name, first.age, first.profile)
    router.replace('/home')
  }

  const pro    = (child: Child) => child.gender==='female' ? 'ella' : 'él'
  const proPos = (child: Child) => child.gender==='female' ? 'su' : 'su'
  const artDef = (child: Child) => child.gender==='female' ? 'la' : 'el'

  // ════════════════════════════════════════════════════════════════════════════
  // WELCOME
  if (step==='welcome') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden"
      style={{background:'linear-gradient(160deg,#1B4332 0%,#2D6A4F 50%,#1A237E 100%)'}}>
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_,i)=>(
          <div key={i} className="absolute rounded-full bg-white"
            style={{width:Math.random()*3+1,height:Math.random()*3+1,
              left:`${Math.random()*100}%`,top:`${Math.random()*70}%`,
              opacity:Math.random()*0.6+0.2}}/>
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
        <div className="text-7xl mb-5">🌱</div>
        <h1 className="text-center font-bold leading-tight mb-3"
          style={{fontFamily:"'Livvic','Georgia',serif",fontSize:30,letterSpacing:'-0.5px'}}>
          Kawa y los Guardianes<br/>del Equilibrio
        </h1>
        <p className="text-center text-green-100 mb-1" style={{fontFamily:"'Nunito',system-ui,sans-serif",fontSize:15}}>
          Un viaje para crecer y descubrir 5 mundos,
        </p>
        <p className="text-center italic text-green-200 mb-10" style={{fontFamily:"'Nunito',system-ui,sans-serif",fontSize:15}}>
          que te llevarán de vuelta a ti.
        </p>
        <button onClick={()=>setStep('rol')}
          className="bg-white font-bold px-8 py-4 rounded-2xl text-lg w-full mb-3"
          style={{color:'#2D6A4F',fontFamily:"'Livvic',system-ui,sans-serif"}}>
          Comenzar el viaje
        </button>
        <p className="text-green-300 text-xs text-center">
          Para familias y profesionales · Integración Sensorial
        </p>
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════════════════════
  // SELECCIÓN DE ROL
  if (step==='rol') return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="mt-10 mb-8">
        <div className="text-4xl mb-3">👋</div>
        <h2 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
          ¿Cómo vas a usar Kawa?
        </h2>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          Esto nos ayuda a mostrarte el contenido más útil para ti.
          Podrás cambiarlo después desde tu perfil.
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {/* Opción familia */}
        <button
          onClick={() => { setUserType('familia'); setStep('children_list') }}
          className="w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all hover:border-[#2D6A4F]"
          style={{ borderColor: '#E5E7EB' }}>
          <div className="text-4xl flex-shrink-0">👨‍👩‍👧</div>
          <div>
            <p className="font-semibold text-gray-900 text-base mb-1">
              Soy padre, madre o cuidador/a
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Quiero practicar Kawa en casa con mi hijo o hija. Busco actividades
              simples y acompañamiento cotidiano.
            </p>
          </div>
        </button>

        {/* Opción profesional */}
        <button
          onClick={() => { setUserType('profesional'); setStep('children_list') }}
          className="w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all hover:border-[#1D9E75]"
          style={{ borderColor: '#E5E7EB' }}>
          <div className="text-4xl flex-shrink-0">🩺</div>
          <div>
            <p className="font-semibold text-gray-900 text-base mb-1">
              Soy profesional de la salud o educación
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Soy terapeuta ocupacional, psicólogo/a, docente u otro profesional.
              Necesito protocolos clínicos, base científica y herramientas de registro.
            </p>
            <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: '#E1F5EE', color: '#085041' }}>
              Incluye protocolo clínico TO por guardián
            </span>
          </div>
        </button>
      </div>

      <button onClick={() => setStep('welcome')}
        className="mt-6 text-gray-400 text-sm text-center">
        ← Volver
      </button>
    </div>
  )

  // ════════════════════════════════════════════════════════════════════════════
  // LISTA DE NIÑOS
  if (step==='children_list') return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-5 pb-28">
      <div className="mt-10 mb-6">
        <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
        <h2 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
          {children.length===0 ? '¿Quiénes van a practicar Kawa?' : 'Tus niños'}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          {children.length===0
            ? 'Puedes agregar uno o varios niños. Cada uno tendrá su propio perfil sensorial.'
            : 'Puedes agregar más niños o comenzar el viaje.'}
        </p>
      </div>

      {children.length > 0 && (
        <div className="space-y-3 mb-5">
          {children.map(child => {
            const dom = child.profile ? PROFILES[child.profile] : null
            return (
              <div key={child.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="text-3xl">{child.gender==='female' ? '👧' : '👦'}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{child.name}</p>
                  <p className="text-xs text-gray-400">{child.age} años</p>
                  {dom && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium"
                      style={{background:dom.bg,color:dom.color}}>
                      {dom.icon} {dom.name}
                    </span>
                  )}
                </div>
                {child.profile ? (
                  <span className="text-green-500 text-lg">✓</span>
                ) : (
                  <button onClick={()=>{setActive(child);resetTest();setStep('test_intro')}}
                    className="text-xs px-3 py-1.5 rounded-lg text-white"
                    style={{background:'#0277BD'}}>
                    Test
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <button onClick={()=>{resetForm();setStep('add_child')}}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-[#2D6A4F] text-[#2D6A4F] font-medium mb-4">
        <span className="text-xl">+</span>
        <span>{children.length===0 ? 'Agregar niño o niña' : 'Agregar otro niño o niña'}</span>
      </button>

      {children.some(c=>c.profile) && (
        <button onClick={finishAll}
          className="w-full py-4 rounded-2xl text-white font-semibold text-lg"
          style={{background:'#2D6A4F',fontFamily:"'Livvic',system-ui,sans-serif"}}>
          Comenzar el viaje 🌱
        </button>
      )}
    </div>
  )

  // ════════════════════════════════════════════════════════════════════════════
  // AGREGAR NIÑO
  if (step==='add_child') return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <button onClick={()=>setStep('children_list')} className="text-gray-400 text-sm mt-8 mb-4 flex items-center gap-1">
        ← Volver
      </button>
      <div className="mb-6">
        <div className="text-4xl mb-3">🌱</div>
        <h2 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
          Nuevo niño o niña
        </h2>
        <p className="text-gray-500 text-sm mt-1">Completa la información básica</p>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo se llama?</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)}
            placeholder="Nombre del niño o niña"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">¿Es niño o niña?</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {val:'male'   as const, label:'Niño',  emoji:'👦', color:'#0277BD', bg:'#E1F5FE'},
              {val:'female' as const, label:'Niña',  emoji:'👧', color:'#C2185B', bg:'#FCE4EC'},
            ].map(opt=>(
              <button key={opt.val} onClick={()=>setGender(opt.val)}
                className="flex flex-col items-center py-5 rounded-2xl border-2 transition-all"
                style={{
                  borderColor: gender===opt.val ? opt.color : '#E5E7EB',
                  background:  gender===opt.val ? opt.bg : 'white',
                }}>
                <span className="text-4xl mb-2">{opt.emoji}</span>
                <span className="font-semibold text-sm" style={{color:gender===opt.val?opt.color:'#6B7280'}}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuántos años tiene?</label>
          <div className="grid grid-cols-6 gap-2">
            {[3,4,5,6,7,8].map(a=>(
              <button key={a} onClick={()=>setAge(a)}
                className={`py-3 rounded-xl text-lg font-semibold border-2 transition-all ${
                  age===a?'bg-[#2D6A4F] border-[#2D6A4F] text-white':'bg-white border-gray-200 text-gray-700'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={()=>{
          if(!name||!age||!gender) return
          const newChild:Child = {
            id: Date.now().toString(),
            name, age, gender,
            profile:null, profilePcts:null,
            answers:Array(QUESTIONS.length).fill(-1)
          }
          setChildren(prev=>[...prev, newChild])
          setActive(newChild)
          resetTest()
          setStep('test_intro')
        }}
        disabled={!name||!age||!gender}
        className="mt-6 bg-[#2D6A4F] text-white font-semibold px-6 py-4 rounded-2xl w-full disabled:opacity-40"
        style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
        Continuar al test sensorial
      </button>
    </div>
  )

  // ════════════════════════════════════════════════════════════════════════════
  // TEST INTRO
  if (step==='test_intro' && activeChild) return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <button onClick={()=>setStep('children_list')} className="text-gray-400 text-sm mt-8 mb-4">← Volver</button>
      <div className="mb-6">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900" style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
          Test sensorial de {activeChild.name}
        </h2>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          Observa el comportamiento habitual de {artDef(activeChild)} {activeChild.name} durante los últimos 3 meses.
          Este test no es un diagnóstico clínico.
        </p>
      </div>

      <div className="bg-[#E8F5E9] rounded-2xl p-4 mb-5">
        <p className="text-sm font-semibold text-[#2D6A4F] mb-2">¿Cómo usarlo?</p>
        <ul className="space-y-1.5 text-sm text-[#1B5E20]">
          <li>• Responde según lo que observas habitualmente</li>
          <li>• No hay respuestas correctas ni incorrectas</li>
          <li>• Al final verás el mapa sensorial completo</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {SECTIONS.map(sec=>(
          <div key={sec.id} className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50">
            <span className="text-lg">{sec.icon}</span>
            <span className="text-xs text-gray-600">{sec.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <button onClick={()=>setStep('test')}
          className="bg-[#2D6A4F] text-white font-semibold px-6 py-4 rounded-2xl w-full"
          style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
          Comenzar — 45 preguntas
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">Aproximadamente 5–8 minutos</p>
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════════════════════
  // TEST
  if (step==='test' && activeChild) {
    const sec = SECTIONS[secIdx]
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
        <div className="bg-white px-5 pt-10 pb-4 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              {activeChild.name} · Sección {secIdx+1}/{SECTIONS.length}
            </span>
            <span className="text-sm text-gray-400">{totalAnswered}/45</span>
          </div>
          <div className="flex gap-1 mb-3">
            {SECTIONS.map((s,i)=>(
              <div key={s.id} className="flex-1 h-1.5 rounded-full transition-all"
                style={{background:i<secIdx?sec.color:i===secIdx?sec.color+'AA':'#E5E7EB'}}/>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{sec.icon}</span>
            <p className="font-semibold text-gray-900" style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
              {sec.label}
            </p>
          </div>
        </div>

        <div className="flex-1 px-5 py-4 space-y-3">
          {sectionQs.map(q=>(
            <div key={q.index} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-800 font-medium leading-relaxed mb-3">{q.text}</p>
              <div className="grid grid-cols-2 gap-2">
                {FREQ_LABELS.map((label,val)=>(
                  <button key={val} onClick={()=>handleAnswer(q.index,val)}
                    className="py-2.5 px-3 rounded-xl text-xs font-medium transition-all border-2 text-left"
                    style={{
                      background:     answers[q.index]===val ? FREQ_COLORS[val] : 'white',
                      borderColor:    answers[q.index]===val ? FREQ_TEXT[val]   : '#E5E7EB',
                      color:          answers[q.index]===val ? FREQ_TEXT[val]   : '#6B7280',
                    }}>
                    {['😌 ','🙂 ','😕 ','😓 '][val]}{label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[430px] mx-auto">
          <button onClick={nextSec} disabled={!sectionDone}
            className="w-full py-4 rounded-2xl font-semibold text-white disabled:opacity-40 transition-all"
            style={{background:sectionDone?sec.color:'#9CA3AF',fontFamily:"'Livvic',system-ui,sans-serif"}}>
            {secIdx<SECTIONS.length-1 ? 'Siguiente sección →' : 'Ver perfil sensorial'}
          </button>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RESULTADO
  if (step==='result' && activeChild?.profile && activeChild?.profilePcts) {
    const pcts = activeChild.profilePcts
    const dom  = activeChild.profile
    const domP = PROFILES[dom]

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
        <div className="px-5 pt-12 pb-6 text-white text-center"
          style={{background:`linear-gradient(160deg,${domP.color}DD,${domP.color})`}}>
          <div className="text-5xl mb-2">{activeChild.gender==='female'?'👧':'👦'}</div>
          <p className="text-sm opacity-80 mb-1">Perfil predominante de {activeChild.name}</p>
          <h2 className="text-2xl font-bold mb-2"
            style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
            {domP.icon} {domP.name}
          </h2>
          <p className="text-sm opacity-90 leading-relaxed max-w-xs mx-auto">
            {domP.description}
          </p>
        </div>

        <div className="px-5 mt-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-amber-800 mb-1">💡 Importante entender</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Los niños pueden tener características de varios perfiles — uno para el tacto, otro para el movimiento.
              Esta combinación única es lo que hace especial a {activeChild.name}.
              El curso trabaja todos los perfiles al mismo tiempo.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <p className="font-semibold text-gray-900 mb-1"
              style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
              Mapa sensorial de {activeChild.name}
            </p>
            <p className="text-xs text-gray-400 mb-4">Cuánto está presente cada perfil</p>
            <div className="space-y-4">
              {PROFILE_ORDER.map(pk=>{
                const p   = PROFILES[pk]
                const pct = pcts[pk]
                const isDom = pk===dom
                return (
                  <div key={pk}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.icon}</span>
                        <span className={`text-sm font-medium ${isDom?'text-gray-900':'text-gray-700'}`}>
                          {p.name}
                          {isDom && <span className="ml-2 text-xs px-2 py-0.5 rounded-full text-white"
                            style={{background:p.color}}>Principal</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{color:levelColor(pct)}}>
                          {levelText(pct)}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{width:`${pct}%`,background:p.color}}/>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{p.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <p className="font-semibold text-gray-900 mb-3"
              style={{fontFamily:"'Livvic',system-ui,sans-serif"}}>
              Cómo Kawa acompaña a {activeChild.name}
            </p>
            <ul className="space-y-2.5">
              {[
                `Posturas adaptadas al perfil ${domP.name} en cada semana`,
                `Micro-prácticas para ${pro(activeChild)} según su sistema sensorial único`,
                `Módulos IS que te explican por qué ${pro(activeChild)} hace lo que hace`,
                `Adaptaciones para todos ${proPos(activeChild)}s perfiles detectados`,
              ].map((item,i)=>(
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{background:domP.color}}>
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              🔍 Este test es una herramienta de observación, no un diagnóstico clínico.
              Si tienes preocupaciones sobre el desarrollo de {activeChild.name},
              consulta con un terapeuta ocupacional especialista en Integración Sensorial.
            </p>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-[430px] mx-auto space-y-2">
          <button onClick={()=>{resetForm();setStep('add_child')}}
            className="w-full py-3 rounded-2xl border-2 font-semibold text-sm"
            style={{borderColor:domP.color,color:domP.color}}>
            + Agregar otro niño o niña
          </button>
          <button onClick={finishAll}
            className="w-full py-4 rounded-2xl font-semibold text-white text-base"
            style={{background:domP.color,fontFamily:"'Livvic',system-ui,sans-serif"}}>
            Comenzar el viaje de {children.length>1?'mis niños':activeChild.name} 🌱
          </button>
          <button onClick={()=>{resetTest();setStep('test')}}
            className="w-full text-gray-400 text-xs underline py-1">
            Repetir el test de {activeChild.name}
          </button>
        </div>
      </div>
    )
  }

  return null
}
