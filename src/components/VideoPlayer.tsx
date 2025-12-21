"use client";

import { useState, useRef } from "react";
import type { FC } from "react";
// Si usas iconos de alguna libreria como lucide-react o heroicons:
// import { PlayIcon } from 'lucide-react';

interface LazyVideoProps {
  posterUrl: string;
  videoUrlWebm?: string;
  videoUrlMp4?: string;
  altText?: string;
}

export const LazyVideoFacade: FC<LazyVideoProps> = ({
  posterUrl,
  videoUrlWebm,
  videoUrlMp4,
  altText = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    setIsLoaded(true);
    // Un pequeño timeout para asegurar que el DOM se actualizó con el video
    setTimeout(() => {
      if (videoRef.current) {
        // el uso de optional chaining y el tipo en useRef evita errores de TS
        videoRef.current.play();
      }
    }, 100);
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100">
      {!isLoaded ? (
        // --- LA FACHADA (IMAGEN) ---
        <button
          onClick={handlePlay}
          className="group relative w-full h-full block cursor-pointer"
          aria-label={`Reproducir video de ${altText}`}
        >
          {/* Imagen Poster optimizada (usa next/image si puedes) */}
          <img
            src={posterUrl}
            alt={altText}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Botón de Play Falso centrado */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
              {/* Icono de Play simple SVG */}
              <svg
                className="w-8 h-8 text-black ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        // --- EL VIDEO REAL (Se monta solo al click) ---
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          autoPlay
          playsInline
          aria-label={altText || "Video"}
        >
          {/* Orden de prioridad: WebM primero (más liviano) */}
          {videoUrlWebm && <source src={videoUrlWebm} type="video/webm" />}
          {videoUrlMp4 && <source src={videoUrlMp4} type="video/mp4" />}
          Tu navegador no soporta videos.
        </video>
      )}
    </div>
  );
};
