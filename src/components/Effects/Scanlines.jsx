export default function Scanlines() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        background: 'repeating-linear-gradient(transparent, transparent 1px, rgba(0,0,0,var(--scanline-opacity, 0.015)) 1px, rgba(0,0,0,var(--scanline-opacity, 0.015)) 2px)',
      }}
    />
  );
}
