"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const { isLoggedIn, role, logout } = useAuth();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const linkStyle = (href: string) =>
    `px-3 py-2 rounded-md hover:bg-gray-200 transition text-[#05467D] ${
      pathname === href ? "font-bold " : ""
    }`;

  const links = (
    <>
      <Link
        href="/"
        className={linkStyle("/")}
        onClick={() => setMenuOpen(false)}
      >
        Inicio
      </Link>

      <Link
        href="/products"
        className={linkStyle("/products")}
        onClick={() => setMenuOpen(false)}
      >
        Productos
      </Link>
      <Link
        href="/mayorista "
        className={linkStyle("/mayorista")}
        onClick={() => setMenuOpen(false)}
      >
        Mayorista
      </Link>
      <Link
        href="/mayorista "
        className={linkStyle("/mayorista")}
        onClick={() => setMenuOpen(false)}
      >
        Guia creadores
      </Link>
      <Link
        href="/mayorista "
        className={linkStyle("/mayorista")}
        onClick={() => setMenuOpen(false)}
      >
        Contacto
      </Link>

      <Link
        href="/cart"
        className="relative px-3 py-2"
        onClick={() => setMenuOpen(false)}
      >
        <div className="relative inline-block">
          <FaShoppingCart size={24} className="text-[#333]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#05467D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </Link>

      {isLoggedIn && (
        <Link
          href="/account"
          className={linkStyle("/account")}
          onClick={() => setMenuOpen(false)}
        >
          <FaUserCircle className="inline mr-1" /> Mi cuenta
        </Link>
      )}

      {role === "admin" && (
        <Link
          href="/admin"
          className={linkStyle("/admin")}
          onClick={() => setMenuOpen(false)}
        >
          Panel Admin
        </Link>
      )}

      {isLoggedIn ? (
        <button
          onClick={() => {
            logout();
            setMenuOpen(false);
          }}
          className="text-sm text-red-600 hover:underline ml-2"
        >
          Cerrar sesión
        </button>
      ) : (
        <Link
          href="/login"
          className={linkStyle("/login")}
          onClick={() => setMenuOpen(false)}
        >
          Iniciar sesión
        </Link>
      )}
    </>
  );

  return (
    <nav className="p-4 border-b shadow-sm bg-white relative  ">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image
            src="/waves5.svg"
            alt="Logo"
            width={120}
            height={120}
            className="hidden md:block"
            priority
          />
        </Link>
        <Link href="/">
          <Image
            src="iso3.svg"
            alt="Logo"
            width={40}
            height={40}
            className="md:hidden "
          />
        </Link>

        <div className="hidden md:flex items-center gap-4">{links}</div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-2 mt-3 md:hidden">{links}</div>
      )}
    </nav>
  );
}
