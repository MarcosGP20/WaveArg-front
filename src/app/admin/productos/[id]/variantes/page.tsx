"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductService } from "@/lib/api";
import { Producto } from "@/interfaces/producto";

export default function AgregarVariantesPage() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    if (id) {
      // Cargamos los datos del producto para mostrar el nombre en el título
      ProductService.getById(id as string).then(setProducto);
    }
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border-t-4 border-[#05467d]">
      <h1 className="text-2xl font-bold text-[#05467d] mb-2">
        Agregar Variantes
      </h1>
      {producto ? (
        <p className="text-gray-600 mb-6">
          Producto:{" "}
          <span className="font-semibold text-black">{producto.nombre}</span>{" "}
          (Modelo: {producto.modelo})
        </p>
      ) : (
        <div className="animate-pulse h-6 w-48 bg-gray-200 rounded mb-6"></div>
      )}

      {/* Aquí irá el formulario de variantes que haremos a continuación */}
      <div className="p-10 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400">
        Próximamente: Formulario de Variantes para el ID: {id}
      </div>
    </div>
  );
}
