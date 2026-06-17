"use client";
import Image from "next/image";
import { useKawa } from "@/lib/context";
import { useState, useEffect, useRef } from "react";

export default function StoryPlayer() {
  const { setOverlay } = useKawa();
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'linear-gradient(180deg, #2E4A2E 0%, #3D5A3D 40%, #4A6B4A 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between', padding: '60px 32px 50px',
      maxWidth: 402, margin: '0 auto'
    }}>
      <button
        onClick={() => setOverlay('none')}
        style={{
          position: 'absolute', top: 20, right: 20,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: 'none',
          color: 'white', fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >✕</button>

      <p style={{
        fontSize: 52, fontWeight: 300, color: 'white',
        fontFamily: 'var(--font-display)', letterSpacing: '0.05em'
      }}>
        {fmt(seconds)}
      </p>

      <Image
        src="/kawa/kawa-catarsis.png"
        alt="Kawa"
        width={180}
        height={180}
        style={{ objectFit: 'contain' }}
      />

      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 22, fontWeight: 900, color: 'white',
          fontFamily: 'var(--font-display)', marginBottom: 6
        }}>
          La historia de Kawa
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)' }}>
          Cap. 1 · La semilla que encontró sus raíces
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          <div style={{
            width: `${Math.min((seconds / 480) * 100, 100)}%`,
            height: '100%', background: 'rgba(255,255,255,0.7)', borderRadius: 2,
            transition: 'width 1s linear'
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 22, cursor: 'pointer' }}>↺</button>
          <button
            onClick={() => setPlaying(!playing)}
            style={{
              width: 56, height: 56, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.25)', color: 'white',
              fontSize: 22, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 22, cursor: 'pointer' }}>→</button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-sans)' }}>
          Postura sugerida · <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Montaña</strong>
        </p>
      </div>
    </div>
  );
}