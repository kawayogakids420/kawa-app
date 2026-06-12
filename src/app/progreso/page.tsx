'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, WEEK_COLORS } from '@/lib/data/course'
import { getMoodEmoji, getMoodLabel } from '@/lib/utils'

const WORLD_SYMBOLS: Record<number, string> = {
  1: '/images/simbolo-tierra.png',
  2: '/images/simbolo-agua.png',
  3: '/images/simbolo-aire.png',
  4: '/images/simbolo-fuego.png',
  5: '/images/simbolo-infinito.png',
}

export default function ProgresoPage() {
  const router = useRouter()
  const { sessionLogs, completedWeeks, children, activeChildId, currentWeek } = useAppStore()
  const activeChild  = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const childName    = activeChild?.name ?? 'Guardián'
  const totalSessions = sessionLogs.length
  const hasData      = totalSessions > 0 || completedWeeks.length > 0

  // Racha
  const streak = (() => {
    if (!sessionLogs.length) return 0
    let count = 0
    const now = new Date()
    for (let i = sessionLogs.length - 1; i >= 0; i--) {
      const diff = Math.floor((now.getTime() - new Date(sessionLogs[i].date).getTime()) / 86400000)
      if (diff <= count + 1) count++
      else break
    }
    return count
  })()

  const avgMood = (() => {
    if (!sessionLogs.length) return null
    const map = { great:4, good:3, okay:2, hard:1 }
    const avg = sessionLogs.reduce((acc, l) => acc + map[l.mood], 0) / sessionLogs.length
    if (avg >= 3.5) return 'great'
    if (avg >= 2.5) return 'good'
    if (avg >= 1.5) return 'okay'
    return 'hard'
  })()

  return (
    <div style={{ minHeight:'100vh', background:'#FFFAF6', paddingBottom:96 }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,#1B4332 0%,#2D6A4F 55%,#1A237E 100%)', padding:'48px 20px 22px', position:'relative', overflow:'hidden' }}>
        {[[15,20],[70,15],[85,40],[50,10],[40,50],[20,35],[80,15]].map(([x,y],i) => (
          <div key={i} style={{ position:'absolute', borderRadius:'50%', background:'white', width:i%3===0?2:1, height:i%3===0?2:1, left:`${x}%`, top:`${y}%`, opacity:0.3+(i%4)*0.1, pointerEvents:'none' }} />
        ))}
        <div style={{ position:'relative', zIndex:1 }}>
          <button onClick={() => router.push('/home')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(187,247,208,0.8)', fontSize:13, marginBottom:14, padding:0, display:'flex', alignItems:'center', gap:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Inicio
          </button>
          <h1 style={{ color:'white', fontSize:22, fontWeight:600, margin:'0 0 4px', fontFamily:"'Georgia',serif" }}>
            El diario de {childName}
          </h1>
          <p style={{ color:'rgba(187,247,208,0.75)', fontSize:13, margin:0 }}>
            El viaje de Kawa semana a semana
          </p>
        </div>
      </div>

      <div style={{ padding:'14px 18px 0' }}>

        {/* ── ESTADO VACÍO ── */}
        {!hasData && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 20px', textAlign:'center' }}>
            {/* Kawa + mundos en silueta */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:20 }}>
              <div style={{ width:90, height:90, borderRadius:'50%', background:'linear-gradient(135deg,#FFF8D6,#FFF0B0)', border:'2px solid rgba(220,190,80,0.3)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 4px 16px rgba(220,160,100,0.15)' }}>
                <img src="/images/kawa-personaje.png" alt="Kawa" style={{ width:'90%', height:'90%', objectFit:'contain' }} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:16 }}>
                {COURSE_WEEKS.map((week, i) => (
                  <div key={week.id} style={{ display:'flex', alignItems:'center' }}>
                    {i > 0 && <div style={{ width:16, height:2, background:'#F0E8E0' }} />}
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'#F5F0E8', border:'1.5px solid #EDE5DC', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <img src={WORLD_SYMBOLS[week.id]} alt={week.element} style={{ width:'58%', height:'58%', objectFit:'contain', opacity:0.22 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize:17, fontWeight:600, color:'#2D1808', margin:'0 0 8px', fontFamily:"'Georgia',serif", textAlign:'center' }}>
              El diario de {childName} está vacío
            </p>
            <p style={{ fontSize:13, color:'#C4A090', margin:'0 0 6px', lineHeight:1.6, maxWidth:260, textAlign:'center' }}>
              Kawa te está esperando. Cada clase que completes quedará guardada aquí.
            </p>
            <p style={{ fontSize:13, color:'#C4A090', margin:'0 0 24px', lineHeight:1.6, maxWidth:260, textAlign:'center' }}>
              Tu primer ⭐ te espera hoy.
            </p>
            <button
              onClick={() => router.push(`/semana/${currentWeek}`)}
              style={{ background:'linear-gradient(135deg,#F4B880,#E89860)', border:'none', borderRadius:14, padding:'13px 28px', color:'white', fontSize:14, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 16px rgba(220,160,100,0.35)' }}>
              Comenzar con Kawa →
            </button>
          </div>
        )}

        {/* ── CON DATOS ── */}
        {hasData && (
          <>
            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:14 }}>
              {[
                { label:'Mundos',   value:`${completedWeeks.length}/5` },
                { label:'Sesiones', value:totalSessions },
                { label:'Racha',    value:streak > 0 ? `${streak}🔥` : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background:'white', borderRadius:14, padding:'10px 8px', textAlign:'center', border:'0.5px solid #F0E8E0' }}>
                  <p style={{ fontSize:16, fontWeight:600, color:'#2D1808', margin:0 }}>{value}</p>
                  <p style={{ fontSize:11, color:'#C4A090', margin:0 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Mundos */}
            <div style={{ background:'white', borderRadius:18, padding:'14px 16px', marginBottom:12, border:'0.5px solid #F0E8E0' }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:'0 0 12px' }}>Mundos completados</p>
              {COURSE_WEEKS.map(week => {
                const colors     = WEEK_COLORS[week.id as keyof typeof WEEK_COLORS]
                const done       = completedWeeks.includes(week.id)
                const weekSessions = sessionLogs.filter(l => l.weekId === week.id)
                return (
                  <div key={week.id} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10, paddingBottom:10, borderBottom:'0.5px solid #FFF4EE' }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:done ? colors.main : '#F5F0E8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {done
                        ? <span style={{ color:'white', fontSize:16, fontWeight:700 }}>✓</span>
                        : <img src={WORLD_SYMBOLS[week.id]} alt={week.element} style={{ width:'65%', height:'65%', objectFit:'contain', opacity:0.3 }} />}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, fontWeight:500, color:'#2D1808', margin:0 }}>
                        Semana {week.id} · {week.element}
                      </p>
                      <p style={{ fontSize:11, color:'#C4A090', margin:0 }}>
                        {weekSessions.length > 0 ? `${weekSessions.length} sesión${weekSessions.length > 1 ? 'es' : ''} registrada${weekSessions.length > 1 ? 's' : ''}` : 'Sin sesiones aún'}
                      </p>
                    </div>
                    {!done && <span style={{ fontSize:11, color:'#D4C8C0' }}>Pendiente</span>}
                  </div>
                )
              })}
            </div>

            {/* Historial */}
            <div style={{ background:'white', borderRadius:18, padding:'14px 16px', marginBottom:12, border:'0.5px solid #F0E8E0' }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#2D1808', margin:'0 0 12px' }}>Historial de sesiones</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[...sessionLogs].reverse().map((log, i) => {
                  const week   = COURSE_WEEKS.find(w => w.id === log.weekId)
                  const colors = WEEK_COLORS[log.weekId as keyof typeof WEEK_COLORS]
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 12px', borderRadius:12, background:colors.light }}>
                      <span style={{ fontSize:22, flexShrink:0 }}>{getMoodEmoji(log.mood)}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:12, fontWeight:600, color:colors.main, margin:'0 0 2px' }}>
                          Semana {log.weekId} · {week?.element}
                        </p>
                        <p style={{ fontSize:11, color:'#6B7280', margin:0 }}>
                          {new Date(log.date).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })} · {getMoodLabel(log.mood)}
                        </p>
                        {log.notes && <p style={{ fontSize:11, color:'#4A3020', margin:'4px 0 0', fontStyle:'italic' }}>{log.notes}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

      </div>

      {/* ── NAV 3 ITEMS ── */}
      <nav style={{ position:'fixed', bottom:0, left:0, right:0, background:'white', borderTop:'0.5px solid #F0E8E0', display:'flex', maxWidth:430, margin:'0 auto', zIndex:40 }}>
        {[
          { href:'/home',                  icon:'🗺️', label:'Inicio'    },
          { href:`/semana/${currentWeek}`, icon:'🧘', label:'Practica'  },
          { href:'/progreso',              icon:'📖', label:'Mi diario' },
        ].map(({ href, icon, label }) => {
          const isActive = href === '/progreso'
          return (
            <button key={href} onClick={() => router.push(href)} style={{ flex:1, padding:'12px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer' }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <span style={{ fontSize:10, fontWeight:isActive?600:500, color:isActive?'#C4735A':'#C4A090' }}>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
