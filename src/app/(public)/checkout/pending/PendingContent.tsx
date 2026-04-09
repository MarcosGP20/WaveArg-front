"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PendingContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const cleared = useRef(false);

  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-28 h-28 bg-yellow-100 rounded-full flex items-center justify-center mb-8">
        <Clock size={64} className="text-yellow-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Pago en proceso
      </h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Tu pago está pendiente de acreditación. Si pagaste en efectivo, puede
        demorar hasta 2 días hábiles. Te notificaremos por email cuando se
        confirme.
      </p>

      {paymentId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8 text-sm text-gray-600">
          Referencia de pago:{" "}
          <span className="font-mono font-semibold">{paymentId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/products"
          className="bg-color-principal text-white px-8 py-3 rounded-full hover:bg-color-principal-oscuro transition font-semibold"
        >
          Seguir comprando
        </Link>
        <Link
          href="/account/profile"
          className="border border-color-principal text-color-principal px-8 py-3 rounded-full hover:bg-color-principal/5 transition font-semibold"
        >
          Ver mis pedidos
        </Link>
      </div>
    </div>
  );
}
