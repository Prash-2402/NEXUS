import { useEffect, useRef, useState } from 'react';
import { SpaceEngine } from './SpaceEngine';
import { setEngine } from './engineRef';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Full-screen WebGL canvas. Loaded lazily so the page renders before three.js arrives. */
export default function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasWebGL()) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let engine: SpaceEngine | null = null;
    try {
      engine = new SpaceEngine(canvas, { reducedMotion });
      engine.renderOnce();
      engine.start();
      setEngine(engine);
      if (import.meta.env.DEV) (window as unknown as { __nexus?: SpaceEngine }).__nexus = engine;
      requestAnimationFrame(() => setReady(true));
    } catch (err) {
      console.warn('NEXUS: 3D background unavailable, using static fallback.', err);
    }
    return () => {
      setEngine(null);
      engine?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 h-full w-full transition-opacity duration-[1600ms] ease-out ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
