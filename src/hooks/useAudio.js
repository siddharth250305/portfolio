import { useCallback, useRef, useEffect } from 'react';

export default function useAudio() {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      console.log('[Audio] Creating new AudioContext...');
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  // Unlock function that can be called on user gestures
  const resumeContext = useCallback(async () => {
    try {
      const ctx = getCtx();
      if (ctx.state === 'suspended') {
        console.log(`[Audio] AudioContext is suspended. Current state: ${ctx.state}. Resuming...`);
        await ctx.resume();
        console.log(`[Audio] AudioContext resumed successfully. New state: ${ctx.state}`);
      }
      return ctx;
    } catch (err) {
      console.error('[Audio] Error resuming AudioContext:', err);
      return getCtx();
    }
  }, [getCtx]);

  // Unlock AudioContext on first global interaction just in case
  useEffect(() => {
    const unlock = () => {
      resumeContext();
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('click', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [resumeContext]);

  const playBootSound = useCallback(async () => {
    console.log('[Audio] playBootSound triggered');
    try {
      const ctx = await resumeContext();
      const now = ctx.currentTime;
      console.log(`[Audio] playBootSound playing. ctx.state: ${ctx.state}, currentTime: ${now}`);

      // Sub-bass power-up hum
      const hum = ctx.createOscillator();
      const humGain = ctx.createGain();
      hum.type = 'triangle';
      hum.frequency.setValueAtTime(60, now);
      hum.frequency.linearRampToValueAtTime(180, now + 0.6);
      humGain.gain.setValueAtTime(0, now);
      humGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      humGain.gain.linearRampToValueAtTime(0, now + 0.7);
      hum.connect(humGain).connect(ctx.destination);
      hum.start(now);
      hum.stop(now + 0.8);

      // Cyber pings - ascending arpeggio
      const notes = [1046.5, 1318.5, 1568, 2093]; // C6, E6, G6, C7
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + 0.1 + i * 0.06;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.05, t + 0.15);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
        gain.gain.linearRampToValueAtTime(0, t + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (e) {
      console.error('[Audio] playBootSound failed:', e);
    }
  }, [resumeContext]);

  const playPowerOffSound = useCallback(async () => {
    console.log('[Audio] playPowerOffSound triggered');
    try {
      const ctx = await resumeContext();
      const now = ctx.currentTime;
      console.log(`[Audio] playPowerOffSound playing. ctx.state: ${ctx.state}, currentTime: ${now}`);

      // Decaying sub-bass hum
      const hum = ctx.createOscillator();
      const humGain = ctx.createGain();
      hum.type = 'triangle';
      hum.frequency.setValueAtTime(150, now);
      hum.frequency.linearRampToValueAtTime(40, now + 0.6);
      humGain.gain.setValueAtTime(0.15, now);
      humGain.gain.linearRampToValueAtTime(0, now + 0.7);
      hum.connect(humGain).connect(ctx.destination);
      hum.start(now);
      hum.stop(now + 0.8);

      // Descending arpeggio
      const notes = [2093, 1568, 1318.5, 1046.5]; // C7, G6, E6, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + 0.05 + i * 0.06;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, t + 0.15);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
        gain.gain.linearRampToValueAtTime(0, t + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (e) {
      console.error('[Audio] playPowerOffSound failed:', e);
    }
  }, [resumeContext]);

  return { playBootSound, playPowerOffSound };
}
