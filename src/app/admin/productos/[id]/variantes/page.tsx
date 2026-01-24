"use client";

import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { VariantesService, ProductService, Producto } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function GestionVariantesPage() {
  const { id } = useParams();
  const router = useRouter();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loadingProducto, setLoadingProducto] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      variantes: [
        {
          color: "",
          memoria: "128GB",
          precio: 0,
          stock: 1,
          esUsado: false,
          detalleEstado: "100%",
          fotoEstadoUrl: "", // Inicializamos el campo de URL
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variantes",
  });

  useEffect(() => {
    if (id) {
      setLoadingProducto(true);
      ProductService.getById(Number(id))
        .then((data) => setProducto(data))
        .catch(() =>
          toast.error("No se pudo cargar la información del producto"),
        )
        .finally(() => setLoadingProducto(false));
    }
  }, [id]);

  const onSubmit = async (data: any) => {
    if (!id) return toast.error("No se encontró el ID del producto");

    setIsSubmitting(true);

    const savePromise = async () => {
      const peticiones = data.variantes.map((v: any) => {
        const payload = {
          productoId: Number(id),
          color: v.color,
          memoria: v.memoria,
          precio: Number(v.precio),
          stock: Number(v.stock),
          esUsado: v.esUsado,
          detalleEstado: v.esUsado ? `Batería: ${v.detalleEstado}` : "Nuevo",
          // Enviamos la URL provisoria o string vacío si es nuevo
          fotoEstadoUrl: v.esUsado ? v.fotoEstadoUrl : "",
        };
        return VariantesService.create(payload);
      });

      return await Promise.all(peticiones);
    };

    toast.promise(savePromise(), {
      loading: "Sincronizando con el servidor...",
      success: () => {
        setIsSubmitting(false);
        router.refresh();
        return "Variantes guardadas correctamente";
      },
      error: (err) => {
        setIsSubmitting(false);
        return `Error: ${err.message || "Revisa la consola"}`;
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/productos"
          className="text-gray-500 hover:text-[#05467d] transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#05467d]">
            {loadingProducto ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Cargando...
              </span>
            ) : (
              <>
                Gestionar Variantes de{" "}
                <span className="text-blue-700 font-extrabold">
                  "{producto?.nombre} {producto?.modelo}"
                </span>
              </>
            )}
          </h1>
          {!loadingProducto && (
            <p className="text-sm text-gray-400 font-medium">ID Base: #{id}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr className="text-xs font-bold text-gray-500 uppercase">
                <th className="p-4">Color</th>
                <th className="p-4">Memoria</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Batería/Detalle</th>
                <th className="p-4">Precio (USD)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">URL Foto (Provisorio)</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fields.map((field, index) => {
                const esUsado = watch(`variantes.${index}.esUsado`);

                return (
                  <tr
                    key={field.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-3">
                      <input
                        {...register(`variantes.${index}.color`)}
                        placeholder="Color"
                        className="w-full p-2 border rounded text-sm"
                        required
                      />
                    </td>
                    <td className="p-3">
                      <select
                        {...register(`variantes.${index}.memoria`)}
                        className="w-full p-2 border rounded text-sm"
                      >
                        <option value="128GB">128GB</option>
                        <option value="256GB">256GB</option>
                        <option value="512GB">512GB</option>
                        <option value="1TB">1TB</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        className="w-full p-2 border rounded text-sm"
                        onChange={(e) =>
                          setValue(
                            `variantes.${index}.esUsado`,
                            e.target.value === "true",
                          )
                        }
                      >
                        <option value="false">Nuevo</option>
                        <option value="true">Usado</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        {...register(`variantes.${index}.detalleEstado`)}
                        disabled={!esUsado}
                        placeholder={esUsado ? "Ej: 95%" : "N/A"}
                        className={`w-full p-2 border rounded text-sm ${!esUsado ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        {...register(`variantes.${index}.precio`)}
                        className="w-full p-2 border rounded text-sm font-semibold"
                        required
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        {...register(`variantes.${index}.stock`)}
                        className="w-full p-2 border rounded text-sm"
                        required
                      />
                    </td>
                    {/* CAMPO DE URL PROVISORIO */}
                    <td className="p-3">
                      {esUsado ? (
                        <div className="flex items-center gap-2">
                          <ImageIcon
                            size={16}
                            className="text-gray-400 shrink-0"
                          />
                          <input
                            {...register(`variantes.${index}.fotoEstadoUrl`)}
                            placeholder="https://url-de-la-foto.jpg"
                            className="w-full p-2 border rounded text-xs bg-blue-50/30"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">
                          No requiere foto real
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 border-t">
            <button
              type="button"
              onClick={() =>
                append({
                  color: "",
                  memoria: "128GB",
                  precio: 0,
                  stock: 1,
                  esUsado: false,
                  detalleEstado: "100%",
                  fotoEstadoUrl: "",
                })
              }
              className="flex items-center gap-2 text-[#05467d] font-bold text-sm"
            >
              <Plus size={16} /> Agregar Variante
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loadingProducto}
          className="w-full bg-[#05467d] text-white py-4 rounded-xl font-bold hover:bg-[#043a68] disabled:bg-gray-400 flex justify-center items-center gap-2 shadow-lg transition-all"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Save size={20} /> Guardar Variantes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
