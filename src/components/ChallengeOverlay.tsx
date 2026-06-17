"use client";
import { useKawa } from '@/lib/context';

export default function ChallengeOverlay() {
  const { day, setDay, setOverlay } = useKawa();

  function close() {
    setOverlay('none');
  }

  function markToday() {
    setDay(Math.min(day + 1, 7));
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '92%', maxWidth: 420, borderRadius: 20, background: 'white', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={close} style={{ border: 'none', background: 'transparent', fontSize: 20 }}>‹ Recursos</button>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Sendero de 7 piedras</h3>
          <div style={{ width: 48 }} />
        </div>

        <p style={{ marginTop: 12, color: '#5D5447' }}>Marca los días que completes el desafío. Hoy: {day}/7</p>

        <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'space-between' }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const idx = i + 1;
            const done = idx <= day;
            const isToday = idx === day + 1;
            return (
              <div key={idx} style={{ flex: 1 }}>
                <div style={{ height: isToday ? 64 : 48, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#98C5A8' : '#FFF', border: done ? 'none' : '2px solid #E8E3D9' }}>
                  {done ? '✓' : isToday ? '🙂' : ''}
                </div>
                <p style={{ textAlign: 'center', marginTop: 6, fontSize: 12 }}>{idx}</p>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 18 }}>
          <button onClick={markToday} style={{ width: '100%', padding: 12, borderRadius: 12, background: '#bee1d4', border: 'none', fontWeight: 800 }}>Marcar día de hoy</button>
        </div>
      </div>
    </div>
  );
}
