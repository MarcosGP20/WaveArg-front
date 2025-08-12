"use client";

import { useCompare } from "@/context/CompareContext";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";

type Spec = { label: string; value: string };
type Producto = {
  id: number | string;
  nombre: string;
  precio: number;
  color: string;
  memoria: string;
  image: string;
  specs: Spec[];
};

export default function ComparePage() {
  const { compareList, clearCompare, setModoComparacion } = useCompare();
  const router = useRouter();

  // Hooks SIEMPRE arriba (orden estable)
  const [showToast, setShowToast] = useState(false);
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setModoComparacion(false);
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, [setModoComparacion]);

  // Etiquetas de specs que vienen en p.specs
  const specsLabels = ["Pantalla", "Cámara", "Chip", "Batería", "Resistencia"];

  const getValue = (p: Producto, label: string): string => {
    switch (label) {
      case "Modelo":
        return p.nombre;
      case "Precio":
        return `$${Number(p.precio).toLocaleString()}`;
      case "Color":
        return p.color;
      case "Memoria":
        return p.memoria;
      default:
        return p.specs.find((s) => s.label === label)?.value ?? "-";
    }
  };

  const rowLabels: string[] = useMemo(
    () => ["Modelo", "Precio", "Color", "Memoria", ...specsLabels],
    []
  );

  // Resaltar diferencias (lo calculamos siempre, aunque sea innecesario en empty state,
  // para mantener el orden de hooks)
  const rowsDiffMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const label of rowLabels) {
      const set = new Set(
        compareList.map((p) =>
          getValue(p as Producto, label)
            .trim()
            .toLowerCase()
        )
      );
      map.set(label, set.size > 1);
    }
    return map;
  }, [compareList, rowLabels]);

  const handleClearAndRedirect = () => {
    clearCompare();
    setShowToast(true);
    // mini delay para que se vea el toast, pero casi instantáneo
    redirectTimer.current = setTimeout(() => {
      router.push("/products");
    }, 200);
  };

  // Empty state (ya no rompe hooks porque TODOS los hooks se ejecutaron antes)
  if (compareList.length < 2) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Comparar modelos</h1>
        <p className="text-gray-500">
          Seleccioná al menos 2 productos para comparar.
        </p>
        <Toast
          message="Comparación vaciada"
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 pb-28 md:pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Comparar modelos</h1>

      {/* MOBILE: Cards swipeables */}
      <section
        className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-4 px-1 pb-2"
        style={{ scrollPadding: "1rem" }}
        aria-label="Comparación en formato móvil"
      >
        {compareList.map((p: any) => (
          <article
            key={p.id}
            className="min-w-[88%] snap-center bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-4"
          >
            <header className="flex items-center gap-3 mb-3">
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src={p.image}
                  alt={p.nombre}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-tight truncate">
                  {p.nombre}
                </h2>
                <p className="text-sm font-bold text-[#0F3C64]">
                  ${Number(p.precio).toLocaleString()}
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-neutral-800">
              {rowLabels
                .filter((l) => l !== "Modelo")
                .map((label) => (
                  <div key={label} className="py-2 flex items-start gap-3">
                    <span className="w-28 shrink-0 text-xs text-neutral-500">
                      {label}
                    </span>
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">
                      {getValue(p, label)}
                    </span>
                  </div>
                ))}
            </div>
          </article>
        ))}
      </section>

      {/* DESKTOP/TABLET: Tabla con primera columna sticky + resaltar diferencias */}
      <section className="hidden md:block">
        <div className="overflow-x-auto rounded-xl shadow-sm ring-1 ring-black/5">
          <table
            role="table"
            className="min-w-[860px] w-full bg-white dark:bg-neutral-900"
          >
            <thead>
              <tr className="border-b">
                <th className="sticky left-0 z-20 bg-white dark:bg-neutral-900 w-44" />
                {compareList.map((p: any) => (
                  <th
                    key={p.id}
                    scope="col"
                    className="text-center px-6 py-5 font-semibold text-lg text-gray-800 dark:text-gray-100 align-middle"
                  >
                    <div className="mx-auto h-24 w-full relative mb-2">
                      <img
                        src={p.image}
                        alt={p.nombre}
                        className="h-24 mx-auto object-contain"
                      />
                    </div>
                    <div className="truncate">{p.nombre}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rowLabels.map((label, idx) => (
                <tr
                  key={label}
                  className={
                    idx % 2 === 1 ? "bg-gray-50/70 dark:bg-neutral-800/60" : ""
                  }
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-white dark:bg-neutral-900 border-r font-medium text-right pr-4 py-4 w-44 align-middle text-sm text-gray-700 dark:text-gray-300"
                  >
                    {label}
                  </th>

                  {compareList.map((p: any) => {
                    const value = getValue(p, label);
                    const isDiff = rowsDiffMap.get(label);
                    return (
                      <td
                        key={`${p.id}-${label}`}
                        className={`text-center py-4 px-4 align-middle border-l last:border-r text-sm text-gray-800 dark:text-gray-100
                          ${isDiff ? "bg-blue-50/60 dark:bg-blue-950/30" : ""}
                        `}
                      >
                        {label === "Precio" ? (
                          <span className="text-[#05467D] font-bold">
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Acciones */}
      <div className="text-center mt-8">
        <button
          onClick={handleClearAndRedirect}
          aria-label="Limpiar comparación"
          className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition text-base shadow-sm"
        >
          <Trash2 size={18} />
          Limpiar comparación
        </button>
      </div>

      {/* Toast */}
      <Toast
        message="Comparación vaciada"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
