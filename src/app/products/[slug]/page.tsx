"use client";

import { products } from "@/lib/mock/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  params: {
    slug: string;
  };
};

export default function ProductDetail({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) return notFound();

  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product.color);
  const [selectedCapacity, setSelectedCapacity] = useState(product.memoria);

  // Specs ficticias
  const specs = product.specs;
  // Colores y memorias disponibles
  const colores = ["Negro espacial", "Azul", "Blanco"];
  const memorias = ["128 GB", "256 GB", "512 GB"];

  return (
    <div className="py-10 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-10">
        {/* Imagen */}
        <div className="relative w-full md:w-1/2 h-80 md:h-96 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.nombre}
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Info del producto */}
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
            {selectedColor} · {selectedCapacity}
          </p>

          {/* Descripción corta */}
          <p className="mt-2 text-base text-gray-700">
            {product.descripcionCorta}
          </p>

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2 mt-2">
            {product.etiquetas?.map((etiqueta) => (
              <span
                key={etiqueta}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
              >
                #{etiqueta}
              </span>
            ))}
          </div>

          {/* Selector de variantes */}
          <div className="flex gap-4 mt-4">
            {colores.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedColor === color
                    ? "bg-black text-white"
                    : "text-gray-600"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-2">
            {memorias.map((mem) => (
              <button
                key={mem}
                onClick={() => setSelectedCapacity(mem)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedCapacity === mem
                    ? "bg-black text-white"
                    : "text-gray-600"
                }`}
              >
                {mem}
              </button>
            ))}
          </div>

          {/* Precio */}
          <p className="text-2xl font-bold mt-4">
            ${product.precio.toLocaleString()}
          </p>

          {/* Stock y disponibilidad */}
          <p
            className={`mt-1 text-sm font-medium ${
              product.disponible ? "text-green-700" : "text-red-600"
            }`}
          >
            {product.disponible
              ? `En stock (${product.stock} disponibles)`
              : "Sin stock"}
          </p>

          {/* Promoción destacada */}
          <p className="mt-2 text-green-700 bg-green-100 px-3 py-1 rounded text-sm font-medium">
            ¡Envío gratis en compras mayores a $500.000!
          </p>

          {/* Botón agregar */}
          <button className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Agregar al carrito
          </button>

          {/* Detalles de entrega */}
          <p className="mt-4 text-sm text-gray-500">
            Entrega estimada en 24 a 72hs hábiles.
          </p>

          {/* Calificación y opiniones */}
          <div className="mt-2 flex items-center gap-2 text-yellow-600 text-base">
            <span>⭐</span>
            <span>{product.calificacion} / 5</span>
            <span className="text-gray-500">
              ({product.opiniones} opiniones)
            </span>
          </div>
        </div>
      </div>

      {/* Especificaciones */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Características técnicas</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
          {specs.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
