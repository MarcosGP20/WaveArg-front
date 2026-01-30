"use client";

import { useEffect, useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductoById, Producto, Variante } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Toast from "@/components/ui/Toast";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Producto | null>(null);
  const [selectedVariante, setSelectedVariante] = useState<Variante | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Estado para la imagen que se muestra en el visor grande
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductoById(id);
        setProduct(data);
        if (data.variantes?.length) {
          setSelectedVariante(data.variantes[0]);
          // Al cargar, la imagen principal es la primera del producto
          setActiveImage(data.imagenes[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Efecto senior: Si el usuario elige una variante "Usada" con foto propia,
  // actualizamos el visor principal automáticamente.
  useEffect(() => {
    if (selectedVariante?.fotoEstadoUrl) {
      setActiveImage(selectedVariante.fotoEstadoUrl);
    }
  }, [selectedVariante]);

  if (loading)
    return <div className="py-20 text-center">Cargando producto...</div>;
  if (!product || !selectedVariante) return notFound();

  const memoriasDisponibles = [
    ...new Set(product.variantes.map((v) => v.memoria)),
  ];
  const coloresDisponibles = [
    ...new Set(product.variantes.map((v) => v.color)),
  ];

  // Consolidamos todas las imágenes disponibles (Generales + Foto específica de estado si existe)
  const allImages = [...product.imagenes];
  if (
    selectedVariante.fotoEstadoUrl &&
    !allImages.includes(selectedVariante.fotoEstadoUrl)
  ) {
    allImages.push(selectedVariante.fotoEstadoUrl);
  }

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedVariante.id}`,
      name: `${product.nombre} (${selectedVariante.color}, ${selectedVariante.memoria})`,
      price: selectedVariante.precio,
      quantity,
      image: selectedVariante.fotoEstadoUrl || product.imagenes[0],
    });
    setShowToast(true);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowToast(false);
    }, 1200);
  };

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-12">
        {/* GALERÍA ESTILO MERCADO LIBRE */}
        <div className="w-full md:w-1/2 flex gap-4">
          {/* Tira de miniaturas (Lado izquierdo en Desktop) */}
          <div className="hidden md:flex flex-col gap-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setActiveImage(img)} // Cambia al pasar el mouse como ML
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 border-2 rounded-md overflow-hidden transition-all ${
                  activeImage === img
                    ? "border-[#05467D]"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="relative w-full h-full bg-white">
                  <Image
                    src={img}
                    alt="Thumbnail"
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Visor Principal */}
          <div className="flex-1 p-4 bg-white border rounded-xl shadow-sm">
            <div className="relative w-full h-80 md:h-[450px]">
              <Image
                src={activeImage || "/placeholder.png"}
                alt={product.nombre}
                fill
                className="object-contain transition-opacity duration-300"
                priority
              />
            </div>
            {/* Indicador de variante usada en la imagen */}
            {selectedVariante.fotoEstadoUrl === activeImage && (
              <div className="mt-2 text-center">
                <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded">
                  FOTO REAL DEL EQUIPO
                </span>
              </div>
            )}
          </div>
        </div>

        {/* INFO DEL PRODUCTO */}
        <div className="w-full md:w-1/2 flex flex-col">
          <button
            onClick={() => router.back()}
            className="mb-6 self-start text-gray-500 hover:text-gray-800 flex items-center gap-2 text-sm transition-colors"
          >
            ← Volver al listado
          </button>

          <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            {product.descripcion}
          </p>

          <div className="my-6 pt-4 border-t border-gray-100">
            <p className="text-4xl font-bold text-[#05467D]">
              ${selectedVariante.precio.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedVariante.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <p className="text-sm font-semibold text-gray-600">
                {selectedVariante.stock > 0
                  ? `${selectedVariante.stock} disponibles`
                  : "Sin stock"}
              </p>
            </div>
          </div>

          {/* COLOR */}
          <div className="mt-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Color
            </h3>
            <div className="flex gap-3 mt-3">
              {coloresDisponibles.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    const match = product.variantes.find(
                      (v) =>
                        v.color === color &&
                        v.memoria === selectedVariante.memoria
                    );
                    if (match) setSelectedVariante(match);
                  }}
                  className={`w-9 h-9 rounded-full transition-all ${
                    selectedVariante.color === color
                      ? "ring-2 ring-[#05467D] ring-offset-2 scale-110"
                      : "ring-1 ring-gray-200"
                  }`}
                  style={{ backgroundColor: mapColorToHex(color) }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* MEMORIA */}
          <div className="mt-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Capacidad
            </h3>
            <div className="flex gap-3 mt-3 flex-wrap">
              {memoriasDisponibles.map((mem) => (
                <button
                  key={mem}
                  onClick={() => {
                    const match = product.variantes.find(
                      (v) =>
                        v.memoria === mem && v.color === selectedVariante.color
                    );
                    if (match) setSelectedVariante(match);
                  }}
                  className={`px-6 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                    selectedVariante.memoria === mem
                      ? "bg-[#05467D] text-white border-[#05467D]"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {mem}
                </button>
              ))}
            </div>
          </div>

          {/* ACCIONES */}
          <div className="flex items-center gap-4 mt-10">
            <div className="flex items-center border border-gray-300 rounded-full px-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-500"
              >
                -
              </button>
              <input
                type="number"
                readOnly
                value={quantity}
                className="w-10 text-center font-bold text-sm outline-none"
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(selectedVariante.stock, quantity + 1))
                }
                className="px-3 py-2 text-gray-500"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={selectedVariante.stock < 1}
              className="flex-1 bg-[#05467D] text-white font-bold py-4 rounded-full shadow-lg shadow-blue-900/20 hover:bg-[#043a6a] transition-all disabled:bg-gray-300 disabled:shadow-none"
            >
              {added ? "✓ AGREGADO" : "AGREGAR AL CARRITO"}
            </button>
          </div>
        </div>
      </div>

      <Toast
        message="Producto agregado al carrito"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

function mapColorToHex(color: string) {
  const colors: Record<string, string> = {
    Negro: "#1a1a1a",
    Blanco: "#f9f9f9",
    Azul: "#1e40af",
    Rojo: "#991b1b",
    Medianoche: "#0f172a",
    Estelar: "#fafaf9",
    Púrpura: "#581c87",
  };
  return colors[color] || "#D1D5DB";
}
