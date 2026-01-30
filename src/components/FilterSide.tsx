"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Función genérica para manejar los cambios de URL
  // key: 'estado', 'modelo', 'memoria'
  // value: 'nuevo', 'iphone-13', '128gb'
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Lógica para permitir múltiples selecciones (separadas por coma)
    // Ejemplo URL: ?modelo=iphone-11,iphone-12&estado=usado
    const currentValues = params.get(key)?.split(",") || [];

    if (currentValues.includes(value)) {
      // Si ya está, lo sacamos (filtro)
      const newValues = currentValues.filter((v) => v !== value);
      if (newValues.length > 0) {
        params.set(key, newValues.join(","));
      } else {
        params.delete(key);
      }
    } else {
      // Si no está, lo agregamos
      currentValues.push(value);
      params.set(key, currentValues.join(","));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Helper para saber si un checkbox debe estar marcado
  const isChecked = (key: string, value: string) => {
    const currentValues = searchParams.get(key)?.split(",") || [];
    return currentValues.includes(value);
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800 h-fit sticky top-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-bold text-xl text-[#05467D] dark:text-white">
          Filtros
        </h2>
        {/* Botón para limpiar todo si hay filtros activos */}
        {searchParams.toString() && (
          <button
            onClick={() => router.push("?", { scroll: false })}
            className="text-xs text-red-500 hover:underline"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* --- SECCIÓN 1: ESTADO --- */}
      <FilterSection title="Condición">
        <FilterOption
          label="Nuevos (Sellados)"
          count={12} // Puedes pasar números reales si el back te los da
          checked={isChecked("estado", "nuevo")}
          onChange={() => handleFilterChange("estado", "nuevo")}
        />
        <FilterOption
          label="Usados "
          count={8}
          checked={isChecked("estado", "usado")}
          onChange={() => handleFilterChange("estado", "usado")}
        />
      </FilterSection>

      <div className="border-t border-gray-100 dark:border-neutral-800 my-4" />

      {/* --- SECCIÓN 2: ALMACENAMIENTO --- */}
      <FilterSection title="Memoria">
        {["64GB", "128GB", "256GB", "512GB"].map((mem) => (
          <FilterOption
            key={mem}
            label={mem}
            checked={isChecked("memoria", mem.toLowerCase())}
            onChange={() => handleFilterChange("memoria", mem.toLowerCase())}
          />
        ))}
      </FilterSection>

      <div className="border-t border-gray-100 dark:border-neutral-800 my-4" />

      {/* --- SECCIÓN 3: MODELO (Ejemplo) --- */}
      <FilterSection title="Modelo">
        {["iPhone 15 Pro", "iPhone 14", "iPhone 13", "iPhone 11"].map(
          (model) => (
            <FilterOption
              key={model}
              label={model}
              checked={isChecked(
                "modelo",
                model.replace(/ /g, "-").toLowerCase()
              )} // iphone-13
              onChange={() =>
                handleFilterChange(
                  "modelo",
                  model.replace(/ /g, "-").toLowerCase()
                )
              }
            />
          )
        )}
      </FilterSection>

      {/* --- SECCIÓN 4: PRECIO (Input simple) --- */}
      <div className="mt-6">
        <h3 className="font-bold text-sm mb-3 dark:text-gray-200">
          Rango de Precio
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
    </aside>
  );
}

// --- COMPONENTES AUXILIARES PARA NO REPETIR CÓDIGO ---

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-sm mb-1 dark:text-gray-200">{title}</h3>
      {children}
    </div>
  );
}

function FilterOption({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-1">
      <div className="flex items-center gap-3">
        {/* Contenedor del Checkbox Personalizado */}
        <div className="relative flex items-center justify-center w-5 h-5">
          <input
            type="checkbox"
            className="
                            peer appearance-none w-5 h-5 border-2 border-gray-300 rounded 
                            checked:bg-[#05467D] checked:border-[#05467D] 
                            transition-all cursor-pointer
                        "
            checked={checked}
            onChange={onChange}
          />

          {/* El tick (tilde) SVG blanco que aparece solo cuando está checked */}
          <svg
            className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2 5 5 9 10 3" />
          </svg>
        </div>

        <span
          className={`text-sm ${
            checked
              ? "font-medium text-[#05467D]"
              : "text-gray-600 dark:text-gray-400"
          } group-hover:text-[#05467D] transition-colors`}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </label>
  );
}
