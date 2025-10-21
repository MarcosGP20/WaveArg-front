"use client";

const VIDEO_PATH = "WAVE-DEMO-FONDO-NEGRO.mp4";

interface VideoLoaderProps {
  onLoaded: () => void;
}

export default function VideoLoader({ onLoaded }: VideoLoaderProps) {
  return (
    <div className="fixed inset-0 w-full h-screen bg-black z-50 flex items-center justify-center">
      <video
        width="100%"
        height="100%"
        playsInline
        autoPlay
        muted
        // Cuando el video termine de reproducirse, llama a la función onLoaded
        onEnded={onLoaded}
        className="w-full h-full object-cover"
      >
        <source src={VIDEO_PATH} type="video/mp4" />
        Tu navegador no soporta videos.
      </video>
    </div>
  );
}
