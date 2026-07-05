import { useState, useRef, useCallback, useEffect } from 'react';
import { COMMANDS, buildAliasMap, HANDLERS } from '../data/commands';

const aliasMap = buildAliasMap();

export default function useTerminal({ onToggleTheme, theme, onToggleScanlines }) {
  const [output, setOutput] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [ghostText, setGhostText] = useState('');
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [output, scrollToBottom]);

  const addOutput = useCallback((type, content) => {
    setOutput(prev => [...prev, { type, content, id: Date.now() + Math.random() }]);
  }, []);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  }, []);

  // Ghost autocomplete: compute when input changes
  useEffect(() => {
    const partial = inputValue.trim().toLowerCase();
    if (!partial) {
      setGhostText('');
      return;
    }

    // Collect all command names (visible + hidden)
    const allNames = Object.keys(COMMANDS);
    const matches = allNames.filter(n => n.startsWith(partial) && n !== partial);

    if (matches.length === 1) {
      setGhostText(matches[0].slice(partial.length));
    } else {
      setGhostText('');
    }
  }, [inputValue]);

  const processCommand = useCallback((rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Echo the command
    addOutput('cmd-line', `<span class="prompt-echo">visitor@siddharth:~$</span> ${trimmed}`);

    // Add to history (deduplicate consecutive)
    if (historyRef.current[0] !== trimmed) {
      historyRef.current.unshift(trimmed);
      if (historyRef.current.length > 50) historyRef.current.pop();
    }
    historyIndexRef.current = -1;

    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Resolve alias
    const resolved = aliasMap[cmdName] || cmdName;

    // Check if command exists
    const handler = HANDLERS[resolved];
    if (!handler) {
      triggerShake();
      addOutput('cmd-output',
        `<span class="error">${cmdName}: command not found. type 'help'.</span>`
      );
      return;
    }

    // Execute handler
    let result;
    if (resolved === 'history') {
      result = handler(historyRef.current);
    } else if (resolved === 'echo') {
      result = handler(args);
    } else if (resolved === 'sudo') {
      result = handler(args);
    } else {
      result = handler();
    }

    // Handle special return values
    if (result === 'CLEAR_TERMINAL') {
      clearOutput();
      return;
    }
    if (result === 'TOGGLE_THEME') {
      if (onToggleTheme) onToggleTheme();
      addOutput('cmd-output',
        `<span class="success">Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode.</span>`
      );
      return;
    }
    if (result === 'TOGGLE_SCANLINES') {
      if (onToggleScanlines) onToggleScanlines();
      addOutput('cmd-output',
        `<span class="success">CRT scanline effect toggled.</span>`
      );
      return;
    }

    if (result === 'OPEN_RESUME') {
      addOutput('cmd-output',
        `<span class="section-header">┌─ Resume ─┐</span>\n\n  📄 <a href="/AI_resume.pdf" target="_blank" rel="noopener" class="link">View / Download Resume (PDF)</a>\n\n  <span class="muted">Opening resume...</span>`
      );
      window.open('/AI_resume.pdf', '_blank');
      return;
    }

    addOutput('cmd-output', result);
  }, [addOutput, clearOutput, onToggleTheme, onToggleScanlines, theme, triggerShake]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand(inputValue);
      setInputValue('');
      setGhostText('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const history = historyRef.current;
      if (!history.length) return;
      const next = Math.min(historyIndexRef.current + 1, history.length - 1);
      historyIndexRef.current = next;
      setInputValue(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIndexRef.current - 1;
      if (next < 0) {
        historyIndexRef.current = -1;
        setInputValue('');
      } else {
        historyIndexRef.current = next;
        setInputValue(historyRef.current[next]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion
      const partial = inputValue.trim().toLowerCase();
      if (!partial) return;

      // Include all command names (visible + hidden)
      const allNames = Object.keys(COMMANDS);
      // Also include aliases
      for (const [, info] of Object.entries(COMMANDS)) {
        if (info.aliases) allNames.push(...info.aliases);
      }

      const matches = [...new Set(allNames)].filter(n => n.startsWith(partial));
      if (matches.length === 1) {
        setInputValue(matches[0]);
        setGhostText('');
      } else if (matches.length > 1) {
        addOutput('cmd-output', `<span class="muted">Matches: ${matches.join('  ')}</span>`);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearOutput();
    }
  }, [inputValue, processCommand, addOutput, clearOutput]);

  const focusInput = useCallback(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return {
    output,
    inputValue,
    setInputValue,
    handleKeyDown,
    isShaking,
    outputRef,
    inputRef,
    focusInput,
    clearOutput,
    processCommand,
    addOutput,
    ghostText,
  };
}
