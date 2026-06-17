// content/weeks.ts
// EL ARCHIVO QUE MÁS VAS A EDITAR.
// Cada semana junta: su mundo/elemento, el desafío, las posturas, las respiraciones,
// los materiales, la nota para el adulto y el capítulo de la historia.
//
// Para agregar una semana nueva: copia un bloque { ... } y cambia los valores.

import type { ElementId } from './elements';
import type { PoseId } from './poses';

export type ChallengeInfo = {
  title: string;     // "7 días de raíces"
  focus: string;     // "Postura Montaña cada mañana"
  totalDays: number; // normalmente 7
};

export type Week = {
  id: number;
  element: ElementId;
  label: string;          // "Semana 1 · Tierra"
  challenge: ChallengeInfo;
  poses: PoseId[];        // posturas de la semana (ids de poses.ts)
  breathIds: string[];    // respiraciones disponibles (ids de breaths.ts)
  adultNote: string;      // nota "Para el adulto" en Antes de empezar
  classMinutes: number;   // duración aproximada de la clase
  chapterId: string;      // capítulo de story.ts
};

export const weeks: Week[] = [
  {
    id: 1,
    element: 'Tierra',
    label: 'Semana 1 · Tierra',
    challenge: {
      title: '7 días de raíces',
      focus: 'Postura Montaña cada mañana',
      totalDays: 7,
    },
    poses: ['montana', 'indio', 'globo', 'gato', 'arbol', 'bosque'],
    breathIds: ['globo', 'estrella'],
    adultNote:
      'Esta semana, Kawa aprende a enraizar. Acompaña a tu niño sin corregir — solo acompaña. Tu calma es su mapa.',
    classMinutes: 45,
    chapterId: 'cap1',
  },

  // --- Próximas semanas (plantilla lista para llenar) ---
  // {
  //   id: 2,
  //   element: 'Agua',
  //   label: 'Semana 2 · Agua',
  //   challenge: { title: '7 días de fluir', focus: '...', totalDays: 7 },
  //   poses: [...],
  //   breathIds: ['globo', 'estrella'],
  //   adultNote: '...',
  //   classMinutes: 45,
  //   chapterId: 'cap2',
  // },
];

export function getWeek(id: number) {
  return weeks.find((w) => w.id === id);
}
