"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const cleared = useRef(false);

  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const merchantOrderId = searchParams.get("merchant_order_id");

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Ícono animado */}
      <div className="relative mb-8">
        <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center animate-bounce-once">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        ¡Pago aprobado!
      </h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Tu compra fue procesada con éxito. En breve recibirás la confirmación
        por email.
      </p>

      {/* Detalles del pago */}
      {paymentId && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 text-left w-full max-w-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">
            Detalle del pago
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-500">ID de pago</span>
                <span className="font-mono font-semibold">{paymentId}</span>
              </div>
            )}
            {status && (
              <div className="flex justify-between">
                <span className="text-gray-500">Estado</span>
                <span className="font-semibold capitalize text-green-700">
                  {status}
                </span>
              </div>
            )}
            {merchantOrderId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Orden</span>
                <span className="font-mono font-semibold">
                  #{merchantOrderId}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/products"
          className="bg-[#05467D] text-white px-8 py-3 rounded-full hover:bg-[#063c68] transition font-semibold"
        >
          Seguir comprando
        </Link>
        <Link
          href="/account/profile"
          className="border border-[#05467D] text-[#05467D] px-8 py-3 rounded-full hover:bg-[#05467D]/5 transition font-semibold"
        >
          Ver mis pedidos
        </Link>
      </div>
    </div>
  );
}
