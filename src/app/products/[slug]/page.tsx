"use client";

import { products } from "@/lib/mock/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { useCart } from "@/context/CartContext";
import Toast from "@/components/ui/Toast";
// Importa un ícono de camión de tu librería de iconos (ej: lucide-react, heroicons)
// import { Truck } from "lucide-react";

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
  // --- MEJORA: Mapeo de colores para los swatches ---
  // Idealmente, esto vendría de tu API/mock.
  const coloresDisponibles = [
    { nombre: "Negro espacial", class: "bg-gray-900" },
    { nombre: "Azul", class: "bg-blue-500" },
    { nombre: "Blanco", class: "bg-white border-gray-300 border" },
  ];
  const memorias = ["128 GB", "256 GB", "512 GB"];

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-16">
        {/* --- CONTENEDOR DE IMAGEN --- */}
        {/* Hacemos la imagen más grande y le damos un fondo blanco tipo "card" */}
        <div className="w-full md:w-1/2 p-4 bg-white border border-gray-200 rounded-lg flex-shrink-0">
          <div className="relative w-full h-80 md:h-96 lg:h-[450px]">
            <Image
              src={product.image}
              alt={product.nombre}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority // Carga esta imagen primero
            />
          </div>
        </div>

        {/* --- INFO DEL PRODUCTO --- */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          {/* --- CAMBIO: Botón "Volver" con estilo "ghost" (sutil) --- */}
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-1.5"
          >
            {/* <ArrowLeft size={16} /> */}← Volver
          </button>

          <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
          <p className="text-gray-500 mt-2">{product.descripcionCorta}</p>

          {/* Etiquetas (ya estaban bien) */}
          <div className="flex flex-wrap gap-2 mt-3">
            {product.etiquetas?.map((etiqueta) => (
              <span
                key={etiqueta}
                className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              >
                #{etiqueta}
              </span>
            ))}
          </div>

          {/* --- MEJORA: Movimos el precio, stock y promo aquí para jerarquía --- */}
          <div className="my-5 w-full">
            <p className="text-3xl font-bold text-gray-900">
              ${product.precio.toLocaleString()}
            </p>
            <p
              className={`mt-1 text-sm font-medium ${
                product.disponible ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.disponible
                ? `En stock (${product.stock} disponibles)`
                : "Sin stock"}
            </p>
          </div>

          {/* --- MEJORA GRANDE: Selector de color con Swatches --- */}
          <div className="mt-4 w-full">
            <h3 className="text-sm font-medium text-gray-900">
              Color: <span className="text-gray-600">{selectedColor}</span>
            </h3>
            <div className="flex gap-3 mt-2">
              {coloresDisponibles.map((color) => (
                <button
                  key={color.nombre}
                  type="button"
                  onClick={() => setSelectedColor(color.nombre)}
                  className={`w-8 h-8 rounded-full ${color.class} ${
                    selectedColor === color.nombre
                      ? "ring-2 ring-blue-600 ring-offset-2" // Estado seleccionado
                      : "ring-1 ring-inset ring-gray-300" // Estado no seleccionado
                  } transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
                  aria-label={`Seleccionar color ${color.nombre}`}
                />
              ))}
            </div>
          </div>

          {/* --- MEJORA GRANDE: Selector de memoria con "Pills" --- */}
          <div className="mt-6 w-full">
            <h3 className="text-sm font-medium text-gray-900">
              Capacidad:{" "}
              <span className="text-gray-600">{selectedCapacity}</span>
            </h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {memorias.map((mem) => (
                <button
                  key={mem}
                  onClick={() => setSelectedCapacity(mem)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                    selectedCapacity === mem
                      ? "bg-[#05467D] text-white border-[#05467D]" // Estilo seleccionado
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100" // Estilo por defecto
                  } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1`}
                >
                  {mem}
                </button>
              ))}
            </div>
          </div>

          {/* --- MEJORA: Input y Botón agrupados y con branding --- */}
          <div className="flex items-center gap-4 mt-8 w-full">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-full text-center px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Cantidad"
            />
            {/* --- CAMBIO: Botón principal de "Agregar al carrito" --- */}
            <button
              className="flex-1 bg-[#05467D] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#043a6a] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

      {/* --- MEJORA: Especificaciones con mejor layout --- */}
      <div className="mt-12 lg:mt-16 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Características técnicas
        </h2>
        <ul className="space-y-3 text-gray-700 max-w-2xl">
          {specs.map((item) => (
            <li
              key={item.label}
              className="flex justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-800">{item.label}</span>
              <span className="text-gray-600 text-right">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
