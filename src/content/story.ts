export type StoryPart = {
  id: string;
  title: string;
  duration: number;
  audioSrc: string;
  suggestedPose?: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  element: string;
  fullAudioSrc: string;
  parts: StoryPart[];
};

export const chapters: Chapter[] = [
  {
    id: 'cap1',
    number: 1,
    title: 'Capítulo 1',
    subtitle: 'La semilla que encontró sus raíces',
    element: 'Tierra',
    fullAudioSrc: '/audio/cap1-completo.mp3',
    parts: [
      { id: 'cap1-p1', title: 'La semilla dormida', duration: 150, audioSrc: '/audio/cap1-parte1.mp3', suggestedPose: 'indio' },
      { id: 'cap1-p2', title: 'El viento la despierta', duration: 160, audioSrc: '/audio/cap1-parte2.mp3', suggestedPose: 'globo' },
      { id: 'cap1-p3', title: 'Echando raíces', duration: 170, audioSrc: '/audio/cap1-parte3.mp3', suggestedPose: 'montana' },
    ],
  },
];

export function getChapter(id: string) {
  return chapters.find((c) => c.id === id);
}
