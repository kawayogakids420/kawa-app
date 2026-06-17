"use client";
import { useState } from "react";
import { useKawa } from "@/lib/context";

const SECTIONS = [
  { id: 'A', label: 'Sensibilidad Táctil',     color: '#C07BA0' },
  { id: 'B', label: 'Movimiento y Equilibrio', color: '#7E9DB5' },
  { id: 'C', label: 'Fuerza y Postura',        color: '#7E9A7A' },
  { id: 'D', label: 'Sonidos y Audición',      color: '#D9A23F' },
  { id: 'E', label: 'Visión y Entorno',        color: '#9A86A8' },
  { id: 'F', label: 'Coordinación',            color: '#C97B4B' },
];

const QUESTIONS = [
  { section:'A', text:'Se queja de etiquetas de ropa o costuras de calcetines' },
  { section:'A', text:'Le molestan ciertas telas (áspera, lana, sintéticas)' },
  { section:'A', text:'Reacciona exageradamente cuando alguien lo toca por sorpresa' },
  { section:'A', text:'Evita actividades con texturas (barro, plastilina, arena)' },
  { section:'A', text:'Se incomoda con el baño, lavado de cabello o corte de uñas' },
  { section:'A', text:'Prefiere tocar a otros pero no le gusta que lo toquen' },
  { section:'A', text:'Parece no sentir cuando se golpea o raspa' },
  { section:'A', text:'No nota cuando tiene las manos o cara sucias' },
  { section:'A', text:'Busca tocar todo lo que ve, mete cosas a la boca' },
  { section:'A', text:'Necesita que lo abrazen o aprieten fuerte para calmarse' },
  { section:'A', text:'Parece tener un umbral de dolor muy alto' },
  { section:'B', text:'Le da mucho miedo subir a columpios o lugares altos' },
  { section:'B', text:'Se marea fácilmente en el carro o con movimientos circulares' },
  { section:'B', text:'Tiene miedo cuando le levantan los pies del piso' },
  { section:'B', text:'Se cae frecuentemente, tropieza o choca con personas' },
  { section:'B', text:'Tiene dificultad para sentarse quieto, se resbala de la silla' },
  { section:'B', text:'No le gusta intentar nuevas actividades físicas o deportes' },
  { section:'B', text:'Busca girarse, rodar o columpiarse todo el tiempo sin marearse' },
  { section:'B', text:'Le encanta correr, saltar, trepar sin parar' },
  { section:'B', text:'Siempre está moviéndose, parece que no puede quedarse quieto' },
  { section:'B', text:'Busca sensaciones de movimiento intensas que parecen riesgosas' },
  { section:'C', text:'Usa demasiada fuerza: rompe cosas, aprieta muy fuerte al abrazar' },
  { section:'C', text:'Camina de puntillas frecuentemente' },
  { section:'C', text:'Choca con muebles, marcos de puertas o personas sin querer' },
  { section:'C', text:'Necesita apoyarse en paredes o personas, se "derrite" en la silla' },
  { section:'C', text:'Le cuesta tareas que requieren fuerza controlada (escribir, dibujar)' },
  { section:'C', text:'Parece no saber qué tan fuerte está haciendo fuerza' },
  { section:'D', text:'Se tapa los oídos ante ruidos cotidianos (secadora, aplausos)' },
  { section:'D', text:'Se pone muy nervioso en lugares ruidosos (fiestas, centros comerciales)' },
  { section:'D', text:'Le cuesta concentrarse cuando hay mucho ruido de fondo' },
  { section:'D', text:'Reacciona exageradamente a sonidos agudos o inesperados' },
  { section:'D', text:'Parece no escuchar cuando se le llama, sin problemas de audición' },
  { section:'D', text:'Siempre busca hacer ruido o escuchar música muy fuerte' },
  { section:'E', text:'Se distrae mucho con cualquier movimiento o estímulo visual' },
  { section:'E', text:'Le molestan los ambientes muy iluminados o la luz del sol' },
  { section:'E', text:'Evita el contacto visual o se siente incómodo mirando de frente' },
  { section:'E', text:'Se choca con objetos que están claramente visibles' },
  { section:'E', text:'Le cuesta encontrar cosas en entornos desordenados' },
  { section:'E', text:'Le encanta mirar luces, girar objetos o buscar patrones visuales' },
  { section:'F', text:'Le cuesta aprender actividades nuevas que involucren su cuerpo' },
  { section:'F', text:'Parece torpe para su edad: se tropieza, dificultad al vestirse' },
  { section:'F', text:'Le cuesta seguir secuencias de movimientos (danzas, deportes)' },
  { section:'F', text:'Tarda mucho más que otros en aprender a usar cubiertos, atar agujetas' },
  { section:'F', text:'Evita juegos que requieren coordinación (pelotas, bicicleta, trepar)' },
  { section:'F', text:'Le cuesta imitar movimientos o gestos que hace otra persona' },
];

const PROFILE_MAP: Record<number, Partial<Record<string, number>>> = {
  0:{sensible:3}, 1:{sensible:3}, 2:{sensible:3}, 3:{sensible:2},
  4:{sensible:2}, 5:{sensible:2}, 6:{bajo:3}, 7:{bajo:3},
  8:{buscador:3,bajo:1}, 9:{buscador:2,bajo:2}, 10:{bajo:3},
  11:{sensible:3}, 12:{sensible:2}, 13:{sensible:3}, 14:{motor:2,bajo:1},
  15:{motor:2,bajo:1}, 16:{sensible:2}, 17:{buscador:3,bajo:1},
  18:{buscador:3}, 19:{buscador:3}, 20:{buscador:3,bajo:1},
  21:{buscador:2,bajo:2}, 22:{buscador:1,bajo:2},
  23:{bajo:2,motor:1}, 24:{bajo:3}, 25:{motor:3}, 26:{bajo:2,motor:1},
  27:{sensible:3}, 28:{sensible:3}, 29:{sensible:2}, 30:{sensible:3},
  31:{bajo:3}, 32:{buscador:2},
  33:{sensible:2}, 34:{sensible:3}, 35:{sensible:2},
  36:{motor:2,bajo:1}, 37:{motor:2}, 38:{buscador:2,bajo:1},
  39:{motor:3}, 40:{motor:3}, 41:{motor:3}, 42:{motor:3}, 43:{motor:2}, 44:{motor:3},
};

const FREQ = [
  { label: 'Casi nunca', bg: '#EBF0E8', selected: '#7E9A7A' },
  { label: 'A veces',    bg: '#FAF0D6', selected: '#D9A23F' },
  { label: 'Seguido',    bg: '#FDF0E8', selected: '#C97B4B' },
  { label: 'Casi siempre', bg: '#F7E9F1', selected: '#C07BA0' },
];

const PROFILES = {
  sensible: { name: 'Muy Sensible',   color: '#C07BA0', tint: '#F7E9F1' },
  buscador: { name: 'Buscador/a',     color: '#CE9226', tint: '#FBF1D6' },
  bajo:     { name: 'Bajo Registro',  color: '#5F97BA', tint: '#E6F0F6' },
  motor:    { name: 'Planif. Motora', color: '#7E9A7A', tint: '#EAF0E7' },
};

function calcPcts(answers: number[]) {
  const scores: Record<string, number> = { sensible:0, buscador:0, bajo:0, motor:0 };
  const maxes:  Record<string, number> = { sensible:0, buscador:0, bajo:0, motor:0 };
  answers.forEach((ans, i) => {
    const map = PROFILE_MAP[i];
    if (!map || ans < 0) return;
    Object.entries(map).forEach(([p, w]) => {
      scores[p] += (ans / 3) * (w as number);
      maxes[p]  += (w as number);
    });
  });
  return {
    sensible: maxes.sensible > 0 ? Math.round((scores.sensible / maxes.sensible) * 100) : 0,
    buscador: maxes.buscador > 0 ? Math.round((scores.buscador / maxes.buscador) * 100) : 0,
    bajo:     maxes.bajo     > 0 ? Math.round((scores.bajo     / maxes.bajo)     * 100) : 0,
    motor:    maxes.motor    > 0 ? Math.round((scores.motor    / maxes.motor)    * 100) : 0,
  };
}

interface Props { onClose: () => void; }

export default function TestSensorial({ onClose }: Props) {
  const { world, childName } = useKawa();
  const [secIdx, setSecIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [result, setResult] = useState<Record<string, number> | null>(null);

  const currentSec    = SECTIONS[secIdx];
  const sectionQs     = QUESTIONS.map((q, i) => ({ ...q, index: i })).filter(q => q.section === currentSec?.id);
  const sectionDone   = sectionQs.every(q => answers[q.index] >= 0);
  const totalAnswered = answers.filter(a => a >= 0).length;

  const handleAnswer = (idx: number, val: number) => {
    const a = [...answers]; a[idx] = val; setAnswers(a);
  };

  const nextSec = () => {
    if (secIdx < SECTIONS.length - 1) {
      setSecIdx(secIdx + 1);
    } else {
      setResult(calcPcts(answers));
    }
  };

  // ── RESULTADO ──
  if (result) {
    const sorted = Object.entries(result).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];
    const domProfile = PROFILES[dominant as keyof typeof PROFILES];

    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#F9F5F0', display: 'flex', flexDirection: 'column',
        maxWidth: 402, margin: '0 auto', overflowY: 'auto'
      }}>
        <div style={{ background: '#3D5A47', padding: '50px 18px 24px' }}>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: 6, marginBottom: 14, fontFamily: 'var(--font-sans)', fontWeight: 700
          }}>← Volver al perfil</button>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
            RESULTADO · {childName}
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)', margin: 0 }}>
            Test sensorial
          </h2>
        </div>

        <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Aviso */}
          <div style={{ background: '#FFF8E1', borderRadius: 14, padding: '12px 14px' }}>
            <p style={{ fontSize: 11, color: '#92400E', margin: 0, lineHeight: 1.5, fontFamily: 'var(--font-sans)' }}>
              ⚠️ Este cuestionario es orientativo y no reemplaza una evaluación clínica profesional.
            </p>
          </div>

          {/* Perfil dominante */}
          <div style={{ background: domProfile.tint, borderRadius: 18, padding: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: domProfile.color, marginBottom: 10, fontFamily: 'var(--font-sans)' }}>
              PERFIL PREDOMINANTE
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: domProfile.color }} />
                <p style={{ fontSize: 22, fontWeight: 900, color: domProfile.color, fontFamily: 'var(--font-display)', margin: 0 }}>
                  {domProfile.name}
                </p>
              </div>
              <span style={{ fontSize: 28, fontWeight: 900, color: domProfile.color, fontFamily: 'var(--font-display)' }}>
                {result[dominant]}%
              </span>
            </div>
          </div>

          {/* Mapa sensorial */}
          <div style={{ background: 'white', borderRadius: 18, padding: '16px' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#2D2416', marginBottom: 16, fontFamily: 'var(--font-sans)' }}>
              Mapa sensorial completo
            </p>
            {sorted.map(([key, val]) => {
              const p = PROFILES[key as keyof typeof PROFILES];
              return (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#2D2416', fontFamily: 'var(--font-sans)' }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 900, color: p.color, fontFamily: 'var(--font-display)' }}>{val}%</span>
                  </div>
                  <div style={{ height: 10, background: '#F0EBE3', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${val}%`,
                      background: p.color, borderRadius: 6,
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Qué hacer */}
          <div style={{ background: 'white', borderRadius: 18, padding: '16px' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#2D2416', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
              ¿Qué hacer con este resultado?
            </p>
            {[
              { emoji: '🧘', text: 'Las clases de Kawa ya están adaptadas para este perfil.' },
              { emoji: '💡', text: 'Usa los consejos en Recursos para acompañar mejor a tu niño/a.' },
              { emoji: '🩺', text: 'Si algún área supera el 70%, consulta con un terapeuta ocupacional.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.emoji}</span>
                <p style={{ fontSize: 12, color: '#4A3C30', margin: 0, lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>{item.text}</p>
              </div>
            ))}
          </div>

          <button onClick={onClose} style={{
            width: '100%', padding: 16, borderRadius: 16, border: 'none',
            background: world.accent, color: 'white',
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'var(--font-sans)'
          }}>
            Guardar y volver al perfil
          </button>
        </div>
      </div>
    );
  }

  // ── PREGUNTAS ──
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#F9F5F0', display: 'flex', flexDirection: 'column',
      maxWidth: 402, margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ background: '#3D5A47', padding: '50px 18px 16px', flexShrink: 0 }}>
        <button onClick={secIdx > 0 ? () => setSecIdx(secIdx - 1) : onClose} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center',
          gap: 6, marginBottom: 14, fontFamily: 'var(--font-sans)', fontWeight: 700
        }}>
          ← {secIdx > 0 ? 'Sección anterior' : 'Volver'}
        </button>

        {/* Barra progreso */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {SECTIONS.map((s, i) => (
            <div key={s.id} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= secIdx ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>
          Sección {secIdx + 1} de {SECTIONS.length} · {totalAnswered}/{QUESTIONS.length} respondidas
        </p>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)', margin: 0 }}>
          {currentSec.label}
        </h2>
      </div>

      {/* Preguntas */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
        {sectionQs.map(q => (
          <div key={q.index} style={{
            background: 'white', borderRadius: 18, padding: '16px',
            marginBottom: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
          }}>
            <p style={{
              fontSize: 14, fontWeight: 700, color: '#2D2416',
              margin: '0 0 14px', lineHeight: 1.5,
              fontFamily: 'var(--font-display)'
            }}>
              {q.text}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {FREQ.map((f, val) => {
                const selected = answers[q.index] === val;
                return (
                  <button key={val} onClick={() => handleAnswer(q.index, val)} style={{
                    padding: '10px 8px', borderRadius: 12, border: 'none',
                    background: selected ? f.selected : f.bg,
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6,
                    transition: 'background 0.2s'
                  }}>
                    {selected && <span style={{ fontSize: 12, color: 'white' }}>✓</span>}
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: selected ? 'white' : '#6B5B4A',
                      fontFamily: 'var(--font-sans)'
                    }}>
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botón siguiente */}
      <div style={{ padding: '12px 14px 32px', background: '#F9F5F0', borderTop: '1px solid #F0EBE3', flexShrink: 0 }}>
        <button onClick={nextSec} disabled={!sectionDone} style={{
          width: '100%', padding: 16, borderRadius: 16, border: 'none',
          background: sectionDone ? world.accent : '#E0D8D0',
          color: sectionDone ? 'white' : '#C8B8A8',
          fontSize: 15, fontWeight: 800,
          cursor: sectionDone ? 'pointer' : 'default',
          fontFamily: 'var(--font-sans)',
          transition: 'background 0.3s'
        }}>
          {secIdx < SECTIONS.length - 1 ? 'Siguiente sección →' : 'Ver mi resultado →'}
        </button>
      </div>
    </div>
  );
}