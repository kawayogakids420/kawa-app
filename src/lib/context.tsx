"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { World, getWorld } from '@/lib/worlds';

type Mode = 'kid' | 'adult';
export type Tab = 'hoy' | 'practicar' | 'calma' | 'perfil' | 'recursos';
export type Overlay = 'none' | 'story' | 'breath' | 'pose' | 'challenge' | 'resource' | 'relax';
export type UserType = 'familia' | 'profesional';

export type Child = {
  id: string;
  name: string;
  age: number;
  profile: string;
};

interface KawaCtx {
  mode: Mode; setMode: (m: Mode) => void;
  tab: Tab; setTab: (t: Tab) => void;
  world: World; worldId: string; setWorldId: (id: string) => void;
  childName: string; setChildName: (name: string) => void;
  userName: string; setUserName: (name: string) => void;
  day: number; setDay: (d: number) => void;
  overlay: Overlay; setOverlay: (o: Overlay) => void;
  selectedChapterId: string; setSelectedChapterId: (id: string) => void;
  selectedPoseId: string; setSelectedPoseId: (id: string) => void;
  selectedBreathId: string; setSelectedBreathId: (id: string) => void;
  resourceTab: string; setResourceTab: (t: string) => void;
  streak: number; totalDays: number;
  userType: UserType; setUserType: (t: UserType) => void;
  children: Child[]; addChild: (c: Child) => void; removeChild: (id: string) => void;
  activeChildId: string; setActiveChildId: (id: string) => void;
}

const Ctx = createContext<KawaCtx | null>(null);

export function KawaProvider({ children: reactChildren }: { children: ReactNode }) {
  const [mode, setMode]                     = useState<Mode>('kid');
  const [tab, setTab]                       = useState<Tab>('hoy');
  const [worldId, setWorldId]               = useState('tierra');
  const [userName, setUserName]             = useState('Nico');
  const [day, setDay]                       = useState(3);
  const [overlay, setOverlay]               = useState<Overlay>('none');
  const [selectedChapterId, setSelectedChapterId] = useState('cap1');
  const [selectedPoseId, setSelectedPoseId] = useState('montana');
  const [selectedBreathId, setSelectedBreathId] = useState('globo');
  const [resourceTab, setResourceTab]       = useState('inicio');
  const [userType, setUserType]             = useState<UserType>('familia');
  const [kids, setKids]                     = useState<Child[]>([
    { id: '1', name: 'Nico', age: 4, profile: 'muy-sensible' },
  ]);
  const [activeChildId, setActiveChildId]   = useState('1');

  const world = useMemo(() => getWorld(worldId), [worldId]);

  const activeChild = kids.find(c => c.id === activeChildId) ?? kids[0];
  const childName = activeChild?.name ?? 'Nico';

  const setChildName = (name: string) => {
    setKids(prev => prev.map(c => c.id === activeChildId ? { ...c, name } : c));
    setUserName(name);
  };

  const addChild = (child: Child) => setKids(prev => [...prev, child]);
  const removeChild = (id: string) => {
    setKids(prev => prev.filter(c => c.id !== id));
    if (activeChildId === id) setActiveChildId(kids[0]?.id ?? '');
  };

  return (
    <Ctx.Provider value={{
      mode, setMode, tab, setTab,
      world, worldId, setWorldId,
      childName, setChildName,
      userName, setUserName,
      day, setDay,
      overlay, setOverlay,
      selectedChapterId, setSelectedChapterId,
      selectedPoseId, setSelectedPoseId,
      selectedBreathId, setSelectedBreathId,
      resourceTab, setResourceTab,
      streak: 3, totalDays: 7,
      userType, setUserType,
      children: kids, addChild, removeChild,
      activeChildId, setActiveChildId,
    }}>
      {reactChildren}
    </Ctx.Provider>
  );
}

export const useKawa = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useKawa must be used inside KawaProvider');
  return c;
};