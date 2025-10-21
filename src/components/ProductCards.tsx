"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import { useState } from "react";
import Toast from "@/components/ui/Toast";
import { products } from "@/lib/mock/products";

type Product = (typeof products)[0];

type ProductCardProps = {
  product: Product;
  className?: string;
};

const MAX_COMPARE = 3;

export default function ProductCard({ product, className }: ProductCardProps) {
  const { nombre, color, memoria, precio, image, slug } = product;

  const { addToCart } = useCart();
  const { modoComparacion, toggleCompare, compareList } = useCompare();
  const [showToast, setShowToast] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: slug + color + memoria,
      name: `${nombre} (${color}, ${memoria})`,
      price: precio,
      quantity: 1,
      image,
    });
    setShowToast(true);
  };

  const seleccionado = compareList.some((p) => p.id === product.id);
  const atLimit = !seleccionado && compareList.length >= MAX_COMPARE;

  return (
    <div
      className={`rounded-2xl shadow-sm p-5 hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-neutral-900 ${className}`}
    >
      <Link href={`/products/${slug}`} className="block flex-1">
        <div className="relative w-full h-56 mb-4">
          <img
            src={image}
            alt={nombre}
            className="object-contain w-full h-full rounded-xl"
          />
        </div>
        <h2 className="text-xl font-semibold text-[#05467D] ">{nombre}</h2>
        <p className="text-sm text-[#999999] mt-1">
          {color} · {memoria}
        </p>
        <p className="text-2xl font-semibold text-[#05467D] dark:text-white mt-2">
          ${precio.toLocaleString()}
        </p>
      </Link>

      <Link
        href={`/products/${slug}`}
        className="mt-4 bg-[#05467D] text-white py-2 rounded-xl font-medium hover:bg-[#0F3C64] transition-colors text-center block"
      >
        Más información
      </Link>

      {/* Botón de comparación (siempre visible) */}
      <button
        onClick={() => toggleCompare(product)}
        disabled={atLimit}
        aria-disabled={atLimit}
        title={
          atLimit ? `Máximo ${MAX_COMPARE} modelos para comparar` : undefined
        }
        className={`mt-2 py-2 rounded-xl font-medium text-sm border transition-colors
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

      {/* Mensajito cuando el modo no está activo */}
      {/* {!modoComparacion && (
        <span className="mt-1 text-xs text-neutral-500">
          Podés preseleccionar modelos y ver la comparación cuando quieras.
        </span>
      )} */}

      {/* Aviso cuando se alcanzó el máximo (visible solo si no está seleccionada esta card) */}
      {atLimit && (
        <span className="mt-1 text-xs text-neutral-500">
          Máximo {MAX_COMPARE} modelos para comparar
        </span>
      )}

      <Toast
        message="¡Agregado al carrito!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
