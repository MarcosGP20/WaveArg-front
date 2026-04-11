"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface CarouselItem {
  id?: string | number;
  model: string;
  description: string;
  image: string;
  badge?: string | null;
  specs: { icon: string; label: string }[];
  href?: string;
}

const AUTOPLAY_DELAY = 5000;

interface IPhoneCarouselProps {
  items: CarouselItem[]; // Obligatorio ahora para evitar mock data interna
}

export default function IPhoneCarousel({ items = [] }: IPhoneCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [imageError, setImageError] = useState(false); // Control de placeholder

  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const total = items.length;

  // Resetear el error de imagen cada vez que cambia el slide
  useEffect(() => {
    setImageError(false);
  }, [current]);

  const goTo = useCallback(
    (index: number, dir: 1 | -1) => {
      if (isAnimatingRef.current || total === 0) return;
      isAnimatingRef.current = true;
      setDirection(dir);
      setCurrent(((index % total) + total) % total);
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 480);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  const startAutoplay = useCallback(() => {
    if (total <= 1) return;
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      next();
    }, AUTOPLAY_DELAY);
  }, [total, next]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [startAutoplay]);

  if (total === 0) return null;

  const slide = items[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <div className="w-full select-none">
      <div
        className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[450px] md:min-h-[550px]"
        onMouseEnter={() =>
          autoplayRef.current && clearInterval(autoplayRef.current)
        }
        onMouseLeave={startAutoplay}
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (!touchStartX.current) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
          touchStartX.current = null;
        }}
      >
        {/* ── Panel de Imagen: Ahora con más aire y protagonismo ── */}
        <div className="relative md:w-[45%] bg-[#F8F9FA] flex items-center justify-center p-8 md:p-12">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "circOut" }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {slide.badge && (
                <span className="absolute top-0 left-0 bg-[#E1EFFE] text-[#05467D] text-xs font-bold px-4 py-1.5 rounded-full shadow-sm z-10">
                  {slide.badge}
                </span>
              )}

              {/* Contenedor de imagen dinámico */}
              <div className="relative w-full h-[280px] md:h-[400px] transition-transform duration-500 hover:scale-105">
                {!imageError ? (
                  <Image
                    src={slide.image}
                    alt={slide.model}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  /* Placeholder estilizado */
                  <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <span className="text-gray-400 text-sm font-medium">Imagen próximamente</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Panel de Contenido ── */}
        <div className="md:w-[55%] flex flex-col justify-center px-8 py-10 md:px-16 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                {current + 1} / {total}
              </p>

              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">
                {slide.model}
              </h3>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {slide.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-100 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl"
                  >
                    <span>{spec.icon}</span>
                    {spec.label}
                  </div>
                ))}
              </div>

              <Link
                href={slide.href ?? `/products/${slide.id || ""}`}
                className="inline-flex items-center gap-3 bg-[#05467D] hover:bg-[#032d52] text-white font-bold text-base px-10 py-4 rounded-2xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all active:scale-95"
              >
                Ver más
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 7h12M8 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Flechas de Navegación ── */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="iPhone anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-[#05467D] hover:bg-white transition-all z-20"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="iPhone siguiente"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-[#05467D] hover:bg-white transition-all z-20"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Indicadores ── */}
      {total > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((item, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Ir a ${item.model}`}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2.5 bg-[#05467D]"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
