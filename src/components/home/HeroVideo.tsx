"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

// Video de portada de la home. Hay dos cortes: vertical (1080x1920) para pantallas en vertical y
// horizontal (1920x1080) para el resto; se elige en el cliente para bajar uno solo. Arranca solo
// si el usuario no pidió reducir movimiento (en ese caso queda el cuadro final, quieto) y siempre
// se puede pausar (front#15). El video termina en el cuadro final, sin loop.
const BASE = "/out/wave-hero";
const VERTICAL = "(orientation: portrait)";
const REDUCIDO = "(prefers-reduced-motion: reduce)";

// En el servidor no hay media queries: null hasta que hidrata el cliente.
function useMedia(query: string): boolean | null {
  return useSyncExternalStore(
    (avisar) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => matchMedia(query).matches,
    () => null,
  );
}

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const vertical = useMedia(VERTICAL);
  const reducido = useMedia(REDUCIDO) ?? false;
  const corte = vertical === null ? null : vertical ? "1080x1920" : "1920x1080";
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !corte || reducido) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [corte, reducido]);

  const alternar = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.ended) video.currentTime = 0;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <>
      {/* Mientras llega el video (o sin JS) se ve el primer cuadro; con reduced-motion, el final. */}
      <picture>
        <source media={VERTICAL} srcSet={`${BASE}-1080x1920-poster-${reducido ? "hero" : "first"}.webp`} />
        <img
          src={`${BASE}-1920x1080-poster-${reducido ? "hero" : "first"}.webp`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {corte && !reducido && (
        <video
          key={corte}
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          poster={`${BASE}-${corte}-poster-first.webp`}
          onPlay={() => setReproduciendo(true)}
          onPause={() => setReproduciendo(false)}
          onEnded={() => setReproduciendo(false)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`${BASE}-${corte}.mp4`} type="video/mp4" />
        </video>
      )}
      {corte && !reducido && (
        <button
          type="button"
          onClick={alternar}
          aria-label={reproduciendo ? "Pausar video de portada" : "Reproducir video de portada"}
          className="absolute bottom-6 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-8"
        >
          {reproduciendo ? <Pause size={18} strokeWidth={1.75} /> : <Play size={18} strokeWidth={1.75} />}
        </button>
      )}
    </>
  );
}
