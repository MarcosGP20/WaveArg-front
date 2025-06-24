"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Toast from "@/components/ui/Toast";

type ProductCardProps = {
  nombre: string;
  color: string;
  memoria: string;
  precio: number;
  image: string;
  slug: string;
};

export default function ProductCard({
  nombre,
  color,
  memoria,
  precio,
  image,
  slug,
}: ProductCardProps) {
  const { addToCart } = useCart();
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

  return (
    <div className="rounded-2xl shadow-sm p-5 hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-neutral-900">
      <Link href={`/products/${slug}`} className="block flex-1">
        <div className="relative w-full h-56 mb-4">
          <img
            src={image}
            alt={nombre}
            className="object-contain w-full h-full rounded-xl"
          />
        </div>
        <h2 className="text-xl font-bold text-[#333]">{nombre}</h2>
        <p className="text-sm text-[#999999] mt-1">
          {color} · {memoria}
        </p>
        <p className="text-2xl font-extrabold text-black dark:text-white mt-2">
          ${precio.toLocaleString()}
        </p>
      </Link>

      <button
        onClick={handleAdd}
        className="mt-4 bg-[#05467D] text-white py-2 rounded-xl font-medium hover:bg-[#0F3C64] transition-colors"
      >
        Agregar al carrito
      </button>

      <Toast
        message="¡Agregado al carrito!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
