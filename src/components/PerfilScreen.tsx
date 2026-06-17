"use client";
import { useState } from "react";
import { useKawa } from "@/lib/context";
import TestSensorial from "@/components/TestSensorial";

const SENSORY_PROFILES = [
  { id: "muy-sensible", name: "Muy Sensible",  dot: "#C07BA0", tint: "#F7E9F1" },
  { id: "buscador",     name: "Buscador/a",     dot: "#CE9226", tint: "#FBF1D6" },
  { id: "bajo",         name: "Bajo Registro",  dot: "#5F97BA", tint: "#E6F0F6" },
  { id: "planif",       name: "Planif. Motora", dot: "#7E9A7A", tint: "#EAF0E7" },
];

export default function PerfilScreen() {
  const { world, children, activeChildId, setActiveChildId, addChild, userType, setUserType, setChildName } = useKawa();
  const [showTest, setShowTest]         = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showEditChild, setShowEditChild] = useState(false);
  const [newName, setNewName]           = useState('');
  const [newAge, setNewAge]             = useState('');
  const [editName, setEditName]         = useState('');
  const [editAge, setEditAge]           = useState('');

  const activeChild = children.find(c => c.id === activeChildId) ?? children[0];

  if (showTest) return <TestSensorial onClose={() => setShowTest(false)} />;

  const handleAddChild = () => {
    if (!newName.trim()) return;
    const newChild = { id: Date.now().toString(), name: newName.trim(), age: parseInt(newAge) || 4, profile: 'muy-sensible' };
    addChild(newChild);
    setActiveChildId(newChild.id);
    setNewName(''); setNewAge('');
    setShowAddChild(false);
  };

  const handleEditChild = () => {
    if (!editName.trim()) return;
    setChildName(editName.trim());
    setShowEditChild(false);
  };

  const openEdit = () => {
    setEditName(activeChild?.name ?? '');
    setEditAge(String(activeChild?.age ?? 4));
    setShowEditChild(true);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#F9F5F0' }}>

      {/* Header verde */}
      <div style={{ background: '#3D5A47', padding: '14px 18px 24px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>NIÑO/A</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

          {/* Avatar con opción de foto */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '2px dashed rgba(255,255,255,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', flexShrink: 0
          }}>
            <span style={{ fontSize: 20 }}>🌱</span>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>foto</span>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {activeChild?.name ?? 'Sin niño'}
            </h2>
            <div style={{ display: 'inline-block', marginTop: 8, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 700, color: 'white' }}>
              Muy Sensible · {activeChild?.age ?? 4} años
            </div>
          </div>

          {/* Botón editar */}
          <button onClick={openEdit} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10,
            padding: '6px 10px', color: 'white', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-sans)'
          }}>✏️ Editar</button>
        </div>

        {/* Selector niños si hay más de uno */}
        {children.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {children.map(c => (
              <button key={c.id} onClick={() => setActiveChildId(c.id)} style={{
                padding: '4px 12px', borderRadius: 20, border: 'none',
                background: c.id === activeChildId ? 'white' : 'rgba(255,255,255,0.2)',
                color: c.id === activeChildId ? '#3D5A47' : 'white',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)'
              }}>{c.name}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Modal editar niño */}
        {showEditChild && (
          <div style={{ background: 'white', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, border: `1.5px solid ${world.accent}` }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#2D2416', margin: 0, fontFamily: 'var(--font-sans)' }}>Editar niño/a</p>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Nombre"
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E0D8D0', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }}
            />
            <input
              value={editAge}
              onChange={e => setEditAge(e.target.value)}
              placeholder="Edad"
              type="number"
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E0D8D0', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowEditChild(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid #E0D8D0', background: 'white', fontSize: 13, fontWeight: 700, color: '#9A8070', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Cancelar
              </button>
              <button onClick={handleEditChild} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: world.accent, fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* ¿Cómo usas la app? */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#9A8070' }}>¿CÓMO USAS LA APP?</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setUserType('familia')} style={{
            border: `2px solid ${userType === 'familia' ? world.accent : '#E0D8D0'}`,
            borderRadius: 16, padding: '14px 12px',
            background: userType === 'familia' ? world.accent + '15' : 'white',
            textAlign: 'left', cursor: 'pointer'
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👨‍👩‍👧</div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#2D2416', margin: 0 }}>Familia</p>
            <p style={{ fontSize: 12, color: '#9A8070', margin: '2px 0 0' }}>Guía para casa</p>
            {userType === 'familia' && <span style={{ display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 700, color: world.accent }}>✓ Activo</span>}
          </button>
          <button onClick={() => setUserType('profesional')} style={{
            border: `2px solid ${userType === 'profesional' ? world.accent : '#E0D8D0'}`,
            borderRadius: 16, padding: '14px 12px',
            background: userType === 'profesional' ? world.accent + '15' : 'white',
            textAlign: 'left', cursor: 'pointer'
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🩺</div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#2D2416', margin: 0 }}>Profesional</p>
            <p style={{ fontSize: 12, color: '#9A8070', margin: '2px 0 0' }}>Terapeuta / salud</p>
            {userType === 'profesional' && <span style={{ display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 700, color: world.accent }}>✓ Activo</span>}
          </button>
        </div>

        <p style={{ fontSize: 12, color: world.accent, fontWeight: 600, fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
          {userType === 'profesional' ? '✓ Verás protocolos clínicos en Recursos' : '✓ Verás actividades y guías para practicar en casa'}
        </p>

        {/* Agregar niño */}
        {!showAddChild ? (
          <button onClick={() => setShowAddChild(true)} style={{ width: '100%', padding: 14, borderRadius: 12, border: `1.5px dashed ${world.accent}`, background: 'transparent', fontSize: 14, fontWeight: 700, color: world.accent, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            + Agregar niño/a
          </button>
        ) : (
          <div style={{ background: 'white', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#2D2416', margin: 0, fontFamily: 'var(--font-sans)' }}>Agregar niño/a</p>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nombre"
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E0D8D0', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }}
            />
            <input
              value={newAge}
              onChange={e => setNewAge(e.target.value)}
              placeholder="Edad"
              type="number"
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E0D8D0', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowAddChild(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid #E0D8D0', background: 'white', fontSize: 13, fontWeight: 700, color: '#9A8070', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Cancelar
              </button>
              <button onClick={handleAddChild} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: world.accent, fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Perfil predominante */}
        <div style={{ background: '#FDF0F5', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C07BA0', flexShrink: 0, marginTop: 4 }} />
          <p style={{ fontSize: 13, color: '#4A3C30', lineHeight: 1.5, margin: 0 }}>
            <strong>Perfil predominante: Muy Sensible.</strong> Percibe el mundo con gran intensidad; necesita suavidad.
          </p>
        </div>

        {/* Perfiles sensoriales */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#9A8070' }}>PERFILES SENSORIALES</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {SENSORY_PROFILES.map((p) => {
            const active = activeChild?.profile === p.id;
            return (
              <div key={p.id} style={{ background: p.tint, borderRadius: 16, padding: 10, position: 'relative', outline: active ? `2px solid ${p.dot}` : 'none' }}>
                {active && (
                  <div style={{ position: 'absolute', top: 8, right: 8, background: world.accent, color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                    Tu perfil
                  </div>
                )}
                <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: 10, marginBottom: 8, background: `repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.dot }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#2D2416' }}>{p.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Test sensorial */}
        <button onClick={() => setShowTest(true)} style={{ width: '100%', padding: 16, borderRadius: 16, border: 'none', background: world.accent, color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          Hacer el test sensorial completo
        </button>

        {/* Resetear progreso */}
        <button
          onClick={() => {
            if (confirm('¿Resetear todo el progreso de ' + (activeChild?.name ?? 'este niño') + '?')) {
              alert('Progreso reseteado ✓');
            }
          }}
          style={{ background: 'none', border: '1px solid #FECACA', borderRadius: 12, padding: '12px', fontSize: 13, color: '#E24B4A', cursor: 'pointer', fontFamily: 'var(--font-sans)', width: '100%' }}>
          Resetear progreso
        </button>

      </div>
    </div>
  );
}