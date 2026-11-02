import React, { useState, useEffect } from 'react';
import { siteConfig } from '../config/site';

export const CosmicOrbitConvergence: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number; isVisible: boolean }>({
    x: 0,
    y: 0,
    isVisible: false,
  });

  useEffect(() => {
    const updatePosition = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // On small screens (< 1024px) where width is narrow, the watermark is cropped off-screen by cover
      if (w < 1024) {
        setPos((prev) => ({ ...prev, isVisible: false }));
        return;
      }

      const canvasAspect = w / h;
      const imageAspect = 1920 / 1080;

      let drawW: number;
      let drawH: number;
      let offsetX: number;
      let offsetY: number;

      if (canvasAspect > imageAspect) {
        drawW = w;
        drawH = w / imageAspect;
        offsetX = 0;
        offsetY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * imageAspect;
        offsetX = (w - drawW) / 2;
        offsetY = 0;
      }

      // Exact pixel coordinates of the static watermark in 1920x1080 source frames
      const cx = offsetX + drawW * (1734 / 1920);
      const cy = offsetY + drawH * (888 / 1080);

      // Only display when within viewport view
      const isVisible = cx >= 0 && cx <= w + 60 && cy >= 0 && cy <= h + 60;

      setPos({ x: Math.round(cx), y: Math.round(cy), isVisible });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition, { passive: true });
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  if (!pos.isVisible) return null;

  return (
    <div
      className="fixed z-20 pointer-events-none select-none transition-opacity duration-500"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden="true"
    >
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 xl:w-80 xl:h-80 flex items-center justify-center">
        {/* Outer Pulsing Cosmic Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#315CFF]/25 via-[#813CFF]/30 to-[#F5C451]/20 filter blur-2xl animate-pulse-slow" />

        {/* Orbit 1: Technical (Blue) */}
        <div
          className="absolute inset-2 border border-dashed border-[#315CFF]/45 rounded-full animate-spin-very-slow"
          style={{ animationDuration: '40s' }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#315CFF] shadow-[0_0_12px_#315CFF] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        {/* Orbit 2: Non-Technical (Violet) */}
        <div
          className="absolute inset-8 border border-[#813CFF]/50 rounded-full animate-spin-very-slow"
          style={{ animationDirection: 'reverse', animationDuration: '28s' }}
        >
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#813CFF] shadow-[0_0_15px_#813CFF] flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>

        {/* Orbit 3: Cultural (Stellar Gold) */}
        <div
          className="absolute inset-16 border border-dotted border-[#F5C451]/60 rounded-full animate-spin-very-slow"
          style={{ animationDuration: '20s' }}
        >
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F5C451] shadow-[0_0_14px_#F5C451] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        {/* Central Singularity Hub: Solid Dark Core Completely Covering Gemini Watermark */}
        <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 xl:w-32 xl:h-32 rounded-full bg-gradient-to-br from-[#17102E] via-[#090817] to-[#030308] border-2 border-[#813CFF]/70 flex items-center justify-center p-3.5 sm:p-4 xl:p-4.5 shadow-[0_0_35px_rgba(129,60,255,0.65)]">
          <img
            src={siteConfig.branding.nexusLogo}
            alt="NEXUS"
            className="w-full h-auto object-contain filter drop-shadow-[0_0_12px_rgba(129,60,255,0.8)] select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

