"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Carrito</h1>
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      <ul className="divide-y divide-gray-200 mb-6">
        {cart.map((item) => (
          <li key={item.id} className="flex items-center py-4 gap-4">
            {item.image && (
              <Image
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="rounded"
              />
            )}
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-500">
                ${item.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
                <button
                  className="ml-4 text-red-500 hover:underline"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Eliminar"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg">Total:</span>
        <span className="font-bold text-lg">${total.toFixed(2)}</span>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
          onClick={clearCart}
        >
          Vaciar carrito
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          // Aquí podrías redirigir a checkout
        >
          Ir a pagar
        </button>
      </div>
    </div>
  );
}
