'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, PROFILES, WEEK_COLORS } from '@/lib/data/course'
import { getWeekProgress } from '@/lib/utils'

const WORLD_SYMBOLS: Record<number, string> = {
  1: '/images/simbolo-tierra.png',
  2: '/images/simbolo-agua.png',
  3: '/images/simbolo-aire.png',
  4: '/images/simbolo-fuego.png',
  5: '/images/simbolo-infinito.png',
}

const COACH_MESSAGES: Record<number, string> = {
  1: 'Kawa acaba de llegar a la Tierra. Esta semana aprenderás a sentir tu cuerpo y encontrar tu raíz.',
  2: 'El Mundo del Agua te espera. Esta semana aprenderás a fluir con el movimiento y las emociones.',
  3: 'El Mundo del Aire tiene nuevos desafíos. Esta semana trabajarás tu energía y tu fuerza interior.',
  4: 'El Guardián del Fuego te espera. Esta semana aprenderás a respirar y encontrar tu calma.',
  5: 'Llegaste al Mundo del Éter. Es el cierre del viaje — integra todo lo que Kawa aprendió.',
}

const LOCKED_OPACITY = [1, 0.5, 0.35, 0.25, 0.2]

function CoachScreen({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon:'🗺️', title:'El mapa es tu guía',          desc:'Toca cualquier mundo para ir a esa clase. Kawa avanza un mundo por semana.' },
    { icon:'🧘', title:'Cada clase toma 45 min',       desc:'Historia → Posturas → Respiración → Relajación. Puedes hacerla en partes.' },
    { icon:'⭐', title:'Gana estrellas cada día',      desc:'Al completar cada sección ganas una estrella. ¡4 estrellas = sesión completa!' },
  ]
  const [idx, setIdx] = useState(0)
  const isLast = idx === steps.length - 1
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'flex-end', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}>
      <div style={{ background:'white', width:'100%', maxWidth:430, margin:'0 auto', borderRadius:'24px 24px 0 0', padding:'24px 24px 40px' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:24 }}>
          {steps.map((_,i) => (
            <div key={i} style={{ height:6, borderRadius:3, transition:'all 0.3s', width:i===idx?24:8, backgroundColor:i===idx?'#C4735A':'#F0E8E0' }} />
          ))}
        </div>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:52, marginBottom:16 }}>{steps[idx].icon}</div>
          <h3 style={{ fontSize:20, fontWeight:600, color:'#2D1808', marginBottom:8, fontFamily:"'Georgia',serif" }}>{steps[idx].title}</h3>
          <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.6, maxWidth:260, margin:'0 auto' }}>{steps[idx].desc}</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          {!isLast && <button onClick={onClose} style={{ flex:1, padding:12, borderRadius:16, border:'1px solid #F0E8E0', background:'white', color:'#9CA3AF', fontSize:14, cursor:'pointer' }}>Saltar</button>}
          <button onClick={() => isLast ? onClose() : setIdx(idx+1)} style={{ flex:isLast?1:2, padding:12, borderRadius:16, border:'none', background:'linear-gradient(135deg,#F4B880,#E89860)', color:'white', fontSize:14, fontWeight:600, cursor:'pointer' }}>
            {isLast ? 'Comenzar el viaje 🌱' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { children, activeChildId, currentWeek, completedWeeks, sessionLogs, setActiveChild } = useAppStore()

  const activeChild     = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const profile         = activeChild?.profile ? PROFILES[activeChild.profile] : null
  const progress        = getWeekProgress(completedWeeks)
  const currentWeekData = COURSE_WEEKS.find(w => w.id === currentWeek)

  const [showCoach, setShowCoach] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem('kawa-coach-seen')) setShowCoach(true)
  }, [])
  const closeCoach = () => { localStorage.setItem('kawa-coach-seen','1'); setShowCoach(false) }

  // ¿Practicó hoy?
  const practicedToday = (() => {
    if (!sessionLogs.length) return false
    const last = new Date(sessionLogs[sessionLogs.length-1].date)
    return last.toDateString() === new Date().toDateString()
  })()

  // Racha
  const streak = (() => {
    if (!sessionLogs.length) return 0
    let count = 0
    const now = new Date()
    for (let i = sessionLogs.length-1; i >= 0; i--) {
      const diff = Math.floor((now.getTime() - new Date(sessionLogs[i].date).getTime()) / 86400000)
      if (diff <= count+1) count++
      else break
    }
    return count
  })()

  const hasData = sessionLogs.length > 0 || completedWeeks.length > 0

  return (
    <div style={{ minHeight:'100vh', background:'#FFFAF6', paddingBottom:96 }}>

      {showCoach && <CoachScreen onClose={closeCoach} />}

      {/* ── HEADER ── */}
      <div style={{ padding:'48px 20px 22px', position:'relative', overflow:'hidden', background:'linear-gradient(160deg,#1B4332 0%,#2D6A4F 55%,#1A237E 100%)' }}>
        {[[15,20],[30,60],[70,15],[85,40],[92,70],[8,80],[50,10],[60,75],[40,50],[75,85],[20,35],[95,25],[55,55],[10,90],[80,15]].map(([x,y],i) => (
          <div key={i} style={{ position:'absolute', borderRadius:'50%', background:'white', width:i%3===0?2:1, height:i%3===0?2:1, left:`${x}%`, top:`${y}%`, opacity:0.3+(i%4)*0.1, pointerEvents:'none' }} />
        ))}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
            <div>
              <p style={{ color:'rgba(187,247,208,0.8)', fontSize:13, margin:0 }}>Hola,</p>
              <h1 style={{ color:'white', fontSize:22, fontWeight:500, margin:0, fontFamily:"'Georgia',serif" }}>
                {activeChild?.name || 'Guardián'}{' '}{activeChild?.gender==='female'?'👧':'👦'}
              </h1>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {children.length > 1 && (
                <div style={{ display:'flex', gap:4 }}>
                  {children.map(child => (
                    <button key={child.id} onClick={() => setActiveChild(child.id)} style={{ width:32, height:32, borderRadius:'50%', border:`2px solid ${child.id===activeChildId?'white':'transparent'}`, background:child.id===activeChildId?'rgba(255,255,255,0.25)':'rgba(255,255,255,0.1)', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {child.gender==='female'?'👧':'👦'}
                    </button>
                  ))}
                </div>
              )}
              {profile && (
                <button onClick={() => router.push('/perfil')} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:12, background:'rgba(255,255,255,0.15)', border:'none', cursor:'pointer' }}>
                  <span style={{ fontSize:15 }}>{profile.icon}</span>
                  <span style={{ fontSize:12, color:'white', fontWeight:500 }}>{profile.name}</span>
                </button>
              )}
            </div>
          </div>
          {/* Barra de progreso solo si hay datos */}
          {hasData && (
            <div style={{ marginTop:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:12, color:'rgba(187,247,208,0.8)' }}>Progreso del viaje</span>
                <span style={{ fontSize:12, color:'rgba(187,247,208,0.8)' }}>{completedWeeks.length}/5 mundos · {progress}%</span>
              </div>
              <div style={{ height:6, borderRadius:3, overflow:'hidden', background:'rgba(255,255,255,0.15)' }}>
                <div style={{ height:'100%', borderRadius:3, transition:'width 0.7s', width:`${progress}%`, background:'rgba(255,255,255,0.9)' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:'14px 18px 0' }}>

        {/* ── STATS — solo cuando hay datos ── */}
        {hasData && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:14 }}>
            {[
              { label:'Mundos',   value:`${completedWeeks.length}/5` },
              { label:'Sesiones', value:sessionLogs.length },
              { label:'Racha',    value:streak+(streak===1?' día':' días') },
            ].map(({ label, value }) => (
              <div key={label} style={{ background:'white', borderRadius:14, padding:'10px 8px', textAlign:'center', border:'0.5px solid #F0E8E0' }}>
                <p style={{ fontSize:16, fontWeight:500, color:'#2D1808', margin:0 }}>{value}</p>
                <p style={{ fontSize:11, color:'#C4A090', margin:0 }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── TARJETA UNIFICADA MAPA + CTA ── */}
        <div style={{ borderRadius:20, overflow:'hidden', marginBottom:12, background:'linear-gradient(160deg,#1B4332 0%,#2D6A4F 60%,#1A237E 100%)' }}>

          {/* Zona A — Mapa */}
          <div style={{ padding:'14px 16px 10px' }}>
            <p style={{ color:'rgba(187,247,208,0.7)', fontSize:10, margin:'0 0 10px', letterSpacing:'0.05em', textTransform:'uppercase' }}>
              El mapa de los 5 mundos
            </p>
            <div style={{ display:'flex', alignItems:'center', marginBottom:6 }}>
              {COURSE_WEEKS.map((week, i) => {
                const isCompleted = completedWeeks.includes(week.id)
                const isCurrent   = week.id === currentWeek
                const isLocked    = week.id > currentWeek && !isCompleted
                const opacity     = isLocked ? LOCKED_OPACITY[i] ?? 0.2 : 1
                const size        = isCurrent ? 36 : 28
                return (
                  <div key={week.id} style={{ display:'flex', alignItems:'center', flex:1 }}>
                    {i > 0 && (
                      <div style={{ flex:1, height:2, background:completedWeeks.includes(week.id-1)||isCompleted?'rgba(255,255,255,0.75)':'rgba(255,255,255,0.2)' }} />
                    )}
                    <button
                      onClick={() => !isLocked && router.push(`/semana/${week.id}`)}
                      disabled={isLocked}
                      style={{ width:size, height:size, borderRadius:'50%', border:isCurrent?'2.5px solid white':'1.5px solid rgba(255,255,255,0.45)', background:'rgba(255,255,255,0.93)', cursor:isLocked?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0, overflow:'hidden', opacity, boxShadow:isCurrent?'0 0 0 5px rgba(255,255,255,0.18)':'none', transition:'all 0.2s' }}>
                      {isLocked ? (
                        <span style={{ fontSize:10 }}>🔒</span>
                      ) : isCompleted ? (
                        <div style={{ position:'relative', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <img src={WORLD_SYMBOLS[week.id]} alt={week.element} style={{ width:'66%', height:'66%', objectFit:'contain', opacity:0.5 }} />
                          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontSize:14, fontWeight:700, color:'#2D6A4F' }}>✓</span>
                          </div>
                        </div>
                      ) : (
                        <img src={WORLD_SYMBOLS[week.id]} alt={week.element} style={{ width:isCurrent?'70%':'64%', height:isCurrent?'70%':'64%', objectFit:'contain' }} />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
            <div style={{ display:'flex' }}>
              {COURSE_WEEKS.map(week => {
                const isCurrent   = week.id === currentWeek
                const isCompleted = completedWeeks.includes(week.id)
                const i = week.id - 1
                return (
                  <div key={week.id} style={{ flex:1, textAlign:'center' }}>
                    <p style={{ fontSize:9, margin:0, color:isCurrent?'white':isCompleted?'rgba(255,255,255,0.65)':`rgba(255,255,255,${LOCKED_OPACITY[i]??0.2})`, fontWeight:isCurrent?600:400 }}>
                      {week.element}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ height:1, background:'rgba(255,255,255,0.12)', margin:'0 16px' }} />

          {/* Zona B — Semana actual + CTA */}
          <div style={{ padding:'10px 16px 14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ width:32, height:32, background:'rgba(255,255,255,0.14)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <img src={WORLD_SYMBOLS[currentWeek]} alt={currentWeekData?.element} style={{ width:'68%', height:'68%', objectFit:'contain', opacity:0.9 }} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', margin:0 }}>Esta semana</p>
                <p style={{ fontSize:13, fontWeight:600, color:'white', margin:0, fontFamily:"'Georgia',serif" }}>
                  Mundo de la {currentWeekData?.element}
                </p>
              </div>
              <span style={{ background:'rgba(255,255,255,0.18)', color:'white', fontSize:9, padding:'3px 8px', borderRadius:20 }}>⏱ 45 min</span>
            </div>
            {practicedToday ? (
              <button onClick={() => router.push(`/semana/${currentWeek}`)} style={{ width:'100%', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.28)', borderRadius:12, padding:'9px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', boxSizing:'border-box' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:16 }}>✓</span>
                  <p style={{ color:'rgba(255,255,255,0.9)', fontSize:12, fontWeight:500, margin:0 }}>¡Hoy ya practicaste!</p>
                </div>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>Ver clase →</span>
              </button>
            ) : (
              <button onClick={() => router.push(`/semana/${currentWeek}`)} style={{ width:'100%', background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', boxSizing:'border-box' }}>
                <p style={{ color:'white', fontSize:13, fontWeight:600, margin:0 }}>Ir a la clase de hoy</p>
                <span style={{ color:'white', fontSize:16 }}>→</span>
              </button>
            )}
          </div>
        </div>

        {/* ── RACHA DIARIA — siempre visible ── */}
        <div style={{ background:'white', borderRadius:16, padding:'11px 14px', marginBottom:12, border:'0.5px solid #F0E8E0', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#FFF8D6,#FFF0B0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
            {streak > 0 ? '🔥' : '✨'}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:10, color:'#C4A090', margin:0, textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>Racha actual</p>
            {streak > 0 ? (
              <p style={{ fontSize:13, color:'#2D1808', fontWeight:500, margin:0 }}>
                {streak} {streak===1?'día':'días'} seguidos <span style={{ color:'#C4735A' }}>· ¡Sigue así!</span>
              </p>
            ) : (
              <p style={{ fontSize:13, color:'#2D1808', fontWeight:500, margin:0 }}>
                Empieza hoy <span style={{ color:'#C4735A' }}>· Tu primer día te espera</span>
              </p>
            )}
          </div>
        </div>

        {/* ── COACH — solo emoji + texto ── */}
        <div style={{ background:'#FFFDE7', borderRadius:16, padding:'12px 14px', marginBottom:14, display:'flex', gap:10, alignItems:'flex-start', border:'0.5px solid #FEF08A' }}>
          <span style={{ fontSize:20, flexShrink:0 }}>🌱</span>
          <p style={{ fontSize:12, color:'#713F12', margin:0, lineHeight:1.6 }}>
            {practicedToday
              ? `¡Increíble, ${activeChild?.name || ''}! Ya practicaste hoy. Vuelve mañana para continuar el viaje.`
              : COACH_MESSAGES[currentWeek] || ''}
          </p>
        </div>

      </div>

      {/* ── NAV BOTTOM — 3 items ── */}
      <nav style={{ position:'fixed', bottom:0, left:0, right:0, background:'white', borderTop:'0.5px solid #F0E8E0', display:'flex', maxWidth:430, margin:'0 auto' }}>
        {[
          { href:'/home',                  icon:'🗺️', label:'Inicio'    },
          { href:`/semana/${currentWeek}`, icon:'🧘', label:'Practica'  },
          { href:'/progreso',              icon:'📖', label:'Mi diario' },
        ].map(({ href, icon, label }) => {
          const isActive = typeof window !== 'undefined' && window.location.pathname === href
          return (
            <button key={href} onClick={() => router.push(href)} style={{ flex:1, padding:'12px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer' }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <span style={{ fontSize:10, color:'#C4A090', fontWeight:500 }}>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
