"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductService } from "@/lib/api";
import { Plus, Trash2, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ProductEditForm {
  nombre: string;
  modelo: string;
  descripcion: string;
  imagenesUrls: { url: string }[];
}

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ProductEditForm>({
    defaultValues: { imagenesUrls: [{ url: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imagenesUrls",
  });

  // Carga los datos actuales del producto
  useEffect(() => {
    if (!id) return;
    ProductService.getById(id)
      .then((p) => {
        reset({
          nombre: p.nombre,
          modelo: p.modelo,
          descripcion: p.descripcion,
          imagenesUrls:
            p.imagenes?.length > 0
              ? p.imagenes.map((url) => ({ url }))
              : [{ url: "" }],
        });
      })
      .catch((err) => setFetchError(err.message ?? "Error al cargar el producto"))
      .finally(() => setLoadingData(false));
  }, [id, reset]);

  const onSubmit = async (data: ProductEditForm) => {
    setSaving(true);
    try {
      await ProductService.update(id, {
        nombre: data.nombre,
        modelo: data.modelo,
        descripcion: data.descripcion,
        imagenes: data.imagenesUrls
          .map((img) => img.url)
          .filter((url) => url.trim() !== ""),
      });
      toast.success("Producto actualizado correctamente");
      router.push("/admin/productos");
    } catch (err: any) {
      toast.error(err.message ?? "Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  // --- Estados de carga y error ---
  if (loadingData)
    return (
      <div className="flex items-center justify-center h-[60vh] gap-3 text-gray-500">
        <Loader2 className="animate-spin" size={24} />
        Cargando producto...
      </div>
    );

  if (fetchError)
    return (
      <div className="p-6 text-center text-red-600 font-medium">{fetchError}</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/productos"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-color-principal">Editar Producto</h1>
          <p className="text-sm text-gray-500">ID #{id}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6"
      >
        {/* Nombre y Modelo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto
            </label>
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal"
              placeholder="Ej: iPhone 15 Pro"
            />
            {errors.nombre && (
              <span className="text-red-500 text-xs mt-1">{errors.nombre.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo
            </label>
            <input
              {...register("modelo", { required: "El modelo es obligatorio" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal"
              placeholder="Ej: A3293"
            />
            {errors.modelo && (
              <span className="text-red-500 text-xs mt-1">{errors.modelo.message}</span>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            {...register("descripcion", { required: "La descripción es obligatoria" })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal"
          />
          {errors.descripcion && (
            <span className="text-red-500 text-xs mt-1">{errors.descripcion.message}</span>
          )}
        </div>

        {/* Imágenes */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ImageIcon size={16} className="text-color-principal" />
            Imágenes (URLs)
          </label>

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 p-3 bg-gray-50 border rounded-lg">
              <div className="flex gap-2">
                <input
                  {...register(`imagenesUrls.${index}.url` as const)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color-principal"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {/* Preview */}
              {watch(`imagenesUrls.${index}.url`) && (
                <div className="relative w-16 h-16 border rounded-lg overflow-hidden">
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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-color-principal text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#043a68] transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            Guardar cambios
          </button>
          <Link
            href="/admin/productos"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
