"use client";
import { useKawa } from '@/lib/context';

export default function ChallengeRing() {
  const { day, setOverlay } = useKawa();

  const count = `${day}/7`;

  return (
    <div style={{ position: 'absolute', top: 12, right: 12 }}>
      <button
        onClick={() => setOverlay('challenge')}
        aria-label="Abrir desafío"
        style={{
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <div style={{ width: 72, height: 72, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 9999,
              background: 'conic-gradient(#98C5A8 0% 45%, #F4EFE2 45% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#2D5F4F',
              transformOrigin: 'center',
              animation: 'challengePulse 9s cubic-bezier(.34,1.56,.64,1) infinite',
            }}
          >
            <span style={{ fontSize: 14 }}>{count}</span>
          </div>
        </div>
      </button>

      <style>{`
        @keyframes challengePulse {
          0%, 66% { transform: scale(1); box-shadow: none; }
          66% { transform: scale(1.36); box-shadow: 0 6px 28px rgba(92,183,108,0.28); }
          98% { transform: scale(1.36); box-shadow: 0 18px 48px rgba(92,183,108,0.22); }
          100% { transform: scale(1); box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
