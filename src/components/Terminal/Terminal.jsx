import { useEffect, useState, useRef, useCallback } from 'react';
import useTerminal from '../../hooks/useTerminal';

import './Terminal.css';

const GREETING = "> Welcome. Type 'help' to explore, or tap a command above.";

export default function Terminal({ onToggleTheme, theme, isPoweredOff, bootComplete, onToggleScanlines }) {
  const {
    output,
    inputValue,
    setInputValue,
    handleKeyDown,
    isShaking,
    outputRef,
    inputRef,
    focusInput,
    processCommand,
    addOutput,
    ghostText,
  } = useTerminal({ onToggleTheme, theme, onToggleScanlines });

  const [greetingDone, setGreetingDone] = useState(false);
  const [greetingText, setGreetingText] = useState('');
  const greetingStarted = useRef(false);
  const processCommandRef = useRef(processCommand);
  processCommandRef.current = processCommand;

  // Expose processCommand for external callers (chips)
  const externalProcessCommand = useCallback((cmd) => {
    processCommandRef.current(cmd);
    focusInput();
  }, [focusInput]);

  // Store externalProcessCommand on the component instance via window for App to wire
  useEffect(() => {
    window.__terminalRunCommand = externalProcessCommand;
    return () => { delete window.__terminalRunCommand; };
  }, [externalProcessCommand]);

  // Check reduced motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Auto-greeting on boot (no auto-neofetch — keep terminal compact)
  useEffect(() => {
    if (!bootComplete || isPoweredOff || greetingStarted.current) return;
    greetingStarted.current = true;

    if (prefersReducedMotion.current) {
      // Instant display
      setGreetingText(GREETING);
      setGreetingDone(true);
      return;
    }

    // Typewriter effect for greeting
    let i = 0;
    const speed = 50; // ms per char
    const timer = setInterval(() => {
      i++;
      setGreetingText(GREETING.slice(0, i));
      if (i >= GREETING.length) {
        clearInterval(timer);
        setGreetingDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [bootComplete, isPoweredOff, addOutput]);

  // Auto-focus input when terminal becomes available
  useEffect(() => {
    if (bootComplete && !isPoweredOff) {
      focusInput();
    }
  }, [bootComplete, isPoweredOff, focusInput]);

  // Click anywhere to focus input
  const handleClick = (e) => {
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      focusInput();
    }
  };

  return (
    <div className="terminal-section">
      <div
        className={`terminal-body${isShaking ? ' terminal-shake' : ''}`}
        onClick={handleClick}
      >
        {/* Titlebar */}
        <div className="terminal-titlebar">
          <span className="terminal-bracket-left">┌──</span>
          <div className="terminal-dots">
            <span className="terminal-dot terminal-dot--red" />
            <span className="terminal-dot terminal-dot--yellow" />
            <span className="terminal-dot terminal-dot--green" />
          </div>
          <span className="terminal-title">
            VISITOR@SIDDHARTH — TERMINAL
          </span>
          <span className="terminal-bracket-right">──┐</span>
        </div>

        {/* Output area */}
        <div className="command-terminal" ref={outputRef} aria-live="polite">
          {/* Auto-typed greeting */}
          {greetingText && (
            <div className="terminal-greeting">
              <span className="greeting-text">{greetingText}</span>
              {!greetingDone && <span className="greeting-cursor" aria-hidden="true">▊</span>}
            </div>
          )}

          {output.map((item) => (
            <div
              key={item.id}
              className={item.type}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ))}
        </div>

        {/* Input line */}
        {bootComplete && !isPoweredOff && (
          <div className="input-line" id="input-line">
            <span className="prompt-user">visitor</span>
            <span className="prompt-at">@</span>
            <span className="prompt-host">siddharth</span>
            <span className="prompt-path">:~</span>
            <span className="prompt-symbol">$ </span>
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="terminal-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal input"
              />
              {ghostText && (
                <span className="ghost-autocomplete">
                  {ghostText}
                  <span className="ghost-tab-hint">↹ Tab</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Hints below input */}
        {bootComplete && !isPoweredOff && (
          <div className="terminal-hints">
            <p className="terminal-shortcuts">
              <span className="hint-key">↹</span> Tab complete ·{' '}
              <span className="hint-key">↑↓</span> history ·{' '}
              <span className="hint-key">⌘K</span> command palette ·{' '}
              '<span className="hint-key">clear</span>' reset
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
