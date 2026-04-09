"use client";

import { useRouter, useSearchParams } from "next/navigation";

/** "iphones"  → muestra Condición + Memoria + Modelo  (página /products)
 *  "accesorios" → muestra solo Condición               (página /accesorios) */
type FilterMode = "iphones" | "accesorios";

export default function FilterSidebar({ mode = "iphones" }: { mode?: FilterMode }) {
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

  return (
    <aside className="w-full bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800 h-fit sticky top-4">
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
    </aside>
  );
}

// ─── componentes auxiliares ───────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-sm mb-1 dark:text-gray-200">{title}</h3>
      {children}
    </div>
  );
}

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
