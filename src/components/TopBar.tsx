"use client";
import { useKawa } from '@/lib/context';

export default function TopBar() {
  const { world, streak, totalDays, setOverlay } = useKawa();

  const pct = streak / totalDays;
  const deg = Math.round(pct * 360);

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 4px' }}>
      <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', color: world.accent, fontFamily: 'var(--font-display)' }}>
        kawa
      </span>

      {/* Rueda del desafío */}
      <button
        onClick={() => setOverlay('challenge')}
        style={{
          width: 46, height: 46, borderRadius: '50%', border: 'none',
          cursor: 'pointer', position: 'relative', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: `conic-gradient(${world.accent} ${deg}deg, #E8DDD4 ${deg}deg)`,
          padding: 3,
        }}
      >
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: 'white', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 12, fontWeight: 800,
          color: world.accent, fontFamily: 'var(--font-sans)'
        }}>
          {streak}/{totalDays}
        </div>
      </button>
    </header>
  );
}