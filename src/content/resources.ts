export type Material = { name: string; sub: string };
export type Protocol = { name: string; sub: string };

export const materials: Material[] = [
  { name: 'Piedra suave y fría', sub: 'Objeto antiestrés' },
  { name: 'Colchoneta o manta', sub: 'Para la postura' },
  { name: 'Música suave de bosque', sub: 'Opcional · ambiental' },
  { name: 'Cojín suave', sub: 'Apoyo · opcional' },
];

export const downloads: string[] = [
  'Guía de posturas · S1',
  'Tarjetas para imprimir',
  'Rutinas en casa · S1',
  'Ficha de perfil sensorial',
];

export const protocols: Protocol[] = [
  { name: 'Integración Sensorial', sub: 'Marco basado en Ayres' },
  { name: 'Co-regulación primero', sub: 'Acompañar antes de corregir' },
  { name: 'Aprendizaje gradual', sub: 'Demostrar · repetir · celebrar' },
];
