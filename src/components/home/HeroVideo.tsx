"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

// El teléfono flotando en el mar: loop de 8 s sin costura, hecho en HyperFrames (el fuente está
// fuera del repo, en video/wave-hero/square). No trae texto: el titular va en HTML. El fondo del
// video es atlantico, igual que el hero, y en desktop los costados se funden con la página.
//
// Debajo siempre está el poster (el primer cuadro del loop): es lo que se ve mientras llega el
// video, sin JS y con prefers-reduced-motion. El video se puede pausar.
const VIDEO = "/out/wave-hero-1080x1080.mp4";
const POSTER = "/out/wave-hero-1080x1080-poster.webp";
const REDUCIDO = "(prefers-reduced-motion: reduce)";

// En el servidor no hay media queries: null hasta que hidrata el cliente.
function usePideMenosMovimiento(): boolean | null {
  return useSyncExternalStore(
    (avisar) => {
      const mq = matchMedia(REDUCIDO);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => matchMedia(REDUCIDO).matches,
    () => null,
  );
}

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const conVideo = usePideMenosMovimiento() === false;
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [conVideo]);

  const alternar = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div className="relative">
      <div className="relative aspect-square overflow-hidden md:[mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]">
        <Image
          src={POSTER}
          alt=""
          fill
          sizes="(min-width: 768px) 512px, 100vw"
          loading="eager"
          className="object-cover"
        />
        {conVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            poster={POSTER}
            onPlay={() => setReproduciendo(true)}
            onPause={() => setReproduciendo(false)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={VIDEO} type="video/mp4" />
          </video>
        )}
      </div>
      {conVideo && (
        <button
          type="button"
          onClick={alternar}
          aria-label={reproduciendo ? "Pausar la animación de portada" : "Reproducir la animación de portada"}
          className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full border border-white/30 bg-atlantico/70 text-white backdrop-blur-sm transition-colors duration-300 ease-ola hover:bg-atlantico md:right-16"
        >
          {reproduciendo ? <Pause size={18} strokeWidth={1.75} aria-hidden="true" /> : <Play size={18} strokeWidth={1.75} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
