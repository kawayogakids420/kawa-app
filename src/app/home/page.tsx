'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import DesafioSemana from '@/components/DesafioSemana'

const ESTADOS = [
  {
    label: 'Necesito calma',
    color: '#2a6fb0',
    pale:  'rgba(42,111,176,0.1)',
    border:'rgba(42,111,176,0.3)',
    href:  '/historia',
    hint:  'Historia + respiración suave',
  },
  {
    label: 'Quiero moverme',
    color: '#c04830',
    pale:  'rgba(192,72,48,0.1)',
    border:'rgba(192,72,48,0.3)',
    href:  '/practica',
    hint:  'Posturas con energía',
  },
  {
    label: 'Día difícil',
    color: '#6a4d90',
    pale:  'rgba(106,77,144,0.1)',
    border:'rgba(106,77,144,0.3)',
    href:  '/historia',
    hint:  'Solo 3 minutos de calma',
  },
]

export default function HomePage() {
  const router  = useRouter()
  const { children, activeChildId } = useAppStore()

  const activeChild = children.find(c => c.id === activeChildId) ?? children[0] ?? null
  const nombre = activeChild?.name
    ? activeChild.name.charAt(0).toUpperCase() + activeChild.name.slice(1).toLowerCase()
    : 'Guardián'

  const [selected, setSelected] = useState<number | null>(null)
  const [mounted,  setMounted]  = useState(false)
  useEffect(() => setMounted(true), [])

  function handlePill(i: number) {
    setSelected(i)
  }

  function handleComenzar() {
    if (selected === null) return
    router.push(ESTADOS[selected].href)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf7f2',
      fontFamily: "'Nunito', sans-serif",
      paddingBottom: 96,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ padding: '56px 28px 0', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
          <span style={{
            fontSize: 17, fontWeight: 400,
            color: '#2d2a26', letterSpacing: '-0.02em',
          }}>kawa</span>
          <button
            onClick={() => router.push('/perfil')}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#e8f6f1', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}
          >
            {activeChild?.gender === 'female' ? '👧' : '👦'}
          </button>
        </div>

        {/* Pregunta del día */}
        <div style={{
          marginBottom: 40,
          animation: mounted ? 'fadeUp 400ms ease both' : 'none',
        }}>
          <p style={{
            fontSize: 26, fontWeight: 700,
            color: '#2d2a26', lineHeight: 1.3,
            letterSpacing: '-0.025em', margin: 0,
          }}>
            Hola {nombre},<br />
            ¿cómo se siente<br />
            tu cuerpo hoy?
          </p>
        </div>

        {/* 3 Píldoras */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          marginBottom: 28,
          animation: mounted ? 'fadeUp 400ms 80ms ease both' : 'none',
        }}>
          {ESTADOS.map((e, i) => (
            <button
              key={i}
              onClick={() => handlePill(i)}
              style={{
                width: '100%',
                padding: '15px 24px',
                background: selected === i ? e.pale : 'rgba(45,42,38,0.04)',
                border: selected === i
                  ? `1px solid ${e.border}`
                  : '1px solid transparent',
                borderRadius: 9999,
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 15, fontWeight: 500,
                color: selected === i ? e.color : '#2d2a26',
                letterSpacing: '-0.01em',
                textAlign: 'center',
                transition: 'all 450ms cubic-bezier(.4,0,.2,1)',
              }}
            >
              {e.label}
            </button>
          ))}
        </div>

        {/* CTA — aparece al seleccionar */}
        <div style={{
          height: 52,
          marginBottom: 32,
          transition: 'opacity 400ms, transform 400ms',
          opacity: selected !== null ? 1 : 0,
          transform: selected !== null ? 'translateY(0)' : 'translateY(6px)',
          pointerEvents: selected !== null ? 'auto' : 'none',
        }}>
          {selected !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{
                fontSize: 11, color: '#8a8680',
                textAlign: 'center', margin: 0,
                letterSpacing: '0.02em',
              }}>
                {ESTADOS[selected].hint}
              </p>
              <button
                onClick={handleComenzar}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 14, fontWeight: 700,
                  color: ESTADOS[selected].color,
                  letterSpacing: '-0.01em',
                  padding: '4px 0',
                }}
              >
                comenzar →
              </button>
            </div>
          )}
        </div>

        {/* Desafío 7 días */}
        <div style={{
          animation: mounted ? 'fadeUp 400ms 160ms ease both' : 'none',
        }}>
          <DesafioSemana />
        </div>

        {/* Botón SOS — siempre visible, muy discreto */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={() => router.push('/historia')}
            style={{
              border: 'none', background: 'none',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              fontSize: 11, fontWeight: 600,
              color: '#b5b0aa',
              letterSpacing: '0.02em',
            }}
          >
            🆘 Momento difícil · 3 min
          </button>
        </div>

      </div>
    </div>
  )
}
