"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// Video de portada de la home. Arranca solo si el usuario no pidió reducir movimiento, y
// siempre se puede pausar (front#15). El autoplay va por efecto y no por atributo: el servidor
// no sabe la preferencia del usuario.
export default function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  const alternar = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={alternar}
        aria-label={reproduciendo ? "Pausar video de portada" : "Reproducir video de portada"}
        className="absolute top-24 right-4 md:right-8 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {reproduciendo ? <Pause size={18} strokeWidth={1.75} /> : <Play size={18} strokeWidth={1.75} />}
      </button>
    </>
  );
}
