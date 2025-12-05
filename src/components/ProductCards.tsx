"use client";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/context/CompareContext";
import { products } from "@/lib/mock/products";

// Asegúrate de importar el tipo correcto desde tu mock
type Product = (typeof products)[0] & { estado?: "nuevo" | "usado" };

type ProductCardProps = {
  product: Product;
  className?: string;
};

const MAX_COMPARE = 3;

export default function ProductCard({ product, className }: ProductCardProps) {
  const { nombre, color, memoria, precio, image, slug, estado } = product;

  const { toggleCompare, compareList } = useCompare();
  const seleccionado = compareList.some((p) => p.id === product.id);
  const atLimit = !seleccionado && compareList.length >= MAX_COMPARE;

  const isUsed = estado === "usado";

  return (
    <div
      className={`rounded-2xl max-w-md shadow-sm p-5 hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-neutral-900 group ${className}`}
    >
      <Link href={`/products/${slug}`} className="block flex-1 relative">
        {/* 1. ELIMINADO EL BADGE DE AQUÍ (ZONA IMAGEN) */}

        <div className="relative w-full h-48 mb-4">
          <Image
            src={image}
            alt={nombre}
            fill
            className="object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Título y Estado Integrado */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold text-[#05467D]">{nombre}</h2>
        </div>

        <p className="text-sm text-center text-[#999999] mt-2">
          {color} · {memoria}
        </p>

        <p className="text-2xl text-center font-semibold text-[#05467D] dark:text-white mt-2">
          ${precio.toLocaleString()}
        </p>
      </Link>

      <Link
        href={`/products/${slug}`}
        className="mt-4 bg-[#05467D] text-white py-2 rounded-full font-medium hover:bg-[#0F3C64] transition-colors text-center self-center px-16"
      >
        Más información
      </Link>

      {/* Botón de comparación */}
      <button
        onClick={() => toggleCompare(product)}
        disabled={atLimit}
        aria-disabled={atLimit}
        title={
          atLimit ? `Máximo ${MAX_COMPARE} modelos para comparar` : undefined
        }
        className={`mt-2 py-2 rounded-full font-medium text-sm border transition-colors self-center px-9
          ${
            seleccionado
              ? "bg-[#0F3C64] text-white border-transparent"
              : "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700"
          }
          ${atLimit ? "opacity-50 cursor-not-allowed hover:bg-gray-100" : ""}
        `}
      >
        {seleccionado ? "Quitar de comparación" : "Seleccionar para comparar"}
      </button>

      {atLimit && (
        <span className="mt-1 text-xs text-center text-neutral-500 block">
          Máximo {MAX_COMPARE} items
        </span>
      )}
    </div>
  );
}
