"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type DropdownItemProps = {
  title: string;
  href: string;
  children: React.ReactNode;
  transparent?: boolean;
};

// Menú desplegable de la NavBar (ej. Productos). El contenido son links de navegación, no un
// menú de acciones, así que sigue el patrón "disclosure" de la APG (front#10): el botón tiene
// aria-expanded y aria-controls (aria-haspopup anunciaría un role="menu" que no hay), y el
// panel cierra con Escape (el foco vuelve al botón) y con un click afuera.
const DropdownItem: React.FC<DropdownItemProps> = ({ title, href, children, transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const raizRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();
  const DELAY_MS = 200;

  const isActive = pathname === href || pathname.startsWith(href + "/");

  const open = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(true), DELAY_MS);
  };

  const scheduleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(false), DELAY_MS);
  };

  useEffect(() => {
    if (!isOpen) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      botonRef.current?.focus();
    };
    const alClickear = (e: PointerEvent) => {
      if (!raizRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("pointerdown", alClickear);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("pointerdown", alClickear);
    };
  }, [isOpen]);

  // Navegar con un link del panel lo cierra.
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <div ref={raizRef} onMouseEnter={open} onMouseLeave={scheduleClose}>
      <div className="flex items-center">
        <Link
          href={href}
          className={`px-3 py-2 rounded-full transition-colors duration-200 ${
            transparent
              ? "text-white hover:bg-white/15"
              : "text-color-principal hover:bg-gray-200"
          } ${isActive ? "font-bold" : ""}`}
        >
          {title}
        </Link>
        <button
          ref={botonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={`Más opciones de ${title}`}
          className={`p-1.5 rounded-full transition-colors duration-200 ${
            transparent
              ? "text-white hover:bg-white/15"
              : "text-color-principal hover:bg-gray-200"
          }`}
        >
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        id={panelId}
        hidden={!isOpen}
        className="absolute inset-x-0 top-full w-screen z-30 bg-white shadow-xl border-b"
        onMouseEnter={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
        }}
        onMouseLeave={scheduleClose}
      >
        <div className="mx-auto flex flex-col p-4">{children}</div>
      </div>
    </div>
  );
};

export default DropdownItem;
