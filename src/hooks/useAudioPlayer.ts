import { useEffect, useRef, useState } from 'react';

export function useAudioPlayer(src: string, id?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;

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
