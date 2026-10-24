"use client";
import { m } from "framer-motion";
import Image from "next/image";

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

function TickerTrack() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-8 shrink-0">
          <Image
            src="/iso3.svg"
            alt="Wave"
            width={18}
            height={18}
            style={{ filter: "brightness(0) invert(1)", opacity: 0.5 }}
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 whitespace-nowrap">
            {item}
          </span>
        </span>
      ))}
    </>
  );
}

export default function Ticker() {
  return (
    <div className="bg-[#05467D] py-5 overflow-hidden select-none">
      <m.div
        className="flex gap-8 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        <TickerTrack />
        <TickerTrack />
      </m.div>
    </div>
  );
}
