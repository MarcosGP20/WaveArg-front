"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-color-principal" />
            <h2 className="font-bold text-gray-900 text-lg">Mi Carrito</h2>
            {itemCount > 0 && (
              <span className="bg-color-principal text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <ShoppingBag size={52} className="text-gray-200" />
            <p className="font-semibold text-gray-500">Tu carrito está vacío</p>
            <p className="text-sm text-gray-400">Agregá productos para empezar</p>
            <button
              onClick={closeCart}
              className="mt-2 text-sm text-color-principal font-semibold hover:underline"
            >
              Seguir comprando →
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ul className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-gray-50">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                    {item.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaShoppingCart size={18} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info + controls */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-sm font-bold text-color-principal mt-0.5">
                      ${item.price.toLocaleString("es-AR")}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        aria-label="Disminuir cantidad"
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-500 transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Aumentar cantidad"
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-500 transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal + remove */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Eliminar ${item.name}`}
                      className="w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X size={13} />
                    </button>
                    <span className="text-sm font-bold text-gray-900">
                      ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/80">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500 font-medium">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full text-center bg-color-principal hover:bg-color-principal-oscuro text-white font-bold py-3.5 rounded-full transition-colors shadow-lg shadow-blue-900/20"
              >
                Ir a pagar →
              </Link>
              <button
                onClick={closeCart}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors mt-3 py-1"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
