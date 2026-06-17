"use client";
import Image from "next/image";
import { useKawa } from "@/lib/context";

const MOODS = [
  { img: "/kawa/kawa-catarsis.png",      label: "Necesito calma",  sub: "Respira y baja revoluciones", bg: "#FDF0E8" },
  { img: "/kawa/kawa-enseñanza.png",     label: "Quiero moverme",  sub: "Energía y juego activo",      bg: "#EDF4E8" },
  { img: "/kawa/kawa-desequilibrio.png", label: "Día difícil",     sub: "Un S.O.S. de 3 minutos",      bg: "#EEE8F4" },
];

export default function HoyScreen() {
  const { world, userName } = useKawa();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg,#FBE3CF 0%,#F7E7D6 42%,#F3EFE4 100%)' }}>

      <style>{`
        @keyframes flotar {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        .kawa-flota { animation: flotar 3.5s ease-in-out infinite; }
      `}</style>

      <div style={{ padding: '12px 22px 0' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#A08060', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>
          Hola, {userName}
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.15, color: '#2D2416', fontFamily: 'var(--font-display)' }}>
          ¿Cómo se siente<br />tu cuerpo hoy?
        </h1>
      </div>

      <div style={{ position: 'relative', height: 260, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* colinas en posición original */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 289, height: 136, borderRadius: '145px 145px 0 0',
          background: '#9DB89A'
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 213, height: 102, borderRadius: '106px 106px 0 0',
          background: '#7E9A7A'
        }} />
        {/* kawa en posición bajada */}
        <div className="kawa-flota" style={{ position: 'absolute', bottom: -10, zIndex: 2 }}>
          <Image
            src="/kawa/kawa-inicio.png"
            alt="Kawa"
            width={246}
            height={246}
            style={{ objectFit: 'contain', display: 'block' }}
            priority
          />
        </div>
      </div>

      <div style={{
        background: 'white', borderRadius: '26px 26px 0 0',
        padding: '20px 16px 8px', display: 'flex', flexDirection: 'column',
        gap: 10, flex: 1, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
      }}>
        {MOODS.map((m) => (
          <button key={m.label} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', borderRadius: 18, border: 'none',
            background: m.bg, cursor: 'pointer', textAlign: 'left', width: '100%'
          }}>
            <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src={m.img} alt={m.label} width={48} height={48}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#2D2416', fontFamily: 'var(--font-sans)' }}>{m.label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#9A8070', fontFamily: 'var(--font-sans)' }}>{m.sub}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}