import React, { useState, useRef, useEffect } from 'react';
import { siteConfig } from '../config/site';
import { Play, Pause, Volume2, VolumeX, Film } from 'lucide-react';

export const PromoVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const localVideo = siteConfig.media.localVideoUrl;
  const youtubeUrl = siteConfig.media.promoVideoUrl;

  // Automatically start playback on mount (browsers permit autoplay when muted)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Fallback if autoplay policy interrupts
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger play/pause
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section
      id="experience"
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#813CFF]/15 border border-[#813CFF]/30 text-xs font-semibold text-[#c084fc] mb-4">
            <Film className="w-3.5 h-3.5 text-[#F5C451]" />
            Visual Identity
          </div>
          <h2 className="font-space text-3xl sm:text-5xl font-bold tracking-tight text-white">
            EXPERIENCE NEXUS
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#A1A1B5]">
            One universe. Countless ways to experience it.
          </p>
        </div>

        {/* Video Player Frame (16:9 Aspect Ratio) */}
        <div
          onClick={localVideo ? togglePlayPause : undefined}
          className={`relative rounded-3xl overflow-hidden bg-[#090817] border border-[#813CFF]/35 shadow-2xl shadow-black/80 aspect-video group select-none ${
            localVideo ? 'cursor-pointer' : ''
          }`}
          role={localVideo ? 'button' : undefined}
          tabIndex={localVideo ? 0 : undefined}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              togglePlayPause();
            }
          }}
          aria-label={localVideo ? (isPlaying ? 'Click to pause teaser video' : 'Click to play teaser video') : undefined}
        >
          {localVideo && localVideo.trim() !== '' ? (
            /* Native Autoplaying HTML5 Video Player */
            <div className="relative w-full h-full bg-black">
              <video
                ref={videoRef}
                src={localVideo}
                poster={siteConfig.media.promoVideoThumbnail}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Top Controls Bar: Audio Sound Toggle & Status */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2.5">
                <button
                  onClick={toggleMute}
                  className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-xs text-white flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg shadow-black/50"
                  aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#F5C451]" />
                      <span className="text-[11px] font-space tracking-wide">Sound Off</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span className="text-[11px] font-space tracking-wide">Sound On</span>
                    </>
                  )}
                </button>
              </div>

              {/* Paused State Overlay - Shown when user clicks to pause */}
              {!isPlaying && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-[2px] transition-all duration-300">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#315CFF] via-[#813CFF] to-[#F5C451] p-1 shadow-2xl shadow-[#813CFF]/60 hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#030308] flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <p className="mt-4 font-space text-sm font-bold uppercase tracking-wider text-white">
                    Paused — Click anywhere to resume
                  </p>
                </div>
              )}

              {/* Subtle Click-To-Pause Indicator on Hover when Playing */}
              {isPlaying && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-4 py-2 rounded-full bg-black/60 border border-white/20 text-xs text-white/90 flex items-center gap-2 backdrop-blur-md shadow-xl">
                    <Pause className="w-3.5 h-3.5 text-[#F5C451]" />
                    <span className="font-space tracking-wide">Click video to pause</span>
                  </div>
                </div>
              )}
            </div>
          ) : youtubeUrl && youtubeUrl.trim() !== '' ? (
            /* Active YouTube Player */
            <iframe
              src={`${youtubeUrl}?autoplay=1&mute=1&loop=1`}
              title="NEXUS Official Experience Teaser"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            /* Fallback Placeholder */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-[#0c0a24] via-[#090817] to-[#030308]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#17102E]/80 border border-[#813CFF]/40 flex items-center justify-center mb-5 text-[#813CFF] shadow-[0_0_30px_rgba(129,60,255,0.3)]">
                <Film className="w-8 h-8 text-[#38bdf8]" />
              </div>
              <h3 className="font-space text-xl sm:text-2xl font-bold text-white mb-2">
                Official Teaser Reel
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed max-w-md">
                The official NEXUS cinematic teaser trailer will premiere here soon.
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

