"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailureContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-28 h-28 bg-red-100 rounded-full flex items-center justify-center mb-8">
        <XCircle size={64} className="text-red-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        El pago no fue aprobado
      </h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Tu pago no pudo procesarse. Podés intentarlo de nuevo o comunicarte con
        nosotros si el problema persiste.
      </p>

      {paymentId && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-sm text-gray-600">
          Referencia de pago:{" "}
          <span className="font-mono font-semibold">{paymentId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/checkout"
          className="bg-[#05467D] text-white px-8 py-3 rounded-full hover:bg-[#063c68] transition font-semibold"
        >
          Reintentar pago
        </Link>
        <Link
          href="/cart"
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition font-semibold"
        >
          Volver al carrito
        </Link>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <FailureContent />
    </Suspense>
  );
}
