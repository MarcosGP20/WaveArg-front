"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductService } from "@/lib/api";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductForm {
  nombre: string;
  modelo: string;
  descripcion: string;
  imagenesUrls: { url: string }[];
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProductForm>({
    defaultValues: {
      imagenesUrls: [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imagenesUrls",
  });

  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        nombre: data.nombre,
        modelo: data.modelo,
        descripcion: data.descripcion,
        imagenes: data.imagenesUrls
          .map((img) => img.url)
          .filter((url) => url !== ""),
        variantes: [],
      };

      await ProductService.create(payload);

      toast.success("Producto creado correctamente");
      router.push("/admin/productos");
    } catch (err: any) {
      setError(err.message ?? "Error al crear el producto. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-color-principal">
        Crear Nuevo Producto
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección Datos Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Producto
            </label>
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:ring-color-principal focus:border-color-principal"
              placeholder="Ej: iPhone 14 Pro"
            />
            {errors.nombre && (
              <span className="text-red-500 text-xs">
                {errors.nombre.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Modelo
            </label>
            <input
              {...register("modelo", { required: "El modelo es obligatorio" })}
              className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:ring-color-principal focus:border-color-principal"
              placeholder="Ej: A2894"
            />
            {errors.modelo && (
              <span className="text-red-500 text-xs">
                {errors.modelo.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register("descripcion", {
              required: "La descripción es obligatoria",
            })}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-full p-2 focus:ring-color-principal focus:border-color-principal"
          />
        </div>

        {/* Sección Imágenes Dinámicas */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-color-principal flex items-center gap-2">
            <ImageIcon size={18} /> Imágenes del Producto
          </label>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 p-3 border rounded-xl bg-gray-50"
            >
              <div className="flex gap-2">
                <input
                  {...register(`imagenesUrls.${index}.url` as const)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1 border border-gray-300 rounded-full p-2 text-sm"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              {/* Previsualización */}
              {watch(`imagenesUrls.${index}.url`) && (
                <div className="mt-2 relative w-20 h-20 border rounded overflow-hidden">
                  <img
                    src={watch(`imagenesUrls.${index}.url`)}
                    alt="Preview"
                    className="object-cover w-full h-full"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/150?text=Error")
                    }
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ url: "" })}
            className="flex items-center gap-2 text-sm text-color-principal font-semibold hover:underline"
          >
            <Plus size={16} /> Agregar otra imagen
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-color-principal text-white py-3 rounded-full font-bold hover:bg-color-principal-oscuro transition-colors disabled:bg-gray-400 flex justify-center items-center"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Siguiente: Agregar Variantes"
          )}
        </button>
      </form>
    </div>
  );
}
