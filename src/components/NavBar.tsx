"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/store/useAuthStore";
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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { cart } = useCart();
  const { user, token, logout, isLoggedIn } = useAuthStore();

  useEffect(() => {
    // Espera a que el estado se hidrate
    setIsLoading(false);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push("/");
  };

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

      {!isLoading && isLoggedIn && user ? (
        <Link
          href="/account/profile"
          className={linkStyle("/account/profile")}
          onClick={() => setMenuOpen(false)}
        >
          <FaUserCircle className="inline mr-1" /> Mi cuenta
        </Link>
      ) : null}
      {!isLoading && isLoggedIn ? (
        <button
          onClick={() => {
            handleLogout();
            setMenuOpen(false);
          }}
          className="text-sm text-red-600 hover:underline ml-2 text-left px-3"
        >
          Cerrar sesión
        </button>
      ) : !isLoading ? (
        <Link
          href="/login"
          className={linkStyle("/login")}
          onClick={() => setMenuOpen(false)}
        >
          Iniciar sesión
        </Link>
      ) : null}
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
          <Link href="/nosotros" className={linkStyle("/nosotros")}>
            Nosotros
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

          {/* USER DROPDOWN */}
          {!isLoading && isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition text-[#05467D] font-medium"
              >
                <FaUserCircle size={20} />
                <span className="text-sm">{user.email?.split("@")[0]}</span>
              </button>

              {/* DROPDOWN MENU */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Cuenta
                    </p>
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Rol:{" "}
                      <span className="font-medium uppercase">
                        {user.rol || "Usuario"}
                      </span>
                    </p>
                  </div>

                  <Link
                    href="/account/profile"
                    className="block px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 transition flex items-center gap-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <FaUserCircle size={16} /> Mi Perfil
                  </Link>

                  {user.rol === "Admin" && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 transition flex items-center gap-2"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FaCog size={16} /> Panel Admin
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 transition flex items-center gap-2"
                  >
                    <FaSignOutAlt size={16} /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : !isLoading ? (
            <Link href="/login" className={linkStyle("/login")}>
              Iniciar sesión
            </Link>
          ) : null}
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
