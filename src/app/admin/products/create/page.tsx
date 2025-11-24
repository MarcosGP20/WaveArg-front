// src/app/admin/products/create/page.tsx
import CreateProductForm from "@/components/admin/CreateProductForm";
import Link from "next/link"; // Para el botón de volver atrás

export default function CreateProductPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Cabecera de la sección */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Crear Producto
          </h1>
          <p className="text-muted-foreground mt-1">
            Ingresa los detalles del nuevo iPhone para el inventario.
          </p>
        </div>

        {/* Botón para cancelar/volver */}
        <Link
          href="/admin/products/create"
          className="text-sm text-gray-600 hover:text-black underline"
        >
          Cancelar y volver
        </Link>
      </div>

      {/* Aquí renderizamos el componente del formulario */}
      <CreateProductForm />
    </div>
  );
}
