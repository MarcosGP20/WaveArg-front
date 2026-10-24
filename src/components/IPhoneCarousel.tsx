"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";

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

  // Autoplay (front#15): corre solo si el usuario no lo pausó, no hay mouse ni foco adentro y
  // no pidió reducir movimiento.
  const reducido = useReducedMotion();
  const [pausadoPorUsuario, setPausadoPorUsuario] = useState(false);
  const [suspendido, setSuspendido] = useState(false);

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

  const autoplayActivo = total > 1 && !reducido && !pausadoPorUsuario && !suspendido;

  useEffect(() => {
    if (!autoplayActivo) return;
    const timeout = setTimeout(next, AUTOPLAY_DELAY);
    return () => clearTimeout(timeout);
  }, [autoplayActivo, next]);

  if (total === 0) return null;

  const slide = items[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <section
      className="w-full select-none"
      aria-roledescription="carrusel"
      aria-label="iPhones destacados"
      onMouseEnter={() => setSuspendido(true)}
      onMouseLeave={() => setSuspendido(false)}
      onFocus={() => setSuspendido(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSuspendido(false);
      }}
    >
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} de ${total}: ${slide.model}`}
        aria-live={autoplayActivo ? "off" : "polite"}
        className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[450px] md:min-h-[550px]"
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
            <m.div
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
                    <span className="text-gray-500 text-sm font-medium">Imagen próximamente</span>
                  </div>
                )}
              </div>
            </m.div>
          </AnimatePresence>
        </div>

        {/* ── Panel de Contenido ── */}
        <div className="md:w-[55%] flex flex-col justify-center px-8 py-10 md:px-16 md:py-16">
          <AnimatePresence mode="wait">
            <m.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
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
            </m.div>
          </AnimatePresence>
        </div>

        {/* ── Flechas de Navegación ── */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="iPhone anterior"
              className="absolute left-4 top-[172px] md:top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-[#05467D] hover:bg-white transition-all z-20"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="iPhone siguiente"
              className="absolute right-4 top-[172px] md:top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-[#05467D] hover:bg-white transition-all z-20"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Pausa + indicadores ── */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {!reducido && (
            <button
              type="button"
              onClick={() => setPausadoPorUsuario((p) => !p)}
              aria-label={pausadoPorUsuario ? "Reanudar el carrusel" : "Pausar el carrusel"}
              className="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-[#05467D] hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#05467D]"
            >
              {pausadoPorUsuario ? <Play size={16} strokeWidth={1.75} /> : <Pause size={16} strokeWidth={1.75} />}
            </button>
          )}
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              aria-current={i === current ? "true" : undefined}
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
    </section>
  );
}
