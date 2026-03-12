"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { MercadoPagoService } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard, Loader2, AlertCircle, LogIn } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePagar = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);
    setAuthError(false);

    try {
      // El id del CartItem tiene formato "productoId-varianteId" (ej: "5-3")
      // Extraemos solo la primera parte numérica para enviársela al backend
      const items = cart.map((item) => {
        const productoId = parseInt(item.id.split("-")[0], 10);
        if (isNaN(productoId)) {
          throw new Error(`ID de producto inválido: "${item.id}". Vaciá el carrito y volvé a agregar los productos.`);
        }
        return {
          productoId,
          nombre: item.name,
          cantidad: item.quantity,
          precio: item.price,
        };
      });

      console.log("[Checkout] Enviando a crear-preferencia:", JSON.stringify(items, null, 2));

      const preferencia = await MercadoPagoService.crearPreferencia(items);

      console.log("[Checkout] Respuesta de MP:", preferencia);

      // El backend devuelve: url_real (producción) y url_prueba (sandbox)
      const raw = preferencia as Record<string, unknown>;
      const urlPago =
        (raw.url_real as string) ??      // producción (con credenciales de prueba para testing)
        (raw.url_prueba as string);      // sandbox (fallback)

      if (!urlPago) {
        console.error("[Checkout] Respuesta completa sin URL de pago:", JSON.stringify(raw, null, 2));
        throw new Error(
          "No se recibió la URL de pago de MercadoPago. Revisá la consola para ver la respuesta del backend."
        );
      }

      // Limpiar el carrito antes de redirigir — el pago fue iniciado exitosamente
      clearCart();

      // Redirigir al portal de pago de MercadoPago
      window.location.href = urlPago;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al conectar con MercadoPago. Intentá de nuevo.";

      const msgLower = message.toLowerCase();

      // 401 — sesión no iniciada
      if (msgLower.includes("sesión iniciada") || msgLower.includes("sesión")) {
        setAuthError(true);
      // 403 — credenciales de MercadoPago inválidas en el backend
      } else if (
        msgLower.includes("unauthorized") ||
        msgLower.includes("403") ||
        msgLower.includes("policy")
      ) {
        setError(
          "El servicio de pago no está disponible en este momento. Por favor contactanos por WhatsApp o intentá más tarde."
        );
      } else {
        setError(message);
      }
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-24 px-4 text-center">
        <ShoppingCart size={64} className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-500 mb-6">
          Agregá productos antes de continuar con el pago.
        </p>
        <Link
          href="/products"
          className="bg-[#05467D] text-white px-8 py-3 rounded-full hover:bg-[#063c68] transition font-semibold"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#05467D]">Checkout</h1>
          <p className="text-gray-500 mt-1">
            Revisá tu pedido y continuá con el pago seguro
          </p>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Resumen del pedido
          </h2>

          <ul className="divide-y divide-gray-100">
            {cart.map((item) => (
              <li key={item.id} className="py-4 flex items-center gap-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-xl object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart size={24} className="text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ${item.price.toLocaleString("es-AR")}
                  </p>
                </div>

                <div className="font-bold text-gray-900 text-right">
                  ${(item.price * item.quantity).toLocaleString("es-AR")}
                </div>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-[#05467D]">
              ${total.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Info de pago */}
        <div className="bg-[#05467D]/5 border border-[#05467D]/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <CreditCard className="text-[#05467D] mt-0.5 shrink-0" size={20} />
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-[#05467D] mb-0.5">
              Pago seguro con MercadoPago
            </p>
            <p>
              Serás redirigido al portal de pago de MercadoPago donde podrás
              abonar con tarjeta de crédito, débito, transferencia o efectivo.
            </p>
          </div>
        </div>

        {/* Error de sesión no iniciada */}
        {authError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <LogIn className="text-amber-500 shrink-0 mt-0.5" size={22} />
            <div className="flex-1">
              <p className="font-semibold text-amber-800 mb-1">
                Necesitás iniciar sesión
              </p>
              <p className="text-amber-700 text-sm mb-4">
                Para continuar con el pago es necesario que tengas una sesión
                iniciada. Por favor, iniciá sesión y volvé a intentarlo.
              </p>
              <button
                onClick={() => router.push(`/login?redirect=/checkout`)}
                className="bg-[#05467D] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#063c68] transition flex items-center gap-2"
              >
                <LogIn size={16} />
                Iniciar sesión
              </button>
            </div>
          </div>
        )}

        {/* Error genérico */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="font-semibold text-red-700 mb-0.5">
                Ocurrió un error
              </p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Botón de pago */}
        <button
          onClick={handlePagar}
          disabled={loading}
          className="w-full bg-[#009EE3] hover:bg-[#008dcc] active:bg-[#007ab8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg transition-all duration-200 shadow-lg shadow-[#009EE3]/30"
        >
          {loading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              Conectando con MercadoPago…
            </>
          ) : (
            <>
              {/* Logo MP inline */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-6 h-6 fill-white"
              >
                <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm0 36c-8.8 0-16-7.2-16-16S15.2 8 24 8s16 7.2 16 16-7.2 16-16 16zm-2-22h4v12h-4zm0-6h4v4h-4z" />
              </svg>
              Pagar con MercadoPago
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Al continuar aceptás los{" "}
          <a href="#" className="underline hover:text-gray-600">
            términos y condiciones
          </a>{" "}
          de la compra.
        </p>

        {/* Volver al carrito */}
        <div className="mt-6 text-center">
          <Link
            href="/cart"
            className="text-[#05467D] hover:underline text-sm font-medium"
          >
            ← Volver al carrito
          </Link>
        </div>
      </div>
    </div>
  );
}
