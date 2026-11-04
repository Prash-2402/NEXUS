import { lazy, Suspense } from 'react';

const SpaceCanvas = lazy(() => import('./SpaceCanvas'));

/**
 * Fixed background layer: a CSS gradient that shows instantly (and stays as the
 * fallback without WebGL), the 3D scene on top, and a vignette for text contrast.
 */
export function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-space-fallback" />
      <Suspense fallback={null}>
        <SpaceCanvas />
      </Suspense>
      <div className="absolute inset-0 bg-space-vignette" />
    </div>
  );
}
