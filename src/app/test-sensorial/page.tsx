'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'

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

const PROFILE_MAP: Record<number, Partial<Record<SensoryProfile, number>>> = {
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

function calcPcts(answers: number[]): Record<SensoryProfile, number> {
  const scores: Record<SensoryProfile, number> = { sensible:0, buscador:0, bajo_registro:0, motor:0 }
  const maxes:  Record<SensoryProfile, number> = { sensible:0, buscador:0, bajo_registro:0, motor:0 }
  answers.forEach((ans, i) => {
    const map = PROFILE_MAP[i]
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

export default function TestSensorialPage() {
  const router = useRouter()
  const { children, activeChildId, setActiveChild } = useAppStore()
  const activeChild = children.find(c => c.id === activeChildId) ?? children[0] ?? null

  const [secIdx,   setSecIdx]   = useState(0)
  const [answers,  setAnswers]  = useState<number[]>(Array(QUESTIONS.length).fill(-1))
  const [result,   setResult]   = useState<Record<SensoryProfile,number>|null>(null)

  const currentSec    = SECTIONS[secIdx]
  const sectionQs     = QUESTIONS.map((q,i) => ({...q, index:i})).filter(q => q.section === currentSec?.id)
  const sectionDone   = sectionQs.every(q => answers[q.index] >= 0)
  const totalAnswered = answers.filter(a => a >= 0).length

  const handleAnswer = (idx: number, val: number) => {
    const a = [...answers]; a[idx] = val; setAnswers(a)
  }

  const nextSec = () => {
    if (secIdx < SECTIONS.length - 1) {
      setSecIdx(secIdx + 1)
      window.scrollTo(0, 0)
    } else {
      setResult(calcPcts(answers))
      window.scrollTo(0, 0)
    }
  }

  const dominant = result
    ? (Object.entries(result) as [SensoryProfile, number][]).sort((a,b) => b[1]-a[1])[0][0]
    : null

  // ── RESULTADO ────────────────────────────────────────────────────────────────
  if (result && dominant) {
    const dom = PROFILES[dominant]
    return (
      <div style={{ minHeight:'100vh', background:'#FFFAF6', paddingBottom:40 }}>
        <div style={{ background:'linear-gradient(150deg,#FFE9A0,#FFCDB8,#F5B8C8)', padding:'48px 20px 24px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-16, right:-16, width:65, height:65, borderRadius:'50%', background:'rgba(255,255,255,0.28)', pointerEvents:'none' }} />
          <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(120,60,40,0.65)', fontSize:13, display:'flex', alignItems:'center', gap:6, padding:'0 0 14px', fontWeight:500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Volver al perfil
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(255,255,255,0.92)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 14px rgba(0,0,0,0.12)' }}>
              <img src="/images/kawa-personaje.png" alt="Kawa" style={{ width:'90%', height:'90%', objectFit:'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:600, color:'#7A3520', margin:0, fontFamily:"'Georgia',serif" }}>
                Resultado del test sensorial
              </h1>
              {activeChild && <p style={{ fontSize:12, color:'rgba(120,60,40,0.65)', margin:0 }}>{activeChild.name}</p>}
            </div>
          </div>
        </div>

        <div style={{ padding:'16px 16px 0', display:'flex', flexDirection:'column', gap:10 }}>

          {/* Disclaimer */}
          <div style={{ background:'#FFF8E1', borderRadius:14, padding:'10px 14px', border:'1px solid #FDE68A' }}>
            <p style={{ fontSize:11, color:'#92400E', margin:0, lineHeight:1.5 }}>
              ⚠️ Este cuestionario es una herramienta de observación orientativa. No reemplaza una evaluación clínica profesional. Si tienes dudas sobre el desarrollo sensorial de tu niño/a, consulta con un terapeuta ocupacional especialista en Integración Sensorial.
            </p>
          </div>

          {/* Perfil dominante */}
          <div style={{ background:'white', borderRadius:18, padding:'16px', border:`2px solid ${dom.color}40` }}>
            <p style={{ fontSize:11, color:'#C4A090', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>Perfil predominante</p>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:`${dom.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>
                {dom.icon}
              </div>
              <div>
                <p style={{ fontSize:17, fontWeight:700, color:dom.color, margin:'0 0 3px' }}>{dom.name}</p>
                <p style={{ fontSize:12, color:'#4A3020', margin:0, lineHeight:1.5 }}>{dom.description}</p>
              </div>
            </div>
          </div>

          {/* Mapa sensorial */}
          <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
            <p style={{ fontSize:12, fontWeight:600, color:'#2D1808', margin:'0 0 12px' }}>Mapa sensorial completo</p>
            {(Object.entries(result) as [SensoryProfile,number][]).sort((a,b) => b[1]-a[1]).map(([key, val]) => {
              const p = PROFILES[key]
              return (
                <div key={key} style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <span style={{ fontSize:16 }}>{p.icon}</span>
                      <span style={{ fontSize:12, fontWeight:500, color:'#2D1808' }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:600, color:p.color }}>{val}%</span>
                  </div>
                  <div style={{ height:7, background:'#F5F0E8', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${val}%`, background:p.color, borderRadius:4, transition:'width 0.6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Qué hacer con este resultado */}
          <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
            <p style={{ fontSize:12, fontWeight:600, color:'#2D1808', margin:'0 0 10px' }}>¿Qué hacer con este resultado?</p>
            {[
              { icon:'🧘', text:'Las clases de Kawa ya están adaptadas para este perfil. La app usa este resultado para personalizar los consejos en cada postura.' },
              { icon:'💡', text:'En la sección "Aprende" encontrarás micro-prácticas específicas para el perfil de tu niño/a.' },
              { icon:'🩺', text:'Si el porcentaje en cualquier área supera el 70%, considera consultar con un terapeuta ocupacional para una evaluación formal.' },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', gap:10, marginBottom:9, alignItems:'flex-start' }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                <p style={{ fontSize:12, color:'#4A3020', margin:0, lineHeight:1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>

          <button onClick={() => router.push('/perfil')} style={{ width:'100%', padding:'14px', borderRadius:14, background:'linear-gradient(135deg,#F4B880,#E89860)', border:'none', cursor:'pointer', color:'white', fontSize:14, fontWeight:600, boxSizing:'border-box' }}>
            Guardar y volver al perfil →
          </button>
        </div>
      </div>
    )
  }

  // ── PREGUNTAS ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#FFFAF6', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(150deg,#FFE9A0,#FFCDB8,#F5B8C8)', padding:'48px 20px 18px', flexShrink:0, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-16, right:-16, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.28)', pointerEvents:'none' }} />
        <button onClick={() => secIdx > 0 ? setSecIdx(secIdx-1) : router.back()} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(120,60,40,0.65)', fontSize:13, display:'flex', alignItems:'center', gap:6, padding:'0 0 14px', fontWeight:500 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          {secIdx > 0 ? 'Sección anterior' : 'Volver'}
        </button>

        {/* Barra progreso secciones */}
        <div style={{ display:'flex', gap:4, marginBottom:10 }}>
          {SECTIONS.map((s,i) => (
            <div key={s.id} style={{ flex:1, height:4, borderRadius:2, background: i<=secIdx ? 'rgba(120,50,20,0.5)':'rgba(255,255,255,0.35)', transition:'background 0.3s' }} />
          ))}
        </div>
        <p style={{ fontSize:11, color:'rgba(140,70,50,0.65)', margin:'0 0 3px' }}>
          Sección {secIdx+1} de {SECTIONS.length} · {totalAnswered}/{QUESTIONS.length} respondidas
        </p>
        <h1 style={{ fontSize:20, fontWeight:600, color:'#7A3520', margin:0, fontFamily:"'Georgia',serif" }}>
          {currentSec.icon} {currentSec.label}
        </h1>
        {activeChild && (
          <p style={{ fontSize:11, color:'rgba(140,70,50,0.55)', margin:'4px 0 0' }}>Evaluando a {activeChild.name}</p>
        )}
      </div>

      {/* Disclaimer sección 1 */}
      {secIdx === 0 && (
        <div style={{ background:'#FFF8E1', padding:'10px 20px', borderBottom:'1px solid #FDE68A', flexShrink:0 }}>
          <p style={{ fontSize:11, color:'#92400E', margin:0, lineHeight:1.5 }}>
            ⚠️ Herramienta orientativa — no reemplaza evaluación clínica. Marca la frecuencia con que observas cada comportamiento en tu niño/a.
          </p>
        </div>
      )}

      {/* Preguntas */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px' }}>
        {sectionQs.map(q => (
          <div key={q.index} style={{ background:'white', borderRadius:14, padding:'12px 14px', marginBottom:10, border:`0.5px solid ${answers[q.index]>=0?'#E8F5E9':'#F0E8E0'}`, transition:'border-color 0.2s' }}>
            <p style={{ fontSize:13, color:'#2D1808', margin:'0 0 10px', lineHeight:1.55 }}>{q.text}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
              {FREQ_LABELS.map((label, val) => (
                <button key={val} onClick={() => handleAnswer(q.index, val)} style={{
                  padding:'7px 4px', borderRadius:10,
                  border:`2px solid ${answers[q.index]===val ? FREQ_TEXT[val]:'#F0E8E0'}`,
                  background: answers[q.index]===val ? FREQ_COLORS[val]:'white',
                  cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:2
                }}>
                  <span style={{ fontSize:9, fontWeight:600, color: answers[q.index]===val ? FREQ_TEXT[val]:'#C4A090', textAlign:'center', lineHeight:1.3 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding:'12px 16px 32px', background:'#FFFAF6', borderTop:'0.5px solid #F0E8E0', flexShrink:0 }}>
        <button onClick={nextSec} disabled={!sectionDone} style={{
          width:'100%', padding:'14px', borderRadius:14,
          background: sectionDone ? 'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0',
          border:'none', cursor: sectionDone ? 'pointer':'default',
          color: sectionDone ? 'white':'#C4A090',
          fontSize:15, fontWeight:600, boxSizing:'border-box'
        }}>
          {secIdx < SECTIONS.length-1 ? `Siguiente sección →` : 'Ver mi resultado →'}
        </button>
      </div>
    </div>
  )
}
