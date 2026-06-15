'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ── Tipos ────────────────────────────────────────────────────
type FichaId = 'historia' | 'respiraciones' | 'relajacion' | 'perfil' | 'materiales' | 'clinico' | 'biblioteca'

// ── Datos de posturas S1 ─────────────────────────────────────
const POSTURAS = [
  { emoji: '🏔️', nombre: 'El Cuerpo que No Tiembla', tecnico: 'Tadasana', duracion: '30-45s', beneficio: 'Propiocepción', semana: 'S1' },
  { emoji: '🧘', nombre: 'El Trono de Oma', tecnico: 'Sukhasana', duracion: '45-60s', beneficio: 'Calma vagal', semana: 'S1' },
  { emoji: '🐱', nombre: 'La Espalda que Respira', tecnico: 'Marjaryasana', duracion: '5 ciclos', beneficio: 'Bilateral', semana: 'S1' },
  { emoji: '🌲', nombre: 'Las Raíces que Suben', tecnico: 'Vrksasana', duracion: '15-20s', beneficio: 'Equilibrio', semana: 'S1' },
  { emoji: '🐢', nombre: 'La Casa que Siempre Llevas', tecnico: 'Kurmasana', duracion: '30-60s', beneficio: 'Regulación', semana: 'S1' },
]

const BIBLIOTECA = [
  { emoji: '🏔️', nombre: 'Montaña', categoria: 'raices', color: '#e8f6f1', textColor: '#1a3d30', accentColor: '#7bbfab' },
  { emoji: '🧘', nombre: 'Indio', categoria: 'raices', color: '#e8f6f1', textColor: '#1a3d30', accentColor: '#7bbfab' },
  { emoji: '🌬️', nombre: 'Globo', categoria: 'respiracion', color: '#eaf7fb', textColor: '#0a3060', accentColor: '#2E6DA4' },
  { emoji: '🐱', nombre: 'Gato', categoria: 'raices', color: '#e8f6f1', textColor: '#1a3d30', accentColor: '#7bbfab' },
  { emoji: '🌲', nombre: 'Árbol', categoria: 'equilibrio', color: '#f2ecf5', textColor: '#2d1a4a', accentColor: '#b299be' },
  { emoji: '🎵', nombre: 'Bosque', categoria: 'musica', color: '#f0eefa', textColor: '#534AB7', accentColor: '#534AB7' },
]

// ── Componente Ficha (tab superior) ──────────────────────────
function FichaTab({
  id, emoji, titulo, subtitulo, color, textColor, borderColor, active, onClick,
}: {
  id: FichaId; emoji: string; titulo: string; subtitulo: string
  color: string; textColor: string; borderColor: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: color,
        border: active ? `1.5px solid ${borderColor}` : '1.5px solid transparent',
        borderRadius: 12,
        padding: '9px 12px',
        minWidth: 90,
        flexShrink: 0,
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: active ? '0 4px 14px rgba(0,0,0,0.1)' : 'none',
        transform: active ? 'translateY(-1px)' : 'none',
        transition: 'all 200ms',
      }}
    >
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: textColor, marginBottom: 2, opacity: 0.7 }}>
        {emoji} {titulo}
      </p>
      <p style={{ fontSize: 11, fontWeight: 700, color: textColor }}>{subtitulo}</p>
    </button>
  )
}

export default function PracticaPage() {
  const router = useRouter()
  const [fichaActiva, setFichaActiva] = useState<FichaId>('historia')
  const [rutina, setRutina] = useState<typeof BIBLIOTECA>([])

  const fichas: {
    id: FichaId; emoji: string; titulo: string; subtitulo: string
    color: string; textColor: string; borderColor: string
  }[] = [
    { id: 'historia',      emoji: '🌱', titulo: 'Historia',   subtitulo: 'y Posturas',   color: '#e8f6f1', textColor: '#1a3d30', borderColor: '#7bbfab' },
    { id: 'respiraciones', emoji: '💧', titulo: 'Respira',    subtitulo: 'ciones',        color: '#eaf7fb', textColor: '#0a3060', borderColor: '#2E6DA4' },
    { id: 'relajacion',    emoji: '✨', titulo: 'Relajac.',   subtitulo: 'y Música',      color: '#f2ecf5', textColor: '#2d1a4a', borderColor: '#b299be' },
    { id: 'perfil',        emoji: '⚡', titulo: 'Tips',       subtitulo: 'por Perfil',    color: '#fffbe8', textColor: '#4a1a08', borderColor: '#D4822A' },
    { id: 'materiales',    emoji: '📋', titulo: 'Mater.',     subtitulo: 'y PDFs',        color: '#fff3e8', textColor: '#4a1a08', borderColor: '#c04830' },
    { id: 'clinico',       emoji: '🧩', titulo: 'Prot.',      subtitulo: 'Clínicos',      color: '#f0faf4', textColor: '#1a3d30', borderColor: '#2D7A55' },
    { id: 'biblioteca',    emoji: '🌿', titulo: 'Biblio.',    subtitulo: 'Posturas',      color: '#f0eefa', textColor: '#0a0a1a', borderColor: '#534AB7' },
  ]

  // Progreso de la barra según ficha activa
  const progreso: Record<FichaId, number> = {
    historia: 1, respiraciones: 2, relajacion: 3,
    perfil: 4, materiales: 5, clinico: 5, biblioteca: 5,
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#faf7f2',
      fontFamily: "'Nunito', sans-serif", color: '#2d2a26',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .scroll-x { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; }
        .scroll-x::-webkit-scrollbar { display:none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 300ms ease both; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ padding: '52px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b5b0aa' }}>
              Semana 1 · Tierra
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', color: '#2d2a26', lineHeight: 1.1 }}>
              Práctica
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <button
              onClick={() => router.push('/historia')}
              style={{
                border: 'none', background: '#e8f6f1', borderRadius: 9999,
                padding: '6px 12px', cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, color: '#3d7a66',
              }}
            >
              ▶ Historia
            </button>
            <button
              onClick={() => router.back()}
              style={{
                border: 'none', background: 'rgba(45,42,38,0.06)', borderRadius: '50%',
                width: 30, height: 30, cursor: 'pointer', color: '#8a8680', fontSize: 13,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{ display: 'flex', gap: 3, margin: '12px 0' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{
              height: 2.5, flex: 1, borderRadius: 9999,
              background: n <= progreso[fichaActiva] ? '#2d2a26' : '#e8e2da',
              transition: 'background 400ms',
            }} />
          ))}
        </div>

        {/* Fichas horizontales */}
        <div className="scroll-x" style={{ margin: '0 -20px', padding: '0 20px 12px' }}>
          {fichas.map(f => (
            <FichaTab key={f.id} {...f} active={fichaActiva === f.id} onClick={() => setFichaActiva(f.id)} />
          ))}
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 100px' }}>

        {/* A: HISTORIA Y POSTURAS */}
        {fichaActiva === 'historia' && (
          <div className="fade-up">
            {/* Mini historia */}
            <div style={{
              background: 'linear-gradient(135deg,#1a3d30,#2D5F4F)',
              borderRadius: 14, padding: 16, marginBottom: 14,
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <span style={{ fontSize: 44, flexShrink: 0 }}>🌱</span>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(190,225,212,0.7)', marginBottom: 4 }}>
                  Narrativa · Semana 1
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'white', lineHeight: 1.55 }}>
                  Kawa cayó del Árbol del Universo. La tierra se mueve más mientras más corre. Oma le enseña: "Planta los pies. Aquí estás seguro."
                </p>
              </div>
            </div>

            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#b5b0aa', marginBottom: 10 }}>
              Posturas de la semana
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
              {POSTURAS.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'white', borderRadius: 12, padding: '10px 14px',
                  border: '0.5px solid rgba(45,42,38,0.07)',
                }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#2d2a26' }}>{p.nombre}</p>
                    <p style={{ fontSize: 10, color: '#8a8680' }}>{p.tecnico} · {p.duracion} · {p.beneficio}</p>
                  </div>
                  <span style={{
                    background: '#e8f6f1', color: '#3d7a66', borderRadius: 9999,
                    padding: '2px 9px', fontSize: 10, fontWeight: 700, flexShrink: 0,
                  }}>{p.semana}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/historia')}
              style={{
                width: '100%', border: 'none', background: '#1a3d30',
                borderRadius: 9999, padding: 14,
                fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700,
                color: 'white', cursor: 'pointer',
              }}
            >
              Practicar ahora →
            </button>
          </div>
        )}

        {/* B: TIPS POR PERFIL */}
        {fichaActiva === 'perfil' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { emoji: '🌸', label: 'Muy Sensible', color: '#f2ecf5', textColor: '#b299be', darkColor: '#2d1a4a', tip: 'Avisa 5 min antes. Ropa sin etiquetas. Baja el volumen. Si rechaza una postura, ofrece otra sin insistir.' },
              { emoji: '⚡', label: 'Buscador/a', color: '#fffbe8', textColor: '#D4822A', darkColor: '#4a1a08', tip: 'Jalea 4 minutos antes. Guerrero y Perro primero para descargar. Desafiar con ojos cerrados en Árbol.' },
              { emoji: '🌊', label: 'Bajo Registro', color: '#eaf7fb', textColor: '#2E6DA4', darkColor: '#0a3060', tip: 'Presión activa en cada postura. Música más movida al inicio. Practicar en piso irregular o hierba.' },
              { emoji: '🧩', label: 'Planif. Motora', color: '#e8f6f1', textColor: '#2D7A55', darkColor: '#1a3d30', tip: 'Demuestra primero. Gato I y Gato II por separado. 5 repeticiones mínimo. Celebra cada intento.' },
            ].map((p, i) => (
              <div key={i} style={{ background: p.color, borderRadius: 14, padding: '12px 14px' }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: p.textColor, marginBottom: 6 }}>{p.emoji} {p.label}</p>
                <p style={{ fontSize: 12, color: p.darkColor, lineHeight: 1.6 }}>{p.tip}</p>
              </div>
            ))}
          </div>
        )}

        {/* C: MATERIALES Y PDFs */}
        {fichaActiva === 'materiales' && (
          <div className="fade-up">
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#b5b0aa', marginBottom: 10 }}>
              Materiales de la clase
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { emoji: '🪨', nombre: 'Piedra verde', sub: 'Objeto táctil' },
                { emoji: '🧘', nombre: 'Colchoneta', sub: 'Material base' },
                { emoji: '🎵', nombre: 'Música bosque', sub: 'Ambiente tierra' },
                { emoji: '🪴', nombre: 'Cojín suave', sub: 'Opcional' },
              ].map((m, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 12, padding: 14, textAlign: 'center',
                  border: '0.5px solid rgba(45,42,38,0.07)',
                }}>
                  <p style={{ fontSize: 24, marginBottom: 6 }}>{m.emoji}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#2d2a26' }}>{m.nombre}</p>
                  <p style={{ fontSize: 10, color: '#8a8680', marginTop: 2 }}>{m.sub}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#b5b0aa', marginBottom: 8 }}>
              Materiales descargables
            </p>
            {[
              'Guía de posturas S1',
              'Tarjetas para imprimir',
              'Rutinas en casa · S1',
              'Ficha perfil sensorial',
            ].map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'white', borderRadius: 12, padding: '10px 14px',
                border: '0.5px solid rgba(45,42,38,0.07)', marginBottom: 6,
              }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <span style={{ fontSize: 13, color: '#2d2a26', flex: 1 }}>{doc}</span>
                <span style={{ fontSize: 18, color: '#b5b0aa' }}>↓</span>
              </div>
            ))}
          </div>
        )}

        {/* D: PROTOCOLOS CLÍNICOS */}
        {fichaActiva === 'clinico' && (
          <div className="fade-up">
            <div style={{ background: '#e8f6f1', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#2D7A55', marginBottom: 6 }}>
                Área profesional · Semana 1
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a3d30', marginBottom: 10, lineHeight: 1.5 }}>
                Integración Sensorial — Tierra<br />Protocolo Oma la Tortuga
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Propiocepción', 'Vestibular', 'Regulación SNA'].map(tag => (
                  <span key={tag} style={{
                    background: 'white', color: '#2D7A55', borderRadius: 9999,
                    padding: '3px 10px', fontSize: 10, fontWeight: 700,
                  }}>{tag}</span>
                ))}
              </div>
            </div>
            {[
              { emoji: '📊', nombre: 'Reporte semanal · S1' },
              { emoji: '📋', nombre: 'Ficha perfil Buscador/a' },
              { emoji: '📋', nombre: 'Ficha perfil Sensible' },
              { emoji: '🧩', nombre: 'Métricas integración S1' },
            ].map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'white', borderRadius: 12, padding: '10px 14px',
                border: '0.5px solid rgba(45,42,38,0.07)', marginBottom: 6,
              }}>
                <span style={{ fontSize: 18 }}>{doc.emoji}</span>
                <span style={{ fontSize: 13, color: '#2d2a26', flex: 1 }}>{doc.nombre}</span>
                <span style={{ fontSize: 16, color: '#b5b0aa' }}>↓</span>
              </div>
            ))}
          </div>
        )}

        {/* E: RESPIRACIONES */}
        {fichaActiva === 'respiraciones' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: '#eaf7fb', borderRadius: 14, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#0a3060' }}>Respiración Globo</p>
                  <p style={{ fontSize: 11, color: '#2E6DA4' }}>4 tiempos / 4 tiempos</p>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(42,111,176,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>🌬️</div>
              </div>
              <p style={{ fontSize: 12, color: '#0a3060', lineHeight: 1.6 }}>
                Manos en la pancita. La pancita es un globo que se infla y desinfla. Activa el sistema parasimpático.
              </p>
              <button
                onClick={() => router.push('/practica')}
                style={{
                  marginTop: 12, border: 'none', background: '#2E6DA4',
                  borderRadius: 9999, padding: '8px 16px',
                  fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
                  color: 'white', cursor: 'pointer',
                }}
              >
                ▶ Practicar
              </button>
            </div>
            <div style={{ background: '#eaf7fb', borderRadius: 14, padding: 14, opacity: 0.5 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#2E6DA4', marginBottom: 4 }}>
                ⭐ Respiración Estrella
                <span style={{ fontSize: 9, background: 'rgba(42,111,176,0.15)', borderRadius: 9999, padding: '2px 7px', marginLeft: 6 }}>S2</span>
              </p>
              <p style={{ fontSize: 12, color: '#2E6DA4' }}>Se desbloquea en Semana 2</p>
            </div>
          </div>
        )}

        {/* F: RELAJACIÓN Y MÚSICA */}
        {fichaActiva === 'relajacion' && (
          <div className="fade-up">
            <div style={{ background: '#f2ecf5', borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#2d1a4a', marginBottom: 8 }}>☁️ Shavasana · Tierra</p>
              <p style={{ fontSize: 13, color: '#4a3060', lineHeight: 2.0, fontStyle: 'italic' }}>
                "Cierra los ojos. Siente que estás en la tierra más suave del mundo. Kawa también está aquí, a tu lado..."
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={{
                  flex: 1, border: 'none', background: '#b299be', borderRadius: 9999, padding: 8,
                  fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: 'white', cursor: 'pointer',
                }}>▶ Reproducir</button>
                <button style={{
                  border: 'none', background: 'rgba(45,42,38,0.08)', borderRadius: 9999, padding: '8px 14px',
                  fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#8a8680', cursor: 'pointer',
                }}>+ Biblioteca</button>
              </div>
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#b5b0aa', marginBottom: 8 }}>
              Música ambiental
            </p>
            {[
              { emoji: '🌲', nombre: 'Bosque · Tierra', disponible: true },
              { emoji: '🌊', nombre: 'Océano · Agua', disponible: false, semana: 'S2' },
              { emoji: '💨', nombre: 'Viento · Aire', disponible: false, semana: 'S3' },
            ].map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'white', borderRadius: 12, padding: '10px 14px',
                border: '0.5px solid rgba(45,42,38,0.07)', marginBottom: 6,
                opacity: m.disponible ? 1 : 0.5,
              }}>
                <span style={{ fontSize: 18 }}>{m.emoji}</span>
                <span style={{ fontSize: 13, color: '#2d2a26', flex: 1 }}>{m.nombre}</span>
                {m.disponible
                  ? <span style={{ fontSize: 14, color: '#8a8680' }}>▶</span>
                  : <span style={{ fontSize: 9, background: '#e8e2da', borderRadius: 9999, padding: '2px 6px', color: '#8a8680' }}>{m.semana}</span>
                }
              </div>
            ))}
          </div>
        )}

        {/* G: BIBLIOTECA DE POSTURAS */}
        {fichaActiva === 'biblioteca' && (
          <div className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#b5b0aa' }}>
                Biblioteca de Posturas
              </p>
              <button style={{
                border: 'none', background: '#534AB7', borderRadius: 9999, padding: '5px 12px',
                fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 700, color: 'white', cursor: 'pointer',
              }}>+ Nueva rutina</button>
            </div>

            {/* Filtros */}
            <div className="scroll-x" style={{ marginBottom: 12 }}>
              {['Todas', '🌱 Raíces', '🌊 Calma', '⚡ Energía', '🌬️ Respira', '🎵 Música'].map((f, i) => (
                <span key={i} style={{
                  border: i === 0 ? '0.5px solid #534AB7' : '0.5px solid rgba(45,42,38,0.12)',
                  borderRadius: 9999, padding: '5px 12px',
                  fontSize: 11, fontWeight: i === 0 ? 700 : 600,
                  background: i === 0 ? '#534AB7' : 'transparent',
                  color: i === 0 ? 'white' : '#8a8680',
                  whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                }}>{f}</span>
              ))}
            </div>

            {/* Grid posturas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
              {BIBLIOTECA.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setRutina(prev => prev.find(r => r.nombre === p.nombre) ? prev : [...prev, p])}
                  style={{
                    background: p.color, borderRadius: 10, padding: '10px 6px',
                    textAlign: 'center', cursor: 'pointer', border: 'none',
                    transition: 'all 200ms',
                  }}
                >
                  <p style={{ fontSize: 22, marginBottom: 4 }}>{p.emoji}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: p.textColor }}>{p.nombre}</p>
                  <p style={{ fontSize: 9, color: p.accentColor, marginTop: 3 }}>+ Agregar</p>
                </button>
              ))}
              {/* Crear postura personalizada */}
              <div style={{
                background: '#faf7f2', borderRadius: 10, padding: '10px 6px',
                textAlign: 'center', cursor: 'pointer',
                border: '1.5px dashed #e8e2da',
              }}>
                <p style={{ fontSize: 22, marginBottom: 4 }}>✏️</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#b5b0aa' }}>Crear</p>
                <p style={{ fontSize: 9, color: '#b5b0aa', marginTop: 3 }}>postura</p>
              </div>
            </div>

            {/* Mis rutinas */}
            {rutina.length > 0 && (
              <>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#b5b0aa', marginBottom: 8 }}>
                  Rutina actual ({rutina.length} posturas)
                </p>
                <div style={{ background: 'white', borderRadius: 12, padding: '8px 14px', border: '0.5px solid rgba(45,42,38,0.07)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {rutina.map((r, i) => (
                      <span key={i} style={{ fontSize: 20 }}>{r.emoji}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{
                    flex: 1, border: 'none', background: '#534AB7',
                    borderRadius: 9999, padding: 12,
                    fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer',
                  }}>▶ Usar rutina</button>
                  <button
                    onClick={() => setRutina([])}
                    style={{
                      border: '0.5px solid rgba(45,42,38,0.12)', background: 'transparent',
                      borderRadius: 9999, padding: '12px 16px',
                      fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#b5b0aa', cursor: 'pointer',
                    }}
                  >Limpiar</button>
                </div>
              </>
            )}

            {rutina.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: 12, color: '#b5b0aa' }}>Toca una postura para agregarla a tu rutina</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
