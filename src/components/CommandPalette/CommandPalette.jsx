/* ══════════════════════════════════════
   COMMAND PALETTE — ⌘K / Ctrl+K overlay (PRD FR-7)
   ══════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from 'react';
import { COMMANDS, DESC_MAP } from '../../data/commands';
import './CommandPalette.css';

export default function CommandPalette({ isOpen, onClose, onRunCommand }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Build filtered list
  const allCommands = Object.entries(COMMANDS)
    .filter(([, info]) => info.desc) // only commands with descriptions
    .map(([name, info]) => ({
      name,
      desc: info.desc,
      hidden: !info.visible,
    }));

  const filtered = query.trim()
    ? allCommands.filter(cmd => {
        const q = query.toLowerCase();
        return cmd.name.includes(q) || cmd.desc.toLowerCase().includes(q);
      })
    : allCommands;

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const item = listRef.current.children[selectedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onRunCommand(filtered[selectedIndex].name);
        onClose();
      }
    }
  }, [filtered, selectedIndex, onClose, onRunCommand]);

  const handleItemClick = useCallback((cmd) => {
    onRunCommand(cmd);
    onClose();
  }, [onRunCommand, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="palette-overlay" onClick={handleBackdropClick} role="dialog" aria-label="Command palette">
      <div className="palette-panel" onKeyDown={handleKeyDown}>
        <div className="palette-search-wrap">
          <span className="palette-search-icon">⌘</span>
          <input
            ref={inputRef}
            type="text"
            className="palette-search"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-label="Search commands"
          />
          <kbd className="palette-esc">ESC</kbd>
        </div>

        <div className="palette-list" ref={listRef} role="listbox">
          {filtered.length === 0 && (
            <div className="palette-empty">No commands found</div>
          )}
          {filtered.map((cmd, i) => (
            <div
              key={cmd.name}
              className={`palette-item${i === selectedIndex ? ' palette-item--active' : ''}${cmd.hidden ? ' palette-item--hidden' : ''}`}
              onClick={() => handleItemClick(cmd.name)}
              role="option"
              aria-selected={i === selectedIndex}
            >
              <span className="palette-item-name">{cmd.name}</span>
              <span className="palette-item-desc">{cmd.desc}</span>
              {cmd.hidden && <span className="palette-item-badge">hidden</span>}
            </div>
          ))}
        </div>

        <div className="palette-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
