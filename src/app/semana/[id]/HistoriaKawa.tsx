'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type { Week } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'

// ── Configuración por parte ───────────────────────────────────────────────────
const STEP_CONFIG = {
  inicio:        { label:'Inicio',        color:'#2D6A4F', dark:'#1B4332', bg:'linear-gradient(160deg,#1B4332,#2D6A4F)' },
  desequilibrio: { label:'Desequilibrio', color:'#E64A19', dark:'#BF360C', bg:'linear-gradient(160deg,#BF360C,#E64A19)' },
  accion:        { label:'Acción',        color:'#1976D2', dark:'#0D47A1', bg:'linear-gradient(160deg,#0D47A1,#1976D2)' },
  catarsis:      { label:'Catarsis',      color:'#7B1FA2', dark:'#4A148C', bg:'linear-gradient(160deg,#4A148C,#7B1FA2)' },
  ensenanza:     { label:'Enseñanza',     color:'#F57F17', dark:'#E65100', bg:'linear-gradient(160deg,#E65100,#F57F17)' },
}
const STEP_KEYS = ['inicio','desequilibrio','accion','catarsis','ensenanza'] as const
type StepKey = typeof STEP_KEYS[number]

// Colores diferenciados para cada tipo de audio
const AUDIO_COLORS = {
  historia: { color:'#1A237E', bg:'#E8EAF6', label:'Índigo — narración historia' },
  magica:   { color:'#E65100', bg:'#FFF3E0', label:'Naranja — para el niño/a' },
  adulto:   { color:'#2D6A4F', bg:'#E8F5E9', label:'Verde — para el adulto' },
}

function getPreview(text: string, n=18): { preview:string; rest:string; hasMore:boolean } {
  const words = text.split(' ')
  if (words.length <= n) return { preview:text, rest:'', hasMore:false }
  return { preview:words.slice(0,n).join(' ')+'...', rest:words.slice(n).join(' '), hasMore:true }
}


// ── Posturas ──────────────────────────────────────────────────────────────────
const POSTURA_POR_PARTE: Record<number, Record<StepKey,{emoji:string;name:string;magic:string;id:string;howTo:string;duration:string;benefits:string[]}>> = {
  1: {
    inicio:        { emoji:'🏔️', name:'Montaña',          magic:'El Cuerpo que No Tiembla',   id:'montana',      howTo:'De pie, pies paralelos al ancho de las caderas. Brazos pegados al cuerpo. Empujar suavemente los pies contra el suelo. Espalda larga. Cara relajada. Mantener 5 respiraciones.', duration:'30–45 seg, 2 veces', benefits:['Propiocepción de toda la cadena posterior','Organiza el sistema nervioso','Ideal como postura base para todos los perfiles'] },
    desequilibrio: { emoji:'🐢', name:'Tortuga',           magic:'La Casa que Siempre Llevas', id:'tortuga',      howTo:'Sentados, piernas en V. Doblar el cuerpo hacia adelante. Brazos por debajo de las rodillas. Cabeza inclinada. Respirar suave.', duration:'30–60 seg', benefits:['Flexión anterior activa el parasimpático','Postura de regulación de emergencia','Ideal para momentos de desregulación'] },
    accion:        { emoji:'🧘', name:'Postura del Indio', magic:'El Trono de Oma',            id:'indio',        howTo:'Sentados con piernas cruzadas. Espalda larga. Manos en las rodillas. Cantar OM tres veces sintiendo la vibración en el pecho.', duration:'45–60 seg + 3 OM', benefits:['Propiocepción de caderas y columna','El OM activa el nervio vago','Postura más segura para hipersensibles'] },
    catarsis:      { emoji:'🐱', name:'Gato I y II',       magic:'La Espalda que Respira',     id:'gato',         howTo:'Cuatro apoyos. Gato I: exhalar y arquear la espalda hacia arriba. Gato II: inhalar y hundir la espalda. 5 ciclos lentos.', duration:'5 ciclos lentos (~45 seg)', benefits:['Propiocepción bilateral intensa','Conectar movimiento con respiración regula el SNA','El ritmo predecible organiza a neurodivergentes'] },
    ensenanza:     { emoji:'🌲', name:'Árbol',             magic:'Las Raíces que Suben',       id:'arbol',        howTo:'De pie, un pie firme en el suelo. El otro pie en el tobillo o pantorrilla. Brazos como ramas. Mantener. Cuando se caen: reírse y volver.', duration:'15–20 seg por lado, 2–3 intentos', benefits:['Equilibrio estático vestibular y propioceptivo','El caerse desmitifica el error','Entrena atención sostenida'] },
  },
  2: {
    inicio:        { emoji:'🧒', name:'Postura del Niño',  magic:'El Caracol del Fondo del Mar', id:'postura_nino', howTo:'Sentarse sobre los talones. Tronco hacia adelante. Frente al suelo. Brazos a los lados. Respirar suave 1–2 minutos.', duration:'60–90 seg', benefits:['Flexión anterior activa el parasimpático','Postura de regulación de emergencia'] },
    desequilibrio: { emoji:'🦋', name:'Mariposa',          magic:'La Raya que Baila en el Agua', id:'mariposa',    howTo:'Sentados, plantas de pies unidas. Manos en los pies. Mover rodillas arriba y abajo como alas. 15 veces. Luego mantener quieto.', duration:'15 aleteos + 30 seg', benefits:['Apertura de caderas — libera tensión','Movimiento rítmico regula el vestibular'] },
    accion:        { emoji:'🐍', name:'Cobra',             magic:'La Serpiente que Sale del Mar', id:'cobra',       howTo:'Boca abajo. Manos bajo los hombros. Inhalar y levantar el pecho despacio. Hombros atrás. Mirar hacia arriba. Repetir 3 veces.', duration:'3 repeticiones, 20–30 seg c/u', benefits:['Apertura de pecho contrarresta postura de cierre','Activa energía después de posturas de calma'] },
    catarsis:      { emoji:'🌉', name:'Puente',            magic:'La Gran Ola de Kawa',          id:'puente',      howTo:'Acostado boca arriba. Rodillas dobladas, pies planos. Inhalar y subir caderas hacia el cielo. Mantener 5 respiraciones. Bajar despacio.', duration:'3 repeticiones, 20–25 seg c/u', benefits:['Apertura de pecho y caderas','Propiocepción intensa en pies y muslos'] },
    ensenanza:     { emoji:'🦋', name:'Mariposa',          magic:'La Raya que Baila en el Agua', id:'mariposa',    howTo:'Sentados, plantas de pies unidas. Manos en los pies. Mover rodillas arriba y abajo como alas. 15 veces. Luego mantener quieto.', duration:'15 aleteos + 30 seg', benefits:['Apertura de caderas — libera tensión','Ideal para antes de dormir'] },
  },
  3: {
    inicio:        { emoji:'⚔️', name:'Guerrero II',  magic:'Kawa Abre las Alas',       id:'guerrero2',  howTo:'Gran paso hacia atrás. Pie trasero perpendicular. Doblar rodilla delantera. Brazos horizontales. Mirar la mano delantera. ¡HA! al entrar.', duration:'20–30 seg por lado, 2 veces', benefits:['Propiocepción intensa en piernas con carga','Fortalece piernas, espalda y hombros'] },
    desequilibrio: { emoji:'🦅', name:'Gaviota',      magic:'El Vuelo de Inti',         id:'gaviota',    howTo:'De pie, levantar un pie. Brazos extendidos como alas. Mantener. Cuando se domine: inclinar levemente el tronco.', duration:'15–20 seg por lado, 2 intentos', benefits:['Equilibrio dinámico vestibular y propioceptivo','Entrena atención sostenida'] },
    accion:        { emoji:'🚢', name:'Barco',        magic:'La Nave del Viento',       id:'barco',      howTo:'Sentados. Levantar piernas y tronco formando una V. Brazos paralelos al suelo. El adulto puede sostener los pies al inicio.', duration:'10–15 seg, 2–3 intentos', benefits:['Máxima activación propioceptiva en core y caderas','Desafío de equilibrio que produce logro intenso'] },
    catarsis:      { emoji:'🧸', name:'Marioneta',   magic:'Los Hilos que se Sueltan', id:'marioneta',  howTo:'De pie. Inhalar brazos arriba. Exhalar con JA y caer desde la cintura. Cabeza, brazos y tronco cuelgan. Subir muy despacio. 3 veces.', duration:'3 repeticiones completas', benefits:['Inversión parcial aumenta flujo al cerebro','El JA vacía pulmones completamente'] },
    ensenanza:     { emoji:'⚔️', name:'Guerrero II', magic:'Kawa Abre las Alas',       id:'guerrero2',  howTo:'Gran paso hacia atrás. Pie trasero perpendicular. Doblar rodilla delantera. Brazos horizontales. Mirar la mano delantera.', duration:'20–30 seg por lado', benefits:['Propiocepción intensa en piernas','Sistema vestibular activado'] },
  },
  4: {
    inicio:        { emoji:'🐍', name:'Cobra Profunda', magic:'La Llama que Sube',          id:'cobra_profunda', howTo:'Boca abajo. Manos bajo los hombros. Inhalar profundo y subir el pecho lo más alto posible. Hombros atrás. Mirar al cielo. 3 respiraciones.', duration:'3 veces, 25–35 seg c/u', benefits:['Máxima apertura torácica','Estimula el plexo solar'] },
    desequilibrio: { emoji:'⚔️', name:'Guerrero I',    magic:'La Llama Conquistadora',     id:'guerrero1',      howTo:'Un pie adelante doblado, otro atrás estirado. Caderas al frente. Brazos al cielo. Mirar hacia arriba. ¡HA! al entrar.', duration:'20–25 seg por lado, 2 veces', benefits:['Apertura de cadera y flexores','La extensión con brazos arriba abre la cavidad torácica'] },
    accion:        { emoji:'☀️', name:'Saludo al Sol', magic:'La Danza del Volcán',        id:'saludo_sol',     howTo:'Montaña → brazos al cielo → Marioneta → cuatro apoyos → Cobra → Postura del Niño → volver a Montaña. 3 ciclos.', duration:'3 ciclos completos, ~3–4 min', benefits:['Integra todos los sistemas sensoriales','Coordinado con respiración entrena integración bilateral'] },
    catarsis:      { emoji:'🌸', name:'Flor de Loto',  magic:'La Rosa que Nace del Fuego', id:'flor_loto',      howTo:'Sentados con piernas cruzadas. Espalda muy larga. Manos en Namaste al corazón. Ojos cerrados si el niño puede.', duration:'60–90 seg de quietud', benefits:['Integración sensorial post-activación','Momento de introspección — desarrolla el self'] },
    ensenanza:     { emoji:'🌸', name:'Flor de Loto',  magic:'La Rosa que Nace del Fuego', id:'flor_loto',      howTo:'Sentados con piernas cruzadas. Espalda muy larga. Manos en Namaste al corazón. Ojos cerrados si el niño puede.', duration:'60–90 seg de quietud', benefits:['Integración sensorial post-activación','Momento de introspección'] },
  },
  5: {
    inicio:        { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',       id:'secuencia_completa', howTo:'Montaña → Árbol → Postura del Niño → Mariposa → Cobra → Guerrero II → Barco → Saludo al Sol → Flor de Loto. Hacer dos veces.', duration:'2 ciclos, ~8–10 min', benefits:['Integra todos los sistemas sensoriales trabajados','El mayor logro de integración sensorial del curso'] },
    desequilibrio: { emoji:'🫀', name:'OM de la Ballena',   magic:'La Vibración del Origen', id:'om_ballena',         howTo:'Flor de Loto. Manos en Namaste al corazón. Ojos cerrados. Inhalar profundo. Exhalar con OM largo. 3 OM juntos.', duration:'3 OM largos, sin prisa', benefits:['El OM estimula el nervio vago directamente','Genera cohesión — sincroniza sistemas nerviosos'] },
    accion:        { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',       id:'secuencia_completa', howTo:'Montaña → Árbol → Postura del Niño → Mariposa → Cobra → Guerrero II → Barco → Saludo al Sol → Flor de Loto.', duration:'2 ciclos', benefits:['Integra todos los sistemas sensoriales'] },
    catarsis:      { emoji:'🫀', name:'OM de la Ballena',   magic:'La Vibración del Origen', id:'om_ballena',         howTo:'Flor de Loto. Manos en Namaste. Ojos cerrados. Inhalar profundo. Exhalar con OM largo. 3 OM juntos.', duration:'3 OM largos', benefits:['El OM estimula el nervio vago'] },
    ensenanza:     { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',       id:'secuencia_completa', howTo:'Montaña → Árbol → Postura del Niño → Mariposa → Cobra → Guerrero II → Barco → Saludo al Sol → Flor de Loto.', duration:'2 ciclos', benefits:['Integra todos los sistemas sensoriales'] },
  },
}

const AUDIO_MAP: Record<string,string> = {
  montana:'montana', indio:'posturaindio', tortuga:'posturatortuga',
  gato:'gatolYII', arbol:'posturaarbol',
}

// ── Imagen de postura ─────────────────────────────────────────────────────────
function usePosturaImg(weekId:number, posturaId:string, gender:'male'|'female') {
  const [src, setSrc] = useState<string|null>(null)
  const g = gender==='female' ? 'nina':'nino'
  useEffect(() => {
    if (weekId > 3) { setSrc(null); return }
    const jpg = `/posturas/semana-${weekId}/${g}/${posturaId}.jpg`
    const png = `/posturas/semana-${weekId}/${g}/${posturaId}.png`
    const i = new Image()
    i.onload  = () => setSrc(jpg)
    i.onerror = () => { const i2=new Image(); i2.onload=()=>setSrc(png); i2.onerror=()=>setSrc(null); i2.src=png }
    i.src = jpg
  }, [weekId, posturaId, g])
  return src
}

function PosturaBgImage({ weekId, posturaId, gender }:{ weekId:number; posturaId:string; gender:'male'|'female' }) {
  const src = usePosturaImg(weekId, posturaId, gender)
  if (!src) return null
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <img src={src} alt="" style={{ position:'absolute', right:0, bottom:0, height:'100%', width:'auto', objectFit:'contain', objectPosition:'bottom right', opacity:0.38 }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.15) 55%,transparent 80%)' }} />
    </div>
  )
}

// ── Modal de postura ──────────────────────────────────────────────────────────
function PosturaModal({ postura, weekId, gender, color, onClose }:{
  postura: typeof POSTURA_POR_PARTE[1][StepKey]
  weekId:number; gender:'male'|'female'; color:string; onClose:()=>void
}) {
  const imgSrc = usePosturaImg(weekId, postura.id, gender)

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'flex-end', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'white', width:'100%', maxWidth:430, margin:'0 auto',
        borderRadius:'24px 24px 0 0', overflow:'hidden',
        maxHeight:'85vh', display:'flex', flexDirection:'column'
      }}>
        {/* Header con imagen */}
        <div style={{ position:'relative', height:220, background:`linear-gradient(160deg,${color}CC,${color})`, flexShrink:0 }}>
          {imgSrc && (
            <>
              <img src={imgSrc} alt={postura.name} style={{
                position:'absolute', right:0, bottom:0, height:'100%',
                width:'auto', objectFit:'contain', objectPosition:'bottom right', opacity:0.85
              }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.5) 0%,transparent 60%)' }} />
            </>
          )}
          {!imgSrc && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:80, opacity:0.3 }}>{postura.emoji}</span>
            </div>
          )}
          {/* Info sobre la imagen */}
          <div style={{ position:'absolute', bottom:18, left:20, zIndex:1 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'3px 12px', marginBottom:8 }}>
              <span style={{ fontSize:18 }}>{postura.emoji}</span>
              <span style={{ fontSize:11, color:'white', fontWeight:700 }}>{postura.name}</span>
            </div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.85)', margin:0, fontStyle:'italic', fontFamily:"'Georgia',serif" }}>
              "{postura.magic}"
            </p>
          </div>
          {/* Botón cerrar */}
          <button onClick={onClose} style={{
            position:'absolute', top:16, right:16, width:32, height:32,
            borderRadius:'50%', background:'rgba(255,255,255,0.25)',
            border:'none', cursor:'pointer', fontSize:16, color:'white',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>×</button>
        </div>

        {/* Contenido */}
        <div style={{ overflow:'auto', padding:'18px 20px 32px' }}>
          {/* Cómo hacerla */}
          <div style={{ background:`${color}10`, borderRadius:14, padding:'12px 14px', marginBottom:12, borderLeft:`3px solid ${color}` }}>
            <p style={{ fontSize:10, fontWeight:700, color:color, margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Cómo hacerla</p>
            <p style={{ fontSize:13, color:'#374151', margin:0, lineHeight:1.7 }}>{postura.howTo}</p>
            <p style={{ fontSize:11, fontWeight:600, color:color, margin:'8px 0 0' }}>⏱️ {postura.duration}</p>
          </div>

          {/* Beneficios */}
          <div style={{ background:'#F8F7F4', borderRadius:14, padding:'12px 14px' }}>
            <p style={{ fontSize:10, fontWeight:700, color:'#6B7280', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Beneficios sensoriales</p>
            {postura.benefits.map((b,i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:color, flexShrink:0, marginTop:5 }} />
                <p style={{ fontSize:12, color:'#4B5563', margin:0, lineHeight:1.6 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Botón de audio diferenciado ───────────────────────────────────────────────
function AudioBtn({ src, label, sublabel, color, bg, size='normal', icon }: {
  src:string; label:string; sublabel?:string; color:string; bg:string; size?:'normal'|'large'; icon?:string
}) {
  const audioRef              = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProg]   = useState(0)
  const [duration, setDur]    = useState(0)
  const [error, setError]     = useState(false)

  useEffect(() => {
    const a = audioRef.current; if (!a) return
    const t  = () => setProg(a.currentTime)
    const d  = () => setDur(a.duration)
    const e  = () => { setPlaying(false); setProg(0) }
    const er = () => setError(true)
    a.addEventListener('timeupdate',t); a.addEventListener('loadedmetadata',d)
    a.addEventListener('ended',e);      a.addEventListener('error',er)
    return () => {
      a.removeEventListener('timeupdate',t); a.removeEventListener('loadedmetadata',d)
      a.removeEventListener('ended',e);      a.removeEventListener('error',er)
    }
  }, [])

  if (error) return null
  const pct     = duration ? (progress/duration)*100 : 0
  const fmt     = (s:number) => isNaN(s)||!s ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  const isLarge = size==='large'
  const ps      = isLarge ? 44 : 32

  return (
    <button onClick={() => {
      const a = audioRef.current; if (!a) return
      if (playing) { a.pause(); setPlaying(false) } else { a.play().catch(()=>{}); setPlaying(true) }
    }} style={{
      flex:1, padding: isLarge ? '11px 13px':'8px 10px',
      borderRadius: isLarge ? 16:12,
      background:bg,
      border:`1.5px solid ${color}35`,
      display:'flex', alignItems:'center', gap:isLarge?11:8,
      cursor:'pointer', textAlign:'left',
      boxSizing:'border-box', width:'100%'
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      {/* Botón play con icono diferenciador */}
      <div style={{
        width:ps, height:ps, borderRadius:'50%',
        background:color, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 3px 10px ${color}45`,
        position:'relative'
      }}>
        {playing
          ? <svg width={isLarge?13:10} height={isLarge?13:10} viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width={isLarge?13:10} height={isLarge?13:10} viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>}
        {/* Icono diferenciador en esquina */}
        {icon && !playing && (
          <span style={{ position:'absolute', top:-4, right:-4, fontSize:11, background:'white', borderRadius:'50%', width:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.15)' }}>
            {icon}
          </span>
        )}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        {sublabel && <p style={{ fontSize:9, color:color, margin:'0 0 1px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{sublabel}</p>}
        <p style={{ fontSize:isLarge?12:10, fontWeight:600, color:'#1F2937', margin:'0 0 4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</p>
        <div style={{ height:3, background:'rgba(0,0,0,0.1)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width 0.3s' }} />
        </div>
      </div>
      <span style={{ fontSize:9, color:'#9CA3AF', flexShrink:0 }}>{fmt(progress)}</span>
    </button>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
interface Props {
  week:Week; weekColors:{main:string;light:string}
  onComplete:()=>void; isCompleted:boolean
  currentStep?:number; onStepChange?:(step:number)=>void
}

export default function HistoriaKawa({ week, weekColors, onComplete, isCompleted, currentStep=0, onStepChange }:Props) {
  const { children, activeChildId } = useAppStore()
  const activeChild = children.find(c=>c.id===activeChildId) ?? children[0] ?? null
  const gender      = activeChild?.gender ?? 'male'

  const [current, setCurrent]         = useState(currentStep)
  const [animating, setAnim]          = useState(false)
  const [slideDir, setDir]            = useState<'left'|'right'>('left')
  const [textExpanded, setExpanded]   = useState(false)
  const [showPostura, setShowPostura] = useState(false)
  const touchX                        = useRef(0)

  useEffect(() => { setExpanded(false); setShowPostura(false) }, [current])

  const steps   = Object.entries(week.story)
  const total   = steps.length
  const stepKey = STEP_KEYS[current] as StepKey
  const config  = STEP_CONFIG[stepKey] || STEP_CONFIG.inicio
  const posturas = POSTURA_POR_PARTE[week.id] || POSTURA_POR_PARTE[1]
  const postura  = posturas[stepKey] || posturas.inicio
  const s        = week.id
  const audioKey = AUDIO_MAP[postura.id] || postura.id
  const [, stepData] = steps[current]
  const { preview, rest, hasMore } = getPreview(stepData.text)

  const goTo = useCallback((idx:number) => {
    if (animating||idx===current||idx<0||idx>=total) return
    setDir(idx>current?'left':'right')
    setAnim(true)
    setTimeout(() => { setCurrent(idx); onStepChange?.(idx); setAnim(false) }, 280)
  }, [animating, current, total, onStepChange])

  const onTouchStart = (e:React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e:React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) dx<0 ? goTo(current+1) : goTo(current-1)
  }

  return (
    <>
      {/* Modal de postura */}
      {showPostura && (
        <PosturaModal
          postura={postura}
          weekId={week.id}
          gender={gender}
          color={config.color}
          onClose={() => setShowPostura(false)}
        />
      )}

      <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.11)' }}>

        {/* ══ CARRUSEL ══ */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ position:'relative', overflow:'hidden' }}>
          <div style={{
            opacity:animating?0:1,
            transform:animating?(slideDir==='left'?'translateX(-5%)':'translateX(5%)'):'none',
            transition:animating?'all 0.28s ease':'none',
          }}>

            {/* ZONA 1: HEADER */}
            <div style={{ background:config.bg, height:200, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 18px 14px' }}>
              <div style={{ position:'absolute', top:-30, left:-30, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
              <PosturaBgImage weekId={week.id} posturaId={postura.id} gender={gender} />

              {/* Stories bar */}
              <div style={{ position:'absolute', top:12, left:0, right:0, display:'flex', gap:4, padding:'0 14px', zIndex:2 }}>
                {steps.map((_,i) => (
                  <button key={i} onClick={() => goTo(i)} style={{ flex:1, height:3, borderRadius:2, border:'none', cursor:'pointer', padding:0, background:i<=current?'rgba(255,255,255,0.92)':'rgba(255,255,255,0.28)', transition:'background 0.3s' }} />
                ))}
              </div>

              {/* Badge postura */}
              <div style={{ position:'absolute', top:30, right:14, zIndex:3, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(6px)', borderRadius:12, padding:'5px 10px', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:18 }}>{postura.emoji}</span>
                <div>
                  <p style={{ fontSize:8, color:'rgba(255,255,255,0.65)', margin:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>Postura</p>
                  <p style={{ fontSize:10, color:'white', fontWeight:700, margin:0 }}>{postura.name}</p>
                </div>
              </div>

              {/* Número + título + preview */}
              <div style={{ position:'relative', zIndex:2 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'3px 12px', marginBottom:6 }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:config.dark }}>
                    {current+1}
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color:'white', letterSpacing:'0.08em', textTransform:'uppercase' }}>{config.label}</span>
                </div>
                <h3 style={{ fontSize:17, fontWeight:700, color:'white', margin:'0 0 4px', fontFamily:"'Georgia','Times New Roman',serif", textShadow:'0 2px 6px rgba(0,0,0,0.4)', maxWidth:'62%' }}>
                  {stepData.title}
                </h3>

              </div>
            </div>

            {/* ZONA 2: TEXTO COLAPSABLE */}
            <div style={{ background:'white', borderLeft:`4px solid ${config.color}` }}>
              <button onClick={() => setExpanded(e=>!e)} style={{ width:'100%', padding:'12px 16px', background:'none', border:'none', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'flex-start', gap:10 }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, color:'#374151', lineHeight:1.75, fontStyle:'italic', margin:0, fontFamily:"'Georgia','Times New Roman',serif" }}>
                    "{preview}
                    {hasMore && textExpanded && <span> {rest}"</span>}
                    {hasMore && !textExpanded && <span style={{ color:config.color, fontStyle:'normal', fontWeight:600, fontSize:12 }}> leer más</span>}
                    {!hasMore && '"'}
                    {hasMore && textExpanded && ''}
                  </p>
                </div>
                {hasMore && (
                  <div style={{ width:24, height:24, borderRadius:'50%', background:config.color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, transition:'transform 0.25s', transform:textExpanded?'rotate(180deg)':'none' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                )}
              </button>
            </div>

            {/* ZONA 3: AUDIOS UNIFICADOS */}
            <div style={{ background:`${config.color}10`, borderTop:`1.5px solid ${config.color}28`, padding:'12px 14px' }}>

              {/* Play historia — protagonista, color índigo */}
              <p style={{ fontSize:9, fontWeight:700, color:config.color, margin:'0 0 7px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                🎧 Escucha esta parte
              </p>
              <div style={{ marginBottom:12 }}>
                <AudioBtn
                  src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                  label={`Historia — ${stepData.title}`}
                  sublabel="📖 Kawa te cuenta"
                  color={AUDIO_COLORS.historia.color}
                  bg={AUDIO_COLORS.historia.bg}
                  size="large"
                  icon="📖"
                />
              </div>

              {/* Separador postura */}
              <div style={{ display:'flex', alignItems:'center', gap:8, margin:'0 0 8px' }}>
                <div style={{ flex:1, height:1, background:config.color+'25' }} />
                <span style={{ fontSize:9, color:config.color, fontWeight:700, whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  🧘 Postura: {postura.name}
                </span>
                <div style={{ flex:1, height:1, background:config.color+'25' }} />
              </div>

              {/* Audios postura — compactos con colores diferenciados */}
              <div style={{ display:'flex', gap:7, marginBottom:8 }}>
                {/* Narración mágica — naranja */}
                <AudioBtn
                  src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                  label="Postura en cuento"
                  sublabel="✨ El niño/a escucha"
                  color={AUDIO_COLORS.magica.color}
                  bg={AUDIO_COLORS.magica.bg}
                  icon="✨"
                />
                {/* Instrucciones adulto — verde */}
                <AudioBtn
                  src={`/audio/semana-${s}/s${s}howto${audioKey}.m4a`}
                  label="Guía del adulto"
                  sublabel="🧘 Cómo acompañar"
                  color={AUDIO_COLORS.adulto.color}
                  bg={AUDIO_COLORS.adulto.bg}
                  icon="🧘"
                />
              </div>
              {/* Ver postura — ancho completo */}
              <button onClick={() => setShowPostura(true)} style={{
                width:'100%', padding:'10px 14px',
                background:'rgba(255,255,255,0.92)',
                border:`1.5px solid ${config.color}35`,
                borderRadius:12, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                boxSizing:'border-box'
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${config.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                    {postura.emoji}
                  </div>
                  <div style={{ textAlign:'left' }}>
                    <p style={{ fontSize:9, color:config.color, margin:0, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>Ver postura completa</p>
                    <p style={{ fontSize:12, color:'#1F2937', margin:0, fontWeight:600 }}>{postura.name} — instrucciones y beneficios</p>
                  </div>
                </div>
                <span style={{ fontSize:18, color:config.color, flexShrink:0 }}>→</span>
              </button>
            </div>

          </div>
        </div>

        {/* NAVEGACIÓN */}
        <div style={{ background:'white', borderTop:'1px solid #F3F4F6', padding:'10px 14px', display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={() => goTo(current-1)} disabled={current===0} style={{ width:40, height:40, borderRadius:'50%', border:'1.5px solid #E5E7EB', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:current===0?'default':'pointer', opacity:current===0?0.2:1, flexShrink:0 }}>←</button>
          {current < total-1 ? (
            <button onClick={() => goTo(current+1)} style={{ flex:1, padding:'12px', borderRadius:14, background:config.color, border:'none', cursor:'pointer', color:'white', fontSize:14, fontWeight:700, boxShadow:`0 3px 12px ${config.color}45` }}>
              Siguiente parte →
            </button>
          ) : (
            <button onClick={onComplete} style={{ flex:1, padding:'12px', borderRadius:14, background:isCompleted?'#E8F5E9':config.color, border:isCompleted?`2px solid ${weekColors.main}`:'none', cursor:'pointer', color:isCompleted?weekColors.main:'white', fontSize:14, fontWeight:700, boxShadow:isCompleted?'none':`0 3px 12px ${config.color}45` }}>
              {isCompleted ? '⭐ Historia completada' : '⭐ Completar historia'}
            </button>
          )}
          <button onClick={() => goTo(current+1)} disabled={current===total-1} style={{ width:40, height:40, borderRadius:'50%', border:'1.5px solid #E5E7EB', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:current===total-1?'default':'pointer', opacity:current===total-1?0.2:1, flexShrink:0 }}>→</button>
        </div>
      </div>
    </>
  )
}
