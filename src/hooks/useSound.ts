import { useCallback, useRef } from 'react';

// Windows-inspired sound frequencies
const STARTUP_NOTES = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
const CLICK_FREQ = 800;
const OPEN_FREQ = 600;

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number = 0.1, type: OscillatorType = 'sine') => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [getAudioContext]);

  const playStartupSound = useCallback(() => {
    STARTUP_NOTES.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.4, 0.08, 'sine');
      }, i * 200);
    });
  }, [playTone]);

  const playClickSound = useCallback(() => {
    playTone(CLICK_FREQ, 0.05, 0.03, 'square');
  }, [playTone]);

  const playOpenSound = useCallback(() => {
    playTone(OPEN_FREQ, 0.1, 0.05, 'sine');
    setTimeout(() => playTone(OPEN_FREQ * 1.2, 0.1, 0.04, 'sine'), 50);
  }, [playTone]);

  const playCloseSound = useCallback(() => {
    playTone(500, 0.08, 0.04, 'sine');
  }, [playTone]);

  return {
    playStartupSound,
    playClickSound,
    playOpenSound,
    playCloseSound,
  };
}
