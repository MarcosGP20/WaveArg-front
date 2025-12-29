"use client";

import { useState, useRef } from "react";
import type { FC } from "react";
// Importamos los iconos necesarios de Lucide
import { Play, Volume2, VolumeX } from "lucide-react";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Función para alternar audio
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita conflictos con otros eventos de click
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const containerClasses =
    mode === "creator"
      ? "w-full h-full" // El tamaño lo define el padre en page.tsx
      : "aspect-video w-full rounded-xl shadow-lg";

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${containerClasses}`}>
      {!isLoaded ? (
        /* --- FACHADA PARA TESTIMONIALS --- */
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
              {/* Icono Play de Lucide */}
              <Play className="w-8 h-8 text-black fill-current ml-1" />
            </div>
          </div>
        </button>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={posterUrl}
            autoPlay
            muted={isMuted}
            loop={mode === "creator"}
            playsInline
            controls={mode === "creator"} // Controles habilitados para tips de creadores
          >
            <source src={videoUrlMp4} type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          {/* Botón de estado de Audio (Solo modo creator) */}
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
