/* ══════════════════════════════════════
   HERO — Layered hero section with command chips (PRD §5)
   ══════════════════════════════════════ */

import { useState, useEffect } from 'react';
import Beams from '../Beams/Beams';
import useTypingEffect from '../../hooks/useTypingEffect';
import './Hero.css';

const INTRO_HTML =
  'Welcome to my portfolio. I\'m <span class="highlight">Adesh Siddhartha</span> — a software engineer building intelligent systems and exploring the frontiers of AI.';

const CHIP_COMMANDS = ['about', 'projects', 'skills', 'contact', 'resume'];

export default function Hero({ bootComplete, onRunCommand }) {
  const { displayedText, cursorVisible, isComplete } = useTypingEffect(
    'SIDDHARTH',
    bootComplete,
    { speed: 120, cursorHideDelay: 2000 }
  );

  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showSeparator, setShowSeparator] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showChips, setShowChips] = useState(false);

  // Sequential reveal after typing completes
  useEffect(() => {
    if (!isComplete) return;

    const t1 = setTimeout(() => setShowSubtitle(true), 600);
    const t2 = setTimeout(() => setShowSeparator(true), 900);
    const t3 = setTimeout(() => setShowIntro(true), 1400);
    const t4 = setTimeout(() => setShowChips(true), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isComplete]);

  const handleChipClick = (cmd) => {
    if (onRunCommand) {
      onRunCommand(cmd);
    }
  };

  return (
    <section className="hero" aria-label="Hero introduction">

      {/* LAYER 4: Content */}
      <div className="hero-content">
        <h2 className="hero-name">
          {displayedText}
          <span
            className={`hero-cursor${!cursorVisible ? ' hero-cursor--hidden' : ''}`}
            aria-hidden="true"
          />
        </h2>

        <p className={`hero-subtitle${showSubtitle ? ' visible' : ''}`}>
          MSc Software Engineering Student · AI Enthusiast · Sweden
        </p>

        <div
          className={`hero-separator${showSeparator ? ' visible' : ''}`}
          aria-hidden="true"
        />

        <p
          className={`hero-intro${showIntro ? ' visible' : ''}`}
          dangerouslySetInnerHTML={{ __html: INTRO_HTML }}
        />

        {/* Command chips section */}
        <div className={`hero-chips-section${showChips ? ' visible' : ''}`}>
          <p className="hero-nudge"># not sure where to start? tap a command ↓</p>
          <div className="hero-chips" role="group" aria-label="Quick commands">
            {CHIP_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                className={`hero-chip${cmd === 'resume' ? ' hero-chip--primary' : ''}`}
                onClick={() => handleChipClick(cmd)}
                aria-label={`Run ${cmd} command`}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
