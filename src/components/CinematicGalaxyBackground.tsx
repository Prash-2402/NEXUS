import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CinematicGalaxyBackgroundProps {
  totalFrames?: number;
}

// Module-level persistent cache across component re-renders
const frameCache = new Map<number, HTMLImageElement>();
const inFlightPromises = new Map<number, Promise<HTMLImageElement>>();

export const getFrameUrl = (index: number) => {
  const padded = String(Math.min(301, Math.max(1, index))).padStart(4, '0');
  return `/frames/frame_${padded}.png`;
};

export const loadFrame = (index: number): Promise<HTMLImageElement> => {
  const cached = frameCache.get(index);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  const existingPromise = inFlightPromises.get(index);
  if (existingPromise) {
    return existingPromise;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      inFlightPromises.delete(index);
      frameCache.set(index, img);
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {}).finally(() => resolve(img));
      } else {
        resolve(img);
      }
    };

    img.onerror = (err) => {
      inFlightPromises.delete(index);
      reject(err);
    };

    img.src = getFrameUrl(index);
  });

  inFlightPromises.set(index, promise);
  return promise;
};

// Find the nearest loaded frame in cache so canvas never stutters or goes blank
const getBestAvailableFrame = (targetIndex: number, totalFrames: number): HTMLImageElement | null => {
  const exact = frameCache.get(targetIndex);
  if (exact && exact.complete && exact.naturalWidth > 0) {
    return exact;
  }

  // Search outwards ±1, ±2, ±3...
  for (let offset = 1; offset < totalFrames; offset++) {
    const prev = targetIndex - offset;
    if (prev >= 1) {
      const imgPrev = frameCache.get(prev);
      if (imgPrev && imgPrev.complete && imgPrev.naturalWidth > 0) {
        return imgPrev;
      }
    }
    const next = targetIndex + offset;
    if (next <= totalFrames) {
      const imgNext = frameCache.get(next);
      if (imgNext && imgNext.complete && imgNext.naturalWidth > 0) {
        return imgNext;
      }
    }
  }

  const f1 = frameCache.get(1);
  if (f1 && f1.complete && f1.naturalWidth > 0) {
    return f1;
  }

  return null;
};

export const CinematicGalaxyBackground: React.FC<CinematicGalaxyBackgroundProps> = ({
  totalFrames = 301,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [hasRenderedFirstFrame, setHasRenderedFirstFrame] = useState(false);

  // Proactively preload surrounding window of frames
  const preloadWindow = (centerIndex: number, windowSize = 10) => {
    const start = Math.max(1, centerIndex - 5);
    const end = Math.min(totalFrames, centerIndex + windowSize);

    for (let i = start; i <= end; i++) {
      if (!frameCache.has(i) && !inFlightPromises.has(i)) {
        loadFrame(i).catch(() => {});
      }
    }
  };

  // Render a frame with object-fit: cover onto the canvas, preserving original 16:9 ratio
  const drawCover = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ) => {
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    if (cw <= 0 || ch <= 0 || iw <= 0 || ih <= 0) return;

    const canvasAspect = cw / ch;
    const imageAspect = iw / ih;

    let drawW: number;
    let drawH: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasAspect > imageAspect) {
      // Screen is wider than 16:9 (e.g. desktop ultrawide)
      drawW = cw;
      drawH = cw / imageAspect;
      offsetX = 0;
      offsetY = (ch - drawH) / 2;
    } else {
      // Screen is taller than 16:9 (e.g. mobile portrait, laptop)
      drawH = ch;
      drawW = ch * imageAspect;
      offsetX = (cw - drawW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    // Cleanly erase the static Gemini watermark from the video frame on canvas
    const wx = offsetX + drawW * (1734 / 1920);
    const wy = offsetY + drawH * (888 / 1080);
    const wr = drawW * (45 / 1920);

    const grad = ctx.createRadialGradient(wx, wy, 0, wx, wy, wr);
    grad.addColorStop(0, '#04030a');
    grad.addColorStop(0.5, 'rgba(5, 4, 15, 0.95)');
    grad.addColorStop(0.8, 'rgba(7, 6, 20, 0.6)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(wx, wy, wr, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let isMounted = true;
    let lastRenderedIndex = -1;
    let currentFrame = 1;
    let targetFrame = 1;
    let needsRedraw = true;

    // Responsive Canvas Resizing with devicePixelRatio
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth || document.documentElement.clientWidth || 1920;
      const h = window.innerHeight || document.documentElement.clientHeight || 1080;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      needsRedraw = true;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Calculate normalized scroll progress spanning the FULL PAGE (0 at top, 1 at bottom of page)
    const calculateProgress = () => {
      if (prefersReduced) return 0;

      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );
      const winHeight = window.innerHeight || 1;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

      return Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    // Scroll listener calculates steady progress across the entire page
    const handleScroll = () => {
      const progress = calculateProgress();
      // Map 0% -> Frame 1, 100% -> Frame 301
      const nextTarget = Math.min(
        totalFrames,
        Math.max(1, 1 + Math.round(progress * (totalFrames - 1)))
      );

      if (nextTarget !== targetFrame) {
        targetFrame = nextTarget;
        preloadWindow(targetFrame, 12);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Step 1: Preload & render Frame 1 immediately
    loadFrame(1)
      .then((firstImg) => {
        if (!isMounted) return;
        setHasRenderedFirstFrame(true);
        drawCover(ctx, canvas, firstImg);
        lastRenderedIndex = 1;

        // Step 2: Preload anchor frames across full journey (every 15 frames)
        for (let f = 1; f <= totalFrames; f += 15) {
          loadFrame(f).catch(() => {});
        }
        loadFrame(totalFrames).catch(() => {});

        // Step 3: Preload forward window
        preloadWindow(1, 12);
      })
      .catch((err) => {
        console.error('[Galaxy] Frame 1 failed to load:', err);
      });

    // Cinematic RAF render loop with smooth inertia damping
    const renderLoop = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      // Smooth cinematic damping (0.15) for silky fluid motion without abrupt stops
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.02) {
        currentFrame += diff * 0.15;
        needsRedraw = true;
      } else if (currentFrame !== targetFrame) {
        currentFrame = targetFrame;
        needsRedraw = true;
      }

      const frameToDraw = Math.round(currentFrame);

      if (needsRedraw || frameToDraw !== lastRenderedIndex) {
        const img = getBestAvailableFrame(frameToDraw, totalFrames);
        if (img && img.complete && img.naturalWidth > 0) {
          drawCover(ctx, canvas, img);
          lastRenderedIndex = frameToDraw;
          needsRedraw = false;
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [totalFrames, prefersReduced]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030308]"
      aria-hidden="true"
    >
      {/* Instant Native Fallback Poster: Displays Frame 1 immediately without waiting for JS */}
      <img
        src="/frames/frame_0001.png"
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          hasRenderedFirstFrame ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Cinematic Frame-by-Frame Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />

      {/* Atmospheric Vignette & Soft Gradient for Foreground Text Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(3, 3, 8, 0.1) 20%, rgba(3, 3, 8, 0.55) 100%)',
        }}
      />
    </div>
  );
};
