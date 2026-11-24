"use client";

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { crearAlmacenCarrito, type ItemCarrito } from "@/lib/carrito";

export type CartItem = ItemCarrito;

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Un solo almacén por pestaña. En el servidor no hay localStorage: el carrito arranca vacío
// (getServerSnapshot) y el cliente lo lee recién al hidratar, sin desajuste.
const almacen = typeof window !== "undefined" ? crearAlmacenCarrito(window.localStorage) : null;
const vacio: CartItem[] = [];

function suscribir(aviso: () => void) {
  if (!almacen) return () => {};
  const baja = almacen.subscribe(aviso);
  // Otra pestaña cambió el carrito.
  const alCambiarStorage = (e: StorageEvent) => {
    if (e.key === "cart" || e.key === null) almacen.notificar();
  };
  window.addEventListener("storage", alCambiarStorage);
  return () => {
    baja();
    window.removeEventListener("storage", alCambiarStorage);
  };
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cart = useSyncExternalStore(
    suscribir,
    () => almacen?.getSnapshot() ?? vacio,
    () => vacio,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const setCart = (fn: (prev: CartItem[]) => CartItem[]) => almacen?.actualizar(fn);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCart(() => []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};
