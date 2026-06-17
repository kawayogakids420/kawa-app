// hooks/useAudioPlayer.ts
// Hook reutilizable para reproducir audio (historia completa o una parte).
// Uso en un componente:
//
//   const player = useAudioPlayer(part.audioSrc, part.id);
//   <button onClick={player.toggle}>{player.playing ? 'Pausa' : 'Play'}</button>
//   <ProgressBar value={player.currentTime / player.duration} />
//
// Guarda y retoma la posición por "id" usando localStorage.

import { useEffect, useRef, useState } from 'react';

export function useAudioPlayer(src: string, id?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Crear el elemento de audio una sola vez por "src"
  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;

    // Retomar posición guardada
    const saved = id ? Number(localStorage.getItem('kawa-audio-' + id)) : 0;
    if (saved && !Number.isNaN(saved)) audio.currentTime = saved;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (id) localStorage.setItem('kawa-audio-' + id, String(audio.currentTime));
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, [src, id]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = seconds;
  };

  return { playing, currentTime, duration, toggle, seek, hasAudio: Boolean(src) };
}
