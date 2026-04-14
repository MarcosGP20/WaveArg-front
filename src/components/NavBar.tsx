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
import { useState, useEffect, useRef } from "react";
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
  const [cartHoverOpen, setCartHoverOpen] = useState(false);
  const cartCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { cart, removeFromCart } = useCart();
  const { user, token, logout, isLoggedIn } = useAuthStore();

  useEffect(() => {
    // Espera a que el estado se hidrate
    setIsLoading(false);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [cartBump, setCartBump] = useState(false);
  const prevCartCountRef = useRef(0);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 350);
      prevCartCountRef.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push("/");
  };

  const linkStyle = (href: string) =>
    `px-3 py-2 rounded-full hover:bg-gray-200 transition text-color-principal ${
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
          <FaShoppingCart
            size={24}
            className={`text-color-principal transition-transform ${cartBump ? "animate-cartBump" : ""}`}
          />
          {cartCount > 0 && (
            <span
              key={cartCount}
              className="absolute -top-1 -right-1 bg-[#333] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-badgePop"
            >
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
            alt="Wave Arg – ir al inicio"
            width={120}
            height={120}
            className="hidden md:block"
            priority
          />
        </Link>
        <Link href="/">
          <Image
            src="/iso3.svg"
            alt="Wave Arg – ir al inicio"
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
          <DropdownItem title="Productos" href="/products">
            {/* AQUÍ ESTÁ EL CAMBIO CLAVE:
                1. grid grid-cols-2: Divide en dos columnas.
                2. min-w-[600px]: Fuerza el ancho para ocupar espacio.
                3. gap-x-12: Separa las columnas horizontalmente.
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 min-w-[300px] lg:min-w-[600px] px-2 py-2">
              {menuItems.map((familia) => (
                <div key={familia.slugFamilia} className="group">
                  <div className="flex flex-wrap items-center gap-x-2 text-sm text-color-principal">
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
                className="block -mx-4 px-4 py-1 text-center font-semibold text-color-principal hover:bg-gray-50 text-sm"
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

          {/* Links de usuario y carrito — con hover dropdown */}
          <div
            className="relative px-3 py-2"
            onMouseEnter={() => {
              if (cartCloseTimer.current) clearTimeout(cartCloseTimer.current);
              setCartHoverOpen(true);
            }}
            onMouseLeave={() => {
              cartCloseTimer.current = setTimeout(() => setCartHoverOpen(false), 120);
            }}
            onFocus={() => {
              if (cartCloseTimer.current) clearTimeout(cartCloseTimer.current);
              setCartHoverOpen(true);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setCartHoverOpen(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setCartHoverOpen(false);
            }}
          >
            <Link href="/cart" className="relative inline-block">
              <FaShoppingCart
                size={24}
                className={`text-color-principal transition-transform ${cartBump ? "animate-cartBump" : ""}`}
              />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-1 -right-1 bg-[#333] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-badgePop"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* CART HOVER DROPDOWN */}
            {cartHoverOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeDown"
                onMouseEnter={() => {
                  if (cartCloseTimer.current) clearTimeout(cartCloseTimer.current);
                }}
                onMouseLeave={() => {
                  cartCloseTimer.current = setTimeout(() => setCartHoverOpen(false), 120);
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-color-principal">
                  <span className="text-white font-semibold text-sm tracking-wide">
                    🛒 Mi Carrito
                  </span>
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Product list */}
                {cart.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm">
                    <FaShoppingCart size={28} className="mx-auto mb-2 opacity-30" />
                    Tu carrito está vacío
                  </div>
                ) : (
                  <>
                    <ul className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {cart.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          {/* Imagen o placeholder */}
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-11 h-11 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <FaShoppingCart size={16} className="text-color-principal opacity-50" />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Cant: <span className="font-semibold text-gray-600">{item.quantity}</span>
                            </p>
                          </div>

                          {/* Precio */}
                          <span className="text-sm font-bold text-color-principal whitespace-nowrap">
                            ${(item.price * item.quantity).toLocaleString("es-AR")}
                          </span>

                          {/* Botón eliminar */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            title="Eliminar del carrito"
                            className="ml-1 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors text-base leading-none"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Footer con subtotal + botón */}
                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Subtotal</span>
                        <span className="text-base font-bold text-gray-900">
                          ${cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString("es-AR")}
                        </span>
                      </div>
                      <Link
                        href="/cart"
                        className="block w-full text-center bg-color-principal hover:bg-color-principal-oscuro text-white text-sm font-semibold py-2 rounded-full transition-colors"
                      >
                        Ver carrito completo →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* USER DROPDOWN */}
          {!isLoading && isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition text-color-principal font-medium"
              >
                <FaUserCircle size={20} />
                <span className="text-sm">{user.email?.split("@")[0]}</span>
              </button>

              {/* DROPDOWN MENU */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50 animate-scaleIn origin-top-right">
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
                    className=" px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 transition flex items-center gap-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <FaUserCircle size={16} /> Mi Perfil
                  </Link>

                  {user.rol === "Admin" && (
                    <Link
                      href="/admin"
                      className=" px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 transition flex items-center gap-2"
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
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Menú de navegación"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuOpen && (
        <div id="mobile-menu" className="flex flex-col gap-2 mt-3 md:hidden px-2 pb-2 animate-slideDown">
          {mobileLinks}
        </div>
      )}
    </nav>
  );
}
