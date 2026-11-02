import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Stardust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface NebulaCloud {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  color: string;
  speed: number;
  phase: number;
  driftX: number;
  driftY: number;
}

interface GalaxyBackgroundProps {
  warpActive?: boolean;
  accentColor?: string;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  warpActive = false,
  accentColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0, targetY: 0, velocity: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive star count: reduce on mobile devices
    const isMobile = width < 768;
    const starCount = isMobile ? 350 : 850;
    const dustCount = isMobile ? 25 : 60;

    // Palette: Midnight space, electric blue, cosmic violet, stellar gold
    const starPalette = ['#ffffff', '#e2e8f0', '#93c5fd', '#c084fc', '#fef08a'];

    // Layer 2: Distant & Mid Stars (3D perspective)
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 1,
        size: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starPalette[Math.floor(Math.random() * starPalette.length)],
      });
    }

    // Layer 4: Near-field floating Stardust particles
    const dustParticles: Stardust[] = [];
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.4 ? '#813CFF' : '#315CFF',
      });
    }

    // Layer 3: Nebula Cosmic Clouds (Procedural vortexes)
    const nebulae: NebulaCloud[] = [
      {
        x: width * 0.25,
        y: height * 0.3,
        baseRadius: Math.min(width, height) * 0.45,
        radius: Math.min(width, height) * 0.45,
        color: 'rgba(49, 92, 255, 0.08)', // Electric blue
        speed: 0.0008,
        phase: 0,
        driftX: 0.05,
        driftY: 0.03,
      },
      {
        x: width * 0.75,
        y: height * 0.45,
        baseRadius: Math.min(width, height) * 0.5,
        radius: Math.min(width, height) * 0.5,
        color: 'rgba(129, 60, 255, 0.09)', // Cosmic violet
        speed: 0.0006,
        phase: 2,
        driftX: -0.04,
        driftY: 0.06,
      },
      {
        x: width * 0.5,
        y: height * 0.75,
        baseRadius: Math.min(width, height) * 0.4,
        radius: Math.min(width, height) * 0.4,
        color: 'rgba(23, 16, 46, 0.25)', // Deep midnight indigo
        speed: 0.0004,
        phase: 4,
        driftX: 0.02,
        driftY: -0.04,
      },
      {
        x: width * 0.6,
        y: height * 0.2,
        baseRadius: Math.min(width, height) * 0.25,
        radius: Math.min(width, height) * 0.25,
        color: 'rgba(245, 196, 81, 0.03)', // Subtle stellar gold accent
        speed: 0.0005,
        phase: 1,
        driftX: -0.02,
        driftY: 0.02,
      },
    ];

    // Handle mouse movement for subtle desktop parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReduced) return;
      const normX = (e.clientX / width - 0.5) * 2;
      const normY = (e.clientY / height - 0.5) * 2;
      mouseRef.current.targetX = normX * 35; // gentle parallax offset
      mouseRef.current.targetY = normY * 35;
    };

    // Handle scroll for layered depth shift
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - scrollRef.current.y;
      scrollRef.current.velocity = delta * 0.5;
      scrollRef.current.targetY = scrollY;
      scrollRef.current.y = scrollY;
    };

    // Handle window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      nebulae[0].baseRadius = Math.min(width, height) * 0.45;
      nebulae[1].baseRadius = Math.min(width, height) * 0.5;
      nebulae[2].baseRadius = Math.min(width, height) * 0.4;
      nebulae[3].baseRadius = Math.min(width, height) * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    let time = 0;
    let warpFactor = 1;

    // Animation Render Loop
    const render = () => {
      // Pause animation if document is not visible
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += prefersReduced ? 0.002 : 0.01;

      // Smooth inertia on mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Warp speed acceleration interpolation
      const targetWarp = warpActive ? 8 : 1;
      warpFactor += (targetWarp - warpFactor) * 0.05;

      // Layer 1: Deep-space background fill (#030308 with deep indigo gradient)
      ctx.fillStyle = '#030308';
      ctx.fillRect(0, 0, width, height);

      // Subtle base radial ambience
      const bgGrad = ctx.createRadialGradient(
        width * 0.5 + mouseRef.current.x * 0.2,
        height * 0.4 + mouseRef.current.y * 0.2,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#0c0a22');
      bgGrad.addColorStop(0.5, '#070514');
      bgGrad.addColorStop(1, '#030308');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Layer 3: Nebulae cosmic clouds
      ctx.save();
      for (const neb of nebulae) {
        if (!prefersReduced) {
          neb.phase += neb.speed;
        }
        const pulse = Math.sin(neb.phase) * 20;
        const currentR = Math.max(10, neb.baseRadius + pulse);
        const nx = neb.x + mouseRef.current.x * 0.4 + Math.sin(neb.phase * 0.7) * 25;
        const ny = neb.y + mouseRef.current.y * 0.4 + Math.cos(neb.phase * 0.5) * 20;

        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, currentR);
        // If accentColor provided, tint slightly
        const tint = accentColor ? accentColor : neb.color;
        grad.addColorStop(0, tint);
        grad.addColorStop(0.6, neb.color);
        grad.addColorStop(1, 'rgba(3, 3, 8, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, currentR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Layer 2: Animated Stars with 3D depth and twinkling
      const cx = width / 2;
      const cy = height / 2;
      const starSpeed = prefersReduced ? 0.05 : 0.4 * warpFactor;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star forward along Z
        star.z -= starSpeed;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        // Project 3D coordinates to 2D screen with parallax
        const k = 250 / star.z;
        const px = star.x * k + cx + mouseRef.current.x * (1 - star.z / 1000);
        const py = star.y * k + cy + mouseRef.current.y * (1 - star.z / 1000);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          // Twinkle formula
          star.twinklePhase += star.twinkleSpeed;
          const twinkle = Math.sin(star.twinklePhase) * 0.35 + 0.65;
          const currentAlpha = Math.max(0.1, Math.min(1, star.baseAlpha * twinkle * (1 - star.z / 1000)));

          const size = Math.max(0.5, star.size * k * 0.8);

          // Draw star streak during warp speed or normal circle
          if (warpFactor > 2) {
            const streakLength = (warpFactor - 1) * 3 * k;
            ctx.strokeStyle = star.color;
            ctx.globalAlpha = currentAlpha;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + (px - cx) * 0.05 * streakLength, py + (py - cy) * 0.05 * streakLength);
            ctx.stroke();
          } else {
            ctx.fillStyle = star.color;
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Layer 4: Near-field floating Stardust particles
      ctx.save();
      for (const p of dustParticles) {
        if (!prefersReduced) {
          p.x += p.vx + mouseRef.current.x * 0.01;
          p.y += p.vy + mouseRef.current.y * 0.01;

          // Wrap edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReduced, warpActive, accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030308]" aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Subtle atmospheric vignette to preserve crisp contrast for foreground typography */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(3, 3, 8, 0) 50%, rgba(3, 3, 8, 0.75) 100%)'
        }}
      />
    </div>
  );
};

