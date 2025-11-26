// src/components/admin/CreateProductForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// 1. ACTUALIZAMOS LA INTERFAZ (Definición del Padre)
interface CreateProductPayload {
  name: string;
  modelo: string; // Ej: "Pro Max" (Lo dejamos como referencia del padre)
  descripcion: string;
  imagenPrincipal: string; // La foto "de portada" del producto
}

const createProductMockService = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("📦 PRODUCTO PADRE CREADO:", data);
      // El backend nos devuelve el ID del nuevo producto (IMPORTANTE)
      resolve({ success: true, newProductId: 101 });
    }, 1000);
  });
};

export default function CreateProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductPayload>();

  const onSubmit = async (data: CreateProductPayload) => {
    setIsLoading(true);
    try {
      // 2. Enviamos solo la data "estática"
      const response: any = await createProductMockService(data);

      // 3. LA REDIRECCIÓN CLAVE
      // Ahora no vamos al listado, vamos al "Dashboard del Producto"
      // para empezar a cargarle variantes (stock/precio).
      if (response.success) {
        alert(
          "✅ Ficha creada. Ahora vamos a cargar las variantes (Precios/Stock)."
        );
        // Redirigimos a la pantalla de edición pasando el ID
        // router.push(`/admin/products/${response.newProductId}`);
        router.push("/admin/products"); // Por ahora al listado hasta que tengamos esa pantalla
      }
    } catch (error) {
      console.error(error);
      alert("Error al crear la ficha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Paso 1: Ficha del Producto
        </h2>
        <p className="text-sm text-gray-500">
          Primero definamos los datos generales. En el siguiente paso cargarás
          stock y precios.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Nombre Comercial
            </label>
            <input
              {...register("name", { required: "Requerido" })}
              disabled={isLoading}
              type="text"
              placeholder="Ej: iPhone 15 Pro Max"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Modelo / Referencia */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Modelo / Línea
            </label>
            <input
              {...register("modelo", { required: true })}
              disabled={isLoading}
              type="text"
              placeholder="Ej: A2849 (o Pro Max)"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Descripción Marketing
          </label>
          <textarea
            {...register("descripcion")}
            disabled={isLoading}
            rows={4}
            placeholder="El titanio de grado aeroespacial..."
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-100"
          />
        </div>

        {/* Imagen de Portada */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Imagen de Portada (General)
          </label>
          <input
            {...register("imagenPrincipal", { required: true })}
            disabled={isLoading}
            type="text"
            placeholder="http://..."
            className="border p-3 rounded-lg disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#05467D] hover:bg-blue-900 text-white font-bold py-4 rounded-xl transition-all disabled:bg-gray-400"
        >
          {isLoading ? "Creando Ficha..." : "Crear Ficha del Producto"}
        </button>
      </form>
    </div>
  );
}
