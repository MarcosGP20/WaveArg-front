"use client";

import {
  Trash2,
  Edit3,
  Loader2,
  PackageOpen,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { AccesorioVariante, AccesorioVariantesService } from "@/lib/api";
import { toast } from "sonner";

interface TableAccesorioVariantsProps {
  variantes: AccesorioVariante[];
  loading: boolean;
  onDelete?: (id: number) => void;
}

export const TableAccesorioVariants = ({
  variantes,
  loading,
  onDelete,
}: TableAccesorioVariantsProps) => {
  const [editingVariant, setEditingVariant] = useState<AccesorioVariante | null>(null);
  const [editValues, setEditValues] = useState({ precio: "", stock: "" });
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (v: AccesorioVariante) => {
    setEditingVariant(v);
    setEditValues({ precio: v.precio.toString(), stock: v.stock.toString() });
  };

  const cancelEdit = () => {
    setEditingVariant(null);
    setEditValues({ precio: "", stock: "" });
  };

  const saveEdit = async () => {
    if (!editingVariant) return;
    const precio = Number(editValues.precio);
    const stock = Number(editValues.stock);

    if (isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0) {
      toast.error("Ingresá valores numéricos válidos.");
      return;
    }

    setIsSaving(true);
    try {
      // color y memoria son required en el DTO — los mandamos con sus valores actuales
      await AccesorioVariantesService.update(editingVariant.id, {
        precio,
        stock,
        color: editingVariant.color,
        especificacion: editingVariant.especificacion,
      });
      toast.success("Variante actualizada correctamente");
      cancelEdit();
      window.location.reload();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err) ?? "Error al actualizar");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
        <Loader2 className="animate-spin text-color-principal mb-4" size={40} />
        <p className="text-gray-500 font-medium">
          Consultando stock en base de datos...
        </p>
      </div>
    );
  }

  if (!variantes || variantes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border-2 border-dashed border-gray-100">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <PackageOpen size={40} className="text-gray-300" />
        </div>
        <h3 className="text-gray-900 font-semibold">No hay stock registrado</h3>
        <p className="text-gray-500 text-sm max-w-[250px] text-center mt-1">
          Este modelo aún no tiene variantes cargadas. Usá el formulario de
          arriba para empezar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Color</th>
              <th className="px-6 py-4">Especificación</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {variantes.map((v) => (
              <>
                <tr
                  key={v.id}
                  className={`hover:bg-blue-50/20 transition-colors group ${
                    editingVariant?.id === v.id ? "bg-blue-50/30" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {v.color}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 max-w-[200px] truncate">
                    {(v as unknown as Record<string, any>)?.especificacion ?? "-"}
                  </td>
                  <td className="px-6 py-4 font-bold text-color-principal">
                    USD {v.precio.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {v.stock}
                  </td>
                  <td className="px-6 py-4">
                    {v.imagenes && v.imagenes.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">{v.imagenes.length} foto(s)</span>
                        <a
                          href={v.imagenes[0]}
                          target="_blank"
                          className="text-blue-500 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink size={10} /> Ver primera
                        </a>
                      </div>
                    ) : v.fotoEstadoUrl ? (
                      <a
                        href={v.fotoEstadoUrl}
                        target="_blank"
                        className="text-blue-500 hover:underline flex items-center gap-1 text-xs"
                      >
                        <ExternalLink size={12} /> Ver
                      </a>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(v)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar variante"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        disabled={!onDelete}
                        onClick={() => onDelete?.(v.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600"
                        title="Eliminar variante"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Fila de edición inline */}
                {editingVariant?.id === v.id && (
                  <tr key={`edit-${v.id}`} className="bg-blue-50/40">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Precio (USD)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={editValues.precio}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                precio: e.target.value,
                              }))
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-color-principal"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Stock
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={editValues.stock}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                stock: e.target.value,
                              }))
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-color-principal"
                          />
                        </div>
                        <div className="flex gap-2 pb-0.5">
                          <button
                            onClick={() => saveEdit()}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 bg-color-principal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-color-principal-oscuro transition-colors disabled:opacity-50"
                          >
                            {isSaving ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            Guardar
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            <X size={14} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
