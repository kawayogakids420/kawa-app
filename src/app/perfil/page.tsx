'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { PROFILES } from '@/lib/data/course'

export default function PerfilPage() {
  const router = useRouter()
  const {
    children, activeChildId, setActiveChild,
    reset, userType, setUserType, currentWeek
  } = useAppStore()

  const activeChild = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const profile     = activeChild?.profile ? PROFILES[activeChild.profile] : null

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
            Perfil
          </h1>
          <p style={{ color:'rgba(187,247,208,0.75)', fontSize:13, margin:0 }}>
            Configuración de Kawa
          </p>
        </div>
      </div>

      <div style={{ padding:'14px 18px 0', display:'flex', flexDirection:'column', gap:12 }}>

        {/* Tipo de usuario */}
        <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:'0 0 12px' }}>¿Cómo usas la app?</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {/* Familia */}
            <button
              onClick={() => setUserType('familia')}
              style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                padding:'14px 10px', borderRadius:16,
                border:`2px solid ${userType==='familia' ? '#C4735A' : '#F0E8E0'}`,
                background: userType==='familia' ? '#FFF8F4' : 'white',
                cursor:'pointer'
              }}>
              <span style={{ fontSize:28 }}>👨‍👩‍👧</span>
              <span style={{ fontSize:11, fontWeight:600, color: userType==='familia' ? '#C4735A' : '#9CA3AF', textAlign:'center', lineHeight:1.3 }}>
                Familia o cuidador/a
              </span>
              {userType==='familia' && (
                <span style={{ fontSize:9, padding:'2px 8px', borderRadius:20, background:'#C4735A', color:'white', fontWeight:600 }}>Activo</span>
              )}
            </button>
            {/* Profesional */}
            <button
              onClick={() => setUserType('profesional')}
              style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                padding:'14px 10px', borderRadius:16,
                border:`2px solid ${userType==='profesional' ? '#2D6A4F' : '#F0E8E0'}`,
                background: userType==='profesional' ? '#F0F9F4' : 'white',
                cursor:'pointer'
              }}>
              <span style={{ fontSize:28 }}>🩺</span>
              <span style={{ fontSize:11, fontWeight:600, color: userType==='profesional' ? '#2D6A4F' : '#9CA3AF', textAlign:'center', lineHeight:1.3 }}>
                Profesional de salud
              </span>
              {userType==='profesional' && (
                <span style={{ fontSize:9, padding:'2px 8px', borderRadius:20, background:'#2D6A4F', color:'white', fontWeight:600 }}>Activo</span>
              )}
            </button>
          </div>
          <p style={{ fontSize:11, color: userType==='profesional' ? '#2D6A4F' : '#C4735A', textAlign:'center', margin:'10px 0 0' }}>
            {userType==='profesional'
              ? '✓ Verás el protocolo clínico TO en cada guardián'
              : '✓ Verás actividades y guías para practicar en casa'}
          </p>
        </div>

        {/* Lista de niños */}
        {children.map(child => {
          const p        = child.profile ? PROFILES[child.profile] : null
          const isActive = child.id === activeChildId
          return (
            <button key={child.id}
              onClick={() => setActiveChild(child.id)}
              style={{
                width:'100%', background:'white', borderRadius:18,
                padding:'14px 16px', display:'flex', alignItems:'center', gap:14,
                textAlign:'left', border:`2px solid ${isActive ? (p?.color ?? '#C4735A') : '#F0E8E0'}`,
                cursor:'pointer', boxSizing:'border-box'
              }}>
              <span style={{ fontSize:38 }}>{child.gender==='female' ? '👧' : '👦'}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                  <p style={{ fontSize:16, fontWeight:600, color:'#2D1808', margin:0 }}>{child.name}</p>
                  {isActive && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'#FFF0E8', color:'#C4735A', fontWeight:600 }}>Activo</span>}
                </div>
                <p style={{ fontSize:12, color:'#C4A090', margin:0 }}>{child.age} años · {child.gender==='female'?'Niña':'Niño'}</p>
                {p && (
                  <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:p.bg, color:p.color, fontWeight:500, display:'inline-block', marginTop:4 }}>
                    {p.icon} {p.name}
                  </span>
                )}
              </div>
              {isActive && <span style={{ fontSize:20, color:'#C4735A' }}>✓</span>}
            </button>
          )
        })}

        {/* Mapa sensorial */}
        {activeChild?.profilePcts && profile && (
          <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:'0 0 12px' }}>
              Mapa sensorial de {activeChild.name}
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {(['sensible','buscador','bajo_registro','motor'] as const).map(pk => {
                const p   = PROFILES[pk]
                const pct = activeChild.profilePcts![pk]
                return (
                  <div key={pk}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:14 }}>{p.icon}</span>
                        <span style={{ fontSize:12, fontWeight:500, color:'#2D1808' }}>{p.name}</span>
                      </div>
                      <span style={{ fontSize:11, fontWeight:600, color:'#C4A090' }}>{pct}%</span>
                    </div>
                    <div style={{ height:8, background:'#F5F0E8', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:4, width:`${pct}%`, background:p.color, transition:'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Perfil predominante */}
        {profile && (
          <div style={{ borderRadius:18, padding:'14px 16px', background:profile.bg, border:`1.5px solid ${profile.color}30` }}>
            <p style={{ fontSize:13, fontWeight:600, color:profile.color, margin:'0 0 6px' }}>
              {profile.icon} Perfil predominante: {profile.name}
            </p>
            <p style={{ fontSize:12, color:profile.color, margin:0, lineHeight:1.6 }}>{profile.description}</p>
          </div>
        )}

        {/* Los 4 perfiles */}
        <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:'0 0 12px' }}>Los 4 perfiles sensoriales</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {Object.values(PROFILES).map(p => (
              <div key={p.name} style={{
                padding:'10px 12px', borderRadius:12,
                background:p.bg,
                border:`2px solid ${activeChild?.profile && PROFILES[activeChild.profile].name===p.name ? p.color : 'transparent'}`
              }}>
                <p style={{ fontSize:12, fontWeight:500, color:p.color, margin:'0 0 2px' }}>{p.icon} {p.name}</p>
                <p style={{ fontSize:11, color:p.color, margin:0, opacity:0.8 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info del curso */}
        <div style={{ background:'white', borderRadius:18, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:'0 0 10px' }}>Sobre Kawa Yoga Kids</p>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {[
              '📚 Basado en Integración Sensorial de Jean Ayres',
              '🧸 Diseñado para niños con autismo, ADHD, Síndrome de Down y neurodiversidad',
              '👨‍👩‍👧 Para familias y profesionales (TOs, educadores, terapeutas)',
              '📱 Funciona sin conexión después de la primera carga',
            ].map((item, i) => (
              <p key={i} style={{ fontSize:12, color:'#4A3020', margin:0, lineHeight:1.5 }}>{item}</p>
            ))}
          </div>
        </div>

        {/* Agregar niño/a */}
        <button
          onClick={() => {
            // Limpiar onboarding para agregar nuevo niño
            localStorage.removeItem('kawa-coach-seen')
            window.location.href = '/onboarding'
          }}
          style={{ width:'100%', padding:'13px', borderRadius:14, background:'linear-gradient(135deg,#F4B880,#E89860)', border:'none', color:'white', fontSize:13, fontWeight:600, cursor:'pointer', boxSizing:'border-box', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>+</span> Agregar niño/a
        </button>

        {/* Test sensorial completo */}
        <button
          onClick={() => window.location.href = '/test-sensorial'}
          style={{ width:'100%', padding:'13px', borderRadius:14, background:'white', border:'1.5px dashed #C4A090', color:'#C4A090', fontSize:13, cursor:'pointer', boxSizing:'border-box', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <span style={{ fontSize:16 }}>🔍</span> Hacer el test sensorial completo
        </button>

        {/* Resetear */}
        <button
          onClick={() => { if (confirm('¿Resetear todo el progreso?')) reset() }}
          style={{ width:'100%', padding:'12px', borderRadius:14, color:'#E24B4A', background:'white', border:'1px solid #FECACA', fontSize:13, cursor:'pointer', boxSizing:'border-box' }}>
          Resetear progreso
        </button>

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
