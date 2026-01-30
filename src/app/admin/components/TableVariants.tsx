"use client";

import {
  Trash2,
  Edit3,
  Loader2,
  PackageOpen,
  ExternalLink,
} from "lucide-react";
import { Variante } from "@/lib/api";

interface TableVariantsProps {
  variantes: Variante[];
  loading: boolean;
  onDelete?: (id: number) => void;
}

export const TableVariants = ({
  variantes,
  loading,
  onDelete,
}: TableVariantsProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
        <Loader2 className="animate-spin text-[#05467d] mb-4" size={40} />
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
              <th className="px-6 py-4">Memoria</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {variantes.map((v) => (
              <tr
                key={v.id}
                className="hover:bg-blue-50/20 transition-colors group"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {v.color}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-600">
                  {v.memoria}
                </td>
                <td className="px-6 py-4 font-bold text-[#05467d]">
                  USD {v.precio.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {v.stock}
                </td>
                <td className="px-6 py-4">
                  {v.fotoEstadoUrl ? (
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
                    <button className="p-1.5 text-gray-400 hover:text-blue-600">
                      <Edit3 size={16} />
                    </button>
                    <button
                      disabled={!onDelete}
                      onClick={() => onDelete?.(v.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
