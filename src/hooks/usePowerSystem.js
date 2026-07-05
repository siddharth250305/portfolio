import { useState, useCallback, useRef, useEffect } from 'react';

export default function usePowerSystem() {
  const [powerState, setPowerState] = useState('idle'); // idle | shutting-down | off | starting-up
  const [shutdownMessages, setShutdownMessages] = useState([]);
  const [resumeMessages, setResumeMessages] = useState([]);
  const [haltedText, setHaltedText] = useState('');
  const [startupProgress, setStartupProgress] = useState(0);
  const timeoutsRef = useRef([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  const delay = (ms) => new Promise(resolve => {
    const t = setTimeout(resolve, ms);
    timeoutsRef.current.push(t);
  });

  const powerOff = useCallback(async () => {
    setPowerState('shutting-down');
    setShutdownMessages([]);
    setHaltedText('');

    const steps = [
      { text: 'Stopping terminal services...', wait: 400 },
      { text: 'Saving command history...', wait: 300 },
      { text: 'Disconnecting...', wait: 500 },
      { text: 'Powering off...', wait: 400 },
    ];

    for (const step of steps) {
      await delay(step.wait);
      setShutdownMessages(prev => [...prev, step.text]);
    }

    // Type "System halted." character by character
    const haltMsg = 'System halted.';
    for (let i = 0; i <= haltMsg.length; i++) {
      await delay(50);
      setHaltedText(haltMsg.slice(0, i));
    }

    await delay(300);
    setPowerState('off');
  }, []);

  const powerOn = useCallback(async () => {
    setPowerState('starting-up');
    setResumeMessages([]);
    setStartupProgress(0);

    const steps = [
      { text: 'BIOS v1.0 — Sidd Terminal Systems', wait: 300 },
      { text: 'Memory check... 16384 KB OK', wait: 200 },
      { text: 'Starting terminal service...', wait: 400 },
      { text: 'Loading user profile...', wait: 300 },
      { text: 'Terminal ready.', wait: 200 },
    ];

    for (const step of steps) {
      await delay(step.wait);
      setResumeMessages(prev => [...prev, step.text]);
    }

    // Animate progress bar
    let progress = 0;
    while (progress < 100) {
      await delay(40);
      const inc = 3 + Math.random() * 3;
      progress = Math.min(100, progress + inc);
      setStartupProgress(Math.round(progress));
    }

    await delay(400);
    setPowerState('idle');
    setShutdownMessages([]);
    setResumeMessages([]);
    setHaltedText('');
    setStartupProgress(0);
  }, []);

  return {
    isPoweredOff: powerState === 'off' || powerState === 'shutting-down',
    powerState,
    shutdownMessages,
    resumeMessages,
    haltedText,
    startupProgress,
    powerOff,
    powerOn,
  };
}
