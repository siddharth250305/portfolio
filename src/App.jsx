import { useState, useCallback, useEffect, Component } from 'react';
import './App.css';

import useTheme from './hooks/useTheme';
import useAudio from './hooks/useAudio';
import usePowerSystem from './hooks/usePowerSystem';

import BootScreen from './components/BootScreen/BootScreen';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Terminal from './components/Terminal/Terminal';
import Footer from './components/Footer/Footer';
import PowerOverlay from './components/PowerOverlay/PowerOverlay';
import LineWaves from './components/LineWaves/LineWaves';
// Matrix effects removed
import Particles from './components/Effects/Particles';
import Scanlines from './components/Effects/Scanlines';
import CRTVignette from './components/Effects/CRTVignette';
import CommandPalette from './components/CommandPalette/CommandPalette';

// Error boundary to catch rendering crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Component crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: '#ff5555', fontFamily: 'monospace', background: '#1a1a1a' }}>
          <h3>⚠ Component Error</h3>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const { playBootSound, playPowerOffSound } = useAudio();
  const [bootComplete, setBootComplete] = useState(false);
  const [showBootScreen, setShowBootScreen] = useState(true);
  // matrixActive state removed
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(() => {
    try {
      return localStorage.getItem('scanlines-enabled') !== 'false';
    } catch {
      return true;
    }
  });

  const {
    isPoweredOff,
    powerState,
    shutdownMessages,
    resumeMessages,
    haltedText,
    startupProgress,
    powerOff,
    powerOn,
  } = usePowerSystem();

  const handleBootComplete = useCallback(() => {
    setShowBootScreen(false);
    setBootComplete(true);
  }, []);

  const handlePowerToggle = useCallback(() => {
    if (isPoweredOff || powerState === 'off') {
      playBootSound();
      powerOn();
    } else if (powerState === 'idle') {
      playPowerOffSound();
      powerOff();
    }
  }, [isPoweredOff, powerState, playBootSound, playPowerOffSound, powerOn, powerOff]);

  // Matrix handlers removed

  // Scanlines toggle (theme command)
  const handleToggleScanlines = useCallback(() => {
    setScanlinesEnabled(prev => {
      const next = !prev;
      try { localStorage.setItem('scanlines-enabled', String(next)); } catch { }
      return next;
    });
  }, []);

  // Run command from chips or palette
  const handleRunCommand = useCallback((cmd) => {
    // Use the terminal's exposed processCommand via window
    if (window.__terminalRunCommand) {
      window.__terminalRunCommand(cmd);
    }
  }, []);

  // ⌘K / Ctrl+K keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-wrapper">
      {/* Background effects */}
      <div className="line-waves-bg" aria-hidden="true">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1.0}
          rotation={-45}
          edgeFadeWidth={0.0}
          colorCycleSpeed={1.0}
          brightness={0.26}
          color1="#8B7355"
          color2="#c4a87a"
          color3="#6b5d4d"
          enableMouseInteraction={false}
          mouseInfluence={2.0}
        />
      </div>
      {scanlinesEnabled && <Scanlines />}
      <CRTVignette />

      {/* Boot screen */}
      {showBootScreen && (
        <BootScreen
          onBootComplete={handleBootComplete}
          playBootSound={playBootSound}
        />
      )}

      {/* Header */}
      <Header
        onTogglePower={handlePowerToggle}
        isPoweredOff={isPoweredOff}
      />

      {/* Main content */}
      <h1 className="sr-only">Adesh Siddhartha – Terminal Portfolio</h1>
      <main className="app-main">
        <ErrorBoundary>
          <Hero bootComplete={bootComplete} onRunCommand={handleRunCommand} />
        </ErrorBoundary>
        <ErrorBoundary>
          <Terminal
            onToggleTheme={toggleTheme}
            theme={theme}
            isPoweredOff={isPoweredOff}
            bootComplete={bootComplete}
            // onMatrixRun removed
            onToggleScanlines={handleToggleScanlines}
          />
        </ErrorBoundary>
      </main>

      <Footer />

      {/* Command palette overlay */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onRunCommand={handleRunCommand}
      />

      {/* Power overlay */}
      <PowerOverlay
        powerState={powerState}
        shutdownMessages={shutdownMessages}
        resumeMessages={resumeMessages}
        haltedText={haltedText}
        onPowerOn={handlePowerToggle}
        startupProgress={startupProgress}
      />
    </div>
  );
}

export default App;
