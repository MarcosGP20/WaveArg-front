// src/components/admin/CreateProductForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ProductFormData } from "@/app/admin/types/product";

// 1. SERVICIO MOCK (Simula ser el Backend)
// Esto vive fuera del componente para mantenerlo limpio
const createProductMockService = async (data: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("📡 ENVIANDO A BACKEND (SIMULADO):", data);

      // Simula éxito
      resolve({ success: true, id: Math.floor(Math.random() * 1000) });

      // Simula error (descomenta para probar fallos)
      // reject(new Error("Error 500: El servidor explotó 🔥"));
    }, 2000); // Tarda 2 segundos
  });
};

export default function CreateProductForm() {
  const router = useRouter(); // Hook para redireccionar
  const [isLoading, setIsLoading] = useState(false); // Estado de carga visual
  const [submitError, setSubmitError] = useState<string | null>(null); // Estado de error

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true); // 🔒 Bloqueamos UI
    setSubmitError(null); // Limpiamos errores previos

    try {
      // 2. LIMPIEZA DE DATOS (Data Sanitization)
      const payloadBackend = {
        ...data,
        cantidadStock: Number(data.cantidadStock),
        // Recuperamos los dos precios según la foto del backend
        precio: Number(data.precio),
        imagenesUrls: [data.imagenesURL],
      };

      // 3. LLAMADA ASÍNCRONA (Esperamos al mock)
      await createProductMockService(payloadBackend);

      // 4. ÉXITO
      alert("✅ Producto creado con éxito (Simulado)");
      router.push("/admin/products"); // Redireccionamos al listado
    } catch (error) {
      console.error(error);
      setSubmitError("Hubo un error al guardar. Revisa tu conexión.");
    } finally {
      setIsLoading(false); // 🔓 Desbloqueamos UI siempre
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Agregar Nuevo Producto
      </h2>

      {/* 5. MENSAJE DE ERROR VISUAL */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm flex items-center gap-2">
          ⚠️ {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* GRUPO 1: Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Nombre del Producto
            </label>
            <input
              {...register("name", { required: "El nombre es obligatorio" })}
              disabled={isLoading} // Deshabilitar al cargar
              type="text"
              placeholder="Ej: iPhone 15"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Modelo
            </label>
            <input
              {...register("modelo", { required: true })}
              disabled={isLoading}
              type="text"
              placeholder="Ej: Pro Max"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Descripción
          </label>
          <textarea
            {...register("descripcion")}
            disabled={isLoading}
            rows={3}
            placeholder="Detalles del producto..."
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-100"
          />
        </div>

        {/* GRUPO 2: Precios y Stock (Ajustado al backend) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Stock</label>
            <input
              {...register("cantidadStock", { required: true, min: 0 })}
              disabled={isLoading}
              type="number"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Precio
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                {...register("precio", { required: true, min: 0 })}
                disabled={isLoading}
                type="number"
                className="pl-8 border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* GRUPO 3: Imágenes */}
        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <label className="text-sm font-semibold text-gray-700">
            Imagen Principal (URL)
          </label>
          <input
            {...register("imagenesURL", {
              required: "Necesitamos al menos una foto",
            })}
            disabled={isLoading}
            type="text"
            placeholder="http://..."
            className="border p-3 rounded-lg bg-white disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500">
            * Más adelante conectaremos esto con la subida de archivos real.
          </p>
        </div>

        {/* 6. BOTÓN CON ESTADO DE CARGA */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#05467D] hover:bg-blue-900 text-white"
            }`}
        >
          {isLoading ? (
            <>
              {/* Spinner SVG Simple */}
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Guardando...
            </>
          ) : (
            "Guardar Producto"
          )}
        </button>
      </form>
    </div>
  );
}
