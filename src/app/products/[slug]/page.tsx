"use client";

import { products } from "@/lib/mock/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default function ProductDetail({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) return notFound();

  const router = useRouter();

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-10">
        <div className="relative w-full md:w-1/2 h-80 md:h-96 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.nombre}
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition self-start"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold">{product.nombre}</h1>
          <p className="text-gray-500 mt-2">
            {product.color} · {product.memoria}
          </p>
          <p className="text-2xl font-bold mt-4">
            ${product.precio.toLocaleString()}
          </p>
          <button className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
