// content/poses.ts
// Las posturas de yoga. La imagen es un placeholder: reemplaza la ruta
// cuando tengas las ilustraciones reales en /public/poses/.

export type PoseId = 'montana' | 'indio' | 'globo' | 'gato' | 'arbol' | 'bosque';

export type Pose = {
  id: PoseId;
  name: string;
  tag: string;        // etiqueta corta: "Raíces", "Calma", "Respira", "Energía"
  accent: string;     // color de la tarjeta
  tint: string;       // fondo suave de la tarjeta
  image: string;      // ruta a /public (por diseñar)
  description: string;
};

export const poses: Record<PoseId, Pose> = {
  montana: { id: 'montana', name: 'Montaña', tag: 'Raíces',  accent: '#7E9A7A', tint: '#EBF0E8', image: '/poses/montana.png', description: 'De pie, firme como una montaña. Siente cómo tus pies echan raíces en la tierra.' },
  indio:   { id: 'indio',   name: 'Indio',   tag: 'Calma',   accent: '#C99178', tint: '#F6EAE3', image: '/poses/indio.png',   description: 'Sentado con las piernas cruzadas y la espalda larga. Un momento para volver al centro.' },
  globo:   { id: 'globo',   name: 'Globo',   tag: 'Respira', accent: '#7E9DB5', tint: '#E9F0F4', image: '/poses/globo.png',   description: 'Manos en la pancita. Ínflala como un globo al inhalar y desínflala al soltar el aire.' },
  gato:    { id: 'gato',    name: 'Gato',    tag: 'Energía', accent: '#D9A23F', tint: '#FAF0D6', image: '/poses/gato.png',    description: 'En cuatro patas: redondea y arquea la espalda, despacio, como un gato perezoso.' },
  arbol:   { id: 'arbol',   name: 'Árbol',   tag: 'Raíces',  accent: '#7E9A7A', tint: '#EBF0E8', image: '/poses/arbol.png',   description: 'De pie en un solo pie, brazos como ramas. Busca tu equilibrio sin prisa.' },
  bosque:  { id: 'bosque',  name: 'Bosque',  tag: 'Calma',   accent: '#9A86A8', tint: '#F0EAF2', image: '/poses/bosque.png',  description: 'Acostado, ojos suaves. Escucha el bosque y deja que el cuerpo descanse.' },
};

// Orden por defecto para mostrar en grilla
export const poseOrder: PoseId[] = ['montana', 'indio', 'globo', 'gato', 'arbol', 'bosque'];
