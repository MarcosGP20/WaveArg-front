"use client";

import { useState, useRef, useCallback } from "react";
import type { FC } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface LazyVideoProps {
  posterUrl: string;
  videoUrlMp4: string;
  altText?: string;
  mode: "testimonial" | "creator";
}

export const LazyVideoFacade: FC<LazyVideoProps> = ({
  posterUrl,
  videoUrlMp4,
  altText = "",
  mode,
}) => {
  const [isLoaded, setIsLoaded] = useState(mode === "creator");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true); // autoPlay arranca en true
  const [showIcon, setShowIcon] = useState(false);   // controla la animación del ícono central

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iconTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Muestra el ícono central brevemente (estilo YouTube)
  const flashIcon = useCallback(() => {
    setShowIcon(true);
    if (iconTimeoutRef.current) clearTimeout(iconTimeoutRef.current);
    iconTimeoutRef.current = setTimeout(() => setShowIcon(false), 700);
  }, []);

  // Toggle play/pause al hacer click en el video (solo modo testimonial)
  const handleVideoClick = useCallback(() => {
    if (!videoRef.current || mode !== "testimonial") return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    flashIcon();
  }, [mode, flashIcon]);

  // Toggle mute (solo modo creator)
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const containerClasses =
    mode === "creator"
      ? "w-full h-full"
      : "aspect-video w-full rounded-xl shadow-lg";

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${containerClasses}`}>
      {!isLoaded ? (
        /* --- FACHADA: poster + botón play --- */
        <button
          onClick={() => setIsLoaded(true)}
          className="group relative w-full h-full"
        >
          <img
            src={posterUrl}
            alt={altText}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
              <Play className="w-8 h-8 text-black fill-current ml-1" />
            </div>
          </div>
        </button>
      ) : (
        <>
          {/* Video */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${mode === "testimonial" ? "cursor-pointer" : ""}`}
            poster={posterUrl}
            autoPlay
            muted={isMuted}
            loop={mode === "creator"}
            playsInline
            controls={mode === "creator"}
            onClick={handleVideoClick}
          >
            <source src={videoUrlMp4} type="video/mp4" />
            Tu navegador no soporta videos.
          </video>

          {/* Overlay Play/Pause (solo modo testimonial) */}
          {mode === "testimonial" && (
            <>
              {/* Ícono central animado — aparece brevemente al hacer click */}
              <div
                className={`
                  pointer-events-none absolute inset-0 flex items-center justify-center
                  transition-opacity duration-300
                  ${showIcon ? "opacity-100" : "opacity-0"}
                `}
              >
                <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white fill-current" />
                  ) : (
                    <Play className="w-8 h-8 text-white fill-current ml-0.5" />
                  )}
                </div>
              </div>

              {/* Hint de click — visible solo cuando el video está pausado */}
              {!isPlaying && !showIcon && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-white/90 rounded-full p-4 shadow-xl">
                    <Play className="w-8 h-8 text-black fill-current ml-0.5" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Botón de mute (solo modo creator) */}
          {mode === "creator" && (
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2.5 rounded-full transition-all border border-white/20"
              aria-label={isMuted ? "Activar sonido" : "Desactivar sonido"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" strokeWidth={2} />
              ) : (
                <Volume2 className="w-5 h-5 text-white" strokeWidth={2} />
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};
