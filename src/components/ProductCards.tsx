"use client";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/context/CompareContext";
import { Producto } from "@/lib/api"; // Importamos la interfaz real

type ProductCardProps = {
  product: Producto;
  className?: string;
};

const MAX_COMPARE = 3;

export default function ProductCard({ product, className }: ProductCardProps) {
  const { toggleCompare, compareList } = useCompare();

  // --- LÓGICA DE EXTRACCIÓN SEGURA (BACKEND MAPPING) ---
  // Tomamos la primera variante para mostrar en la card
  const variantePrincipal =
    product.variantes && product.variantes.length > 0
      ? product.variantes[0]
      : null;

  // Tomamos la primera imagen o un placeholder si el array viene vacío
  const imagenPrincipal =
    product.imagenes && product.imagenes.length > 0
      ? product.imagenes[0]
      : "/placeholder.png";

  // Verificamos si el producto es usado (basado en la variante)
  const isUsed = variantePrincipal?.esUsado ?? false;

  // Estado de comparación
  const seleccionado = compareList.some((p) => p.id === product.id);
  const atLimit = !seleccionado && compareList.length >= MAX_COMPARE;

  return (
    <div
      className={`rounded-2xl max-w-md shadow-sm p-5 hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-neutral-900 group ${className}`}
    >
      {/* Usamos el ID para el link ya que el backend no devuelve slugs por ahora */}
      <Link href={`/products/${product.id}`} className="block flex-1 relative">
        <div className="relative w-full h-48 mb-4">
          <Image
            src={imagenPrincipal}
            alt={product.nombre}
            fill
            className="object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Badge de estado (Solo si es usado) */}
          {isUsed && (
            <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl uppercase">
              Usado
            </div>
          )}
        </div>

        {/* Título y Modelo */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold text-[#05467D] dark:text-white text-center">
            {product.nombre}
          </h2>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">
            {product.modelo}
          </span>
        </div>

        {/* Características de la variante principal */}
        <p className="text-sm text-center text-[#999999] mt-2">
          {variantePrincipal?.color ?? "Color estándar"} ·{" "}
          {variantePrincipal?.memoria ?? "Base"}
        </p>

        {/* Precio con formato seguro */}
        <p className="text-2xl text-center font-semibold text-[#05467D] dark:text-white mt-2">
          {variantePrincipal?.precio
            ? `$${variantePrincipal.precio.toLocaleString()}`
            : "Consultar precio"}
        </p>
      </Link>

      <Link
        href={`/products/${product.id}`}
        className="mt-4 bg-[#05467D] text-white py-2 rounded-full font-medium hover:bg-[#0F3C64] transition-colors text-center self-center px-16"
      >
        Más información
      </Link>

      {/* Botón de comparación */}
      <button
        onClick={() => toggleCompare(product)}
        disabled={atLimit}
        aria-disabled={atLimit}
        className={`mt-2 py-2 rounded-full font-medium text-sm border transition-colors self-center px-9
          ${
            seleccionado
              ? "bg-[#0F3C64] text-white border-transparent"
              : "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700"
          }
          ${atLimit ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {seleccionado ? "Quitar de comparación" : "Seleccionar para comparar"}
      </button>

      {atLimit && (
        <span className="mt-1 text-xs text-center text-neutral-500 block">
          Máximo {MAX_COMPARE} modelos
        </span>
      )}
    </div>
  );
}
