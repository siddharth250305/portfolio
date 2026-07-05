/* ══════════════════════════════════════
   NEURONS — Live neural signals firing across the brain
   Canvas overlay aligned to the brain silhouette.
   ══════════════════════════════════════ */

import { useRef, useEffect } from 'react';

const GOLD = '212, 184, 122';

export default function Neurons() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let nodes = [];
    let edges = [];
    let pulses = [];
    let rings = [];
    let w = 0;
    let h = 0;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    function build() {
      nodes = [];
      const cx = w / 2;
      const cy = h / 2;
      // Brain silhouette: wider than tall.
      const rx = w * 0.46;
      const ry = h * 0.32;
      const count = Math.max(20, Math.min(46, Math.floor(w / 18)));

      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());
        nodes.push({
          x: cx + Math.cos(a) * rx * r,
          y: cy + Math.sin(a) * ry * r,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Connect each node to its 2–3 nearest neighbours.
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const dists = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          dists.push({ j, d: dx * dx + dy * dy });
        }
        dists.sort((p, q) => p.d - q.d);
        const k = 2 + Math.floor(Math.random() * 2);
        for (let n = 0; n < k && n < dists.length; n++) {
          const j = dists[n].j;
          if (!edges.some((e) => (e.a === j && e.b === i) || (e.a === i && e.b === j))) {
            edges.push({ a: i, b: j });
          }
        }
      }
      pulses = [];
      rings = [];
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function spawnPulse() {
      if (!edges.length) return;
      const e = edges[(Math.random() * edges.length) | 0];
      pulses.push({
        edge: e,
        t: 0,
        speed: 0.006 + Math.random() * 0.012,
        dir: Math.random() < 0.5 ? 1 : -1,
      });
    }

    function frame(ts) {
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, w, h);
      const time = ts * 0.001;

      // Faint synapse lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${GOLD}, 0.06)`;
      ctx.beginPath();
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();

      // Flickering neuron bodies
      for (const nd of nodes) {
        const glow = 0.3 + 0.3 * Math.sin(time * 2 + nd.phase);
        ctx.fillStyle = `rgba(${GOLD}, ${0.12 + glow * 0.18})`;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Expanding firing rings (neuron activations)
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.t += 0.03;
        if (ring.t >= 1) {
          rings.splice(i, 1);
          continue;
        }
        const radius = 2 + ring.t * 14;
        const alpha = (1 - ring.t) * 0.5;
        ctx.strokeStyle = `rgba(${GOLD}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Travelling signals
      if (Math.random() < 0.22) spawnPulse();
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        const a = nodes[p.edge.a];
        const b = nodes[p.edge.b];
        if (p.t >= 1) {
          // Fire a ring at the destination neuron
          const dest = p.dir === 1 ? b : a;
          rings.push({ x: dest.x, y: dest.y, t: 0 });
          pulses.splice(i, 1);
          continue;
        }
        const t = p.dir === 1 ? p.t : 1 - p.t;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const fade = Math.sin(p.t * Math.PI);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
        grad.addColorStop(0, `rgba(${GOLD}, ${0.95 * fade})`);
        grad.addColorStop(1, `rgba(${GOLD}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 244, 220, ${fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();

    if (prefersReduced) {
      // Single static frame, no animation.
      frame(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-neurons" aria-hidden="true" />;
}
