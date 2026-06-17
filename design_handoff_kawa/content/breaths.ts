// content/breaths.ts
// Respiraciones guiadas. "locked" se usa para las que se desbloquean en semanas futuras.

export type Breath = {
  id: string;
  name: string;
  subtitle: string;
  pattern: string;     // "Inhala 4 · Exhala 4"
  accent: string;
  locked?: boolean;
  unlockWeek?: number; // si está bloqueada, en qué semana se abre
};

export const breaths: Breath[] = [
  { id: 'globo',   name: 'Respiración Globo',   subtitle: '4 tiempos · 4 tiempos · Calma el cuerpo', pattern: 'Inhala 4 · Exhala 4', accent: '#7E9DB5' },
  { id: 'estrella', name: 'Respiración Estrella', subtitle: 'Se desbloquea en Semana 2',             pattern: 'Inhala 5 · Exhala 5', accent: '#CFC6B6', locked: true, unlockWeek: 2 },
];
