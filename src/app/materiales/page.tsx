'use client'
import { useRouter } from 'next/navigation'
import { COURSE_WEEKS, WEEK_COLORS } from '@/lib/data/course'
import { useAppStore } from '@/lib/store'

const FICHAS = [
  { num:1, nombre:'Tierra', sistema:'Procesamiento táctil y propioceptivo',          color:'#1D9E75', light:'#E1F5EE', file:'/fichas/kawa_g1_tierra.pdf' },
  { num:2, nombre:'Agua',   sistema:'Procesamiento vestibular y movimiento',          color:'#1A6DB5', light:'#E4F1FB', file:'/fichas/kawa_g2_agua.pdf'  },
  { num:3, nombre:'Fuego',  sistema:'Regulación de la activación y sistema nervioso', color:'#C07010', light:'#FEF3DC', file:'/fichas/kawa_g3_fuego.pdf' },
  { num:4, nombre:'Aire',   sistema:'Respiración, interocepción y calma',             color:'#5448B8', light:'#EDEAFB', file:'/fichas/kawa_g4_aire.pdf'  },
  { num:5, nombre:'Éter',   sistema:'Integración sensorial global y cierre',          color:'#A02E1A', light:'#FCE9E5', file:'/fichas/kawa_g5_eter.pdf'  },
]

const GLOBAL_KIT = [
  { icon:'🌱', name:'Kawa de fieltro o lana',       desc:'La semilla protagonista. Se construye en semana 1 y viaja por todo el mapa.' },
  { icon:'🗺️', name:'Mapa de tela de los 5 mundos', desc:'A3 imprimible o bordado en tela. Kawa avanza cada semana.' },
  { icon:'🎲', name:'Dado sensorial',               desc:'5 caras con los elementos + 1 cara con Kawa. Para micro-prácticas espontáneas.' },
  { icon:'📔', name:'Diario del viaje',             desc:'5 páginas, una por semana. Se encuaderna al final del curso.' },
  { icon:'🃏', name:'Baraja de posturas',           desc:'20 cartas ilustradas con nombre mágico y símbolo del elemento.' },
  { icon:'🏅', name:'Diploma de Guardián/a',        desc:'Imprimible de cierre con los 5 símbolos y el nombre del niño.' },
]

export default function MaterialesPage() {
  const router = useRouter()
  const { userType, currentWeek } = useAppStore()

  return (
    <div style={{ minHeight:'100vh', background:'#FFFAF6', paddingBottom:96 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,#1B4332 0%,#2D6A4F 55%,#1A237E 100%)', padding:'48px 20px 22px', position:'relative', overflow:'hidden' }}>
        {[[15,20],[70,15],[85,40],[50,10],[40,50]].map(([x,y],i) => (
          <div key={i} style={{ position:'absolute', borderRadius:'50%', background:'white', width:i%3===0?2:1, height:i%3===0?2:1, left:`${x}%`, top:`${y}%`, opacity:0.3+(i%4)*0.1, pointerEvents:'none' }} />
        ))}
        <div style={{ position:'relative', zIndex:1 }}>
          <button onClick={() => router.push('/home')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(187,247,208,0.8)', fontSize:13, marginBottom:14, padding:0, display:'flex', alignItems:'center', gap:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Inicio
          </button>
          <h1 style={{ color:'white', fontSize:22, fontWeight:600, margin:'0 0 4px', fontFamily:"'Georgia',serif" }}>
            Kit de materiales
          </h1>
          <p style={{ color:'rgba(187,247,208,0.75)', fontSize:13, margin:0 }}>
            Todo lo que necesitas para el viaje de Kawa
          </p>
        </div>
      </div>

      <div style={{ padding:'14px 18px 0', display:'flex', flexDirection:'column', gap:12 }}>

        {/* Fichas — solo profesionales */}
        {userType === 'profesional' && (
          <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:0 }}>Fichas metodológicas</p>
              <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'#E1F5EE', color:'#085041', fontWeight:600 }}>Profesionales</span>
            </div>
            <p style={{ fontSize:11, color:'#C4A090', margin:'0 0 12px' }}>
              Base científica, indicadores clínicos y guía de aplicación por guardián.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {FICHAS.map(f => (
                <a key={f.num} href={f.file} download style={{
                  display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
                  borderRadius:12, background:f.light, textDecoration:'none'
                }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:13, fontWeight:700, flexShrink:0 }}>
                    {f.num}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:'#1A1A1A', margin:0 }}>Guardián {f.num} — {f.nombre}</p>
                    <p style={{ fontSize:10, color:'#6B7280', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.sistema}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:f.color }}>PDF</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Kit completo */}
        <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:'0 0 4px' }}>Kit completo del curso</p>
          <p style={{ fontSize:11, color:'#C4A090', margin:'0 0 12px' }}>Objetos que acompañan las 5 semanas</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {GLOBAL_KIT.map(item => (
              <div key={item.name} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#EAF6ED,#DDF0E4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize:12, fontWeight:500, color:'#2D1808', margin:'0 0 2px' }}>{item.name}</p>
                  <p style={{ fontSize:11, color:'#C4A090', margin:0, lineHeight:1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objetos por semana */}
        <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:'0 0 4px' }}>Objetos por semana</p>
          <p style={{ fontSize:11, color:'#C4A090', margin:'0 0 12px' }}>Un objeto táctil nuevo cada semana</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {COURSE_WEEKS.map(week => {
              const colors = WEEK_COLORS[week.id as keyof typeof WEEK_COLORS]
              return (
                <button key={week.id} onClick={() => router.push(`/semana/${week.id}`)} style={{
                  display:'flex', gap:12, alignItems:'flex-start', textAlign:'left',
                  background:'none', border:'none', cursor:'pointer', padding:'8px 0',
                  borderBottom:'0.5px solid #FFF4EE', width:'100%'
                }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:colors.light, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                    {week.elementEmoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:500, color:'#2D1808', margin:'0 0 2px' }}>
                      S{week.id} · {week.physicalObject.name}
                    </p>
                    <p style={{ fontSize:11, color:'#C4A090', margin:0, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {week.physicalObject.description}
                    </p>
                  </div>
                  <span style={{ color:'#D4C8C0', fontSize:14, marginTop:2 }}>→</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Modo sin pantalla */}
        <div style={{ background:'#FFFBEB', borderRadius:18, padding:'14px 16px', border:'1px solid #FDE68A' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#92400E', margin:'0 0 8px' }}>📱 Modo sin pantalla</p>
          <p style={{ fontSize:12, color:'#78350F', margin:'0 0 10px', lineHeight:1.6 }}>
            Descarga los PDFs cuando tengas conexión. Luego puedes hacer las clases completamente sin abrir la app.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            {[
              'Guía completa de cada semana (A4)',
              'Tarjetas de postura recortables',
              'Mapa de los 5 mundos (A3)',
              'Página del diario por semana',
            ].map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ color:'#D97706', fontSize:11 }}>✓</span>
                <span style={{ fontSize:12, color:'#78350F' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* NAV 3 ITEMS */}
      <nav style={{ position:'fixed', bottom:0, left:0, right:0, background:'white', borderTop:'0.5px solid #F0E8E0', display:'flex', maxWidth:430, margin:'0 auto', zIndex:40 }}>
        {[
          { href:'/home',                  icon:'🗺️', label:'Inicio'    },
          { href:`/semana/${currentWeek}`, icon:'🧘', label:'Practica'  },
          { href:'/progreso',              icon:'📖', label:'Mi diario' },
        ].map(({ href, icon, label }) => (
          <button key={href} onClick={() => router.push(href)} style={{ flex:1, padding:'12px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer' }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <span style={{ fontSize:10, fontWeight:500, color:'#C4A090' }}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
