"use client";

import { products } from "@/lib/mock/products";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, ChevronRight, Check } from "lucide-react";

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block bg-[#05467D] text-white text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}
    >
      {children}
    </span>
  );
}

function DiscountBadge({ discount }: { discount: number }) {
  return (
    <span className="inline-block bg-[#E6F2FF] text-[#05467D] text-xs font-semibold px-2 py-0.5 rounded-full ml-2">
      {discount}% OFF
    </span>
  );
}

export default function WholesalePage() {
  return (
    <div className="p-6 md:p-12 space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-[#05467D]">Compra Mayorista</h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Precios especiales por volumen. Ideal para empresas, negocios y
          revendedores.
        </p>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtrar por:</span>
          <Button
            variant="outline"
            size="sm"
            className="text-[#05467D] border-gray-300"
          >
            iPhone 15
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-[#05467D] border-gray-300"
          >
            iPhone 14
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-[#05467D] border-gray-300"
          >
            iPhone 13
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Ordenar por:</span>
          <Button
            variant="outline"
            size="sm"
            className="text-[#05467D] border-gray-300"
          >
            Más reciente <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const basePrice = Math.floor(product.precio * 0.9);
          const discount3 = Math.floor(
            (1 - (product.precio * 0.88) / basePrice) * 100
          );
          const discount5 = Math.floor(
            (1 - (product.precio * 0.85) / basePrice) * 100
          );
          const discount10 = Math.floor(
            (1 - (product.precio * 0.82) / basePrice) * 100
          );

          return (
            <div
              key={product.id}
              className="flex flex-col border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden group"
            >
              <div className="relative">
                <div className="bg-white p-6 flex justify-center items-center h-48">
                  <Image
                    src={product.image}
                    alt={product.nombre}
                    width={150}
                    height={150}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <Badge className="absolute top-3 left-3">Mayorista</Badge>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-[#333] line-clamp-1">
                      {product.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.color} · {product.memoria}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">Stock:</span>
                    <span className="text-sm font-medium">
                      {product.stock || 10}+
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-[#05467D]">
                    ${basePrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    ${product.precio.toLocaleString()}
                  </p>
                  <DiscountBadge discount={10} />
                </div>

                <div className="bg-[#F7FAFF] rounded-lg p-3 text-sm text-gray-700 space-y-2 border border-[#E6F2FF]">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">3 unidades</span>
                    <div className="flex items-center">
                      <span className="font-semibold text-[#05467D]">
                        ${Math.floor(product.precio * 0.88).toLocaleString()}
                      </span>
                      <DiscountBadge discount={discount3} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">5 unidades</span>
                    <div className="flex items-center">
                      <span className="font-semibold text-[#05467D]">
                        ${Math.floor(product.precio * 0.85).toLocaleString()}
                      </span>
                      <DiscountBadge discount={discount5} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">10+ unidades</span>
                    <div className="flex items-center">
                      <span className="font-semibold text-[#05467D]">
                        ${Math.floor(product.precio * 0.82).toLocaleString()}
                      </span>
                      <DiscountBadge discount={discount10} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3 mt-2">
                  <span className="flex items-center gap-1.5">
                    <div className="bg-[#E6F2FF] p-1 rounded-full">
                      <Truck className="w-3 h-3 text-[#05467D]" />
                    </div>
                    Envío gratis
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="bg-[#E6F2FF] p-1 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-[#05467D]" />
                    </div>
                    Garantía 12 meses
                  </span>
                </div>

                <Button className="mt-4 bg-[#05467D] hover:bg-[#0F3C64] text-white w-full group-[.added]:bg-green-600 group-[.added]:hover:bg-green-700">
                  <span className="group-[.added]:hidden">
                    Agregar al carrito
                  </span>
                  <span className="hidden group-[.added]:inline-flex items-center gap-1">
                    <Check className="w-4 h-4" /> Añadido
                  </span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link href="/contacto">
          <Button
            variant="outline"
            className="mt-6 px-8 py-3 text-[#05467D] border-[#05467D] hover:bg-[#F0F8FF] hover:text-[#05467D] transition-colors"
          >
            ¿Necesitas más de 20 unidades? Solicitar cotización personalizada
          </Button>
        </Link>
      </div>
    </div>
  );
}
