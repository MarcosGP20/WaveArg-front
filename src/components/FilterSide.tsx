"use client";

import { useRouter, useSearchParams } from "next/navigation";

/** "iphones"  → muestra Precio + Condición + Memoria + Modelo  (página /products)
 *  "accesorios" → muestra Precio + Condición                   (página /accesorios) */
type FilterMode = "iphones" | "accesorios";

interface FilterSidebarProps {
  mode?: FilterMode;
  priceRange?: { min: number; max: number };
  /** Cuando se renderiza dentro de un bottom sheet, omite el card wrapper */
  flat?: boolean;
}

export default function FilterSidebar({
  mode = "iphones",
  priceRange,
  flat = false,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(",").filter(Boolean) ?? [];

    if (current.includes(value)) {
      const next = current.filter((v) => v !== value);
      next.length > 0 ? params.set(key, next.join(",")) : params.delete(key);
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
    isDefault ? params.delete(key) : params.set(key, String(val));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const content = (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-bold text-xl text-color-principal dark:text-white">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={() => router.push("?", { scroll: false })}
            className="text-xs text-red-500 hover:underline"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Precio */}
      {priceRange && currentPrecioMin !== null && currentPrecioMax !== null && (
        <>
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
          <div className="border-t border-gray-100 dark:border-neutral-800 my-4" />
        </>
      )}

      {/* Condición — aplica a ambos modos */}
      <FilterSection title="Condición">
        <FilterOption
          label="Nuevo (sellado)"
          checked={isChecked("estado", "nuevo")}
          onChange={() => handleFilterChange("estado", "nuevo")}
        />
        <FilterOption
          label="Usado"
          checked={isChecked("estado", "usado")}
          onChange={() => handleFilterChange("estado", "usado")}
        />
      </FilterSection>

      {/* Memoria y Modelo — solo para iPhones */}
      {mode === "iphones" && (
        <>
          <div className="border-t border-gray-100 dark:border-neutral-800 my-4" />

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

          <FilterSection title="Modelo">
            {["iPhone 16", "iPhone 15 Pro", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 11"].map(
              (model) => (
                <FilterOption
                  key={model}
                  label={model}
                  checked={isChecked("modelo", model.replace(/ /g, "-").toLowerCase())}
                  onChange={() =>
                    handleFilterChange("modelo", model.replace(/ /g, "-").toLowerCase())
                  }
                />
              )
            )}
          </FilterSection>
        </>
      )}
    </>
  );

  if (flat) return <div>{content}</div>;

  return (
    <aside className="w-full bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800 h-fit sticky top-4">
      {content}
    </aside>
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
      <div className="flex justify-between text-xs font-medium text-gray-600 mb-4">
        <span>${low.toLocaleString("es-AR")}</span>
        <span>${high.toLocaleString("es-AR")}</span>
      </div>

      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-1.5 bg-gray-200 rounded-full" />
        {/* Active fill */}
        <div
          className="absolute h-1.5 bg-color-principal rounded-full"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />

        {/* Min input — invisible but interactive */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => onChangeLow(Math.min(Number(e.target.value), high - step))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: lowPct > 90 ? 5 : 3 }}
        />
        {/* Max input — invisible but interactive */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => onChangeHigh(Math.max(Number(e.target.value), low + step))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />

        {/* Visual thumb — min */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-color-principal shadow pointer-events-none"
          style={{ left: `${lowPct}%` }}
        />
        {/* Visual thumb — max */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-color-principal shadow pointer-events-none"
          style={{ left: `${highPct}%` }}
        />
      </div>
    </div>
  );
}

// ─── FilterSection ────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-sm mb-1 dark:text-gray-200">{title}</h3>
      {children}
    </div>
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
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
        <input
          type="checkbox"
          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-color-principal checked:border-color-principal transition-all cursor-pointer"
          checked={checked}
          onChange={onChange}
        />
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
          checked ? "font-medium text-color-principal" : "text-gray-600 dark:text-gray-400"
        } group-hover:text-color-principal transition-colors`}
      >
        {label}
      </span>
    </label>
  );
}
