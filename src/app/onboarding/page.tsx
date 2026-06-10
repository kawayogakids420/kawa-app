'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { SensoryProfile } from '@/lib/data/course'
import { PROFILES } from '@/lib/data/course'

// 4 pasos: nombre → edad → perfil sensorial → tipo usuario
type Step = 'nombre' | 'edad' | 'perfil' | 'usuario' | 'bienvenida'

const PERFILES: { id: SensoryProfile; emoji: string; titulo: string; desc: string; color: string; bg: string }[] = [
  {
    id: 'sensible',
    emoji: '🌸',
    titulo: 'Muy sensible',
    desc: 'Se incomoda con ruidos, texturas o cambios. Necesita calma y predecibilidad.',
    color: '#9C27B0',
    bg: '#F3E5F5',
  },
  {
    id: 'buscador',
    emoji: '⚡',
    titulo: 'Buscador de sensaciones',
    desc: 'Siempre en movimiento, busca estímulos fuertes. Necesita canalizarlo.',
    color: '#E65100',
    bg: '#FFF3E0',
  },
  {
    id: 'bajo_registro',
    emoji: '🌙',
    titulo: 'Bajo registro',
    desc: 'Parece no notar lo que pasa a su alrededor. Necesita estímulos más intensos.',
    color: '#1565C0',
    bg: '#E3F2FD',
  },
  {
    id: 'motor',
    emoji: '🧩',
    titulo: 'Dificultad motora',
    desc: 'Le cuesta coordinar movimientos o aprender actividades físicas nuevas.',
    color: '#2E7D32',
    bg: '#E8F5E9',
  },
]

const EDADES = [
  { label: '3–4 años', value: 3 },
  { label: '5–6 años', value: 5 },
  { label: '7–8 años', value: 7 },
]

// Degradado por paso
const STEP_GRADIENTS: Record<Step, string> = {
  nombre:    'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  edad:      'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  perfil:    'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  usuario:   'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  bienvenida:'linear-gradient(150deg,#D4E8A0 0%,#C8D890 40%,#E8D4A0 100%)',
}

const STEP_ORDER: Step[] = ['nombre', 'edad', 'perfil', 'usuario', 'bienvenida']

export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding, addChild, setUserType } = useAppStore()

  const [step, setStep]         = useState<Step>('nombre')
  const [nombre, setNombre]     = useState('')
  const [genero, setGenero]     = useState<'male'|'female'|null>(null)
  const [edad, setEdad]         = useState<number|null>(null)
  const [perfil, setPerfil]     = useState<SensoryProfile|null>(null)
  const [usuario, setUsuario]   = useState<'familia'|'profesional'|null>(null)

  const stepIdx    = STEP_ORDER.indexOf(step)
  const totalSteps = STEP_ORDER.length - 1 // bienvenida no cuenta como paso
  const gradient   = STEP_GRADIENTS[step]
  const textTitle  = '#7A3520'
  const textSub    = 'rgba(140,70,50,0.65)'

  const goNext = (nextStep: Step) => setStep(nextStep)

  const finish = () => {
    if (!nombre || !edad || !perfil || !usuario) return
    completeOnboarding(nombre, edad, perfil)
    setUserType(usuario)
    // Actualizar género en el store
    addChild({
      id: Date.now().toString(),
      name: nombre,
      age: edad,
      gender: genero ?? 'male',
      profile: perfil,
      profilePcts: null,
    })
    setStep('bienvenida')
  }

  // ── PANTALLA BIENVENIDA FINAL ──────────────────────────────────────────────
  if (step === 'bienvenida') {
    const profileData = perfil ? PROFILES[perfil] : null
    return (
      <div style={{ minHeight:'100vh', background: STEP_GRADIENTS.bienvenida, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.3)' }} />
        <div style={{ position:'absolute', bottom:-20, left:-20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.2)' }} />

        <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          {/* Animación de Kawa */}
          <div style={{ fontSize:72, marginBottom:16, lineHeight:1 }}>🌱</div>

          <h1 style={{ fontSize:28, fontWeight:600, color:'#3A2808', margin:'0 0 8px', fontFamily:"'Georgia',serif", lineHeight:1.2 }}>
            ¡Hola, {nombre}!
          </h1>
          <p style={{ fontSize:16, color:'rgba(80,50,20,0.75)', margin:'0 0 24px', lineHeight:1.5 }}>
            Kawa te da la bienvenida al viaje de los 5 guardianes
          </p>

          {profileData && (
            <div style={{ background:'rgba(255,255,255,0.55)', borderRadius:18, padding:'14px 20px', marginBottom:24, border:'1px solid rgba(255,255,255,0.7)' }}>
              <p style={{ fontSize:13, color:'rgba(80,50,20,0.65)', margin:'0 0 6px' }}>Perfil sensorial detectado</p>
              <p style={{ fontSize:16, fontWeight:600, color:profileData.color, margin:0 }}>
                {profileData.icon} {profileData.name}
              </p>
            </div>
          )}

          <button
            onClick={() => router.replace('/home')}
            style={{
              width:'100%', maxWidth:300, padding:'15px', borderRadius:16,
              background:'linear-gradient(135deg,#F4B880,#E89860)',
              border:'none', cursor:'pointer', color:'#fff',
              fontSize:16, fontWeight:600,
              boxShadow:'0 4px 20px rgba(220,160,100,0.4)'
            }}>
            Comenzar el viaje 🌱
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>

      {/* Header degradado */}
      <div style={{ background: gradient, padding:'48px 24px 24px', position:'relative', overflow:'hidden', flexShrink:0 }}>
        <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.3)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-10, left:8, width:55, height:55, borderRadius:'50%', background:'rgba(255,255,255,0.2)', pointerEvents:'none' }} />

        {/* Barra de progreso */}
        <div style={{ display:'flex', gap:6, marginBottom:20, position:'relative', zIndex:1 }}>
          {['nombre','edad','perfil','usuario'].map((s, i) => (
            <div key={s} style={{
              flex:1, height:4, borderRadius:2,
              background: i <= stepIdx ? 'rgba(120,50,20,0.5)' : 'rgba(255,255,255,0.35)',
              transition:'background 0.3s'
            }} />
          ))}
        </div>

        <div style={{ position:'relative', zIndex:1 }}>
          <p style={{ fontSize:11, color:textSub, margin:'0 0 4px', fontWeight:500 }}>
            Paso {stepIdx + 1} de {totalSteps}
          </p>
          <h1 style={{ fontSize:22, fontWeight:600, color:textTitle, margin:0, fontFamily:"'Georgia',serif", lineHeight:1.25 }}>
            {step === 'nombre'  && 'Cuéntanos sobre tu guardián/a'}
            {step === 'edad'    && `¿Cuántos años tiene ${nombre || 'el niño/a'}?`}
            {step === 'perfil'  && `¿Cómo reacciona ${nombre || 'el niño/a'} ante el mundo?`}
            {step === 'usuario' && '¿Cómo usarás la app?'}
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ flex:1, background:'#FFFAF6', padding:'24px 20px', display:'flex', flexDirection:'column', gap:12, overflowY:'auto' }}>

        {/* ── PASO 1: NOMBRE + GÉNERO ── */}
        {step === 'nombre' && (
          <>
            {/* Input nombre */}
            <div style={{ background:'white', borderRadius:16, padding:'14px 16px', border:'0.5px solid #F0E8E0' }}>
              <p style={{ fontSize:11, color:'#C4A090', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>
                Nombre del niño/a
              </p>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Escribe su nombre..."
                autoFocus
                style={{
                  width:'100%', border:'none', outline:'none',
                  fontSize:18, fontWeight:500, color:'#2D1808',
                  background:'transparent', fontFamily:"'Georgia',serif",
                  boxSizing:'border-box'
                }}
              />
            </div>

            {/* Género */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {([['female','👧','Niña'],['male','👦','Niño']] as const).map(([g, emoji, label]) => (
                <button key={g} onClick={() => setGenero(g)} style={{
                  padding:'18px 12px', borderRadius:16, cursor:'pointer',
                  border:`2px solid ${genero===g ? '#C4735A':'#F0E8E0'}`,
                  background: genero===g ? '#FFF8F4':'white',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:8
                }}>
                  <span style={{ fontSize:36 }}>{emoji}</span>
                  <span style={{ fontSize:13, fontWeight:600, color: genero===g ? '#C4735A':'#9CA3AF' }}>{label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop:'auto', paddingTop:8 }}>
              <button
                onClick={() => goNext('edad')}
                disabled={!nombre.trim() || !genero}
                style={{
                  width:'100%', padding:'14px', borderRadius:16,
                  background: nombre.trim() && genero
                    ? 'linear-gradient(135deg,#F4B880,#E89860)'
                    : '#F0E8E0',
                  border:'none', cursor: nombre.trim() && genero ? 'pointer':'default',
                  color: nombre.trim() && genero ? 'white':'#C4A090',
                  fontSize:15, fontWeight:600, transition:'all 0.2s'
                }}>
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* ── PASO 2: EDAD ── */}
        {step === 'edad' && (
          <>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {EDADES.map(e => (
                <button key={e.value} onClick={() => setEdad(e.value)} style={{
                  padding:'18px 20px', borderRadius:16, cursor:'pointer',
                  border:`2px solid ${edad===e.value ? '#C4735A':'#F0E8E0'}`,
                  background: edad===e.value ? '#FFF8F4':'white',
                  display:'flex', alignItems:'center', justifyContent:'space-between'
                }}>
                  <span style={{ fontSize:15, fontWeight:500, color: edad===e.value ? '#C4735A':'#2D1808' }}>
                    {e.label}
                  </span>
                  {edad===e.value && <span style={{ color:'#C4735A', fontSize:18 }}>✓</span>}
                </button>
              ))}
            </div>

            <div style={{ display:'flex', gap:10, marginTop:'auto', paddingTop:8 }}>
              <button onClick={() => goNext('nombre')} style={{ flex:1, padding:'14px', borderRadius:16, background:'white', border:'1px solid #F0E8E0', color:'#C4A090', fontSize:14, cursor:'pointer' }}>
                ← Atrás
              </button>
              <button
                onClick={() => goNext('perfil')}
                disabled={!edad}
                style={{
                  flex:2, padding:'14px', borderRadius:16,
                  background: edad ? 'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0',
                  border:'none', cursor: edad ? 'pointer':'default',
                  color: edad ? 'white':'#C4A090', fontSize:15, fontWeight:600
                }}>
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* ── PASO 3: PERFIL SENSORIAL ── */}
        {step === 'perfil' && (
          <>
            <p style={{ fontSize:12, color:'#C4A090', margin:0, lineHeight:1.6 }}>
              Elige el que mejor describe a {nombre}. Puedes ajustarlo más adelante.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {PERFILES.map(p => (
                <button key={p.id} onClick={() => setPerfil(p.id)} style={{
                  padding:'14px 16px', borderRadius:16, cursor:'pointer',
                  border:`2px solid ${perfil===p.id ? p.color:'#F0E8E0'}`,
                  background: perfil===p.id ? p.bg:'white',
                  display:'flex', alignItems:'flex-start', gap:12, textAlign:'left'
                }}>
                  <span style={{ fontSize:28, flexShrink:0, marginTop:2 }}>{p.emoji}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:600, color: perfil===p.id ? p.color:'#2D1808', margin:'0 0 3px' }}>
                      {p.titulo}
                    </p>
                    <p style={{ fontSize:11, color: perfil===p.id ? p.color:'#C4A090', margin:0, lineHeight:1.5, opacity:0.85 }}>
                      {p.desc}
                    </p>
                  </div>
                  {perfil===p.id && <span style={{ color:p.color, fontSize:16, flexShrink:0, marginTop:2 }}>✓</span>}
                </button>
              ))}
            </div>

            <div style={{ display:'flex', gap:10, marginTop:'auto', paddingTop:8 }}>
              <button onClick={() => goNext('edad')} style={{ flex:1, padding:'14px', borderRadius:16, background:'white', border:'1px solid #F0E8E0', color:'#C4A090', fontSize:14, cursor:'pointer' }}>
                ← Atrás
              </button>
              <button
                onClick={() => goNext('usuario')}
                disabled={!perfil}
                style={{
                  flex:2, padding:'14px', borderRadius:16,
                  background: perfil ? 'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0',
                  border:'none', cursor: perfil ? 'pointer':'default',
                  color: perfil ? 'white':'#C4A090', fontSize:15, fontWeight:600
                }}>
                Siguiente →
              </button>
            </div>
          </>
        )}

        {/* ── PASO 4: TIPO DE USUARIO ── */}
        {step === 'usuario' && (
          <>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

              <button onClick={() => setUsuario('familia')} style={{
                padding:'18px 16px', borderRadius:16, cursor:'pointer',
                border:`2px solid ${usuario==='familia' ? '#C4735A':'#F0E8E0'}`,
                background: usuario==='familia' ? '#FFF8F4':'white',
                display:'flex', alignItems:'flex-start', gap:14, textAlign:'left'
              }}>
                <span style={{ fontSize:32, flexShrink:0 }}>👨‍👩‍👧</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:600, color: usuario==='familia' ? '#C4735A':'#2D1808', margin:'0 0 4px' }}>
                    Soy familia o cuidador/a
                  </p>
                  <p style={{ fontSize:12, color:'#C4A090', margin:0, lineHeight:1.5 }}>
                    Quiero practicar Kawa en casa con actividades simples y acompañamiento cotidiano.
                  </p>
                </div>
                {usuario==='familia' && <span style={{ color:'#C4735A', fontSize:18, flexShrink:0 }}>✓</span>}
              </button>

              <button onClick={() => setUsuario('profesional')} style={{
                padding:'18px 16px', borderRadius:16, cursor:'pointer',
                border:`2px solid ${usuario==='profesional' ? '#2D6A4F':'#F0E8E0'}`,
                background: usuario==='profesional' ? '#F0F9F4':'white',
                display:'flex', alignItems:'flex-start', gap:14, textAlign:'left'
              }}>
                <span style={{ fontSize:32, flexShrink:0 }}>🩺</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:600, color: usuario==='profesional' ? '#2D6A4F':'#2D1808', margin:'0 0 4px' }}>
                    Soy profesional de salud o educación
                  </p>
                  <p style={{ fontSize:12, color:'#C4A090', margin:0, lineHeight:1.5 }}>
                    Terapeuta, psicólogo/a, educador/a. Necesito protocolos clínicos y herramientas de registro.
                  </p>
                  <span style={{ display:'inline-block', marginTop:6, fontSize:10, padding:'2px 8px', borderRadius:20, background:'#E8F5E9', color:'#2D6A4F', fontWeight:600 }}>
                    Incluye protocolo clínico TO
                  </span>
                </div>
                {usuario==='profesional' && <span style={{ color:'#2D6A4F', fontSize:18, flexShrink:0 }}>✓</span>}
              </button>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:'auto', paddingTop:8 }}>
              <button onClick={() => goNext('perfil')} style={{ flex:1, padding:'14px', borderRadius:16, background:'white', border:'1px solid #F0E8E0', color:'#C4A090', fontSize:14, cursor:'pointer' }}>
                ← Atrás
              </button>
              <button
                onClick={finish}
                disabled={!usuario}
                style={{
                  flex:2, padding:'14px', borderRadius:16,
                  background: usuario ? 'linear-gradient(135deg,#F4B880,#E89860)':'#F0E8E0',
                  border:'none', cursor: usuario ? 'pointer':'default',
                  color: usuario ? 'white':'#C4A090', fontSize:15, fontWeight:600
                }}>
                ¡Vamos, {nombre}! 🌱
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
