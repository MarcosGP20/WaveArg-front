"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
// ¡Importamos nuestro componente!
import DropdownItem from "./DropdownItem";

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

  // -----------------------------------------------------------------
  // CAMBIO AQUÍ:
  // Este 'links' ahora es SÓLO para el menú MÓVIL.
  // Le quité "Productos" porque no queremos el dropdown de hover en móvil.
  // -----------------------------------------------------------------
  const mobileLinks = (
    <>
      <Link
        href="/"
        className={linkStyle("/")}
        onClick={() => setMenuOpen(false)}
      >
        Inicio
      </Link>

      {/* Le quitamos el "Productos" de aquí. 
        En móvil, podemos añadir un link simple a /products, 
        o en el futuro crear un dropdown de CLICK.
      */}
      <Link
        href="/products"
        className={linkStyle("/products")}
        onClick={() => setMenuOpen(false)}
      >
        Productos
      </Link>

      <Link
        href="/creadores "
        className={linkStyle("/mayorista")} // Ojo, este href parece estar mal copiado
        onClick={() => setMenuOpen(false)}
      >
        Guia creadores
      </Link>
      <Link
        href="/contacto "
        className={linkStyle("/mayorista")} // Ojo, este href parece estar mal copiado
        onClick={() => setMenuOpen(false)}
      >
        Contacto
      </Link>

      <Link
        href="/cart"
        className="relative px-3 py-2"
        onClick={() => setMenuOpen(false)}
      >
        {/* ... (tu JSX de carrito) ... */}
        <div className="relative inline-block">
          <FaShoppingCart size={24} className="text-[#05467D]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#333] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </Link>

      {/* ... (todo tu JSX de auth, login, logout, etc.) ... */}
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
    <nav className="p-4 border-b shadow-sm bg-white relative  ">
      <div className="flex justify-between items-center">
        {/* ... (Tus logos de Image) ... */}
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

        {/* ----------------------------------------------------------------- */}
        {/* CAMBIO GRANDE AQUÍ: Este es el menú DESKTOP explícito */}
        {/* Ya no usa la variable 'links', sino que define los suyos. */}
        {/* ----------------------------------------------------------------- */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className={linkStyle("/")}>
            Inicio
          </Link>

          <DropdownItem
            title={
              <Link href="/products" className={linkStyle("/products")}>
                Productos
              </Link>
            }
          >
            {/* Título de la sección dentro del dropdown */}
            <span className="text-sm font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">
              Explorar por Modelo
            </span>

            {/* CONTENEDOR TIPO GRILLA (Para llenar mejor el espacio) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {/* Lista de Modelos */}
              <Link
                href="/products?category=iphone-15" // O la ruta que uses
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                iPhone 15 Pro Max
              </Link>

              <Link
                href="/products?category=iphone-15"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                iPhone 15 Pro
              </Link>

              <Link
                href="/products?category=iphone-15"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                iPhone 15
              </Link>

              <Link
                href="/products?category=iphone-14"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                iPhone 14
              </Link>

              <Link
                href="/products?category=iphone-13"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                iPhone 13
              </Link>

              <Link
                href="/products?category=iphone-11"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                iPhone 11 / SE
              </Link>
            </div>

            {/* Separador y "Ver todos" */}
            <div className="border-t mt-4 pt-3">
              <Link
                href="/products"
                // Aquí aplicamos el truco del margen negativo para que el hover ocupe todo el ancho de abajo
                className="block -mx-4 px-4 py-3 text-center font-semibold text-[#05467D] hover:bg-gray-50 rounded-b-md"
              >
                Ver todo el catálogo &rarr;
              </Link>
            </div>
          </DropdownItem>
          {/* --- FIN DEL DROPDOWN --- */}
          <Link href="/creadores " className={linkStyle("/mayorista")}>
            Guia creadores
          </Link>
          <Link href="/contacto " className={linkStyle("/mayorista")}>
            Contacto
          </Link>
          {/* Copiamos los otros links de auth/cart aquí también */}
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

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* CAMBIO AQUÍ: El menú móvil ahora usa 'mobileLinks' */}
      {/* ----------------------------------------------------------------- */}
      {menuOpen && (
        <div className="flex flex-col gap-2 mt-3 md:hidden">{mobileLinks}</div>
      )}
    </nav>
  );
}
