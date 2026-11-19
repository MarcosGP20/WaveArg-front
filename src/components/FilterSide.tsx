"use client";

import { useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatearPrecio } from "@/lib/precio";

/** "iphones"  → muestra Precio + Condición + Capacidad + Modelo  (página /products)
 *  "accesorios" → muestra Precio + Condición                     (página /accesorios) */
type FilterMode = "iphones" | "accesorios";

type Opcion = { valor: string; texto: string };

interface FilterSidebarProps {
  mode?: FilterMode;
  priceRange?: { min: number; max: number };
  /** Capacidades y modelos que hay en stock (lib/catalogo.ts): las opciones no se escriben a mano. */
  memorias?: Opcion[];
  modelos?: Opcion[];
  /** Cuando se renderiza dentro de un bottom sheet, omite el card wrapper */
  flat?: boolean;
}

export default function FilterSidebar({
  mode = "iphones",
  priceRange,
  memorias = [],
  modelos = [],
  flat = false,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tituloId = useId();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(",").filter(Boolean) ?? [];

    if (current.includes(value)) {
      const next = current.filter((v) => v !== value);
      if (next.length > 0) params.set(key, next.join(","));
      else params.delete(key);
    } else {
      params.set(key, [...current, value].join(","));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isChecked = (key: string, value: string) =>
    (searchParams.get(key)?.split(",") ?? []).includes(value);

  const hasActiveFilters = searchParams.toString() !== "";

  // Precio
  const currentPrecioMin = priceRange
    ? Number(searchParams.get("precioMin") ?? priceRange.min)
    : null;
  const currentPrecioMax = priceRange
    ? Number(searchParams.get("precioMax") ?? priceRange.max)
    : null;

  const handlePriceChange = (key: "precioMin" | "precioMax", val: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const isDefault =
      (key === "precioMin" && val === priceRange!.min) ||
      (key === "precioMax" && val === priceRange!.max);
    if (isDefault) params.delete(key);
    else params.set(key, String(val));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 id={tituloId} className="heading-6 text-tinta">Filtros</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => router.push("?", { scroll: false })}
            className="py-2 caption-1 text-color-principal underline underline-offset-4 hover:text-color-principal-oscuro"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Precio: sólo si hay un rango para elegir */}
      {priceRange && priceRange.max > priceRange.min && currentPrecioMin !== null && currentPrecioMax !== null && (
        <FilterSection title="Precio">
          <PriceRangeSlider
            min={priceRange.min}
            max={priceRange.max}
            low={currentPrecioMin}
            high={currentPrecioMax}
            onChangeLow={(v) => handlePriceChange("precioMin", v)}
            onChangeHigh={(v) => handlePriceChange("precioMax", v)}
          />
        </FilterSection>
      )}

      {/* Condición — aplica a ambos modos */}
      <FilterSection title="Condición">
        <FilterOption
          label="Nuevo sellado"
          checked={isChecked("estado", "nuevo")}
          onChange={() => handleFilterChange("estado", "nuevo")}
        />
        <FilterOption
          label="Usado"
          checked={isChecked("estado", "usado")}
          onChange={() => handleFilterChange("estado", "usado")}
        />
      </FilterSection>

      {/* Capacidad y Modelo — solo para iPhones */}
      {mode === "iphones" && memorias.length > 1 && (
        <FilterSection title="Capacidad">
          {memorias.map(({ valor, texto }) => (
            <FilterOption
              key={valor}
              label={texto}
              checked={isChecked("memoria", valor)}
              onChange={() => handleFilterChange("memoria", valor)}
            />
          ))}
        </FilterSection>
      )}

      {mode === "iphones" && modelos.length > 1 && (
        <FilterSection title="Modelo">
          {modelos.map(({ valor, texto }) => (
            <FilterOption
              key={valor}
              label={texto}
              checked={isChecked("modelo", valor)}
              onChange={() => handleFilterChange("modelo", valor)}
            />
          ))}
        </FilterSection>
      )}
    </div>
  );

  if (flat) return content;

  return (
    <section
      aria-labelledby={tituloId}
      // top-20: debajo de la barra de navegación, que es sticky y mide 64px.
      className="sticky top-20 h-fit w-full rounded-panel border border-borde bg-white p-6"
    >
      {content}
    </section>
  );
}

// ─── PriceRangeSlider ─────────────────────────────────────────────────────────

function PriceRangeSlider({
  min,
  max,
  low,
  high,
  onChangeLow,
  onChangeHigh,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  onChangeLow: (v: number) => void;
  onChangeHigh: (v: number) => void;
}) {
  const range = max - min || 1;
  const lowPct = ((low - min) / range) * 100;
  const highPct = ((high - min) / range) * 100;
  const step = Math.max(1000, Math.round((max - min) / 100 / 1000) * 1000);

  return (
    <div className="pt-1">
      <div className="mb-4 flex justify-between caption-1 tabular-nums text-tinta" aria-hidden="true">
        <span>{formatearPrecio(low)}</span>
        <span>{formatearPrecio(high)}</span>
      </div>

      <div className="relative flex h-6 items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-borde" />
        {/* Active fill */}
        <div
          className="absolute h-1.5 rounded-full bg-color-principal"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />

        {/* Min input — invisible pero interactivo. Nombre y valor legibles para el lector; el foco
            se muestra en el thumb visual (peer-focus-visible), porque el input es transparente. */}
        <input
          type="range"
          aria-label="Precio mínimo"
          aria-valuetext={formatearPrecio(low)}
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => onChangeLow(Math.min(Number(e.target.value), high - step))}
          className="peer/min absolute inset-0 h-full w-full cursor-pointer opacity-0"
          style={{ zIndex: lowPct > 90 ? 5 : 3 }}
        />
        {/* Max input — invisible pero interactivo */}
        <input
          type="range"
          aria-label="Precio máximo"
          aria-valuetext={formatearPrecio(high)}
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => onChangeHigh(Math.max(Number(e.target.value), low + step))}
          className="peer/max absolute inset-0 h-full w-full cursor-pointer opacity-0"
          style={{ zIndex: 4 }}
        />

        {/* Visual thumb — min */}
        <div
          className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-color-principal bg-white peer-focus-visible/min:ring-2 peer-focus-visible/min:ring-[#2563eb] peer-focus-visible/min:ring-offset-2"
          style={{ left: `${lowPct}%` }}
        />
        {/* Visual thumb — max */}
        <div
          className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-color-principal bg-white peer-focus-visible/max:ring-2 peer-focus-visible/max:ring-[#2563eb] peer-focus-visible/max:ring-offset-2"
          style={{ left: `${highPct}%` }}
        />
      </div>
    </div>
  );
}

// ─── FilterSection ────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col">
      <legend className="mb-2 body-4 text-tinta">{title}</legend>
      {children}
    </fieldset>
  );
}

// ─── FilterOption ─────────────────────────────────────────────────────────────

function FilterOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-center gap-3">
      <span className="relative flex size-5 flex-shrink-0 items-center justify-center">
        <input
          type="checkbox"
          className="peer size-5 cursor-pointer appearance-none rounded border-2 border-tinta-suave transition-colors duration-300 checked:border-color-principal checked:bg-color-principal"
          checked={checked}
          onChange={onChange}
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute size-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="2 5 5 9 10 3" />
        </svg>
      </span>
      <span className={`body-6 transition-colors duration-300 group-hover:text-tinta ${checked ? "font-medium text-tinta" : "text-tinta-suave"}`}>
        {label}
      </span>
    </label>
  );
}
