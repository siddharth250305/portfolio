/* ══════════════════════════════════════
   useTypingEffect — Character-by-character typing animation
   ══════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Types out `text` one character at a time.
 * @param {string} text - The text to type out
 * @param {boolean} enabled - Whether to start typing
 * @param {object} options
 * @param {number} options.speed - ms between characters (default 120)
 * @param {number} options.cursorHideDelay - ms after completion to hide cursor (default 2000)
 * @returns {{ displayedText: string, cursorVisible: boolean, isComplete: boolean }}
 */
export default function useTypingEffect(text, enabled, options = {}) {
  const { speed = 120, cursorHideDelay = 2000 } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled || !text) return;

    indexRef.current = 0;
    setDisplayedText('');
    setCursorVisible(true);
    setIsComplete(false);

    const typeInterval = setInterval(() => {
      indexRef.current += 1;
      const nextIndex = indexRef.current;

      if (nextIndex <= text.length) {
        setDisplayedText(text.slice(0, nextIndex));
      }

      if (nextIndex >= text.length) {
        clearInterval(typeInterval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, enabled, speed]);

  // Hide cursor after delay once typing completes
  useEffect(() => {
    if (!isComplete) return;

    const timer = setTimeout(() => {
      setCursorVisible(false);
    }, cursorHideDelay);

    return () => clearTimeout(timer);
  }, [isComplete, cursorHideDelay]);

  return { displayedText, cursorVisible, isComplete };
}
