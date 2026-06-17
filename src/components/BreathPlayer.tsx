"use client";
import Image from "next/image";
import { useKawa } from "@/lib/context";
import { useState, useEffect } from "react";

export default function BreathPlayer() {
  const { setOverlay, world } = useKawa();
  const [tick, setTick] = useState(0); // 0-7: 0-3 inhala, 4-7 exhala

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 8);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const phase = tick < 4 ? 'inhala' : 'exhala';
  const count = tick < 4 ? tick + 1 : tick - 3;
  const progress = tick < 4 ? (tick + 1) / 4 : 1 - (tick - 3) / 4;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: world.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between', padding: '60px 32px 50px',
      maxWidth: 402, margin: '0 auto'
    }}>

      <style>{`
        .circulo-outer { transition: transform 0.9s ease-in-out; }
        .circulo-inner { transition: transform 0.9s ease-in-out; }
        .kawa-circle   { transition: transform 0.9s ease-in-out; }
      `}</style>

      {/* Botón cerrar */}
      <button
        onClick={() => setOverlay('none')}
        style={{
          position: 'absolute', top: 20, right: 20,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(0,0,0,0.08)', border: 'none',
          color: '#2D2416', fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >✕</button>

      {/* Título */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 24, fontWeight: 900, color: '#2D2416',
          fontFamily: 'var(--font-display)', marginBottom: 6
        }}>
          Respiración Globo
        </h2>
        <p style={{ fontSize: 13, color: '#9A8070', fontFamily: 'var(--font-sans)' }}>
          Infla la pancita como un globo
        </p>
      </div>

      {/* Círculos + Kawa */}
      <div style={{
        position: 'relative', width: 280, height: 280,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div className="circulo-outer" style={{
          position: 'absolute',
          width: 260, height: 260, borderRadius: '50%',
          background: world.heroBg, opacity: 0.25,
          transform: `scale(${0.5 + progress * 0.55})`,
        }} />
        <div className="circulo-inner" style={{
          position: 'absolute',
          width: 190, height: 190, borderRadius: '50%',
          background: world.heroBg, opacity: 0.55,
          transform: `scale(${0.5 + progress * 0.55})`,
        }} />
        <div className="kawa-circle" style={{
          position: 'relative', zIndex: 2,
          transform: `scale(${0.8 + progress * 0.3})`,
        }}>
          <Image
            src="/kawa/kawa-catarsis.png"
            alt="Kawa"
            width={120}
            height={120}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Fase y cuenta */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 16, fontWeight: 600, color: '#9A8070',
          fontFamily: 'var(--font-sans)', marginBottom: 4
        }}>
          Inhala 4 · Exhala 4
        </p>
        <p style={{
          fontSize: 20, fontWeight: 800, color: world.accent,
          fontFamily: 'var(--font-display)'
        }}>
          {phase === 'inhala' ? 'Inhala' : 'Exhala'} {count}
        </p>
      </div>

      {/* Botón terminar */}
      <button
        onClick={() => setOverlay('none')}
        style={{
          width: '100%', padding: '16px', borderRadius: 16, border: 'none',
          background: world.accent, color: 'white',
          fontSize: 16, fontWeight: 800, cursor: 'pointer',
          fontFamily: 'var(--font-sans)'
        }}
      >
        Terminar
      </button>
    </div>
  );
}