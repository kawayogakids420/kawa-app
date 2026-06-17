// Kawa worlds - each "mundo" has its own color theme
// The app background and accent colors shift based on the active world

export type World = {
  id: string;
  name: string;
  subtitle: string;
  bg: string;
  heroBg: string;
  accent: string;
  cardBg: string;
  tabActive: string;
  tagColor: string;
};

export const WORLDS: World[] = [
  {
    id: 'tierra',
    name: 'Tierra',
    subtitle: 'Semana 1',
    bg: '#F5EDE3',
    heroBg: '#C8B89A',
    accent: '#C97B4B',
    cardBg: '#FDFAF6',
    tabActive: '#C97B4B',
    tagColor: '#8B6344',
  },
  {
    id: 'agua',
    name: 'Agua',
    subtitle: 'Semana 2',
    bg: '#DDE9F0',
    heroBg: '#A8CBDB',
    accent: '#4A8FA8',
    cardBg: '#F4F9FB',
    tabActive: '#4A8FA8',
    tagColor: '#2E6A82',
  },
  {
    id: 'fuego',
    name: 'Fuego',
    subtitle: 'Semana 3',
    bg: '#F5E8DC',
    heroBg: '#E8B49A',
    accent: '#D4604A',
    cardBg: '#FDF7F4',
    tabActive: '#D4604A',
    tagColor: '#A84432',
  },
  {
    id: 'aire',
    name: 'Aire',
    subtitle: 'Semana 4',
    bg: '#EBF0E8',
    heroBg: '#B8CCB0',
    accent: '#5A8A4A',
    cardBg: '#F6FAF4',
    tabActive: '#5A8A4A',
    tagColor: '#3D6B2E',
  },
  {
    id: 'espacio',
    name: 'Espacio',
    subtitle: 'Semana 5',
    bg: '#EEF1FA',
    heroBg: '#A6A9DD',
    accent: '#4B54C6',
    cardBg: '#F4F5FB',
    tabActive: '#4B54C6',
    tagColor: '#505A8D',
  },
];

export const getWorld = (id: string): World =>
  WORLDS.find((w) => w.id === id) ?? WORLDS[0];
