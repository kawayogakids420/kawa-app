'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'

type Step = 'nombre' | 'edad' | 'perfil' | 'usuario' | 'bienvenida' | 'test'

const PERFILES: { id: SensoryProfile; emoji: string; titulo: string; desc: string; color: string; bg: string }[] = [
  { id:'sensible',      emoji:'🌸', titulo:'Muy sensible',           desc:'Se incomoda con ruidos, texturas o cambios. Necesita calma y predecibilidad.', color:'#9C27B0', bg:'#F3E5F5' },
  { id:'buscador',      emoji:'⚡', titulo:'Buscador de sensaciones', desc:'Siempre en movimiento, busca estímulos fuertes. Necesita canalizarlo.',        color:'#E65100', bg:'#FFF3E0' },
  { id:'bajo_registro', emoji:'🌙', titulo:'Bajo registro',           desc:'Parece no notar lo que pasa a su alrededor. Necesita estímulos más intensos.', color:'#1565C0', bg:'#E3F2FD' },
  { id:'motor',         emoji:'🧩', titulo:'Dificultad motora',       desc:'Le cuesta coordinar movimientos o aprender actividades físicas nuevas.',       color:'#2E7D32', bg:'#E8F5E9' },
]

const EDADES = [
  { label:'3–4 años', value:3 },
  { label:'5–6 años', value:5 },
  { label:'7–8 años', value:7 },
]

const STEP_GRADIENTS: Record<Step, string> = {
  nombre:    'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  edad:      'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  perfil:    'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  usuario:   'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  bienvenida:'linear-gradient(150deg,#D4E8A0 0%,#C8D890 40%,#E8D4A0 100%)',
  test:      'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
}

// ── TEST DE 45 PREGUNTAS ──────────────────────────────────────────────────────
const SECTIONS = [
  { id:'A', label:'Sensibilidad Táctil',      icon:'🧤', color:'#9C27B0' },
  { id:'B', label:'Movimiento y Equilibrio',  icon:'🌀', color:'#0277BD' },
  { id:'C', label:'Fuerza y Postura',         icon:'💪', color:'#6A1B9A' },
  { id:'D', label:'Sonidos y Audición',       icon:'👂', color:'#BF360C' },
  { id:'E', label:'Visión y Entorno',         icon:'👁️', color:'#1A237E' },
  { id:'F', label:'Coordinación',             icon:'🧩', color:'#4E342E' },
]

const QUESTIONS = [
  { section:'A', text:'Se queja de etiquetas de ropa o costuras de calcetines' },
  { section:'A', text:'Le molestan ciertas telas (áspera, lana, sintéticas)' },
  { section:'A', text:'Reacciona exageradamente cuando alguien lo toca por sorpresa' },
  { section:'A', text:'Evita actividades con texturas (barro, plastilina, arena)' },
  { section:'A', text:'Se incomoda con el baño, lavado de cabello o corte de uñas' },
  { section:'A', text:'Prefiere tocar a otros pero no le gusta que lo toquen' },
  { section:'A', text:'Parece no sentir cuando se golpea o raspa' },
  { section:'A', text:'No nota cuando tiene las manos o cara sucias' },
  { section:'A', text:'Busca tocar todo lo que ve, mete cosas a la boca' },
  { section:'A', text:'Necesita que lo abrazen o aprieten fuerte para calmarse' },
  { section:'A', text:'Parece tener un umbral de dolor muy alto' },
  { section:'B', text:'Le da mucho miedo subir a columpios o lugares altos' },
  { section:'B', text:'Se marea fácilmente en el carro o con movimientos circulares' },
  { section:'B', text:'Tiene miedo cuando le levantan los pies del piso' },
  { section:'B', text:'Se cae frecuentemente, tropieza o choca con personas' },
  { section:'B', text:'Tiene dificultad para sentarse quieto, se resbala de la silla' },
  { section:'B', text:'No le gusta intentar nuevas actividades físicas o deportes' },
  { section:'B', text:'Busca girarse, rodar o columpiarse todo el tiempo sin marearse' },
  { section:'B', text:'Le encanta correr, saltar, trepar sin parar' },
  { section:'B', text:'Siempre está moviéndose, parece que no puede quedarse quieto' },
  { section:'B', text:'Busca sensaciones de movimiento intensas que parecen riesgosas' },
  { section:'C', text:'Usa demasiada fuerza: rompe cosas, aprieta muy fuerte al abrazar' },
  { section:'C', text:'Camina de puntillas frecuentemente' },
  { section:'C', text:'Choca con muebles, marcos de puertas o personas sin querer' },
  { section:'C', text:'Necesita apoyarse en paredes o personas, se "derrite" en la silla' },
  { section:'C', text:'Le cuesta tareas que requieren fuerza controlada (escribir, dibujar)' },
  { section:'C', text:'Parece no saber qué tan fuerte está haciendo fuerza' },
  { section:'D', text:'Se tapa los oídos ante ruidos cotidianos (secadora, aplausos)' },
  { section:'D', text:'Se pone muy nervioso en lugares ruidosos (fiestas, centros comerciales)' },
  { section:'D', text:'Le cuesta concentrarse cuando hay mucho ruido de fondo' },
  { section:'D', text:'Reacciona exageradamente a sonidos agudos o inesperados' },
  { section:'D', text:'Parece no escuchar cuando se le llama, sin problemas de audición' },
  { section:'D', text:'Siempre busca hacer ruido o escuchar música muy fuerte' },
  { section:'E', text:'Se distrae mucho con cualquier movimiento o estímulo visual' },
  { section:'E', text:'Le molestan los ambientes muy iluminados o la luz del sol' },
  { section:'E', text:'Evita el contacto visual o se siente incómodo mirando de frente' },
  { section:'E', text:'Se choca con objetos que están claramente visibles' },
  { section:'E', text:'Le cuesta encontrar cosas en entornos desordenados' },
  { section:'E', text:'Le encanta mirar luces, girar objetos o buscar patrones visuales' },
  { section:'F', text:'Le cuesta aprender actividades nuevas que involucren su cuerpo' },
  { section:'F', text:'Parece torpe para su edad: se tropieza, dificultad al vestirse' },
  { section:'F', text:'Le cuesta seguir secuencias de movimientos (danzas, deportes)' },
  { section:'F', text:'Tarda mucho más que otros en aprender a usar cubiertos, atar agujetas' },
  { section:'F', text:'Evita juegos que requieren coordinación (pelotas, bicicleta, trepar)' },
  { section:'F', text:'Le cuesta imitar movimientos o gestos que hace otra persona' },
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
const FREQ_COLORS = ['#E8F5E9','#FFF9C4','#FFE0B2','#FFCDD2']
const FREQ_TEXT   = ['#2D6A4F','#F57F17','#E65100','#B71C1C']

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
    sensible:      maxes.sensible      > 0 ? Math.round((scores.sensible      / maxes.sensible)      * 100) : 0,
    buscador:      maxes.buscador      > 0 ? Math.round((scores.buscador      / maxes.buscador)      * 100) : 0,
    bajo_registro: maxes.bajo_registro > 0 ? Math.round((scores.bajo_registro / maxes.bajo_registro) * 100) : 0,
    motor:         maxes.motor         > 0 ? Math.round((scores.motor         / maxes.motor)         * 100) : 0,
  }
}

function dominantProfile(pcts: Record<SensoryProfile, number>): SensoryProfile {
  return (Object.entries(pcts) as [SensoryProfile, number][]).sort((a,b) => b[1]-a[1])[0][0]
}

const STEP_ORDER: Step[] = ['nombre', 'edad', 'perfil', 'usuario', 'bienvenida']

export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding, addChild, setUserType } = useAppStore()

  const [step, setStep]       = useState<Step>('nombre')
  const [nombre, setNombre]   = useState('')
  const [genero, setGenero]   = useState<'male'|'female'|null>(null)
  const [edad, setEdad]       = useState<number|null>(null)
  const [perfil, setPerfil]   = useState<SensoryProfile|null>(null)
  const [usuario, setUsuario] = useState<'familia'|'profesional'|null>(null)

  // Test state
  const [answers, setAnswers]   = useState<number[]>(Array(QUESTIONS.length).fill(-1))
  const [secIdx, setSecIdx]     = useState(0)
  const [testResult, setTestResult] = useState<Record<SensoryProfile,number>|null>(null)

  const stepIdx  = STEP_ORDER.indexOf(step)
  const gradient = STEP_GRADIENTS[step]
  const textTitle = '#7A3520'
  const textSub   = 'rgba(140,70,50,0.65)'

  const finish = () => {
    if (!nombre || !edad || !perfil || !usuario) return
    completeOnboarding(nombre, edad, perfil)
    setUserType(usuario)
    addChild({ id:Date.now().toString(), name:nombre, age:edad, gender:genero??'male', profile:perfil, profilePcts:testResult })
    setStep('bienvenida')
  }

  // ── BIENVENIDA ──────────────────────────────────────────────────────────────
  if (step === 'bienvenida') {
    const profileData = perfil ? PROFILES[perfil] : null
    return (
      <div style={{ minHeight:'100vh', background:STEP_GRADIENTS.bienvenida, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.3)' }} />
        <div style={{ position:'absolute', bottom:-20, left:-20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign:'center', position:'relative', zIndex:1, width:'100%', maxWidth:340 }}>
          <div style={{ width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.9)', border:'3px solid rgba(255,255,255,0.98)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 6px 24px rgba(0,0,0,0.12)' }}>
            <img src="/images/kawa-personaje.png" alt="Kawa" style={{ width:'92%', height:'92%', objectFit:'contain' }} />
          </div>
          <h1 style={{ fontSize:26, fontWeight:600, color:'#3A2808', margin:'0 0 8px', fontFamily:"'Georgia',serif" }}>
            ¡Hola, {nombre}!
          </h1>
          <p style={{ fontSize:15, color:'rgba(80,50,20,0.75)', margin:'0 0 20px', lineHeight:1.5 }}>
            Kawa te da la bienvenida al viaje de los 5 guardianes
          </p>
          {profileData && (
            <div style={{ background:'rgba(255,255,255,0.55)', borderRadius:18, padding:'12px 20px', marginBottom:20, border:'1px solid rgba(255,255,255,0.7)' }}>
              <p style={{ fontSize:12, color:'rgba(80,50,20,0.65)', margin:'0 0 5px' }}>Perfil sensorial</p>
              <p style={{ fontSize:15, fontWeight:600, color:profileData.color, margin:0 }}>
                {profileData.icon} {profileData.name}
              </p>
            </div>
          )}
          <button onClick={() => router.replace('/home')} style={{ width:'100%', padding:'15px', borderRadius:16, background:'linear-gradient(135deg,#F4B880,#E89860)', border:'none', cursor:'pointer', color:'white', fontSize:16, fontWeight:600, boxShadow:'0 4px 20px rgba(220,160,100,0.4)' }}>
            Comenzar el viaje 🌱
          </button>
        </div>
      </div>
    )
  }

  // ── TEST DE 45 PREGUNTAS ───────────────────────────────────────────────────
  if (step === 'test') {
    const currentSec  = SECTIONS[secIdx]
    const sectionQs   = QUESTIONS.map((q,i)=>({...q,index:i})).filter(q=>q.section===currentSec?.id)
    const sectionDone = sectionQs.every(q=>answers[q.index]>=0)
    const totalAnswered = answers.filter(a=>a>=0).length

    const handleAnswer = (idx: number, val: number) => {
      const a = [...answers]; a[idx]=val; setAnswers(a)
    }

    const nextSec = () => {
      if (secIdx < SECTIONS.length-1) {
        setSecIdx(secIdx+1)
      } else {
        const pcts = calcProfilePcts(answers)
        const dom  = dominantProfile(pcts)
        setPerfil(dom)
        setTestResult(pcts)
        setStep('usuario')
      }
    }

    return (
      <div style={{ minHeight:'100vh', background:'#FFFAF6', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ background:STEP_GRADIENTS.test, padding:'48px 20px 18px', flexShrink:0, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-16, right:-16, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.28)' }} />
          <button onClick={() => { setStep('perfil'); setSecIdx(0) }} style={{ background:'none', border:'none', cursor:'pointer', color:textSub, fontSize:13, display:'flex', alignItems:'center', gap:6, padding:0, marginBottom:14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Volver
          </button>
          {/* Barra progreso secciones */}
          <div style={{ display:'flex', gap:4, marginBottom:10 }}>
            {SECTIONS.map((s,i) => (
              <div key={s.id} style={{ flex:1, height:4, borderRadius:2, background: i<=secIdx ? 'rgba(120,50,20,0.5)':'rgba(255,255,255,0.35)', transition:'background 0.3s' }} />
            ))}
          </div>
          <p style={{ fontSize:11, color:textSub, margin:'0 0 3px' }}>Sección {secIdx+1} de {SECTIONS.length} · {totalAnswered}/{QUESTIONS.length} respondidas</p>
          <h1 style={{ fontSize:20, fontWeight:600, color:textTitle, margin:0, fontFamily:"'Georgia',serif" }}>
            {currentSec.icon} {currentSec.label}
          </h1>
        </div>

        {/* Disclaimer — solo en sección 1 */}
        {secIdx === 0 && (
          <div style={{ background:'#FFF8E1', padding:'10px 20px', borderBottom:'1px solid #FDE68A', flexShrink:0 }}>
            <p style={{ fontSize:11, color:'#92400E', margin:0, lineHeight:1.5 }}>
              ⚠️ Este cuestionario es una herramienta de observación orientativa. No reemplaza una evaluación clínica profesional. Si tienes dudas sobre el desarrollo sensorial de tu niño/a, consulta con un terapeuta ocupacional especialista en Integración Sensorial.
            </p>
          </div>
        )}

        {/* Preguntas */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
          {sectionQs.map(q => (
            <div key={q.index} style={{ background:'white', borderRadius:14, padding:'12px 14px', marginBottom:10, border:`0.5px solid ${answers[q.index]>=0 ? '#F0E8E0':'#F0E8E0'}` }}>
              <p style={{ fontSize:13, color:'#2D1808', margin:'0 0 10px', lineHeight:1.5 }}>{q.text}</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
                {FREQ_LABELS.map((label, val) => (
                  <button key={val} onClick={() => handleAnswer(q.index, val)} style={{
                    padding:'7px 4px', borderRadius:10, border:`2px solid ${answers[q.index]===val ? FREQ_TEXT[val]:'#F0E8E0'}`,
                    background: answers[q.index]===val ? FREQ_COLORS[val]:'white',
                    cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3
                  }}>
                    <span style={{ fontSize:9, fontWeight:600, color: answers[q.index]===val ? FREQ_TEXT[val]:'#C4A090', textAlign:'center', lineHeight:1.3 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding:'12px 20px 28px', background:'#FFFAF6', borderTop:'0.5px solid #F0E8E0', flexShrink:0 }}>
          <button onClick={nextSec} disabled={!sectionDone} style={{
            width:'100%', padding:'14px', borderRadius:16,
            background: sectionDone ? 'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0',
            border:'none', cursor: sectionDone ? 'pointer':'default',
            color: sectionDone ? 'white':'#C4A090', fontSize:15, fontWeight:600, boxSizing:'border-box'
          }}>
            {secIdx < SECTIONS.length-1 ? 'Siguiente sección →' : 'Ver mi resultado →'}
          </button>
        </div>
      </div>
    )
  }

  // ── PASOS NORMALES ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <div style={{ background:gradient, padding:'48px 24px 24px', position:'relative', overflow:'hidden', flexShrink:0 }}>
        <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.3)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-10, left:8, width:55, height:55, borderRadius:'50%', background:'rgba(255,255,255,0.2)', pointerEvents:'none' }} />
        <div style={{ display:'flex', gap:6, marginBottom:20, position:'relative', zIndex:1 }}>
          {['nombre','edad','perfil','usuario'].map((s, i) => (
            <div key={s} style={{ flex:1, height:4, borderRadius:2, background: i<=stepIdx ? 'rgba(120,50,20,0.5)':'rgba(255,255,255,0.35)', transition:'background 0.3s' }} />
          ))}
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <p style={{ fontSize:11, color:textSub, margin:'0 0 4px', fontWeight:500 }}>Paso {stepIdx+1} de 4</p>
          <h1 style={{ fontSize:22, fontWeight:600, color:textTitle, margin:0, fontFamily:"'Georgia',serif", lineHeight:1.25 }}>
            {step==='nombre'  && 'Cuéntanos sobre tu guardián/a'}
            {step==='edad'    && `¿Cuántos años tiene ${nombre || 'el niño/a'}?`}
            {step==='perfil'  && `¿Cómo reacciona ${nombre || 'el niño/a'} ante el mundo?`}
            {step==='usuario' && '¿Cómo usarás la app?'}
          </h1>
        </div>
      </div>

      <div style={{ flex:1, background:'#FFFAF6', padding:'24px 20px', display:'flex', flexDirection:'column', gap:12, overflowY:'auto' }}>

        {/* PASO 1: NOMBRE + GÉNERO */}
        {step==='nombre' && (
          <>
            <div style={{ background:'white', borderRadius:16, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
              <p style={{ fontSize:11, color:'#C4A090', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Nombre del niño/a</p>
              <input type="text" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Escribe su nombre..." autoFocus
                style={{ width:'100%', border:'none', outline:'none', fontSize:18, fontWeight:500, color:'#2D1808', background:'transparent', fontFamily:"'Georgia',serif", boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {([['female','👧','Niña'],['male','👦','Niño']] as const).map(([g,emoji,label]) => (
                <button key={g} onClick={()=>setGenero(g)} style={{ padding:'18px 12px', borderRadius:16, cursor:'pointer', border:`2px solid ${genero===g?'#C4735A':'#F0E8E0'}`, background:genero===g?'#FFF8F4':'white', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:36 }}>{emoji}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:genero===g?'#C4735A':'#9CA3AF' }}>{label}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop:'auto', paddingTop:8 }}>
              <button onClick={()=>setStep('edad')} disabled={!nombre.trim()||!genero}
                style={{ width:'100%', padding:'14px', borderRadius:16, background:nombre.trim()&&genero?'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0', border:'none', cursor:nombre.trim()&&genero?'pointer':'default', color:nombre.trim()&&genero?'white':'#C4A090', fontSize:15, fontWeight:600 }}>
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* PASO 2: EDAD */}
        {step==='edad' && (
          <>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {EDADES.map(e => (
                <button key={e.value} onClick={()=>setEdad(e.value)} style={{ padding:'18px 20px', borderRadius:16, cursor:'pointer', border:`2px solid ${edad===e.value?'#C4735A':'#F0E8E0'}`, background:edad===e.value?'#FFF8F4':'white', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:15, fontWeight:500, color:edad===e.value?'#C4735A':'#2D1808' }}>{e.label}</span>
                  {edad===e.value && <span style={{ color:'#C4735A', fontSize:18 }}>✓</span>}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', gap:10, marginTop:'auto', paddingTop:8 }}>
              <button onClick={()=>setStep('nombre')} style={{ flex:1, padding:'14px', borderRadius:16, background:'white', border:'1px solid #F0E8E0', color:'#C4A090', fontSize:14, cursor:'pointer' }}>← Atrás</button>
              <button onClick={()=>setStep('perfil')} disabled={!edad}
                style={{ flex:2, padding:'14px', borderRadius:16, background:edad?'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0', border:'none', cursor:edad?'pointer':'default', color:edad?'white':'#C4A090', fontSize:15, fontWeight:600 }}>
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* PASO 3: PERFIL SENSORIAL */}
        {step==='perfil' && (
          <>
            <p style={{ fontSize:12, color:'#C4A090', margin:0, lineHeight:1.6 }}>
              Elige el que mejor describe a {nombre}. Puedes hacer el test completo si no estás seguro/a.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {PERFILES.map(p => (
                <button key={p.id} onClick={()=>setPerfil(p.id)} style={{ padding:'14px 16px', borderRadius:16, cursor:'pointer', border:`2px solid ${perfil===p.id?p.color:'#F0E8E0'}`, background:perfil===p.id?p.bg:'white', display:'flex', alignItems:'flex-start', gap:12, textAlign:'left' }}>
                  <span style={{ fontSize:28, flexShrink:0, marginTop:2 }}>{p.emoji}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:perfil===p.id?p.color:'#2D1808', margin:'0 0 3px' }}>{p.titulo}</p>
                    <p style={{ fontSize:11, color:perfil===p.id?p.color:'#C4A090', margin:0, lineHeight:1.5, opacity:0.85 }}>{p.desc}</p>
                  </div>
                  {perfil===p.id && <span style={{ color:p.color, fontSize:16, flexShrink:0, marginTop:2 }}>✓</span>}
                </button>
              ))}
            </div>

            {/* Botón test completo */}
            <button onClick={()=>{ setStep('test'); setSecIdx(0); setAnswers(Array(QUESTIONS.length).fill(-1)) }}
              style={{ width:'100%', padding:'12px 16px', borderRadius:14, background:'white', border:'1.5px dashed #C4A090', cursor:'pointer', color:'#C4A090', fontSize:13, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxSizing:'border-box' }}>
              <span style={{ fontSize:16 }}>🔍</span>
              No estoy seguro/a → Hacer el test completo (45 preguntas)
            </button>

            <div style={{ display:'flex', gap:10, marginTop:'auto', paddingTop:8 }}>
              <button onClick={()=>setStep('edad')} style={{ flex:1, padding:'14px', borderRadius:16, background:'white', border:'1px solid #F0E8E0', color:'#C4A090', fontSize:14, cursor:'pointer' }}>← Atrás</button>
              <button onClick={()=>setStep('usuario')} disabled={!perfil}
                style={{ flex:2, padding:'14px', borderRadius:16, background:perfil?'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0', border:'none', cursor:perfil?'pointer':'default', color:perfil?'white':'#C4A090', fontSize:15, fontWeight:600 }}>
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* PASO 4: TIPO DE USUARIO */}
        {step==='usuario' && (
          <>
            {/* Resultado test si vienen del test */}
            {testResult && (
              <div style={{ background:'white', borderRadius:16, padding:'12px 14px', border:'0.5px solid #F0E8E0' }}>
                <p style={{ fontSize:11, color:'#C4A090', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>Resultado del test sensorial</p>
                {(Object.entries(testResult) as [SensoryProfile,number][]).sort((a,b)=>b[1]-a[1]).map(([key, val]) => {
                  const p = PROFILES[key]
                  return (
                    <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:14, flexShrink:0 }}>{p.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                          <span style={{ fontSize:11, color:'#2D1808', fontWeight:500 }}>{p.name}</span>
                          <span style={{ fontSize:11, color:'#C4A090' }}>{val}%</span>
                        </div>
                        <div style={{ height:5, background:'#F0E8E0', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${val}%`, background:p.color, borderRadius:3, transition:'width 0.5s' }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
                <p style={{ fontSize:10, color:'#C4A090', margin:'8px 0 0', lineHeight:1.5 }}>
                  ⚠️ Este resultado es orientativo. No reemplaza una evaluación clínica profesional.
                </p>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button onClick={()=>setUsuario('familia')} style={{ padding:'18px 16px', borderRadius:16, cursor:'pointer', border:`2px solid ${usuario==='familia'?'#C4735A':'#F0E8E0'}`, background:usuario==='familia'?'#FFF8F4':'white', display:'flex', alignItems:'flex-start', gap:14, textAlign:'left' }}>
                <span style={{ fontSize:32, flexShrink:0 }}>👨‍👩‍👧</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:usuario==='familia'?'#C4735A':'#2D1808', margin:'0 0 4px' }}>Soy familia o cuidador/a</p>
                  <p style={{ fontSize:12, color:'#C4A090', margin:0, lineHeight:1.5 }}>Quiero practicar Kawa en casa con actividades simples.</p>
                </div>
                {usuario==='familia' && <span style={{ color:'#C4735A', fontSize:18, flexShrink:0 }}>✓</span>}
              </button>
              <button onClick={()=>setUsuario('profesional')} style={{ padding:'18px 16px', borderRadius:16, cursor:'pointer', border:`2px solid ${usuario==='profesional'?'#2D6A4F':'#F0E8E0'}`, background:usuario==='profesional'?'#F0F9F4':'white', display:'flex', alignItems:'flex-start', gap:14, textAlign:'left' }}>
                <span style={{ fontSize:32, flexShrink:0 }}>🩺</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:usuario==='profesional'?'#2D6A4F':'#2D1808', margin:'0 0 4px' }}>Soy profesional de salud o educación</p>
                  <p style={{ fontSize:12, color:'#C4A090', margin:0, lineHeight:1.5 }}>Terapeuta, psicólogo/a, educador/a. Incluye protocolo clínico TO.</p>
                  <span style={{ display:'inline-block', marginTop:6, fontSize:10, padding:'2px 8px', borderRadius:20, background:'#E8F5E9', color:'#2D6A4F', fontWeight:600 }}>Incluye protocolo clínico TO</span>
                </div>
                {usuario==='profesional' && <span style={{ color:'#2D6A4F', fontSize:18, flexShrink:0 }}>✓</span>}
              </button>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:'auto', paddingTop:8 }}>
              <button onClick={()=>setStep('perfil')} style={{ flex:1, padding:'14px', borderRadius:16, background:'white', border:'1px solid #F0E8E0', color:'#C4A090', fontSize:14, cursor:'pointer' }}>← Atrás</button>
              <button onClick={finish} disabled={!usuario}
                style={{ flex:2, padding:'14px', borderRadius:16, background:usuario?'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0', border:'none', cursor:usuario?'pointer':'default', color:usuario?'white':'#C4A090', fontSize:15, fontWeight:600 }}>
                ¡Vamos, {nombre}! 🌱
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
