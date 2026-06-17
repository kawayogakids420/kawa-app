"use client";
import Image from "next/image";
import { useKawa } from "@/lib/context";

const POSTURAS = [
  { name: "Montaña", tag: "RAÍCES",  tint: "#EBF0E8" },
  { name: "Indio",   tag: "CALMA",   tint: "#F6EAE3" },
  { name: "Globo",   tag: "RESPIRA", tint: "#E9F0F4" },
  { name: "Gato",    tag: "ENERGÍA", tint: "#FAF0D6" },
  { name: "Árbol",   tag: "RAÍCES",  tint: "#EBF0E8" },
  { name: "Bosque",  tag: "CALMA",   tint: "#F0EAF2" },
];

const TAG_COLORS: Record<string, string> = {
  "RAÍCES":  "#7E9A7A",
  "CALMA":   "#9A86A8",
  "RESPIRA": "#7E9DB5",
  "ENERGÍA": "#D9A23F",
};

export default function PracticarScreen() {
  const { world, setOverlay } = useKawa();

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F9F5F0' }}>

      {/* Banner historia */}
      <div style={{
        margin: '12px 14px 0', borderRadius: 20, overflow: 'hidden',
        height: 220,
        background: 'linear-gradient(180deg, #3A5A3A 0%, #4A6B4A 70%, #5A7B5A 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between', padding: '16px'
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/kawa/kawa-guardian.png" alt="Kawa" width={130} height={130} style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
          <button
            onClick={() => setOverlay('story')}
            style={{
              width: 44, height: 44, borderRadius: '50%', border: 'none',
              background: 'rgba(230, 160, 90, 0.95)', color: 'white',
              fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.25)'
            }}>▶</button>
          <div>
            <p style={{ fontSize: 16, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>
              La historia de Kawa
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontFamily: 'var(--font-sans)' }}>
              Cap. 1 · La semilla que encontró sus raíces · 8 min
            </p>
          </div>
        </div>
      </div>

      {/* Posturas */}
      <div style={{ background: 'white', borderRadius: '24px 24px 0 0', margin: '12px 0 0', padding: '18px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#2D2416', fontFamily: 'var(--font-sans)' }}>Posturas de hoy</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: world.accent }}>6 posturas</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {POSTURAS.map((p) => (
            <button key={p.name} style={{
              background: p.tint, borderRadius: 14, padding: '10px 8px',
              border: 'none', cursor: 'pointer', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: 6
            }}>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: 10,
                background: `repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)`
              }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#2D2416', fontFamily: 'var(--font-sans)' }}>{p.name}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: TAG_COLORS[p.tag], fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }}>{p.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Respiraciones */}
      <div style={{ padding: '18px 14px 0' }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: '#2D2416', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>Respiraciones</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => setOverlay('breath')}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 16, border: 'none',
              background: '#E8EEF5', cursor: 'pointer', width: '100%', textAlign: 'left'
            }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#7E9DB5', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#2D2416', fontFamily: 'var(--font-sans)' }}>Respiración Globo</p>
              <p style={{ fontSize: 12, color: '#9A8070', marginTop: 2, fontFamily: 'var(--font-sans)' }}>4 tiempos · 4 tiempos · Calma el cuerpo</p>
            </div>
            <span style={{ color: world.accent, fontSize: 16 }}>▶</span>
          </button>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', borderRadius: 16, border: 'none',
            background: '#F0F0F0', cursor: 'default', width: '100%', textAlign: 'left',
            opacity: 0.5
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#C8B8A8', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#2D2416', fontFamily: 'var(--font-sans)' }}>Respiración Estrella</p>
              <p style={{ fontSize: 12, color: '#9A8070', marginTop: 2, fontFamily: 'var(--font-sans)' }}>Se desbloquea en Semana 2</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C8B8A8', background: '#E8E0D8', padding: '3px 8px', borderRadius: 20 }}>S2</span>
          </button>
        </div>
      </div>

      {/* Relajación */}
      <div style={{ padding: '18px 14px 24px' }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: '#2D2416', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>Relajación y música</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => setOverlay('relax')}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 16, border: 'none',
              background: '#EDE8F5', cursor: 'pointer', width: '100%', textAlign: 'left'
            }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#9A86A8', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#2D2416', fontFamily: 'var(--font-sans)' }}>Bosque al atardecer</p>
              <p style={{ fontSize: 12, color: '#9A8070', marginTop: 2, fontFamily: 'var(--font-sans)' }}>Sonidos suaves · 6 min</p>
            </div>
            <span style={{ color: world.accent, fontSize: 16 }}>▶</span>
          </button>
        </div>
      </div>

    </div>
  );
}