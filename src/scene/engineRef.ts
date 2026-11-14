import type { SpaceEngine } from './SpaceEngine';

// Lets the launch sequence find the running 3D engine without prop drilling.
let current: SpaceEngine | null = null;
const listeners = new Set<(engine: SpaceEngine | null) => void>();

export function setEngine(engine: SpaceEngine | null) {
  current = engine;
  listeners.forEach((fn) => fn(engine));
}

export function getEngine() {
  return current;
}

export function onEngine(fn: (engine: SpaceEngine | null) => void) {
  listeners.add(fn);
  if (current) fn(current);
  return () => {
    listeners.delete(fn);
  };
}
