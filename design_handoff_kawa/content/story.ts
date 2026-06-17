// content/story.ts
// La historia de Kawa, por capítulos. AQUÍ van los audios.
//
// Cada capítulo tiene:
//   - fullAudioSrc: el audio de la HISTORIA COMPLETA del capítulo.
//   - parts[]: cada PARTE con su propio audio (para escuchar por separado).
//
// Coloca los .mp3 en /public/audio/ y pon aquí la ruta (empezando con "/audio/...").
// Mientras no tengas el audio real, deja "" y el reproductor lo mostrará deshabilitado.

export type StoryPart = {
  id: string;
  title: string;
  duration: number;    // en segundos (aprox; el player real lo lee del audio)
  audioSrc: string;    // "/audio/cap1-parte1.mp3"  o ""  si aún no hay
  suggestedPose?: string; // PoseId sugerido para esta parte (ej. "montana")
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  element: string;        // ElementId al que pertenece (ej. "Tierra")
  fullAudioSrc: string;   // audio del capítulo completo
  parts: StoryPart[];
};

export const chapters: Chapter[] = [
  {
    id: 'cap1',
    number: 1,
    title: 'Capítulo 1',
    subtitle: 'La semilla que encontró sus raíces',
    element: 'Tierra',
    fullAudioSrc: '/audio/cap1-completo.mp3', // <-- reemplaza por tu mp3
    parts: [
      { id: 'cap1-p1', title: 'La semilla dormida',     duration: 150, audioSrc: '/audio/cap1-parte1.mp3', suggestedPose: 'indio' },
      { id: 'cap1-p2', title: 'El viento la despierta',  duration: 160, audioSrc: '/audio/cap1-parte2.mp3', suggestedPose: 'globo' },
      { id: 'cap1-p3', title: 'Echando raíces',          duration: 170, audioSrc: '/audio/cap1-parte3.mp3', suggestedPose: 'montana' },
    ],
  },
  // Agrega aquí cap2, cap3... a medida que tengas el contenido y los audios.
];

export function getChapter(id: string) {
  return chapters.find((c) => c.id === id);
}
