'use client'
import type { Week } from '@/lib/data/course'

interface Props {
  week: Week
  weekColors: { main: string; light: string }
}

// Degradados cálidos por guardián — mismos que page.tsx
const WARM_GRADIENTS: Record<number, string> = {
  1: 'linear-gradient(135deg, #FFD8A0 0%, #F8C0B0 50%, #F0B8C8 100%)',
  2: 'linear-gradient(135deg, #A8D8FF 0%, #B8C8FF 50%, #D0B8FF 100%)',
  3: 'linear-gradient(135deg, #B8E8FF 0%, #B0D8F8 50%, #C8C0FF 100%)',
  4: 'linear-gradient(135deg, #FFD0A0 0%, #FFB888 50%, #FF9090 100%)',
  5: 'linear-gradient(135deg, #F0C8FF 0%, #E0B8FF 50%, #C0C8FF 100%)',
}

const WARM_TEXT: Record<number, string> = {
  1: '#6A2A10',
  2: '#1A2870',
  3: '#1A3060',
  4: '#6A1808',
  5: '#3A1060',
}

// Colores pastel para iconos de materiales por semana
const ICON_BG: Record<number, string> = {
  1: 'linear-gradient(135deg, #FFF8D6, #FFF0B0)',
  2: 'linear-gradient(135deg, #D8F0FF, #C8E4FF)',
  3: 'linear-gradient(135deg, #D8F4FF, #C8E8FF)',
  4: 'linear-gradient(135deg, #FFE8D0, #FFD4B8)',
  5: 'linear-gradient(135deg, #F0D8FF, #E4C8FF)',
}

const PDF_BTN: Record<number, string> = {
  1: 'linear-gradient(135deg, #F4B880, #E89860)',
  2: 'linear-gradient(135deg, #80B0F4, #6090E8)',
  3: 'linear-gradient(135deg, #80C8F4, #60B0E8)',
  4: 'linear-gradient(135deg, #F4A070, #E87850)',
  5: 'linear-gradient(135deg, #C880F4, #A860E8)',
}

export default function MaterialesTab({ week, weekColors }: Props) {
  const { artActivity, physicalObject } = week
  const wid      = week.id
  const gradient = WARM_GRADIENTS[wid] || WARM_GRADIENTS[1]
  const titleCol = WARM_TEXT[wid]      || WARM_TEXT[1]
  const iconBg   = ICON_BG[wid]        || ICON_BG[1]
  const pdfBtn   = PDF_BTN[wid]        || PDF_BTN[1]

  // Lista de materiales de clase
  const claseMaterials = [
    { icon:'🪨', name: week.tactileObject,       desc:'Objeto táctil principal' },
    { icon:'🧘', name:'Colchoneta o manta',       desc:'Para las posturas' },
    { icon:'🌿', name:'Música suave de ambiente', desc:'Opcional — ambiental' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, paddingBottom:16 }}>

      {/* ── IDENTIDAD DEL MUNDO ── */}
      <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 4px 16px rgba(200,150,120,0.12)' }}>
        {/* Header con degradado */}
        <div style={{ background: gradient, padding:'13px 16px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:42, height:42, borderRadius:13,
            background:'rgba(255,255,255,0.42)',
            border:'1px solid rgba(255,255,255,0.65)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:22, flexShrink:0
          }}>
            {week.elementEmoji}
          </div>
          <div>
            <p style={{ fontSize:9, color: titleCol, opacity:0.65, margin:0, textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Identidad del mundo</p>
            <p style={{ fontSize:14, color: titleCol, fontWeight:600, margin:0 }}>Guardián de la {week.element}</p>
          </div>
        </div>

        {/* Objeto táctil + Color */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
          <div style={{ padding:'11px 16px', borderRight:'1px solid #FFF4EE' }}>
            <p style={{ fontSize:9, color:'#C4A090', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Objeto táctil</p>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:16 }}>🖐️</span>
              <p style={{ fontSize:12, color:'#2D1808', fontWeight:500, margin:0 }}>{week.tactileObject}</p>
            </div>
          </div>
          <div style={{ padding:'11px 16px' }}>
            <p style={{ fontSize:9, color:'#C4A090', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Color del mundo</p>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:14, height:14, borderRadius:'50%', background: weekColors.main, flexShrink:0, border:'1px solid rgba(0,0,0,0.08)' }} />
              <p style={{ fontSize:12, color:'#2D1808', fontWeight:500, margin:0 }}>{week.colorName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MATERIALES DE CLASE ── */}
      <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 4px 16px rgba(200,150,120,0.1)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid #FFF4EE' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:0 }}>Para la clase de hoy</p>
        </div>
        <div style={{ padding:'4px 16px' }}>
          {claseMaterials.map((m, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'9px 0',
              borderBottom: i < claseMaterials.length-1 ? '1px solid #FFF8F2' : 'none'
            }}>
              <div style={{
                width:36, height:36, borderRadius:10,
                background: iconBg,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18, flexShrink:0
              }}>
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

      {/* ── OBJETO FÍSICO ── */}
      <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 4px 16px rgba(200,150,120,0.1)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid #FFF4EE', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background: iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🛠️</div>
          <div>
            <p style={{ fontSize:10, color:'#C4A090', margin:0, textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>Objeto físico de la semana</p>
            <p style={{ fontSize:13, color:'#2D1808', fontWeight:600, margin:0 }}>{physicalObject.name}</p>
          </div>
        </div>
        <div style={{ padding:'12px 16px' }}>
          <p style={{ fontSize:12, color:'#4A3020', margin:'0 0 10px', lineHeight:1.65 }}>{physicalObject.description}</p>
          <div style={{ background:'#FFF8F2', borderRadius:12, padding:'10px 13px', marginBottom:10, borderLeft:`3px solid ${weekColors.main}80` }}>
            <p style={{ fontSize:10, color:'#B87840', fontWeight:600, margin:'0 0 5px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Cómo construirlo</p>
            <p style={{ fontSize:12, color:'#4A3020', margin:0, lineHeight:1.6 }}>{physicalObject.howToBuild}</p>
          </div>
          <div style={{ background:'#FFF0F4', borderRadius:12, padding:'10px 13px', border:'1px solid rgba(220,160,180,0.25)' }}>
            <p style={{ fontSize:10, color:'#B05870', fontWeight:600, margin:'0 0 5px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Uso terapéutico</p>
            <p style={{ fontSize:12, color:'#4A2030', margin:0, lineHeight:1.6 }}>{physicalObject.therapeuticUse}</p>
          </div>
        </div>
      </div>

      {/* ── ACTIVIDAD DE ARTE ── */}
      <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 4px 16px rgba(200,150,120,0.1)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid #FFF4EE', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background: iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🎨</div>
          <div>
            <p style={{ fontSize:10, color:'#C4A090', margin:0, textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>Arte post-yoga</p>
            <p style={{ fontSize:13, color:'#2D1808', fontWeight:600, margin:0 }}>{artActivity.name}</p>
          </div>
        </div>
        <div style={{ padding:'12px 16px' }}>
          {/* Materiales */}
          <p style={{ fontSize:10, color:'#C4A090', fontWeight:600, margin:'0 0 7px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Materiales</p>
          <div style={{ marginBottom:12, display:'flex', flexDirection:'column', gap:5 }}>
            {artActivity.materials.map((m, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background: weekColors.main, flexShrink:0, opacity:0.6 }} />
                <p style={{ fontSize:12, color:'#4A3020', margin:0 }}>{m}</p>
              </div>
            ))}
          </div>
          {/* Pasos */}
          <p style={{ fontSize:10, color:'#C4A090', fontWeight:600, margin:'0 0 7px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Paso a paso</p>
          <div style={{ marginBottom:12, display:'flex', flexDirection:'column', gap:8 }}>
            {artActivity.steps.map((step, i) => (
              <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{
                  width:22, height:22, borderRadius:'50%',
                  background:`linear-gradient(135deg, ${weekColors.main}, ${weekColors.main}AA)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:700, color:'#fff', flexShrink:0, marginTop:1
                }}>
                  {i+1}
                </div>
                <p style={{ fontSize:12, color:'#4A3020', margin:0, lineHeight:1.6 }}>{step}</p>
              </div>
            ))}
          </div>
          {/* Nota terapéutica */}
          <div style={{ background:'#FFF8EE', borderRadius:12, padding:'10px 13px', border:'1px solid rgba(220,180,100,0.3)' }}>
            <p style={{ fontSize:10, color:'#B87840', fontWeight:600, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Conexión terapéutica</p>
            <p style={{ fontSize:12, color:'#4A3010', margin:0, lineHeight:1.6 }}>{artActivity.therapeuticNote}</p>
          </div>
        </div>
      </div>

      {/* ── FICHAS PDF ── */}
      <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 4px 16px rgba(200,150,120,0.1)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid #FFF4EE' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:0 }}>Fichas para imprimir</p>
        </div>
        <div style={{ padding:'4px 16px' }}>
          {[
            { name:'Guía de clase completa',  desc:'Posturas ilustradas + historia',       icon:'📋' },
            { name:'Tarjetas de posturas',     desc:'5 tarjetas con nombre mágico',         icon:'🃏' },
            { name:'Micro-prácticas del día',  desc:'Tarjeta imán para la nevera',          icon:'🧲' },
            { name:'Página del diario',        desc:'Para que el niño dibuje después',      icon:'📓' },
          ].map((item, i, arr) => (
            <div key={item.name} style={{
              display:'flex', alignItems:'center', gap:12, padding:'9px 0',
              borderBottom: i < arr.length-1 ? '1px solid #FFF8F2':'none'
            }}>
              <div style={{ width:36, height:36, borderRadius:10, background: iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {item.icon}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, color:'#2D1808', fontWeight:500, margin:0 }}>{item.name}</p>
                <p style={{ fontSize:10, color:'#C4A090', margin:0 }}>{item.desc}</p>
              </div>
              <button style={{
                background: pdfBtn, border:'none', borderRadius:9,
                padding:'5px 11px', display:'flex', alignItems:'center', gap:5,
                cursor:'pointer', flexShrink:0
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 4v12m-6-6l6 6 6-6"/><path d="M4 20h16"/>
                </svg>
                <span style={{ fontSize:9, color:'#fff', fontWeight:600 }}>PDF</span>
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize:10, color:'#C4A090', textAlign:'center', padding:'8px 16px 14px' }}>
          Los PDFs se descargan en alta resolución para imprimir en casa
        </p>
      </div>

    </div>
  )
}
