"use client";

import { usePathname } from "next/navigation";
import Mantenimiento from "@/components/Mantenimiento";
import { useEstado } from "@/context/EstadoContext";

// Rutas que siguen andando en mantenimiento: el panel (y el login para entrar) y la vuelta de
// MercadoPago, que es el único lugar donde se vacía el carrito después de pagar.
export function pasaEnMantenimiento(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/login" ||
    pathname === "/checkout/success"
  );
}

export default function PuertaMantenimiento({ children }: { children: React.ReactNode }) {
  const { mantenimiento } = useEstado();
  const pathname = usePathname();

  if (mantenimiento && !pasaEnMantenimiento(pathname)) return <Mantenimiento />;
  return <>{children}</>;
}
