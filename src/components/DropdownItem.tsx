"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type DropdownItemProps = {
  title: string;
  href: string;
  children: React.ReactNode;
};

const DropdownItem: React.FC<DropdownItemProps> = ({ title, href, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  return (
    <div onMouseEnter={open} onMouseLeave={scheduleClose}>
      <div className="flex items-center">
        <Link
          href={href}
          className={`px-3 py-2 rounded-full hover:bg-gray-200 transition text-color-principal ${
            isActive ? "font-bold" : ""
          }`}
        >
          {title}
        </Link>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Cerrar" : "Abrir"} menú de ${title}`}
          className="p-1 rounded-full hover:bg-gray-200 transition text-color-principal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-principal focus-visible:ring-offset-1"
        >
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute inset-x-0 top-full w-screen z-30 bg-white shadow-xl border-b"
          onMouseEnter={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
          }}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto flex flex-col p-4">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DropdownItem;
