"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCompare } from "@/context/CompareContext";
import { Producto, Variante } from "@/lib/api";

type ProductCardProps = {
  product: Producto;
  className?: string;
};

const MAX_COMPARE = 3;

function mapColorToHex(color: string): string {
  const map: Record<string, string> = {
    Negro: "#1a1a1a",
    Blanco: "#f5f5f7",
    Azul: "#1e40af",
    "Azul Oscuro": "#1e3a5f",
    Rojo: "#be1b1b",
    Medianoche: "#0f172a",
    Estelar: "#e8e3d5",
    Púrpura: "#6b21a8",
    Verde: "#15803d",
    Amarillo: "#ca8a04",
    Rosa: "#db2777",
    Titanio: "#8a8a8e",
    "Titanio Natural": "#c8b89a",
    "Titanio Negro": "#2c2c2e",
    "Titanio Blanco": "#f2f2f2",
    "Titanio Desierto": "#c9a96e",
    Grafito: "#374151",
    Plata: "#d1d5db",
    Dorado: "#b8962e",
  };
  return map[color] ?? "#9ca3af";
}

function needsDarkBorder(color: string): boolean {
  return ["Blanco", "Estelar", "Plata", "Titanio Blanco", "Titanio Natural", "Dorado", "Titanio Desierto", "Titanio"].includes(color);
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { toggleCompare, compareList } = useCompare();

  // Una variante representante por cada color único
  const coloresUnicos: Variante[] = Array.from(
    new Map(product.variantes?.map((v) => [v.color, v]) ?? []).values()
  );

  const [varianteActiva, setVarianteActiva] = useState<Variante>(
    coloresUnicos[0] ?? product.variantes?.[0]
  );

  // Imagen: en el futuro vendrá de variante.imagenes[0].
  // Hoy usamos el producto.imagenes[] indexado por posición de color.
  const colorIdx = coloresUnicos.findIndex((v) => v.color === varianteActiva.color);
  const imagenActiva =
    (varianteActiva as any).imagenes?.[0] ??
    product.imagenes?.[Math.max(colorIdx, 0)] ??
    product.imagenes?.[0] ??
    "/placeholder.png";

  const seleccionado = compareList.some((p) => p.id === product.id);
  const atLimit = !seleccionado && compareList.length >= MAX_COMPARE;

  const handleColorClick = (cv: Variante, e: React.MouseEvent) => {
    e.preventDefault(); // No navegar al clickear el color
    const match =
      product.variantes.find(
        (v) => v.color === cv.color && v.memoria === varianteActiva.memoria
      ) ?? cv;
    setVarianteActiva(match);
  };

  return (
    <div
      className={`rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-neutral-900 group overflow-hidden ${className}`}
    >
      {/* ── ZONA DE IMAGEN ── */}
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="relative w-full h-52 bg-gray-50">
          <Image
            key={imagenActiva}
            src={imagenActiva}
            alt={`${product.nombre} – ${varianteActiva.color}`}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {varianteActiva.esUsado && (
            <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Usado
            </span>
          )}
        </div>
      </Link>

      {/* ── INFO + SELECTORES ── */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-3">

        {/* Nombre y modelo */}
        <Link href={`/products/${product.id}`} className="block text-center">
          <h2 className="text-[17px] font-semibold text-color-principal dark:text-white leading-snug">
            {product.nombre}
          </h2>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">
            {product.modelo}
          </span>
        </Link>

        {/* Selector de colores */}
        {coloresUnicos.length > 1 && (
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {coloresUnicos.map((cv) => (
                <button
                  key={cv.color}
                  onClick={(e) => handleColorClick(cv, e)}
                  title={cv.color}
                  aria-label={`Color ${cv.color}`}
                  className={`w-6 h-6 rounded-full transition-all duration-200 focus:outline-none ${
                    varianteActiva.color === cv.color
                      ? "ring-2 ring-color-principal ring-offset-2 scale-125 shadow-sm"
                      : `ring-1 hover:scale-110 ${
                          needsDarkBorder(cv.color) ? "ring-gray-300" : "ring-transparent"
                        }`
                  }`}
                  style={{ backgroundColor: mapColorToHex(cv.color) }}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              {varianteActiva.color}
            </span>
          </div>
        )}

        {/* Memoria + batería (si aplica) */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">
            {varianteActiva.memoria}
          </span>
          {varianteActiva.esUsado && varianteActiva.detalleEstado && (
            <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full font-medium">
              🔋 {varianteActiva.detalleEstado}
            </span>
          )}
        </div>

        {/* Precio */}
        <p className="text-2xl font-bold text-center text-color-principal dark:text-white">
          {varianteActiva.precio
            ? `$${varianteActiva.precio.toLocaleString("es-AR")}`
            : "Consultar precio"}
        </p>

        {/* Botón principal */}
        <Link
          href={`/products/${product.id}`}
          className="mt-1 bg-color-principal text-white py-2.5 rounded-full font-semibold hover:bg-color-principal-oscuro transition-colors text-center text-sm"
        >
          Más información
        </Link>

        {/* Comparar */}
        <button
          onClick={() => toggleCompare(product)}
          disabled={atLimit}
          aria-disabled={atLimit}
          className={`py-2 rounded-full font-medium text-sm border transition-colors ${
            seleccionado
              ? "bg-color-principal-oscuro text-white border-transparent"
              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700"
          } ${atLimit ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          {seleccionado ? "✓ En comparación" : "Comparar"}
        </button>

        {atLimit && (
          <span className="text-xs text-center text-neutral-400">
            Máximo {MAX_COMPARE} modelos
          </span>
        )}
      </div>
    </div>
  );
}
