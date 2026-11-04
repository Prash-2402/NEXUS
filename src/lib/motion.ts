import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'expo.out', duration: 1 });

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs GSAP setup scoped to a container and reverts it on unmount.
 * Skipped entirely when the visitor prefers reduced motion, so content stays static and visible.
 */
export function useGsap(
  scope: RefObject<HTMLElement>,
  setup: (ctx: gsap.Context) => void,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !scope.current) return;
    const ctx = gsap.context(setup, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Tell the 3D scene which world to highlight (or null to clear). */
export function focusWorld(world: string | null) {
  window.dispatchEvent(new CustomEvent('nexus:focus-world', { detail: world }));
}

/** Ask the Events section to switch its filter. */
export function selectWorldFilter(world: string) {
  window.dispatchEvent(new CustomEvent('nexus:filter', { detail: world }));
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}
