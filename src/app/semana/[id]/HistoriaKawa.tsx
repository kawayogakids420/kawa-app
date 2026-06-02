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

// Cuántas palabras mostrar como "gancho" antes de colapsar
const PREVIEW_WORDS = 18

function getPreview(text: string): { preview: string; rest: string; hasMore: boolean } {
  const words = text.split(' ')
  if (words.length <= PREVIEW_WORDS) return { preview: text, rest: '', hasMore: false }
  return {
    preview: words.slice(0, PREVIEW_WORDS).join(' ') + '...',
    rest: words.slice(PREVIEW_WORDS).join(' '),
    hasMore: true,
  }
}

// ── Posturas por semana y parte ───────────────────────────────────────────────
const POSTURA_POR_PARTE: Record<number, Record<StepKey, { emoji:string; name:string; magic:string; id:string }>> = {
  1: {
    inicio:        { emoji:'🏔️', name:'Montaña',          magic:'El Cuerpo que No Tiembla',    id:'montana' },
    desequilibrio: { emoji:'🐢', name:'Tortuga',           magic:'La Casa que Siempre Llevas',  id:'tortuga' },
    accion:        { emoji:'🧘', name:'Postura del Indio', magic:'El Trono de Oma',             id:'indio' },
    catarsis:      { emoji:'🐱', name:'Gato I y II',       magic:'La Espalda que Respira',      id:'gato' },
    ensenanza:     { emoji:'🌲', name:'Árbol',             magic:'Las Raíces que Suben',        id:'arbol' },
  },
  2: {
    inicio:        { emoji:'🧒', name:'Postura del Niño',  magic:'El Caracol del Fondo del Mar', id:'postura_nino' },
    desequilibrio: { emoji:'🦋', name:'Mariposa',          magic:'La Raya que Baila en el Agua', id:'mariposa' },
    accion:        { emoji:'🐍', name:'Cobra',             magic:'La Serpiente que Sale del Mar', id:'cobra' },
    catarsis:      { emoji:'🌉', name:'Puente',            magic:'La Gran Ola de Kawa',          id:'puente' },
    ensenanza:     { emoji:'🦋', name:'Mariposa',          magic:'La Raya que Baila en el Agua', id:'mariposa' },
  },
  3: {
    inicio:        { emoji:'⚔️', name:'Guerrero II',       magic:'Kawa Abre las Alas',          id:'guerrero2' },
    desequilibrio: { emoji:'🦅', name:'Gaviota',           magic:'El Vuelo de Inti',            id:'gaviota' },
    accion:        { emoji:'🚢', name:'Barco',             magic:'La Nave del Viento',          id:'barco' },
    catarsis:      { emoji:'🧸', name:'Marioneta',         magic:'Los Hilos que se Sueltan',    id:'marioneta' },
    ensenanza:     { emoji:'⚔️', name:'Guerrero II',       magic:'Kawa Abre las Alas',          id:'guerrero2' },
  },
  4: {
    inicio:        { emoji:'🐍', name:'Cobra Profunda',    magic:'La Llama que Sube',           id:'cobra_profunda' },
    desequilibrio: { emoji:'⚔️', name:'Guerrero I',        magic:'La Llama Conquistadora',      id:'guerrero1' },
    accion:        { emoji:'☀️', name:'Saludo al Sol',     magic:'La Danza del Volcán',         id:'saludo_sol' },
    catarsis:      { emoji:'🌸', name:'Flor de Loto',      magic:'La Rosa que Nace del Fuego',  id:'flor_loto' },
    ensenanza:     { emoji:'🌸', name:'Flor de Loto',      magic:'La Rosa que Nace del Fuego',  id:'flor_loto' },
  },
  5: {
    inicio:        { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',          id:'secuencia_completa' },
    desequilibrio: { emoji:'🫀', name:'OM de la Ballena',   magic:'La Vibración del Origen',    id:'om_ballena' },
    accion:        { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',          id:'secuencia_completa' },
    catarsis:      { emoji:'🫀', name:'OM de la Ballena',   magic:'La Vibración del Origen',    id:'om_ballena' },
    ensenanza:     { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',          id:'secuencia_completa' },
  },
}

const AUDIO_MAP: Record<string,string> = {
  montana:'montana', indio:'posturaindio', tortuga:'posturatortuga',
  gato:'gatolYII', arbol:'posturaarbol',
}

// ── Imagen de postura ─────────────────────────────────────────────────────────
function PosturaImage({ weekId, posturaId, gender }: {
  weekId:number; posturaId:string; gender:'male'|'female'
}) {
  const [src, setSrc] = useState<string|null>(null)
  const g = gender==='female' ? 'nina' : 'nino'
  useEffect(() => {
    if (weekId > 3) { setSrc(null); return }
    const jpg = `/posturas/semana-${weekId}/${g}/${posturaId}.jpg`
    const png = `/posturas/semana-${weekId}/${g}/${posturaId}.png`
    const i = new Image()
    i.onload  = () => setSrc(jpg)
    i.onerror = () => { const i2=new Image(); i2.onload=()=>setSrc(png); i2.onerror=()=>setSrc(null); i2.src=png }
    i.src = jpg
  }, [weekId, posturaId, g])
  if (!src) return null
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <img src={src} alt="" style={{ position:'absolute', right:0, bottom:0, height:'100%', width:'auto', objectFit:'contain', objectPosition:'bottom right', opacity:0.4 }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.2) 55%,transparent 80%)' }} />
    </div>
  )
}

// ── Botón de audio ────────────────────────────────────────────────────────────
function AudioBtn({ src, label, sublabel, color='#2D6A4F', bg='rgba(255,255,255,0.92)', size='normal' }: {
  src:string; label:string; sublabel?:string; color?:string; bg?:string; size?:'normal'|'large'
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
  const pct = duration ? (progress/duration)*100 : 0
  const fmt = (s:number) => isNaN(s)||!s ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  const isLarge = size === 'large'
  const playSize = isLarge ? 42 : 30

  return (
    <button onClick={() => {
      const a = audioRef.current; if (!a) return
      if (playing) { a.pause(); setPlaying(false) } else { a.play().catch(()=>{}); setPlaying(true) }
    }} style={{
      flex:1, padding: isLarge ? '10px 12px' : '8px 10px',
      borderRadius: isLarge ? 14 : 10,
      background: bg,
      border: `1.5px solid ${color}30`,
      display:'flex', alignItems:'center', gap: isLarge ? 10 : 7,
      cursor:'pointer', textAlign:'left',
      boxSizing:'border-box', width:'100%'
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{
        width:playSize, height:playSize, borderRadius:'50%',
        background:color, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 3px 10px ${color}50`
      }}>
        {playing
          ? <svg width={isLarge?13:10} height={isLarge?13:10} viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width={isLarge?13:10} height={isLarge?13:10} viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        {sublabel && <p style={{ fontSize:9, color:color, margin:'0 0 1px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{sublabel}</p>}
        <p style={{ fontSize: isLarge ? 12 : 10, fontWeight:600, color:'#1F2937', margin:'0 0 4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</p>
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
  week:Week
  weekColors:{ main:string; light:string }
  onComplete:() => void
  isCompleted:boolean
  currentStep?:number
  onStepChange?:(step:number) => void
}

export default function HistoriaKawa({ week, weekColors, onComplete, isCompleted, currentStep=0, onStepChange }:Props) {
  const { children, activeChildId } = useAppStore()
  const activeChild = children.find(c=>c.id===activeChildId) ?? children[0] ?? null
  const gender      = activeChild?.gender ?? 'male'

  const [current, setCurrent]     = useState(currentStep)
  const [animating, setAnim]      = useState(false)
  const [slideDir, setDir]        = useState<'left'|'right'>('left')
  const [textExpanded, setExpanded] = useState(false)
  const touchX                    = useRef(0)

  // Al cambiar de parte, colapsar el texto
  useEffect(() => { setExpanded(false) }, [current])

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
    setDir(idx>current ? 'left':'right')
    setAnim(true)
    setTimeout(() => { setCurrent(idx); onStepChange?.(idx); setAnim(false) }, 280)
  }, [animating, current, total, onStepChange])

  const onTouchStart = (e:React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e:React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) dx<0 ? goTo(current+1) : goTo(current-1)
  }

  const zoneBg     = config.color + '10'
  const zoneBorder = config.color + '28'

  return (
    <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.11)' }}>

      {/* ══ CARRUSEL ══ */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ position:'relative', overflow:'hidden' }}>
        <div style={{
          opacity:animating?0:1,
          transform:animating?(slideDir==='left'?'translateX(-5%)':'translateX(5%)'):'none',
          transition:animating?'all 0.28s ease':'none',
        }}>

          {/* ── ZONA 1: HEADER CON IMAGEN ── */}
          <div style={{
            background:config.bg,
            height:200, position:'relative', overflow:'hidden',
            display:'flex', flexDirection:'column', justifyContent:'flex-end',
            padding:'0 18px 14px'
          }}>
            {/* Decorativos */}
            <div style={{ position:'absolute', top:-30, left:-30, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />

            {/* Imagen de postura */}
            <PosturaImage weekId={week.id} posturaId={postura.id} gender={gender} />

            {/* Barra de progreso tipo stories */}
            <div style={{ position:'absolute', top:12, left:0, right:0, display:'flex', gap:4, padding:'0 14px', zIndex:2 }}>
              {steps.map((_,i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  flex:1, height:3, borderRadius:2, border:'none', cursor:'pointer', padding:0,
                  background:i<=current?'rgba(255,255,255,0.92)':'rgba(255,255,255,0.28)',
                  transition:'background 0.3s'
                }} />
              ))}
            </div>

            {/* Badge postura — esquina derecha */}
            <div style={{
              position:'absolute', top:30, right:14, zIndex:3,
              background:'rgba(255,255,255,0.18)', backdropFilter:'blur(6px)',
              borderRadius:12, padding:'5px 10px',
              display:'flex', alignItems:'center', gap:6
            }}>
              <span style={{ fontSize:18 }}>{postura.emoji}</span>
              <div>
                <p style={{ fontSize:8, color:'rgba(255,255,255,0.65)', margin:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>Postura</p>
                <p style={{ fontSize:10, color:'white', fontWeight:700, margin:0 }}>{postura.name}</p>
              </div>
            </div>

            {/* Título y preview del texto */}
            <div style={{ position:'relative', zIndex:2 }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:6,
                background:'rgba(255,255,255,0.2)', borderRadius:20,
                padding:'3px 12px', marginBottom:6
              }}>
                <div style={{
                  width:18, height:18, borderRadius:'50%',
                  background:'rgba(255,255,255,0.9)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:700, color:config.dark
                }}>
                  {current+1}
                </div>
                <span style={{ fontSize:10, fontWeight:700, color:'white', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  {config.label}
                </span>
              </div>
              <h3 style={{
                fontSize:17, fontWeight:700, color:'white', margin:'0 0 4px',
                fontFamily:"'Georgia','Times New Roman',serif",
                textShadow:'0 2px 6px rgba(0,0,0,0.4)',
                maxWidth:'62%'
              }}>
                {stepData.title}
              </h3>
              {/* Preview del texto — siempre visible en el header */}
              <p style={{
                fontSize:11, color:'rgba(255,255,255,0.82)', margin:0,
                fontStyle:'italic', lineHeight:1.45,
                maxWidth:'64%',
                textShadow:'0 1px 4px rgba(0,0,0,0.5)'
              }}>
                "{words(stepData.text, 12)}..."
              </p>
            </div>
          </div>

          {/* ── ZONA 2: TEXTO COLAPSABLE ── */}
          <div style={{ background:'white', borderLeft:`4px solid ${config.color}` }}>
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                width:'100%', padding:'12px 16px',
                background:'none', border:'none', cursor:'pointer',
                textAlign:'left', display:'flex', alignItems:'flex-start', gap:10
              }}
            >
              <div style={{ flex:1 }}>
                <p style={{
                  fontSize:13, color:'#374151', lineHeight:1.75,
                  fontStyle:'italic', margin:0,
                  fontFamily:"'Georgia','Times New Roman',serif"
                }}>
                  "{preview}
                  {/* Texto expandido */}
                  {hasMore && textExpanded && (
                    <span style={{ transition:'opacity 0.3s' }}> {rest}"</span>
                  )}
                  {hasMore && !textExpanded && (
                    <span style={{ color:config.color, fontStyle:'normal', fontWeight:600, fontSize:12 }}> leer más</span>
                  )}
                  {(!hasMore || textExpanded) && !textExpanded && '"'}
                  {textExpanded && !hasMore && '"'}
                </p>
              </div>
              {hasMore && (
                <div style={{
                  width:24, height:24, borderRadius:'50%',
                  background:config.color+'15',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0, marginTop:2,
                  transition:'transform 0.25s',
                  transform:textExpanded?'rotate(180deg)':'none'
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* ══ ZONA 3: AUDIOS UNIFICADOS ══ */}
          <div style={{ background:zoneBg, borderTop:`1.5px solid ${zoneBorder}`, padding:'12px 14px' }}>

            {/* Play de historia — protagonista */}
            <div style={{ marginBottom:10 }}>
              <p style={{ fontSize:9, fontWeight:700, color:config.color, margin:'0 0 7px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                🎧 Escucha esta parte
              </p>
              <AudioBtn
                src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                label={`Narración — ${stepData.title}`}
                sublabel="▶ Para el niño/a"
                color={config.color}
                bg={`${config.color}12`}
                size="large"
              />
            </div>

            {/* Separador con nombre de postura */}
            <div style={{ display:'flex', alignItems:'center', gap:8, margin:'0 0 8px' }}>
              <div style={{ flex:1, height:1, background:config.color+'25' }} />
              <span style={{ fontSize:9, color:config.color, fontWeight:700, whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                🧘 Postura: {postura.name}
              </span>
              <div style={{ flex:1, height:1, background:config.color+'25' }} />
            </div>

            {/* Audios de postura — compactos en fila */}
            <div style={{ display:'flex', gap:7, alignItems:'stretch' }}>
              <AudioBtn
                src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                label="Narración mágica"
                sublabel="👦 Para el niño/a"
                color="#E65100"
                bg="rgba(255,243,205,0.9)"
              />
              <AudioBtn
                src={`/audio/semana-${s}/s${s}howto${audioKey}.m4a`}
                label="Cómo hacer la postura"
                sublabel="👩 Para el adulto"
                color={config.color}
                bg="rgba(255,255,255,0.92)"
              />
              {/* Ver instrucciones */}
              <button
                onClick={() => {
                  const ev = new CustomEvent('kawa-ver-postura', { detail:{ posturaId:postura.id } })
                  window.dispatchEvent(ev)
                }}
                style={{
                  flexShrink:0, width:40,
                  background:'rgba(255,255,255,0.92)',
                  border:`1.5px solid ${config.color}30`,
                  borderRadius:10,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', gap:2
                }}
              >
                <span style={{ fontSize:16 }}>{postura.emoji}</span>
                <span style={{ fontSize:8, color:config.color, fontWeight:700 }}>Ver</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ══ NAVEGACIÓN ══ */}
      <div style={{
        background:'white', borderTop:'1px solid #F3F4F6',
        padding:'10px 14px', display:'flex', gap:8, alignItems:'center'
      }}>
        <button onClick={() => goTo(current-1)} disabled={current===0} style={{
          width:40, height:40, borderRadius:'50%',
          border:'1.5px solid #E5E7EB', background:'white',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, cursor:current===0?'default':'pointer',
          opacity:current===0?0.2:1, flexShrink:0
        }}>←</button>

        {current < total-1 ? (
          <button onClick={() => goTo(current+1)} style={{
            flex:1, padding:'12px', borderRadius:14,
            background:config.color, border:'none', cursor:'pointer',
            color:'white', fontSize:14, fontWeight:700,
            boxShadow:`0 3px 12px ${config.color}45`
          }}>
            Siguiente parte →
          </button>
        ) : (
          <button onClick={onComplete} style={{
            flex:1, padding:'12px', borderRadius:14,
            background:isCompleted?'#E8F5E9':config.color,
            border:isCompleted?`2px solid ${weekColors.main}`:'none',
            cursor:'pointer',
            color:isCompleted?weekColors.main:'white',
            fontSize:14, fontWeight:700,
            boxShadow:isCompleted?'none':`0 3px 12px ${config.color}45`
          }}>
            {isCompleted ? '⭐ Historia completada' : '⭐ Completar historia'}
          </button>
        )}

        <button onClick={() => goTo(current+1)} disabled={current===total-1} style={{
          width:40, height:40, borderRadius:'50%',
          border:'1.5px solid #E5E7EB', background:'white',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, cursor:current===total-1?'default':'pointer',
          opacity:current===total-1?0.2:1, flexShrink:0
        }}>→</button>
      </div>
    </div>
  )
}

// Helper — primeras N palabras
function words(text:string, n:number): string {
  return text.split(' ').slice(0, n).join(' ')
}
