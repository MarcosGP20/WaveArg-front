"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import { ShoppingCart, X, Clock } from "lucide-react";
import Link from "next/link";

const DELAY_MS = 2 * 60 * 1000; // 2 minutos
const DISMISS_KEY = "cart-reminder-dismissed-until";

// Páginas donde no tiene sentido mostrar el reminder
const EXCLUDED = ["/checkout", "/cart"];

function isDismissed(): boolean {
  try {
    const until = localStorage.getItem(DISMISS_KEY);
    return !!until && Date.now() < Number(until);
  } catch {
    return false;
  }
}

function dismiss24h() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
  } catch {}
}

export default function CartAbandonmentReminder() {
  const { cart } = useCart();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExcluded = EXCLUDED.some((p) => pathname.startsWith(p));
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // No disparar si carrito vacío, en página excluida, o ya visible
    if (cartCount === 0 || isExcluded || visible) return;

    timerRef.current = setTimeout(() => {
      if (!isDismissed()) {
        setVisible(true);
        requestAnimationFrame(() => setAnimate(true));
      }
    }, DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartCount, pathname, isExcluded]);

  // Ocultar si el carrito se vacía
  useEffect(() => {
    if (cartCount === 0) {
      setAnimate(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [cartCount]);

  const handleDismiss = () => {
    dismiss24h();
    setAnimate(false);
    setTimeout(() => setVisible(false), 300);
  };

  const handleCheckout = () => {
    setAnimate(false);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  const previewItems = cart.slice(0, 3);
  const remaining = cart.length - previewItems.length;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Recordatorio de carrito"
      className={`
        fixed bottom-6 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]
        bg-white rounded-2xl shadow-2xl border border-gray-100
        transition-all duration-300 ease-out
        ${animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-color-principal rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-white/80" />
          <span className="text-white text-sm font-semibold">
            ¿Te olvidaste algo?
          </span>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Cerrar recordatorio"
          className="text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-gray-400 mb-3">
          Tenés{" "}
          <span className="font-semibold text-gray-700">
            {cartCount} {cartCount === 1 ? "producto" : "productos"}
          </span>{" "}
          esperando en tu carrito.
        </p>

        {/* Items */}
        <ul className="space-y-2 mb-3">
          {previewItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl object-contain border border-gray-100 flex-shrink-0 bg-gray-50"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-color-principal/10 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart size={14} className="text-color-principal" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400">
                  x{item.quantity} · ${(item.price * item.quantity).toLocaleString("es-AR")}
                </p>
              </div>
            </li>
          ))}
          {remaining > 0 && (
            <li className="text-xs text-gray-400 pl-1">
              + {remaining} producto{remaining > 1 ? "s" : ""} más
            </li>
          )}
        </ul>

        {/* Total */}
        <div className="flex justify-between items-center py-2 border-t border-gray-100">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Total
          </span>
          <span className="text-base font-bold text-gray-900">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
        <Link
          href="/checkout"
          onClick={handleCheckout}
          className="block w-full text-center bg-color-principal hover:bg-color-principal-oscuro text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          Ir a pagar →
        </Link>
        <button
          onClick={handleDismiss}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          Ahora no, gracias
        </button>
      </div>
    </div>
  );
}
