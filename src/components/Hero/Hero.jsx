/* ══════════════════════════════════════
   HERO — Layered hero section without command chips
   ══════════════════════════════════════ */

import { useState, useEffect } from 'react';
import useTypingEffect from '../../hooks/useTypingEffect';
import './Hero.css';

const INTRO_HTML =
  'Welcome to my portfolio. I\'m <span class="highlight">Adesh Siddhartha</span> — a software engineer building intelligent systems and exploring the frontiers of AI.';

export default function Hero({ bootComplete }) {
  const { displayedText, cursorVisible, isComplete } = useTypingEffect(
    'SIDDHARTH',
    bootComplete,
    { speed: 120, cursorHideDelay: 2000 }
  );

  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showSeparator, setShowSeparator] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  // Sequential reveal after typing completes
  useEffect(() => {
    if (!isComplete) return;

    const t1 = setTimeout(() => setShowSubtitle(true), 600);
    const t2 = setTimeout(() => setShowSeparator(true), 900);
    const t3 = setTimeout(() => setShowIntro(true), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isComplete]);

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
      </div>
    </section>
  );
}
