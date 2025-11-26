// src/app/admin/products/page.tsx
import Link from "next/link";

// 1. DATA MOCK (Simulamos MODELOS, no productos individuales)
const MOCK_MODELS = [
  {
    id: 101,
    name: "iPhone 14 Pro",
    modelo: "A2890",
    // Estos datos serían calculados por el backend sumando las variantes
    stockTotal: 15,
    precioDesde: 800,
    precioHasta: 1100,
    imagen:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-deep-purple-select?wid=940&hei=1112&fmt=png-alpha",
  },
  {
    id: 102,
    name: "iPhone 13",
    modelo: "Standard",
    stockTotal: 4,
    precioDesde: 500,
    precioHasta: 650,
    imagen:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pink-select-2021?wid=940&hei=1112&fmt=png-alpha",
  },
  {
    id: 103,
    name: "iPhone 15 Pro Max",
    modelo: "Titanium",
    stockTotal: 0, // Ejemplo sin stock
    precioDesde: 0,
    precioHasta: 0,
    imagen:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-black-titanium-select-202309?wid=940&hei=1112&fmt=png-alpha",
  },
];

export default function ProductsListPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-500">
            Gestiona tus modelos y su stock disponible.
          </p>
        </div>

        {/* Este botón va al ALTA DE PRODUCTO NUEVO (Padre) */}
        <Link
          href="/admin/products/create"
          className="bg-[#05467D] hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg flex items-center gap-2"
        >
          <span>+</span> Nuevo Modelo
        </Link>
      </div>

      {/* Tabla de Modelos */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs border-b">
              <tr>
                <th className="p-4">Modelo</th>
                <th className="p-4">Ref.</th>
                <th className="p-4">Rango Precios</th>
                <th className="p-4">Stock Total</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_MODELS.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {/* Columna Producto */}
                  <td className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border p-1">
                      <img
                        src={product.imagen}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <span className="font-bold text-gray-900">
                      {product.name}
                    </span>
                  </td>

                  {/* Columna Referencia */}
                  <td className="p-4">{product.modelo}</td>

                  {/* Columna Precios (Muestra rango si hay variantes) */}
                  <td className="p-4 font-medium text-gray-900">
                    {product.stockTotal > 0 ? (
                      `$${product.precioDesde} - $${product.precioHasta}`
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Columna Stock (Badge de estado) */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${
                          product.stockTotal > 0
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                    >
                      {product.stockTotal > 0
                        ? `${product.stockTotal} un.`
                        : "Sin Stock"}
                    </span>
                  </td>

                  {/* Columna Acciones (EL LINK CLAVE) */}
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-[#05467D] hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-transparent hover:border-blue-100"
                    >
                      Gestionar Variantes →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
