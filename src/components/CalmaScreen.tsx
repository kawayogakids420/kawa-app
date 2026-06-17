"use client";
import Image from "next/image";
import { useKawa } from "@/lib/context";

const CALMA_ITEMS = [
  {
    icon: "🫧",
    bg: "#E8EEF5",
    title: "Respiración Globo",
    sub: "3 minutos para soltar",
    action: "breath",
  },
  {
    icon: "🌿",
    bg: "#EDE8F5",
    title: "Sonidos del bosque",
    sub: "Ambiente para descansar",
    action: "relax",
  },
  {
    icon: null,
    bg: null,
    img: "/kawa/kawa-catarsis.png",
    title: "Un abrazo de Kawa",
    sub: "Cuento corto para calmar",
    action: "story",
  },
];

export default function CalmaScreen() {
  const { world, setOverlay } = useKawa();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: world.bg }}>

      {/* Header */}
      <div style={{ padding: '16px 22px 0', textAlign: 'center' }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          color: world.accent, marginBottom: 6, fontFamily: 'var(--font-sans)'
        }}>
          MOMENTO DE CALMA
        </p>
        <h1 style={{
          fontSize: 28, fontWeight: 900, color: '#2D2416',
          fontFamily: 'var(--font-display)', lineHeight: 1.2
        }}>
          Volvamos al centro
        </h1>
      </div>

      {/* Mascota con círculo */}
      <div style={{
        position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        height: 180, marginTop: 10
      }}>
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: world.heroBg, opacity: 0.6,
          position: 'absolute'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Image
            src="/kawa/kawa-catarsis.png"
            alt="Kawa"
            width={110}
            height={110}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Lista de items */}
      <div style={{
        background: 'white',
        borderRadius: '24px 24px 0 0',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flex: 1,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.05)'
      }}>
        {CALMA_ITEMS.map((item) => (
          <button
            key={item.title}
            onClick={() => setOverlay(item.action as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 18,
              border: 'none', background: '#FDFAF6',
              cursor: 'pointer', textAlign: 'left', width: '100%',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}
          >
            {/* Icono o imagen */}
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: item.bg ?? 'transparent',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
            }}>
              {item.img ? (
                <Image src={item.img} alt={item.title} width={48} height={48} style={{ objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: 24 }}>{item.icon}</span>
              )}
            </div>

            {/* Texto */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#2D2416', margin: 0, fontFamily: 'var(--font-sans)' }}>
                {item.title}
              </p>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#9A8070', margin: '2px 0 0', fontFamily: 'var(--font-sans)' }}>
                {item.sub}
              </p>
            </div>

            {/* Flecha */}
            <span style={{ color: world.accent, fontSize: 14, flexShrink: 0 }}>▶</span>
          </button>
        ))}
      </div>
    </div>
  );
}