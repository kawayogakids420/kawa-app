'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type { Week } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'

// ── Configuración por parte ───────────────────────────────────────────────────
const STEP_CONFIG = {
  inicio:        { label: 'Inicio',        color: '#2D6A4F', dark: '#1B4332', bg: 'linear-gradient(160deg,#1B4332,#2D6A4F)' },
  desequilibrio: { label: 'Desequilibrio', color: '#E64A19', dark: '#BF360C', bg: 'linear-gradient(160deg,#BF360C,#E64A19)' },
  accion:        { label: 'Acción',        color: '#1976D2', dark: '#0D47A1', bg: 'linear-gradient(160deg,#0D47A1,#1976D2)' },
  catarsis:      { label: 'Catarsis',      color: '#7B1FA2', dark: '#4A148C', bg: 'linear-gradient(160deg,#4A148C,#7B1FA2)' },
  ensenanza:     { label: 'Enseñanza',     color: '#F57F17', dark: '#E65100', bg: 'linear-gradient(160deg,#E65100,#F57F17)' },
}
const STEP_KEYS = ['inicio','desequilibrio','accion','catarsis','ensenanza'] as const
type StepKey = typeof STEP_KEYS[number]

// ── Posturas por semana y parte ───────────────────────────────────────────────
const POSTURA_POR_PARTE: Record<number, Record<StepKey, { emoji: string; name: string; magic: string; id: string }>> = {
  1: {
    inicio:        { emoji:'🏔️', name:'Montaña',          magic:'El Cuerpo que No Tiembla',    id:'montana' },
    desequilibrio: { emoji:'🐢', name:'Tortuga',           magic:'La Casa que Siempre Llevas',  id:'tortuga' },
    accion:        { emoji:'🧘', name:'Postura del Indio', magic:'El Trono de Oma',              id:'indio' },
    catarsis:      { emoji:'🐱', name:'Gato I y II',       magic:'La Espalda que Respira',       id:'gato' },
    ensenanza:     { emoji:'🌲', name:'Árbol',             magic:'Las Raíces que Suben',         id:'arbol' },
  },
  2: {
    inicio:        { emoji:'🧒', name:'Postura del Niño',  magic:'El Caracol del Fondo del Mar', id:'postura_nino' },
    desequilibrio: { emoji:'🦋', name:'Mariposa',          magic:'La Raya que Baila en el Agua', id:'mariposa' },
    accion:        { emoji:'🐍', name:'Cobra',             magic:'La Serpiente que Sale del Mar', id:'cobra' },
    catarsis:      { emoji:'🌉', name:'Puente',            magic:'La Gran Ola de Kawa',          id:'puente' },
    ensenanza:     { emoji:'🦋', name:'Mariposa',          magic:'La Raya que Baila en el Agua', id:'mariposa' },
  },
  3: {
    inicio:        { emoji:'⚔️', name:'Guerrero II',       magic:'Kawa Abre las Alas',           id:'guerrero2' },
    desequilibrio: { emoji:'🦅', name:'Gaviota',           magic:'El Vuelo de Inti',             id:'gaviota' },
    accion:        { emoji:'🚢', name:'Barco',             magic:'La Nave del Viento',           id:'barco' },
    catarsis:      { emoji:'🧸', name:'Marioneta',         magic:'Los Hilos que se Sueltan',     id:'marioneta' },
    ensenanza:     { emoji:'⚔️', name:'Guerrero II',       magic:'Kawa Abre las Alas',           id:'guerrero2' },
  },
  4: {
    inicio:        { emoji:'🐍', name:'Cobra Profunda',    magic:'La Llama que Sube',            id:'cobra_profunda' },
    desequilibrio: { emoji:'⚔️', name:'Guerrero I',        magic:'La Llama Conquistadora',       id:'guerrero1' },
    accion:        { emoji:'☀️', name:'Saludo al Sol',     magic:'La Danza del Volcán',          id:'saludo_sol' },
    catarsis:      { emoji:'🌸', name:'Flor de Loto',      magic:'La Rosa que Nace del Fuego',   id:'flor_loto' },
    ensenanza:     { emoji:'🌸', name:'Flor de Loto',      magic:'La Rosa que Nace del Fuego',   id:'flor_loto' },
  },
  5: {
    inicio:        { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',           id:'secuencia_completa' },
    desequilibrio: { emoji:'🫀', name:'OM de la Ballena',   magic:'La Vibración del Origen',     id:'om_ballena' },
    accion:        { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',           id:'secuencia_completa' },
    catarsis:      { emoji:'🫀', name:'OM de la Ballena',   magic:'La Vibración del Origen',     id:'om_ballena' },
    ensenanza:     { emoji:'🌌', name:'Secuencia Completa', magic:'El Viaje Completo',           id:'secuencia_completa' },
  },
}

const AUDIO_MAP: Record<string, string> = {
  montana:'montana', indio:'posturaindio', tortuga:'posturatortuga',
  gato:'gatolYII', arbol:'posturaarbol',
}

// ── Imagen de postura según género ────────────────────────────────────────────
function PosturaImage({ weekId, posturaId, gender }: {
  weekId: number; posturaId: string; gender: 'male' | 'female'
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const genero = gender === 'female' ? 'nina' : 'nino'

  useEffect(() => {
    if (weekId > 3) { setImgSrc(null); return }
    const tryJpg = `/posturas/semana-${weekId}/${genero}/${posturaId}.jpg`
    const tryPng = `/posturas/semana-${weekId}/${genero}/${posturaId}.png`
    const img = new Image()
    img.onload  = () => setImgSrc(tryJpg)
    img.onerror = () => {
      const img2 = new Image()
      img2.onload  = () => setImgSrc(tryPng)
      img2.onerror = () => setImgSrc(null)
      img2.src = tryPng
    }
    img.src = tryJpg
  }, [weekId, posturaId, genero])

  if (!imgSrc) return null

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <img src={imgSrc} alt="" style={{
        position:'absolute', right:0, bottom:0,
        height:'100%', width:'auto',
        objectFit:'contain', objectPosition:'bottom right',
        opacity:0.45,
      }} />
      {/* Degradado izquierdo para que el texto sea legible */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 75%)'
      }} />
    </div>
  )
}

// ── Botón de audio compacto ───────────────────────────────────────────────────
function AudioBtn({ src, label, forChild=false, color='#2D6A4F' }: {
  src:string; label:string; forChild?:boolean; color?:string
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
    a.addEventListener('timeupdate',t)
    a.addEventListener('loadedmetadata',d)
    a.addEventListener('ended',e)
    a.addEventListener('error',er)
    return () => {
      a.removeEventListener('timeupdate',t)
      a.removeEventListener('loadedmetadata',d)
      a.removeEventListener('ended',e)
      a.removeEventListener('error',er)
    }
  }, [])

  if (error) return null
  const pct    = duration ? (progress/duration)*100 : 0
  const fmt    = (s:number) => isNaN(s)||!s ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  const accent = forChild ? '#E65100' : color

  return (
    <button onClick={() => {
      const a = audioRef.current; if (!a) return
      if (playing) { a.pause(); setPlaying(false) }
      else { a.play().catch(()=>{}); setPlaying(true) }
    }} style={{
      flex:1, padding:'9px 10px', borderRadius:12,
      background: forChild ? 'rgba(255,243,205,0.95)' : 'rgba(255,255,255,0.92)',
      border:`1.5px solid ${accent}35`,
      display:'flex', alignItems:'center', gap:8,
      cursor:'pointer', textAlign:'left'
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{
        width:34, height:34, borderRadius:'50%',
        background:accent, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 2px 6px ${accent}45`
      }}>
        {playing
          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:9, color:accent, margin:'0 0 2px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>
          {forChild ? '👦 Para el niño/a' : '👩 Para el adulto'}
        </p>
        <p style={{ fontSize:11, fontWeight:600, color:'#374151', margin:'0 0 4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {label}
        </p>
        <div style={{ height:3, background:'rgba(0,0,0,0.1)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:accent, borderRadius:2, transition:'width 0.3s' }} />
        </div>
      </div>
      <span style={{ fontSize:9, color:'#9CA3AF', flexShrink:0 }}>{fmt(progress)}</span>
    </button>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
interface Props {
  week: Week
  weekColors: { main:string; light:string }
  onComplete: () => void
  isCompleted: boolean
  currentStep?: number
  onStepChange?: (step:number) => void
}

export default function HistoriaKawa({ week, weekColors, onComplete, isCompleted, currentStep=0, onStepChange }: Props) {
  const { children, activeChildId } = useAppStore()
  const activeChild = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const gender      = activeChild?.gender ?? 'male'

  const [current, setCurrent]   = useState(currentStep)
  const [animating, setAnim]    = useState(false)
  const [slideDir, setDir]      = useState<'left'|'right'>('left')
  const touchX                  = useRef(0)

  const steps   = Object.entries(week.story)
  const total   = steps.length
  const stepKey = STEP_KEYS[current] as StepKey
  const config  = STEP_CONFIG[stepKey] || STEP_CONFIG.inicio
  const posturas = POSTURA_POR_PARTE[week.id] || POSTURA_POR_PARTE[1]
  const postura  = posturas[stepKey] || posturas.inicio
  const s        = week.id
  const audioKey = AUDIO_MAP[postura.id] || postura.id
  const [, stepData] = steps[current]

  const goTo = useCallback((idx:number) => {
    if (animating || idx===current || idx<0 || idx>=total) return
    setDir(idx>current ? 'left' : 'right')
    setAnim(true)
    setTimeout(() => {
      setCurrent(idx)
      onStepChange?.(idx)
      setAnim(false)
    }, 280)
  }, [animating, current, total, onStepChange])

  const onTouchStart = (e:React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e:React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) dx < 0 ? goTo(current+1) : goTo(current-1)
  }

  // Color de la zona inferior — ligeramente más claro que el color del guardián
  const zoneBg   = config.color + '12'
  const zoneBorder = config.color + '30'

  return (
    <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.12)' }}>

      {/* ══ ZONA 1: IMAGEN + HISTORIA (carrusel) ══ */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ position:'relative', overflow:'hidden' }}
      >
        <div style={{
          opacity: animating ? 0 : 1,
          transform: animating ? (slideDir==='left' ? 'translateX(-6%)' : 'translateX(6%)') : 'none',
          transition: animating ? 'all 0.28s ease' : 'none',
        }}>

          {/* Header con imagen de postura de fondo */}
          <div style={{
            background: config.bg,
            height: 200,
            position:'relative',
            overflow:'hidden',
            display:'flex', flexDirection:'column',
            justifyContent:'flex-end',
            padding:'0 18px 14px'
          }}>
            {/* Decorativos */}
            <div style={{ position:'absolute', top:-30, left:-30, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />

            {/* Imagen de postura según género */}
            <PosturaImage weekId={week.id} posturaId={postura.id} gender={gender} />

            {/* Barra de progreso tipo stories */}
            <div style={{ position:'absolute', top:12, left:0, right:0, display:'flex', gap:4, padding:'0 14px', zIndex:2 }}>
              {steps.map((_,i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  flex:1, height:3, borderRadius:2, border:'none', cursor:'pointer', padding:0,
                  background: i<=current ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.28)',
                  transition:'background 0.3s'
                }} />
              ))}
            </div>

            {/* Badge número + label */}
            <div style={{ position:'relative', zIndex:2 }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:6,
                background:'rgba(255,255,255,0.2)',
                borderRadius:20, padding:'4px 12px', marginBottom:8
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
                fontSize:17, fontWeight:700, color:'white', margin:0,
                fontFamily:"'Georgia','Times New Roman',serif",
                textShadow:'0 2px 6px rgba(0,0,0,0.4)',
                maxWidth:'65%'
              }}>
                {stepData.title}
              </h3>
            </div>

            {/* Postura en esquina superior derecha */}
            <div style={{
              position:'absolute', top:32, right:14, zIndex:3,
              background:'rgba(255,255,255,0.18)',
              backdropFilter:'blur(6px)',
              borderRadius:12, padding:'6px 10px',
              display:'flex', alignItems:'center', gap:6
            }}>
              <span style={{ fontSize:20 }}>{postura.emoji}</span>
              <div>
                <p style={{ fontSize:8, color:'rgba(255,255,255,0.7)', margin:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>Postura</p>
                <p style={{ fontSize:10, color:'white', fontWeight:700, margin:0 }}>{postura.name}</p>
              </div>
            </div>
          </div>

          {/* Texto de la historia */}
          <div style={{
            background:'white',
            padding:'14px 18px',
            borderLeft:`4px solid ${config.color}`
          }}>
            <p style={{
              fontSize:13, color:'#374151', lineHeight:1.8,
              fontStyle:'italic', margin:0,
              fontFamily:"'Georgia','Times New Roman',serif"
            }}>
              "{stepData.text}"
            </p>
          </div>

          {/* ══ ZONA 2 VERDE: audios + postura unificados ══ */}
          <div style={{
            background: zoneBg,
            borderTop:`1.5px solid ${zoneBorder}`,
            padding:'12px 14px'
          }}>
            {/* Label unificado — todo en contexto */}
            <p style={{
              fontSize:9, fontWeight:700, color:config.color,
              margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.08em'
            }}>
              🧘 {postura.name} — "{postura.magic}"
            </p>

            {/* Fila de audios */}
            <div style={{ display:'flex', gap:8, marginBottom:8 }}>
              <AudioBtn
                src={`/audio/semana-${s}/s${s}postura${audioKey}historia.m4a`}
                label="Narración mágica"
                forChild={true}
                color={config.color}
              />
              <AudioBtn
                src={`/audio/semana-${s}/s${s}howto${audioKey}.m4a`}
                label="Cómo hacer la postura"
                forChild={false}
                color={config.color}
              />
            </div>

            {/* Botón ver instrucciones completas */}
            <button
              onClick={() => {
                const ev = new CustomEvent('kawa-ver-postura', { detail:{ posturaId:postura.id } })
                window.dispatchEvent(ev)
              }}
              style={{
                width:'100%', padding:'8px 12px', borderRadius:10,
                background:'white', border:`1px solid ${config.color}30`,
                display:'flex', alignItems:'center', justifyContent:'space-between',
                cursor:'pointer', boxSizing:'border-box'
              }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:18 }}>{postura.emoji}</span>
                <span style={{ fontSize:11, color:'#374151', fontWeight:500 }}>
                  Ver instrucciones completas de {postura.name}
                </span>
              </div>
              <span style={{ fontSize:12, color:config.color, fontWeight:700, flexShrink:0 }}>→</span>
            </button>
          </div>

        </div>
      </div>

      {/* ══ ZONA 3: NAVEGACIÓN ══ */}
      <div style={{
        background:'white',
        borderTop:'1px solid #F3F4F6',
        padding:'10px 14px',
        display:'flex', gap:8, alignItems:'center'
      }}>
        <button
          onClick={() => goTo(current-1)}
          disabled={current===0}
          style={{
            width:40, height:40, borderRadius:'50%',
            border:'1.5px solid #E5E7EB', background:'white',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, cursor:current===0 ? 'default':'pointer',
            opacity:current===0 ? 0.25:1, flexShrink:0
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
            background: isCompleted ? '#E8F5E9' : config.color,
            border: isCompleted ? `2px solid ${weekColors.main}` : 'none',
            cursor:'pointer',
            color: isCompleted ? weekColors.main : 'white',
            fontSize:14, fontWeight:700,
            boxShadow: isCompleted ? 'none' : `0 3px 12px ${config.color}45`
          }}>
            {isCompleted ? '⭐ Historia completada' : '⭐ Completar historia'}
          </button>
        )}

        <button
          onClick={() => goTo(current+1)}
          disabled={current===total-1}
          style={{
            width:40, height:40, borderRadius:'50%',
            border:'1.5px solid #E5E7EB', background:'white',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, cursor:current===total-1 ? 'default':'pointer',
            opacity:current===total-1 ? 0.25:1, flexShrink:0
          }}>→</button>
      </div>
    </div>
  )
}
