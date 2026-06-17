"use client";
import { useKawa } from '@/lib/context';

const KID_NAV = [
  { label: 'Hoy',       tab: 'hoy',       shape: 'circle' },
  { label: 'Practicar', tab: 'practicar', shape: 'diamond' },
  { label: 'Calma',     tab: 'calma',     shape: 'ring' },
  { label: 'Adultas',   tab: null,        shape: 'square', action: 'adult' },
] as const;

const ADULT_NAV = [
  { label: 'Perfil',   tab: 'perfil',   shape: 'circle' },
  { label: 'Recursos', tab: 'recursos', shape: 'diamond' },
  { label: 'Niño',     tab: null,       shape: 'square', action: 'kid' },
] as const;

function Shape({ type, color }: { type: string; color: string }) {
  if (type === 'circle') return (
    <div style={{ width: 24, height: 24, borderRadius: '50%', background: color }} />
  );
  if (type === 'diamond') return (
    <div style={{ width: 18, height: 18, background: color, transform: 'rotate(45deg)', borderRadius: 3 }} />
  );
  if (type === 'ring') return (
    <div style={{ width: 24, height: 24, borderRadius: '50%', border: `3px solid ${color}`, background: 'transparent' }} />
  );
  if (type === 'square') return (
    <div style={{ width: 22, height: 22, borderRadius: 6, background: color }} />
  );
  return null;
}

export default function BottomNav() {
  const { tab, setTab, mode, setMode, world } = useKawa();
  const items = mode === 'kid' ? KID_NAV : ADULT_NAV;

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 0 20px', background: 'white',
      borderTop: '1px solid rgba(0,0,0,0.06)'
    }}>
      {items.map((item) => {
        const active = item.tab === tab;
        const color = active ? world.accent : '#C8B8A8';
        return (
          <button
            key={item.label}
            onClick={() => {
              if ('action' in item && item.action === 'adult') { setMode('adult'); setTab('perfil'); }
              else if ('action' in item && item.action === 'kid') { setMode('kid'); setTab('hoy'); }
              else if (item.tab) setTab(item.tab as any);
            }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 5, background: 'none', border: 'none', cursor: 'pointer',
              minWidth: 60, padding: '0 8px'
            }}
          >
            <Shape type={item.shape} color={color} />
            <span style={{
              fontSize: 11, fontWeight: 600, color,
              fontFamily: 'var(--font-sans)', transition: 'color 0.2s'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}