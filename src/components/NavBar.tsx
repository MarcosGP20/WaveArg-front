"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  UserCircle,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/store/useAuthStore";
import DropdownItem from "./DropdownItem";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { etiquetaBotonCarrito } from "@/lib/carrito";
import { formatearPrecio } from "@/lib/precio";

// Panel de "Productos": sólo filtros que el catálogo entiende (?estado=), nada de modelos
// escritos a mano que pueden no estar en stock.
const PANEL_PRODUCTOS = [
  {
    titulo: "iPhone",
    links: [
      { label: "Todos los iPhone", href: "/products" },
      { label: "Nuevos sellados", href: "/products?estado=nuevo" },
      { label: "Usados", href: "/products?estado=usado" },
    ],
  },
  {
    titulo: "Accesorios",
    links: [
      { label: "Todos los accesorios", href: "/accesorios" },
      { label: "Comparar iPhone", href: "/compare" },
    ],
  },
];

const LINKS = [
  { label: "Guía creadores", href: "/creadores" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartHoverOpen, setCartHoverOpen] = useState(false);
  const cartCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { cart, removeFromCart, openCart } = useCart();
  const { user, logout, isLoggedIn } = useAuthStore();

  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    // Espera a que el estado se hidrate
    setIsLoading(false);

    handleScroll(); // set initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Menú móvil: Escape lo cierra y devuelve el foco al botón (front#10).
  const toggleMovilRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      toggleMovilRef.current?.focus();
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [menuOpen]);

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

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // En la home, antes de scrollear, la barra va sobre el video: texto y logo blancos. En el resto
  // (o al scrollear) fondo blanco con los colores del sistema (DESIGN.md).
  const isTransparent = isHome && !scrolled && !menuOpen;

  const esActivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Activo: texto pleno + una línea fina debajo. Sin píldoras de fondo.
  const linkStyle = (href: string) =>
    `relative px-3 py-2 text-[15px] transition-colors duration-200 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-[2px] after:rounded-full ${
      isTransparent
        ? esActivo(href) ? "text-white after:bg-white" : "text-white/80 hover:text-white after:bg-transparent"
        : esActivo(href) ? "text-tinta font-medium after:bg-color-principal" : "text-tinta-suave hover:text-tinta after:bg-transparent"
    }`;

  const iconoColor = isTransparent ? "text-white" : "text-tinta";

  const itemMenuUsuario =
    "px-4 py-2.5 text-sm text-tinta outline-none transition flex items-center gap-2 data-[highlighted]:bg-superficie";

  const itemPanel =
    "-mx-2 block rounded-md px-2 py-1.5 text-[15px] text-tinta transition-colors hover:bg-superficie";

  // --- MENÚ MÓVIL: panel blanco, siempre legible ---
  const linkMovil = (href: string) =>
    `block rounded-control px-3 py-3 text-base transition-colors hover:bg-superficie ${
      esActivo(href) ? "font-semibold text-color-principal" : "text-tinta"
    }`;

  const mobileLinks = (
    <>
      {[{ label: "Inicio", href: "/" }, { label: "iPhone", href: "/products" }, { label: "Accesorios", href: "/accesorios" }, ...LINKS].map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={esActivo(l.href) ? "page" : undefined}
          className={linkMovil(l.href)}
          onClick={() => setMenuOpen(false)}
        >
          {l.label}
        </Link>
      ))}

      <div className="my-1 border-t border-borde" />

      <button
        type="button"
        onClick={() => { openCart(); setMenuOpen(false); }}
        className="flex items-center gap-3 rounded-control px-3 py-3 text-left text-base text-tinta hover:bg-superficie"
      >
        <ShoppingCart size={20} strokeWidth={1.75} aria-hidden="true" />
        Carrito{cartCount > 0 ? ` (${cartCount})` : ""}
      </button>

      {!isLoading && isLoggedIn && user ? (
        <>
          <Link href="/account/profile" className={linkMovil("/account/profile")} onClick={() => setMenuOpen(false)}>
            Mi cuenta
          </Link>
          <button
            type="button"
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            className="rounded-control px-3 py-3 text-left text-base text-red-700 hover:bg-superficie"
          >
            Cerrar sesión
          </button>
        </>
      ) : !isLoading ? (
        <Link href="/login" className={linkMovil("/login")} onClick={() => setMenuOpen(false)}>
          Iniciar sesión
        </Link>
      ) : null}
    </>
  );

  return (
    <nav
      aria-label="Principal"
      // En la home va fixed, encima del video de portada (transparente hasta scrollear); en el
      // resto, sticky en el flujo. Sticky en la home la dejaba arriba del hero, blanca sobre blanco.
      className={`top-0 z-50 transition-colors duration-300 ${isHome ? "fixed inset-x-0" : "sticky"} ${
        isTransparent
          // Velo oscuro arriba: el video puede tener zonas claras y el texto blanco tiene que leerse.
          ? "bg-gradient-to-b from-black/55 to-transparent"
          : "bg-white/90 backdrop-blur-xl border-b border-borde"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* LOGO: un solo link; cada tamaño muestra su imagen. Sobre el video se pinta blanco. */}
        <Link href="/" aria-label="Wave Arg – ir al inicio" className="flex items-center">
          <Image
            src="/waves5.svg"
            alt=""
            width={112}
            height={28}
            className={`hidden md:block transition-[filter] duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
            priority
          />
          <Image
            src="/iso3.svg"
            alt=""
            width={32}
            height={32}
            className={`md:hidden size-8 transition-[filter] duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
          />
        </Link>

        {/* --- DESKTOP --- */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/" aria-current={esActivo("/") ? "page" : undefined} className={linkStyle("/")}>
            Inicio
          </Link>

          <DropdownItem title="Productos" href="/products" linkClassName={linkStyle("/products")} transparent={isTransparent}>
            <div className="grid grid-cols-2 gap-6">
              {PANEL_PRODUCTOS.map((grupo) => (
                <div key={grupo.titulo}>
                  <p className="mb-2 text-[13px] text-tinta-suave">{grupo.titulo}</p>
                  <ul className="space-y-0.5">
                    {grupo.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={itemPanel}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </DropdownItem>

          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={esActivo(l.href) ? "page" : undefined} className={linkStyle(l.href)}>
              {l.label}
            </Link>
          ))}

          <div className="ml-3 flex items-center gap-1">
            {/* Carrito — preview al pasar el mouse; el click (o Enter) abre el drawer, que tiene lo
                mismo y es accesible con teclado, así que el preview no se abre con foco (front#10). */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (cartCloseTimer.current) clearTimeout(cartCloseTimer.current);
                setCartHoverOpen(true);
              }}
              onMouseLeave={() => {
                cartCloseTimer.current = setTimeout(() => setCartHoverOpen(false), 120);
              }}
            >
              <button
                type="button"
                onClick={openCart}
                className={`relative grid size-11 place-items-center rounded-full transition-colors ${iconoColor}`}
                aria-label={etiquetaBotonCarrito(cartCount)}
              >
                <ShoppingCart
                  size={21}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={cartBump ? "animate-cartBump" : ""}
                />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    aria-hidden="true"
                    className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-color-principal px-1 text-[11px] font-semibold text-white animate-badgePop"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {cartHoverOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-panel border border-borde bg-white text-tinta shadow-xl shadow-black/5 animate-fadeDown"
                  onMouseEnter={() => {
                    if (cartCloseTimer.current) clearTimeout(cartCloseTimer.current);
                  }}
                  onMouseLeave={() => {
                    cartCloseTimer.current = setTimeout(() => setCartHoverOpen(false), 120);
                  }}
                >
                  <div className="flex items-center justify-between border-b border-borde px-4 py-3">
                    <span className="text-sm font-semibold">Tu carrito</span>
                    <span className="text-[13px] text-tinta-suave">
                      {cartCount} {cartCount === 1 ? "producto" : "productos"}
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-tinta-suave">
                      Tu carrito está vacío
                    </div>
                  ) : (
                    <>
                      <ul className="max-h-64 divide-y divide-borde overflow-y-auto">
                        {cart.map((item) => (
                          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                            <div className="relative size-11 flex-shrink-0 overflow-hidden rounded-control bg-superficie">
                              {item.image && (
                                <Image src={item.image} alt="" fill sizes="44px" className="object-contain p-1 mix-blend-multiply" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{item.name}</p>
                              <p className="mt-0.5 text-xs text-tinta-suave">Cantidad: {item.quantity}</p>
                            </div>
                            <span className="whitespace-nowrap text-sm font-semibold tabular-nums">
                              {formatearPrecio(item.price * item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Eliminar ${item.name} del carrito`}
                              className="grid size-7 flex-shrink-0 place-items-center rounded-full text-tinta-suave transition-colors hover:bg-superficie hover:text-tinta"
                            >
                              <X size={14} strokeWidth={1.75} aria-hidden="true" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-borde bg-superficie px-4 py-3">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm text-tinta-suave">Subtotal</span>
                          <span className="text-base font-semibold tabular-nums">
                            {formatearPrecio(cart.reduce((sum, i) => sum + i.price * i.quantity, 0))}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { openCart(); setCartHoverOpen(false); }}
                          className="block min-h-11 w-full rounded-control bg-color-principal text-sm font-semibold text-white transition-colors hover:bg-color-principal-oscuro"
                        >
                          Ver carrito
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cuenta — Radix (front#10): aria-expanded/aria-haspopup, flechas, Escape y click afuera. */}
            {!isLoading && isLoggedIn && user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger
                  className={`flex min-h-11 items-center gap-2 rounded-full px-3 text-[15px] transition-colors ${
                    isTransparent ? "text-white/80 hover:text-white" : "text-tinta-suave hover:text-tinta"
                  }`}
                >
                  <UserCircle size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span>{user.email?.split("@")[0]}</span>
                  <span className="sr-only">, menú de cuenta</span>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 w-56 rounded-panel border border-borde bg-white py-2 shadow-xl shadow-black/5 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                  >
                    <DropdownMenu.Label className="border-b border-borde px-4 pb-2.5 pt-1">
                      <span className="block truncate text-sm font-semibold text-tinta">{user.email}</span>
                      {user.rol?.toLowerCase() === "admin" && (
                        <span className="text-xs text-tinta-suave">Administrador</span>
                      )}
                    </DropdownMenu.Label>

                    <DropdownMenu.Item asChild className={itemMenuUsuario}>
                      <Link href="/account/profile">
                        <UserCircle size={16} strokeWidth={1.75} aria-hidden="true" /> Mi cuenta
                      </Link>
                    </DropdownMenu.Item>

                    {user.rol?.toLowerCase() === "admin" && (
                      <DropdownMenu.Item asChild className={itemMenuUsuario}>
                        <Link href="/admin">
                          <Settings size={16} strokeWidth={1.75} aria-hidden="true" /> Panel admin
                        </Link>
                      </DropdownMenu.Item>
                    )}

                    <DropdownMenu.Item
                      onSelect={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-red-700 outline-none transition data-[highlighted]:bg-red-50"
                    >
                      <LogOut size={16} strokeWidth={1.75} aria-hidden="true" /> Cerrar sesión
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : !isLoading ? (
              <Link href="/login" aria-current={esActivo("/login") ? "page" : undefined} className={linkStyle("/login")}>
                Iniciar sesión
              </Link>
            ) : null}
          </div>
        </div>

        {/* TOGGLE MÓVIL */}
        <button
          ref={toggleMovilRef}
          type="button"
          className={`grid size-11 place-items-center md:hidden transition-colors duration-200 ${iconoColor}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Menú de navegación"
        >
          {menuOpen ? <X size={24} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={24} strokeWidth={1.75} aria-hidden="true" />}
        </button>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuOpen && (
        <div id="mobile-menu" className="px-4 pb-4 md:hidden">
          <div className="flex flex-col rounded-panel border border-borde bg-white p-2 shadow-xl shadow-black/5 animate-slideDown motion-reduce:animate-none">
            {mobileLinks}
          </div>
        </div>
      )}
    </nav>
  );
}
