'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { COURSE_WEEKS, PROFILES, WEEK_COLORS } from '@/lib/data/course'
import ClaseTab from './ClaseTab'
import PadresTab from './PadresTab'
import MaterialesTab from './MaterialesTab'

// ── Símbolos de los mundos ────────────────────────────────────────────────────
const WORLD_SYMBOLS: Record<number, string> = {
  1: '/images/simbolo-tierra.png',
  2: '/images/simbolo-agua.png',
  3: '/images/simbolo-aire.png',
  4: '/images/simbolo-fuego.png',
  5: '/images/simbolo-infinito.png',
}

// ── Degradados cálidos por guardián ──────────────────────────────────────────
const WARM_GRADIENTS: Record<number, string> = {
  1: 'linear-gradient(150deg, #FFE9A0 0%, #FFCDB8 50%, #F5B8C8 100%)', // Tierra — amarillo→melocotón→rosa
  2: 'linear-gradient(150deg, #B8E4FF 0%, #C8D4FF 50%, #E0C8FF 100%)', // Agua — celeste→lavanda
  3: 'linear-gradient(150deg, #D4F0FF 0%, #C8E8F8 50%, #D8D0FF 100%)', // Aire — azul claro→lila
  4: 'linear-gradient(150deg, #FFD4A0 0%, #FFB890 50%, #FF9898 100%)', // Fuego — naranja→melocotón→coral
  5: 'linear-gradient(150deg, #F8D4FF 0%, #E8C8FF 50%, #C8D8FF 100%)', // Éter — rosa→lavanda→azul
}

// Colores de texto sobre cada degradado
const WARM_TEXT: Record<number, { title: string; sub: string; badge: string }> = {
  1: { title: '#7A3520', sub: 'rgba(140,70,50,0.65)',  badge: 'rgba(255,255,255,0.5)'  },
  2: { title: '#1A2870', sub: 'rgba(40,60,140,0.6)',   badge: 'rgba(255,255,255,0.45)' },
  3: { title: '#1A3060', sub: 'rgba(30,60,120,0.6)',   badge: 'rgba(255,255,255,0.45)' },
  4: { title: '#7A2010', sub: 'rgba(140,50,20,0.65)',  badge: 'rgba(255,255,255,0.5)'  },
  5: { title: '#4A1870', sub: 'rgba(90,40,130,0.6)',   badge: 'rgba(255,255,255,0.45)' },
}

type Tab = 'clase' | 'padres' | 'materiales'

export default function SemanaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params)
  const router  = useRouter()
  const weekId  = parseInt(id)
  const week    = COURSE_WEEKS.find(w => w.id === weekId)
  const { completedWeeks, completeWeek, children, activeChildId } = useAppStore()
  const [tab, setTab] = useState<Tab>('clase')

  const activeChild   = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const activeProfile = activeChild?.profile ?? null

  if (!week) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <p style={{ color:'#9CA3AF' }}>Semana no encontrada</p>
    </div>
  )

  const colors   = WEEK_COLORS[weekId as keyof typeof WEEK_COLORS]
  const gradient = WARM_GRADIENTS[weekId] || WARM_GRADIENTS[1]
  const textCols = WARM_TEXT[weekId]    || WARM_TEXT[1]
  const profile  = activeProfile ? PROFILES[activeProfile] : null
  const isCompleted = completedWeeks.includes(weekId)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'clase',      label: 'La Clase'   },
    { id: 'padres',     label: 'Para ti'    },
    { id: 'materiales', label: 'Materiales' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#FFFAF6', paddingBottom: 96 }}>

      {/* ── HEADER PASTEL CÁLIDO ── */}
      <div style={{ background: gradient, padding:'48px 20px 18px', position:'relative', overflow:'hidden' }}>
        {/* Círculos decorativos glass */}
        <div style={{ position:'absolute', top:-24, right:-24, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.32)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-14, left:10, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.2)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40%', right:'30%', width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', pointerEvents:'none' }} />

        {/* Volver */}
        <button onClick={() => router.back()} style={{
          background:'none', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', gap:6,
          color: textCols.sub, fontSize:13, marginBottom:16, padding:0
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Volver
        </button>

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', position:'relative', zIndex:1 }}>
          <div style={{ flex:1, marginRight:16 }}>
            <p style={{ fontSize:11, color: textCols.sub, margin:'0 0 3px', fontWeight:500 }}>
              Semana {week.id} · {week.element}
            </p>
            <h1 style={{ fontSize:22, fontWeight:600, color: textCols.title, margin:'0 0 5px', fontFamily:"'Georgia','Times New Roman',serif", lineHeight:1.2 }}>
              {week.guardian} {week.guardianSpecies}
            </h1>
            <p style={{ fontSize:11, color: textCols.sub, margin:0, fontStyle:'italic', lineHeight:1.45, maxWidth:200 }}>
              "{week.teaching}"
            </p>
          </div>

          {/* Símbolo glass */}
          <div style={{
            width:56, height:56, flexShrink:0,
            background:'rgba(255,255,255,0.48)',
            borderRadius:16, border:'1px solid rgba(255,255,255,0.75)',
            display:'flex', alignItems:'center', justifyContent:'center', padding:8
          }}>
            <img src={WORLD_SYMBOLS[weekId]} alt={week.element} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
          </div>
        </div>

        {/* Badge perfil */}
        {profile && (
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            background: textCols.badge,
            border:'1px solid rgba(255,255,255,0.7)',
            borderRadius:20, padding:'4px 12px', marginTop:12
          }}>
            <span style={{ fontSize:14 }}>{profile.icon}</span>
            <span style={{ fontSize:10, color: textCols.title, fontWeight:500 }}>
              {activeChild?.name} · {profile.name}
            </span>
          </div>
        )}
      </div>

      {/* ── TABS — línea inferior, sin fondo pill ── */}
      <div style={{ display:'flex', background:'#fff', borderBottom:'1px solid #F5EEE8' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, padding:'11px 0', textAlign:'center',
            fontSize:12, fontWeight:600,
            color: tab === t.id ? '#C4735A' : '#C4A99A',
            borderBottom: tab === t.id ? '2px solid #C4735A' : '2px solid transparent',
            background:'none', border:'none',
            borderBottomStyle:'solid',
            borderBottomWidth:2,
            borderBottomColor: tab === t.id ? '#C4735A' : 'transparent',
            cursor:'pointer', transition:'all 0.2s'
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ padding:'12px 16px 0' }}>
        {tab === 'clase'      && <ClaseTab      week={week} weekColors={colors} activeProfile={activeProfile} />}
        {tab === 'padres'     && <PadresTab     week={week} weekColors={colors} />}
        {tab === 'materiales' && <MaterialesTab week={week} weekColors={colors} />}
      </div>

      {/* ── BOTÓN COMPLETAR ── */}
      {!isCompleted && tab === 'clase' && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid #F5EEE8', padding:16, maxWidth:430, margin:'0 auto' }}>
          <button
            onClick={() => { completeWeek(weekId); router.push('/home') }}
            style={{
              width:'100%', padding:'14px', borderRadius:16,
              background:`linear-gradient(135deg, ${colors.main}, ${colors.main}CC)`,
              border:'none', cursor:'pointer',
              color:'#fff', fontSize:15, fontWeight:600,
              boxShadow:`0 4px 16px ${colors.main}40`
            }}>
            Completar la semana ✓
          </button>
        </div>
      )}

      {isCompleted && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid #F5EEE8', padding:16, maxWidth:430, margin:'0 auto' }}>
          <div style={{
            width:'100%', padding:'12px', borderRadius:16, textAlign:'center',
            fontSize:13, fontWeight:500,
            background: colors.light, color: colors.main
          }}>
            ✓ Semana {weekId} completada ·{' '}
            {weekId < 5 ? 'La siguiente semana está desbloqueada' : '¡Completaste el viaje!'}
          </div>
        </div>
      )}
    </div>
  )
}
