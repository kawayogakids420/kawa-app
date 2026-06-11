'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Suspense } from 'react'

const FAMILIA_FEATURES = [
  '5 mundos desbloqueados',
  'Hasta 3 niños/as',
  'Todos los audios de historia y posturas',
  'Materiales descargables',
  'Diario de progreso',
  'Adaptaciones por perfil sensorial',
]

const PRO_FEATURES = [
  'Todo lo del plan Familia',
  'Niños/as ilimitados',
  'Protocolo clínico TO por guardián',
  'Fichas metodológicas PDF',
  'Acceso anticipado a nuevos mundos',
  'Herramientas de registro clínico',
]

function MembresiaContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const fromWeek1    = searchParams.get('from') === 'semana1'
  const { currentWeek, children, activeChildId } = useAppStore()

  const child     = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const childName = child?.name || 'tu guardián/a'

  return (
    <div style={{ minHeight:'100vh', background:'#FFFAF6', paddingBottom:40 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,#1B4332 0%,#2D6A4F 55%,#1A237E 100%)', padding:'48px 20px 28px', position:'relative', overflow:'hidden', textAlign:'center' }}>
        {[[15,20],[70,15],[85,40],[50,10],[40,50],[20,35],[80,15]].map(([x,y],i) => (
          <div key={i} style={{ position:'absolute', borderRadius:'50%', background:'white', width:i%3===0?2:1, height:i%3===0?2:1, left:`${x}%`, top:`${y}%`, opacity:0.3+(i%4)*0.1, pointerEvents:'none' }} />
        ))}

        {!fromWeek1 && (
          <button onClick={() => router.back()} style={{ position:'absolute', top:48, left:20, background:'none', border:'none', cursor:'pointer', color:'rgba(187,247,208,0.8)', fontSize:13, display:'flex', alignItems:'center', gap:6, padding:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Volver
          </button>
        )}

        <div style={{ position:'relative', zIndex:1 }}>
          {fromWeek1 ? (
            <>
              <div style={{ fontSize:52, marginBottom:8 }}>🌊</div>
              <h1 style={{ fontSize:22, fontWeight:600, color:'white', margin:'0 0 8px', fontFamily:"'Georgia',serif" }}>
                ¡{childName} completó el primer guardián!
              </h1>
              <p style={{ fontSize:13, color:'rgba(187,247,208,0.85)', margin:0, lineHeight:1.5, maxWidth:280, marginLeft:'auto', marginRight:'auto' }}>
                El Mundo del Agua te espera. Continúa el viaje de los 5 guardianes.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize:48, marginBottom:8 }}>✨</div>
              <h1 style={{ fontSize:22, fontWeight:600, color:'white', margin:'0 0 8px', fontFamily:"'Georgia',serif" }}>
                El viaje completo de Kawa
              </h1>
              <p style={{ fontSize:13, color:'rgba(187,247,208,0.85)', margin:0, lineHeight:1.5 }}>
                Desbloquea los 5 guardianes y todas las herramientas
              </p>
            </>
          )}

          {/* Badge precio lanzamiento */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,200,80,0.25)', border:'1px solid rgba(255,200,80,0.5)', borderRadius:20, padding:'5px 14px', marginTop:14 }}>
            <span style={{ fontSize:14 }}>🚀</span>
            <span style={{ fontSize:11, color:'#FFD700', fontWeight:600 }}>Precio de lanzamiento — oferta limitada</span>
          </div>
        </div>
      </div>

      <div style={{ padding:'20px 16px 0', display:'flex', flexDirection:'column', gap:12 }}>

        {/* Preview mundos bloqueados */}
        <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
          <p style={{ fontSize:12, color:'#C4A090', margin:'0 0 10px', textAlign:'center' }}>Lo que desbloqueas</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            {[
              { emoji:'🌱', name:'Tierra',  locked:false },
              { emoji:'💧', name:'Agua',    locked:true  },
              { emoji:'🌬️', name:'Aire',   locked:true  },
              { emoji:'🔥', name:'Fuego',   locked:true  },
              { emoji:'✨', name:'Éter',    locked:true  },
            ].map((m, i) => (
              <div key={i} style={{ textAlign:'center', flex:1 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background: m.locked ? '#F5F0E8':'linear-gradient(135deg,#2D6A4F,#1B4332)', border: m.locked ? '1.5px solid #EDE5DC':'none', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 5px', fontSize:18, position:'relative' }}>
                  {m.locked ? <span style={{ fontSize:14, opacity:0.3 }}>{m.emoji}</span> : <span>{m.emoji}</span>}
                  {m.locked && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%' }}><span style={{ fontSize:12 }}>🔒</span></div>}
                </div>
                <p style={{ fontSize:9, color: m.locked ? '#D4C8C0':'#2D6A4F', fontWeight: m.locked ? 400:600, margin:0 }}>{m.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PLAN FAMILIA */}
        <div style={{ background:'white', borderRadius:18, overflow:'hidden', border:'2px solid #C4735A', boxShadow:'0 4px 20px rgba(196,115,90,0.15)' }}>
          <div style={{ background:'linear-gradient(135deg,#F4B880,#E89860)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontSize:10, color:'rgba(120,50,10,0.7)', margin:0, textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Plan Familia</p>
              <p style={{ fontSize:14, fontWeight:600, color:'#5A2808', margin:0 }}>Para practicar en casa</p>
            </div>

          </div>
          <div style={{ padding:'12px 16px' }}>

            {FAMILIA_FEATURES.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', background:'#FFF0E8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4735A" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <p style={{ fontSize:12, color:'#2D1808', margin:0 }}>{f}</p>
              </div>
            ))}
            <button style={{ width:'100%', padding:'13px', borderRadius:14, background:'linear-gradient(135deg,#F4B880,#E89860)', border:'none', cursor:'pointer', color:'white', fontSize:14, fontWeight:600, marginTop:10, boxShadow:'0 4px 14px rgba(220,140,80,0.35)', boxSizing:'border-box' }}>
              Comenzar prueba de 7 días gratis →
            </button>
            <p style={{ fontSize:10, color:'#C4A090', textAlign:'center', margin:'6px 0 0' }}>Sin tarjeta de crédito · Cancela cuando quieras</p>
          </div>
        </div>

        {/* PLAN PROFESIONAL */}
        <div style={{ background:'white', borderRadius:18, overflow:'hidden', border:'2px solid #1A6DB5', boxShadow:'0 4px 20px rgba(26,109,181,0.12)' }}>
          <div style={{ background:'linear-gradient(135deg,#4A90D9,#1A6DB5)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontSize:10, color:'rgba(180,220,255,0.8)', margin:0, textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Plan Profesional</p>
              <p style={{ fontSize:14, fontWeight:600, color:'white', margin:0 }}>Para clínicos y educadores</p>
            </div>

          </div>
          <div style={{ padding:'12px 16px' }}>

            {PRO_FEATURES.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1A6DB5" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <p style={{ fontSize:12, color:'#2D1808', margin:0 }}>{f}</p>
              </div>
            ))}
            <button style={{ width:'100%', padding:'13px', borderRadius:14, background:'linear-gradient(135deg,#4A90D9,#1A6DB5)', border:'none', cursor:'pointer', color:'white', fontSize:14, fontWeight:600, marginTop:10, boxShadow:'0 4px 14px rgba(26,109,181,0.3)', boxSizing:'border-box' }}>
              Comenzar prueba de 7 días gratis →
            </button>
            <p style={{ fontSize:10, color:'#C4A090', textAlign:'center', margin:'6px 0 0' }}>Sin tarjeta de crédito · Cancela cuando quieras</p>
          </div>
        </div>



        {/* Volver al home si viene de fuera */}
        {!fromWeek1 && (
          <button onClick={() => router.push('/home')} style={{ width:'100%', padding:'12px', borderRadius:14, background:'none', border:'1px solid #F0E8E0', color:'#C4A090', fontSize:13, cursor:'pointer', boxSizing:'border-box' }}>
            Continuar con la semana 1 gratis
          </button>
        )}

        {fromWeek1 && (
          <button onClick={() => router.push('/home')} style={{ width:'100%', padding:'12px', borderRadius:14, background:'none', border:'1px solid #F0E8E0', color:'#C4A090', fontSize:13, cursor:'pointer', boxSizing:'border-box' }}>
            Volver al inicio por ahora
          </button>
        )}

      </div>
    </div>
  )
}

export default function MembresiaPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#FFFAF6', display:'flex', alignItems:'center', justifyContent:'center' }}><p style={{ color:'#C4A090' }}>Cargando...</p></div>}>
      <MembresiaContent />
    </Suspense>
  )
}
