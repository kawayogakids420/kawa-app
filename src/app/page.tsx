"use client";
import { KawaProvider, useKawa } from '@/lib/context';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import HoyScreen from '@/components/HoyScreen';
import PracticarScreen from '@/components/PracticarScreen';
import CalmaScreen from '@/components/CalmaScreen';
import PerfilScreen from '@/components/PerfilScreen';
import RecursosScreen from '@/components/RecursosScreen';
import ChallengeOverlay from '@/components/ChallengeOverlay';
import StoryPlayer from '@/components/StoryPlayer';
import BreathPlayer from '@/components/BreathPlayer';
import RelaxPlayer from '@/components/RelaxPlayer';

function AppShell() {
  const { tab, world, overlay } = useKawa();

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8DDD4' }}>
      <div style={{
        position: 'relative', width: '100%', maxWidth: 402,
        minHeight: '100dvh', background: world.bg,
        boxShadow: '0 0 60px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column'
      }}>
        <TopBar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {tab === 'hoy'       && <HoyScreen />}
          {tab === 'practicar' && <PracticarScreen />}
          {tab === 'calma'     && <CalmaScreen />}
          {tab === 'perfil'    && <PerfilScreen />}
          {tab === 'recursos'  && <RecursosScreen />}
        </main>
        <BottomNav />
        {overlay === 'challenge' && <ChallengeOverlay />}
        {overlay === 'story'     && <StoryPlayer />}
        {overlay === 'breath'    && <BreathPlayer />}
        {overlay === 'relax'     && <RelaxPlayer />}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <KawaProvider>
      <AppShell />
    </KawaProvider>
  );
}