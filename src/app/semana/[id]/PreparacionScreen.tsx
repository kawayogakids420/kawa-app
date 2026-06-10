'use client'
import { useRouter } from 'next/navigation'
import type { Week } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'

// Materiales por semana
const MATERIALES: Record<number, { icon: string; name: string; desc: string }[]> = {
  1: [
    { icon:'🪨', name:'Piedra suave y fría',        desc:'Objeto táctil principal' },
    { icon:'🧘', name:'Colchoneta o manta',          desc:'Para las posturas' },
    { icon:'🌿', name:'Música suave de bosque',      desc:'Opcional — ambiental' },
  ],
  2: [
    { icon:'💧', name:'Tela azul suave',             desc:'Objeto táctil del agua' },
    { icon:'🥣', name:'Bol pequeño con agua',        desc:'Para exploración sensorial' },
    { icon:'🧘', name:'Colchoneta',                  desc:'Para las posturas' },
  ],
  3: [
    { icon:'🪶', name:'Pluma o papel liviano',       desc:'Objeto táctil del aire' },
    { icon:'🤸', name:'Espacio amplio',              desc:'Para abrir los brazos' },
    { icon:'🧘', name:'Colchoneta',                  desc:'Para las posturas' },
  ],
  4: [
    { icon:'🟠', name:'Piedra naranja o cálida',     desc:'Objeto táctil del fuego' },
    { icon:'🧘', name:'Colchoneta',                  desc:'Para las posturas' },
    { icon:'🕯️', name:'Luz cálida',                 desc:'Opcional — ambiental' },
  ],
  5: [
    { icon:'✨', name:'Los 4 objetos del curso',     desc:'Reunión final de guardianes' },
    { icon:'🌌', name:'Tela oscura con estrellas',   desc:'Objeto táctil del éter' },
    { icon:'🧘', name:'Colchoneta',                  desc:'Para las posturas' },
  ],
}

const CONSEJOS: Record<number, string> = {
  1: 'Esta semana Kawa aprende a arraigarse. Sigue el audio y acompaña a tu niño/a sin corregir — solo acompañar.',
  2: 'El agua fluye sin forzar. Deja que tu niño/a explore el movimiento a su ritmo, sin dirección rígida.',
  3: 'El aire es libre. Esta semana da espacio — deja que tu niño/a se exprese con el cuerpo.',
  4: 'El fuego transforma. Si tu niño/a se activa mucho, es normal — es parte del proceso.',
  5: 'Es el cierre del viaje. Celebra todo lo recorrido — cada momento cuenta.',
}

const WARM_GRADIENTS: Record<number, string> = {
  1: 'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  2: 'linear-gradient(150deg,#B8E4FF 0%,#C8D4FF 50%,#E0C8FF 100%)',
  3: 'linear-gradient(150deg,#D4F0FF 0%,#C8E8F8 50%,#D8D0FF 100%)',
  4: 'linear-gradient(150deg,#FFD4A0 0%,#FFB890 50%,#FF9898 100%)',
  5: 'linear-gradient(150deg,#F8D4FF 0%,#E8C8FF 50%,#C8D8FF 100%)',
}

const WARM_TEXT: Record<number, { title: string; sub: string }> = {
  1: { title:'#7A3520', sub:'rgba(140,70,50,0.65)'  },
  2: { title:'#1A2870', sub:'rgba(40,60,140,0.6)'   },
  3: { title:'#1A3060', sub:'rgba(30,60,120,0.6)'   },
  4: { title:'#7A2010', sub:'rgba(140,50,20,0.65)'  },
  5: { title:'#4A1870', sub:'rgba(90,40,130,0.6)'   },
}

const CTA_GRADIENTS: Record<number, string> = {
  1: 'linear-gradient(135deg,#F4B880,#E89860)',
  2: 'linear-gradient(135deg,#80B0F4,#6090E8)',
  3: 'linear-gradient(135deg,#80C8F4,#60B0E8)',
  4: 'linear-gradient(135deg,#F4A070,#E87850)',
  5: 'linear-gradient(135deg,#C880F4,#A860E8)',
}

const ICON_BG: Record<number, string> = {
  1: 'linear-gradient(135deg,#FFF8D6,#FFF0B0)',
  2: 'linear-gradient(135deg,#D8F0FF,#C8E4FF)',
  3: 'linear-gradient(135deg,#D8F4FF,#C8E8FF)',
  4: 'linear-gradient(135deg,#FFE8D0,#FFD4B8)',
  5: 'linear-gradient(135deg,#F0D8FF,#E4C8FF)',
}

interface Props {
  week: Week
  onStart: () => void
}

export default function PreparacionScreen({ week, onStart }: Props) {
  const router   = useRouter()
  const { children, activeChildId } = useAppStore()
  const child    = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const wid      = week.id
  const gradient = WARM_GRADIENTS[wid] || WARM_GRADIENTS[1]
  const textCols = WARM_TEXT[wid]      || WARM_TEXT[1]
  const ctaGrad  = CTA_GRADIENTS[wid]  || CTA_GRADIENTS[1]
  const iconBg   = ICON_BG[wid]        || ICON_BG[1]
  const mats     = MATERIALES[wid]     || MATERIALES[1]
  const consejo  = CONSEJOS[wid]       || CONSEJOS[1]
  const nombre   = child?.name || 'Guardián'

  return (
    <div style={{ minHeight:'100vh', background:'#FFFAF6', display:'flex', flexDirection:'column' }}>

      {/* Header degradado cálido */}
      <div style={{ background:gradient, padding:'48px 20px 18px', position:'relative', overflow:'hidden', flexShrink:0 }}>
        <div style={{ position:'absolute', top:-24, right:-24, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.32)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-14, left:10, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.2)', pointerEvents:'none' }} />

        <button onClick={() => router.back()} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:textCols.sub, fontSize:13, marginBottom:16, padding:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver
        </button>

        <p style={{ fontSize:11, color:textCols.sub, margin:'0 0 3px', fontWeight:500 }}>
          Semana {week.id} · {week.element}
        </p>
        <h1 style={{ fontSize:22, fontWeight:600, color:textCols.title, margin:'0 0 4px', fontFamily:"'Georgia','Times New Roman',serif", lineHeight:1.2 }}>
          Antes de empezar
        </h1>
        <p style={{ fontSize:11, color:textCols.sub, margin:0, fontStyle:'italic' }}>
          "{week.teaching}"
        </p>
      </div>

      {/* Contenido */}
      <div style={{ padding:'14px 16px', flex:1, display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>

        {/* Materiales */}
        <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', border:'0.5px solid #F0E8E0' }}>
          <div style={{ padding:'11px 16px', borderBottom:'0.5px solid #FFF4EE', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:18 }}>📦</span>
            <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:0 }}>Prepara estos materiales</p>
          </div>
          <div style={{ padding:'4px 16px' }}>
            {mats.map((m, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom: i < mats.length-1 ? '0.5px solid #FFF8F2' : 'none' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                  {m.icon}
                </div>
                <div>
                  <p style={{ fontSize:12, color:'#2D1808', fontWeight:500, margin:0 }}>{m.name}</p>
                  <p style={{ fontSize:10, color:'#C4A090', margin:0 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consejo para el adulto */}
        <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', border:'0.5px solid #F0E8E0' }}>
          <div style={{ padding:'11px 16px', borderBottom:'0.5px solid #FFF4EE', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:18 }}>💡</span>
            <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:0 }}>Para el adulto</p>
          </div>
          <div style={{ padding:'12px 16px' }}>
            <p style={{ fontSize:12, color:'#4A3020', margin:0, lineHeight:1.7 }}>{consejo}</p>
          </div>
        </div>

        {/* Duración info */}
        <div style={{ background:'#fff', borderRadius:18, padding:'12px 16px', border:'0.5px solid #F0E8E0', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>⏱️</div>
          <div>
            <p style={{ fontSize:12, color:'#2D1808', fontWeight:500, margin:0 }}>La clase toma unos 45 minutos</p>
            <p style={{ fontSize:10, color:'#C4A090', margin:0 }}>Puedes hacerla en partes si lo necesitas</p>
          </div>
        </div>

      </div>

      {/* CTA fijo abajo */}
      <div style={{ padding:'12px 16px 28px', background:'#FFFAF6', borderTop:'0.5px solid #F0E8E0', flexShrink:0 }}>
        <button
          onClick={onStart}
          style={{
            width:'100%', padding:'15px', borderRadius:16,
            background:ctaGrad, border:'none', cursor:'pointer',
            color:'#fff', fontSize:15, fontWeight:600,
            boxShadow:'0 4px 16px rgba(220,160,100,0.35)'
          }}>
          ¡Vamos, {nombre}! →
        </button>
      </div>
    </div>
  )
}
