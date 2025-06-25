"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function NavBar() {
  const pathname = usePathname();
  const [isLoggedIn] = useState(true); // <-- cambiar esto a false para simular logout

  const linkStyle = (href: string) =>
    `px-3 py-1 rounded-md hover:bg-gray-200 transition ${
      pathname === href ? "font-bold underline" : ""
    }`;
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center p-4 border-b shadow-sm bg-white">
      {/* Logo / Título */}
      <Link href="/" className="text-2xl font-bold">
        WaveArg 🌊
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4">
        <Link href="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link href="/products" className={linkStyle("/products")}>
          Productos
        </Link>
        <Link href="/cart" className="relative">
          <FaShoppingCart size={28} className="text-[#333]" />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#05467D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {isLoggedIn && (
          <Link href="/" className={linkStyle("/account")}>
            <FaUserCircle className="inline mr-1" /> Mi cuenta
          </Link>
        )}
      </div>
    </nav>
  );
}
