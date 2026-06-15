'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ── Datos de fases por semana ────────────────────────────────
const FASES = [
  {
    label: 'Inicio',
    texto: 'Kawa cayó del Árbol del Universo y aterrizó en un mundo desconocido. ¡Todo se mueve bajo sus pies! Cuanto más corre, más tiembla la tierra.',
    kawaSrc: '/kawa/kawa-inicio.png',
    boca: 'M50 80 Q60 70 70 80',
    mejillas: 0.05,
  },
  {
    label: 'Desequilibrio',
    texto: 'Kawa empuja el suelo con fuerza para levantarse... ¡pero el suelo cede! Su cuerpo no sabe dónde está. Siente que flota sin poder parar.',
    kawaSrc: '/kawa/kawa-desequilibrio.png',
    boca: 'M50 82 Q60 78 70 82',
    mejillas: 0.08,
  },
  {
    label: 'El guardián',
    texto: 'Entonces aparece Oma la Tortuga. Muy despacio, planta sus cuatro patas y dice: "Siente el suelo, Kawa. Él ya te sostiene."',
    kawaSrc: '/kawa/guardian-oma.png',
    boca: 'M50 80 Q60 82 70 80',
    mejillas: 0.15,
  },
  {
    label: 'Catarsis',
    texto: 'Kawa planta los pies. Respira. El suelo no se mueve. Una lágrima cae — no de miedo, sino de alivio. ¡Su cuerpo encontró su peso! 🌱',
    kawaSrc: '/kawa/kawa-catarsis.png',
    boca: 'M50 76 Q60 88 70 76',
    mejillas: 0.22,
  },
  {
    label: 'Enseñanza',
    texto: 'Oma le entrega una piedra suave y verde: "Cuando el mundo se mueva, sostenla. Recuerda: tú eres una montaña. Nada puede moverte." 🪨',
    kawaSrc: '/kawa/kawa-ensenanza.png',
    boca: 'M50 74 Q60 90 70 74',
    mejillas: 0.28,
  },
]

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`
}

// ── Kawa SVG (fallback si no hay imagen PNG) ─────────────────
function KawaSVG({ fase }: { fase: number }) {
  const f = FASES[fase]
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 130" role="img">
      <title>Kawa en la fase {f.label}</title>
      <ellipse cx="60" cy="122" rx="36" ry="6" fill="rgba(0,0,0,.15)" />
      <ellipse cx="60" cy="68" rx="40" ry="50" fill="#2D5F4F" />
      <ellipse cx="60" cy="64" rx="35" ry="44" fill="#3d7a66" />
      <ellipse cx="60" cy="60" rx="30" ry="38" fill="#4a9070" />
      <ellipse cx="44" cy="42" rx="11" ry="16" fill="rgba(255,255,255,.14)" transform="rotate(-18 44 42)" />
      <path d="M54 22 Q44 8 36 14 Q40 24 54 24Z" fill="#2D5F4F" />
      <path d="M54 22 Q46 9 38 15 Q42 23 54 24Z" fill="#3d7a66" />
      <path d="M66 20 Q76 6 84 12 Q80 22 66 22Z" fill="#1a3d30" />
      <path d="M66 20 Q74 7 82 13 Q78 21 66 22Z" fill="#2D5F4F" />
      <ellipse cx="47" cy="65" rx="8" ry="9" fill="white" />
      <ellipse cx="73" cy="65" rx="8" ry="9" fill="white" />
      <circle cx="49" cy="67" r="5" fill="#1a3d30" />
      <circle cx="75" cy="67" r="5" fill="#1a3d30" />
      <circle cx="51" cy="64" r="2" fill="white" />
      <circle cx="77" cy="64" r="2" fill="white" />
      <path d={f.boca} fill="none" stroke="#1a3d30" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="37" cy="74" rx="7" ry="5" fill="#c04830" opacity={f.mejillas} />
      <ellipse cx="83" cy="74" rx="7" ry="5" fill="#c04830" opacity={f.mejillas} />
    </svg>
  )
}

export default function HistoriaPage() {
  const router = useRouter()
  const [playing, setPlaying] = useState(false)
  const [timer, setTimer] = useState(0)
  const [fase, setFase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [imgError, setImgError] = useState<Record<number, boolean>>({})
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const totalDuration = 120 // segundos totales de la historia

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const togglePlay = useCallback(() => {
    if (playing) {
      stopTimer()
      setPlaying(false)
    } else {
      setPlaying(true)
      timerRef.current = setInterval(() => {
        setTimer(t => {
          const next = t + 1
          const pct = Math.min((next / totalDuration) * 100, 100)
          setProgress(pct)
          // Cambia fase automáticamente cada 24 segundos
          const newFase = Math.min(Math.floor(next / 24), 4)
          setFase(newFase)
          if (next >= totalDuration) {
            stopTimer()
            setPlaying(false)
          }
          return next
        })
      }, 1000)
    }
  }, [playing, stopTimer])

  useEffect(() => () => stopTimer(), [stopTimer])

  const currentFase = FASES[fase]
  const hasImage = !imgError[fase]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #1a3d30 0%, #0f2820 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Timer de fondo — elegante y transparente */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: 'clamp(64px, 20vw, 96px)',
            fontWeight: 200,
            color: 'rgba(255,255,255,0.08)',
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            animation: playing ? 'timerPulse 3s ease infinite' : 'none',
          }}
        >
          {fmt(timer)}
        </span>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={() => { stopTimer(); router.back() }}
        style={{
          position: 'absolute',
          top: 52,
          right: 20,
          zIndex: 10,
          border: 'none',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          width: 36,
          height: 36,
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>

      {/* KAWA — 70% de pantalla */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          paddingTop: 40,
        }}
      >
        <div
          style={{
            width: '70%',
            maxWidth: 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'float 5s ease-in-out infinite',
          }}
        >
          {/* Imagen PNG si existe, SVG de fallback si no */}
          {hasImage ? (
            <img
              src={currentFase.kawaSrc}
              alt={`Kawa — ${currentFase.label}`}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              onError={() => setImgError(prev => ({ ...prev, [fase]: true }))}
            />
          ) : (
            <div style={{ width: '100%', aspectRatio: '1' }}>
              <KawaSVG fase={fase} />
            </div>
          )}

          {/* Nombre de fase — sutil */}
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              marginTop: 12,
              transition: 'all 500ms',
            }}
          >
            {currentFase.label}
          </p>
        </div>
      </div>

      {/* CONTROLES INFERIORES */}
      <div
        style={{
          width: '100%',
          padding: '0 28px 48px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Barra de progreso de audio */}
        <div
          style={{
            width: '100%',
            height: 2,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 9999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'rgba(255,255,255,0.35)',
              width: `${progress}%`,
              borderRadius: 9999,
              transition: 'width 1s linear',
            }}
          />
        </div>

        {/* Fila: puntitos de fase + play + ir a práctica */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* 5 puntitos */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {FASES.map((_, i) => (
              <button
                key={i}
                onClick={() => setFase(i)}
                style={{
                  width: i === fase ? 8 : 5,
                  height: i === fase ? 8 : 5,
                  borderRadius: '50%',
                  background: i <= fase ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 300ms',
                }}
              />
            ))}
          </div>

          {/* Botón PLAY principal */}
          <button
            onClick={togglePlay}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.12)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 200ms',
              boxShadow: playing ? '0 0 0 2px rgba(255,255,255,0.2)' : 'none',
            }}
          >
            <span style={{ fontSize: 22, color: 'white', marginLeft: playing ? 0 : 3 }}>
              {playing ? '⏸' : '▶'}
            </span>
          </button>

          {/* Ir a práctica */}
          <button
            onClick={() => { stopTimer(); router.push('/practica') }}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 9999,
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.02em',
            }}
          >
            práctica →
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;700;800;900&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes timerPulse {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.12; }
        }
      `}</style>
    </div>
  )
}
