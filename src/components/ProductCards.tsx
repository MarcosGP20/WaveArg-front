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
    <div className="border rounded-xl p-4 hover:shadow-md transition flex flex-col relative">
      <Link href={`/products/${slug}`} className="block flex-1">
        <div className="relative w-full h-60 mb-4">
          <img
            src={image}
            alt={nombre}
            className="object-contain w-full h-full"
          />
        </div>
        <h2 className="text-lg font-semibold">{nombre}</h2>
        <p className="text-sm text-gray-500">
          {color} · {memoria}
        </p>
        <p className="text-xl font-bold mt-2">${precio.toLocaleString()}</p>
      </Link>
      <button
        className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        onClick={handleAdd}
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
