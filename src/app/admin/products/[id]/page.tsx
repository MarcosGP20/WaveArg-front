// src/app/admin/products/[id]/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

// 1. TIPOS DE DATOS (Lo que le mandaremos a tu colega)
interface Variant {
  id: number;
  color: string;
  almacenamiento: string;
  bateria: number; // Tu ejemplo: 100, 87, etc.
  precio: number;
  stock: number;
}

// Mock del Producto Padre (Simulamos que ya lo cargaste en el paso anterior)
const MOCK_PRODUCT_PARENT = {
  id: 101,
  name: "iPhone 14 Pro",
  modelo: "A2890",
  imagen:
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-deep-purple-select?wid=940&hei=1112&fmt=png-alpha",
};

export default function ProductDetailVariantPage({
  params,
}: {
  params: { id: string };
}) {
  // Estado local para la lista de variantes (esto vendría del backend)
  const [variants, setVariants] = useState<Variant[]>([]);

  // Hook form para agregar UNA variante nueva
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Variant>();

  // Función para agregar a la lista visualmente
  const onAddVariant = (data: Variant) => {
    const newVariant = {
      ...data,
      id: Date.now(), // ID temporal
      stock: Number(data.stock),
      precio: Number(data.precio),
      bateria: Number(data.bateria),
    };

    setVariants([...variants, newVariant]); // Agregamos al array
    reset(); // Limpiamos los inputs
    // AQUÍ: En el futuro, harías una llamada a la API para guardar esta variante individualmente
  };

  // Función para borrar una variante
  const onDeleteVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* HEADER: Información del Producto Padre (Solo Lectura) */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center border">
          <img
            src={MOCK_PRODUCT_PARENT.imagen}
            alt="Product"
            className="h-16 w-auto object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {MOCK_PRODUCT_PARENT.name}
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              ID: {params.id}
            </span>
          </div>
          <p className="text-gray-500">Modelo: {MOCK_PRODUCT_PARENT.modelo}</p>
        </div>
        <div className="ml-auto">
          <Link
            href="/admin/products"
            className="text-sm text-gray-500 hover:text-black underline"
          >
            Volver al listado
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: Formulario para AGREGAR VARIANTE */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>➕</span> Agregar Variante
            </h2>
            <form onSubmit={handleSubmit(onAddVariant)} className="space-y-4">
              {/* Atributos Específicos */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">
                  Color
                </label>
                <input
                  {...register("color", { required: true })}
                  placeholder="Ej: Deep Purple"
                  className="w-full border p-2 rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    GB
                  </label>
                  <select
                    {...register("almacenamiento")}
                    className="w-full border p-2 rounded text-sm bg-white"
                  >
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Batería %
                  </label>
                  <input
                    {...register("bateria", {
                      required: true,
                      max: 100,
                      min: 0,
                    })}
                    type="number"
                    placeholder="100"
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
              </div>

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Precio ($)
                  </label>
                  <input
                    {...register("precio", { required: true })}
                    type="number"
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Stock
                  </label>
                  <input
                    {...register("stock", { required: true })}
                    type="number"
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg text-sm transition-all mt-4"
              >
                Agregar al Inventario
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: Tabla de Variantes Existentes */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-lg text-gray-800">
            Inventario Actual ({variants.length})
          </h2>

          {variants.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">
                No hay variantes cargadas para este producto.
              </p>
              <p className="text-sm text-gray-400">
                Usa el formulario de la izquierda para agregar stock.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                  <tr>
                    <th className="p-4">Detalle</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {v.color}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {v.almacenamiento}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${
                            v.bateria >= 90
                              ? "bg-green-50 text-green-700 border-green-200"
                              : v.bateria >= 80
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          Batería {v.bateria}%
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        ${v.precio}
                      </td>
                      <td className="p-4">{v.stock} un.</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onDeleteVariant(v.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
