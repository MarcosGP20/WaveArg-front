"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Battery } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { Producto, Variante } from "@/lib/api";
import { mapColorToHex, needsDarkBorder } from "@/lib/colorMap";

type ProductCardProps = {
  product: Producto;
  className?: string;
  featured?: boolean;
};

const MAX_COMPARE = 3;

export default function ProductCard({ product, className, featured = false }: ProductCardProps) {
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
    (varianteActiva as unknown as Record<string, any>)?.imagenes?.[0] ??
    product.imagenes?.[Math.max(colorIdx, 0)] ??
    product.imagenes?.[0] ??
    "/placeholder.png";

  const stockColorActivo = product.variantes
    .filter((v) => v.color === varianteActiva.color)
    .reduce((sum, v) => sum + (v.stock ?? 0), 0);

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

  const card = (
    <div
      className={`rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col bg-white group overflow-hidden ${featured ? "" : className}`}
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

          {/* Urgency strip — solo cuando quedan pocas unidades */}
          {stockColorActivo > 0 && stockColorActivo <= 3 && (
            <div className="absolute bottom-0 inset-x-0 bg-amber-500/90 backdrop-blur-sm py-1.5 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wide">
                {stockColorActivo === 1 ? "¡Queda 1 unidad!" : `¡Últimas ${stockColorActivo} unidades!`}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ── INFO + SELECTORES ── */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-3">

        {/* Nombre y modelo */}
        <Link href={`/products/${product.id}`} className="block text-center">
          <h2 className="text-[17px] font-semibold text-color-principal leading-snug">
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
                  className={`w-6 h-6 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-principal focus-visible:ring-offset-2 ${
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
            <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Battery size={11} strokeWidth={1.75} />
              {varianteActiva.detalleEstado}
            </span>
          )}
        </div>

        {/* Precio */}
        <p className="text-2xl font-bold text-center text-color-principal">
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
              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
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

  if (!featured) return card;

  return (
    <div className={`relative rounded-2xl p-[1.5px] overflow-hidden ${className}`}>
      {/* Beam giratorio — conic-gradient que rota detrás del card */}
      <div
        className="animate-border-beam absolute inset-[-100%] z-0"
        style={{
          background: "conic-gradient(transparent 270deg, #60a5fa 285deg, #05467D 295deg, transparent 310deg)",
        }}
      />
      {/* Badge destacado */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#05467D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
        Destacado
      </div>
      <div className="relative z-10 rounded-[14px] overflow-hidden">
        {card}
      </div>
    </div>
  );
}
