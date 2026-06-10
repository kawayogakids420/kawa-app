'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Week } from '@/lib/data/course'

// Degradados cálidos por guardián
const WARM_GRADIENTS: Record<number, string> = {
  1: 'linear-gradient(150deg,#FFE9A0 0%,#FFCDB8 50%,#F5B8C8 100%)',
  2: 'linear-gradient(150deg,#B8E4FF 0%,#C8D4FF 50%,#E0C8FF 100%)',
  3: 'linear-gradient(150deg,#D4F0FF 0%,#C8E8F8 50%,#D8D0FF 100%)',
  4: 'linear-gradient(150deg,#FFD4A0 0%,#FFB890 50%,#FF9898 100%)',
  5: 'linear-gradient(150deg,#F8D4FF 0%,#E8C8FF 50%,#C8D8FF 100%)',
}

const WARM_TEXT: Record<number, string> = {
  1: '#7A3520', 2: '#1A2870', 3: '#1A3060', 4: '#7A2010', 5: '#4A1870',
}

const CTA_GRADIENTS: Record<number, string> = {
  1: 'linear-gradient(135deg,#F4B880,#E89860)',
  2: 'linear-gradient(135deg,#80B0F4,#6090E8)',
  3: 'linear-gradient(135deg,#80C8F4,#60B0E8)',
  4: 'linear-gradient(135deg,#F4A070,#E87850)',
  5: 'linear-gradient(135deg,#C880F4,#A860E8)',
}

const FRASES_GUARDIAN: Record<number, string> = {
  1: 'Aprendiste a arraigarte como una montaña. La Tierra vive en ti.',
  2: 'Aprendiste a fluir como el agua. El movimiento es tu aliado.',
  3: 'Aprendiste a volar como el viento. Tu energía tiene alas.',
  4: 'Aprendiste a transformarte como el fuego. Tu calma es poderosa.',
  5: 'Completaste el viaje de los 5 guardianes. Kawa está orgullosa de ti.',
}

// Estrellas animadas
function Star({ delay, x, y }: { delay: number; x: number; y: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      fontSize: 20, opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
      transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      pointerEvents: 'none', zIndex: 0,
    }}>⭐</div>
  )
}

interface Props {
  week: Week
  childName: string
  starsEarned: number
  totalSections: number
  onContinue: () => void
}

export default function CelebracionScreen({ week, childName, starsEarned, totalSections, onContinue }: Props) {
  const router    = useRouter()
  const gradient  = WARM_GRADIENTS[week.id] || WARM_GRADIENTS[1]
  const titleCol  = WARM_TEXT[week.id]      || WARM_TEXT[1]
  const ctaGrad   = CTA_GRADIENTS[week.id]  || CTA_GRADIENTS[1]
  const frase     = FRASES_GUARDIAN[week.id] || FRASES_GUARDIAN[1]

  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(t)
  }, [])

  // Posiciones de estrellas decorativas
  const starPositions = [
    [10, 15], [85, 10], [20, 75], [75, 80],
    [50, 5],  [5, 50],  [95, 50], [40, 90],
  ]

  return (
    <div style={{
      minHeight: '100vh', background: gradient,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden',
      textAlign: 'center',
    }}>

      {/* Círculos decorativos */}
      <div style={{ position:'absolute', top:-40, right:-40, width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,0.25)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-30, left:-30, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.18)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'40%', left:-20, width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,0.12)', pointerEvents:'none' }} />

      {/* Estrellas animadas decorativas */}
      {starPositions.map(([x, y], i) => (
        <Star key={i} delay={400 + i * 120} x={x} y={y} />
      ))}

      {/* Contenido central */}
      <div style={{
        position: 'relative', zIndex: 1,
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease',
        width: '100%', maxWidth: 340,
      }}>

        {/* Emoji grande */}
        <div style={{ fontSize: 72, marginBottom: 8, lineHeight: 1 }}>
          {week.elementEmoji}
        </div>

        {/* Nombre del guardián */}
        <div style={{ background:'rgba(255,255,255,0.35)', borderRadius:20, padding:'3px 14px', display:'inline-block', marginBottom:16 }}>
          <p style={{ fontSize:12, color:titleCol, fontWeight:600, margin:0, opacity:0.8 }}>
            Guardián {week.id} · {week.element}
          </p>
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: 28, fontWeight: 600, color: titleCol,
          margin: '0 0 8px', fontFamily:"'Georgia',serif", lineHeight: 1.2,
        }}>
          ¡Increíble, {childName}!
        </h1>

        {/* Frase del guardián */}
        <p style={{
          fontSize: 14, color: titleCol, opacity: 0.75,
          margin: '0 0 28px', lineHeight: 1.6, fontStyle: 'italic',
        }}>
          "{frase}"
        </p>

        {/* Estrellas ganadas */}
        <div style={{
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.75)',
          borderRadius: 18, padding: '16px 20px', marginBottom: 24,
        }}>
          <p style={{ fontSize: 11, color: titleCol, opacity: 0.65, margin: '0 0 10px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>
            Estrellas ganadas hoy
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            {Array.from({ length: totalSections }).map((_, i) => (
              <span key={i} style={{
                fontSize: 28,
                opacity: i < starsEarned ? 1 : 0.2,
                transform: i < starsEarned ? 'scale(1)' : 'scale(0.8)',
                transition: `all 0.4s ease ${i * 150}ms`,
                display: 'inline-block',
              }}>
                ⭐
              </span>
            ))}
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: titleCol, margin: 0 }}>
            {starsEarned} de {totalSections} secciones completadas
          </p>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <button
            onClick={() => router.push('/home')}
            style={{
              width: '100%', padding: '14px', borderRadius: 16,
              background: ctaGrad, border: 'none', cursor: 'pointer',
              color: 'white', fontSize: 15, fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}>
            Volver al inicio 🗺️
          </button>

          <button
            onClick={onContinue}
            style={{
              width: '100%', padding: '12px', borderRadius: 16,
              background: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.6)',
              cursor: 'pointer', color: titleCol,
              fontSize: 13, fontWeight: 500,
            }}>
            Registrar la sesión 📝
          </button>
        </div>

      </div>
    </div>
  )
}
