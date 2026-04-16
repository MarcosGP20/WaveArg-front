"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Mic, Lightbulb, Sparkles, ArrowUpRight } from "lucide-react";

// Colores de marca
const BRAND = "#05467D";
const CARD_BG = "#064f91";       // tono ligeramente más claro del principal
const CARD_BG_ALT = "#053d70";   // tono ligeramente más oscuro para variedad

// ─── Spotlight Card ────────────────────────────────────────────────────────────

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  bg?: string;
}

function SpotlightCard({ children, className = "", bg = CARD_BG }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  const handleMouseLeave = () => setPos((p) => ({ ...p, visible: false }));

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        backgroundColor: bg,
        boxShadow: pos.visible
          ? "0 0 0 1px rgba(255,255,255,0.25)"
          : "0 0 0 1px rgba(255,255,255,0.08)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Spotlight overlay */}
      {pos.visible && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.1) 0%, transparent 55%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

// ─── Bento Creadores ───────────────────────────────────────────────────────────

export default function BentoCreadores() {
  return (
    <section style={{ backgroundColor: BRAND }} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/40 mb-3">
          Creadores de contenido
        </p>
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-12">
          Tu próximo setup, en un solo lugar
        </h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">

          {/* Card 1 — CTA principal (2 cols) */}
          <SpotlightCard className="md:col-span-2 min-h-[220px]" bg={CARD_BG}>
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-4">
                  <Sparkles size={11} strokeWidth={2} />
                  Guía completa
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-3">
                  Todo lo que necesitás para<br className="hidden md:block" /> crear contenido de calidad
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                  iPhone, Mac, accesorios y tips reales de creadores que usan estos equipos todos los días.
                </p>
              </div>
              <Link
                href="/creadores"
                className="mt-6 self-start inline-flex items-center gap-2 bg-white text-[#05467D] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors"
              >
                Ver la guía
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 2 — iPhone (1 col, 2 rows) */}
          <SpotlightCard className="md:row-span-2 min-h-[280px] flex flex-col" bg={CARD_BG_ALT}>
            <div className="flex-1 flex flex-col p-8">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-4">
                iPhone 16 Pro
              </span>
              <h3 className="text-xl font-bold text-white leading-snug mb-2">
                La cámara que redefine el contenido
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                4K 120fps · ProRes · Audio espacial · Chip A18 Pro
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-white/80 text-sm font-semibold hover:text-white transition-colors mt-auto"
              >
                Ver modelos <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
            {/* Imagen decorativa */}
            <div className="mx-8 mb-8 rounded-xl overflow-hidden">
              <img
                src="/iphone-div-landing.jpg"
                alt="iPhone para creadores"
                className="w-full h-40 object-cover object-top opacity-60"
              />
            </div>
          </SpotlightCard>

          {/* Card 3 — Accesorios */}
          <SpotlightCard className="min-h-[180px]" bg={CARD_BG_ALT}>
            <div className="p-8 h-full flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Mic size={18} className="text-white" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Accesorios para creadores
                </h3>
                <p className="text-white/50 text-sm">
                  Trípodes, micrófonos, cargadores y más.
                </p>
              </div>
              <Link
                href="/accesorios"
                className="mt-4 inline-flex items-center gap-1 text-white/70 text-sm font-semibold hover:text-white transition-colors"
              >
                Ver accesorios <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 4 — Asesoría */}
          <SpotlightCard className="min-h-[180px]" bg={CARD_BG}>
            <div className="p-8 h-full flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Lightbulb size={18} className="text-white" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Asesoría personalizada
                </h3>
                <p className="text-white/50 text-sm">
                  Te ayudamos a armar tu setup ideal sin gastar de más.
                </p>
              </div>
              <Link
                href="/contacto"
                className="mt-4 inline-flex items-center gap-1 text-white/70 text-sm font-semibold hover:text-white transition-colors"
              >
                Contactarnos <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
            </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}
