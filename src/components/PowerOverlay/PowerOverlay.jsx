import './PowerOverlay.css';

export default function PowerOverlay({ powerState, shutdownMessages, resumeMessages, haltedText, onPowerOn, startupProgress }) {
  if (powerState === 'idle') return null;

  return (
    <div className="power-overlay">
      {powerState === 'shutting-down' && (
        <div className="power-messages">
          {shutdownMessages.map((msg, i) => (
            <div key={i} className="power-msg">{msg}</div>
          ))}
          {haltedText && (
            <div className="power-msg power-halted">
              {haltedText}<span className="blink-cursor">_</span>
            </div>
          )}
        </div>
      )}

      {powerState === 'off' && (
        <div className="power-off-screen">
          <div className="power-messages">
            {shutdownMessages.map((msg, i) => (
              <div key={i} className="power-msg">{msg}</div>
            ))}
            <div className="power-msg power-halted">
              {haltedText}<span className="blink-cursor">_</span>
            </div>
          </div>
          <button className="power-button-big" onClick={onPowerOn} title="Power On">
            ⏻
          </button>
        </div>
      )}

      {powerState === 'starting-up' && (
        <div className="power-messages">
          {resumeMessages.map((msg, i) => (
            <div key={i} className="power-msg">{msg}</div>
          ))}
          <div className="power-progress-container">
            <div className="power-progress">
              <div className="power-progress-fill" style={{ width: `${startupProgress}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
