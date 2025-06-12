"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [isLoggedIn] = useState(true); // <-- cambiar esto a false para simular logout

  const linkStyle = (href: string) =>
    `px-3 py-1 rounded-md hover:bg-gray-200 transition ${
      pathname === href ? "font-bold underline" : ""
    }`;

  return (
    <nav className="flex justify-between items-center p-4 border-b shadow-sm bg-white">
      {/* Logo / Título */}
      <Link href="/" className="text-2xl font-bold">
        iStore
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4">
        <Link href="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link href="/products" className={linkStyle("/products")}>
          Productos
        </Link>
        <Link href="/cart" className={linkStyle("/cart")}>
          <FaShoppingCart className="inline mr-1" /> Carrito
        </Link>

        {/* Mostrar solo si está logueado */}
        {isLoggedIn && (
          <Link href="/" className={linkStyle("/account")}>
            <FaUserCircle className="inline mr-1" /> Mi cuenta
          </Link>
        )}
      </div>
    </nav>
  );
}
