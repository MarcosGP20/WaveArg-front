"use client";

import { useEffect } from "react";

const VIDEO_PATH = "/LOGO-WAVE-alfa.webm";

interface VideoLoaderProps {
  onLoaded: () => void;
}

export default function VideoLoader({ onLoaded }: VideoLoaderProps) {
  useEffect(() => {
    // Fallback de seguridad por si el video no dispara onEnded
    const timeout = setTimeout(() => {
      onLoaded();
    }, 5000); // Ajustá a la duración del video en milisegundos
    return () => clearTimeout(timeout);
  }, [onLoaded]);

  return (
    <div className="fixed inset-0 w-full h-screen bg-white z-50 flex items-center justify-center">
      <video
        width="100%"
        height="100%"
        playsInline
        autoPlay
        muted
        onEnded={onLoaded}
        onError={(e) => {
          console.error("Error cargando video:", e);
          onLoaded();
        }}
        className="w-full h-full object-contain"
        title="LOGO WAVE Loader"
      >
        <source src={VIDEO_PATH} type="video/webm" />
        Tu navegador no soporta videos HTML5.
      </video>
    </div>
  );
}
