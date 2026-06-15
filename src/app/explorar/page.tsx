'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'

type Tab = 'familia' | 'profesional'

const CLASES = [
  { titulo: 'S1 · Mundo de la Tierra', sub: 'Oma la Tortuga · 18 min', emoji: '🌍', disponible: true  },
  { titulo: 'S2 · Mundo del Agua',     sub: 'Iris el Pulpo · 22 min',  emoji: '💧', disponible: true  },
  { titulo: 'S3 · Mundo del Aire',     sub: 'Inti el Cóndor · 20 min', emoji: '💨', disponible: false },
  { titulo: 'S4 · Mundo del Fuego',    sub: 'Lumi la Salamandra · 24 min', emoji: '🔥', disponible: false },
  { titulo: 'S5 · El Espacio',         sub: 'La Ballena Cósmica · 30 min', emoji: '✨', disponible: false },
]

const RECURSOS_FAMILIA = [
  { titulo: 'Guía de perfiles sensoriales',   emoji: '📄', gratis: true  },
  { titulo: 'Rutinas en casa · Semana 1',     emoji: '📄', gratis: true  },
  { titulo: 'Tarjetas de posturas S1',        emoji: '📄', gratis: true  },
  { titulo: 'Guía de rutinas · Semana 2–5',  emoji: '📄', gratis: false },
]

const RECURSOS_PROFESIONAL = [
  { titulo: 'Marco teórico IS + Kawa',              emoji: '📄', gratis: true  },
  { titulo: 'Protocolo clínico S1 · Tierra',        emoji: '📄', gratis: true  },
  { titulo: 'Escala de observación sensorial',      emoji: '📄', gratis: false },
  { titulo: 'Reportes de integración S1–S5',        emoji: '📄', gratis: false },
]

const COMUNIDAD = [
  { titulo: 'Grupo de familias Kawa',       sub: 'WhatsApp · 240 familias',  emoji: '👨‍👩‍👧', color: '#25D366' },
  { titulo: 'Red de profesionales Kawa',    sub: 'WhatsApp · 80 profesionales', emoji: '🩺', color: '#1a3d30' },
]

export default function ExplorarPage() {
  const router   = useRouter()
  const { userType, setUserType } = useAppStore()

  // Tab activo — por defecto el del perfil del usuario
  const [tab, setTab] = useState<Tab>(userType === 'profesional' ? 'profesional' : 'familia')
  const [accClases,    setAccClases]    = useState(true)
  const [accRecursos,  setAccRecursos]  = useState(true)
  const [accComunidad, setAccComunidad] = useState(false)
  const [accProtocolos,setAccProtocolos]= useState(false)

  return (
    <div style={{
      minHeight: '100vh', background: '#faf7f2',
      fontFamily: "'Nunito', sans-serif",
      paddingBottom: 96,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div style={{ padding: '52px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <h1 style={{
              fontSize: 24, fontWeight: 900,
              letterSpacing: '-0.03em', color: '#2d2a26',
              lineHeight: 1.1, margin: 0,
            }}>Explorar</h1>
            <p style={{ fontSize: 12, color: '#8a8680', marginTop: 4 }}>
              Recursos, clases y comunidad
            </p>
          </div>
          <button
            onClick={() => router.push('/perfil')}
            style={{
              border: 'none', background: 'rgba(45,42,38,0.06)',
              borderRadius: '50%', width: 30, height: 30,
              cursor: 'pointer', color: '#8a8680', fontSize: 13,
              marginTop: 4,
            }}
          >⚙️</button>
        </div>

        {/* Toggle familia / profesional */}
        <div style={{
          display: 'flex', background: 'rgba(45,42,38,0.06)',
          borderRadius: 9999, padding: 3, margin: '16px 0 20px',
        }}>
          {(['familia', 'profesional'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, border: 'none', borderRadius: 9999,
                padding: '8px', cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 12, fontWeight: 700,
                background: tab === t ? '#2d2a26' : 'transparent',
                color: tab === t ? 'white' : '#8a8680',
                transition: 'all 200ms',
              }}
            >
              {t === 'familia' ? '👨‍👩‍👧 Familias' : '🩺 Profesionales'}
            </button>
          ))}
        </div>

        {/* Nota si el usuario ve la tab de otro perfil */}
        {userType && tab !== userType && (
          <div style={{
            background: '#fffbe8', borderRadius: 12,
            padding: '10px 14px', marginBottom: 16,
            border: '0.5px solid rgba(212,130,42,0.3)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 14 }}>💡</span>
            <p style={{ fontSize: 11, color: '#4a1a08', margin: 0, lineHeight: 1.5 }}>
              Estás viendo el área de {tab === 'familia' ? 'familias' : 'profesionales'}.{' '}
              <button
                onClick={() => { setUserType(tab); }}
                style={{ border: 'none', background: 'none', color: '#D4822A', fontWeight: 700, cursor: 'pointer', fontSize: 11, padding: 0, fontFamily: "'Nunito', sans-serif" }}
              >
                Cambiar mi perfil a {tab === 'familia' ? 'familia' : 'profesional'}
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Contenido scrollable */}
      <div style={{ padding: '0 20px' }}>

        {/* ── CLASES GRABADAS (ambos perfiles) ── */}
        <AccordionSection
          title="🎬 Clases grabadas"
          open={accClases}
          onToggle={() => setAccClases(v => !v)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CLASES.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 0',
                  borderBottom: i < CLASES.length - 1 ? '0.5px solid rgba(45,42,38,0.06)' : 'none',
                  opacity: c.disponible ? 1 : 0.4,
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{c.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#2d2a26', margin: 0 }}>{c.titulo}</p>
                  <p style={{ fontSize: 10, color: '#8a8680', margin: 0 }}>{c.sub}</p>
                </div>
                {c.disponible
                  ? <span style={{ fontSize: 14, color: '#b5b0aa' }}>▶</span>
                  : <span style={{ fontSize: 9, background: '#e8e2da', borderRadius: 9999, padding: '2px 7px', color: '#8a8680', fontWeight: 600 }}>Próximo</span>
                }
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* ── RECURSOS (diferentes por perfil) ── */}
        <AccordionSection
          title={tab === 'familia' ? '📚 Recursos gratuitos' : '📚 Recursos profesionales'}
          open={accRecursos}
          onToggle={() => setAccRecursos(v => !v)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(tab === 'familia' ? RECURSOS_FAMILIA : RECURSOS_PROFESIONAL).map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 0',
                  borderBottom: i < 3 ? '0.5px solid rgba(45,42,38,0.06)' : 'none',
                }}
              >
                <span style={{ fontSize: 16 }}>{r.emoji}</span>
                <span style={{ fontSize: 12, color: '#2d2a26', flex: 1 }}>{r.titulo}</span>
                {r.gratis
                  ? <span style={{ fontSize: 16, color: '#b5b0aa' }}>↓</span>
                  : <span style={{ fontSize: 9, background: '#e8f6f1', borderRadius: 9999, padding: '2px 7px', color: '#3d7a66', fontWeight: 600 }}>PRO</span>
                }
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* ── COMUNIDAD (ambos perfiles) ── */}
        <AccordionSection
          title="🌿 Comunidad Kawa"
          open={accComunidad}
          onToggle={() => setAccComunidad(v => !v)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COMUNIDAD.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'white', borderRadius: 12,
                  padding: '10px 12px',
                  border: '0.5px solid rgba(45,42,38,0.07)',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: c.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16, flexShrink: 0,
                }}>{c.emoji}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#2d2a26', margin: 0 }}>{c.titulo}</p>
                  <p style={{ fontSize: 10, color: '#8a8680', margin: 0 }}>{c.sub}</p>
                </div>
                <span style={{ fontSize: 12, color: c.color, fontWeight: 700 }}>→</span>
              </div>
            ))}
            <p style={{ fontSize: 11, color: '#b5b0aa', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.5 }}>
              Puedes unirte a ambos grupos
            </p>
          </div>
        </AccordionSection>

        {/* ── PROTOCOLOS CLÍNICOS (solo profesional) ── */}
        {tab === 'profesional' && (
          <AccordionSection
            title="🧩 Protocolos clínicos"
            open={accProtocolos}
            onToggle={() => setAccProtocolos(v => !v)}
          >
            <div style={{ background: '#e8f6f1', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#2D7A55', marginBottom: 5 }}>
                Área clínica · TO
              </p>
              <p style={{ fontSize: 12, color: '#1a3d30', lineHeight: 1.5, margin: 0 }}>
                Protocolos de integración sensorial basados en el marco de Jean Ayres, adaptados al programa Kawa para cada perfil sensorial.
              </p>
            </div>
            {[
              { titulo: 'Protocolo S1 · Tierra · Oma',      lock: false },
              { titulo: 'Protocolo S2 · Agua · Iris',       lock: true  },
              { titulo: 'Ficha perfil Muy Sensible',         lock: false },
              { titulo: 'Ficha perfil Buscador/a',           lock: false },
              { titulo: 'Reporte de progreso mensual',       lock: true  },
              { titulo: 'Dashboard de familias asignadas',   lock: true  },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'white', borderRadius: 12, padding: '10px 12px',
                  border: '0.5px solid rgba(45,42,38,0.07)', marginBottom: 6,
                  opacity: p.lock ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: 16 }}>📋</span>
                <span style={{ fontSize: 12, color: '#2d2a26', flex: 1 }}>{p.titulo}</span>
                {p.lock
                  ? <span style={{ fontSize: 9, background: '#e8e2da', borderRadius: 9999, padding: '2px 7px', color: '#8a8680', fontWeight: 600 }}>PRO</span>
                  : <span style={{ fontSize: 16, color: '#b5b0aa' }}>↓</span>
                }
              </div>
            ))}
          </AccordionSection>
        )}

      </div>
    </div>
  )
}

// ── COMPONENTE ACCORDION ──────────────────────────────────────────────────────
function AccordionSection({
  title, open, onToggle, children,
}: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div style={{ borderTop: '0.5px solid rgba(45,42,38,0.1)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', border: 'none', background: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 0',
          fontFamily: "'Nunito', sans-serif",
          fontSize: 14, fontWeight: 600, color: '#2d2a26',
        }}
      >
        <span>{title}</span>
        <span style={{
          fontSize: 14, color: '#8a8680',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 250ms',
          display: 'inline-block',
        }}>▾</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 16 }}>
          {children}
        </div>
      )}
    </div>
  )
}
