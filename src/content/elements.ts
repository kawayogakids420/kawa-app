export type ElementId = 'Tierra' | 'Agua' | 'Fuego' | 'Aire' | 'Espacio';

export type ElementTheme = {
  accent: string;
  hill: string;
  hill2: string;
  sky: string;
};

export const elements: Record<ElementId, ElementTheme> = {
  Tierra: {
    accent: '#C8825D',
    hill: '#7E9A7A',
    hill2: '#9DB89A',
    sky: 'linear-gradient(180deg,#FBE3CF 0%,#F7E7D6 42%,#F3EFE4 100%)',
  },
  Agua: {
    accent: '#3E83A0',
    hill: '#6FA8B0',
    hill2: '#9AC6CB',
    sky: 'linear-gradient(180deg,#CFE6F0 0%,#DEEBEF 42%,#EFF4F3 100%)',
  },
  Fuego: {
    accent: '#D2693F',
    hill: '#C98A5A',
    hill2: '#E0AD7E',
    sky: 'linear-gradient(180deg,#FBD7C4 0%,#F8DCC8 42%,#F3ECE2 100%)',
  },
  Aire: {
    accent: '#8A6FA8',
    hill: '#A98FB0',
    hill2: '#C6B4CE',
    sky: 'linear-gradient(180deg,#EAE3F0 0%,#EFEAF0 42%,#F3F0F2 100%)',
  },
  Espacio: {
    accent: '#4B54C6',
    hill: '#7B80CE',
    hill2: '#A6A9DD',
    sky: 'linear-gradient(180deg,#D9DAF3 0%,#E4E3F1 42%,#EFEEF6 100%)',
  },
};
