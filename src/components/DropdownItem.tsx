import React, { useState, useRef } from "react";

type DropdownItemProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

const DropdownItem: React.FC<DropdownItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Un valor para que la experiencia sea fluida
  const DELAY_MS = 200;

  const handleMouseEnter = () => {
    // 1. Limpiar el temporizador actual (por si está a punto de cerrarse)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 2. Abrir con retraso (para evitar el "roce accidental")
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, DELAY_MS);
  };

  const handleMouseLeave = () => {
    // 1. Limpiar el temporizador de apertura (por si el mouse se fue antes de abrir)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 2. CERRAR CON RETRASO (ESTA ES LA CLAVE).
    // Esto le da al cursor 200ms para saltar la brecha y entrar al menú.
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, DELAY_MS);
  };

  return (
    <div
      className=""
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer ">{title}</div>

      {isOpen && (
        // 1. SIN 'p-4' AQUÍ
        <div className="absolute inset-x-0 top-full w-screen z-30 bg-white shadow-xl border-b">
          {/* 2. 'p-4' VA AQUÍ (y saqué 'gap-6') */}
          <div className=" mx-auto flex flex-col p-4">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DropdownItem;
