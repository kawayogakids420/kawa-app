export type ProfileId = 'muy-sensible' | 'buscador' | 'bajo-registro' | 'planif-motora';

export type SensoryProfile = {
  id: ProfileId;
  name: string;
  accent: string;
  tint: string;
  image: string;
  desc: string;
  tip: string;
};

export const profiles: Record<ProfileId, SensoryProfile> = {
  'muy-sensible': {
    id: 'muy-sensible',
    name: 'Muy Sensible',
    accent: '#C07BA0',
    tint: '#F7E9F1',
    image: '/profiles/muy-sensible.png',
    desc: 'Percibe el mundo con gran intensidad. Necesita previsibilidad y suavidad.',
    tip: 'Avisa 5 min antes. Ropa sin etiquetas. Baja el volumen. Si rechaza una postura, ofrece otra sin insistir.',
  },
  buscador: {
    id: 'buscador',
    name: 'Buscador/a',
    accent: '#CE9226',
    tint: '#FBF1D6',
    image: '/profiles/buscador.png',
    desc: 'Busca estímulos. Necesita movimiento con propósito y resistencia.',
    tip: 'Jalea 4 minutos antes. Guerrero y Perro primero para descargar. Desafía con ojos cerrados en Árbol.',
  },
  'bajo-registro': {
    id: 'bajo-registro',
    name: 'Bajo Registro',
    accent: '#5F97BA',
    tint: '#E6F0F6',
    image: '/profiles/bajo-registro.png',
    desc: 'Necesita estímulos intensos para registrar su propio cuerpo.',
    tip: 'Presión activa en cada postura. Música más movida al inicio. Practica en piso irregular o hierba.',
  },
  'planif-motora': {
    id: 'planif-motora',
    name: 'Planif. Motora',
    accent: '#7E9A7A',
    tint: '#EAF0E7',
    image: '/profiles/planif-motora.png',
    desc: 'Aprende los movimientos por mapas. Necesita repetición y orden.',
    tip: 'Demuestra primero. Gato I y Gato II por separado. 5 repeticiones mínimo. Celebra cada intento.',
  },
};

export const profileOrder: ProfileId[] = ['muy-sensible', 'buscador', 'bajo-registro', 'planif-motora'];
