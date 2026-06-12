'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type { Week } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'

// ── Configuración por parte ───────────────────────────────────────────────────
const STEP_CONFIG = {
  inicio:        { label:'Inicio',        color:'#A87840', dark:'#6A4A10', text:'#3A2808', bg:'linear-gradient(145deg,#D4E8A0 0%,#C8D890 40%,#E8D4A0 100%)' },
  desequilibrio: { label:'Desequilibrio', color:'#C06030', dark:'#8A3818', text:'#4A1808', bg:'linear-gradient(145deg,#F8C8A0 0%,#F0B090 40%,#F8A8B0 100%)' },
  accion:        { label:'Acción',        color:'#4070B0', dark:'#1A4080', text:'#0A2050', bg:'linear-gradient(145deg,#A8C8F8 0%,#98B8F0 40%,#B8A8F8 100%)' },
  catarsis:      { label:'Catarsis',      color:'#8858A8', dark:'#5A2878', text:'#380850', bg:'linear-gradient(145deg,#E0B8F8 0%,#D0A0F0 40%,#B8B0F8 100%)' },
  ensenanza:     { label:'Enseñanza',     color:'#C06840', dark:'#883818', text:'#501808', bg:'linear-gradient(145deg,#F8E090 0%,#F0C880 40%,#F8B898 100%)' },
}
const STEP_KEYS = ['inicio','desequilibrio','accion','catarsis','ensenanza'] as const
type StepKey = typeof STEP_KEYS[number]

// ── Posturas ──────────────────────────────────────────────────────────────────
const POSTURA_POR_PARTE: Record<number, Record<StepKey,{emoji:string;name:string;magic:string;id:string;howTo:string;duration:string;benefits:string[]}>> = {
  1: {
    inicio:        { emoji:'🏔️', name:'Montaña',          magic:'El Cuerpo que No Tiembla',    id:'montana',     howTo:'De pie, pies paralelos al ancho de las caderas. Brazos pegados al cuerpo. Empujar los pies contra el suelo. Espalda larga. Mantener 5 respiraciones.', duration:'30–45 seg, 2 veces', benefits:['Propiocepción de toda la cadena posterior','Organiza el sistema nervioso'] },
    desequilibrio: { emoji:'🐢', name:'Tortuga',           magic:'La Casa que Siempre Llevas',  id:'tortuga',     howTo:'Sentados, piernas en V. Doblar el cuerpo hacia adelante. Brazos por debajo de las rodillas. Cabeza inclinada. Respirar suave.', duration:'30–60 seg', benefits:['Flexión anterior activa el parasimpático','Postura de regulación de emergencia'] },
    accion:        { emoji:'🧘', name:'Postura del Indio', magic:'El Trono de Oma',              id:'indio',       howTo:'Sentados con piernas cruzadas. Espalda larga. Manos en las rodillas. Cantar OM tres veces sintiendo la vibración en el pecho.', duration:'45–60 seg + 3 OM', benefits:['Propiocepción de caderas y columna','El OM activa el nervio vago'] },
    catarsis:      { emoji:'🐱', name:'Gato I y II',       magic:'La Espalda que Respira',      id:'gato',        howTo:'Cuatro apoyos. Gato I: exhalar y arquear la espalda. Gato II: inhalar y hundir la espalda. 5 ciclos lentos.', duration:'5 ciclos (~45 seg)', benefits:['Propiocepción bilateral intensa','Conectar movimiento con respiración'] },
    ensenanza:     { emoji:'🌲', name:'Árbol',             magic:'Las Raíces que Suben',        id:'arbol',       howTo:'De pie, un pie firme. El otro en el tobillo o pantorrilla. Brazos como ramas. Cuando se caen: reírse y volver.', duration:'15–20 seg por lado', benefits:['Equilibrio estático vestibular','Entrena atención sostenida'] },
  },
  2: {
    inicio:        { emoji:'🧒', name:'Postura del Niño',  magic:'El Caracol del Fondo del Mar', id:'postura_nino', howTo:'Sentarse sobre los talones. Tronco hacia adelante. Frente al suelo. Brazos a los lados. Respirar suave.', duration:'60–90 seg', benefits:['Activa el parasimpático','Postura de regulación'] },
    desequilibrio: { emoji:'🦋', name:'Mariposa',          magic:'La Raya que Baila en el Agua', id:'mariposa',    howTo:'Sentados, plantas de pies unidas. Manos en los pies. Mover rodillas arriba y abajo. 15 veces. Luego mantener quieto.', duration:'15 aleteos + 30 seg', benefits:['Apertura de caderas','Movimiento rítmico regula el vestibular'] },
    accion:        { emoji:'🐍', name:'Cobra',             magic:'La Serpiente que Sale del Mar', id:'cobra',      howTo:'Boca abajo. Manos bajo los hombros. Inhalar y levantar el pecho. Hombros atrás. Mirar hacia arriba. 3 veces.', duration:'3 veces, 20–30 seg', benefits:['Apertura de pecho','Activa energía'] },
    catarsis:      { emoji:'🌉', name:'Puente',            magic:'La Gran Ola de Kawa',          id:'puente',     howTo:'Boca arriba. Rodillas dobladas. Inhalar y subir caderas. Mantener 5 respiraciones. Bajar despacio.', duration:'3 veces, 20–25 seg', benefits:['Apertura de pecho y caderas','Propiocepción intensa'] },
    ensenanza:     { emoji:'🦋', name:'Mariposa',          magic:'La Raya que Baila en el Agua', id:'mariposa',   howTo:'Sentados, plantas de pies unidas. Manos en los pies. Mover rodillas arriba y abajo. 15 veces.', duration:'15 aleteos + 30 seg', benefits:['Apertura de caderas','Ideal para antes de dormir'] },
  },
  3: {
    inicio:        { emoji:'⚔️', name:'Guerrero II',  magic:'Kawa Abre las Alas',       id:'guerrero2', howTo:'Gran paso atrás. Pie trasero perpendicular. Doblar rodilla delantera. Brazos horizontales. ¡HA! al entrar.', duration:'20–30 seg por lado', benefits:['Propiocepción intensa en piernas','Fortalece espalda y hombros'] },
    desequilibrio: { emoji:'🦅', name:'Gaviota',      magic:'El Vuelo de Inti',         id:'gaviota',   howTo:'De pie, levantar un pie. Brazos extendidos como alas. Mantener. Inclinar levemente el tronco.', duration:'15–20 seg por lado', benefits:['Equilibrio dinámico','Entrena atención sostenida'] },
    accion:        { emoji:'🚢', name:'Barco',        magic:'La Nave del Viento',       id:'barco',     howTo:'Sentados. Levantar piernas y tronco en V. Brazos paralelos al suelo.', duration:'10–15 seg, 2–3 veces', benefits:['Activación propioceptiva en core','Desafío de equilibrio'] },
    catarsis:      { emoji:'🧸', name:'Marioneta',   magic:'Los Hilos que se Sueltan', id:'marioneta', howTo:'De pie. Inhalar brazos arriba. Exhalar con JA y caer desde la cintura. Subir muy despacio. 3 veces.', duration:'3 repeticiones', benefits:['Inversión parcial aumenta flujo al cerebro','El JA vacía pulmones'] },
    ensenanza:     { emoji:'⚔️', name:'Guerrero II', magic:'Kawa Abre las Alas',       id:'guerrero2', howTo:'Gran paso atrás. Pie trasero perpendicular. Doblar rodilla delantera. Brazos horizontales.', duration:'20–30 seg por lado', benefits:['Propiocepción intensa','Sistema vestibular activado'] },
  },
  4: {
    inicio:        { emoji:'🐍', name:'Cobra Profunda',  magic:'La Llama que Sube',          id:'cobra_profunda', howTo:'Boca abajo. Manos bajo los hombros. Subir el pecho lo más alto posible. 3 respiraciones.', duration:'3 veces, 25–35 seg', benefits:['Máxima apertura torácica','Estimula el plexo solar'] },
    desequilibrio: { emoji:'⚔️', name:'Guerrero I',      magic:'La Llama Conquistadora',     id:'guerrero1',      howTo:'Un pie adelante doblado, otro atrás. Caderas al frente. Brazos al cielo. ¡HA! al entrar.', duration:'20–25 seg por lado', benefits:['Apertura de cadera','Abre la cavidad torácica'] },
    accion:        { emoji:'☀️', name:'Saludo al Sol',   magic:'La Danza del Volcán',        id:'saludo_sol',     howTo:'Montaña → brazos al cielo → Marioneta → cuatro apoyos → Cobra → Postura del Niño → Montaña. 3 ciclos.', duration:'3 ciclos, ~4 min', benefits:['Integra todos los sistemas sensoriales','Coordinado con respiración'] },
    catarsis:      { emoji:'🌸', name:'Flor de Loto',    magic:'La Rosa que Nace del Fuego', id:'flor_loto',      howTo:'Sentados con piernas cruzadas. Espalda larga. Manos en Namaste al corazón. Ojos cerrados.', duration:'60–90 seg', benefits:['Integración sensorial','Momento de introspección'] },
    ensenanza:     { emoji:'🌸', name:'Flor de Loto',    magic:'La Rosa que Nace del Fuego', id:'flor_loto',      howTo:'Sentados con piernas cruzadas. Espalda larga. Manos en Namaste al corazón.', duration:'60–90 seg', benefits:['Integración sensorial','Introspección'] },
  },
  5: {
    inicio:        { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',       id:'secuencia_completa', howTo:'Montaña → Árbol → Postura del Niño → Mariposa → Cobra → Guerrero II → Barco → Saludo al Sol → Flor de Loto. Dos veces.', duration:'2 ciclos, ~10 min', benefits:['Integra todos los sistemas sensoriales'] },
    desequilibrio: { emoji:'🫀', name:'OM de la Ballena',   magic:'La Vibración del Origen', id:'om_ballena',         howTo:'Flor de Loto. Manos en Namaste. Ojos cerrados. Inhalar profundo. Exhalar con OM largo. 3 veces.', duration:'3 OM largos', benefits:['El OM estimula el nervio vago'] },
    accion:        { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',       id:'secuencia_completa', howTo:'Montaña → Árbol → Postura del Niño → Mariposa → Cobra → Guerrero II → Barco → Saludo al Sol → Flor de Loto.', duration:'2 ciclos', benefits:['Integra todos los sistemas'] },
    catarsis:      { emoji:'🫀', name:'OM de la Ballena',   magic:'La Vibración del Origen', id:'om_ballena',         howTo:'Flor de Loto. Manos en Namaste. Inhalar profundo. Exhalar con OM largo. 3 veces.', duration:'3 OM largos', benefits:['El OM estimula el nervio vago'] },
    ensenanza:     { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',       id:'secuencia_completa', howTo:'Montaña → Árbol → Postura del Niño → Mariposa → Cobra → Guerrero II → Barco → Saludo al Sol → Flor de Loto.', duration:'2 ciclos', benefits:['Integra todos los sistemas'] },
  },
}

const AUDIO_MAP: Record<string,string> = {
  montana:'montana', indio:'posturaindio', tortuga:'posturatortuga',
  gato:'gatolYII', arbol:'posturaarbol',
}

function getPreview(text: string, n=20) {
  const words = text.split(' ')
  if (words.length <= n) return { preview: text, rest: '', hasMore: false }
  return { preview: words.slice(0,n).join(' '), rest: words.slice(n).join(' '), hasMore: true }
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

// ── Play button grande ────────────────────────────────────────────────────────
function BigPlayBtn({ src, label, color, bg }: { src:string; label:string; color:string; bg:string }) {
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
  const pct = duration ? (progress/duration)*100 : 0
  const fmt = (s:number) => isNaN(s)||!s ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`

  return (
    <button onClick={() => {
      const a = audioRef.current; if (!a) return
      if (playing) { a.pause(); setPlaying(false) }
      else { a.play().catch(()=>{}); setPlaying(true) }
    }} style={{
      width:'100%', padding:'14px 16px', borderRadius:16,
      background: bg, border:`1.5px solid ${color}30`,
      display:'flex', alignItems:'center', gap:14,
      cursor:'pointer', textAlign:'left', boxSizing:'border-box'
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{
        width:52, height:52, borderRadius:'50%',
        background:color, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 4px 14px ${color}50`
      }}>
        {playing
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:13, fontWeight:600, color:'#1F2937', margin:'0 0 6px' }}>{label}</p>
        <div style={{ height:4, background:'rgba(0,0,0,0.08)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width 0.3s' }} />
        </div>
      </div>
      <span style={{ fontSize:11, color:'#9CA3AF', flexShrink:0 }}>{fmt(progress)}</span>
    </button>
  )
}

// ── Play button pequeño ───────────────────────────────────────────────────────
function SmallPlayBtn({ src, label, sublabel, color, bg }: { src:string; label:string; sublabel:string; color:string; bg:string }) {
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
  const pct = duration ? (progress/duration)*100 : 0
  const fmt = (s:number) => isNaN(s)||!s ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`

  return (
    <button onClick={() => {
      const a = audioRef.current; if (!a) return
      if (playing) { a.pause(); setPlaying(false) }
      else { a.play().catch(()=>{}); setPlaying(true) }
    }} style={{
      flex:1, padding:'10px 12px', borderRadius:12,
      background: bg, border:`1px solid ${color}25`,
      display:'flex', alignItems:'center', gap:8,
      cursor:'pointer', textAlign:'left'
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{ width:32, height:32, borderRadius:'50%', background:color, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 2px 8px ${color}40` }}>
        {playing
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:9, color:color, fontWeight:700, margin:'0 0 1px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{sublabel}</p>
        <p style={{ fontSize:11, fontWeight:500, color:'#1F2937', margin:'0 0 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</p>
        <div style={{ height:2.5, background:'rgba(0,0,0,0.08)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width 0.3s' }} />
        </div>
      </div>
      <span style={{ fontSize:9, color:'#9CA3AF', flexShrink:0 }}>{fmt(progress)}</span>
    </button>
  )
}

// ── Modal de postura ──────────────────────────────────────────────────────────
function PosturaModal({ postura, weekId, gender, color, onClose }:{
  postura: typeof POSTURA_POR_PARTE[1][StepKey]; weekId:number; gender:'male'|'female'; color:string; onClose:()=>void
}) {
  const imgSrc = usePosturaImg(weekId, postura.id, gender)
  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'flex-end', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'white', width:'100%', maxWidth:430, margin:'0 auto', borderRadius:'24px 24px 0 0', overflow:'hidden', maxHeight:'82vh', display:'flex', flexDirection:'column' }}>
        <div style={{ position:'relative', height:200, background:`linear-gradient(160deg,${color}CC,${color})`, flexShrink:0 }}>
          {imgSrc && (
            <>
              <img src={imgSrc} alt={postura.name} style={{ position:'absolute', right:0, bottom:0, height:'100%', width:'auto', objectFit:'contain', objectPosition:'bottom right', opacity:0.85 }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.45) 0%,transparent 55%)' }} />
            </>
          )}
          {!imgSrc && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:70, opacity:0.25 }}>{postura.emoji}</span></div>}
          <div style={{ position:'absolute', bottom:16, left:18, zIndex:1 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.8)', margin:'0 0 4px', fontStyle:'italic', fontFamily:"'Georgia',serif" }}>"{postura.magic}"</p>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:20 }}>{postura.emoji}</span>
              <p style={{ fontSize:16, color:'white', fontWeight:600, margin:0 }}>{postura.name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ position:'absolute', top:14, right:14, width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,0.25)', border:'none', cursor:'pointer', fontSize:16, color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        <div style={{ overflow:'auto', padding:'16px 18px 28px' }}>
          <div style={{ background:`${color}10`, borderRadius:12, padding:'11px 13px', marginBottom:10, borderLeft:`3px solid ${color}` }}>
            <p style={{ fontSize:10, fontWeight:700, color:color, margin:'0 0 5px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Cómo hacerla</p>
            <p style={{ fontSize:13, color:'#374151', margin:0, lineHeight:1.65 }}>{postura.howTo}</p>
            <p style={{ fontSize:11, fontWeight:600, color:color, margin:'6px 0 0' }}>⏱️ {postura.duration}</p>
          </div>
          <div style={{ background:'#F8F7F4', borderRadius:12, padding:'11px 13px' }}>
            <p style={{ fontSize:10, fontWeight:700, color:'#9CA3AF', margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Beneficios sensoriales</p>
            {postura.benefits.map((b,i) => (
              <div key={i} style={{ display:'flex', gap:7, marginBottom:5 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:color, flexShrink:0, marginTop:5 }} />
                <p style={{ fontSize:12, color:'#4B5563', margin:0, lineHeight:1.55 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
  const [posturaOpen, setPosturaOpen] = useState(false)
  const touchX                        = useRef(0)

  useEffect(() => { setExpanded(false); setPosturaOpen(false) }, [current])

  const steps    = Object.entries(week.story)
  const total    = steps.length
  const stepKey  = STEP_KEYS[current] as StepKey
  const config   = STEP_CONFIG[stepKey] || STEP_CONFIG.inicio
  const posturas = POSTURA_POR_PARTE[week.id] || POSTURA_POR_PARTE[1]
  const postura  = posturas[stepKey] || posturas.inicio
  const s        = week.id
  const audioKey = AUDIO_MAP[postura.id] || postura.id
  const [, stepData] = steps[current]
  const { preview, rest, hasMore } = getPreview(stepData.text)

  // Hook de imagen al nivel del componente — correcto
  const bgImgSrc = usePosturaImg(week.id, postura.id, gender)

  const goTo = useCallback((idx:number) => {
    if (animating||idx===current||idx<0||idx>=total) return
    setDir(idx>current?'left':'right')
    setAnim(true)
    setTimeout(() => { setCurrent(idx); onStepChange?.(idx); setAnim(false) }, 280)
  }, [animating, current, total, onStepChange])

  const onTouchStart = (e:React.TouchEvent) => { touchX.current=e.touches[0].clientX }
  const onTouchEnd   = (e:React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx)>50) dx<0 ? goTo(current+1) : goTo(current-1)
  }

  return (
    <>
      {showPostura && (
        <PosturaModal postura={postura} weekId={week.id} gender={gender} color={config.color} onClose={()=>setShowPostura(false)} />
      )}

      <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', marginBottom:16 }}>

        {/* ══ ZONA 1: HEADER CARRUSEL ══ */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ position:'relative', overflow:'hidden' }}>
          <div style={{
            opacity:animating?0:1,
            transform:animating?(slideDir==='left'?'translateX(-5%)':'translateX(5%)'):'none',
            transition:animating?'all 0.28s ease':'none',
          }}>

            {/* Header con imagen */}
            <div style={{ background:config.bg, height:190, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 18px 14px' }}>
              <div style={{ position:'absolute', top:-30, left:-30, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }} />

              {/* Imagen de postura de fondo */}
              {bgImgSrc && (
                <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
                  <img src={bgImgSrc} alt="" style={{ position:'absolute', right:0, bottom:0, height:'108%', width:'auto', objectFit:'contain', objectPosition:'bottom right', opacity:0.92 }} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.3) 45%,transparent 68%)' }} />
                </div>
              )}

              {/* Stories bar */}
              <div style={{ position:'absolute', top:12, left:0, right:0, display:'flex', gap:4, padding:'0 14px', zIndex:2 }}>
                {steps.map((_,i) => (
                  <button key={i} onClick={()=>goTo(i)} style={{ flex:1, height:3, borderRadius:2, border:'none', cursor:'pointer', padding:0, background:i<=current?'rgba(255,255,255,0.92)':'rgba(255,255,255,0.28)', transition:'background 0.3s' }} />
                ))}
              </div>

              {/* Badge número + label */}
              <div style={{ position:'relative', zIndex:2 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.25)', borderRadius:20, padding:'3px 12px', marginBottom:6, border:'1px solid rgba(255,255,255,0.4)' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:config.dark }}>
                    {current+1}
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.95)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{config.label}</span>
                </div>
                <h3 style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.97)', margin:0, fontFamily:"'Georgia','Times New Roman',serif", textShadow:'0 2px 8px rgba(0,0,0,0.3)', maxWidth:'65%' }}>
                  {stepData.title}
                </h3>
              </div>
            </div>

            {/* ══ ZONA 2: TEXTO COLAPSABLE ══ */}
            <div style={{ background:'white', borderLeft:`3px solid ${config.color}60` }}>
              <button onClick={()=>setExpanded(e=>!e)} style={{ width:'100%', padding:'12px 16px', background:'none', border:'none', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'flex-start', gap:10 }}>
                <p style={{ fontSize:13, color:'#4A4030', lineHeight:1.75, fontStyle:'italic', margin:0, fontFamily:"'Georgia','Times New Roman',serif", flex:1 }}>
                  "{preview}{hasMore && !textExpanded && <span style={{ color:config.color, fontStyle:'normal', fontWeight:600, fontSize:12 }}>... leer más</span>}
                  {hasMore && textExpanded && <span> {rest}"</span>}
                  {!hasMore && '"'}
                </p>
                {hasMore && (
                  <div style={{ width:22, height:22, borderRadius:'50%', background:`${config.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, transition:'transform 0.25s', transform:textExpanded?'rotate(180deg)':'none' }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                )}
              </button>
            </div>

            {/* ══ ZONA 3: AUDIO PRINCIPAL — protagonista ══ */}
            <div style={{ background:'#FFFAF6', padding:'12px 14px', borderTop:`1px solid ${config.color}18` }}>
              <BigPlayBtn
                src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                label="Escucha la historia"
                color={config.color}
                bg={`${config.color}12`}
              />
            </div>

            {/* ══ ZONA 4: POSTURA — colapsable con un toque ══ */}
            <div style={{ background:'#FFFAF6', borderTop:`1px solid ${config.color}15`, paddingBottom: posturaOpen ? 0 : 0 }}>
              {/* Botón para abrir/cerrar zona postura */}
              <button
                onClick={()=>setPosturaOpen(o=>!o)}
                style={{
                  width:'100%', padding:'11px 14px',
                  background:'none', border:'none', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:10, boxSizing:'border-box'
                }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${config.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {postura.emoji}
                </div>
                <div style={{ flex:1, textAlign:'left' }}>
                  <p style={{ fontSize:11, color:config.color, fontWeight:600, margin:'0 0 1px', fontFamily:"'Georgia',serif", fontStyle:'italic' }}>Ahora: {postura.name}</p>
                  <p style={{ fontSize:11, color:'rgba(80,60,20,0.6)', margin:0, fontStyle:'italic' }}>"{postura.magic}"</p>
                </div>
                <div style={{ width:24, height:24, borderRadius:'50%', background:`${config.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'transform 0.25s', transform:posturaOpen?'rotate(180deg)':'none' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </button>

              {/* Contenido expandido de postura */}
              {posturaOpen && (
                <div style={{ padding:'0 14px 12px', display:'flex', flexDirection:'column', gap:7 }}>
                  <div style={{ display:'flex', gap:7 }}>
                    <SmallPlayBtn
                      src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                      label="Postura en cuento"
                      sublabel="✨ Para el niño/a"
                      color="#C07020"
                      bg="linear-gradient(135deg,#FFF8D0,#FFF0A8)"
                    />
                    <SmallPlayBtn
                      src={`/audio/semana-${s}/s${s}howto${audioKey}.m4a`}
                      label="Guía del adulto"
                      sublabel="🧘 Para el adulto"
                      color="#C06858"
                      bg="linear-gradient(135deg,#FFF0F4,#FFE4EC)"
                    />
                  </div>
                  <button onClick={()=>setShowPostura(true)} style={{
                    width:'100%', padding:'9px 12px', borderRadius:11,
                    background:'white', border:`1px solid ${config.color}25`,
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    cursor:'pointer', boxSizing:'border-box'
                  }}>
                    <span style={{ fontSize:12, color:'#374151', fontWeight:500 }}>Ver instrucciones completas</span>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:`linear-gradient(135deg,${config.color},${config.dark})`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:11 }}>→</div>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ══ NAVEGACIÓN ══ */}
        <div style={{ background:'white', borderTop:'1px solid #F5EEE8', padding:'10px 14px', display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={()=>goTo(current-1)} disabled={current===0} style={{ width:40, height:40, borderRadius:'50%', border:'1.5px solid #F0E8E0', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:current===0?'default':'pointer', opacity:current===0?0.2:1, flexShrink:0 }}>←</button>
          {current < total-1 ? (
            <button onClick={()=>goTo(current+1)} style={{ flex:1, padding:'12px', borderRadius:14, background:`linear-gradient(135deg,${config.color},${config.dark})`, border:'none', cursor:'pointer', color:'white', fontSize:14, fontWeight:700, boxShadow:`0 3px 12px ${config.color}40` }}>
              Siguiente parte →
            </button>
          ) : (
            <button onClick={onComplete} style={{ flex:1, padding:'12px', borderRadius:14, background:isCompleted?'#F0F9F4':`linear-gradient(135deg,${config.color},${config.dark})`, border:isCompleted?`2px solid ${weekColors.main}`:'none', cursor:'pointer', color:isCompleted?weekColors.main:'white', fontSize:14, fontWeight:700, boxShadow:isCompleted?'none':`0 3px 12px ${config.color}40` }}>
              {isCompleted ? '⭐ Historia completada' : '⭐ Completar historia'}
            </button>
          )}
          {current < total-1 && (
            <button onClick={()=>goTo(current+1)} style={{ width:40, height:40, borderRadius:'50%', border:'1.5px solid #F0E8E0', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer', flexShrink:0 }}>→</button>
          )}
          {current === total-1 && (
            <div style={{ width:40, flexShrink:0 }} />
          )}
        </div>
      </div>
    </>
  )
}
