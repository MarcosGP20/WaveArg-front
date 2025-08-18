"use client";

import { products } from "@/lib/mock/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { useCart } from "@/context/CartContext";
import Toast from "@/components/ui/Toast";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  if (!product) return notFound();

  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product.color);
  const [selectedCapacity, setSelectedCapacity] = useState(product.memoria);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
          <div className="flex items-center gap-4 mt-6">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded px-2 py-1"
              aria-label="Cantidad"
            />
            <button
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              disabled={!product.disponible || quantity < 1}
              onClick={() => {
                addToCart({
                  id: product.slug + selectedColor + selectedCapacity,
                  name: `${product.nombre} (${selectedColor}, ${selectedCapacity})`,
                  price: product.precio,
                  quantity,
                  image: product.image,
                });
                setShowToast(true);
                setAdded(true);
                setTimeout(() => {
                  setAdded(false);
                  setShowToast(false);
                }, 1200);
              }}
            >
              {added ? "¡Agregado!" : "Agregar al carrito"}
            </button>
            <Toast
              message="¡Agregado al carrito!"
              show={showToast}
              onClose={() => setShowToast(false)}
            />
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
