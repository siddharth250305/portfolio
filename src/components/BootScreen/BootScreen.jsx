import { useState, useEffect, useRef, useCallback } from 'react';
import './BootScreen.css';

export default function BootScreen({ onBootComplete, playBootSound }) {
  const [phase, setPhase] = useState('button'); // button | booting | fading | done
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const timeoutsRef = useRef([]);

  const bootLines = [
    { prefix: '[core]', text: ' kernel v4.2.0 loaded ............. ', ok: '[OK]' },
    { prefix: '[net] ', text: ' network interface initialized ..... ', ok: '[OK]' },
    { prefix: '[auth]', text: ' user profile loaded ............... ', ok: '[OK]' },
    { prefix: '[gpu] ', text: ' rendering engine started .......... ', ok: '[OK]' },
    { prefix: '[sys] ', text: ' all services operational .......... ', ok: '[OK]' },
  ];

  useEffect(() => () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
  }, []);

  const startBoot = useCallback(() => {
    playBootSound();
    setPhase('booting');

    // Show boot lines sequentially
    bootLines.forEach((_, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), 300 + i * 350);
      timeoutsRef.current.push(t);
    });

    // Start progress bar after lines
    const progressStart = 300 + bootLines.length * 350 + 200;
    let prog = 0;
    const interval = setInterval(() => {
      prog += 3 + Math.random() * 3;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        // Start fade out
        setTimeout(() => {
          setPhase('fading');
          setTimeout(() => {
            setPhase('done');
            onBootComplete();
          }, 700);
        }, 300);
      }
      setProgress(Math.min(100, Math.round(prog)));
    }, 40);

    const t = setTimeout(() => {}, progressStart);
    timeoutsRef.current.push(t);

    return () => clearInterval(interval);
  }, [playBootSound, onBootComplete, bootLines.length]);

  if (phase === 'done') return null;

  return (
    <div className={`boot-screen ${phase === 'fading' ? 'boot-fade-out' : ''}`}>
      {phase === 'button' && (
        <button className="boot-init-btn" onClick={startBoot}>
          INITIALIZE SYSTEM
        </button>
      )}

      {(phase === 'booting' || phase === 'fading') && (
        <div className="boot-content">
          <div className="boot-logo">SIDDHARTH</div>
          <div className="boot-lines">
            {bootLines.map((line, i) => (
              <div key={i} className={`boot-line ${i < visibleLines ? 'visible' : ''}`}>
                <span className="boot-prefix">{line.prefix}</span>
                {line.text}
                <span className="boot-ok">{line.ok}</span>
              </div>
            ))}
          </div>
          <div className="boot-progress-container">
            <div className="boot-progress">
              <div className="boot-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
