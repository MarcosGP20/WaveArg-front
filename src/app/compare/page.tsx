"use client";

import { useCompare } from "@/context/CompareContext";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";

type Spec = {
  label: string;
  value: string;
};

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  color: string;
  memoria: string;
  image: string;
  specs: Spec[];
};

export default function ComparePage() {
  const { compareList, clearCompare, setModoComparacion } = useCompare();

  useEffect(() => {
    setModoComparacion(false);
  }, [setModoComparacion]);

  if (compareList.length < 2) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Comparar modelos</h1>
        <p className="text-gray-500">
          Seleccioná al menos 2 productos para comparar.
        </p>
      </div>
    );
  }

  const specsLabels = ["Pantalla", "Cámara", "Chip", "Batería", "Resistencia"];

  const rows: { label: string; render: (p: Producto) => React.ReactNode }[] = [
    {
      label: "Modelo",
      render: (p) => (
        <span className="font-semibold text-base">{p.nombre}</span>
      ),
    },
    {
      label: "Precio",
      render: (p) => (
        <span className="text-[#05467D] font-bold text-base">
          ${p.precio.toLocaleString()}
        </span>
      ),
    },
    {
      label: "Color",
      render: (p) => <span className="capitalize text-base">{p.color}</span>,
    },
    {
      label: "Memoria",
      render: (p) => <span className="text-base">{p.memoria}</span>,
    },
    ...specsLabels.map((label) => ({
      label,
      render: (p) => (
        <span className="text-base">
          {p.specs.find((s) => s.label === label)?.value || "-"}
        </span>
      ),
    })),
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Comparar modelos</h1>

      <div className="overflow-x-auto scroll-smooth snap-x">
        <table
          role="table"
          className="min-w-[900px] w-full border rounded-xl shadow bg-white dark:bg-neutral-900"
        >
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-white dark:bg-neutral-900 w-40"></th>
              {compareList.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="text-center px-6 py-4 border-b font-semibold text-lg text-gray-800 dark:text-gray-100 snap-center"
                >
                  <img
                    src={p.image}
                    alt={p.nombre}
                    className="h-24 mx-auto object-contain mb-2"
                  />
                  <div>{p.nombre}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.label}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50 dark:bg-neutral-800" : ""
                }`}
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white dark:bg-neutral-900 border-r font-medium text-right pr-4 py-4 w-40 align-middle text-sm text-gray-700 dark:text-gray-300"
                >
                  {row.label}
                </th>
                {compareList.map((p) => (
                  <td
                    key={`${p.id}-${row.label.replace(/\s+/g, "-")}`}
                    className="text-center py-4 px-4 align-middle border-b border-l last:border-r text-sm text-gray-800 dark:text-gray-100 snap-center"
                  >
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={clearCompare}
          aria-label="Limpiar comparación"
          className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded hover:bg-red-700 transition text-base"
        >
          <Trash2 size={18} />
          Limpiar comparación
        </button>
      </div>
    </div>
  );
}
