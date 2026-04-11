"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccesoriosService, CategoriaAccesorio, CATEGORIA_LABELS } from "@/lib/api";
import { Plus, Trash2, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface AccesorioForm {
  nombre: string;
  modelo: string;
  descripcion: string;
  categoria: number;
  imagenesUrls: { url: string }[];
}

const CATEGORIAS = Object.entries(CATEGORIA_LABELS).map(([val, label]) => ({
  value: Number(val),
  label,
}));

export default function NuevoAccesorioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AccesorioForm>({
    defaultValues: {
      categoria: CategoriaAccesorio.Cases,
      imagenesUrls: [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imagenesUrls",
  });

  const onSubmit = async (data: AccesorioForm) => {
    setLoading(true);
    setError(null);
    try {
      const creado = await AccesoriosService.create({
        nombre: data.nombre,
        modelo: data.modelo,
        descripcion: data.descripcion,
        categoria: Number(data.categoria),
        imagenesUrls: data.imagenesUrls
          .map((img) => img.url)
          .filter((url) => url.trim() !== ""),
      });

      toast.success("Accesorio creado correctamente");
      // Redirigir a la página de variantes del accesorio recién creado
      router.push(`/admin/accesorios/${creado.id}/variantes`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) ?? "Error al crear el accesorio. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/accesorios"
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-color-principal">Nuevo Accesorio</h1>
          <p className="text-sm text-gray-500">Completá los datos y luego agregá las variantes</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6"
      >
        {/* Nombre, Modelo y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal"
              placeholder="Ej: Funda MagSafe"
            />
            {errors.nombre && (
              <span className="text-red-500 text-xs">{errors.nombre.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Modelo / Compatibilidad
            </label>
            <input
              {...register("modelo")}
              className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal"
              placeholder="Ej: iPhone 14 / 15"
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            {...register("categoria", { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal bg-white"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register("descripcion")}
            rows={3}
            className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal"
            placeholder="Descripción del accesorio..."
          />
        </div>

        {/* Imágenes */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ImageIcon size={16} className="text-color-principal" />
            Imágenes (URLs)
          </label>

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 p-3 bg-gray-50 border rounded-xl">
              <div className="flex gap-2">
                <input
                  {...register(`imagenesUrls.${index}.url` as const)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1 border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:bg-red-50 p-2 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {watch(`imagenesUrls.${index}.url`) && (
                <div className="relative w-16 h-16 border rounded-xl overflow-hidden">
                  <img
                    src={watch(`imagenesUrls.${index}.url`)}
                    alt="Preview"
                    className="object-cover w-full h-full"
                    onError={(e) =>
                      (e.currentTarget.src = "https://via.placeholder.com/64?text=Error")
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
            <Plus size={15} /> Agregar imagen
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-color-principal text-white px-6 py-2.5 rounded-full font-medium hover:bg-color-principal-oscuro transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Crear y agregar variantes →
          </button>
          <Link
            href="/admin/accesorios"
            className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
