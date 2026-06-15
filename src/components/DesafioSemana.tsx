'use client'
import { useState } from 'react'
import { useAppStore, CHALLENGES } from '@/lib/store'

export default function DesafioSemana() {
  const { challenge, markChallengeDay, chooseReward, isTodayCompleted, getChallengeInfo } = useAppStore()
  const [showReward, setShowReward] = useState(false)

  const info       = getChallengeInfo()
  const todayDone  = isTodayCompleted()
  const dias       = challenge.daysCompleted.length
  const isComplete = dias >= 7
  const pct        = Math.min((dias / 7) * 100, 100)

  const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  function handleMark() {
    if (todayDone || isComplete) return
    markChallengeDay()
    if (challenge.daysCompleted.length + 1 >= 7) setShowReward(true)
  }

  function handleReward(r: 'plant' | 'audio') {
    chooseReward(r)
    setShowReward(false)
  }

  return (
    <>
      {/* ── MODAL RECOMPENSA ── */}
      {showReward && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            background: 'white', borderRadius: 24, padding: '28px 24px',
            width: '100%', maxWidth: 340, textAlign: 'center',
          }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🎁</p>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#2d2a26', marginBottom: 6 }}>
              ¡7 días completados!
            </h3>
            <p style={{ fontSize: 14, color: '#8a8680', marginBottom: 20, lineHeight: 1.5 }}>
              Elige tu recompensa:
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleReward('plant')}
                style={{
                  flex: 1, border: '1.5px solid #bee1d4', borderRadius: 14,
                  padding: 14, background: '#e8f6f1', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                <p style={{ fontSize: 24, marginBottom: 6 }}>🌱</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#1a3d30' }}>Sticker para tu planta</p>
              </button>
              <button
                onClick={() => handleReward('audio')}
                style={{
                  flex: 1, border: '1.5px solid #b299be', borderRadius: 14,
                  padding: 14, background: '#f2ecf5', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                <p style={{ fontSize: 24, marginBottom: 6 }}>🎵</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#2d1a4a' }}>Audio de relajación nuevo</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CARD DESAFÍO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3d30 0%, #2D5F4F 100%)',
        borderRadius: 20, padding: 16, marginBottom: 12,
        boxShadow: '0 8px 24px rgba(26,61,48,0.25)',
        fontFamily: "'Nunito', sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
              Desafío del mes {info.emoji}
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 2 }}>
              {info.title}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
              {info.desc}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.12)', borderRadius: 12,
            padding: '6px 12px', textAlign: 'center', flexShrink: 0,
          }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1 }}>{dias}</p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>de 7</p>
          </div>
        </div>

        {/* 7 puntitos de días */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
          {DIAS.map((dia, i) => {
            const done    = i < dias
            const isToday = i === dias && !isComplete
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: '50%',
                  background: done
                    ? 'rgba(255,255,255,0.9)'
                    : isToday
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(255,255,255,0.07)',
                  border: isToday ? '1.5px solid rgba(255,255,255,0.4)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  color: done ? '#1a3d30' : 'transparent',
                  transition: 'all 400ms',
                }}>
                  {done ? '✓' : ''}
                </div>
                <p style={{
                  fontSize: 9, fontWeight: 700, margin: 0,
                  color: done ? 'rgba(255,255,255,0.8)' : isToday ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                }}>{dia}</p>
              </div>
            )
          })}
        </div>

        {/* Barra de progreso */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 9999, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            background: 'rgba(255,255,255,0.7)',
            width: `${pct}%`, transition: 'width 0.5s ease',
          }} />
        </div>

        {/* Botón acción */}
        {isComplete && challenge.rewardChosen ? (
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: 12,
            padding: '10px 14px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
              ✓ Desafío completado este mes 🌿
            </p>
          </div>
        ) : isComplete ? (
          <button
            onClick={() => setShowReward(true)}
            style={{
              width: '100%', border: 'none',
              background: '#ffea8e', borderRadius: 12, padding: 12,
              fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 800,
              color: '#2d2a26', cursor: 'pointer',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            🎁 ¡Elegir recompensa!
          </button>
        ) : todayDone ? (
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: 12,
            padding: '10px 14px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              ✓ Ya completaste hoy · Quedan {7 - dias} días 🎁
            </p>
          </div>
        ) : (
          <button
            onClick={handleMark}
            style={{
              width: '100%', border: 'none',
              background: '#bee1d4', borderRadius: 12, padding: 12,
              fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700,
              color: '#1a3d30', cursor: 'pointer', transition: 'all 200ms',
            }}
          >
            ✓ Marcar día de hoy como completado
          </button>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,234,142,0.4); }
        }
      `}</style>
    </>
  )
}
