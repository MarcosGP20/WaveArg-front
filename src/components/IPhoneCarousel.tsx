"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// 📸 DATOS DEL CARRUSEL
// Cuando lleguen las imágenes reales, solo cambiá los valores de `image` acá.
// ─────────────────────────────────────────────────────────────────────────────
const iPhones = [
  {
    model: "iPhone 16 Pro Max",
    subtitle: "El más completo para creadores",
    image: "/iphones/iphone-16-pro-max.png", // ← SWAP: reemplazá con la imagen real
    badge: "Top Pick",
    badgeColor: "bg-[#05467D]",
    features: [
      "Cámara principal 48MP con Fusion Camera",
      "Grabación 4K a 120fps (ProRes Log)",
      "Botón de Acción personalizable",
      "Pantalla 6.9\" Super Retina XDR",
    ],
  },
  {
    model: "iPhone 16 Pro",
    subtitle: "Potencia profesional en tamaño compacto",
    image: "/iphones/iphone-16-pro.png", // ← SWAP
    badge: null,
    badgeColor: "",
    features: [
      "Chip A18 Pro, el más rápido del mercado",
      "Zoom óptico 5x con teleobjetivo",
      "ProRes 4K a 60fps en Log",
      "Audio espacial avanzado",
    ],
  },
  {
    model: "iPhone 15",
    subtitle: "El mejor ingreso al ecosistema",
    image: "/iphones/iphone-15.png", // ← SWAP
    badge: "Precio / Calidad",
    badgeColor: "bg-amber-500",
    features: [
      "Cámara gran angular 48MP",
      "Dynamic Island",
      "Conector USB-C",
      "Video HDR Dolby Vision",
    ],
  },
  {
    model: "iPhone 14 Pro",
    subtitle: "Potencia al precio justo",
    image: "/iphones/iphone-14-pro.png", // ← SWAP
    badge: null,
    badgeColor: "",
    features: [
      "Cámara 48MP con modo Fotográfico",
      "Always-On Display",
      "Chip A16 Bionic",
      "ProRes Video 4K",
    ],
  },
];

const AUTOPLAY_DELAY = 4500;

export default function IPhoneCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = iPhones.length;

  const goTo = useCallback(
    (index: number, dir: "left" | "right") => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent((index + total) % total);
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating, total]
  );

  const prev = useCallback(() => {
    goTo(current - 1, "left");
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo(current + 1, "right");
  }, [current, goTo]);

  // Autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      goTo(current + 1, "right");
    }, AUTOPLAY_DELAY);
  }, [current, goTo]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [startAutoplay]);

  // Touch / swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  const slide = iPhones[current];

  return (
    <div className="w-full max-w-5xl mx-auto select-none">
      {/* Carrusel principal */}
      <div
        className="relative flex items-center gap-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => {
          if (autoplayRef.current) clearInterval(autoplayRef.current);
        }}
        onMouseLeave={startAutoplay}
      >
        {/* Flecha izquierda */}
        <button
          onClick={prev}
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[#05467D] hover:bg-[#05467D] hover:text-white hover:border-[#05467D] transition-all duration-200 z-10"
          aria-label="iPhone anterior"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Card */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isAnimating
              ? direction === "right"
                ? "-translate-x-4 opacity-0"
                : "translate-x-4 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Imagen */}
              <div className="md:w-2/5 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8 min-h-[240px] md:min-h-[320px] relative">
                {/* Badge */}
                {slide.badge && (
                  <span
                    className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${slide.badgeColor}`}
                  >
                    {slide.badge}
                  </span>
                )}

                {/* Imagen con fallback placeholder */}
                <div className="relative w-[160px] h-[220px] md:w-[180px] md:h-[260px]">
                  <Image
                    src={slide.image}
                    alt={slide.model}
                    fill
                    className="object-contain drop-shadow-xl"
                    onError={(e) => {
                      // Si la imagen no existe, muestra el placeholder
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  {/* Placeholder visible si la imagen falla */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 text-xs text-center gap-2">
                    <div className="w-24 h-36 border-2 border-dashed border-gray-200 rounded-[1.5rem] flex items-center justify-center">
                      <span className="text-[10px] text-gray-300 px-2 text-center leading-tight">
                        Imagen próximamente
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="md:w-3/5 p-6 md:p-10 flex flex-col justify-center text-left">
                <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">
                  {`${current + 1} / ${total}`}
                </p>
                <h4 className="text-2xl md:text-3xl font-bold text-[#05467D] mb-1">
                  {slide.model}
                </h4>
                <p className="text-gray-500 text-base mb-6">{slide.subtitle}</p>

                <ul className="space-y-3 mb-8">
                  {slide.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 text-sm"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                        <Check size={11} className="text-[#05467D]" />
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#05467D] hover:bg-[#043d6b] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors w-fit"
                >
                  Ver {slide.model} →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Flecha derecha */}
        <button
          onClick={next}
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[#05467D] hover:bg-[#05467D] hover:text-white hover:border-[#05467D] transition-all duration-200 z-10"
          aria-label="iPhone siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {iPhones.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "right" : "left")}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2.5 bg-[#05467D]"
                : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-400"
            }`}
            aria-label={`Ir a ${iPhones[i].model}`}
          />
        ))}
      </div>
    </div>
  );
}
