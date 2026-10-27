"use client";
import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

const ITEMS = [
  "Los modelos más vendidos",
  "Envíos a todo el país",
  "Plan canje disponible",
  "Garantía incluida",
  "iPhones originales Apple",
  "Reacondicionados certificados",
  "Pagá con MercadoPago",
  "Stock permanente",
];

function TickerTrack({ oculto = false }: { oculto?: boolean }) {
  return (
    <div className="flex gap-8 pr-8 shrink-0" aria-hidden={oculto || undefined}>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-8 shrink-0">
          <Image
            src="/iso3.svg"
            alt=""
            width={18}
            height={18}
            style={{ filter: "brightness(0) invert(1)", opacity: 0.5 }}
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 whitespace-nowrap">
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

// Marquee de la home (front#15), en CSS (.animate-marquee en globals.css): se puede pausar y,
// con prefers-reduced-motion, queda quieto y sin botón. La segunda copia de la lista solo
// existe para el loop visual, así que se oculta a lectores de pantalla.
export default function Ticker() {
  const [pausado, setPausado] = useState(false);

  return (
    <div className="relative bg-[#05467D] py-5 overflow-hidden select-none">
      <div className="flex w-max animate-marquee" data-pausado={pausado}>
        <TickerTrack />
        <TickerTrack oculto />
      </div>
      <button
        type="button"
        onClick={() => setPausado((p) => !p)}
        aria-label={pausado ? "Reanudar cinta de novedades" : "Pausar cinta de novedades"}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#05467D] text-white/80 ring-1 ring-white/30 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:hidden"
      >
        {pausado ? <Play size={14} strokeWidth={1.75} /> : <Pause size={14} strokeWidth={1.75} />}
      </button>
    </div>
  );
}
