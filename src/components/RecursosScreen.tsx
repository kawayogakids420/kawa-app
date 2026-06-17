"use client";
import { useKawa } from "@/lib/context";

const RECURSOS = [
  {
    tag: "PREPARACIÓN",
    tagColor: "#7E9A7A",
    title: "Antes de empezar",
    sub: "Prepara el espacio y los materiales en 5 min.",
    tint: "#EBF0E8",
  },
  {
    tag: "GUÍA",
    tagColor: "#D9A23F",
    title: "Tips por perfil",
    sub: "Cómo acompañar según el perfil sensorial.",
    tint: "#FAF0D6",
  },
  {
    tag: "CLASE",
    tagColor: "#C07BA0",
    title: "Materiales",
    sub: "Lo de la clase y los descargables.",
    tint: "#F7E9F1",
  },
  {
    tag: "CLÍNICO",
    tagColor: "#7E9DB5",
    title: "Protocolos",
    sub: "Los marcos que guían cada sesión.",
    tint: "#E9F0F4",
  },
  {
    tag: "CATÁLOGO",
    tagColor: "#9A86A8",
    title: "Biblioteca de posturas",
    sub: "Todas las posturas por elemento.",
    tint: "#F0EAF2",
  },
];

export default function RecursosScreen() {
  const { world } = useKawa();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#F9F5F0' }}>

      {/* Header verde oscuro */}
      <div style={{ background: '#3D5A47', padding: '14px 18px 20px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
          MODO ADULTO
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1.1, marginBottom: 4 }}>
          Recursos
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)' }}>
          Todo para acompañar la práctica
        </p>
      </div>

      {/* Lista de recursos */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RECURSOS.map((r) => (
          <button key={r.title} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px', borderRadius: 18, border: 'none',
            background: 'white', cursor: 'pointer', textAlign: 'left', width: '100%',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
          }}>
            {/* Imagen placeholder */}
            <div style={{
              width: 72, height: 72, borderRadius: 14, flexShrink: 0,
              background: r.tint,
              backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 8px)`
            }} />
            {/* Texto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                color: r.tagColor, fontFamily: 'var(--font-sans)'
              }}>
                {r.tag}
              </span>
              <span style={{
                fontSize: 17, fontWeight: 900, color: '#2D2416',
                fontFamily: 'var(--font-display)', lineHeight: 1.2
              }}>
                {r.title}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 500, color: '#9A8070',
                fontFamily: 'var(--font-sans)', lineHeight: 1.4
              }}>
                {r.sub}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}