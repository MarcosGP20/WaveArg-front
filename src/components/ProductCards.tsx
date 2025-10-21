"use client";
import Link from "next/link";
import Image from "next/image"; // 1. Usamos Next/Image
// import { useCart } from "@/context/CartContext"; <-- 2. Eliminado
import { useCompare } from "@/context/CompareContext";
// import { useState } from "react"; <-- 3. Eliminado
// import Toast from "@/components/ui/Toast"; <-- 4. Eliminado
import { products } from "@/lib/mock/products";

type Product = (typeof products)[0];

type ProductCardProps = {
  product: Product;
  className?: string;
};

const MAX_COMPARE = 3;

export default function ProductCard({ product, className }: ProductCardProps) {
  const { nombre, color, memoria, precio, image, slug } = product;
  const { modoComparacion, toggleCompare, compareList } = useCompare();
  const seleccionado = compareList.some((p) => p.id === product.id);
  const atLimit = !seleccionado && compareList.length >= MAX_COMPARE;

  return (
    <div
      className={`rounded-2xl max-w-md shadow-sm p-5 hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-neutral-900 ${className}`}
    >
      {/* 9. Este Link ahora solo envuelve la parte "clickeable" (imagen y texto) */}
      <Link href={`/products/${slug}`} className="block flex-1">
        <div className="relative w-full h-48 mb-4">
          <Image
            src={image}
            alt={nombre}
            fill // 'fill' hace que llene el div padre (w-full h-56)
            className="object-contain rounded-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h2 className="text-xl text-center font-semibold text-[#05467D] ">
          {nombre}
        </h2>
        <p className="text-sm text-center text-[#999999] mt-1">
          {color} · {memoria}
        </p>
        <p className="text-2xl text-center font-semibold text-[#05467D] dark:text-white mt-2">
          ${precio.toLocaleString()}
        </p>
      </Link>

      <Link
        href={`/products/${slug}`}
        className="mt-4 bg-[#05467D] text-white py-2 rounded-xl font-medium hover:bg-[#0F3C64] transition-colors text-center self-center px-16"
      >
        Más información
      </Link>

      {/* Botón de comparación  */}
      <button
        onClick={() => toggleCompare(product)}
        disabled={atLimit}
        aria-disabled={atLimit}
        title={
          atLimit ? `Máximo ${MAX_COMPARE} modelos para comparar` : undefined
        }
        className={`mt-2 py-2 rounded-xl font-medium text-sm border transition-colors self-center px-9
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
        <span className="mt-1 text-xs text-neutral-500">
          Máximo {MAX_COMPARE} modelos para comparar
        </span>
      )}
    </div>
  );
}
