import type { ElementId } from './elements';
import type { PoseId } from './poses';

export type ChallengeInfo = {
  title: string;
  focus: string;
  totalDays: number;
};

export type Week = {
  id: number;
  element: ElementId;
  label: string;
  challenge: ChallengeInfo;
  poses: PoseId[];
  breathIds: string[];
  adultNote: string;
  classMinutes: number;
  chapterId: string;
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
];

export function getWeek(id: number) {
  return weeks.find((w) => w.id === id);
}
