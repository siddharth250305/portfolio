/* ══════════════════════════════════════
   HEADER — Fixed top status bar (PRD §5.1)
   ══════════════════════════════════════ */

import { useState, useEffect } from 'react';
import './Header.css';

function formatCETTime(date) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Stockholm',
      hour12: false,
    }).format(date).replace(',', '') + ' CET';
  } catch {
    // Fallback if timezone not supported
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} · ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
}

export default function Header({ onTogglePower, isPoweredOff }) {
  const [dateTime, setDateTime] = useState(() => formatCETTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setDateTime(formatCETTime(new Date()));
    }, 60000); // Update every minute
    return () => clearInterval(id);
  }, []);

  return (
    <header className="header" role="banner">
      {/* Left group */}
      <div className="header-left">
        <span className="header-location">🇸🇪 Sweden</span>
      </div>

      {/* Center group */}
      <div className="header-center">
        <span className="header-url">thesid.tech</span>
      </div>

      {/* Right group */}
      <div className="header-right">
        <span className="header-status">
          <span className="header-status-dot">●</span> open to work
        </span>
        <span className="header-datetime">{dateTime}</span>
        <button
          className="header-btn header-btn--power"
          onClick={onTogglePower}
          aria-label={isPoweredOff ? 'Power on' : 'Power off'}
          title={isPoweredOff ? 'Power on' : 'Power off'}
        >
          ⏻
        </button>
      </div>
    </header>
  );
}
