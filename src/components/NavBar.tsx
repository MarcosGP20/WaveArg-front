"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import DropdownItem from "./DropdownItem";

// --- 1. CONFIGURACIÓN DEL MENÚ (DATA DRIVEN) ---
const menuItems = [
  {
    titulo: "iPhone 15",
    slugFamilia: "iphone-15",
    variantes: [
      { nombre: "Base", slugModelo: "base" },
      { nombre: "Plus", slugModelo: "plus" },
      { nombre: "Pro", slugModelo: "pro" },
      { nombre: "Pro Max", slugModelo: "pro-max" },
    ],
  },
  {
    titulo: "iPhone 14",
    slugFamilia: "iphone-14",
    variantes: [
      { nombre: "Base", slugModelo: "base" },
      { nombre: "Pro", slugModelo: "pro" },
    ],
  },
  {
    titulo: "iPhone 13",
    slugFamilia: "iphone-13",
    variantes: [{ nombre: "Base", slugModelo: "base" }],
  },
  {
    titulo: "iPhone 12",
    slugFamilia: "iphone-12",
    variantes: [
      { nombre: "Base", slugModelo: "base" },
      { nombre: "Mini", slugModelo: "mini" },
    ],
  },
];

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

  // --- MENÚ MÓVIL ---
  const mobileLinks = (
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
        href="/creadores"
        className={linkStyle("/creadores")}
        onClick={() => setMenuOpen(false)}
      >
        Guia creadores
      </Link>
      <Link
        href="/contacto"
        className={linkStyle("/contacto")}
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
          <FaShoppingCart size={24} className="text-[#05467D]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#333] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
          className="text-sm text-red-600 hover:underline ml-2 text-left px-3"
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
    <nav className="p-4 border-b shadow-sm bg-white relative">
      <div className="flex justify-between items-center">
        {/* LOGO */}
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
            src="/iso3.svg"
            alt="Logo"
            width={40}
            height={40}
            className="md:hidden"
          />
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className={linkStyle("/")}>
            Inicio
          </Link>

          {/* DROPDOWN DINÁMICO */}
          <DropdownItem
            title={
              <Link href="/products" className={linkStyle("/products")}>
                Productos
              </Link>
            }
          >
            {/* AQUÍ ESTÁ EL CAMBIO CLAVE:
                1. grid grid-cols-2: Divide en dos columnas.
                2. min-w-[600px]: Fuerza el ancho para ocupar espacio.
                3. gap-x-12: Separa las columnas horizontalmente.
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 min-w-[300px] lg:min-w-[600px] px-2 py-2">
              {menuItems.map((familia) => (
                <div key={familia.slugFamilia} className="group">
                  <div className="flex flex-wrap items-center gap-x-2 text-sm text-[#05467D]">
                    {/* 1. Link a la Familia (NEGRITA) */}
                    <Link
                      href={`/products?familia=${familia.slugFamilia}`}
                      className="font-bold uppercase hover:text-blue-600 tracking-wide whitespace-nowrap"
                    >
                      {familia.titulo}
                    </Link>

                    {/* Separador visual inicial */}
                    {familia.variantes.length > 0 && (
                      <span className="text-gray-300 font-light">/</span>
                    )}

                    {/* 2. Links a Variantes (LIGHT) */}
                    {familia.variantes.map((variante, idx) => (
                      <div
                        key={variante.slugModelo}
                        className="flex items-center gap-2"
                      >
                        <Link
                          href={`/products?familia=${familia.slugFamilia}&modelo=${variante.slugModelo}`}
                          className="font-light hover:font-bold hover:text-blue-600 transition-all whitespace-nowrap"
                        >
                          {variante.nombre}
                        </Link>
                        {/* Separador entre variantes (menos en la última) */}
                        {idx < familia.variantes.length - 1 && (
                          <span className="text-gray-300 font-light">/</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Separador y "Ver todos" */}
            <div className="border-t mt-4 pt-3">
              <Link
                href="/products"
                className="block -mx-4 px-4 py-1 text-center font-semibold text-[#05467D] hover:bg-gray-50 text-sm"
              >
                Ver todo el catálogo completo &rarr;
              </Link>
            </div>
          </DropdownItem>
          {/* --- FIN DROPDOWN --- */}

          <Link href="/creadores" className={linkStyle("/creadores")}>
            Guia creadores
          </Link>
          <Link href="/contacto" className={linkStyle("/contacto")}>
            Contacto
          </Link>

          {/* Links de usuario y carrito */}
          <Link href="/cart" className="relative px-3 py-2">
            <div className="relative inline-block">
              <FaShoppingCart size={24} className="text-[#05467D]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#333] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {isLoggedIn && (
            <Link href="/account" className={linkStyle("/account")}>
              <FaUserCircle className="inline mr-1" /> Mi cuenta
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" className={linkStyle("/admin")}>
              Panel Admin
            </Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={() => logout()}
              className="text-sm text-red-600 hover:underline ml-2"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link href="/login" className={linkStyle("/login")}>
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* TOGGLE MÓVIL */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuOpen && (
        <div className="flex flex-col gap-2 mt-3 md:hidden px-2 pb-2">
          {mobileLinks}
        </div>
      )}
    </nav>
  );
}
